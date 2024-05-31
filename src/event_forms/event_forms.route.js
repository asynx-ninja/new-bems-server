const express = require("express");
const router = express.Router();

const {
  GetAllEventsForm,
  CreateEventsForm,
  UpdateEventsForm,
  GetActiveForm,
} = require("./event_forms.controller");

router.get("/all_events_form/", GetAllEventsForm);
router.get("/active_form/", GetActiveForm);
router.post("/create_event_form/", CreateEventsForm);
router.patch("/upadate_event_form/", UpdateEventsForm);

module.exports = router;