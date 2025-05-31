// const db = require("../models");
const Role = require("../role/models/Role");
const Module = require("../role/models/Modules");
const Permission = require("../role/models/Permission");
const RolePermission = require("../role/models/RolePermission");
const GymOwner = require("../../gym/gym_owners/gym.Owner.model"); // Assuming GymOwner model has role_id and potentially its own gym_id

//  Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, gym_id, staff_id } = req.body; // Expect gym_id and optional staff_id

    if (!name || !gym_id) {
      return res
        .status(400)
        .json({ error: "Role name and gym_id are required" });
    }

    // Check if role with the same name already exists for this gym
    const existingRole = await Role.findOne({ where: { name, gym_id } });
    if (existingRole) {
      return res
        .status(400)
        .json({ error: `Role "${name}" already exists for this gym` });
    }

    // Create new role
    const role = await Role.create({ name, gym_id, staff_id }); // Save with gym_id and staff_id
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new module (Modules are global as per current model structure)
exports.createModule = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Module name is required" });
    }

    const existingModule = await Module.findOne({ where: { name } });
    if (existingModule) {
      return res
        .status(400)
        .json({ error: "Module already exists with this name" });
    }

    const module = await Module.create({ name });
    res.status(201).json({ message: "Module created successfully", module });
  } catch (error) {
    console.error("Create Module Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create permission for a module and feature (Permissions are global as per current model structure)
exports.createPermission = async (req, res) => {
  try {
    const {
      module_id,
      feature_name,
      can_add,
      can_view,
      can_update,
      can_delete,
    } = req.body;

    if (!module_id || !feature_name) {
      return res
        .status(400)
        .json({ error: "module_id and feature_name are required" });
    }

    const sanitizedFeatureName = feature_name.replace(/^"|"$/g, "");
    const module = await Module.findByPk(module_id);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    const existing = await Permission.findOne({
      where: { module_id, feature_name: sanitizedFeatureName },
    });
    if (existing) {
      return res.status(400).json({
        error: "Permission already exists for this feature in the module",
      });
    }

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

// Assign permission to a role
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id, gym_id } = req.body; // gym_id for validation

    if (!role_id || !permission_id || !gym_id) {
      return res
        .status(400)
        .json({ error: "role_id, permission_id, and gym_id are required." });
    }

    const role = await Role.findOne({ where: { id: role_id, gym_id: gym_id } });
    if (!role) {
      return res
        .status(400)
        .json({
          error:
            "Invalid role_id or role does not belong to the specified gym_id.",
        });
    }

    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res
        .status(400)
        .json({ error: "Invalid permission_id. No such permission exists." });
    }

    // Check if this permission is already assigned to the role
    const existingRolePermission = await RolePermission.findOne({
      where: { role_id, permission_id },
    });

    if (existingRolePermission) {
      return res
        .status(400)
        .json({ error: "This permission is already assigned to the role." });
    }

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

// Get a specific role with its permissions, ensuring it belongs to the specified gym
exports.getRoleWithPermissions = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { gym_id } = req.query; // Get gym_id from query parameter

    if (!gym_id) {
      return res
        .status(400)
        .json({ error: "gym_id query parameter is required." });
    }

    const role = await Role.findOne({
      where: { id: role_id, gym_id: gym_id }, // Filter by role_id AND gym_id
      include: [
        {
          model: RolePermission,
          as: "rolePermissions",
          include: [
            {
              model: Permission,
              as: "permission",
              include: [
                {
                  model: Module,
                  as: "module",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!role) {
      return res
        .status(404)
        .json({
          error: "Role not found for the specified role_id and gym_id.",
        });
    }

    res.status(200).json({ message: "Role found!", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all modules (global)
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch modules" });
  }
};

// Get all roles for a specific gym
exports.getRoles = async (req, res) => {
  try {
    const { gym_id } = req.query; // Get gym_id from query parameter

    if (!gym_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "gym_id query parameter is required.",
        });
    }

    const roles = await Role.findAll({
      where: { gym_id: gym_id }, // Filter by gym_id
      include: [
        {
          model: RolePermission,
          as: "rolePermissions",
        },
      ],
      order: [["name", "ASC"]],
      distinct: true,
    });

    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// Save/Update permissions for a role within a specific gym
exports.savePermissions = async (req, res) => {
  const { roleId, permissions, gym_id } = req.body; // Expect gym_id for validation
  console.log("Incoming Request Body for Save Permissions:", req.body);

  if (!roleId || !Array.isArray(permissions) || !gym_id) {
    return res
      .status(400)
      .json({
        message:
          "Invalid input: roleId, permissions array, and gym_id are required.",
      });
  }

  try {
    const role = await Role.findOne({ where: { id: roleId, gym_id: gym_id } });
    if (!role) {
      return res
        .status(404)
        .json({
          message: "Role not found or does not belong to the specified gym.",
        });
    }

    // Optional: Clear existing RolePermissions for this role before adding new ones
    // await RolePermission.destroy({ where: { role_id: roleId } });
    // Deciding whether to clear or just add/update depends on desired behavior.
    // The current loop updates permissions and creates RolePermission links if they don't exist.

    for (const moduleItem of permissions) {
      console.log("Processing Module:", moduleItem.module);
      const module = await Module.findOne({
        where: { name: moduleItem.module },
      });
      if (!module) {
        console.warn(`Module not found: ${moduleItem.module}. Skipping.`);
        continue; // Skip this module if not found, or return error
        // return res.status(404).json({ message: `Module not found: ${moduleItem.module}` });
      }

      for (const feature of moduleItem.features) {
        console.log(
          "Processing Feature:",
          feature,
          "for Module ID:",
          module.id
        );

        if (!feature.name || typeof feature.name !== "string") {
          return res.status(400).json({
            message: `Invalid feature name for module: ${moduleItem.module}`,
          });
        }

        let existingPermission = await Permission.findOne({
          where: {
            module_id: module.id,
            feature_name: feature.name,
          },
        });

        if (!existingPermission) {
          // If permission definition doesn't exist, you might want to create it
          // Or return an error, depending on your application logic.
          // For now, we'll assume permissions are pre-defined or created elsewhere.
          console.warn(
            `Permission not found for feature: ${feature.name} in module: ${moduleItem.module}. Skipping.`
          );
          continue; // Skip this feature if its permission definition doesn't exist
          // return res.status(404).json({
          //   message: `Permission definition not found for feature: ${feature.name} in module: ${moduleItem.module}`,
          // });
        }

        // Update the permission's action flags (can_view, can_add, etc.)
        // This updates the global permission definition.
        // If you intend for these flags (All/None) to be role-specific,
        // this approach needs to change (e.g. store these flags in RolePermission).
        // Based on your current Permission model, these flags are on the Permission itself.
        await existingPermission.update({
          can_view: feature.permissions.view ? "All" : "None",
          can_add: feature.permissions.add ? "All" : "None",
          can_update: feature.permissions.edit ? "All" : "None", // Assuming 'edit' maps to 'can_update'
          can_delete: feature.permissions.delete ? "All" : "None",
        });

        // Ensure the RolePermission link exists
        let rolePermissionLink = await RolePermission.findOne({
          where: {
            role_id: roleId,
            permission_id: existingPermission.id,
          },
        });

        if (!rolePermissionLink) {
          await RolePermission.create({
            role_id: roleId,
            permission_id: existingPermission.id,
          });
          console.log(
            `Linked role ${roleId} to permission ${existingPermission.id}`
          );
        }
      }
    }

    return res.json({
      message: "Permissions updated and linked successfully.",
    });
  } catch (error) {
    console.error("Save Permission Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all modules with their globally defined permissions (not role-specific yet)
exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    // const { gym_id } = req.query; // If you want to scope this by gym, you'd need a more complex query
    // to see which modules have permissions linked to roles of that gym.
    // As is, it fetches all modules and their globally defined permissions.

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

// Get permissions for a specific role, effectively scoped by the role's gym_id
exports.getModulesWithPermissionsByRole = async (req, res) => {
  const { roleId } = req.params;
  const { gym_id } = req.query; // Expect gym_id for validation

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "gym_id query parameter is required." });
  }

  try {
    // First, validate the role belongs to the gym
    const role = await Role.findOne({ where: { id: roleId, gym_id: gym_id } });
    if (!role) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Role not found for the specified roleId and gym_id.",
        });
    }

    // Fetch permissions associated with this role
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

    // Structure the data by module
    const structuredPermissions = {};
    rolePermissions.forEach((rp) => {
      if (rp.permission && rp.permission.module) {
        const moduleName = rp.permission.module.name;
        if (!structuredPermissions[moduleName]) {
          structuredPermissions[moduleName] = {
            module_id: rp.permission.module.id,
            module_name: moduleName,
            features: [],
          };
        }
        structuredPermissions[moduleName].features.push({
          permission_id: rp.permission.id,
          feature_name: rp.permission.feature_name,
          can_view: rp.permission.can_view,
          can_add: rp.permission.can_add,
          can_update: rp.permission.can_update,
          can_delete: rp.permission.can_delete,
        });
      }
    });

    res.status(200).json({
      success: true,
      role_id: roleId,
      gym_id: gym_id,
      data: Object.values(structuredPermissions), // Convert object to array
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

// Check all permissions for a given staff member, validating against their gym
exports.checkStaffPermissions = async (req, res) => {
  try {
    const { staff_id, gym_id } = req.body; // Expect gym_id for validation

    if (!staff_id || !gym_id) {
      return res.status(400).json({
        success: false,
        message: "staff_id and gym_id are required",
      });
    }

    const staff = await GymOwner.findByPk(staff_id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    const role_id = staff.role_id;
    if (!role_id) {
      return res.status(400).json({
        success: false,
        message: "Staff has no assigned role",
      });
    }

    // Fetch the role and validate it belongs to the provided gym_id
    const role = await Role.findOne({
      where: { id: role_id, gym_id: gym_id }, // Key validation here
      include: [
        {
          model: RolePermission,
          as: "rolePermissions",
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
        },
      ],
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message:
          "Role not found for this staff member or role does not belong to the specified gym.",
      });
    }

    const permissions = role.rolePermissions.map((rp) => ({
      feature: rp.permission.feature_name,
      module: rp.permission.module.name,
      module_id: rp.permission.module.id,
      permission_id: rp.permission.id,
      actions: {
        // Changed from 'permissions' to 'actions' to avoid confusion
        view: rp.permission.can_view === "All",
        add: rp.permission.can_add === "All",
        update: rp.permission.can_update === "All",
        delete: rp.permission.can_delete === "All",
      },
    }));

    return res.status(200).json({
      success: true,
      data: {
        staff_id: staff.id,
        staff_name: staff.name, // Assuming staff has a name field
        role: role.name,
        role_id: role.id,
        gym_id: role.gym_id,
        permissions,
      },
    });
  } catch (error) {
    console.error("Error checking staff permissions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check staff permissions",
      error: error.message,
    });
  }
};
