// controllers/gymController.js
const Gym = require("../../gym_owners/gym.model");
const GymSchedule = require("../../model/gymSchedule.model"); // Ensure this is imported
const {
  fileUploaderSingle,
  fileUploaderMultiple,
} = require("../../../../fileUpload");
const path = require("path");
const fs = require("fs");

const ensureUploadDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// ... (createGymBasicInfo and updateGymBasicInfo functions remain as previously corrected) ...
exports.createGymBasicInfo = async (req, res) => {
  const {
    owner_id,
    gym_name,
    about_us,
    tagline,
    capacity,
    email,
    mobile,
    landline,
    business_type,
  } = req.body;

  let facilities_parsed;
  try {
    facilities_parsed = req.body.facilities
      ? JSON.parse(req.body.facilities)
      : [];
  } catch (e) {
    console.error("Error parsing facilities JSON:", e);
    return res
      .status(400)
      .json({ message: "Invalid facilities format. Expected a JSON string." });
  }

  if (!owner_id)
    return res
      .status(400)
      .json({ message: "Owner ID is required to create a gym." });
  if (!gym_name)
    return res.status(400).json({ message: "Gym name is required." });

  // 1. Handle Single Gym Logo (using fileUploaderSingle)
  let gymLogoDbPath = null;
  if (req.files && req.files.gym_logo_file) {
    const logoFile = req.files.gym_logo_file;
    const fileExtension = logoFile.name.split(".").pop().toLowerCase();
    const allowedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        message:
          "Invalid file type for logo. Allowed: " +
          allowedExtensions.join(", "),
      });
    }
    try {
      const uploadDirNameLogo = "gym_logos";
      const uploadBasePathLogo = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "uploads",
        uploadDirNameLogo
      );
      ensureUploadDirExists(uploadBasePathLogo);
      const uploadedFileInfo = await fileUploaderSingle(
        uploadBasePathLogo,
        logoFile
      );
      gymLogoDbPath = `${uploadDirNameLogo}/${uploadedFileInfo.newFileName}.${fileExtension}`; // newFileName from single is base name
    } catch (uploadError) {
      console.error("Error uploading gym logo:", uploadError);
      return res.status(500).json({ message: "Error uploading gym logo." });
    }
  }

  // 2. Handle Multiple Gym Gallery Photos (using fileUploaderMultiple)
  let gymGalleryPaths = [];
  if (req.files && req.files.gym_gallery_files) {
    const uploadDirNameGallery = "gym_gallery_photos"; // Directory for gallery photos
    const uploadBasePathGallery = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "public",
      "uploads",
      uploadDirNameGallery
    );
    ensureUploadDirExists(uploadBasePathGallery);

    const galleryFilesInput = {
      gym_gallery_files: req.files.gym_gallery_files,
    };

    try {
      const uploadedGalleryInfos = await fileUploaderMultiple(
        uploadBasePathGallery,
        galleryFilesInput
      );

      const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
      uploadedGalleryInfos.forEach((info) => {
        const fileExt = info.originalFileName.split(".").pop().toLowerCase();
        if (allowedImageExtensions.includes(fileExt)) {
          gymGalleryPaths.push(`${uploadDirNameGallery}/${info.newFileName}`);
        } else {
          console.warn(
            `Skipped gallery file ${info.originalFileName} due to invalid extension during processing.`
          );
        }
      });
    } catch (uploadError) {
      console.error("Error uploading gym gallery photos:", uploadError);
    }
  }

  try {
    const newGymData = {
      owner_id,
      gym_name,
      business_type: business_type || "Direct",
      about_us: about_us || null,
      tagline: tagline || null,
      capacity: capacity || null,
      email: email || null,
      mobile: mobile || null,
      landline: landline || null,
      facilities: facilities_parsed,
      gym_logo: gymLogoDbPath,
      gym_photos: gymGalleryPaths.length > 0 ? gymGalleryPaths : null,
    };

    const gym = await Gym.create(newGymData);
    return res.status(201).json({ message: "Gym created successfully.", gym });
  } catch (error) {
    console.error("Error creating gym:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating gym." });
  }
};

