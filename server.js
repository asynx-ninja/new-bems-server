const mongoose = require('mongoose');
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");
const ConnectDB = require("./global/config/DB");
const SocketIO = require("./global/config/SocketIO")

const account_login = require('./src/account_login/account_login.route');
// const activity_logs = require('./src/activity_logs/activity_logs.route');
const brgy_info = require('./src/brgy_info/brgy_info.route');
const event_applications = require('./src/event_applications/event_applications.route');
const event_forms = require('./src/event_forms/event_forms.route');
const events = require('./src/events/events.route');
const folders = require('./src/folders/folders.route');
// const inquiries = require('./src/inquiries/inquiries.route');
const muni_abouts = require('./src/muni_abouts/muni_abouts.route');
const muni_services = require('./src/muni_services/muni_services.route');
const muni_tourists = require('./src/muni_tourists/muni_tourists.route');
const notifications = require('./src/notifications/notifications.route');
const officials = require('./src/officials/officials.route');
// const patawags = require('./src/patawag/patawag.route');
// const patawag_doc = require('./src/patawag_doc/patawag_doc.route');
// const profile = require('./src/profile/profile.route');
const service_forms = require('./src/service_forms/service_forms.route')
// const service_requests = require('./src/service_requests/service_requests.route');
const services = require('./src/services/services.route');

dotenv.config();
ConnectDB();
const app = express();
const server = SocketIO(app)

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true, optionSuccessStatus: 200 }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
    );
    console.log(req.path, req.method);
    next();
});

// Routes
app.use("/api/auth", account_login);
// app.use("/api/logs", activity_logs);
app.use("/api/brgy_info", brgy_info);
app.use("/api/applications", event_applications);
app.use("/api/event_forms", event_forms);
app.use("/api/events", events);
app.use("/api/folders", folders);
// app.use("/api/inquiries", inquiries);
app.use("/api/muni_abouts", muni_abouts);
app.use("/api/muni_services", muni_services);
app.use("/api/muni_tourists", muni_tourists);
app.use("/api/notifications", notifications);
app.use("/api/officials", officials);
// app.use("/api/patawags", patawags);
// app.use("/api/patawag_doc", patawag_doc);
// app.use("/api/profile", profile);
app.use("/api/service_forms", service_forms);
// app.use("/api/requests", service_requests);
app.use("/api/services", services);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Barangay E-Services Management System's API",
    });
});

mongoose.connection.once("open", () => {
    console.log("Database connected.");

    server.listen(process.env.PORT, () =>
        console.log(`Server started on port ${process.env.PORT}`)
    );
});