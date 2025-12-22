// services/survey/validateSurveyForPublishService.js
const validateSurveyForPublish = (survey) => {
  const errors = [];

  if (!survey.questions?.length) {
    errors.push("Survey must have at least one question");
  }

  if (!survey.targetAudience?.audienceType) {
    errors.push("Target audience must be defined");
  }

  // Validate logic rules for dead-ends
  const questionIds = new Set(survey.questions.map(q => q.id));
  survey.questions.forEach(q => {
    q.logicRules?.forEach(rule => {
      if (rule.nextQuestionId && !questionIds.has(rule.nextQuestionId)) {
        errors.push(`Logic rule in question "${q.questionText}" references non-existent question`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
};

module.exports = { validateSurveyForPublish };