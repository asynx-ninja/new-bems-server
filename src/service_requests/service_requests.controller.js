const mongoose = require("mongoose");
const Request = require("./service_requests.model");
const BrgyInfo = require("../brgy_info/brgy_info.model");
const GenerateID = require("../../global/functions/GenerateID");

const {
    CreateFolder,
    UploadFiles,
    DeleteFiles
} = require("../../global/utils/Drive");

const GetAllRequest = async (req, res) => {
    try {
        const { brgy, isArchived, status } = req.query;

        let query = {
            $and: [{ isArchived: isArchived }],
        };

        if (status && status.toLowerCase() !== "all") {
            query.status = status;
        }

        if (brgy) {
            query.brgy = brgy;
        }

        const result = await Request.find(query).populate({
            path: "service_form",
            select: 'document_form_name document_type_name details punong_brgy witnessed_by inputs isActive',
            populate: {
                path: "brgy_info",
                select: 'email tel address'
            },
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            result,
            pageCount: Math.ceil(result.length / 10),
            total: result.length, // Total count without pagination
        });
    } catch (err) {
        res.status(400).json(err.message);
    }
};

const CreateRequest = async (req, res) => {
    try {
        const { body, files } = req;
        const request = JSON.parse(body.request);

        let fileArray = [];
        const increment = await Request.countDocuments({}).exec();
        const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

        const index = brgys.findIndex((item) => item.brgy === request.brgy) + 1;
        const request_id = GenerateID(index + 1, "requests", increment + 1);
        const folder_id = request.request_folder_id === '' ? '' : await CreateFolder(request_id, request.request_folder_id);

        if (files) {
            for (let f = 0; f < files.length; f += 1) {
                const { id, name } = await UploadFiles(files[f], folder_id);

                fileArray.push({
                    link: files[f].mimetype.includes("image")
                        ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
                        : `https://drive.google.com/file/d/${id}/view`,
                    id,
                    name,
                });
            }
        }

        const result = await Request.create({
            answered_form: request.answered_form,
            service_form: request.service_form,
            request_id: request_id,
            files: fileArray.length > 0 ? fileArray : [],
            folder_id: folder_id,
            brgy: request.brgy
        });

        return res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

const RespondToRequest = async (req, res) => {
    try {
        const { req_id, user_type } = req.query;
        const { body, files } = req;

        const {
            sender,
            message,
            status,
            date,
            isRepliable,
            folder_id,
            last_sender,
            last_array,
        } = JSON.parse(body.response);

        let fileArray = [];

        if (!mongoose.Types.ObjectId.isValid(req_id)) {
            return res.status(400).json({ error: "No such request" });
        }

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

        if (user_type && last_array > 0) {
            await Request.findByIdAndUpdate(
                { _id: req_id },
                {
                    $set: {
                        [`response.${last_array}`]: {
                            sender: last_sender.sender,
                            message: last_sender.message,
                            date: last_sender.date,
                            file: last_sender.file,
                            isRepliable: false,
                        },
                    },
                }
            );
        }

        const result = await Request.findByIdAndUpdate(
            { _id: req_id },
            {
                $push: {
                    response: {
                        sender: sender,
                        message: message,
                        date: date,
                        file: fileArray.length > 0 ? fileArray : null,
                        isRepliable: isRepliable,
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

const ArchiveRequest = async (req, res) => {
    try {
        const { id, archived } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such official" });
        }

        const result = await Request.findOneAndUpdate(
            { _id: id },
            { $set: { isArchived: archived } },
            { returnOriginal: false, upsert: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const CancelRequest = async (req, res) => {
    try {
        const { req_id, status } = req.query;

        if (!mongoose.Types.ObjectId.isValid(req_id)) {
            return res.status(400).json({ error: "No such request" });
        }

        const result = await Request.findByIdAndUpdate(
            { _id: req_id },
            {
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

module.exports = {
    GetAllRequest,
    CreateRequest,
    RespondToRequest,
    ArchiveRequest,
    CancelRequest,
};
