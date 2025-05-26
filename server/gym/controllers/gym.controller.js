const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
//const User = require('../../user/user.model'); //user model
// const Gym = require('../model/gym.model');
// const gymOwners = require('../model/gymOwners.model')
// const gymSchedule = require('../model/gymSchedule.model');
// const {Gym, gymOwners, GymSchedule} = require('../models');
const Gym =require('../gym_owners/gym.model');
const gymOwners = require('../gym_owners/gym.Owner.model')
const GymSchedule = require('../model/gymSchedule.model');
const { fileUploaderSingle } = require('../../../fileUpload');

/**
 * Registration API For registering GYM Owner
 */
// exports.registration = async (req, res) => {
//   try {
//     // Validate required fields
//     const requiredFields = [
//       "owner_name",
//       "mobile",
//       "password", // Added password validation
//       "gym_name",
//       "address",
//       "latitude",
//       "longitude",
//     ];

//     for (const field of requiredFields) {
//       if (!req.body[field]) {
//         return res.status(400).json({
//           status: 400,
//           success: false,
//           message: `Missing required field: ${field}`,
//         });
//       }
//     }

//     // Check if gym owner already exists
//     const existingUser = await gymOwners.findOne({
//       where: { mobile: req.body.mobile },
//     });
//     if (existingUser) {
//       return res.status(400).json({
//         status: 406,
//         success: false,
//         message: "User is already registered with this mobile number.",
//       });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);

//     // Upload profile image if provided
//     let profileImage;
//     if (req.files && req.files.profile_photo) {
//       profileImage = await fileUploaderSingle("./uploads/gym/", req.files.profile_photo);
//     } else {
//       profileImage = "";
//     }

//     // Create a new gym owner
//     const newGymOwner = await gymOwners.create({
//       name: req.body.owner_name,
//       mobile: req.body.mobile,
//       alternate_mobile: req.body.alternate_mobile || "",
//       email: req.body.email_id || "",
//       password: hashedPassword, // Save the hashed password
//       profile_image: profileImage.newFileName || "",
//       pancard_name: req.body.pancard_name || "",
//       pancard_no: req.body.pancard_number || "",
//     });

//     const ownerID = newGymOwner.id;

//     // Create a new gym
//     const gym = await Gym.create({
//       owner_id: ownerID,
//       gym_name: req.body.gym_name,
//       gym_logo: req.body.gym_logo || "",
//       gym_address: req.body.address,
//       gym_geo_location: JSON.stringify({
//         latitude: req.body.latitude,
//         longitude: req.body.longitude,
//       }),
//       facilities: Array.isArray(req.body.facilities) ? req.body.facilities.join(",") : "",
//       msme_certificate_number: req.body.msme_certificate_number || "",
//       msme_certificate_photo: req.body.msme_certificate_photo || "",
//       shop_certificate: req.body.shop_certificate || "",
//       shop_certificate_photo: req.body.shop_certificate_photo || "",
//       about_us: req.body.about_us || "",
//       gst_details: req.body.gst_number || "",
//       bank_details: JSON.stringify({
//         bank_name: req.body.bank_name || null,
//         account_holder_name: req.body.account_holder_name || null,
//         account_number: req.body.account_number || null,
//         ifsc_code: req.body.ifsc_code || null,
//         cancel_cheque: req.body.cancel_cheque_photo || null,
//       }),
//     });

//     const gymID = gym.id;

//     // Create a gym schedule
//     const newGymSchedule = await GymSchedule.create({
//       gym_id: gymID,
//       workout_details: Array.isArray(req.body.workout_details)
//         ? JSON.stringify(req.body.workout_details)
//         : JSON.stringify([]),
//       timings: "",
//       alternate_closing_time: "",
//     });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: newGymOwner.id, mobile: newGymOwner.mobile, email: newGymOwner.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "24h" } // Set token expiration to 24 hours
//     );

