// services/survey/schedulingService.js
module.exports = {
  applySchedule(survey, data) {
    const { startDate, endDate, timezone, autoPublish, repeat } = data;

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    const now = new Date();

    if (isNaN(start.getTime())) {
      throw new Error("Invalid startDate");
    }

    if (end && start >= end) {
      throw new Error("startDate must be before endDate");
    }

    // Save schedule block
    survey.schedule = {
      startDate: start,
      endDate: end,
      timezone: timezone || "Asia/Karachi",
      autoPublish: !!autoPublish,
      repeat: repeat || { enabled: false, frequency: "none" },
      publishedAt: null
    };

    // Status logic
    if (autoPublish && start <= now) {
      survey.status = "active";
      survey.schedule.publishedAt = now;
    } else {
      survey.status = "scheduled";
    }

    return survey;
  }
};
