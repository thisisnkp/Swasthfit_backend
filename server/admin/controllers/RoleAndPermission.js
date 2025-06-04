const Role = require("../models/Role");
const Module = require("../models/Modules");
const Permission = require("../models/Permission");
const RolePermission = require("../models/RolePermission");
const { Op, sequelize } = require("sequelize");

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Role name cannot be empty." });
    }
    const existingRole = await Role.findOne({ where: { name: name.trim() } });
    if (existingRole) {
      return res.status(400).json({ error: "Role already exists with this name" });
    }
    const role = await Role.create({ name: name.trim() });
    res.status(201).json({ success: true, message: "Role created successfully", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new module
exports.createModule = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Module name is required" });

    const existingModule = await Module.findOne({ where: { name } });
    if (existingModule) return res.status(400).json({ error: "Module already exists with this name" });

    const module = await Module.create({ name });
    res.status(201).json({ message: "Module created successfully", module });
  } catch (error) {
    console.error("Create Module Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create permission
exports.createPermission = async (req, res) => {
  try {
    const { module_id, name, feature_slug } = req.body;
    if (!module_id || !name || !feature_slug) {
      return res.status(400).json({ error: "module_id, name, and feature_slug are required" });
    }

    const moduleExists = await Module.findByPk(module_id);
    if (!moduleExists) return res.status(404).json({ error: "Module not found" });

    const existingPermission = await Permission.findOne({ where: { module_id, feature_slug } });
    if (existingPermission) {
      return res.status(400).json({ error: "Permission already exists for this feature in the module" });
    }

    const permission = await Permission.create({ module_id, name, feature_slug });
    res.status(201).json({ message: "Permission created successfully", permission });
  } catch (error) {
    console.error("Create Permission Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Assign single permission to role
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    const role = await Role.findByPk(role_id);
    if (!role) return res.status(400).json({ error: "Invalid role_id. No such role exists." });

    const permission = await Permission.findByPk(permission_id);
    if (!permission) return res.status(400).json({ error: "Invalid permission_id. No such permission exists." });

    const rolePermission = await RolePermission.create({ role_id, permission_id });

    res.status(201).json({ message: "Permission assigned to role", rolePermission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all modules with permissions
exports.getAllModulesWithPermissions = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: [{
        model: Permission,
        as: "permissions",
        attributes: ["id", "name", "feature_slug"]
      }],
      order: [["name", "ASC"], [{ model: Permission, as: "permissions" }, "name", "ASC"]],
    });

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error("Error fetching modules with permissions:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get specific role with permission IDs
exports.getPermissionsForRole = async (req, res) => {
  const { roleId } = req.params;
  try {
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ success: false, message: "Role not found" });

    const rolePermissions = await RolePermission.findAll({
      where: { role_id: roleId },
      attributes: ["permission_id"],
    });

    const assignedPermissionIds = rolePermissions.map(rp => rp.permission_id);

    res.status(200).json({
      success: true,
      role: { id: role.id, name: role.name },
      assignedPermissionIds,
    });
  } catch (error) {
    console.error("Error fetching permissions for role:", error);
    res.status(500).json({ success: false, message: "Failed to fetch permissions for role", error: error.message });
  }
};

// Save permissions for role (bulk)
exports.savePermissionsForRole = async (req, res) => {
  const { roleId } = req.params;
  const { permission_ids } = req.body;

  if (!roleId || !Array.isArray(permission_ids)) {
    return res.status(400).json({ message: "Invalid input: roleId and an array of permission_ids are required." });
  }

  const t = await sequelize.transaction();
  try {
    const role = await Role.findByPk(roleId, { transaction: t });
    if (!role) {
      await t.rollback();
      return res.status(404).json({ message: "Role not found." });
    }

    await RolePermission.destroy({ where: { role_id: roleId }, transaction: t });

    if (permission_ids.length > 0) {
      const newAssignments = permission_ids.map(permissionId => ({
        role_id: parseInt(roleId),
        permission_id: parseInt(permissionId),
      }));
      await RolePermission.bulkCreate(newAssignments, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ success: true, message: "Permissions saved successfully." });
  } catch (error) {
    await t.rollback();
    console.error("Error saving permissions for role:", error);
    return res.status(500).json({ message: "Server error while saving permissions." });
  }
};

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [["name", "ASC"]],
    });

    res.status(200).json({ success: true, roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ success: false, message: "Failed to fetch roles" });
  }
};

// Get all modules
exports.getModules = async (req, res) => {
  try {
    const modules = await Module.findAll({ order: [["name", "ASC"]] });
    res.status(200).json({ success: true, modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ success: false, message: "Failed to fetch modules" });
  }
};

// Get single role (raw data)
exports.getRoleWithPermissions = async (req, res) => {
  try {
    const { role_id } = req.params;
    const role = await Role.findByPk(role_id);
    if (!role) return res.status(404).json({ error: "Invalid role_id. No such role exists." });

    res.status(200).json({ message: "Role found!", role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Role name is required" });
    }

    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.is_system_role) {
      return res.status(403).json({ message: "System roles cannot be modified." });
    }

    const existingRoleWithNewName = await Role.findOne({
      where: { name: name.trim(), id: { [Op.ne]: id } },
    });
    if (existingRoleWithNewName) {
      return res.status(400).json({ message: "Another role with this name already exists." });
    }

    role.name = name.trim();
    await role.save();

    res.status(200).json({ success: true, message: "Role updated successfully", role });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    if (role.is_system_role) {
      return res.status(403).json({ message: "System roles cannot be deleted." });
    }

    await role.destroy();
    res.status(200).json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    console.error("Error deleting role:", err);
    res.status(500).json({ error: err.message });
  }
};
