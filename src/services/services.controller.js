const mongoose = require("mongoose");
const Service = require("./services.model");
const BrgyInfo = require("../brgy_info/brgy_info.model");

const GenerateID = require("../../global/functions/GenerateID");
const CompareArrays = require("../../global/functions/CompareArrays");
const GetChart = require("../../global/functions/GetChart");

const {
    CreateFolder,
    UploadFiles,
    DeleteFiles
} = require("../../global/utils/Drive");

const GetBrgyService = async (req, res) => {
    try {
        const { brgy, archived, status } = req.query;

        let query = {
            $and: [{ brgy: brgy }, { isArchived: archived }],
        };

        if (status && status.toLowerCase() !== "all") {
            query.status = status;
        }

        const result = await Service.find(query).sort({ createdAt: -1 }).exec();

        return res.status(200).json({
            result,
            pageCount: Math.ceil(result.length / 10),
            total: result.length, // Total count without pagination
        });
    } catch (err) {
        res.send(err.message);
    }
};

const GetServiceChart = async (req, res) => {
    try {
        const { timeRange, specificDate, week, month, year } = req.query;
        let query;

        // Adjust the query based on the timeRange
        if (timeRange) {
            query = GetChart(timeRange, specificDate, week, month, year)
        }

        const result = await Service.find(query);

        res.status(200).json(result);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

const GetPendingBrgyServices = async (req, res) => {
    try {
        const { archived, status } = req.query;

        const result = await Service.find({ isArchived: archived, status: status })

        return res.status(200).json({
            result,
            pageCount: Math.ceil(result.length / 10),
            total: result.length,
        });
    } catch (err) {
        res.status(400).json(err.message);
    }
};

const GetDistinctBrgyServices = async (req, res) => {
    const { brgy } = req.query;

    const result = await Service.aggregate([
        // Unwind the "collections" array to access individual documents within it
        { $unwind: "$collections" },
        // Group by service name
        { $match: { brgy: brgy, isArchived: false } },  // Replace "ROSARIO" with your desired Barangay
        // Group by service name and use $addToSet to get distinct values
        { $group: { _id: "$name" } },
        // Project only the "_id" field (which holds distinct service names)
        { $project: { _id: 1 } }
    ])

    res.status(200).json(result)
}

const CreateServices = async (req, res) => {
    try {
        const { service_folder_id } = req.query;
        const { body, files } = req;
        const { name, details, fee, brgy } = JSON.parse(body.service);
        let fileArray = [];

        const increment = await Service.countDocuments({}).exec()
        const brgys = await BrgyInfo.find({}).sort({ createdAt: 1 }).exec();

        const index = brgys.findIndex((item) => item.brgy === brgy.toUpperCase());
        const service_id = GenerateID(index + 1, "services", increment + 1);

        const folder_id = await CreateFolder(service_id, service_folder_id);

        for (let f = 0; f < files.length; f += 1) {
            const { id, name } = await UploadFiles(files[f], folder_id);

            fileArray.push({
                link:
                    f === 0 || f === 1
                        ? `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
                        : `https://drive.google.com/file/d/${id}/view`,
                id,
                name,
            });
        }

        const [banner, logo, ...remainingFiles] = fileArray;
        const bannerObject = Object.assign({}, banner);
        const logoObject = Object.assign({}, logo);

        const result = await Service.create({
            service_id,
            service_name: name,
            details,
            fee,
            brgy,
            collections: {
                folder_id: folder_id,
                banner: bannerObject,
                logo: logoObject,
                file: remainingFiles,
            },
        });

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const UpdateServices = async (req, res) => {
    try {
        const { doc_id } = req.query;
        let { body, files } = req;
        let currentFiles = [];
        body = JSON.parse(JSON.stringify(req.body));
        let { saved, service } = body;
        let banner = null, logo = null;

        if (!mongoose.Types.ObjectId.isValid(doc_id)) {
            return res.status(400).json({ error: "No such service" });
        }

        // Check if the currentFiles uploaded in this function backend is not empty
        // Meaning, there are files in the frontend
        if (saved !== undefined) {
            if (typeof body.saved === "object") {
                for (const item of saved) {
                    const parsed = JSON.parse(item);
                    currentFiles.push(parsed);
                }
            } else {
                const parsed = JSON.parse(saved);
                currentFiles.push(parsed);
            }
        }

        let fileArray = [...currentFiles];
        service = JSON.parse(body.service);
        const folder_id = service.collections.folder_id;
        const fullItem = service.collections.file;
        const toBeDeletedItems = CompareArrays(fullItem, currentFiles);

        toBeDeletedItems.forEach(async (item) => {
            await DeleteFiles(item.id);
        });

        if (files) {
            for (let f = 0; f < files.length; f += 1) {
                const { id, name } = await UploadFiles(files[f], folder_id);

                if (files[f].originalname === "banner") {
                    banner = {
                        link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                        id,
                        name,
                    };

                    await DeleteFiles(service.collections.banner.id, folder_id);
                } else if (files[f].originalname === "logo") {
                    logo = {
                        link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                        id,
                        name,
                    };

                    await DeleteFiles(service.collections.logo.id, folder_id);
                } else {
                    fileArray.push({
                        link: `https://drive.google.com/file/d/${id}/view`,
                        id,
                        name,
                    });
                }
            }
        }

        const result = await Service.findByIdAndUpdate(
            { _id: doc_id },
            {
                name: service.name,
                type: service.type,
                details: service.details,
                fee: service.fee,
                brgy: service.brgy,
                collections: {
                    folder_id,
                    banner: banner === null ? service.collections.banner : banner,
                    logo: logo === null ? service.collections.logo : logo,
                    file: fileArray,
                },
            },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const ChangeStatusService = async (req, res) => {
    try {
        const { id, status } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such service" });
        }

        const result = await Service.findByIdAndUpdate(
            { _id: id },
            { status: status },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const ArchiveService = async (req, res) => {
    try {
        const { id, isArchived } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "No such service" });
        }

        const result = await Service.findByIdAndUpdate(
            { _id: id },
            { isArchived: isArchived },
            { new: true }
        );

        res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = {
    GetBrgyService,
    GetServiceChart,
    GetPendingBrgyServices,
    GetDistinctBrgyServices,
    CreateServices,
    UpdateServices,
    ChangeStatusService,
    ArchiveService,
};
