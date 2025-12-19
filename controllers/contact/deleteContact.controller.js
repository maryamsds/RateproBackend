// controllers/contact/deleteContact.controller.js
const ContactService = require("../../services/contact/contactService");

/**
 * DELETE /api/contacts/:id
 */
exports.deleteContact = async (req, res) => {
  await ContactService.remove({
    tenantId: req.tenantId,
    contactId: req.params.id,
  });

  res.json({ message: "Contact deleted successfully" });
};
