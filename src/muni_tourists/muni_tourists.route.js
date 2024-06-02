const express = require("express");
const router = express.Router();
const upload = require("../../global/config/Multer");

const RequireAuth = require("../../global/middleware/RequireAuth")
const {
  GetTouristSpotInformation,
  GetSpecificTouristInfo,
  AddTouristSpotInfo,
  UpdateTouristSpotInfo,
  ArchiveTouristSpot,
} = require("./muni_tourists.controller");

router.use(RequireAuth)
/*
    GetMuniServices
    Description: Get All Tourist
    
    @isArchived = query
*/
router.get("/", GetTouristSpotInformation);

/*
    GetMuniServices
    Description: Get Specific Tourist Info
    
    @id = query
*/
router.get("/tourist_info/", GetSpecificTouristInfo);

/*
    AddTouristSpotInfo
    Description: Add New Tourist Spot
    
    @touristsinfo = body (json format, updated details)
    @files = new file
*/
router.post("/", upload.array("files", 10), AddTouristSpotInfo);

/*
    UpdateTouristSpotInfo
    Description: Update Tourist Spot Info
    
    @touristsinfo = body (json format, updated details)
    @files = new file
*/
router.patch("/", upload.array("files", 10), UpdateTouristSpotInfo);

/*
    UpdateTouristSpotInfo
    Description: Update Tourist Spot Info
    
    @touristsinfo = body (json format, updated details)
    @files = new file
*/
router.patch("/archived/", ArchiveTouristSpot);

module.exports = router;
