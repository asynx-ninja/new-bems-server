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
        res.status(400).send(err.message);
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
        res.status(400).json({ error: err.message });
    }
};

const UpdateMuniService = async (req, res) => {
    try {
        let id = null, name = null;
        const { doc_id } = req.query;
        const { body, file } = req;

        const servicesInfos = JSON.parse(body.servicesinfo);

        if (!mongoose.Types.ObjectId.isValid(doc_id)) {
            return res.status(400).json({ error: "Invalid Municipality Service ID" });
        }

        if (file) {
            const obj = await UploadFiles(file, process.env.MUNI_OFFERED_SERVICES);
            id = obj.id;
            name = obj.name;

            if (servicesInfos.icon.id !== "")
                await DeleteFiles(servicesInfos.icon.id);
        }

        const result = await MuniService.findByIdAndUpdate(
            { _id: doc_id },
            {
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
            { new: true }
        );

        if (!result) {
            return res.status(400).json({ error: "Info is not updated" });
        }

        return res.status(200).json(result);
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

const ArchiveMuniService = async (req, res) => {
    try {
        const { id, isArchived } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No Municipality Service found" });
        }

        const result = await MuniService.findByIdAndUpdate(
            { _id: id },
            { isArchived },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

module.exports = { GetMuniServices, AddMuniService, UpdateMuniService, ArchiveMuniService }
