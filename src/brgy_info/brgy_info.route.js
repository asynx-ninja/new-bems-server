const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const {
    GetBrgyInfo,
    GetBrgys,
    CreateBrgyInfo,
    UpdateBrgyInfo,
} = require("./brgy_info.controller");

router.get("/", GetBrgyInfo);
router.get("/all", GetBrgys);
router.post("/", upload.array("files", 10), CreateBrgyInfo);
router.patch("/", upload.array("files", 10), UpdateBrgyInfo);

module.exports = router;