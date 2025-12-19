// services/audience/segmentationService.js
const AudienceSegment = require("../../models/AudienceSegment");
const Contact = require("../../models/Contact");
const { buildContactQuery } = require("./segmentQueryBuilder");
const SegmentCache = require("./segmentCacheService");

class SegmentationService {
  static async createSegment({ tenantId, payload }) {
    const { name, description, filters } = payload;

    if (!name || !filters) {
      throw new Error("Name & filters required");
    }

    const query = buildContactQuery(filters);

    return AudienceSegment.create({
      tenantId,
      name,
      description,
      query,
      isSystem: false,
    });
  }

  static async listSegments({ tenantId }) {
    return AudienceSegment.find({ tenantId }).sort({ createdAt: -1 });
  }

  static async previewSegment({ tenantId, segmentId, page = 1, limit = 10 }) {
    const segment = await AudienceSegment.findOne({ _id: segmentId, tenantId });
    if (!segment) throw new Error("Segment not found");

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find({ tenantId, ...segment.query })
        .skip(skip)
        .limit(limit)
        .sort({ lastActivity: -1 }),
      Contact.countDocuments({ tenantId, ...segment.query }),
    ]);

    return { segment, contacts, total, page, limit };
  }

  static async listContactsBySegment({
    tenantId,
    segmentId,
    page = 1,
    limit = 10,
    search = "",
  }) {
    const segment = await AudienceSegment.findOne({
      _id: segmentId,
      tenantId,
    });

    if (!segment) throw new Error("Segment not found");

    const filter = {
      tenantId,
      ...segment.query,
    };

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { email: regex },
        { company: regex },
        { tags: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Contact.find(filter)
        .sort({ lastActivity: -1 })
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(filter),
    ]);

    return {
      segment: {
        id: segment._id,
        name: segment.name,
      },
      items,
      total,
      page,
      limit,
    };
  }

  static async countSegment({ tenantId, segmentId }) {
    const cacheKey = SegmentCache.makeKey(tenantId, segmentId);

    const cached = SegmentCache.get(cacheKey);
    if (cached?.count !== undefined) {
      return cached;
    }

    const segment = await AudienceSegment.findOne({ _id: segmentId, tenantId });
    if (!segment) throw new Error("Segment not found");

    const count = await Contact.countDocuments({
      tenantId,
      ...segment.query,
    });

    SegmentCache.set(cacheKey, { count });

    return { segmentId, count };
  }
}

module.exports = SegmentationService;