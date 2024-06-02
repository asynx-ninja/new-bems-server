const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")
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

router.use(RequireAuth)
router.get("/user_appli/", GetUserAppli);
router.get("/all_appli/", GetAllAppli);
router.get("/approved_appli/", ApprovedAppli);
router.get("/for_review_appli/", GetForReviewAppli);
router.get("/count_for_review/", CountForReviewAppli);
router.post("/create_appli/", upload.array("files", 10), CreateEventsAppli);
router.patch("/reply_appli/", upload.array("files", 10), ReplyToAppli);
router.patch("/cancel_appli/", CancelAppli);
router.patch("/archived_appli/", ArchiveAppli);

module.exports = router;