// // controllers/ContactCategoryController.js
// const ContactCategory = require('../models/ContactCategory');
// const Joi = require('joi');

// // Joi Validation Schemas
// const createSchema = Joi.object({
//     name: Joi.string().min(2).max(50).required(),
//     type: Joi.string().valid('internal', 'external').default('internal'),
//     description: Joi.string().allow('', null),
// });

// const updateSchema = Joi.object({
//     name: Joi.string().min(2).max(50),
//     type: Joi.string().valid('internal', 'external'),
//     active: Joi.boolean(),
//     description: Joi.string().allow('', null),
// });

// // 🔹 CREATE
// exports.createCategory = async (req, res) => {
//     try {
//         if (!req.user || !req.tenantId)
//             return res.status(400).json({ message: "Invalid request context" });

//         const { error, value } = createSchema.validate(req.body);
//         if (error) return res.status(400).json({ message: error.details[0].message });

//         if (!['admin', 'companyAdmin'].includes(req.user.role))
//             return res.status(403).json({ message: 'Access denied' });

//         const exists = await ContactCategory.findOne({
//             tenant: req.tenantId,
//             name: value.name,
//         });
//         if (exists) return res.status(400).json({ message: 'Category already exists in this company' });

//         const category = await ContactCategory.create({
//             ...value,
//             tenant: req.tenantId,
//             createdBy: req.user._id,
//         });

//         res.status(201).json({ success: true, data: { category } });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };

// // 🔹 READ (All tenant categories)
// exports.getCategories = async (req, res) => {
//     try {
//         const filter = {
//             $or: [
//                 { isDefault: true },           // global defaults
//                 { tenant: req.tenantId },      // tenant’s own
//             ],
//             active: true,
//         };

//         const categories = await ContactCategory.find(filter)
//             .select("name type active isDefault createdAt")
//             .sort({ isDefault: -1, name: 1 }); // show defaults first

//         res.json({ success: true, count: categories.length, data: { categories } });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };

// // 🔹 UPDATE
// exports.updateCategory = async (req, res) => {
//     try {
//         const { error, value } = updateSchema.validate(req.body);
//         if (error) return res.status(400).json({ message: error.details[0].message });

//         if (!["admin", "companyAdmin"].includes(req.user.role))
//             return res.status(403).json({ message: "Access denied" });

//         // 🔒 Prevent editing default categories
//         const target = await ContactCategory.findById(req.params.id);
//         if (!target) return res.status(404).json({ message: "Category not found" });
//         if (target.isDefault)
//             return res.status(400).json({ message: "Default categories cannot be modified" });

//         // ✅ Update allowed only on tenant’s own categories
//         const category = await ContactCategory.findOneAndUpdate(
//             { _id: req.params.id, tenant: req.tenantId },
//             { $set: value },
//             { new: true, runValidators: true }
//         );

//         res.json({ success: true, data: { category } });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };

// // 🔹 SOFT DELETE (Deactivate)
// exports.deleteCategory = async (req, res) => {
//     try {
//         if (!["admin", "companyAdmin"].includes(req.user.role))
//             return res.status(403).json({ message: "Access denied" });

//         const target = await ContactCategory.findById(req.params.id);
//         if (!target) return res.status(404).json({ message: "Category not found" });
//         if (target.isDefault)
//             return res.status(400).json({ message: "Default categories cannot be deleted" });

//         const category = await ContactCategory.findOneAndUpdate(
//             { _id: req.params.id, tenant: req.tenantId },
//             { $set: { active: false } },
//             { new: true }
//         );

//         res.json({ success: true, message: "Category deactivated", data: { category } });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };
// controllers/ContactCategoryController.js
const ContactCategory = require('../models/ContactCategory');
const Joi = require('joi');
const Logger = require("../utils/logger");

// Joi Validation Schemas
const createSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    type: Joi.string().valid('internal', 'external').default('internal'),
    description: Joi.string().allow('', null),
});

const updateSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    type: Joi.string().valid('internal', 'external'),
    active: Joi.boolean(),
    description: Joi.string().allow('', null),
});

