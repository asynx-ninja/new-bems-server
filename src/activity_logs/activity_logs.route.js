const express = require("express");
const router = express.Router();

const {

} = require("./activity_logs.controller");

const upload = require("../../global/config/Multer");

// router.get("/specific/", GetEventsApplicationByUser);
// router.get("/", GetAllEventsApplication);
// router.get("/completed", CountCompleted);
// router.get("/pendingevents", GetAllPenApp);
// router.get("/countpendingevents", GetCountPenApp);
// router.post("/", upload.array("files", 10), CreateEventsApplication);
// router.patch("/", upload.array("files", 10), RespondToEventsApplication);
// router.patch("/cancel/", CancelEventApplication);
// router.patch("/archived/", ArchiveEventsApplication);

module.exports = router;