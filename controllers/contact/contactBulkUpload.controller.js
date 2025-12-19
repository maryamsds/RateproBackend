// controllers/contact/contactBulkUpload.controller.js
const XLSX = require("xlsx");
const ContactService = require("../../services/contact/contactService");
const Logger = require("../../utils/auditLog");

/**
 * POST /api/contacts/bulk-upload
 */
exports.bulkUploadContacts = async (req, res) => {
  try {
    const currentUser = req.user;

    // 🔒 Role check
    if (currentUser.role !== "companyAdmin") {
      return res.status(403).json({
        message: "Access denied: Only CompanyAdmin can perform bulk upload",
      });
    }

    // 📄 File check
    if (!req.file) {
      return res.status(400).json({
        message: "No Excel file uploaded",
      });
    }

    // 📘 Read Excel file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
      raw: false,
    });

    if (!rows.length) {
      return res.status(400).json({
        message: "Excel file is empty",
      });
    }

    /**
     * Expected Excel Headers:
     * name | email | phone | company | tags | status
     */
    const normalizedRows = rows.map((row, index) => ({
      rowNumber: index + 2, // Excel header offset
      name: row.name?.toString().trim(),
      email: row.email?.toString().trim(),
      phone: row.phone?.toString().trim(),
      company: row.company?.toString().trim(),
      tags: row.tags,
      status: row.status,
    }));

    // 🚀 Delegate to Service
    const result = await ContactService.bulkCreate({
      tenantId: req.tenantId,
      rows: normalizedRows,
    });

    // 🧾 Audit log
    Logger.info("bulkUploadContacts", "Bulk upload completed successfully", {
      context: {
        userId: currentUser._id,
        status: "Success",
        details: `Inserted: ${result.inserted}, Failed: ${result.errors.length}`
      },
      req
    });

    return res.status(201).json({
      message: "Bulk upload completed",
      inserted: result.inserted,
      failed: result.errors.length,
      errors: result.errors.length ? result.errors : null,
    });
  } catch (err) {
    console.error("Bulk upload failed:", err);

    Logger.error("bulkUploadContacts", "Bulk upload failed", {
      error: err,
      context: {
        userId: req.user?._id,
        status: "Failed"
      },
      req
    });

    res.status(500).json({
      message: "Bulk upload failed",
      error: err.message,
    });
  }
};
