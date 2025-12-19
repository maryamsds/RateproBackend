// controllers/survey/createSurvey.controller.js

const Survey = require("../../models/Survey");
const { validateSurveyCreate } = require("../../validators/surveyValidator");
const Logger = require("../../utils/auditLog");

module.exports = async function createSurvey(req, res, next) {
  try {
    const { error } = validateSurveyCreate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const survey = new Survey({
      ...req.body,
      tenant: req.user.tenant,
      createdBy: req.user._id,
      deleted: false
    });

    await survey.save();

    Logger.info("survey_create", "Survey created successfully", {
      context: {
        surveyId: survey._id,
        tenantId: req.user.tenant,
        createdBy: req.user._id
      },
      req
    });

    res.status(201).json({
      message: "Survey created",
      survey,
    });

  } catch (err) {
    Logger.error("survey_create", "Survey creation failed", {
      error: err,
      context: { tenantId: req.user.tenant },
      req
    });
    next(err);
  }
};