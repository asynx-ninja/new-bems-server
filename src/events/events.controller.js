const mongoose = require("mongoose");
const Events = require("./events.model");
const BrgyInfo = require("../brgy_info/brgy_info.model");
const compareArrays = require("../../global/functions/CompareArrays");
const GenerateID = require("../../global/functions/GenerateID");
const { UploadFiles, CreateFolder, DeleteFiles } = require("../../global/utils/Drive");
const eventsModel = require("./events.model");

const GetBarangayEvents = async (req, res) => {
  try {
    const { brgy, archived } = req.query;
    let query = {
      brgy: brgy,
      ...(archived !== undefined && { isArchived: archived }),
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

const SearchBarangayEvents = async (req, res) => {
  try {
    const { brgy, archived } = req.query;

    let query = {
      brgy: brgy,
      ...(archived !== undefined && { isArchived: archived }),
    };

    const result = await Events.find(query)

    return !result
      ? res
        .status(400)
        .json({ error: `No such Events for Barangay ${brgy}` })
      : res.status(200).json({ result });
  } catch (err) {
    res.send(err.message);
  }
};

const CreateEvents = async (req, res) => {
  try {
    const { event_folder_id } = req.query;
    const { body, files } = req;
    const { title, details, date, end_reg_date, brgy, isOpen } = JSON.parse(body.events); // Added end_reg_date here

    let fileArray = [];
    const increment = await Events.countDocuments({}).exec();
    const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

    const index = brgys.findIndex((item) => item.brgy === brgy) + 1;
    const event_id = GenerateID(index, "events", increment);
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
      title,
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


module.exports = { GetBarangayEvents, CreateEvents, SearchBarangayEvents };