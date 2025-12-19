// controllers/survey/getSurvey.controller.js
const { getSurveyByIdService } = require("../../services/survey/getSurveyService");
const Logger = require("../../utils/auditLog");

exports.getSurveyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    Logger.info("getSurveyById", "Request received for fetching survey by ID", {
      context: {
        surveyId: id,
        userId: req.user?._id,
        tenantId: req.user?.tenant,
      },
      req
    });

    const survey = await getSurveyByIdService({
      surveyId: id,
      tenantId: req.user.tenant,
    });

    if (!survey) {
      return res.status(404).json({ message: "Survey not found" });
    }

    res.status(200).json({ survey });
  } catch (err) {
    Logger.error("getSurveyById", "Error fetching survey by ID", {
      error: err,
      req
    });
    next(err);
  }
};
