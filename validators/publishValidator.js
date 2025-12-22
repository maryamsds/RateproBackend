// validators/publishValidator.js
/**
 * Pre-publish validation for surveys
 * Ensures survey is complete and ready for distribution
 */

exports.validateSurveyForPublish = (survey) => {
  const errors = [];

  // 1. Must have at least one question
  const allQuestions = [
    ...(survey.questions || []),
    ...(survey.sections?.flatMap(s => s.questions) || [])
  ];

  if (!allQuestions.length) {
    errors.push("Survey must have at least one question");
  }

  // 2. All required questions must have questionText
  allQuestions.forEach((q, idx) => {
    if (!q.questionText?.trim()) {
      errors.push(`Question ${idx + 1} is missing question text`);
    }
  });

  // 3. Target audience must be defined (unless public)
  if (!survey.settings?.isPublic) {
    const audience = survey.targetAudience;
    if (!audience?.audienceType) {
      errors.push("Target audience must be defined for non-public surveys");
    }
    if (audience?.audienceType === "custom") {
      const hasRecipients = 
        (audience.users?.length > 0) || 
        (audience.contacts?.length > 0);
      if (!hasRecipients) {
        errors.push("Custom audience must have at least one recipient");
      }
    }
    if (audience?.audienceType === "category" && !audience.categories?.length) {
      errors.push("Category audience must have at least one category selected");
    }
  }

  // 4. Logic rule consistency check
  const questionIds = new Set(allQuestions.map(q => q.id).filter(Boolean));
  allQuestions.forEach(q => {
    (q.logicRules || []).forEach(rule => {
      if (rule.nextQuestionId && !questionIds.has(rule.nextQuestionId)) {
        errors.push(
          `Logic rule in "${q.questionText?.slice(0, 30)}..." references non-existent question ID: ${rule.nextQuestionId}`
        );
      }
    });
  });

  // 5. Choice questions must have options
  const choiceTypes = ["radio", "checkbox", "select", "multiple_choice", "imageChoice", "ranking"];
  allQuestions.forEach(q => {
    if (choiceTypes.includes(q.type) && (!q.options || q.options.length < 2)) {
      errors.push(`Question "${q.questionText?.slice(0, 30)}..." requires at least 2 options`);
    }
  });

  // 6. Scale/NPS questions validation (optional enhancement)
  // Add more validations as needed

  return {
    valid: errors.length === 0,
    errors
  };
};