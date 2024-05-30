const express = require("express");
const router = express.Router();

const {
  GetAllEventsForm,
  CreateEventsForm,
  UpdateEventsForm,
  GetActiveForm,
} = require("./event_forms.controller");

router.get("/", GetAllEventsForm);
router.get("/check", GetActiveForm);
router.post("/", CreateEventsForm);
router.patch("/", UpdateEventsForm);

module.exports = router;