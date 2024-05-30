const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const { GetMuniServices, AddMuniService, UpdateMuniService, ArchiveMuniService } = require("./muni_services.controller");

/*
    GetMuniServices
    Description: Get All Municipality Services

    @isArchived = query
*/
router.get("/", GetMuniServices);

/*
    AddMuniServices
    Description: Get All Municipality Services
    Type: multipart/form-data

    @servicesinfo = body (json format, updated details)
    @file = new file
*/
router.post("/", upload.single("file"), AddMuniService);

/*
    UpdateMuniServices
    Description: Update Single Municipality Service
    Type: multipart/form-data

    @doc_id = query (document id to update)
    @servicesinfo = body (json format, updated details)
    @file = new file
*/
router.patch("/", upload.single("file"), UpdateMuniService);

// 
router.patch("/archived", ArchiveMuniService);

module.exports = router;
