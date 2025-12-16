// utils/qrUtils.js
const QRCode = require("qrcode");

exports.generateQRCode = async (url) => {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: "H",
    width: 300,
    margin: 2,
  });
};