// // models/ContactManagement.js
// const mongoose = require("mongoose");

// const ContactSchema = new mongoose.Schema({
//     name:
//     {
//         type: String,
//         required: true
//     },

//     email:
//     {
//         type: String,
//         required: true,
//         unique: true
//     },

//     phone:
//     {
//         type: String
//     },

//     company:
//     {
//         type: String
//     },
//     segment:
//     {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "AudienceSegment"
//     },

//     contactCategories: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "UserCategory",
//         }
//     ],

//     tags:
//     {
//         type: String
//     },

//     autoTags: {
//         type: [String],
//         default: [],
//     },

//     enrichment: {
//         country: { type: String },
//         countryCode: { type: String },
//         city: { type: String },
//         region: { type: String },
//         gender: { type: String },
//         company: { type: String },
//         domain: { type: String },
//         inferredAt: { type: Date },
//         source: { type: String },
//     },

//     status:
//     {
//         type: String,
//         enum: ["Active", "Inactive", "Blocked"], default: "Active"
//     },

//     tenantId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Tenant",
//         required: function () {
//             return this.role === "companyAdmin" || this.role === "member";
//         },
//     },
//     lastActivity:
//     {
//         type: Date,
//         default: Date.now
//     },

//     createdAt:
//     {
//         type: Date,
//         default: Date.now
//     },
// });

// module.exports = mongoose.model("Contact", ContactSchema);
// models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true,
    index: true,
  },

  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,

  tags: {
    type: [String],
    default: [],
    index: true,
  },

  autoTags: {
    type: [String],
    default: [],
    index: true,
  },

  contactCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCategory",
      index: true,
    },
  ],

  enrichment: {
    country: String,
    countryCode: String,
    city: String,
    region: String,
    gender: String,
    company: String,
    domain: String,
    inferredAt: Date,
    source: String,
  },

  status: {
    type: String,
    enum: ["Active", "Inactive", "Blocked"],
    default: "Active",
    index: true,
  },

  lastActivity: {
    type: Date,
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// 🔥 Multi-tenant email uniqueness (CORRECT WAY)
ContactSchema.index(
  { tenantId: 1, email: 1 },
  { unique: true }
);

module.exports = mongoose.model("Contact", ContactSchema);