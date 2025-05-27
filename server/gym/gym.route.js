const express = require("express");

const { getUsersByGymId } = require("./controllers/gym.controller");

const {
  // createGymOwner,
  getAllGymOwners,
  getGymOwnerById,
  updateGymOwner,
  deleteGymOwner,
  Register,
  gymLogin,
  getGymByEmail,
  getAllGymStaff,
  getGymStaffById,
} = require("./gym_owners/gym.controller");

const {
  createAmenity,
  getAmenity,
  getAllAmenities,
  updateAmenity,
  deleteAmenity,
} = require("./gym_amenities/amenities.controller");

const {
  createRole,
  createModule,
  createPermission,
  assignPermissionToRole,
  getRoleWithPermissions,
  getModules,
  getRoles,
  savePermissions,
  getAllModulesWithPermissions,
  getModulesWithPermissionsByRole,
  checkStaffPermissions,
} = require("./role/role.controller");

const { registerGymUser } = require("./user/user.controller");

const checkPermission = require("./role/permission.controller");

const loginAccess = require("../../login.middleware");

const verifyJWT = require("../../checkingAccess");
const Coupons = require("./coupons/discount_coupons.controller");

const router = express.Router();
router.use(express.json());

// Registration route
// router.post("/registration", loginAccess(), registration);

//Gym List Api
// router.get("/gyms-list", loginAccess(), gymsList);

// router.get("/gymOwnerByEmail", loginAccess(), getGymByEmail);

// Login API
// router.post("/login", loginAccess(), gymLogin);
router.get("/users/gym", getUsersByGymId);

router.post("/register", Register);
router.post("/login", gymLogin);
router.get("/gymOwnerByEmail", getGymByEmail);

// router.post("/createGymOwner", createGymOwner);
router.get("/getGymOwner", getAllGymOwners);
router.get("/getGymOwnerById/:id", getGymOwnerById);
router.put("/updateGymOwner/:id", updateGymOwner);
router.delete("/deleteGymOwner/:id", deleteGymOwner);

router.post("/createAmenity", createAmenity);
router.get("/getAmenity/:id", getAmenity);
router.get("/getAllAmenities", getAllAmenities);
router.put("/updateAmenity/:id", updateAmenity);
router.delete("/deleteAmenity/:id", deleteAmenity);

// Gym Staff Routes
router.get("/getAllGymStaff", getAllGymStaff);
router.get("/getGymStaffById/:id", getGymStaffById);

// gym coupons routes
router.post("/createCoupons", verifyJWT, Coupons.createCoupon);
router.get("/getCoupons", verifyJWT, Coupons.getCouponsByVendorAndModule);
router.post("/useCoupons", Coupons.useCoupon);
router.get("/couponsData", Coupons.getCouponsData);
router.get("/checkCouponCode", Coupons.checkCouponCode);

// role APIs
router.post("/role", createRole);
router.post("/module", createModule);
router.post("/createPermission", createPermission);
router.post("/assign-role", assignPermissionToRole);
router.get("/roles/:role_id", getRoleWithPermissions);
router.get("/modules", getModules);
router.get("/roles", getRoles);
router.post("/save", savePermissions);
router.get("/checkStaffPermissions", checkStaffPermissions);

router.get(
  "/module-permission",

  getAllModulesWithPermissions
);
router.get(
  "/roles/:roleId/permissions",

  getModulesWithPermissionsByRole
);

const {
  checkAndUpdateTrainer,

  createTrainerWithUser,
  getTrainersByGymId,
} = require("./controllers/trainers/traniners.controller");

// Add verifyJWT middleware to protect these routes
router.post("/check-trainer", verifyJWT, checkAndUpdateTrainer);

// Route to get trainers by gym_id
router.get("/trainers/:gym_id", verifyJWT, getTrainersByGymId);
// gym user-register
router.post("/trainer/create", verifyJWT, createTrainerWithUser);

router.post("/registerGymUser", registerGymUser);

// Dashboard routes
const {
  getMembershipsByGymId,
  getExpiredMembershipsByGymId,
  markAttendance,
  getAttendanceByGymId,
} = require("./controllers/dashboard/getAllValues");
router.get("/memberships/near-end", getMembershipsByGymId);
router.get("/memberships/expired", getExpiredMembershipsByGymId);
router.post("/gym-attendance", markAttendance);
router.get("/get-gym-attendance", getAttendanceByGymId);

// batch routes for create and assign
const {
  createBatch,
  assignBatch,
  getBatchesWithAssignedUsers,
  getAllBatchesByGymId,
} = require("./controllers/batchs/createAssign.controller");
router.post("/batch", createBatch);
router.post("/assign-batch", assignBatch);
router.get("/get-batches", getBatchesWithAssignedUsers);
router.get("/batches/gym", getAllBatchesByGymId);

// birthday routes
const {
  getUsersByBirthday,
} = require("./controllers/birthday/getBirthdayOfUser.controller");
router.get("/users/birthdays", getUsersByBirthday);

module.exports = router;
