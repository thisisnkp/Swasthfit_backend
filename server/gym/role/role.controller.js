// ../role/role.controller.js
// const Role = require("../role/models/Role");
// const Module = require("../role/models/Modules");
// const Permission = require("../role/models/Permission");
// const RolePermission = require("../role/models/RolePermission");
// const GymOwner = require("../../gym/gym_owners/gym.Owner.model");
const { Op } = require("sequelize"); // Import Op if not already
const {
  Module,
  Permission,
  Role,
  RolePermission,
  GymOwner,
} = require("../models"); // Assuming index.js is in 'models' one level up

exports.createRole = async (req, res) => {
  try {
    const { name, gym_id, staff_id } = req.body;

    if (!name || !gym_id) {
      return res
        .status(400)
        .json({ error: "Role name and gym_id are required" });
    }

    const existingRole = await Role.findOne({
      where: { name, gym_id: parseInt(gym_id) },
    });
    if (existingRole) {
      return res
        .status(400)
        .json({ error: `Role "${name}" already exists for this gym` });
    }

    const role = await Role.create({
      name,
      gym_id: parseInt(gym_id),
      staff_id: staff_id ? parseInt(staff_id) : null,
    });
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    console.error("Create Role Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a new module (Modules are global)
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

// Create permission for a module and feature (Defines global defaults)
exports.createPermission = async (req, res) => {
  try {
    const {
      module_id,
      feature_name,
      can_add, // Default: "None" or "All"
      can_view, // Default: "None" or "All"
      can_update, // Default: "None" or "All"
      can_delete, // Default: "None" or "All"
    } = req.body;

    if (!module_id || !feature_name) {
      return res
        .status(400)
        .json({ error: "module_id and feature_name are required" });
    }

    const sanitizedFeatureName = feature_name.toString().replace(/^"|"$/g, "");
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

    // These define the GLOBAL DEFAULT permissions for this feature
    const permission = await Permission.create({
      module_id,
      feature_name: sanitizedFeatureName,
      can_view: can_view || "None",
      can_add: can_add || "None",
      can_update: can_update || "None",
      can_delete: can_delete || "None",
    });

    res.status(201).json({
      message: "Permission definition created successfully",
      permission,
    });
  } catch (error) {
    console.error("Create Permission Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Assign permission to a role (This typically just creates the link; specific action grants are separate)
// This function might be less relevant if savePermissions handles everything.
// Or it can be used to just establish a link with default RolePermission values.
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id, gym_id } = req.body;

    if (!role_id || !permission_id || !gym_id) {
      return res
        .status(400)
        .json({ error: "role_id, permission_id, and gym_id are required." });
    }

    const role = await Role.findOne({
      where: { id: role_id, gym_id: parseInt(gym_id) },
    });
    if (!role) {
      return res.status(404).json({
        error:
          "Invalid role_id or role does not belong to the specified gym_id.",
      });
    }

    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res
        .status(404)
        .json({ error: "Invalid permission_id. No such permission exists." });
    }

    const [rolePermission, created] = await RolePermission.findOrCreate({
      where: { role_id, permission_id },
      defaults: {
        // Default action grants when link is first created
        role_id,
        permission_id,
        can_view: permission.can_view, // Inherit default from Permission table
        can_add: permission.can_add,
        can_update: permission.can_update,
        can_delete: permission.can_delete,
      },
    });

    if (!created) {
      return res.status(400).json({
        error:
          "This permission is already assigned to the role. Use savePermissions to update.",
      });
    }

    res.status(201).json({
      message: "Permission assigned to role with default action grants.",
      rolePermission,
    });
  } catch (err) {
    console.error("Assign Permission Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Save/Update ROLE-SPECIFIC permissions for a role within a specific gym
exports.savePermissions = async (req, res) => {
  const { roleId, permissions: permissionsPayload, gym_id } = req.body;
  console.log("Incoming Request Body for Save Permissions:", req.body);

  if (!roleId || !Array.isArray(permissionsPayload) || !gym_id) {
    return res.status(400).json({
      message:
        "Invalid input: roleId, permissions array, and gym_id are required.",
    });
  }

  try {
    const role = await Role.findOne({
      where: { id: roleId, gym_id: parseInt(gym_id) },
    });
    if (!role) {
      return res.status(404).json({
        message: "Role not found or does not belong to the specified gym.",
      });
    }

    const results = [];

    for (const moduleItem of permissionsPayload) {
      const module = await Module.findOne({
        where: { name: moduleItem.module },
      });
      if (!module) {
        console.warn(`Module not found: ${moduleItem.module}. Skipping.`);
        results.push({
          module: moduleItem.module,
          status: "Module not found",
          skipped: true,
        });
        continue;
      }

      for (const feature of moduleItem.features) {
        if (!feature.name || typeof feature.name !== "string") {
          results.push({
            module: moduleItem.module,
            feature: feature.name,
            status: "Invalid feature name",
            skipped: true,
          });
          continue;
        }

        // Find the global Permission definition
        const globalPermission = await Permission.findOne({
          where: {
            module_id: module.id,
            feature_name: feature.name,
          },
        });

        if (!globalPermission) {
          console.warn(
            `Global permission definition not found for feature: ${feature.name} in module: ${moduleItem.module}. Skipping.`
          );
          results.push({
            module: moduleItem.module,
            feature: feature.name,
            status: "Global permission definition not found",
            skipped: true,
          });
          continue;
        }

        // Now, find or create/update the RolePermission link with specific grants
        const [rolePermissionLink, created] = await RolePermission.findOrCreate(
          {
            where: {
              role_id: roleId,
              permission_id: globalPermission.id,
            },
            defaults: {
              // Values if creating new RolePermission
              role_id: roleId,
              permission_id: globalPermission.id,
              can_view: feature.permissions.view ? "All" : "None",
              can_add: feature.permissions.add ? "All" : "None",
              can_update: feature.permissions.edit ? "All" : "None", // Assuming 'edit' maps to 'can_update'
              can_delete: feature.permissions.delete ? "All" : "None",
            },
          }
        );

        if (!created) {
          // If it already existed, update it
          await rolePermissionLink.update({
            can_view: feature.permissions.view ? "All" : "None",
            can_add: feature.permissions.add ? "All" : "None",
            can_update: feature.permissions.edit ? "All" : "None",
            can_delete: feature.permissions.delete ? "All" : "None",
          });
          console.log(
            `Updated RolePermission for role ${roleId}, permission ${globalPermission.id}`
          );
          results.push({
            module: moduleItem.module,
            feature: feature.name,
            status: "Updated role-specific permission",
          });
        } else {
          console.log(
            `Created RolePermission for role ${roleId}, permission ${globalPermission.id}`
          );
          results.push({
            module: moduleItem.module,
            feature: feature.name,
            status: "Created role-specific permission",
          });
        }
      }
    }

    return res.json({
      message: "Permissions processed for the role.",
      details: results,
    });
  } catch (error) {
    console.error("Save Permission Error:", error);
    return res.status(500).json({
      message: "Server error during permission saving",
      error: error.message,
    });
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
    const { gym_id } = req.query;
    if (!gym_id) {
      return res.status(400).json({
        success: false,
        message: "gym_id query parameter is required.",
      });
    }
    const roles = await Role.findAll({
      where: { gym_id: parseInt(gym_id) },
      // include: [{ model: RolePermission, as: "rolePermissions" }], // Optional: include links if needed for display
      order: [["name", "ASC"]],
    });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// Get all modules with their globally defined default permissions
exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Permission,
          as: "permissions", // Alias from Module.hasMany(Permission, {as: "permissions"})
          attributes: [
            "id",
            "feature_name",
            "can_view", // Global default can_view
            "can_add", // Global default can_add
            "can_update", // Global default can_update
            "can_delete", // Global default can_delete
          ],
        },
      ],
      order: [
        ["name", "ASC"],
        [{ model: Permission, as: "permissions" }, "feature_name", "ASC"],
      ],
    });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error("Error fetching modules with permissions:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get permissions for a specific role, showing effective permissions (role-specific or default)
exports.getModulesWithPermissionsByRole = async (req, res) => {
  const { roleId } = req.params;
  const { gym_id } = req.query;

  if (!gym_id) {
    return res
      .status(400)
      .json({ success: false, message: "gym_id query parameter is required." });
  }
  if (!roleId) {
    return res
      .status(400)
      .json({ success: false, message: "roleId path parameter is required." });
  }

  try {
    const role = await Role.findOne({
      where: { id: roleId, gym_id: parseInt(gym_id) },
    });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found for the specified roleId and gym_id.",
      });
    }

    // 1. Fetch all modules and their globally defined permissions
    const allModules = await Module.findAll({
      include: [
        {
          model: Permission,
          as: "permissions", // from Module model
          attributes: [
            "id",
            "feature_name",
            "module_id",
            "can_view",
            "can_add",
            "can_update",
            "can_delete",
          ],
        },
      ],
      order: [
        ["name", "ASC"],
        [{ model: Permission, as: "permissions" }, "feature_name", "ASC"],
      ],
    });

    // 2. Fetch role-specific permission grants for this role
    const roleSpecificGrants = await RolePermission.findAll({
      where: { role_id: roleId },
      attributes: [
        "permission_id",
        "can_view",
        "can_add",
        "can_update",
        "can_delete",
      ],
    });

    // Create a map for easy lookup of role-specific grants
    const grantsMap = new Map();
    roleSpecificGrants.forEach((grant) => {
      grantsMap.set(grant.permission_id, grant);
    });

    // 3. Structure the data, merging global defaults with role-specific grants
    const structuredPermissions = allModules.map((module) => {
      const features = module.permissions
        ? module.permissions.map((p) => {
            const roleGrant = grantsMap.get(p.id);
            return {
              permission_id: p.id,
              feature_name: p.feature_name,
              // Use role-specific grant if available, otherwise use global default from Permission table
              can_view: roleGrant ? roleGrant.can_view : p.can_view,
              can_add: roleGrant ? roleGrant.can_add : p.can_add,
              can_update: roleGrant ? roleGrant.can_update : p.can_update,
              can_delete: roleGrant ? roleGrant.can_delete : p.can_delete,
              // Indicate if the setting is from role-specific or default
              source: roleGrant ? "role-specific" : "default",
            };
          })
        : [];

      return {
        module_id: module.id,
        module_name: module.name,
        features: features,
      };
    });

    res.status(200).json({
      success: true,
      role_id: roleId,
      role_name: role.name,
      gym_id: parseInt(gym_id),
      data: structuredPermissions,
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
    const { staff_id, gym_id } = req.body;

    if (!staff_id || !gym_id) {
      return res.status(400).json({
        success: false,
        message: "staff_id and gym_id are required",
      });
    }

    const staff = await GymOwner.findByPk(staff_id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }

    const role_id = staff.role_id;
    if (!role_id) {
      return res
        .status(400)
        .json({ success: false, message: "Staff has no assigned role" });
    }

    const role = await Role.findOne({
      where: { id: role_id, gym_id: parseInt(gym_id) },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message:
          "Role not found for this staff member or role does not belong to the specified gym.",
      });
    }

    // Fetch RolePermissions which now hold the actual grant
    const rolePermissionsDetails = await RolePermission.findAll({
      where: { role_id: role.id },
      include: [
        {
          model: Permission,
          as: "permission", // from RolePermission model
          include: [
            {
              model: Module,
              as: "module", // from Permission model
            },
          ],
        },
      ],
    });

    const permissionsList = rolePermissionsDetails
      .map((rp) => {
        if (!rp.permission || !rp.permission.module) return null; // Should not happen with inner joins implied by include
        return {
          feature: rp.permission.feature_name,
          module: rp.permission.module.name,
          module_id: rp.permission.module.id,
          permission_id: rp.permission.id,
          actions: {
            // Read from RolePermission itself
            view: rp.can_view === "All",
            add: rp.can_add === "All",
            update: rp.can_update === "All",
            delete: rp.can_delete === "All",
          },
        };
      })
      .filter((p) => p !== null);

    return res.status(200).json({
      success: true,
      data: {
        staff_id: staff.id,
        staff_name: staff.name, // Assuming staff has a name field
        role: role.name,
        role_id: role.id,
        gym_id: role.gym_id,
        permissions: permissionsList,
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

// Get a specific role with its permissions (using the new getModulesWithPermissionsByRole logic for consistency)
// This function might be redundant if getModulesWithPermissionsByRole is comprehensive enough
// For now, it shows how to get RolePermission details.
exports.getRoleWithPermissions = async (req, res) => {
  try {
    const role_id = req.params.id;
    const { gym_id } = req.query;
    console.log("Get Role With Permissions Request:", role_id, gym_id);
    if (!gym_id) {
      return res
        .status(400)
        .json({ error: "gym_id query parameter is required." });
    }

    const role = await Role.findOne({
      where: { id: role_id, gym_id: gym_id },
      include: [
        {
          model: RolePermission,
          as: "rolePermissions", // Alias from Role model
          attributes: [
            "permission_id",
            "can_view",
            "can_add",
            "can_update",
            "can_delete",
          ], // Get grants from RolePermission
          include: [
            {
              model: Permission,
              as: "permission", // Alias from RolePermission model
              attributes: ["id", "feature_name", "module_id"], // Get basic info from Permission
              include: [
                {
                  model: Module,
                  as: "module", // Alias from Permission model
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
        error: "Role not found for the specified role_id and gym_id.",
      });
    }

    // Transform data if needed
    const transformedRole = {
      id: role.id,
      name: role.name,
      gym_id: role.gym_id,
      staff_id: role.staff_id,
      permissions: role.rolePermissions
        .map((rp) => {
          if (!rp.permission || !rp.permission.module) return null;
          return {
            moduleId: rp.permission.module.id,
            moduleName: rp.permission.module.name,
            permissionId: rp.permission.id,
            featureName: rp.permission.feature_name,
            canView: rp.can_view,
            canAdd: rp.can_add,
            canUpdate: rp.can_update,
            canDelete: rp.can_delete,
          };
        })
        .filter((p) => p),
    };

    res
      .status(200)
      .json({ message: "Role details found!", role: transformedRole });
  } catch (err) {
    console.error("Get Role With Permissions Error:", err);
    res.status(500).json({ error: err.message });
  }
};
