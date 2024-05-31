const express = require("express");
const router = express.Router();

const {
    GetActLogs, SaveActLogs
} = require("./activity_logs.controller");


router.get("/", GetActLogs);
router.post("/", SaveActLogs);


module.exports = router;