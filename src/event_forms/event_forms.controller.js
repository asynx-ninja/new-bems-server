const mongoose = require("mongoose");
const EventsForm = require("./event_forms.model");

const GetAllEventsForm = async (req, res) => {
  try {
    const { event_doc_id } = req.query;

    const result = await EventsForm.find(
      { event: event_doc_id },
      { event: 0 }
    );

    return !result
      ? res.status(400).json({ error: "No such Events Form" })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const GetActiveForm = async (req, res) => {
  try {
    const { event_doc_id  } = req.query;

    const result = await EventsForm.find({ $and: [{ event: event_doc_id }, { isActive: true }] }).populate('events');

    return !result
      ? res.status(400).json({ error: "No such Events Form" })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const CreateEventsForm = async (req, res) => {
  try {
    const { event_doc_id } = req.query;
    const { form, section, form_name, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(event_doc_id)) {
      return res.status(400).json({ error: "Not Valid Events Form" });
    }
    const newForm = [form, section];

    const result = await EventsForm.create({
      event: event_doc_id,
      form_name: form_name,
      form: newForm,
      isActive: isActive,
    });

    return res.json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const UpdateEventsForm = async (req, res) => {
  try {
    const { event } = req.body;

    if (!mongoose.Types.ObjectId.isValid(event._id)) {
      return res.status(400).json({ error: "No such service form" });
    }

    const result = await EventsForm.findByIdAndUpdate(
      { _id: event._id },
      {
        form_name: event.form_name,
        form: event.form,
        isActive: event.isActive,
      },
      { new: true }
    );

    return res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  GetAllEventsForm,
  CreateEventsForm,
  UpdateEventsForm,
  GetActiveForm,
};
