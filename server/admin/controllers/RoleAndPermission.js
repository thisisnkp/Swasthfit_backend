<<<<<<< HEAD
const db = require("../models");
const Role = require("../models/Role");
const Module = require("../models/Modules");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const { Op } = db.Sequelize;
=======
// const db = require("../models");
const Role = require("../models/Role");
const Module = require("../models/Modules");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission")

>>>>>>> restaurent_backend
//  Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
<<<<<<< HEAD
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Role name cannot be empty." });
    }
    const existingRole = await Role.findOne({ where: { name: name.trim() } });
    if (existingRole) {
      return res
        .status(400)
        .json({ error: "Role already exists with this name" });
    }
    const role = await Role.create({ name: name.trim() });
    res
      .status(201)
      .json({ success: true, message: "Role created successfully", role });
=======

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists with this name" });
    }

    // Create new role
    const role = await Role.create({ name });
    res.status(201).json({ message: "Role created", role });
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
      return res
        .status(400)
        .json({ error: "Module already exists with this name" });
=======
      return res.status(400).json({ error: "Module already exists with this name" });
>>>>>>> restaurent_backend
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
  try {
<<<<<<< HEAD
    const { module_id, name, feature_slug } = req.body; // Adjusted to new Permission model
    if (!module_id || !name || !feature_slug) {
      return res
        .status(400)
        .json({ error: "module_id, name, and feature_slug are required" });
    }
    const moduleExists = await Module.findByPk(module_id);
    if (!moduleExists) {
      return res.status(404).json({ error: "Module not found" });
    }
    const existingPermission = await Permission.findOne({
      where: { module_id, feature_slug },
    });
    if (existingPermission) {
      return res
        .status(400)
        .json({ error: "Permission slug already exists for this module" });
    }
    const permission = await Permission.create({
      module_id,
      name,
      feature_slug,
    });
    res
      .status(201)
      .json({ message: "Permission created successfully", permission });
=======
    const { module_id, feature_name, can_add, can_view, can_update, can_delete } = req.body;

    // Validate required fields
    if (!module_id || !feature_name) {
      return res.status(400).json({ error: "module_id and feature are required" });
    }

    // Check if the module exists
    const module = await Module.findByPk(module_id);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }

    // Optional: Check if this permission already exists for the feature in this module
    const existing = await Permission.findOne({ where: { module_id, feature_name } });
    if (existing) {
      return res.status(400).json({ error: "Permission already exists for this feature in the module" });
    }

    // Create the permission
    const permission = await Permission.create({
      module_id,
      feature_name,
      can_view: can_view || 'None',
      can_add: can_add || 'None',
      can_update: can_update || 'None',
      can_delete: can_delete || 'None',
    });

    res.status(201).json({ message: "Permission created successfully", permission });
>>>>>>> restaurent_backend
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
<<<<<<< HEAD
      return res
        .status(400)
        .json({ error: "Invalid role_id. No such role exists." });
=======
      return res.status(400).json({ error: 'Invalid role_id. No such role exists.' });
>>>>>>> restaurent_backend
    }

    // ✅ Check if permission exists
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
<<<<<<< HEAD
      return res
        .status(400)
        .json({ error: "Invalid permission_id. No such permission exists." });
=======
      return res.status(400).json({ error: 'Invalid permission_id. No such permission exists.' });
>>>>>>> restaurent_backend
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

<<<<<<< HEAD
// find role with permissions
=======
// find role with permissions 
>>>>>>> restaurent_backend
exports.getRoleWithPermissions = async (req, res) => {
  try {
    const { role_id } = req.params;

    console.log("Checking role_id:", role_id);

    const role = await Role.findByPk(role_id); // just raw fetch

    if (!role) {
<<<<<<< HEAD
      return res
        .status(404)
        .json({ error: "Invalid role_id. No such role exists." });
=======
      return res.status(404).json({ error: "Invalid role_id. No such role exists." });
>>>>>>> restaurent_backend
    }

    res.status(200).json({ message: "Role found!", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

<<<<<<< HEAD
// get all modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      order: [["name", "ASC"]], // optional: sort alphabetically
=======
// get all modules 
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      order: [['name', 'ASC']], // optional: sort alphabetically
>>>>>>> restaurent_backend
    });

    res.status(200).json({ success: true, modules });
  } catch (error) {
<<<<<<< HEAD
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
      order: [["name", "ASC"]],
      // Removed include for rolePermissions to simplify if frontend doesn't need it for the list
    });
    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};
// save permission
exports.savePermissions = async (req, res) => {
=======
    console.error('Error fetching modules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch modules' });
  }
};

// get all roles 
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: RolePermission,
          as: 'rolePermissions',
        }
      ],
      order: [['name', 'ASC']],
      distinct: true, // prevent duplicates due to joins
    });

    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch roles' });
  }
};


