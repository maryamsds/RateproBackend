// controllers/audience/segmentation.controller.js
const SegmentationService = require("../../services/audience/segmentationService");


exports.createSegment = async (req, res) => {
  const segment = await SegmentationService.createSegment({
    tenantId: req.tenantId,
    payload: req.body,
  });
  res.status(201).json(segment);
};

exports.listSegments = async (req, res) => {
  const segments = await SegmentationService.listSegments({
    tenantId: req.tenantId,
  });
  res.json(segments);
};

exports.previewSegment = async (req, res) => {
  const result = await SegmentationService.previewSegment({
    tenantId: req.tenantId,
    segmentId: req.params.id,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.json(result);
};

exports.countSegment = async (req, res) => {
  const result = await SegmentationService.countSegment({
    tenantId: req.tenantId,
    segmentId: req.params.id,
  });
  res.json(result);
};

exports.listContactsBySegment = async (req, res) => {
  const result = await SegmentationService.listContactsBySegment({
    tenantId: req.tenantId,
    segmentId: req.params.id,
    page: req.query.page,
    limit: req.query.limit,
    search: req.query.search,
  });

  res.json(result);
};
