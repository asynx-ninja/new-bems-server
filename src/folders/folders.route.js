const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")

const {
  GetAllBrgyFolders,
  GetSpecificBrgyFolders,
  CreateBrgyFolders,
} = require("./folders.controller");

router.use(RequireAuth)
router.get("/", GetAllBrgyFolders);
router.get("/specific", GetSpecificBrgyFolders);
router.post("/", CreateBrgyFolders);

module.exports = router;