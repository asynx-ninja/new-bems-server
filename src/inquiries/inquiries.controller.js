const mongoose = require("mongoose");
const Inquiries = require("./inquiries.model");
const GenerateID = require("../../global/functions/GenerateID");
const BrgyInfo = require("../brgy_info/brgy_info.model");
const {
    createRequiredFolders,
    uploadFolderFiles,
} = require("../../global/utils/Drive");


const GetInq = async (req, res) => {
    try {
        const { id, archived, to } = req.query;

        let query = {
            $and: [{ isArchived: archived }, { user: id }],
        };

        if (to && to.toLowerCase() !== "all") {
            query.$and.push({ "compose.to": to });
        }

        const result = await Inquiries.find(query).sort({ createdAt: -1 });

        return res.status(200).json({
            result,
            pageCount: Math.ceil(result.length / 10),
            total: result.length, // Total count without pagination
        });
    } catch (err) {
        res.send(err.message);
    }
};

const GetInqStatus = async (req, res) => {
    try {
        const barangays = [
            "BALITE",
            "BURGOS",
            "GERONIMO",
            "MACABUD",
            "MANGGAHAN",
            "MASCAP",
            "PURAY",
            "ROSARIO",
            "SAN ISIDRO",
            "SAN JOSE",
            "SAN RAFAEL",
        ];

        const inquiriesByStatusAndBarangay = await Inquiries.aggregate([
            {
                $match: {
                    brgy: { $in: barangays },
                },
            },
            {
                $group: {
                    _id: {
                        status: "$isApproved",
                        barangay: "$brgy",
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id.status",
                    barangay: "$_id.barangay",
                    count: 1,
                },
            },
        ]);

        res.json(inquiriesByStatusAndBarangay);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const GetMuniInq = async (req, res) => {
    try {
        const { to, archived, status } = req.query;

        const query = {
            "compose.to": to,
            isArchived: archived,
        };

        if (status && status.toLowerCase() !== "all") {
            query.status = status;
        }

        const result = await Inquiries.find(query).sort({ createdAt: -1 });

        return !result
            ? res.status(400).json({ error: `No such Announcement for ${to}` })
            : res.status(200).json({
                result,
                pageCount: Math.ceil(result.length / 10),
                total: result.length,
            });
    } catch (err) {
        res.send(err.message);
    }
};

const GetStaffInq = async (req, res) => {
    try {
        const { brgy, archived, status, label } = req.query;

        let query = {
            isArchived: archived,
            "compose.to": label,
        };

        if (status && status.toLowerCase() !== "all") {
            query.status = status;
        }

        const result = await Inquiries.find(query)
            .populate({
                path: 'user',
                match: { brgy: brgy }
            })
            .sort({ createdAt: -1 })
            .exec();

        const filteredResult = result.filter(inquiry => inquiry.user !== null);

        return res.status(200).json({
            result: filteredResult,
            pageCount: Math.ceil(filteredResult.length / 10),
            total: filteredResult.length,
        });
    } catch (err) {
        res.send(err.message);
    }
};

const GetTotalInqStatus = async (req, res) => {
    try {
        // Update the matchCondition for "In Progress", "Pending", and "Completed"
        let matchCondition = {
            status: { $in: ["In Progress", "Submitted", "Resolved"] },
        };

        const { brgy } = req.query;

        if (brgy) {
            matchCondition.brgy = brgy;
        }

        console.log("matchCondition:", matchCondition);

        const serviceSummary = await Inquiries.aggregate([
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: "$isApproved",
                    totalRequests: { $sum: 1 },
                },
            },
        ]);

        console.log("serviceSummary:", serviceSummary);

        res.json(serviceSummary);
    } catch (error) {
        console.error("Error in getTotalStatusRequests:", error);
        res.status(500).send(error);
    }
};

const CreateInq = async (req, res) => {
    try {
        const { inq_folder_id } = req.query;
        const { body, files } = req;
        const { compose, brgy, user } = JSON.parse(body.inquiries);

        let fileArray = [];

        const increment = await Inquiries.countDocuments({}).exec()
        const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

        const index = brgys.findIndex((item) => item.brgy === brgy.toUpperCase());
        const inquiry_id = GenerateID(index + 1, "inquiries", increment + 1);

        const folder_id = await createRequiredFolders(inquiry_id, inq_folder_id);

        for (let f = 0; f < files.length; f += 1) {
            const { id, name } = await uploadFolderFiles(files[f], folder_id);

            fileArray.push({
                link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                id,
                name,
            });
        }

        const result = await Inquiries.create({
            inquiry_id,
            compose: {
                subject: compose.subject || "",
                type: compose.type || "",
                message: compose.message || "",
                date: new Date(),
                file: fileArray,
                to: compose.to || "",
            },
            folder_id,
            status: "Submitted",
            isArchived: false,
            user,
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const RespondToInq = async (req, res) => {
    try {
        const { inq_id } = req.query;
        const { body, files } = req;

        const response = JSON.parse(body.response);
        const { sender, message, date, folder_id, status } = response;

        let fileArray = [];

        if (files) {
            for (let f = 0; f < files.length; f++) {
                const { id, name } = await uploadFolderFiles(files[f], folder_id);

                fileArray.push({
                    link: files[f].mimetype.includes("image")
                        ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
                        : `https://drive.google.com/file/d/${id}/view`,
                    id,
                    name,
                });
            }
        }

        const result = await Inquiries.findByIdAndUpdate(
            { _id: inq_id },
            {
                $push: {
                    response: {
                        sender: sender,
                        message: message,
                        date: date,
                        file: fileArray.length > 0 ? fileArray : null,
                    },
                },
                $set: {
                    status: status,
                },
            },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const StatusInq = async (req, res) => {
    try {
        const { id } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such inquiry" });
        }

        const result = await Inquiries.findOneAndUpdate(
            { _id: id },
            { $set: { status: "Resolved" } },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};


const ArchiveInq = async (req, res) => {
    try {
        const { id, archived } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such inquiry" });
        }

        const result = await Inquiries.findOneAndUpdate(
            { _id: id },
            { $set: { isArchived: archived } },
            { returnOriginal: false, upsert: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = {
    GetInq,
    GetInqStatus,
    GetMuniInq,
    GetStaffInq,
    GetTotalInqStatus,
    ArchiveInq,
    CreateInq,
    RespondToInq,
    StatusInq,
};