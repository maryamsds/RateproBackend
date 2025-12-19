// controllers/contact/updateContact.controller.js
const ContactService = require("../../services/contact/contactService");

/**
 * PUT /api/contacts/:id
 */
exports.updateContact = async (req, res) => {
  const contact = await ContactService.update({
    tenantId: req.tenantId,
    contactId: req.params.id,
    payload: req.body,
  });

  res.json(contact);
};
