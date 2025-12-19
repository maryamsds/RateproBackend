// routes/segmentation.routes.js
const express = require("express");
const router = express.Router();

const { setTenantId } = require("../middlewares/tenantMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const segmentationController =
  require("../controllers/audience/segmentation.controller");

/**
 * 🔹 CREATE SEGMENT
 * POST /api/segments
 */
router.post(
  "/",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  segmentationController.createSegment
);

/**
 * 🔹 LIST SEGMENTS
 * GET /api/segments
 */
router.get(
  "/",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  segmentationController.listSegments
);

/**
 * 🔹 PREVIEW SEGMENT CONTACTS
 * GET /api/segments/:id/preview
 */
router.get(
  "/:id/preview",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  segmentationController.previewSegment
);

/**
 * 🔹 COUNT SEGMENT CONTACTS
 * GET /api/segments/:id/count
 */
router.get(
  "/:id/count",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  segmentationController.countSegment
);

router.get(
  "/:id/contacts",
  setTenantId,
  allowRoles("companyAdmin", "admin"),
  segmentationController.listContactsBySegment
);

module.exports = router;
