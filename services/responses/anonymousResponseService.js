// services/responses/anonymousResponseService.js
const Survey = require("../../models/Survey");
const SurveyResponse = require("../../models/SurveyResponse");
const responseEvents = require("../../utils/events/responseEvents");

exports.handleAnonymousResponse = async ({ surveyId, payload, ip }) => {
    const survey = await Survey.findOne({
        _id: surveyId,
        status: "active",
        deleted: false,
    });

    if (!survey) {
        throw { status: 404, message: "Survey not found or inactive" };
    }

    const response = await SurveyResponse.create({
        survey: survey._id,
        tenant: survey.tenant,
        answers: payload.answers,
        review: payload.review,
        rating: payload.rating,
        score: payload.score,
        isAnonymous: true,
        ip,
        createdBy: null,
        user: null,
    });

    responseEvents.emit("response.created", {
        responseId: response._id,
        surveyId: response.survey,
        tenantId: response.tenant,
        isAnonymous: response.isAnonymous,
    });

    return response;
};