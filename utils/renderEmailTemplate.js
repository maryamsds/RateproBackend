// utils/renderEmailTemplate.js
const EmailTemplate = require('../models/EmailTemplate');

const renderTemplate = async ({ templateType, templateData = {} }) => {
  const template = await EmailTemplate.findOne({
    type: templateType,
    isActive: true,
  }).lean();

  if (!template) {
    throw new Error(`Email template not found: ${templateType}`);
  }

  let html = template.body;

  // Conditional blocks
  html = html.replace(
    /\$\{\s*if\s+([\w]+)\s*===\s*"(\w+)"\s*\?\s*`([\s\S]*?)`\s*:\s*`([\s\S]*?)`\s*\}/g,
    (_, variable, expected, yes, no) =>
      templateData[variable] === expected ? yes : no
  );

  // Variable replacement
  for (const [key, value] of Object.entries(templateData)) {
    html = html.replace(
      new RegExp(`\\$\\{\\s*${key}\\s*\\}`, 'g'),
      value ?? ''
    );
  }

  return {
    subject: template.subject,
    html,
  };
};

module.exports = renderTemplate;