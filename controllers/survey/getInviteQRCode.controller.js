// controllers/survey/getInviteQRCode.controller.js
const { generateInviteQRCodeService } = require("../../services/survey/inviteQrService");

exports.getInviteQRCode = async (req, res, next) => {
  try {
    const { inviteId } = req.params;

    const result = await generateInviteQRCodeService({ inviteId });

    if (!result) {
      return res.status(404).json({ message: "Invite not found" });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};