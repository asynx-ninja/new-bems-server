const mongoose = require("mongoose");
const User = require('./account_login.model')
const BCrypt = require("../../global/config/BCrypt");
const { Send, sendEmail } = require("../../global/config/Nodemailer");
const GeneratePIN = require("../../global/functions/GeneratePIN");

const GetCredentials = async (req, res) => {
  try {
    const { username, password } = req.params;

    const result = await User.find(
      { username: username },
      { password: 1, type: 1, email: 1, "address.brgy": 1, isApproved: 1, isArchived: 1 }
    );

    if (result.length === 0 || !result) {
      return res.status(400).json({ error: `No such user` });
    }

    if (!(await BCrypt.compare(password, result[0].password))) {
      return res.status(400).json({ error: `Wrong password` });
    }

    // If the account is not approved, send an error message
    if (result[0].isApproved === "Denied") {
      return res
        .status(400)
        .json({ error: `Your account is ${result[0].isApproved}` });
    } else if (result[0].isApproved === "Pending") {
      // Mask part of the email address
      const emailParts = result[0].email.split("@");
      const maskedEmail = `${emailParts[0].slice(0, 3)}****@${emailParts[1]}`;

      return res.status(400).json({
        error: `Your account is still on pending. Please check your email: ${maskedEmail}`,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const SentPIN = async (req, res) => {
  try {
    const { email } = req.params;
    const { type } = req.body;

    const found = await User.find({ email: email });

    if (found.length === 0)
      return res.status(400).json({ error: "Email not registered!" });

    if (type !== found[0].type)
      return res.status(400).json({
        error: `Access denied: Only registered ${type} account can proceed.`,
      });

    const code = GeneratePIN();
    console.log(code);
    const result = await Send(
      email,
      "Password Security Code",
      "4 Digit PIN",
      code
    );

    if (!result.response) return res.status(400).json({ error: "Error email" });

    const update = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { pin: code },
      }
    );

    res.status(200).json({
      update,
      type: found[0].type,
      message: "Code has been successfully sent to your Email!",
    });
  } catch (err) {
    res.send(err.message);
  }
};

const CheckEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(200).json({ exists: true, type: existingUser.type });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CHECK PIN
const CheckPIN = async (req, res) => {
  try {
    const { email, pin } = req.params;
    const result = await User.find(
      { $and: [{ email: email }, { pin: pin }] },
      "_id"
    );

    return result.length === 0
      ? res.status(400).json({ error: `No such user` })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const UpdateCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    console.log("mm", username);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "No such user" });
    }

    const result = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          username: username,
          password: await BCrypt.hash(password),
        },
      },
      { new: true }
    );

    res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

const UpdatePasswordOnly = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          password: await BCrypt.hash(password),
        },
      },
      { new: true }
    );

    return !result
      ? res.status(400).json({ error: `No such user` })
      : res.status(200).json(result);
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  GetCredentials,
  SentPIN,
  CheckEmail,
  CheckPIN,
  UpdateCredentials,
  UpdatePasswordOnly,
};