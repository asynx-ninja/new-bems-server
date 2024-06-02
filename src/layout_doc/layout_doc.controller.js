const mongoose = require("mongoose");
const Document = require("./layout_doc.model");

const GetAllDocumentForm = async (req, res) => {
    try {
        const { brgy_info, service } = req.query;

        const result = await Document.find({
            $and: [{ brgy_info: brgy_info }, { service: service }],
        });

        return !result
            ? res.status(400).json({ error: "No such Service Form" })
            : res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const CreateDocumentForm = async (req, res) => {
    try {
        const { checked } = req.query;
        const form = req.body;

        const result = await Document.create({ ...form, isActive: checked });

        return res.json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const UpdateDocumentForm = async (req, res) => {
    try {
        const { document } = req.body;

        if (!mongoose.Types.ObjectId.isValid(document._id)) {
            return res.status(400).json({ error: "No such document form" });
        }

        const result = await Document.findByIdAndUpdate(
            { _id: document._id },
            { ...document },
            { new: true }
        );

        return res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = {
    GetAllDocumentForm,
    CreateDocumentForm,
    UpdateDocumentForm
};
