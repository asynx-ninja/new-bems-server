const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const RequireAuth = require("../../global/middleware/RequireAuth")
const { GetAboutusInformation, AddAboutusInfo, UpdateAboutusInfo, ArchiveAboutus } = require("./muni_abouts.controller");

router.use(RequireAuth)
/*
    GetMunicipalInformation
    Description: Get Municipal About us Information

    @isArchived = query
*/
router.get("/", GetAboutusInformation);
/*
    AddAboutusInfo
    Description: Add About us Information
    Type: multipart/form-data

    @Municipal About us = body (json format, add details)
    @file = new file

*/
router.post("/", upload.single("file"), AddAboutusInfo);
/*
    UpdateAboutusInfo
    Description: Update About us Municipality
    Type: multipart/form-data

    @doc_id = query (document id to update)
    @Aboutusinfo = body (json format, updated details)
    @file = new file
*/
router.patch("/", upload.single("file"), UpdateAboutusInfo);
/*
    Description: Archive About us Municipality

     @isArchived = query
*/
router.patch("/archive", ArchiveAboutus);


module.exports = router;