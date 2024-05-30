const mongoose = require("mongoose");
const Officials = require("./officials.model");
const { UploadFiles, DeleteFiles } = require("../../global/utils/Drive");
const dotenv = require("dotenv");
dotenv.config();

const GetAllOfficials = async (req, res) => {
  try {
    const { area, isArchived, position } = req.query;

    // Initialize the query as an empty object
    const query = {};

    if (position && position.toLowerCase() !== "all") {
      query.position = position;
    }

    const result = await Officials.find({
      $and: [{ area: area }, { isArchived: isArchived }, query],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length, // Total count without pagination
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const CreateNewOfficial = async (req, res) => {
  try {
    const { area } = req.query;
    const { body, file } = req;
    const {
      firstName,
      lastName,
      middleName,
      suffix,
      details,
      position,
      fromYear,
      toYear,
    } = JSON.parse(body.official);

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { id, name } = await UploadFiles(file, process.env.MUNI_OFFICIAL);

    const picture = {
      link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
      id,
      name,
    };

    const result = await Officials.create({
      area,
      picture,
      firstName,
      lastName,
      middleName,
      suffix,
      details,
      position,
      fromYear,
      toYear,
    });

    return res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const UpdateOfficialInfo = async (req, res) => {
  try {
    const { doc_id } = req.query;
    const { body, file } = req;

    // Parse the official details from the request body
    const official = JSON.parse(body.official);
    const {
      picture,
      firstName,
      lastName,
      middleName,
      suffix,
      details,
      position,
      fromYear,
      toYear,
    } = official;

    let id = null,
      name = null;

    if (!mongoose.Types.ObjectId.isValid(doc_id)) {
      return res.status(400).json({ error: "No such official" });
    }

    if (file) {
      const obj = await UploadFiles(file, process.env.MUNI_OFFICIAL);
      id = obj.id;
      name = obj.name;

      if (picture.id !== "") {
        await DeleteFiles(picture.id, process.env.MUNI_OFFICIAL);
      }
    }

    const result = await Officials.findByIdAndUpdate(
      {
        _id: doc_id,
      },
      {
        $set: {
          firstName,
          lastName,
          middleName,
          suffix,
          details,
          position,
          fromYear,
          toYear,
          picture: file
            ? {
                id,
                name,
                link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
              }
            : picture,
        },
      },
      { new: true }
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const ArchiveOfficial = async (req, res) => {
  try {
    const { id, isArchived } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such official" });
    }

    const result = await Officials.findOneAndUpdate(
      { _id: id },
      { $set: { isArchived: isArchived } },
      { returnOriginal: false, upsert: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  GetAllOfficials,
  CreateNewOfficial,
  UpdateOfficialInfo,
  ArchiveOfficial,
};
