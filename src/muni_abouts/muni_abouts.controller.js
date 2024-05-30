const mongoose = require("mongoose");
const MunicipalAbouts = require("./muni_abouts.model");
const { UploadFiles, DeleteFiles } = require("../../global/utils/Drive");
const dotenv = require('dotenv');
dotenv.config();

const GetAboutusInformation = async (req, res) => {
    try {
      const { isArchived } = req.query;
  
      const result = await MunicipalAbouts.find({
        $and: [{ isArchived: isArchived }],
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

  const AddAboutusInfo = async (req, res) => {
    try {
      const { body, file } = req;
      const { title, details, brgy } = JSON.parse(body.aboutusinfo);
  
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      const { id, name } = await UploadFiles(file, process.env.MUNI_ABOUT_US);
  
      const banner = {
        link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
        id,
        name,
      };
  
      const result = await MunicipalAbouts.create({
        title,
        details,
        brgy,
        banner,
      });
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const UpdateAboutusInfo = async (req, res) => {
    try {
      const { doc_id } = req.query;
      const { body, file } = req;
  
      const aboutusInfos = JSON.parse(body.aboutusInfo);
  
      if (!mongoose.Types.ObjectId.isValid(doc_id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
  
      let id = null,
        name = null;
  
      if (file !== undefined) {
        const obj = await UploadFiles(file, process.env.MUNI_ABOUT_US);
        id = obj.id;
        name = obj.name;
  
        if (aboutusInfos.banner.id !== "")
          await DeleteFiles(aboutusInfos.banner.id, process.env.MUNI_ABOUT_US);
      }
      const result = await MunicipalAbouts.findOneAndUpdate(
        { _id: doc_id },
        {
          $set: {
            title: aboutusInfos.title,
            details: aboutusInfos.details,
            banner:
              file !== undefined
                ? {
                    link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                    id,
                    name,
                  }
                : aboutusInfos.banner,
          },
        },
        { new: true }
      );
  
      if (!result) {
        return res.status(400).json({ error: "Info is not updated" });
      }
  
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
  };

  const ArchiveAboutus = async (req, res) => {
    try {
      const { id, isArchived } = req.query;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "No such official" });
      }
  
      const result = await MunicipalAbouts.findOneAndUpdate(
        { _id: id },
        { $set: { isArchived: isArchived } },
        { returnOriginal: false, upsert: true }
      );
  
      res.status(200).json(result);
    } catch (err) {
      res.send(err.message);
    }
  };

module.exports = {GetAboutusInformation, AddAboutusInfo, UpdateAboutusInfo, ArchiveAboutus}