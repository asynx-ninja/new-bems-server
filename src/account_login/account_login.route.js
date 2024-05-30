const express = require("express");
const router = express.Router();

const {
    GetCredentials,
    SentPIN,
    CheckEmail,
    CheckPIN,
    UpdateCredentials,
    UpdatePasswordOnly,
} = require("./account_login.controller");

const upload = require("../../global/config/Multer");

router.get("/check_pin/", CheckPIN);
router.get("/", GetCredentials);
router.patch("/send_pin/", SentPIN);
router.patch("/pass/.", UpdatePasswordOnly);
router.get("/findemail/", CheckEmail);
router.patch("/", UpdateCredentials);

module.exports = router;