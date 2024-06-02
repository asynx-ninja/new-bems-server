const express = require("express");
const router = express.Router();

const {
    GetAllRequest,
    GetStatusPercentage,
    GetRevenue,
    GetEstRevenue,
    GetRevenueBrgy,
    GetEstRevenueBrgy,
    getTotalAvailedServices,
    getTotalCompletedRequests,
    getTotalStatusRequests,
    GetRequestByUser,
    CreateRequest,
    RespondToRequest,
    ArchiveRequest,
    GetRevenueBrgyPerServices,
    GetAllPenReq,
    GetCountPenReq,
    GetDoneBlotters,
    CancelRequest,
} = require("../controllers/RequestController");

const RequireAuth = require("../../global/middleware/RequireAuth")
const upload = require("../config/Multer");

router.use(RequireAuth)
router.get("/", GetAllRequest);
router.get("/specific/", GetRequestByUser);
router.get("/pendingrequest", GetAllPenReq);
router.get("/getdoneblotters", GetDoneBlotters);
router.get("/getallpending", GetCountPenReq);
// router.get("/get_revenue", GetRevenue);
// router.get("/get_brgy_revenue", GetRevenueBrgy);
// router.get("/est_revenue/", GetEstRevenue);
// router.get("/est_brgy_revenue/", GetEstRevenueBrgy);
// router.get("/availed_services/", getTotalAvailedServices);
// router.get("/completed_requests/", getTotalCompletedRequests);
// router.get("/all_status_requests", getTotalStatusRequests);
// router.get("/get_revenue_brgy_requests", GetRevenueBrgyPerServices);
// router.get("/status/percentage", GetStatusPercentage);
router.post("/", upload.array("files", 10), CreateRequest);
router.patch("/", upload.array("files", 10), RespondToRequest);
router.patch("/cancel/", CancelRequest);
router.patch("/archived/:id/:archived", ArchiveRequest);

module.exports = router;
