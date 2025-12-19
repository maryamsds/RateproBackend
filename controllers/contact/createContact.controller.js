// RateproBackend/controllers/contact/createContact.controller.js
const ContactService = require("../../services/contact/contactService");

exports.createContact = async (req, res) => {
  const contact = await ContactService.create({
    tenantId: req.tenantId,
    payload: req.body,
  });
  res.status(201).json(contact);
};