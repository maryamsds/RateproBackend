// services/audience/taggingService.js
// Rule-based auto-tagging engine. Extend rules array to add new behaviors.

const DAYS = 24 * 60 * 60 * 1000;

const rules = [
  {
    name: 'New User',
    applies: ({ createdAt }) => {
      if (!createdAt) return false;
      const ageDays = (Date.now() - new Date(createdAt).getTime()) / DAYS;
      return ageDays <= 7;
    },
  },
  {
    name: 'Inactive (30 days)',
    applies: ({ lastActivity }) => {
      if (!lastActivity) return false;
      const idleDays = (Date.now() - new Date(lastActivity).getTime()) / DAYS;
      return idleDays >= 30;
    },
  },
  {
    name: 'VIP',
    applies: ({ tags, status }) => {
      const hasVipTag = Array.isArray(tags)
        ? tags.some(t => t?.toLowerCase?.().includes('vip'))
        : typeof tags === 'string' && tags.toLowerCase().includes('vip');
      return hasVipTag || status === 'VIP';
    },
  },
];

function deriveAutoTags(contact = {}) {
  const output = new Set();
  rules.forEach((rule) => {
    if (rule.applies(contact)) output.add(rule.name);
  });
  return Array.from(output);
}

function mergeTags(manualTags, autoTags) {
  const manual = Array.isArray(manualTags)
    ? manualTags
    : typeof manualTags === 'string'
      ? manualTags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
  const merged = new Set([...manual, ...autoTags]);
  return {
    mergedArray: Array.from(merged),
    mergedString: Array.from(merged).join(', '),
  };
}

function recomputeTags(contact) {
  const autoTags = deriveAutoTags(contact);
  const merged = new Set([
    ...(contact.tags || []),
    ...autoTags,
  ]);

  return {
    autoTags,
    tags: Array.from(merged),
  };
}

module.exports = {
  deriveAutoTags,
  mergeTags,
  recomputeTags,
};
