// const db = require("../models");
const Role = require("../role/models/Role");
const Module = require("../role/models/Modules");
const Permission = require("../role/models/Permission");
const RolePermission = require("../role/models/RolePermission");

//  Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res
        .status(400)
        .json({ error: "Role already exists with this name" });
    }

    // Create new role
    const role = await Role.create({ name });
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new module
exports.createModule = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Module name is required" });
    }

    // Check if module with the same name already exists
    const existingModule = await Module.findOne({ where: { name } });
    if (existingModule) {
      return res
        .status(400)
        .json({ error: "Module already exists with this name" });
    }

    // Create the module
    const module = await Module.create({ name });

    res.status(201).json({ message: "Module created successfully", module });
  } catch (error) {
    console.error("Create Module Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create permission for a module and feature
exports.createPermission = async (req, res) => {
  console.log("per___________");
  try {
    const {
      module_id,
      feature_name,
      can_add,
      can_view,
      can_update,
      can_delete,
    } = req.body;

    console.log("permossion", req.body);

    // Validate required fields
    if (!module_id || !feature_name) {
      return res
        .status(400)
        .json({ error: "module_id and feature_name are required" });
    }

    // Sanitize feature_name to remove extra quotes
    const sanitizedFeatureName = feature_name.replace(/^"|"$/g, "");

    // Check if the module exists
    const module = await Module.findByPk(module_id);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Check if this permission already exists for the feature in this module
    const existing = await Permission.findOne({
      where: { module_id, feature_name: sanitizedFeatureName },
    });
    if (existing) {
      return res.status(400).json({
        error: "Permission already exists for this feature in the module",
      });
    }

    // Create the permission
    const permission = await Permission.create({
      module_id,
      feature_name: sanitizedFeatureName,
      can_view: can_view || "None",
      can_add: can_add || "None",
      can_update: can_update || "None",
      can_delete: can_delete || "None",
    });

    res
      .status(201)
      .json({ message: "Permission created successfully", permission });
  } catch (error) {
    console.error("Create Permission Error:", error);
    res.status(500).json({ error: error.message });
  }
};

//  Assign permission to a role
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    // ✅ Check if role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res
        .status(400)
        .json({ error: "Invalid role_id. No such role exists." });
    }

    // ✅ Check if permission exists
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res
        .status(400)
        .json({ error: "Invalid permission_id. No such permission exists." });
    }

    // ✅ Create RolePermission
    const rolePermission = await RolePermission.create({
      role_id,
      permission_id,
    });
    res.status(201).json({
      message: "Permission assigned to role",
      rolePermission,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// find role with permissions
exports.getRoleWithPermissions = async (req, res) => {
  try {
    const { role_id } = req.params;

    console.log("Checking role_id:", role_id);

    const role = await Role.findByPk(role_id); // just raw fetch

    if (!role) {
      return res
        .status(404)
        .json({ error: "Invalid role_id. No such role exists." });
    }

    res.status(200).json({ message: "Role found!", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      order: [["name", "ASC"]], // optional: sort alphabetically
    });

    res.status(200).json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch modules" });
  }
};

// get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: RolePermission,
          as: "rolePermissions",
        },
      ],
      order: [["name", "ASC"]],
      distinct: true, // prevent duplicates due to joins
    });

    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// save permission
exports.savePermissions = async (req, res) => {
  const { roleId, permissions } = req.body;
  console.log("Incoming Request Body:", req.body);

  // Validate input
  if (!roleId || !Array.isArray(permissions)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Step 2: Iterate over the permissions array
    for (const moduleItem of permissions) {
      console.log("Processing Module:", moduleItem.module);

      // Find the module
      const module = await Module.findOne({
        where: { name: moduleItem.module },
      });
      if (!module) {
        return res
          .status(404)
          .json({ message: `Module not found: ${moduleItem.module}` });
      }

      // Step 3: Iterate over the features array
      for (const feature of moduleItem.features) {
        console.log("Processing Feature:", feature);
        console.log("modulee:", module.id);

        // Validate feature name
        if (!feature.name || typeof feature.name !== "string") {
          return res.status(400).json({
            message: `Invalid feature name for module: ${moduleItem.module}`,
          });
        }

        // Step 4: Check if the permission exists
        const existingPermission = await Permission.findOne({
          where: {
            module_id: module.id,
            feature_name: feature.name,
          },
        });

        if (!existingPermission) {
          return res.status(404).json({
            message: `Permission not found for feature: ${feature.name} in module: ${moduleItem.module}`,
          });
        }

        // Step 5: Update the permission
        await existingPermission.update({
          can_view: feature.permissions.view ? "All" : "None",
          can_add: feature.permissions.add ? "All" : "None",
          can_update: feature.permissions.edit ? "All" : "None",
          can_delete: feature.permissions.delete ? "All" : "None",
        });

        // Step 6: Check if the RolePermission exists
        const rolePermission = await RolePermission.findOne({
          where: {
            role_id: roleId,
            permission_id: existingPermission.id,
          },
        });

        if (!rolePermission) {
          // Link the permission to the role if not already linked
          await RolePermission.create({
            role_id: roleId,
            permission_id: existingPermission.id,
          });
        }
      }
    }

    return res.json({ message: "Permissions updated successfully." });
  } catch (error) {
    console.error("Save Permission Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// controllers/rolePermissionController.js

exports.getRolePermissions = async (req, res) => {
  try {
    const roleId = req.params.roleId;

    const modules = await Module.findAll({
      include: [
        {
          model: Feature,
          include: [
            {
              model: RolePermission,
              where: { roleId },
              required: false,
              include: [Permission],
            },
          ],
        },
      ],
    });

    const result = modules.map((mod) => ({
      module: mod.name,
      features: mod.Features.map((feature) => {
        const perms = feature.RolePermissions?.[0]?.Permission;
        return {
          name: feature.name,
          permissions: {
            view: perms?.view || false,
            add: perms?.add || false,
            edit: perms?.edit || false,
            delete: perms?.delete || false,
          },
        };
      }),
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// fetch all module with permissions
exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Permission,
          as: "permissions",
          attributes: [
            "id",
            "feature_name",
            "can_view",
            "can_add",
            "can_update",
            "can_delete",
          ],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error("Error fetching modules with permissions:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// get specific role permissions

exports.getModulesWithPermissionsByRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    const rolePermissions = await RolePermission.findAll({
      where: { role_id: roleId },
      include: [
        {
          model: Permission,
          as: "permission",
          attributes: [
            "id",
            "feature_name",
            "can_view",
            "can_add",
            "can_update",
            "can_delete",
            "module_id",
          ],
          include: [
            {
              model: Module,
              as: "module",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: rolePermissions,
    });
  } catch (error) {
    console.error("Error fetching role-based permissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions for role",
      error: error.message,
    });
  }
};
