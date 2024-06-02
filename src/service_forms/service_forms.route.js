const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")
const {
    GetAllServiceForm,
    CreateServiceForm,
    UpdateServiceForm,
    GetActiveForm,
} = require("./service_forms.controller");

router.use(RequireAuth)
router.get("/", GetAllServiceForm);
router.get("/active", GetActiveForm);
router.post("/", CreateServiceForm);
router.patch("/", UpdateServiceForm);

module.exports = router;
