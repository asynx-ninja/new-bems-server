const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const {
  GetAllBrgyFolders,
  GetSpecificBrgyFolders,
  CreateBrgyFolders,
} = require("./folders.controller");

router.get("/", GetAllBrgyFolders);
router.get("/specific", GetSpecificBrgyFolders);
router.post("/", CreateBrgyFolders);

module.exports = router;