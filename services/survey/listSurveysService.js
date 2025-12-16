// services/survey/listSurveys.service.js
const Survey = require("../../models/Survey");

exports.listSurveysService = async ({ query, user }) => {
  const {
    search = "",
    status,
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = query;

  const skip = (page - 1) * limit;

  const filter = {
    deleted: false,
    title: { $regex: search, $options: "i" },
  };

  if (user.role !== "admin") {
    filter.tenant = user.tenant;
  }

  if (status) filter.status = status;

  const total = await Survey.countDocuments(filter);

  const surveys = await Survey.find(filter)
    .populate("createdBy", "name email")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .lean();

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    surveys,
  };
};