// 🔹 CREATE
exports.createCategory = async (req, res) => {
    try {
        if (!req.user || !req.tenantId) {
            Logger.warn("createCategory", "Invalid request context", {
                context: {
                    userId: req.user?._id,
                    tenantId: req.tenantId
                },
                req
            });
            return res.status(400).json({ message: "Invalid request context" });
        }

        const { error, value } = createSchema.validate(req.body);
        if (error) {
            Logger.warn("createCategory", "Validation failed", {
                context: {
                    errors: error.details,
                    userId: req.user._id
                },
                req
            });
            return res.status(400).json({ message: error.details[0].message });
        }

        if (!['admin', 'companyAdmin'].includes(req.user.role)) {
            Logger.warn("createCategory", "Access denied", {
                context: {
                    userId: req.user._id,
                    role: req.user.role
                },
                req
            });
            return res.status(403).json({ message: 'Access denied' });
        }

        const exists = await ContactCategory.findOne({
            tenant: req.tenantId,
            name: value.name,
        });
        if (exists) {
            Logger.info("createCategory", "Category already exists", {
                context: {
                    tenantId: req.tenantId,
                    name: value.name
                },
                req
            });
            return res.status(400).json({ message: 'Category already exists in this company' });
        }

        const category = await ContactCategory.create({
            ...value,
            tenant: req.tenantId,
            createdBy: req.user._id,
        });

        Logger.info("createCategory", "Category created successfully", {
            context: {
                categoryId: category._id,
                tenantId: req.tenantId,
                createdBy: req.user._id
            },
            req
        });

        res.status(201).json({ success: true, data: { category } });
    } catch (err) {
        Logger.error("createCategory", "Server error", {
            error: err,
            context: {
                userId: req.user?._id,
                tenantId: req.tenantId
            },
            req
        });

        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 🔹 READ (All tenant categories)
exports.getCategories = async (req, res) => {
    try {
        const filter = {
            $or: [
                { isDefault: true },           // global defaults
                { tenant: req.tenantId },      // tenant’s own
            ],
            active: true,
        };

        const categories = await ContactCategory.find(filter)
            .select("name type active isDefault createdAt")
            .sort({ isDefault: -1, name: 1 }); // show defaults first

        Logger.info("getCategories", "Fetched categories", {
            context: {
                tenantId: req.tenantId,
                count: categories.length
            },
            req
        });

        res.json({ success: true, count: categories.length, data: { categories } });
    } catch (err) {
        Logger.error("getCategories", "Server error", {
            error: err,
            context: {
                tenantId: req.tenantId
            },
            req
        });
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 🔹 UPDATE
exports.updateCategory = async (req, res) => {
    try {
        const { error, value } = updateSchema.validate(req.body);
        if (error) {
            Logger.warn("updateCategory", "Validation failed", {
                context: {
                    errors: error.details,
                    tenantId: req.tenantId
                },
                req
            });
            return res.status(400).json({ message: error.details[0].message });
        }

        if (!["admin", "companyAdmin"].includes(req.user.role)) {
            Logger.warn("updateCategory", "Access denied", {
                context: {
                    userId: req.user._id,
                    role: req.user.role
                },
                req
            });
            return res.status(403).json({ message: "Access denied" });
        }

        // 🔒 Prevent editing default categories
        const target = await ContactCategory.findById(req.params.id);
        if (!target) {
            Logger.warn("updateCategory", "Category not found", {
                context: {
                    categoryId: req.params.id
                },
                req
            });

            return res.status(404).json({ message: "Category not found" });
        }
        if (target.isDefault) {
            Logger.info("updateCategory", "Attempt to modify default category", {
                context: {
                    categoryId: req.params.id
                },
                req
            });
            return res.status(400).json({ message: "Default categories cannot be modified" });
        }

        // ✅ Update allowed only on tenant’s own categories
        const category = await ContactCategory.findOneAndUpdate(
            { _id: req.params.id, tenant: req.tenantId },
            { $set: value },
            { new: true, runValidators: true }
        );

        Logger.info("updateCategory", "Category updated successfully", {
            context: {
                categoryId: category._id,
                tenantId: req.tenantId
            },
            req
        });

        res.json({ success: true, data: { category } });
    } catch (err) {
        Logger.error("updateCategory", "Server error", {
            error: err,
            context: {
                tenantId: req.tenantId
            },
            req
        });
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 🔹 SOFT DELETE (Deactivate)
exports.deleteCategory = async (req, res) => {
    try {
        if (!["admin", "companyAdmin"].includes(req.user.role)) {
            Logger.warn("deleteCategory", "Access denied", {
                context: {
                    userId: req.user._id,
                    role: req.user.role
                },
                req
            });
            return res.status(403).json({ message: "Access denied" });
        }

        const target = await ContactCategory.findById(req.params.id);
        if (!target) {
            Logger.warn("deleteCategory", "Category not found", {
                context: {
                    categoryId: req.params.id
                },
                req
            });
            return res.status(404).json({ message: "Category not found" });
        }
        if (target.isDefault) {
            Logger.info("deleteCategory", "Attempt to delete default category", {
                context: {
                    categoryId: req.params.id
                },
                req
            });
            return res.status(400).json({ message: "Default categories cannot be deleted" });
        }

        const category = await ContactCategory.findOneAndUpdate(
            { _id: req.params.id, tenant: req.tenantId },
            { $set: { active: false } },
            { new: true }
        );

        Logger.info("deleteCategory", "Category deactivated successfully", {
            context: {
                categoryId: category._id,
                tenantId: req.tenantId
            },
            req
        });

        res.json({ success: true, message: "Category deactivated", data: { category } });
    } catch (err) {
        Logger.error("deleteCategory", "Server error", {
            error: err,
            context: {
                tenantId: req.tenantId
            },
            req
        });
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};