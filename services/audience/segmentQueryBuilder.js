// services/audience/segmentQueryBuilder.js
/**
 * Converts safe frontend filters → Mongo query
 * Prevents $where, $expr, injection
 */
function buildContactQuery(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.hasTag) {
    query.tags = { $in: [filters.hasTag] };
  }

  if (filters.autoTag) {
    query.autoTags = { $in: [filters.autoTag] };
  }

  if (filters.inactiveDays) {
    const daysAgo = new Date(Date.now() - filters.inactiveDays * 86400000);
    query.lastActivity = { $lte: daysAgo };
  }

  if (filters.createdLastDays) {
    const since = new Date(Date.now() - filters.createdLastDays * 86400000);
    query.createdAt = { $gte: since };
  }

  return query;
}

module.exports = { buildContactQuery };
