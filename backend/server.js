require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Set up Multer for video uploads
const storage = multer.memoryStorage(); // Store video in memory
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB max

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Emergency Schema
const emergencySchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  video: Buffer, // ✅ Stores video as binary data
  timestamp: { type: Date, default: Date.now },
});


const Emergency = mongoose.model("Emergency", emergencySchema);

// ✅ Handle Emergency Alert Request (Receives Video)
app.post("/api/emergency", upload.single("video"), async (req, res) => {
  try {
    console.log("📩 Received Emergency Request:", req.body);
    console.log("📩 File Data:", req.file);

    const { latitude, longitude } = req.body;
    const video = req.file ? req.file.buffer : null;

    if (!latitude || !longitude || !video) {
      return res.status(400).json({ error: "Latitude, Longitude, and Video are required" });
    }

    // Save to MongoDB
    const newEmergency = new Emergency({ latitude, longitude, video });
    await newEmergency.save();
    console.log("✅ Emergency saved to database!");

    // Send Email Alert
    await sendAlertEmail(latitude, longitude, video);

    res.status(201).json({ message: "✅ Emergency Alert Sent & Stored" });
  } catch (error) {
    console.error("❌ Error handling emergency:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// ✅ Function to Send Email with Video Attachment
const sendAlertEmail = async (latitude, longitude, video) => {
  try {
    console.log("📩 Sending email...");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send email to yourself
      subject: "🚨 Emergency Alert!",
      html: `
        <h2>Emergency Alert!</h2>
        <p>Latitude: ${latitude}</p>
        <p>Longitude: ${longitude}</p>
        <p>Attached is the recorded video.</p>
      `,
      attachments: [
        {
          filename: "emergency_video.webm",
          content: video, // Already a Buffer
          // Remove the encoding property
        },
      ],
    };
    
    

    await transporter.sendMail(mailOptions);
    console.log("✅ Alert Email Sent!");
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));












// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

// // Set up multer for file uploads
// const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB file size limit

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("✅ MongoDB Connected!"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Define Emergency Schema
// const emergencySchema = new mongoose.Schema({
//   latitude: Number,
//   longitude: Number,
//   image: Buffer, // Store image as buffer in MongoDB
//   timestamp: { type: Date, default: Date.now },
// });

// const Emergency = mongoose.model("Emergency", emergencySchema);

// // Handle Emergency Alert Request
// app.post("/api/emergency", upload.single("image"), async (req, res) => {
//   try {
//     console.log("📩 Received Emergency Request:", req.body);

//     const { latitude, longitude } = req.body;
//     const image = req.file ? req.file.buffer : null; // Get the uploaded image

//     if (!latitude || !longitude || !image) {
//       return res.status(400).json({ error: "Latitude, Longitude, and Image are required" });
//     }

//     // Store in Database
//     const newEmergency = new Emergency({ latitude, longitude, image });
//     await newEmergency.save();

//     console.log("✅ Emergency saved to database!");

//     // Send Alert Email
//     await sendAlertEmail(latitude, longitude, image);

//     res.status(201).json({ message: "Emergency Alert Sent & Stored" });
//   } catch (error) {
//     console.error("❌ Error handling emergency:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Function to send an email with image attachment
// const sendAlertEmail = async (latitude, longitude, image) => {
//   try {
//     console.log("📩 Sending email...");

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER, // Send email to yourself
//       subject: "🚨 Emergency Alert!",
//       html: `
//         <h2>Emergency Alert!</h2>
//         <p>Latitude: ${latitude}</p>
//         <p>Longitude: ${longitude}</p>
//         <p>Captured Image:</p>
//       `,
//       attachments: [
//         {
//           filename: "emergency_image.jpg",
//           content: image,
//           encoding: "base64",
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Alert Email Sent!");
//   } catch (error) {
//     console.error("❌ Error sending email:", error.message);
//   }
// };

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
