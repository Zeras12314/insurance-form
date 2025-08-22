import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import serverless from "serverless-http";
require("./bin/www");

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // Parse JSON bodies

// ✅ Custom CORS middleware to handle preflight properly
const allowedOrigins = [
  "http://localhost:4200",
  "https://insurance-form-server.vercel.app",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// Load email template
const templatePath = path.join(__dirname, "../emailTemplate.html");
const template = fs.readFileSync(templatePath, "utf-8");

// Helper function
function formatEmail(data) {
  let filled = template;
  if (data.step1?.fullName) filled = filled.replace("{{fullNameHeader}}", data.step1.fullName);
  else if (data.step5?.fullName) filled = filled.replace("{{fullNameHeader}}", data.step5.fullName);

  for (const key in data.step1) filled = filled.replace(`{{${key}}}`, data.step1[key]);
  for (const key in data.step2?.illnessFunding || {}) {
    filled = filled.replace(`{{${key}}}`, data.step2.illnessFunding[key] ? "Yes" : "No");
  }
  filled = filled.replace("{{insurancePreference}}", data.step2?.insurancePreference || "");
  filled = filled.replace("{{savingsSufficiency}}", data.step3?.savingsSufficiency || "");
  filled = filled.replace("{{monthlyExpenses}}", data.step3?.monthlyExpenses || "");
  filled = filled.replace("{{existingInsurance}}", data.step4?.existingInsurance || "");
  for (const key in data.step4?.benefits || {}) {
    filled = filled.replace(`{{${key}}}`, data.step4.benefits[key] ? "Yes" : "No");
  }
  for (const key in data.step5 || {}) filled = filled.replace(`{{${key}}}`, data.step5[key]);

  return filled;
}

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// API route
app.post("/submit-form", async (req, res) => {
  try {
    const formData = req.body;
    const emailHtml = formatEmail(formData);
    await transporter.sendMail({
      from: `"Form Bot" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "📩 New Form Submission",
      html: emailHtml,
    });

    res.json({ success: true, message: "Form submitted and emailed successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// ✅ Only for local dev
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
}

// ✅ Export handler for Vercel
export default serverless(app);
