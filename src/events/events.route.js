const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const { GetBarangayEvents } = require("./events.controller");

/*
    GetEventsServices
    Description: Get All Events within the barangay

    @isArchived = query
*/
router.get("/", GetBarangayEvents);


module.exports = router;