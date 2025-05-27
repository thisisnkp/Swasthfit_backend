// pages/api/checkPermission.js
const { Op } = require("sequelize");
const Module = require("../role/models/Modules");
const Permission = require("../role/models/Permission");
const Role = require("../role/models/Role");
const RolePermission = require("../role/models/RolePermission");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { moduleName, action, staff_id } = req.body;

  if (!moduleName || !action || !staff_id) {
    return res.status(400).json({
      hasPermission: false,
      message: "Missing moduleName, action, or staff_id.",
    });
  }

  try {
    console.log("Input received:", { moduleName, action, staff_id });

    // Fetch user's role from DB using staff_id
    const user = await YourUserModel.findOne({
      where: { id: staff_id },
      attributes: ["id", "role_id"],
    });

    if (!user || !user.role_id) {
      return res.status(403).json({
        hasPermission: false,
        message: "User or role not found.",
      });
    }

    const roleId = user.role_id;

    const module = await Module.findOne({ where: { name: moduleName } });
    if (!module) {
      return res.status(404).json({
        hasPermission: false,
        message: `Module "${moduleName}" not found.`,
      });
    }

    const permission = await Permission.findOne({
      where: {
        module_id: module.id,
        feature_name: {
          [Op.contains]: [action],
        },
      },
    });

    if (!permission) {
      return res.status(403).json({
        hasPermission: false,
        message: `No permission for action "${action}" on module "${moduleName}".`,
      });
    }

    const rolePermission = await RolePermission.findOne({
      where: {
        role_id: roleId,
        permission_id: permission.id,
      },
    });

    if (!rolePermission) {
      return res.status(403).json({
        hasPermission: false,
        message: `Role doesn't have access to permission "${action}" on "${moduleName}".`,
      });
    }

    const actionMap = {
      view: permission.can_view,
      add: permission.can_add,
      update: permission.can_update,
      delete: permission.can_delete,
    };

    const hasPermission = actionMap[action] === "All";

    if (hasPermission) {
      return res.status(200).json({
        hasPermission: true,
        message: "Permission granted.",
      });
    } else {
      return res.status(403).json({
        hasPermission: false,
        message: `Permission "${action}" not allowed.`,
      });
    }
  } catch (error) {
    console.error("Permission check error:", error);
    return res.status(500).json({
      hasPermission: false,
      message: "Internal server error.",
    });
  }
};
