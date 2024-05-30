const mongoose = require("mongoose");
const ActLogs = require('./activity_logs.model')

const GetCredentials = async (req, res) => {
    try {
      

      res.status(200).json(result);
    } catch (err) {
      res.send(err.message);
    }
  };