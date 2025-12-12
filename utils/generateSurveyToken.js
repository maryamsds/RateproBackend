// utils/generateSurveyToken.js
const crypto = require("crypto");

const generateSurveyToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

module.exports = generateSurveyToken;
