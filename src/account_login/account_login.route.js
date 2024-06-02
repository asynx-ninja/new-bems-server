const express = require("express");
const router = express.Router();

const {
    Login,
    RegisterResident,
    RegisterStaffMuni
} = require("./account_login.controller");

const upload = require("../../global/config/Multer");

router.post("/login", Login);
router.post("/register_resident", upload.array('files', 10), RegisterResident);
router.post("/register_staff_muni", RegisterStaffMuni);

module.exports = router;