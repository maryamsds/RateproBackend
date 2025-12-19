// services/audience/segmentEngine.js
// Dynamic segment definitions for the Audience Intelligence Layer
// These are query blueprints; integrate with models to evaluate.

const buildDynamicSegments = () => ([
  {
    key: 'recentResponders',
    title: 'Responded in last 30 days',
    description: 'All users who responded in the last month',
    match: { lastActivity: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
  },
  {
    key: 'negativeFeedback',
    title: 'Negative feedback',
    description: 'Customers with negative feedback',
    match: { 'feedback.sentiment': { $lte: -0.2 } },
  },
  {
    key: 'recentlyServedEmployees',
    title: 'Employees served in last 7 days',
    description: 'Employees who were served in the last 7 days',
    match: { servedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, role: 'employee' },
  },
]);

module.exports = {
  buildDynamicSegments,
};
