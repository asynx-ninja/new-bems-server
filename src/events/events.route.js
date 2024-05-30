const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const { GetBarangayEvents, CreateEvents, SearchBarangayEvents } = require("./events.controller");

/*
    GetEventsServices
    Description: Get All Events within the barangay

    @isArchived = query
*/
router.get("/", GetBarangayEvents);
router.get("/search", SearchBarangayEvents)
router.post("/", upload.array("files", 10), CreateEvents);

module.exports = router;