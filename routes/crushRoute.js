// backend/routes/crushForm.js
const express = require("express");
const CrushForm = require("../models/crushModel");
const router = express.Router();
const nodemailer = require("nodemailer");

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Submit form data
router.post("/submit", async (req, res) => {
  try {
    const { crushName, userEmail, yesResponse, noResponse } = req.body;

    // Create a new form entry
    const newForm = new CrushForm({
      crushName,
      userEmail,
      yesResponse,
      noResponse,
    });

    // Save to MongoDB
    await newForm.save();

    // Return the saved data with its unique ID
    res.status(201).json({ success: true, data: newForm });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit form",
      error: error.message,
    });
  }
});

// Get form data by ID
router.get("/:id", async (req, res) => {
  try {
    const form = await CrushForm.findById(req.params.id);

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    res.status(200).json({ success: true, data: form });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch form",
      error: error.message,
    });
  }
});

// Send email when crush says "Yes"
router.post("/send-email", async (req, res) => {
  try {
    const { userEmail, crushName, response } = req.body;

    // Email content based on response
    const mailOptions = {
      from: `Crushu <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject:
        response === "yes"
          ? `${crushName} said YES! 💘`
          : `${crushName} said NO... 😢`,
      html:
        response === "yes"
          ? `
        <h1>Congratulations! 🎉</h1>
        <p>${crushName} said <strong>YES</strong> to being your Valentine!</p>
        <p>It's time to celebrate! 🌹</p>
      `
          : `
        <h1>Oh no... 😢</h1>
        <p>${crushName} said <strong>NO</strong> to being your Valentine.</p>
        <p>But don't worry, there are plenty of fish in the sea! 🐟</p>
      `,
    };
    // Send email
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message,
    });
  }
});

// backend/routes/crushForm.js
router.post("/expire-link/:id", async (req, res) => {
  try {
    const form = await CrushForm.findById(req.params.id);

    if (!form) {
      return res
        .status(404)
        .json({ success: false, message: "Form not found" });
    }

    // Mark the form as expired
    form.status = "expired";
    await form.save();

    res
      .status(200)
      .json({ success: true, message: "Link expired successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to expire link",
        error: error.message,
      });
  }
});
module.exports = router;
