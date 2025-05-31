// pages/api/checkUserPermission.js
"use strict";
const { Op } = require("sequelize");
const Module = require("../role/models/Modules"); // Adjust path
const Permission = require("../role/models/Permission"); // Adjust path
const Role = require("../role/models/Role"); // Adjust path
const RolePermission = require("../role/models/RolePermission"); // Adjust path
const GymOwner = require("../gym_owners/gym.Owner.model"); // Adjust path - This is your User/Staff model

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { moduleName, featureName, action, staff_id } = req.body;

  if (!moduleName || !featureName || !action || !staff_id) {
    return res.status(400).json({
      hasPermission: false,
      message: "Missing moduleName, featureName, action, or staff_id.",
    });
  }

  try {
    // 1. Fetch user's role_id
    const staffUser = await GymOwner.findByPk(staff_id, {
      attributes: ["id", "role_id"], // Assuming role_id is directly on GymOwner
    });

    if (!staffUser || !staffUser.role_id) {
      return res.status(403).json({
        hasPermission: false,
        message: "User or role not found for the staff member.",
      });
    }
    const roleId = staffUser.role_id;

    // 2. Find the module
    const module = await Module.findOne({ where: { name: moduleName } });
    if (!module) {
      return res.status(404).json({
        hasPermission: false,
        message: `Module "${moduleName}" not found.`,
      });
    }

    // 3. Find the specific permission entry for the feature within the module
    const permissionEntry = await Permission.findOne({
      where: {
        module_id: module.id,
        feature_name: featureName,
      },
    });

    if (!permissionEntry) {
      return res.status(403).json({
        hasPermission: false,
        message: `No permission defined for feature "${featureName}" on module "${moduleName}".`,
      });
    }

    // 4. Check if the role is linked to this permission
    const rolePermissionLink = await RolePermission.findOne({
      where: {
        role_id: roleId,
        permission_id: permissionEntry.id,
      },
    });

    if (!rolePermissionLink) {
      return res.status(403).json({
        hasPermission: false,
        message: `Role does not have access to feature "${featureName}" on module "${moduleName}".`,
      });
    }

    // 5. Check the specific action (can_view, can_add, etc.)
    let hasSpecificPermission = false;
    switch (action.toLowerCase()) {
      case "view":
        hasSpecificPermission = permissionEntry.can_view === "All";
        break;
      case "add":
        hasSpecificPermission = permissionEntry.can_add === "All";
        break;
      case "update": // Or "edit" - ensure consistency with your frontend
        hasSpecificPermission = permissionEntry.can_update === "All";
        break;
      case "delete":
        hasSpecificPermission = permissionEntry.can_delete === "All";
        break;
      default:
        return res.status(400).json({
          hasPermission: false,
          message: `Invalid action: "${action}". Valid actions are view, add, update, delete.`,
        });
    }

    if (hasSpecificPermission) {
      return res.status(200).json({
        hasPermission: true,
        message: "Permission granted.",
      });
    } else {
      return res.status(403).json({
        hasPermission: false,
        message: `Permission for action "${action}" on feature "${featureName}" in module "${moduleName}" is denied.`,
      });
    }
  } catch (error) {
    console.error("Permission check error:", error);
    return res.status(500).json({
      hasPermission: false,
      message: "Internal server error during permission check.",
      error: error.message,
    });
  }
};
