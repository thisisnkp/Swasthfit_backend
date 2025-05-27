const FoodItemOffer = require('../models/ItemOffer');
const FoodItem = require('../models/FoodItem');

// Get all item offers
exports.getAllItemOffers = async (req, res) => {
    try {
        const offers = await FoodItemOffer.findAll({
            include: [{ model: FoodItem, as: 'item', attributes: ['menu_name', 'description'] }],
        });
        res.status(200).json(offers);
    } catch (error) {
        console.error('Error fetching item offers:', error);
        res.status(500).json({ message: 'Error fetching item offers', error: error.message });
    }
};

// Get a single item offer by ID
exports.getItemOfferById = async (req, res) => {
    try {
        const { id } = req.params;
        const offer = await FoodItemOffer.findOne({
            where: { id },
            include: [{ model: Item, as: 'item', attributes: ['name', 'description'] }],
        });

        if (!offer) {
            return res.status(404).json({ message: 'Item offer not found' });
        }

        res.status(200).json(offer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item offer', error: error.message });
    }
};

// Create a new item offer
exports.createItemOffer = async (req, res) => {
    try {
        const { item_id, min_quantity, offer_price, start_date, end_date } = req.body;
        const image = req.files ? `/uploads/${req.files.image.name}` : null;

        console.log("Uploaded File:", req.files);  
        console.log("Stored Image Path:", image); 

        const newOffer = await FoodItemOffer.create({
            item_id,
            min_quantity,
            offer_price,
            start_date,
            end_date,
            image
        });

        res.status(201).json({ message: 'Item offer created successfully', offer: newOffer });
    } catch (error) {
        console.error("Error creating item offer:", error);
        res.status(500).json({ message: 'Error creating item offer', error: error.message });
    }
};

exports.updateItemOffer = async (req, res) => {
    try {
        const { id } = req.params;
        const { item_id, min_quantity, offer_price, start_date, end_date } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : undefined; // Check if new image is uploaded

        const offer = await FoodItemOffer.findOne({ where: { id } });

        if (!offer) {
            return res.status(404).json({ message: 'Item offer not found' });
        }

        // Update offer with new values, including image if provided
        await offer.update({
            item_id,
            min_quantity,
            offer_price,
            start_date,
            end_date,
            image: image || offer.image // Keep existing image if not updating
        });

        res.status(200).json({ message: 'Item offer updated successfully', offer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item offer', error: error.message });
    }
};

// exports.getOffers = async (req, res) => {
//     try {
//         // Fetch all offers
//         const offers = await FoodItemOffer.findAll({
//             order: [["createdAt", "DESC"]], // Sort by latest offers
//         });

//         return res.status(200).json({
//             status: true,
//             message: "All offers retrieved successfully",
//             data: offers,
//         });
//     } catch (error) {
//         console.error("Error fetching offers:", error);
//         return res.status(500).json({
//             status: false,
//             message: "Internal server error",
//         });
//     }
// };


exports.getOffers = async (req, res) => {
    try {
      // Base URL jahan images padhe hain
      const baseUrl = `http://localhost:4001/public/`;
  
      // Fetch all offers
      const offers = await FoodItemOffer.findAll({
        order: [["createdAt", "DESC"]], // Sort by latest offers
      });
  
      // Image URL ke sath offers list banana
      const offersWithImagePath = offers.map((offer) => {
        const offerJson = offer.toJSON();
        return {
          ...offerJson,
          image: offerJson.image ? `${baseUrl}${offerJson.image}` : null,
        };
      });
  
      return res.status(200).json({
        status: true,
        message: "All offers retrieved successfully",
        data: offersWithImagePath,
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  };
  exports.getOffers = async (req, res) => {
    try {
      // Base URL jahan images padhe hain
      const baseUrl = `http://localhost:4001/public/`;
  
      // Fetch all offers
      const offers = await FoodItemOffer.findAll({
        order: [["createdAt", "DESC"]], // Sort by latest offers
      });
  
      // Image URL ke sath offers list banana
      const offersWithImagePath = offers.map((offer) => {
        const offerJson = offer.toJSON();
        return {
          ...offerJson,
          image: offerJson.image ? `${baseUrl}${offerJson.image}` : null,
        };
      });
  
      return res.status(200).json({
        status: true,
        message: "All offers retrieved successfully",
        data: offersWithImagePath,
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  };
  exports.getOffers = async (req, res) => {
    try {
      // Base URL jahan images padhe hain
      const baseUrl = `http://localhost:4001/public/uploads/`;
  
      // Fetch all offers
      const offers = await FoodItemOffer.findAll({
        order: [["createdAt", "DESC"]], // Sort by latest offers
      });
  
      // Image URL ke sath offers list banana
      const offersWithImagePath = offers.map((offer) => {
        const offerJson = offer.toJSON();
        return {
          ...offerJson,
          image: offerJson.image ? `${baseUrl}${offerJson.image}` : null,
        };
      });
  
      return res.status(200).json({
        status: true,
        message: "All offers retrieved successfully",
        data: offersWithImagePath,
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      return res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  };
      