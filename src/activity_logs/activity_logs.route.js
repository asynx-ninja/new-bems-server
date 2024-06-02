const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")

const {
    GetActLogs, SaveActLogs
} = require("./activity_logs.controller");

router.use(RequireAuth)
router.get("/", GetActLogs);
router.post("/", SaveActLogs);


module.exports = router;