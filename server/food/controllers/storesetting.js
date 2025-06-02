const RestaurantSettings = require("../models/storesetting");
const FoodRestaurant = require("../models/Restaurant");
const validator = require("validator");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
exports.createSettings = async (req, res) => {
  try {
    const data = req.body;

    // Validate restaurant exists
    const restaurant = await FoodRestaurant.findByPk(data.restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if settings already exist
    const existing = await RestaurantSettings.findOne({
      where: { restaurant_id: data.restaurant_id },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Settings already exist for this restaurant" });
    }

    // Validate required fields
    if (!data.restaurant_name) {
      return res.status(400).json({ message: "restaurant_name is required" });
    }
    if (!data.owner_full_name) {
      return res.status(400).json({ message: "owner_full_name is required" });
    }

    // Validate phone numbers (only digits, exactly 10 chars)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(data.owner_phone_number)) {
      return res
        .status(400)
        .json({
          message: "Invalid owner phone number. Must be exactly 10 digits.",
        });
    }
    if (
      data.alternate_phone_number &&
      !phoneRegex.test(data.alternate_phone_number)
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid alternate phone number. Must be exactly 10 digits.",
        });
    }

    // Validate email format strictly and reject test domains
    if (data.owner_email) {
      if (!validator.isEmail(data.owner_email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const emailDomain = data.owner_email.split("@")[1].toLowerCase();
      const blacklistedDomains = [
        "example.com",
        "test.com",
        "example.org",
        "example.net",
        "testmail.com",
        "mailinator.com",
        "fakeemail.com",
      ];

      if (blacklistedDomains.includes(emailDomain)) {
        return res
          .status(400)
          .json({ message: "Email domain is not allowed." });
      }
    }

    // Validate URLs if provided
    ["facebook_url", "instagram_url", "twitter_url"].forEach((field) => {
      if (data[field] && !validator.isURL(data[field])) {
        return res
          .status(400)
          .json({ message: `Invalid URL format for ${field}` });
      }
    });

    // Validate numeric fields
    if (data.zip_code && !/^\d+$/.test(data.zip_code)) {
      return res.status(400).json({ message: "zip_code must be numeric." });
    }

    if (data.latitude && isNaN(parseFloat(data.latitude))) {
      return res
        .status(400)
        .json({ message: "latitude must be a valid number." });
    }

    if (data.longitude && isNaN(parseFloat(data.longitude))) {
      return res
        .status(400)
        .json({ message: "longitude must be a valid number." });
    }

    // Validate opening_time and close_time
    // Assuming the format is 'HH:mm' (24-hour)
    if (data.opening_time && data.close_time) {
      // Parse hours and minutes
      const parseTime = (timeStr) => {
        const [h, m] = timeStr.split(":").map(Number);
        if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59)
          return null;
        return h * 60 + m; // total minutes from midnight
      };

      const openingMinutes = parseTime(data.opening_time);
      const closeMinutes = parseTime(data.close_time);

      if (openingMinutes === null) {
        return res
          .status(400)
          .json({
            message: "Invalid format for opening_time. Use HH:mm format.",
          });
      }
      if (closeMinutes === null) {
        return res
          .status(400)
          .json({
            message: "Invalid format for close_time. Use HH:mm format.",
          });
      }

      if (closeMinutes <= openingMinutes) {
        return res
          .status(400)
          .json({ message: "close_time must be after opening_time." });
      }
    }

    // Handle restaurant_logo if file uploaded using multer
    if (req.file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({
            message:
              "Invalid file type for restaurant logo. Only images allowed.",
          });
      }
      data.restaurant_logo = req.file.filename;
    }

    const settingsData = {
      restaurant_id: data.restaurant_id,
      restaurant_logo: data.restaurant_logo || null,
      restaurant_name: data.restaurant_name,
      owner_full_name: data.owner_full_name,
      owner_phone_number: data.owner_phone_number,
      alternate_phone_number: data.alternate_phone_number || null,
      owner_email: data.owner_email || null,
      full_address: data.full_address || null,
      zip_code: data.zip_code || null,
      city: data.city || null,
      country: data.country || null,
      opening_time: data.opening_time || null,
      close_time: data.close_time || null,
      meta_title: data.meta_title || null,
      meta_tag_keyword: data.meta_tag_keyword || null,
      description: data.description || null,
      facebook_url: data.facebook_url || null,
      instagram_url: data.instagram_url || null,
      twitter_url: data.twitter_url || null,
      latitude: data.latitude ? parseFloat(data.latitude) : null,
      longitude: data.longitude ? parseFloat(data.longitude) : null,
    };

    const settings = await RestaurantSettings.create(settingsData);
    // .json({ message: 'Invalid role specified' });
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.error("Error creating restaurant settings:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getSettingsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const settings = await RestaurantSettings.findOne({
      where: { restaurant_id: restaurantId },
    });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    return res.json(settings);
  } catch (error) {
    console.error("Error fetching restaurant settings:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSettingsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const data = req.body;

 

    // Fetch existing settings
    const settings = await RestaurantSettings.findOne({
      where: { restaurant_id: restaurantId },
    });

    if (!settings) {
      return res
        .status(404)
        .json({ message: "Settings not found for the restaurant." });
    }

    // Validate phone numbers
    const phoneRegex = /^\d{10}$/;
    if (data.owner_phone_number && !phoneRegex.test(data.owner_phone_number)) {
      return res
        .status(400)
        .json({ message: "Invalid owner phone number. Must be 10 digits." });
    }
    if (
      data.alternate_phone_number &&
      !phoneRegex.test(data.alternate_phone_number)
    ) {
      return res
        .status(400)
        .json({
          message: "Invalid alternate phone number. Must be 10 digits.",
        });
    }

    // Validate email
    if (data.owner_email) {
      if (!validator.isEmail(data.owner_email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const emailDomain = data.owner_email.split("@")[1].toLowerCase();
      const blacklistedDomains = [
        "example.com",
        "test.com",
        "mailinator.com",
        "fakeemail.com",
      ];
      if (blacklistedDomains.includes(emailDomain)) {
        return res
          .status(400)
          .json({ message: "Email domain is not allowed." });
      }
    }

    // Validate URLs
    ["facebook_url", "instagram_url", "twitter_url"].forEach((field) => {
      if (data[field] && !validator.isURL(data[field])) {
        return res
          .status(400)
          .json({ message: `Invalid URL format for ${field}` });
      }
    });

    // Validate zip code
    if (data.zip_code && !/^\d+$/.test(data.zip_code)) {
      return res.status(400).json({ message: "zip_code must be numeric." });
    }

    // Validate coordinates
    if (data.latitude && isNaN(parseFloat(data.latitude))) {
      return res
        .status(400)
        .json({ message: "latitude must be a valid number." });
    }
    if (data.longitude && isNaN(parseFloat(data.longitude))) {
      return res
        .status(400)
        .json({ message: "longitude must be a valid number." });
    }

    // Validate time
    if (data.opening_time && data.close_time) {
      const parseTime = (str) => {
        const [h, m] = str.split(":").map(Number);
        return h * 60 + m;
      };
      const openMin = parseTime(data.opening_time);
      const closeMin = parseTime(data.close_time);
      if (closeMin <= openMin) {
        return res
          .status(400)
          .json({ message: "close_time must be after opening_time." });
      }
    }

    // Handle logo file (if uploaded)
    if (req.files && req.files.restaurant_logo) {
      const logoFile = req.files.restaurant_logo;
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(logoFile.mimetype)) {
        return res
          .status(400)
          .json({
            message: "Invalid logo file type. Only images are allowed.",
          });
      }

      const uploadDir = path.join(__dirname, "../../public/uploads/");
      const uploadPath = path.join(uploadDir, logoFile.name);

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file to uploads folder
      await logoFile.mv(uploadPath);

      // Delete old logo if it exists
      if (settings.restaurant_logo) {
        const oldLogoPath = path.join(uploadDir, settings.restaurant_logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }

      // Set new logo name in update data
      data.restaurant_logo = logoFile.name;
    }

    // Final update object
    const updatedData = {
      restaurant_logo: data.restaurant_logo || settings.restaurant_logo,
      restaurant_name: data.restaurant_name || settings.restaurant_name,
      owner_full_name: data.owner_full_name || settings.owner_full_name,
      owner_phone_number:
        data.owner_phone_number || settings.owner_phone_number,
      alternate_phone_number:
        data.alternate_phone_number || settings.alternate_phone_number,
      owner_email: data.owner_email || settings.owner_email,
      full_address: data.full_address || settings.full_address,
      zip_code: data.zip_code || settings.zip_code,
      city: data.city || settings.city,
      country: data.country || settings.country,
      opening_time: data.opening_time || settings.opening_time,
      close_time: data.close_time || settings.close_time,
      meta_title: data.meta_title || settings.meta_title,
      meta_tag_keyword: data.meta_tag_keyword || settings.meta_tag_keyword,
      description: data.description || settings.description,
      facebook_url: data.facebook_url || settings.facebook_url,
      instagram_url: data.instagram_url || settings.instagram_url,
      twitter_url: data.twitter_url || settings.twitter_url,
      latitude: data.latitude ? parseFloat(data.latitude) : settings.latitude,
      longitude: data.longitude
        ? parseFloat(data.longitude)
        : settings.longitude,
    };

    // Update in DB
    await settings.update(updatedData);

    return res.status(200).json({
      message: "Restaurant settings updated successfully.",
      settings: updatedData,
    });
  } catch (error) {
    console.error("Error updating restaurant settings:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteSettingsByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const settings = await RestaurantSettings.findOne({
      where: { restaurant_id: restaurantId },
    });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    await settings.destroy();
    return res.json({ message: "Settings deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant settings:", error);
    return res.status(500).json({ error: error.message });
  }
};
