// controllers/contact/listContacts.controller.js
const ContactService = require("../../services/contact/contactService");

/**
 * GET /api/contacts
 */
exports.listContacts = async (req, res) => {
  const result = await ContactService.list({
    tenantId: req.tenantId,
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
    status: req.query.status,
  });

  res.json(result);
};
