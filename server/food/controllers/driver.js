const categoryModel = require("../models").Category;

const index = async (req, res) => {

}
const add = async (req, res) => {

}
const createOrUpdate = async (req, res) => {

}



const getRiderCurrentLocation = async (req, res) => {
  try {
    const riderId = req.params.riderId;

    // Find rider with location
    const rider = await Rider.findOne({
      where: { id: riderId },
      include: [{
        model: RiderLocation,
        as: 'location',
        attributes: ['latitude', 'longitude']
      }]
    });

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }

    res.json({
      data: {
        rider: {
          name: rider.name,
          mobile: rider.mobile
        },
        status: rider.status || "UNKNOWN", // Assuming status is in Rider model
        location: {
          latitude: rider.location?.latitude || null,
          longitude: rider.location?.longitude || null
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = {
    index,
    getRiderCurrentLocation,
    add,
    createOrUpdate,
};