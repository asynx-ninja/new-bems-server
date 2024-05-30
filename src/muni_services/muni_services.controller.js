const mongoose = require("mongoose");
const MuniService = require("./muni_services.model");
const { UploadFiles, DeleteFiles } = require("../../global/utils/Drive");
const dotenv = require('dotenv');
dotenv.config();

const GetMuniServices = async (req, res) => {
    try {
        const { isArchived } = req.query;

        const result = await MuniService.find({ isArchived }).sort({ createdAt: -1 }).exec();

        return res.status(200).json({
            result,
            pageCount: Math.ceil(result.length / 10),
            total: result.length
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const AddMuniService = async (req, res) => {
    try {
        const { body, file } = req;
        const { name, details } = JSON.parse(body.servicesinfo);

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { id, name: filename } = await UploadFiles(file, process.env.MUNI_OFFERED_SERVICES);

        const result = await MuniService.create({
            name, details, icon: {
                link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                id,
                name: filename,
            }
        });

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const UpdateMuniService = async (req, res) => {
    try {
        const { doc_id } = req.query;
        const { body, file } = req;

        const servicesInfos = JSON.parse(body.servicesinfo);

        if (!mongoose.Types.ObjectId.isValid(doc_id)) {
            return res.status(400).json({ error: "Invalid Municipality Service ID" });
        }

        let id = null,
            name = null;

        if (file) {
            const obj = await uploadFolderFiles(file, process.env.MUNI_OFFERED_SERVICES);
            id = obj.id;
            name = obj.name;

            if (servicesInfos.icon.id !== "")
                await deleteFolderFiles(servicesInfos.icon.id, process.env.MUNI_OFFERED_SERVICES);
        }

        const result = await MuniService.findOneAndUpdate(
            { _id: doc_id },
            {
                $set: {
                    name: servicesInfos.name,
                    details: servicesInfos.details,
                    icon: file
                        ? {
                            link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                            id,
                            name,
                        }
                        : servicesInfos.icon,
                },
            },
            { new: true }
        );

        if (!result) {
            return res.status(400).json({ error: "Info is not updated" });
        }

        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err.message);
    }
};

const ArchiveMuniService = async (req, res) => {
    try {
        const { id, archived } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such information" });
        }

        const result = await MuniService.findOneAndUpdate(
            { _id: id },
            { $set: { isArchived: archived } },
            { returnOriginal: false, upsert: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = { GetMuniServices, AddMuniService, UpdateMuniService, ArchiveMuniService }
