const { v4: uuidv4 } = require("uuid");
const AdminDetailsModel = require("./admin_details.model");

const AUTH_SECRET = process.env.AUTH_SECRET;

const validateAuth = (req) => {
  const apiKey = req.headers["x-api-key"];
  const correlationId = req.headers["x-correlation-id"] || uuidv4();

  if (!apiKey || apiKey !== AUTH_SECRET) {
    return { valid: false, correlationId };
  }

  return { valid: true, correlationId };
};

// CREATE
exports.createAdmin = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  const admin_id = req.user.id;
  console.log("amin", admin_id)
  console.log("req.body ",req.body)
  if (!valid) {
    return res.status(403).json({
      errors: [
        {
          code: "AUTH001",
          message: "Invalid API Key",
          displayMessage: "Authentication failed",
        },
      ],
    });
  }

  try {
    const {
      admin_id,
      gym_name,
      owner_name,
      mobile_number,
      alternate_mobile_number,
      email,
      gym_logo,
      profile_image,
      bank_name,
      account_holder_name,
      account_number,
      ifsc_code,
      cancel_cheque,
      pan_name,
      pan_number,
    } = req.body;
    console.log(email)


    if (
      !gym_name ||
      !owner_name ||
      !mobile_number ||
      !email ||
      !bank_name ||
      !account_holder_name ||
      !account_number ||
      !ifsc_code ||
      !pan_name ||
      !pan_number
    ) {
      return res.status(400).json({
        errors: [
          {
            code: "REQ001",
            message: "Missing required fields",
            displayMessage: "Please provide all required fields",
          },
        ],
      });
    }

    // Create the admin record
    const admin = await AdminDetailsModel.create({
      admin_id,
      gym_name,
      owner_name,
      mobile_number,
      alternate_mobile_number,
      email,
      gym_logo,
      profile_image,
      bank_name,
      account_holder_name,
      account_number,
      ifsc_code,
      cancel_cheque,
      pan_name,
      pan_number,
    });

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Admin created successfully",
      },
      data: admin,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

// GET ALL
exports.getAllAdmins = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [
        {
          code: "AUTH001",
          message: "Invalid API Key",
          displayMessage: "Authentication failed",
        },
      ],
    });
  }

  try {
    const admins = await AdminDetailsModel.findAll();

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Fetched successfully",
      },
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

// GET BY ID
// exports.getAdminById = async (req, res) => {
//   const { valid, correlationId } = validateAuth(req);
//   if (!valid) {
//     return res.status(403).json({
//       errors: [
//         {
//           code: "AUTH001",
//           message: "Invalid API Key",
//           displayMessage: "Authentication failed",
//         },
//       ],
//     });
//   }

//   try {
//     const { id } = req.params;
//     const admin = await AdminDetailsModel.findByPk(id);

//     if (!admin) {
//       return res.status(404).json({
//         errors: [
//           {
//             code: "NOT_FOUND",
//             message: "Admin not found",
//             displayMessage: "No admin found with the given ID",
//           },
//         ],
//       });
//     }

//     return res.status(200).json({
//       meta: {
//         "correlation-id": correlationId,
//         code: 200,
//         message: "Fetched successfully",
//       },
//       data: admin,
//     });
//   } catch (error) {
//     console.error("Error fetching admin:", error);
//     return res.status(500).json({
//       errors: [
//         {
//           code: "SERVER_ERROR",
//           message: error.message,
//           displayMessage: "Internal Server Error",
//         },
//       ],
//     });
//   }
// };

exports.getAdminById = async (req, res) => {

  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [
        {
          code: "AUTH001",
          message: "Invalid API Key",
          displayMessage: "Authentication failed",
        },
      ],
    });
  }

  try {
    // Get the admin_id from req.user.id
    const admin_id = req.user.id;
   

    // Search for the admin by admin_id in the AdminDetailsModel
    const admin = await AdminDetailsModel.findOne({
      where: { admin_id },
    });

    if (!admin) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Admin not found",
            displayMessage: "No admin found with the given ID",
          },
        ],
      });
    }

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Fetched successfully",
      },
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

// UPDATE
// exports.updateAdmin = async (req, res) => {
//   const { valid, correlationId } = validateAuth(req);
//   if (!valid) {
//     return res.status(403).json({
//       errors: [
//         {
//           code: "AUTH001",
//           message: "Invalid API Key",
//           displayMessage: "Authentication failed",
//         },
//       ],
//     });
//   }

//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     const admin = await AdminDetailsModel.findByPk(id);

//     if (!admin) {
//       return res.status(404).json({
//         errors: [
//           {
//             code: "NOT_FOUND",
//             message: "Admin not found",
//             displayMessage: "No admin found with the given ID",
//           },
//         ],
//       });
//     }

//     await admin.update(updates);

//     return res.status(200).json({
//       meta: {
//         "correlation-id": correlationId,
//         code: 200,
//         message: "Admin updated successfully",
//       },
//       data: admin,
//     });
//   } catch (error) {
//     console.error("Error updating admin:", error);
//     return res.status(500).json({
//       errors: [
//         {
//           code: "SERVER_ERROR",
//           message: error.message,
//           displayMessage: "Internal Server Error",
//         },
//       ],
//     });
//   }
// };

exports.updateAdmin = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [
        {
          code: "AUTH001",
          message: "Invalid API Key",
          displayMessage: "Authentication failed",
        },
      ],
    });
  }

  try {
    // Get the admin_id from req.user.id
    const admin_id = req.user.id;

    // Find the admin by admin_id in the AdminDetailsModel
    const admin = await AdminDetailsModel.findOne({
      where: { admin_id },
    });

    if (!admin) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Admin not found",
            displayMessage: "No admin found with the given ID",
          },
        ],
      });
    }

    // Update only the fields provided in the request body
    const updates = req.body;
    await admin.update(updates);

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Admin updated successfully",
      },
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};

// DELETE
exports.deleteAdmin = async (req, res) => {
  const { valid, correlationId } = validateAuth(req);
  if (!valid) {
    return res.status(403).json({
      errors: [
        {
          code: "AUTH001",
          message: "Invalid API Key",
          displayMessage: "Authentication failed",
        },
      ],
    });
  }

  try {
    const { id } = req.params;
    const admin = await AdminDetailsModel.findByPk(id);

    if (!admin) {
      return res.status(404).json({
        errors: [
          {
            code: "NOT_FOUND",
            message: "Admin not found",
            displayMessage: "No admin found with the given ID",
          },
        ],
      });
    }

    await admin.destroy();

    return res.status(200).json({
      meta: {
        "correlation-id": correlationId,
        code: 200,
        message: "Admin deleted successfully",
      },
      data: {
        deleted: true,
      },
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({
      errors: [
        {
          code: "SERVER_ERROR",
          message: error.message,
          displayMessage: "Internal Server Error",
        },
      ],
    });
  }
};
