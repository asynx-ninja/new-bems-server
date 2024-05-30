const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const {
    GetBrgyInfo,
    GetBrgys,
    AddBrgyInfo,
    UpdateBrgyInfo,
} = require("./brgy_info.controller");

router.get("/", GetBrgyInfo);
router.get("/allinfo", GetBrgys);
router.post("/", upload.array("files", 10), AddBrgyInfo);
router.patch("/:brgy", upload.array("files", 10), UpdateBrgyInfo);

module.exports = router;