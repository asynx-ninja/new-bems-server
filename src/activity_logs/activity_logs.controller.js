const mongoose = require("mongoose");
const ActLogs = require('./activity_logs.model')


const GetActLogs = async (req, res) => {
  try {
    const result = await ActLogs.find().sort({ createdAt: -1 });
    return res.status(200).json({
      result,
      pageCount: Math.ceil(result.length / 10),
      total: result.length, // Total count without pagination
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

  const SaveActLogs = async (req, res) => {
    try {

      const { event, action, ip, user, protocol, payload, session_id} = JSON.parse(body.actlogs_info);
  
      const result = await ActLogs.create({
        event,
        action,
        ip,
        user,
        protocol,
        payload,
        session_id
      });
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };




module.exports = {GetActLogs, SaveActLogs}