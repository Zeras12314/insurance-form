// index.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables (.env)
dotenv.config();

// Fix __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// ✅ Allow requests from your Angular dev server
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://insurance-form-eight.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json()); // Parse JSON bodies

// Load email template
const templatePath = path.join(__dirname, "emailTemplate.html");
const template = fs.readFileSync(templatePath, "utf-8");

// Helper: Replace placeholders with form data
function formatEmail(data) {
  let filled = template;

  // ✅ Add a header-specific placeholder for fullName
  if (data.step1.fullName) {
    filled = filled.replace("{{fullNameHeader}}", data.step1.fullName);
  } else if (data.step5.fullName) {
    filled = filled.replace("{{fullNameHeader}}", data.step5.fullName);
  }

  // Step 1
  for (const key in data.step1) {
    filled = filled.replace(`{{${key}}}`, data.step1[key]);
  }

  // Step 2 (illnessFunding)
  for (const key in data.step2.illnessFunding) {
    filled = filled.replace(
      `{{${key}}}`,
      data.step2.illnessFunding[key] ? "Yes" : "No"
    );
  }
  filled = filled.replace(
    "{{insurancePreference}}",
    data.step2.insurancePreference
  );

  // Step 3
  filled = filled.replace(
    "{{savingsSufficiency}}",
    data.step3.savingsSufficiency
  );
  filled = filled.replace("{{monthlyExpenses}}", data.step3.monthlyExpenses);

  // Step 4
  filled = filled.replace(
    "{{existingInsurance}}",
    data.step4.existingInsurance
  );
  for (const key in data.step4.benefits) {
    filled = filled.replace(
      `{{${key}}}`,
      data.step4.benefits[key] ? "Yes" : "No"
    );
  }

  // Step 5
  for (const key in data.step5) {
    filled = filled.replace(`{{${key}}}`, data.step5[key]);
  }

  return filled;
}

// Nodemailer transporter (using Gmail + App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API endpoint
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;
    // console.log("📥 Received:", formData);

    const emailHtml = formatEmail(formData);

    const mailOptions = {
      from: `"Form Bot" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "📩 New Form Submission",
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    // console.log("✅ Email sent:", info.messageId);

    res.json({
      success: true,
      message: "Form submitted and emailed successfully!",
    });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
