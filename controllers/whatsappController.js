// // controllers/whatsappController.js
// const WhatsAppSetting = require('../models/WhatsAppSetting');
// const Joi = require('joi');

// const schema = Joi.object({
//   provider: Joi.string().valid('twilio','meta').required(),
//   twilio: Joi.object({
//     accountSid: Joi.string().allow('', null),
//     authToken: Joi.string().allow('', null),
//     fromNumber: Joi.string().allow('', null),
//   }).optional(),
//   meta: Joi.object({
//     phoneNumberId: Joi.string().allow('', null),
//     accessToken: Joi.string().allow('', null),
//     fromNumber: Joi.string().allow('', null),
//   }).optional(),
//   isActive: Joi.boolean().optional(),
// });

// exports.upsertWhatsAppSetting = async (req, res, next) => {
//   try {
//     const { error, value } = schema.validate(req.body);
//     if (error) return res.status(400).json({ message: error.details[0].message });

//     const tenantId = req.tenantId;
//     if (!tenantId) return res.status(403).json({ message: 'No tenant' });

//     let setting = await WhatsAppSetting.findOne({ tenant: tenantId });
//     if (!setting) {
//       setting = new WhatsAppSetting(Object.assign({}, value, { tenant: tenantId, createdBy: req.user._id }));
//     } else {
//       Object.assign(setting, value);
//     }
//     await setting.save();
//     res.status(200).json({ message: 'WhatsApp settings saved', setting });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getWhatsAppSetting = async (req, res, next) => {
//   try {
//     const tenantId = req.tenantId;
//     let setting = await WhatsAppSetting.findOne({ tenant: tenantId });
//     if (!setting) return res.status(404).json({ message: 'No settings found' });
//     res.status(200).json({ setting });
//   } catch (err) {
//     next(err);
//   }
// };

// controllers/whatsappController.js
const WhatsAppSetting = require('../models/WhatsAppSetting');
const Joi = require('joi');
const Logger = require("../utils/logger");

const schema = Joi.object({
  provider: Joi.string().valid('twilio', 'meta').required(),
  twilio: Joi.object({
    accountSid: Joi.string().allow('', null),
    authToken: Joi.string().allow('', null),
    fromNumber: Joi.string().allow('', null),
  }).optional(),
  meta: Joi.object({
    phoneNumberId: Joi.string().allow('', null),
    accessToken: Joi.string().allow('', null),
    fromNumber: Joi.string().allow('', null),
  }).optional(),
  isActive: Joi.boolean().optional(),
});

// Create or update WhatsApp settings
exports.upsertWhatsAppSetting = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      Logger.warn("saveWhatsAppSetting", "Validation failed", {
        context: {
          error: error.details[0].message,
          body: req.body,
          userId: req.user?._id
        },
        req
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    const tenantId = req.tenantId;
    if (!tenantId) {
      Logger.warn("saveWhatsAppSetting", "Attempt without tenant", {
        context: { userId: req.user?._id },
        req
      }); return res.status(403).json({ message: 'No tenant' });
    }

    let setting = await WhatsAppSetting.findOne({ tenant: tenantId });
    if (!setting) {
      Logger.info("saveWhatsAppSetting", "Creating new WhatsApp setting", {
        context: { tenantId, userId: req.user?._id },
        req
      }); setting = new WhatsAppSetting(Object.assign({}, value, { tenant: tenantId, createdBy: req.user._id }));
    } else {
      Logger.info("saveWhatsAppSetting", "Updating existing WhatsApp setting", {
        context: { tenantId, userId: req.user?._id },
        req
      });
      Object.assign(setting, value);
    }

    await setting.save();
    Logger.info("saveWhatsAppSetting", "WhatsApp setting saved successfully", {
      context: { tenantId, userId: req.user?._id, settingId: setting._id },
      req
    });

    res.status(200).json({ message: 'WhatsApp settings saved', setting });
  } catch (err) {
    Logger.error("saveWhatsAppSetting", "Error saving WhatsApp setting", {
      error: err,
      req
    });
    next(err);
  }
};

// Get WhatsApp settings
exports.getWhatsAppSetting = async (req, res, next) => {
  try {
    const tenantId = req.tenantId;
    Logger.info("getWhatsAppSetting", "Fetching WhatsApp setting", {
      context: { tenantId, userId: req.user?._id },
      req
    });
    let setting = await WhatsAppSetting.findOne({ tenant: tenantId });
    if (!setting) {
      Logger.warn("getWhatsAppSetting", "No WhatsApp settings found", {
        context: { tenantId, userId: req.user?._id },
        req
      });
      return res.status(404).json({ message: 'No settings found' });
    }

    Logger.info("getWhatsAppSetting", "WhatsApp setting retrieved successfully", {
      context: {
        tenantId,
        userId: req.user?._id,
        settingId: setting._id
      },
      req
    });
    res.status(200).json({ setting });
  } catch (err) {
    Logger.error("getWhatsAppSetting", "Error fetching WhatsApp setting", {
      error: err,
      req
    });
    next(err);
  }
};