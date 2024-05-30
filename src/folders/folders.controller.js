const Folder = require("./folders.model");

const { CreateBrgyFolder, CreateFolder } = require("../../global/utils/Drive");

const GetAllBrgyFolders = async (req, res) => {
  try {
    const result = await Folder.find({});

    return !result
      ? res.status(400).json({ error: `No such folders` })
      : res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const GetSpecificBrgyFolders = async (req, res) => {
  try {
    const { brgy } = req.query;

    const result = await Folder.find({ brgy: brgy });

    return !result
      ? res.status(400).json({ error: `No such folders` })
      : res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const CreateBrgyFolders = async (req, res) => {
  try {
    const { brgy } = req.query;

    const root_folder_id = await CreateBrgyFolder(brgy.toUpperCase());
    const events_folder_id = await CreateFolder("EVENTS", root_folder_id);
    const application_folder_id = await CreateFolder("APPLICATION", root_folder_id);
    const request_folder_id = await CreateFolder("REQUESTS", root_folder_id);
    const service_folder_id = await CreateFolder("SERVICES", root_folder_id);
    const pfp_folder_id = await CreateFolder("PFP", root_folder_id);
    const official_folder_id = await CreateFolder("OFFICIALS", root_folder_id);
    const info_folder_id = await CreateFolder("INFO", root_folder_id);
    const inquiries_folder_id = await CreateFolder("INQUIRIES", root_folder_id);
    const verification_folder_id = await CreateFolder("VERIFICATION", root_folder_id);
    const blotters_folder_id = await CreateFolder("BLOTTERS", root_folder_id);

    const result = await Folder.create({
      root: root_folder_id,
      events: events_folder_id,
      request: request_folder_id,
      service: service_folder_id,
      pfp: pfp_folder_id,
      official: official_folder_id,
      info: info_folder_id,
      inquiries: inquiries_folder_id,
      application: application_folder_id,
      verification: verification_folder_id,
      blotters: blotters_folder_id,
      brgy: brgy,
    });

    return !result
      ? res.status(400).json({ error: `No created folder` })
      : res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  GetAllBrgyFolders,
  GetSpecificBrgyFolders,
  CreateBrgyFolders,
};