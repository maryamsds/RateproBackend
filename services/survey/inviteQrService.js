// services/survey/inviteQRService.js
const path = require("path");
const SurveyInvite = require("../../models/SurveyInvite");
const { generateQRCode } = require("../../utils/qrUtils");

exports.generateInviteQRCodeService = async ({ inviteId }) => {
  console.log("🔲 [generateInviteQRCode] Starting for invite:", inviteId);

  const invite = await SurveyInvite.findById(inviteId)
    .populate("survey", "_id title");

  if (!invite) return null;

  const url = `https://rate-pro-public.vercel.app/survey/respond?token=${invite.token}`;
  console.log("🔲 [generateInviteQRCode] Generated URL:", url);
  const qr = await generateQRCode(url, {
    size: 256,
    backgroundColor: "#1fdae4",
    foregroundColor: "#111827",
    logoPath: path.join(__dirname, "../assets/qr_logo.png"),
  });
  console.log("🔲 [generateInviteQRCode] QR generated successfully");

  return {
    qr,
    url,
    token: invite.token,
    surveyId: invite.survey._id,
  };
};
