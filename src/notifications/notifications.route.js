const express = require("express");
const router = express.Router();

const RequireAuth = require("../../global/middleware/RequireAuth")
const {
  GetAllNotifications,
  CreateNotificationByUser,
  GetSpecificID,
  UpdateReadBy,
  CheckReadBy
} = require("./notifications.controller");

// const upload = require("../config/Multer");

router.use(RequireAuth)
/*
    GetAllNotifications
    Description: Get All Tourist
    
    @user_id = query
    @area = query
    @type = query
*/
router.get("/", GetAllNotifications);

/*
    CheckReadBy
    Description: Check if the User ID is in the specific Notif
    
    @user_id = query
    @notification_id = query
*/
router.get("/check", CheckReadBy);

/*
    GetSpecificID
    Description: Get Specific Notification
    
    @id = query
*/
router.get("/get_id", GetSpecificID);

/*
    CreateNotificationByUser
    Description: Create new notification
    type: "application/json"
    
    @body = raw {category, compose, target, banner, logo, type}
*/
router.post("/", CreateNotificationByUser);

/*
    UpdateReadBy
    Description: Update if the user read the notification
    
    @notification_id = query
    @readerId = body ()
*/
router.patch("/", UpdateReadBy);

module.exports = router;