exports.updateGymBasicInfo = async (req, res) => {
  const gymId = req.params.id;
  const {
    gym_name,
    about_us,
    tagline,
    capacity,
    email,
    mobile,
    landline,
    business_type,
    remove_gym_logo,
    clear_all_gallery_photos,
  } = req.body;

  if (!gymId)
    return res.status(400).json({ message: "Gym ID is required for updates." });

  let facilities_parsed;
  if (req.body.facilities !== undefined) {
    try {
      facilities_parsed = JSON.parse(req.body.facilities);
    } catch (e) {
      return res.status(400).json({ message: "Invalid facilities format." });
    }
  }

  try {
    const gym = await Gym.findByPk(gymId);
    if (!gym) return res.status(404).json({ message: "Gym not found." });

    const updateData = {};
    if (gym_name !== undefined) updateData.gym_name = gym_name;
    if (about_us !== undefined) updateData.about_us = about_us;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (email !== undefined) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;
    if (landline !== undefined) updateData.landline = landline;
    if (facilities_parsed !== undefined)
      updateData.facilities = facilities_parsed;
    if (business_type !== undefined) updateData.business_type = business_type;

    let gymLogoDbPath = gym.gym_logo;
    if (remove_gym_logo === "true" && gym.gym_logo) {
      gymLogoDbPath = null;
    }
    if (req.files && req.files.gym_logo_file) {
      const logoFile = req.files.gym_logo_file;
      const fileExtension = logoFile.name.split(".").pop().toLowerCase();
      const allowedExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: "Invalid file type for logo." });
      }
      try {
        const uploadDirNameLogo = "gym_logos";
        const uploadBasePathLogo = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "public",
          "uploads",
          uploadDirNameLogo
        );
        ensureUploadDirExists(uploadBasePathLogo);
        const uploadedFileInfo = await fileUploaderSingle(
          uploadBasePathLogo,
          logoFile
        );
        gymLogoDbPath = `${uploadDirNameLogo}/${uploadedFileInfo.newFileName}.${fileExtension}`;
      } catch (uploadError) {
        return res
          .status(500)
          .json({ message: "Error uploading gym logo for update." });
      }
    }
    if (gymLogoDbPath !== gym.gym_logo) {
      updateData.gym_logo = gymLogoDbPath;
    }

    let newGalleryPhotoPaths = null;

    if (req.files && req.files.gym_gallery_files) {
      newGalleryPhotoPaths = [];
      const uploadDirNameGallery = "gym_gallery_photos";
      const uploadBasePathGallery = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "public",
        "uploads",
        uploadDirNameGallery
      );
      ensureUploadDirExists(uploadBasePathGallery);

      const galleryFilesInput = {
        gym_gallery_files: req.files.gym_gallery_files,
      };

      try {
        const uploadedGalleryInfos = await fileUploaderMultiple(
          uploadBasePathGallery,
          galleryFilesInput
        );
        const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
        uploadedGalleryInfos.forEach((info) => {
          const fileExt = info.originalFileName.split(".").pop().toLowerCase();
          if (allowedImageExtensions.includes(fileExt)) {
            newGalleryPhotoPaths.push(
              `${uploadDirNameGallery}/${info.newFileName}`
            );
          } else {
            console.warn(
              `Skipped gallery file ${info.originalFileName} due to invalid extension during update processing.`
            );
          }
        });
        updateData.gym_photos = newGalleryPhotoPaths;
      } catch (uploadError) {
        console.error(
          "Error uploading gym gallery photos during update:",
          uploadError
        );
      }
    } else if (clear_all_gallery_photos === "true") {
      updateData.gym_photos = [];
    }

    await gym.update(updateData);
    await gym.reload();

    return res
      .status(200)
      .json({ message: "Gym information updated successfully.", gym });
  } catch (error) {
    console.error("Error updating gym basic info:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
};

// GET - Fetch specific gym details (useful for pre-filling edit form)
// ***** MODIFIED FUNCTION *****
exports.getGymBasicInfo = async (req, res) => {
  const gymId = req.params.id;

  try {
    const gym = await Gym.findByPk(gymId, {
      include: [
        {
          model: GymSchedule,
          as: "schedule", // This 'as' must match the alias defined in Gym.hasOne association
          required: false, // Makes it a LEFT JOIN; gym data returns even if no schedule
        },
      ],
    });

    if (!gym) {
      return res.status(404).json({ message: "Gym not found." });
    }
    // The 'gym' object will now have a 'schedule' property.
    // The afterFind hooks on both Gym and GymSchedule models will have processed their respective fields.
    return res.status(200).json({ gym });
  } catch (error) {
    console.error("Error fetching gym info with schedule:", error); // Updated log message
    return res.status(500).json({
      message:
        "Internal server error while fetching gym information with schedule.", // Updated error message
    });
  }
};
// ***** END OF MODIFIED FUNCTION *****

exports.updateGymLocationDetails = async (req, res) => {
  const gymId = req.params.id;
  const { gym_address, gym_geo_location } = req.body;

  if (!gym_address && !gym_geo_location) {
    return res.status(400).json({
      success: false,
      message: "No location data provided to update.",
    });
  }

  try {
    const gym = await Gym.findByPk(gymId);

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found.",
      });
    }

    if (gym_address) {
      gym.gym_address = gym_address;
    }
    if (gym_geo_location) {
      gym.gym_geo_location = gym_geo_location;
    }

    await gym.save();

    res.status(200).json({
      success: true,
      message: "Gym location details updated successfully.",
      data: gym,
    });
  } catch (error) {
    console.error("Error updating gym location:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update gym location.",
      error: error.message,
    });
  }
};

