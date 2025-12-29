// services/email/sendSurveyInviteService.js
const path = require("path");
const fs = require("fs");
const sendEmail = require("../../utils/sendEmail");
const { generateInviteQRCodeService } = require("../survey/inviteQrService");
const SurveyInvite = require("../../models/SurveyInvite");

const FRONTEND_SURVEY_URL = process.env.PUBLIC_URL_PROD;

const sendSurveyInvites = async ({ survey, invites, tenant }) => { // ✅ Added tenant parameter
    console.log("📧 [sendSurveyInvites] Starting", { surveyId: survey._id, inviteCount: invites.length });

    for (const invite of invites) {
        console.log(`📧 [sendSurveyInvites] Processing invite: ${invite._id} → ${invite.contact.email}`);

        const surveyLink = `${FRONTEND_SURVEY_URL}/survey/respond?token=${invite.token}`;

        const { qr, url } = await generateInviteQRCodeService({
            inviteId: invite._id,
        });
        console.log(`📧 [sendSurveyInvites] QR generated for: ${invite._id}`);

        // 🔹 Replace template placeholders
        const templateData = {
            recipientName: invite.contact.name || "Participant",
            surveyTitle: survey.title,
            surveyDescription: survey.description || "",
            surveyLink: url,
            qrCode: qr,
            companyName: tenant?.name || "RatePro", // ✅ Fixed: use tenant parameter
            companyLogo: tenant?.logoUrl || "",     // ✅ Fixed: use tenant parameter
            currentYear: new Date().getFullYear(),
        };

        await sendEmail({
            to: invite.contact.email,
            subject: `You're invited to participate in "${survey.title}"`,
            templateType: "survey_invite",
            templateData,
        });

        console.log(`✅ [sendSurveyInvites] Email sent: ${invite.contact.email}`);

        // 🔹 Mark as sent
        invite.status = "sent";
        await invite.save();
    }
    console.log("📧 [sendSurveyInvites] All emails sent successfully");

};

module.exports = sendSurveyInvites;