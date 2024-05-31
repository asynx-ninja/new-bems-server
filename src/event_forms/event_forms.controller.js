const mongoose = require("mongoose");
const EventForm = require("./event_forms.model");


const GetAllEventsForm = async (req, res) => {
  try {
    const { event_doc_id } = req.query;

    const result = await EventForm.find({ event: event_doc_id }, { event: 0 });

    return !result
      ? res.status(400).json({ error: "No such Event Form" })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const GetActiveForm = async (req, res) => {
  try {
    const { event_doc_id } = req.query;

    const result = await EventForm.find({ $and: [{ event: event_doc_id }, { isActive: true }] }).populate('events');

    return !result
      ? res.status(400).json({ error: "No such Event Form" })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const CreateEventsForm = async (req, res) => {
  try {
    const {  event_doc_id,  } = req.query;
    const { form, section, title, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(event_doc_id)) {
      return res.status(400).json({ error: "Not Valid Events" });
  }

    const newForm = [form, section];

    const result = await EventForm.create({
      event: event_doc_id,
      form_title: title,
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
      return res.status(400).json({ error: "No such event form" });
    }

    const result = await EventForm.findByIdAndUpdate(
      { _id: event._id },
      {
        $set: {
          form_title: event.form_title,
          form: event.form,
          isActive: event.isActive,
        },
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
  GetActiveForm,
  CreateEventsForm,
  UpdateEventsForm,
};