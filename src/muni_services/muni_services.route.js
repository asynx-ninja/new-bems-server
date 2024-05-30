const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const { GetMuniServices, AddMuniService, UpdateMuniService, ArchiveMuniService } = require("./muni_services.controller");

router.get("/", GetMuniServices);
router.post("/", upload.single("file"), AddMuniService);
router.patch("/", upload.single("file"), UpdateMuniService);
router.patch("/archive", ArchiveMuniService);

module.exports = router;
    