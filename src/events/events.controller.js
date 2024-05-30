const mongoose = require("mongoose");
const Events = require("./events.model");
const BrgyInfo = require("../brgy_info/brgy_info.model");
const CompareArrays = require("../../global/functions/CompareArrays");
const GenerateID = require("../../global/functions/GenerateID");
const { UploadFiles, CreateFolder, DeleteFiles } = require("../../global/utils/Drive");


const GetBarangayEvents = async (req, res) => {
  try {
    const { brgy, isArchived } = req.query;
    let query = {
      brgy: brgy,
      ...(isArchived !== undefined && { isArchived: isArchived }),
    };

    const result = await Events.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length,
    });
  } catch (err) {
    res.send(err.message);
  }
};

const GetAllOpenBrgyEvents = async (req, res) => {
  try {
    const { brgy } = req.query;

    const query = {
      $and: [
        { isArchived: false },
        { $or: [{ brgy: brgy }, { isOpen: true }] },
      ],
    };

    const result = await Events.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length, // Total count without pagination
    });
  } catch (err) {
    res.send(err.message);
  }
};

const CreateEvents = async (req, res) => {
  try {
    const { event_folder_id } = req.query;
    const { body, files } = req;
    const { event_name, details, date, end_reg_date, brgy, isOpen } = JSON.parse(body.events); // Added end_reg_date here

    let fileArray = [];
    const increment = await Events.countDocuments({}).exec();
    const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

    const index = brgys.findIndex((item) => item.brgy === brgy) + 1;
    const event_id = GenerateID(index + 1, "events", increment + 1);
    const folder_id = await CreateFolder(event_id, event_folder_id);

    for (let f = 0; f < files.length; f += 1) {
      const { id, name } = await UploadFiles(files[f], folder_id);

      fileArray.push({
        link:
          f === 0 || f === 1
            ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
            : `https://drive.google.com/file/d/${id}/view`,
        id,
        name,
      });
    }

    const [banner, logo, ...remainingFiles] = fileArray;
    const bannerObject = { ...banner };
    const logoObject = { ...logo };

    const result = await Events.create({
      event_id,
      event_name,
      details,
      event_date: date, 
      end_reg_date, 
      brgy,
      collections: {
        folder_id,
        banner: bannerObject,
        logo: logoObject,
        file: remainingFiles,
      },
      isOpen,
      attendees: [],
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const UpdateEvent = async (req, res) => {
  try {
    const { id } = req.query;
    let { body, files } = req;
    let currentFiles = [];
    body = JSON.parse(JSON.stringify(req.body));
    let { saved, event } = body;
    let banner = null,
      logo = null;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No event" });
    }

    // Check if the currentFiles uploaded in this function backend is not empty
    // Meaning, there are files in the frontend
    if (saved !== undefined) {
      if (typeof body.saved === "object") {
        for (const item of saved) {
          const parsed = JSON.parse(item);
          currentFiles.push(parsed);
        }
      } else {
        const parsed = JSON.parse(saved);
        currentFiles.push(parsed);
      }
    }

    let fileArray = [...currentFiles];
    event = JSON.parse(body.event);
    const folder_id = event.collections.folder_id;
    const fullItem = event.collections.file;
    const toBeDeletedItems = CompareArrays(fullItem, currentFiles);

    toBeDeletedItems.forEach(async (item) => {
      await DeleteFiles(item.id, folder_id);
    });

    if (files) {
      for (let f = 0; f < files.length; f += 1) {
        const { id, name } = await UploadFiles(files[f], folder_id);

        if (files[f].originalname === "banner") {
          banner = {
            link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
            id,
            name,
          };

          await DeleteFiles(
            event.collections.banner.id,
            folder_id
          );
        } else if (files[f].originalname === "logo") {
          logo = {
            link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
            id,
            name,
          };

          await DeleteFiles(event.collections.logo.id, folder_id);
        } else {
          fileArray.push({
            link: `https://drive.google.com/file/d/${id}/view`,
            id,
            name,
          });
        }
      }
    }

    const result = await Events.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          event_name: event.event_name,
          details: event.details,
          date: event.date,
          collections: {
            folder_id,
            banner: banner === null ? event.collections.banner : banner,
            logo: logo === null ? event.collections.logo : logo,
            file: fileArray,
          },
          brgy: event.brgy,
          isOpen: event.isOpen,
        },
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const ArchiveEvents = async (req, res) => {
  try {
    const { id, isArchived } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such Events" });
    }

    const result = await Events.findOneAndUpdate(
      { _id: id },
      { $set: { isArchived: isArchived } },
      { returnOriginal: false, upsert: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const GetSpecificBarangayEvent = async (req, res) => {
  try {
    const { brgy, isArchived, event_id } = req.query;

    const result = await Events.findOne({
      $and: [{ brgy: brgy }, { isArchived: isArchived }, { event_id: event_id }],
    }).sort({ createdAt: -1 });

    return !result
      ? res
        .status(400)
        .json({ error: `No such Events for Barangay ${brgy} and Event ID ${event_id}` })
      : res.status(200).json({ result });
  } catch (err) {
    res.send(err.message);
  }
};

const getAllEvents = async (req, res) => {
  const { brgy } = req.query;

  const result = await Events.aggregate([
    // Unwind the "collections" array to access individual documents within it
    { $unwind: "$collections" },
    // Group by service name
    { $match: { isArchived: false, $or: [{ brgy: brgy }, { isOpen: true }] } },  // Replace "ROSARIO" with your desired Barangay
    // Group by service name and use $addToSet to get distinct values
    { $group: { _id: "$title" } },
    // Project only the "_id" field (which holds distinct service names)
    { $project: { _id: 1 } }
  ])

  res.status(200).json(result)
}

module.exports = { GetBarangayEvents, CreateEvents, GetAllOpenBrgyEvents, UpdateEvent, ArchiveEvents, GetSpecificBarangayEvent, getAllEvents};