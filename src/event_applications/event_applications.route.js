const express = require("express");
const router = express.Router();

const {
  GetAllAppli,
  GetUserAppli,
  ApprovedAppli,
  GetForReviewAppli,
  CountForReviewAppli,
  CreateEventsAppli,
  ReplyToAppli,
  ArchiveAppli,
  CancelAppli,
} = require("./event_applications.controller");

const upload = require("../../global/config/Multer");

router.get("/specific/", GetUserAppli);
router.get("/", GetAllAppli);
router.get("/completed", ApprovedAppli);
router.get("/pendingevents", GetForReviewAppli);
router.get("/countpendingevents", CountForReviewAppli);
router.post("/", upload.array("files", 10), CreateEventsAppli);
router.patch("/", upload.array("files", 10), ReplyToAppli);
router.patch("/cancel/", ArchiveAppli);
router.patch("/archived/", CancelAppli);

module.exports = router;