const mongoose = require("mongoose");
const ServicesForm = require("./service_forms.model");

const GetAllServiceForm = async (req, res) => {
    try {
        const { service_doc_id } = req.query;

        const result = await ServicesForm.find({ services: service_doc_id }, { services: 0 });

        return !result
            ? res.status(400).json({ error: "No such Service Form" })
            : res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const CreateServiceForm = async (req, res) => {
    try {
        const service_form = req.body;

        if (!mongoose.Types.ObjectId.isValid(service_form.services)) {
            return res.status(400).json({ error: "Not Valid Brgy Service" });
        }

        const result = await ServicesForm.create({ ...service_form });

        return res.json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const UpdateServiceForm = async (req, res) => {
    try {
        const service = req.body;

        if (!mongoose.Types.ObjectId.isValid(service._id)) {
            return res.status(400).json({ error: "No such service form" });
        }

        const result = await ServicesForm.findByIdAndUpdate(
            { _id: service._id },
            {...service},
            { new: true }
        );

        return res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

const GetActiveForm = async (req, res) => {
    try {
        const { service_doc_id } = req.query;

        const result = await ServicesForm.find({ $and: [{ services: service_doc_id }, { isActive: true }] }).populate('services');

        return !result
            ? res.status(400).json({ error: "No such Service Form" })
            : res.status(200).json(result);
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = {
    GetAllServiceForm,
    CreateServiceForm,
    UpdateServiceForm,
    GetActiveForm,
};
