// controllers/survey/listSurveys.controller.js
const { listSurveysService } = require("../../services/survey/listSurveysService");
const Logger = require("../../utils/auditLog");

exports.listSurveys = async (req, res, next) => {
  try {
    const result = await listSurveysService({
      query: req.query,
      user: req.user,
    });
    
    res.status(200).json(result);
  } catch (err) {
    Logger.error("listSurveys", "Error listing surveys", {
      error: err,
      req
    });
    next(err);
  }
};