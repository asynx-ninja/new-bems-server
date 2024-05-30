const express = require("express");
const router = express.Router();

const {
    GetBrgyService,
    GetServiceChart,
    GetPendingBrgyServices,
    GetDistinctBrgyServices,
    CreateServices,
    // UpdateServices,
    // StatusService,
    // ArchiveService,
    // GetServiceAndForm,
} = require("./services.controller");

const upload = require("../../global/config/Multer");

/*
    GetBrgyService
    Description: Get Brgy Service based on filters

    @brgy = designated barangay
    @archived = true or false
    @status = ["Approved", "Disapproved", "For Review"]
*/
router.get("/", GetBrgyService);

/*
    GetServiceChart
    Description: Get Approved Services Chart

    @timeRange = ["today", "weekly", "monthly", "annual", "specific"]
    @specificDate = setted date
    @week = setted week
    @month = setted month
    @year = setted year
*/
router.get("/chart", GetServiceChart);

/*
    GetPendingBrgyServices
    Description: Get All Pending Brgy Services

    @archived = true or false
    @status = ["Approved", "Disapproved", "For Review"]
*/
router.get("/pending_services", GetPendingBrgyServices);

/*
    GetDistinctBrgyServices
    Description: Get All Active Brgy Services

    @brgy = designated brgy
*/
router.get("/distinct_services", GetDistinctBrgyServices);

/*
    CreateServices
    Description: Create Brgy Service
    Type: multipart/form-data

    @service_folder_id = google drive folder query
    @service = name, details, fee, brgy
    @files = files uploaded
*/
router.post("/", upload.array("files", 10), CreateServices);

// router.patch("/:id", upload.array("files", 10), UpdateServices);

// router.patch("/status/:id", StatusService);
// router.patch("/archived/:id/:archived", ArchiveService);

module.exports = router;
