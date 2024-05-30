const express = require("express");
const router = express.Router();

const upload = require("../../global/config/Multer");

const { GetBarangayEvents, CreateEvents, GetAllOpenBrgyEvents, UpdateEvent, ArchiveEvents, UpdateAttendees, GetSpecificBarangayEvent, getAllEvents } = require("./events.controller");

/*
    GetEventsServices
    Description: Get All Events within the barangay

    @isArchived = query
*/
router.get("/", GetBarangayEvents);
/*
    GetOpenBarangayEvents
    Description: Get All Open Events in barangay

    @isArchived = query
    @isOpen = query
*/
router.get("/all", GetAllOpenBrgyEvents);
/*
    Get Distinct event
    Description: Get Events for filter

    @brgy = query aggregate of collections and title
*/
router.get("/get_distinct_events", getAllEvents);
/*
    Get Distinct event
    Description: Get Events for filter

    @brgy = query aggregate of collections and title
*/
router.get("/specific", GetSpecificBarangayEvent);
/*
    Adding Events
    Description: Adding Events

    @event_folder_id = query
    @event_name, details, date, end_reg_date, brgy, isOpen = JSON parse
*/
router.post("/", upload.array("files", 10), CreateEvents);
/*
    UpdateEvent
    Description: Update Event

    @id = query
    @body = JSON PARSE
*/
router.patch("/update", upload.array("files", 10), UpdateEvent);
/*
    Archive Event
    Description: Archiving Events

    @id , isArchived = Query
*/
router.patch("/archive", ArchiveEvents);

module.exports = router;