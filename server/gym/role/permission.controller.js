// pages/api/checkUserPermission.js
"use strict";
const { Op } = require("sequelize");
// const Module = require("../role/models/Modules");
// const Permission = require("../role/models/Permission");
// const Role = require("../role/models/Role");
// const RolePermission = require("../role/models/RolePermission");
// const GymOwner = require("../gym_owners/gym.Owner.model");
const {
  Module,
  Permission,
  Role,
  RolePermission,
  GymOwner,
} = require("../models"); // Your User/Staff model

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Expect gym_id from the request body, representing the current gym context
  const { moduleName, featureName, action, staff_id, gym_id } = req.body;

  if (!moduleName || !featureName || !action || !staff_id || !gym_id) {
    return res.status(400).json({
      hasPermission: false,
      message: "Missing moduleName, featureName, action, staff_id, or gym_id.",
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
        message: "User or assigned role not found for the staff member.",
      });
    }
    const roleId = staffUser.role_id;

    // 1.1 Fetch the Role and verify gym_id
    const userRole = await Role.findByPk(roleId);
    if (!userRole) {
      return res.status(403).json({
        hasPermission: false,
        message: "Role associated with the staff member not found.",
      });
    }

    // IMPORTANT: Validate that the user's role belongs to the gym_id passed in the request
    if (userRole.gym_id !== parseInt(gym_id)) {
      // Ensure gym_id is compared correctly (e.g. string vs number)
      return res.status(403).json({
        hasPermission: false,
        message: `Permission denied: Staff member's role does not belong to the specified gym (request gym_id: ${gym_id}, role gym_id: ${userRole.gym_id}).`,
      });
    }

    // 2. Find the module
    const module = await Module.findOne({ where: { name: moduleName } });
    if (!module) {
      return res.status(404).json({
        hasPermission: false,
        message: `Module "${moduleName}" not found.`,
      });
    }

    // 3. Find the specific permission entry for the feature within the module
    // The Permission model itself does not have gym_id. It's global.
    const permissionEntry = await Permission.findOne({
      where: {
        module_id: module.id,
        feature_name: featureName, // Ensure featureName matches exactly how it's stored
      },
    });

    if (!permissionEntry) {
      return res.status(403).json({
        hasPermission: false,
        message: `No permission definition found for feature "${featureName}" on module "${moduleName}".`,
      });
    }

    // 4. Check if the role is linked to this permission (via RolePermission table)
    const rolePermissionLink = await RolePermission.findOne({
      where: {
        role_id: roleId, // This is the staffUser's role_id
        permission_id: permissionEntry.id,
      },
    });

    if (!rolePermissionLink) {
      return res.status(403).json({
        hasPermission: false,
        message: `Role does not have the necessary access rights for feature "${featureName}" on module "${moduleName}".`,
      });
    }

    // 5. Check the specific action (can_view, can_add, etc.) from the permissionEntry
    // The flags (All/None) are on the Permission record itself.
    let hasSpecificPermission = false;
    switch (action.toLowerCase()) {
      case "view":
        hasSpecificPermission = permissionEntry.can_view === "All";
        break;
      case "add":
        hasSpecificPermission = permissionEntry.can_add === "All";
        break;
      case "update": // Or "edit"
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
        message: `Permission for action "${action}" on feature "${featureName}" in module "${moduleName}" is denied for the user's role.`,
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