// save permission
 exports.savePermissions = async (req, res) => {
>>>>>>> restaurent_backend
  const { roleId, permissions } = req.body;

  if (!roleId || !Array.isArray(permissions)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Step 1: Remove old permissions for the role
    await RolePermission.destroy({ where: { role_id: roleId } });

    // Step 2: Recreate permissions based on new structure
    for (const moduleItem of permissions) {
<<<<<<< HEAD
      const [module] = await Module.findOrCreate({
        where: { name: moduleItem.module },
      });
=======
      const [module] = await Module.findOrCreate({ where: { name: moduleItem.module } });
>>>>>>> restaurent_backend

      for (const feature of moduleItem.features) {
        const newPermission = await Permission.create({
          module_id: module.id,
          feature: feature.name, // Now stored as a column in Permission table
          can_view: feature.permissions.view,
          can_add: feature.permissions.add,
          can_update: feature.permissions.edit,
          can_delete: feature.permissions.delete,
        });

        await RolePermission.create({
          role_id: roleId,
          permission_id: newPermission.id,
        });
      }
    }

    return res.json({ message: "Permissions saved successfully." });
  } catch (error) {
    console.error("Save Permission Error:", error);
    return res.status(500).json({ message: "Server error" });
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
<<<<<<< HEAD
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
};

// fetch all module with permissions
=======
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
};

// fetch all module with permissions 
>>>>>>> restaurent_backend
exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [
        {
          model: Permission,
<<<<<<< HEAD
          as: "permissions", // Must match alias in Module.associate
          attributes: ["id", "name", "feature_slug"], // 'name' instead of 'feature_name' based on my Permission model suggestion
        },
      ],
      order: [
        ["name", "ASC"],
        [{ model: Permission, as: "permissions" }, "name", "ASC"],
      ],
    });
    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error("Error fetching modules with permissions:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// get specific role permissions

exports.getPermissionsForRole = async (req, res) => {
  // Renamed from getModulesWithPermissionsByRole for clarity
  const { roleId } = req.params;
  try {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }
    const rolePermissions = await RolePermission.findAll({
      where: { role_id: roleId },
      attributes: ["permission_id"],
    });
    const assignedPermissionIds = rolePermissions.map((rp) => rp.permission_id);
    res.status(200).json({
      success: true,
      role: { id: role.id, name: role.name },
      assignedPermissionIds,
    });
  } catch (error) {
    console.error("Error fetching permissions for role:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions for role",
=======
          as: 'permissions',
          attributes: [
            'id',
            'feature_name',
            'can_view',
            'can_add',
            'can_update',
            'can_delete'
          ],
        }
      ],
      order: [['name', 'ASC']],
    });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error('Error fetching modules with permissions:', error);
    res.status(500).json({ success: false, message: 'Something went wrong' });
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
          as: 'permission',
          attributes: [
            'id',
            'feature_name',
            'can_view',
            'can_add',
            'can_update',
            'can_delete',
            'module_id'
          ],
          include: [
            {
              model: Module,
              as: 'module',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: rolePermissions,
    });

  } catch (error) {
    console.error('Error fetching role-based permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch permissions for role',
>>>>>>> restaurent_backend
      error: error.message,
    });
  }
};
<<<<<<< HEAD

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    if (role.is_system_role) {
      return res
        .status(403)
        .json({ message: "System roles cannot be deleted." });
    }
    // Sequelize's onDelete: 'CASCADE' in Role->RolePermission association should handle this,
    // but explicit deletion is safer if cascade is not set or not working.
    // await RolePermission.destroy({ where: { role_id: id } });
    await role.destroy(); // This will also delete associated RolePermissions if onDelete: 'CASCADE' is set
    res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    console.error("Error deleting role:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Role name is required" });
    }
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    if (role.is_system_role) {
      // Assuming you add is_system_role to your Role model
      return res
        .status(403)
        .json({ message: "System roles cannot be modified." });
    }
    const existingRoleWithNewName = await Role.findOne({
      where: { name: name.trim(), id: { [Op.ne]: id } },
    });
    if (existingRoleWithNewName) {
      return res
        .status(400)
        .json({ message: "Another role with this name already exists." });
    }
    role.name = name.trim();
    await role.save();
    res
      .status(200)
      .json({ success: true, message: "Role updated successfully", role });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: err.message });
  }
};
// RoleAndPermission.js

// RoleAndPermission.js
exports.savePermissionsForRole = async (req, res) => {
  const { roleId } = req.params;
  const { permission_ids } = req.body; // Expects an array of permission IDs

  if (!roleId || !Array.isArray(permission_ids)) {
    return res.status(400).json({
      message:
        "Invalid input: roleId and an array of permission_ids are required.",
    });
  }

  const t = await sequelize.transaction();
  try {
    const role = await Role.findByPk(roleId, { transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(404).json({ message: "Role not found." });
    }

    // Remove all existing permissions for this role
    await RolePermission.destroy({
      where: { role_id: roleId },
      transaction: t,
    });

    // Add the new set of permissions
    if (permission_ids.length > 0) {
      const newAssignments = permission_ids.map((permissionId) => ({
        role_id: parseInt(roleId, 10), // Ensure roleId is integer
        permission_id: parseInt(permissionId, 10), // Ensure permissionId is integer
      }));
      await RolePermission.bulkCreate(newAssignments, { transaction: t });
    }

    await t.commit();
    return res
      .status(200)
      .json({ success: true, message: "Permissions saved successfully." });
  } catch (error) {
    await t.rollback();
    console.error("Error saving permissions for role:", error);
    return res
      .status(500)
      .json({ message: "Server error while saving permissions." });
  }
};
=======
>>>>>>> restaurent_backend
