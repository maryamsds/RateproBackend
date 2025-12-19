// controllers/permissionController.js
const Permission = require('../models/Permission');
const Logger = require("../utils/logger");

// GET: Get all permissions
exports.getPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find().select('_id name description group');

    if (!permissions || permissions.length === 0) {
      Logger.warn("getPermissions", "No permissions found", {
        context: {
          triggeredBy: req.user?.email,
          tenantId: req.tenantId,
          statusCode: 404
        },
        req
      });
      return res.status(404).json({ message: "No permissions found" });
    }

    Logger.warn("getPermissions", "No permissions found", {
      context: {
        triggeredBy: req.user?.email,
        tenantId: req.tenantId,
        statusCode: 404
      },
      req
    });

    res.status(200).json({ permissions });
  } catch (err) {
    console.error("Error getting permissions:", err);

    Logger.error("getPermissions", "Error fetching permissions", {
      error: err,
      context: {
        triggeredBy: req.user?.email,
        tenantId: req.tenantId
      },
      req
    });

    res.status(500).json({ message: "Failed to fetch permissions", error: err.message });
  }
};
