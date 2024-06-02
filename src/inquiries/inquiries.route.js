const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");
const RequireAuth = require("../../global/middleware/RequireAuth")

const {
  GetInq,
  GetInqStatus,
  GetMuniInq,
  GetStaffInq,
  CreateInq,
  ArchiveInq,
  RespondToInq,
  StatusInq,
  GetTotalInqStatus,
} = require("./inquiries.controller");

router.use(RequireAuth)
router.get("/", GetInq);
router.get("/inquiries_percent", GetInqStatus);
router.get("/admininquiries", GetMuniInq);
router.get("/staffinquiries", GetStaffInq);
router.get("/all_status_inquiries", GetTotalInqStatus);
router.post("/", upload.array("files", 10), CreateInq);
router.patch("/", upload.array("files", 10), RespondToInq);
router.patch("/archived/", ArchiveInq);
router.patch("/status/", StatusInq);

module.exports = router;