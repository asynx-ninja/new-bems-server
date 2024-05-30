const mongoose = require("mongoose");
const Events = require("./events.model");
const compareArrays = require("../../global/functions/CompareArrays");
const GenerateID = require("../../global/functions/GenerateID");
const { UploadFiles, DeleteFiles } = require("../../global/utils/Drive");

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


  module.exports = {GetBarangayEvents};