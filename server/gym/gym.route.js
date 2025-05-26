const express = require("express");

// const {
//   gymsList,
//   // gymLogin,
//   createGym,
//   // getGymByEmail,
// } = require("./controllers/gym.controller");

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
} = require("./role/role.controller");

const { registerGymUser } = require("./user/user.controller");

const gymAboutController = require("./gym_about/gymabout.controller");

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
router.get("/module-permission", getAllModulesWithPermissions);
router.get("/roles/:roleId/permissions", getModulesWithPermissionsByRole);

// gym user-register
router.post("/registerGymUser", registerGymUser);

// Gym About APIs
router.post("/about", verifyJWT, gymAboutController.createOrUpdateGym);
router.get("/about", verifyJWT, gymAboutController.getAllGyms);
router.get("/about/:gym_id", verifyJWT, gymAboutController.getGymById);
router.put("/:id", verifyJWT, gymAboutController.updateGymAbout);
router.delete("/:id", verifyJWT, gymAboutController.deleteGymAbout);

module.exports = router;
