const express = require("express");
const upload = require("../middleware/multer");
const File = require("../model/file_model");

const router = express.Router();

// Bulk file upload API
router.post("/upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      mimetype: file.mimetype,
      filepath: file.path,
    }));

    // Save file metadata to PostgreSQL
    await File.bulkCreate(files);

    res.json({ message: "Files uploaded successfully", files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all uploaded files
router.get("/files", async (req, res) => {
  try {
    const files = await File.findAll();
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
