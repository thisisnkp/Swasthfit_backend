const Rider = require("../models/rider");


// Create Rider
exports.createRider = async (req, res) => {
    try {
      // Log the request body to check the received data
      console.log(req.body);
  
      // Extract all required fields from the request body
      const {
        first_name, last_name, mobile, 
        date_of_birth, home_location_name, 
        home_latitude, home_longitude, 
        aadhar_number, type_of_rider, 
        owner_id, rider_tags, 
        on_task, current_latitude, 
        current_longitude
      } = req.body;
  console.log(req.body);
  
      // Validate required fields (non-null)
      if (!first_name || !last_name || !mobile || !date_of_birth || !home_location_name || 
          !home_latitude || !home_longitude || !aadhar_number || !type_of_rider || !owner_id) {
        return res.status(400).json({ 
          success: false, 
          message: 'All required fields (first_name, last_name, mobile, date_of_birth, home_location_name, home_latitude, home_longitude, aadhar_number, type_of_rider, owner_id) must be provided.' 
        });
      }
  
      // If validation passes, create the rider
      const newRider = await Rider.create(req.body);
      console.log(newRider);
  
      return res.status(201).json({ success: true, data: newRider });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to create rider', error: error.message });
    }
  };
  
  

// Get All Riders
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.findAll();
    return res.status(200).json({ success: true, data: riders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch riders', error: error.message });
  }
};

exports.getRiderById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find Rider by Primary Key
      const rider = await Rider.findByPk(id);
  
      if (!rider) {
        return res.status(404).json({ message: "Rider not found" });
      }
  
      return res.status(200).json({ rider });
    } catch (error) {
      console.error("Error fetching rider:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  // Delete Rider Controller
  exports.deleteRider = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if rider exists
      const rider = await Rider.findByPk(id);
  
      if (!rider) {
        return res.status(404).json({ message: 'Rider not found' });
      }
  
      // Delete the rider
      await rider.destroy();
  
      return res.status(200).json({ message: 'Rider deleted successfully' });
    } catch (error) {
      console.error('Error deleting rider:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