//     // Return success response
//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Registration of gym successful!",
//       data: {
//         gym,
//         token, // Include the token in the response
//       },
//     });
//   } catch (error) {
//     console.error("Error during gym registration:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Getting All Gym Lists
exports.gymsList = async(req, res) => {
    try{
      const offset = req.query.offset;
      const limit = req.query.limit;
      const {rows, count} = await Gym.findAndCountAll({
       offset:parseInt(offset),
       limit:parseInt(limit),
        include: [
          {
          model: gymOwners
        }
      ]
      });
      res.status(200).json({ 
        status: 200,
        success: true,
        message : 'List of all gyms',
        total: count,
        data: rows
      });
    } catch(error) {
      console.log(error)
      res.status(500).json({ message : error.message });
    }
};


exports.gymLogin = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    console.log("Login Request Body:", req.body); // Debug log

    // Validate input
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password are required" });
    }

    // Check if the user exists
    const gymOwner = await gymOwners.findOne({ where: { mobile } });
    if (!gymOwner) {
      return res.status(404).json({ message: "Gym owner not found" });
    }

    // Compare passwords
    console.log('hii',gymOwner.password)
    const isPasswordMatch = await bcrypt.compare(password, gymOwner.password);
    console.log("Password Match:", isPasswordMatch); // Debug log
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: gymOwner.id, mobile: gymOwner.mobile, email: gymOwner.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return success response
    res.status(200).json({
      message: "Login successful",
      token,
      gymOwner: {
        id: gymOwner.id,
        name: gymOwner.name,
        email: gymOwner.email,
        mobile: gymOwner.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



/**
 * Login Gym API with OTPless Login
 */



// create GYM
exports.createGym = async (req, res) => {
  try {
    const {
      ownerId,
      business_type,
      gym_name,
      gym_address,
      gym_geo_location,
      facilities, // JSON format
      msme_certificate_number,
      about_us,
      gst_details,
      bank_details, // JSON format
    } = req.body;

    // Validate required fields
    if (!ownerId || !gym_name || !gym_address || !gym_geo_location) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Missing required fields",
      });
    }

    // Define upload paths
    const uploadPaths = {
      gymLogo: "./uploads/gym/logos/",
      msmePhoto: "./uploads/gym/msme/",
      shopCertPhoto: "./uploads/gym/certificates/",
      cancelCheque: "./uploads/gym/cheques/",
    };

    // Upload files if provided
    const uploadedGymLogo = req.files?.gym_logo
      ? await fileUploaderSingle(uploadPaths.gymLogo, req.files.gym_logo)
      : null;

    const uploadedMsmePhoto = req.files?.msme_certificate_photo
      ? await fileUploaderSingle(uploadPaths.msmePhoto, req.files.msme_certificate_photo)
      : null;

    const uploadedShopCertPhoto = req.files?.shop_certificate_photo
      ? await fileUploaderSingle(uploadPaths.shopCertPhoto, req.files.shop_certificate_photo)
      : null;

    const uploadedCancelCheque = req.files?.cancel_cheque
      ? await fileUploaderSingle(uploadPaths.cancelCheque, req.files.cancel_cheque)
      : null;

    // Create a new gym record in the database
    const newGym = await Gym.create({
      owner_id: ownerId,
      business_type: business_type || "",
      gym_name: gym_name,
      gym_logo: uploadedGymLogo ? uploadedGymLogo.newFileName : null,
      gym_address: gym_address,
      gym_geo_location: JSON.stringify(gym_geo_location),
      facilities: facilities ? JSON.stringify(facilities) : null,
      msme_certificate_number: msme_certificate_number || "",
      msme_certificate_photo: uploadedMsmePhoto ? uploadedMsmePhoto.newFileName : null,
      shop_certificate_photo: uploadedShopCertPhoto ? uploadedShopCertPhoto.newFileName : null,
      about_us: about_us || "",
      gst_details: gst_details || "",
      bank_details: bank_details ? JSON.stringify(bank_details) : null,
      cancel_cheque: uploadedCancelCheque ? uploadedCancelCheque.newFileName : null,
    });

    // Send success response
    res.status(201).json({
      status: 201,
      success: true,
      message: "Gym created successfully",
      data: newGym,
    });
  } catch (error) {
    console.error("Error during gym creation:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while creating the gym",
      error: error.message,
    });
  }
};