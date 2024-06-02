const express = require("express");
const router = express.Router();

const {
    GetAllRequest,
    CreateRequest,
    RespondToRequest,
    ArchiveRequest,
    CancelRequest,
} = require("./service_requests.controller");

const RequireAuth = require("../../global/middleware/RequireAuth")
const upload = require("../../global/config/Multer");

router.use(RequireAuth)
router.get("/", GetAllRequest);
router.post("/", upload.array("files", 10), CreateRequest);
router.patch("/", upload.array("files", 10), RespondToRequest);
router.patch("/cancel/", CancelRequest);
router.patch("/archived/:id/:archived", ArchiveRequest);

module.exports = router;
