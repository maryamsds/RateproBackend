// utils/qrUtils.js
const QRCode = require("qrcode");
const { createCanvas, loadImage } = require("canvas");

/**
 * Generate QR Code (Node.js compatible)
 * @param {string} url
 * @param {object} options
 */
exports.generateQRCode = async (
  url,
  options = {}
) => {
  const {
    size = 300,
    backgroundColor = "#ffffff",
    foregroundColor = "#000000",
    logoPath = null,
    errorCorrectionLevel = "H",
  } = options;

  // 🔹 SIMPLE QR (no logo)
  if (!logoPath) {
    return QRCode.toDataURL(url, {
      errorCorrectionLevel,
      width: size,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });
  }

  // 🔹 QR with logo using canvas (Node.js compatible)
  try {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // Generate QR code on canvas
    await QRCode.toCanvas(canvas, url, {
      errorCorrectionLevel,
      width: size,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });

    // Add logo in center
    const logo = await loadImage(logoPath);
    const logoSize = size * 0.25; // 25% of QR size
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    // Draw white background for logo
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

    // Draw logo
    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("⚠️ [generateQRCode] Logo QR failed, falling back to simple QR:", err.message);
    // Fallback to simple QR
    return QRCode.toDataURL(url, {
      errorCorrectionLevel,
      width: size,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
    });
  }
};