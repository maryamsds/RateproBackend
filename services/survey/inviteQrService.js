// services/survey/inviteQRService.js
const SurveyInvite = require("../../models/SurveyInvite");
const { generateQRCode } = require("../../utils/qrUtils");

exports.generateInviteQRCodeService = async ({ inviteId }) => {
  const invite = await SurveyInvite.findById(inviteId)
    .populate("survey", "_id");

  if (!invite) return null;

  const url = `${process.env.FRONTEND_URL}/take-survey/${invite.token}`;

  const qr = await generateQRCode(url);

  return {
    qr,
    token: invite.token,
  };
};