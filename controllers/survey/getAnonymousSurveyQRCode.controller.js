// controllers/survey/getAnonymousSurveyQRCode.controller.js
const { generateAnonymousSurveyQRCodeService } = require("../../services/survey/anonymousQrService");

exports.getAnonymousSurveyQRCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const qr = await generateAnonymousSurveyQRCodeService({
      surveyId: id,
      tenantId: req.user.tenant,
    });

    if (!qr) {
      return res.status(404).json({ message: "Survey not found or inactive" });
    }

    res.status(200).json(qr);
  } catch (err) {
    next(err);
  }
};
