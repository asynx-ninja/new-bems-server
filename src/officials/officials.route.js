const express = require("express");
const router = express.Router();
const upload = require("../../global/config/Multer");

const {
  GetAllOfficials,
  CreateNewOfficial,
    UpdateOfficialInfo,
    ArchiveOfficial,
} = require("./officials.controller");

router.get("/", GetAllOfficials);
router.post("/", upload.single("file"), CreateNewOfficial);
router.patch("/", upload.single("file"), UpdateOfficialInfo);
router.patch("/archived/", ArchiveOfficial);

module.exports = router;
