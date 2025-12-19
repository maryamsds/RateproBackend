// routes/contact.routes.js
const express = require("express");
const router = express.Router();

const { excelUpload } = require("../middlewares/multer");
const { setTenantId } = require("../middlewares/tenantMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Controllers
const createContactController =
  require("../controllers/contact/createContact.controller");

const bulkUploadController =
  require("../controllers/contact/contactBulkUpload.controller");

// (Future controllers – placeholders)
const listContactsController = require("../controllers/contact/listContacts.controller");
const updateContactController = require("../controllers/contact/updateContact.controller");
const deleteContactController = require("../controllers/contact/deleteContact.controller");

/**
 * 🔹 CREATE CONTACT
 * POST /api/contacts
 */
router.post(
  "/",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  createContactController.createContact
);

/**
 * 🔹 BULK UPLOAD CONTACTS (Excel)
 * POST /api/contacts/bulk-upload
 */
router.post(
  "/bulk-upload",
  setTenantId,
  allowRoles("companyAdmin"),
  excelUpload.single("excel"),
  bulkUploadController.bulkUploadContacts
);

/**
 * 🔹 LIST CONTACTS (future)
 * GET /api/contacts
 */
router.get("/", setTenantId, allowRoles("companyAdmin", "admin"), listContactsController.list);

/**
 * 🔹 UPDATE CONTACT (future)
 * PUT /api/contacts/:id
 */
router.put("/:id", setTenantId, allowRoles("companyAdmin", "admin"), updateContactController.update);

/**
 * 🔹 DELETE CONTACT (future)
 * DELETE /api/contacts/:id
 */
router.delete("/:id", setTenantId, allowRoles("companyAdmin", "admin"), deleteContactController.deleteContact);

module.exports = router;
