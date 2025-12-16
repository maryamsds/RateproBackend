// services/survey/anonymousQrService.js
const Survey = require("../../models/Survey");
const { generateQRCode } = require("../../utils/qrUtils");

exports.generateAnonymousSurveyQRCodeService = async ({ surveyId, tenantId }) => {
    const survey = await Survey.findOne({
        _id: surveyId,
        tenant: tenantId,
        deleted: false,
        status: "active",
    });

    if (!survey) return null;

    const url = `${process.env.FRONTEND_URL}/take-survey/public/${survey._id}`;

    const qr = await generateQRCode(url);

    return { qr };
};