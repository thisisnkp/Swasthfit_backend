const DietPackage = require("../models/dietpackage");
const FoodRestaurant = require("../models/Restaurant");
const fileUploaderSingle =
  require("../../../utilities/fileUpload").fileUploaderSingle;
const { Op } = require("sequelize");
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: '*' } });
// create diet for all restaurnt

exports.createDietPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      img,
      breakfast,
      lunch,
      dinner,
      combo,
      breakfast_price,
      lunch_price,
      dinner_price,
      combo_price,
      latitude,
      longitude,
    } = req.body;

    // Create the new diet package
    const newDietPackage = await DietPackage.create({
      name,
      description,
      img,
      breakfast,
      lunch,
      dinner,
      combo,
      breakfast_price,
      lunch_price,
      dinner_price,
      combo_price,
      latitude,
      longitude,
    });

    // Fetch nearby restaurants (within a certain radius)
    const radiusInKm = 5; // Example radius
    const nearbyRestaurants = await FoodRestaurant.findAll({
      where: {
        latitude: {
          [Op.between]: [latitude - radiusInKm, latitude + radiusInKm],
        },
        longitude: {
          [Op.between]: [longitude - radiusInKm, longitude + radiusInKm],
        },
      },
    });

    // Emit message to all nearby restaurants via WebSocket
    nearbyRestaurants.forEach(restaurant => {
      io.to(restaurant.id).emit('newDietPackage', {
        message: `A new diet package has been created: ${newDietPackage.name}. You can now set your pricing.`,
        data: newDietPackage,
      });
    });
    req.app.get('io').emit('newDietPackage', {
      message: '✅ New diet package added successfully!',
    });

    return res.status(201).json({
      message: "Diet Package created successfully and notifications sent to nearby restaurants",
      data: newDietPackage,
    });
  } catch (error) {
    console.error("Error creating Diet Package:", error);
    return res.status(500).json({ message: "Error creating Diet Package", error });
  }
};
exports.getDietPackageById = async (req, res) => {
  try {
    const dietPackage = await DietPackage.findByPk(req.params.id);

    if (!dietPackage) {
      return res
        .status(404)
        .json({ status: false, message: "Diet Package not found" });
    }

    const baseUrl = `${process.env.APP_URL}/uploads/`;

    // Format the image path
    const formattedPackage = {
      ...dietPackage.toJSON(),
      img: dietPackage.img ? `${baseUrl}${dietPackage.rimg}` : null,
    };

    return res.status(200).json({
      status: true,
      message: "Diet Package fetched successfully",
      data: formattedPackage,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getAllDietPackages = async (req, res) => {
  try {
    const dietPackages = await DietPackage.findAll({
      include: [
        {
          model: FoodRestaurant,
          as: "foodRestaurants",
          attributes: ["id", "title", "full_address", "rimg", "aadhar_image"], // include image fields
        },
      ],
      logging: console.log,
    });

    const baseUrl = "http://localhost:4001/uploads/";

    const formattedPackages = dietPackages.map(pkg => {
      const data = pkg.toJSON();

      // Full path for diet package image
      data.img = data.img ? `${baseUrl}${data.img}` : null;

      // Full path for restaurant images
      if (data.foodRestaurants && Array.isArray(data.foodRestaurants)) {
        data.foodRestaurants = data.foodRestaurants.map(rest => ({
          ...rest,
          rimg: rest.rimg ? `${baseUrl}${rest.rimg}` : null,
          aadhar_image: rest.aadhar_image ? `${baseUrl}${rest.aadhar_image}` : null,
        }));
      }

      return data;
    });

    return res.json({
      status: true,
      message: "Diet Packages fetched successfully",
      data: formattedPackages,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

exports.updateDietPackage = async (req, res) => {
  try {
    const dietPackage = await DietPackage.findByPk(req.params.id);
    const {
      name,
      description,
      breakfast,
      lunch,
      dinner,
      combo,
      breakfast_price,
      lunch_price,
      dinner_price,
      combo_price,
    } = req.body;

    if (!dietPackage) {
      return res.status(404).json({ error: "Diet Package not found." });
    }

    let image = dietPackage.img;

    if (req.files && req.files.image) {
      const uploadedImage = await fileUploaderSingle(
        "./public/uploads/",
        req.files.image
      );
      image = uploadedImage.newFileName;
    }

    await dietPackage.update({
      name,
      description,
      img: image,
      breakfast: breakfast ?? dietPackage.breakfast,
      lunch: lunch ?? dietPackage.lunch,
      dinner: dinner ?? dietPackage.dinner,
      combo: combo ?? dietPackage.combo,
      breakfast_price: breakfast_price ?? dietPackage.breakfast_price,
      lunch_price: lunch_price ?? dietPackage.lunch_price,
      dinner_price: dinner_price ?? dietPackage.dinner_price,
      combo_price: combo_price ?? dietPackage.combo_price,
    });

    const baseUrl = `${process.env.APP_URL}/uploads/`;

    return res.status(200).json({
      status: true,
      message: "Diet Package updated successfully",
      data: {
        ...dietPackage.toJSON(),
        img: image ? `${baseUrl}${image}` : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteDietPackage = async (req, res) => {
  try {
    const dietPackage = await DietPackage.findByPk(req.params.id);

    if (!dietPackage) {
      return res
        .status(404)
        .json({ status: false, message: "Diet Package not found." });
    }

    // Delete the diet package
    await dietPackage.destroy();

    return res.status(200).json({
      status: true,
      message: "Diet Package deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all Diet Packages with optional sorting by price
exports.getDietPackagesSort = async (req, res) => {
  try {
    let order = [];

    // Check if sorting is required
    if (req.query.sort === "price") {
      order.push(["combo_price", "ASC"]); // Sort by price (ascending)
    } else if (req.query.sort === "-price") {
      order.push(["combo_price", "DESC"]); // Sort by price (descending)
    }

    const packages = await DietPackage.findAll({ order });

    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
