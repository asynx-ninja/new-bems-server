const mongoose = require("mongoose");
const EventsApplication = require("./event_applications.model");
const BrgyInfo = require("../brgy_info/brgy_info.model");
const GenerateID = require("../../global/functions/GenerateID");

const {
  CreateFolder,
  UploadFiles,
} = require("../../global/utils/Drive");

const GetAllAppli = async (req, res) => {
  try {
    const { brgy, archived, status, title } = req.query;

    let query = {
      $and: [{ isArchived: archived }, { brgy: brgy }],
    };

    if (status && status.toLowerCase() !== "all") {
      query.status = status;
    }

    if (title && title.toLowerCase() !== "all") {
      query.$and.push({ event_name: title });
    }

    const result = await EventsApplication.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length, // Total count without pagination
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const GetUserAppli = async (req, res) => {
  try {
    const { user_id, event_name, archived } = req.query;

    let query = {
      $and: [{ isArchived: archived }, { "form.user_id.value": user_id }],
    };

    if (event_name && event_name.toLowerCase() !== "all") {
      query.$and.push({ event_name: event_name });
    }

    const result = await EventsApplication.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length, // Total count without pagination
    });
  } catch (error) {
    console.log(error);
  }
};

const ApprovedAppli = async (req, res) => {
  try {
    const { brgy, event_id } = req.query;

    const completedCount = await EventsApplication.countDocuments({
      $and: [
        { brgy: brgy, event_id: event_id, status: "Approved" },
      ],
    });

    res.status(200).json({ completedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetForReviewAppli = async (req, res) => {
  try {
    const { isArchived, page, brgy } = req.query;
    const itemsPerPage = 5; // Number of items per page
    const skip = (parseInt(page) || 0) * itemsPerPage;

    const query = {
      brgy,
      isArchived: isArchived,
      status: "For Review",
    };

    const totalEventsApplication = await EventsApplication.countDocuments(
      query
    );
    const result = await EventsApplication.find(query)
      .skip(skip)
      .limit(itemsPerPage);

    if (result.length === 0) {
      return res.status(400).json({ error: "No services found." });
    }

    return res.status(200).json({
      result,
      pageCount: Math.ceil(totalEventsApplication / itemsPerPage),
      total: totalEventsApplication,
    });
  } catch (err) {
    res.send(err.message);
  }
};

const CountForReviewAppli = async (req, res) => {
  try {
    const { isArchived, brgy } = req.query;
    const query = {
      brgy,
      isArchived: isArchived,
      status: "For Review",
    };
    const result = await EventsApplication.find(query);

    if (result.length === 0) {
      return res.status(400).json({ error: "No services found." });
    }
    return res.status(200).json({ result });
  } catch (err) {
    res.send(err.message);
  }
};

const CreateEventsAppli = async (req, res) => {
  try {
    const { app_folder_id, brgy, form_id } = req.query;
    const {  files } = req;
    // const newBody = JSON.parse(body.form);
    const {body} = req.body;

    const increment = await EventsApplication.countDocuments({}).exec()
    const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

    const index = brgys.findIndex((item) => item.brgy === brgy.toUpperCase());

    const appli_id = GenerateID(index + 1, "applications", increment + 1);
    const folder_id = await CreateFolder(appli_id, app_folder_id);
    
    let fileArray = [];

    if (files) {
      for (let f = 0; f < files.length; f += 1) {
        const { id, name } = await UploadFiles(files[f], folder_id);

        fileArray.push({
          link: files[f].mimetype.includes("image")
            ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
            : `https://drive.google.com/file/d/${id}/view`,
          id,
          name,
        });
      }
    }

    const result = await EventsApplication.create({
      event_form: form_id,
      application_id: appli_id,
      form: body,
      files: fileArray.length > 0 ? fileArray : [],
      status: "For Review",
      isArchived: false,
      folder_id: folder_id,
    });

    return res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const ReplyToAppli = async (req, res) => {
  try {
    const { app_id, user_type } = req.query;
    const { body, files } = req;

    const {
      sender,
      message,
      status,
      date,
      folder_id,
      last_sender,
      last_array,
    } = JSON.parse(body.response);

    let fileArray = [];

    if (!mongoose.Types.ObjectId.isValid(app_id)) {
      return res.status(400).json({ error: "No such event application" });
    }

    if (files) {
      for (let f = 0; f < files.length; f++) {
        const { id, name } = await uploadFolderFiles(files[f], folder_id);

        fileArray.push({
          link: files[f].mimetype.includes("image")
            ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
            : `https://drive.google.com/file/d/${id}/view`,
          id,
          name,
        });
      }
    }

    if (user_type && last_array > 0) {
      await EventsApplication.findByIdAndUpdate(
        { _id: app_id },
        {
          $set: {
            [`response.${last_array}`]: {
              sender: last_sender.sender,
              message: last_sender.message,
              date: last_sender.date,
              file: last_sender.file,
            },
          },
        }
      );
    }

    const result = await EventsApplication.findByIdAndUpdate(
      { _id: app_id },
      {
        $push: {
          response: {
            sender: sender,
            message: message,
            date: date,
            file: fileArray.length > 0 ? fileArray : null,
          },
        },
        $set: {
          status: status,
        },
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const ArchiveAppli= async (req, res) => {
  try {
    const { id, archived } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such official" });
    }

    const result = await EventsApplication.findOneAndUpdate(
      { _id: id },
      { $set: { isArchived: archived } },
      { returnOriginal: false, upsert: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const CancelAppli = async (req, res) => {
  try {
    const { application_id, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(application_id)) {
      return res.status(400).json({ error: "No such event" });
    }

    const result = await EventsApplication.findByIdAndUpdate(
      { _id: application_id },
      {
        $set: {
          status: status,
        },
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  GetAllAppli,
  GetUserAppli,
  ApprovedAppli,
  GetForReviewAppli,
  CountForReviewAppli,
  CreateEventsAppli,
  ReplyToAppli,
  ArchiveAppli,
  CancelAppli,
};