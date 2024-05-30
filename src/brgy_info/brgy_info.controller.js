const BrgyInformation = require("./brgy_info.model");
const dotenv = require("dotenv");
dotenv.config();

const { UploadFiles, DeleteFiles } = require("../../global/utils/Drive");

const GetBrgyInfo = async (req, res) => {
    try {
        const { brgy, logo } = req.query;

        const result = await BrgyInformation.find(
            { brgy: brgy },
            logo !== undefined ? { logo: 1, _id: 0 } : null
        );

        return !result
            ? res
                .status(400)
                .json({ error: `No such Information for Barangay ${brgy}` })
            : res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const GetBrgys = async (req, res) => {
    try {
        const allinfo = await BrgyInformation.aggregate([
            {
                $project: {
                    _id: 0,
                    brgy: 1,
                    mission: 1,
                    story: 1,
                    vision: 1,
                    email: 1,
                    address: 1,
                    tel_no: 1,
                    banner: "$banner.link",
                    logo: "$logo.link",
                },
            },
        ]).exec()

        if (allinfo.length === 0) {
            return res.status(400).json({ error: "No barangays found." });
        }

        res.status(200).json(allinfo);
    } catch (error) {
        console.error(error);
    }
};

// CHECK
const CreateBrgyInfo = async (req, res) => {
    try {
        const { folder_id } = req.query;
        const { body, files } = req;
        const { story, mission, vision, brgy, email, tel_no, address, theme } = JSON.parse(body.brgyinfo);
        let fileArray = [];

        for (let f = 0; f < files.length; f += 1) {
            const { id, name } = await uploadFolderFiles(files[f], folder_id);

            fileArray.push({
                link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                id,
                name,
            });
        }

        const [banner, logo] = fileArray;
        const bannerObject = Object.assign({}, banner);
        const logoObject = Object.assign({}, logo);

        const result = await BrgyInformation.create({
            story,
            mission,
            vision,
            brgy,
            email,
            address,
            tel_no,
            banner: bannerObject,
            logo: logoObject,
            theme: theme
        })

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CHECK
const UpdateBrgyInfo = async (req, res) => {
    const { brgy } = req.query;
    const { body, files } = req;

    const brgyData = JSON.parse(body.brgyinfo);
    const { story, mission, vision, email, tel_no, address, banner, logo, theme } = brgyData;

    let bannerNew = null,
        logoNew = null;

    if (files) {
        for (let i = 0; i < files.length; i++) {
            const { id, name } = await uploadFolderFiles(files[i], muniInfoID);

            if (files[i].originalname.includes("banner")) {
                bannerNew = {
                    link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                    id,
                    name,
                };

                if (banner.id !== "") await deleteFolderFiles(banner.id, muniInfoID);
            } else if (files[i].originalname.includes("logo")) {
                logoNew = {
                    link: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
                    id,
                    name,
                };

                if (logo.id !== "") await deleteFolderFiles(logo.id, muniInfoID);
            }
        }
    }

    const result = await BrgyInformation.findOneAndUpdate(
        { brgy: brgy },
        {
            $set: {
                story,
                mission,
                vision,
                email,
                tel_no,
                address,
                banner: bannerNew === null ? banner : bannerNew,
                logo: logoNew === null ? logo : logoNew,
                theme: theme
            },
        },
        { new: true }
    ).save()

    return !result
        ? res.status(400).json({ error: "Info is not updated" })
        : res.status(200).json(result);
};

module.exports = {
    GetBrgyInfo,
    GetBrgys,
    CreateBrgyInfo,
    UpdateBrgyInfo,
};