exports.createOrUpdateGymSchedule = async (req, res) => {
  const {
    gym_id,
    workingDays,
    sessions,
    workout_details,
    alternate_closing_time,
  } = req.body;

  if (!gym_id) {
    return res.status(400).json({ message: "gym_id is required." });
  }
  if (
    !workingDays ||
    typeof workingDays !== "object" ||
    Object.keys(workingDays).length === 0
  ) {
    return res
      .status(400)
      .json({ message: "workingDays object is required and cannot be empty." });
  }
  if (!sessions || !Array.isArray(sessions)) {
    return res.status(400).json({ message: "sessions array is required." });
  }

  try {
    const gym = await Gym.findByPk(gym_id);
    if (!gym) {
      return res
        .status(404)
        .json({ message: `Gym with ID ${gym_id} not found.` });
    }

    const timingsData = {
      workingDays: workingDays,
      sessions: sessions,
    };

    const scheduleData = {
      gym_id: parseInt(gym_id, 10),
      timings: timingsData,
      workout_details: workout_details || [],
      alternate_closing_time: alternate_closing_time || "N/A",
    };

    let gymSchedule = await GymSchedule.findOne({
      where: { gym_id: scheduleData.gym_id },
    });

    if (gymSchedule) {
      await gymSchedule.update(scheduleData);
      res.status(200).json({
        message: "Gym schedule updated successfully.",
        data: gymSchedule,
      });
    } else {
      gymSchedule = await GymSchedule.create(scheduleData);
      res.status(201).json({
        message: "Gym schedule created successfully.",
        data: gymSchedule,
      });
    }
  } catch (error) {
    console.error("Error creating or updating gym schedule:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation error.",
        errors: error.errors.map((e) => e.message),
      });
    }
    res
      .status(500)
      .json({ message: "Failed to save gym schedule.", error: error.message });
  }
};
