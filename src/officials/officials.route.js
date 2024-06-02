const express = require("express");
const router = express.Router();
const upload = require("../../global/config/Multer");
const RequireAuth = require("../../global/middleware/RequireAuth")

const {
  GetAllOfficials,
  CreateNewOfficial,
    UpdateOfficialInfo,
    ArchiveOfficial,
} = require("./officials.controller");

router.use(RequireAuth)
router.get("/", GetAllOfficials);
router.post("/", upload.single("file"), CreateNewOfficial);
router.patch("/", upload.single("file"), UpdateOfficialInfo);
router.patch("/archived/", ArchiveOfficial);

module.exports = router;
