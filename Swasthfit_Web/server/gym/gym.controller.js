const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../user/user.model'); //user model
const Gym = require('./gym.model');
exports.registration = async (req, res) => {
  // Save Gym data to Database
  try {
    console.log(req.body);

    //First check if a gym owner already exists by the mobile number
    const existingUser = await User.findOne({ where: { user_mobile: req.body.mobile } });
    if (existingUser) {
      return res.status(400).json({
        status: 406,
        success: false,
        message: 'User is already registered with this mobile number.',
      });
    }


    const newUser = await User.create({
      user_name: req.body.owner_name,
      user_mobile: req.body.mobile,
      user_type: 'gym_owner',
    });
    const userID = newUser.id;

    const gym = await Gym.create({
      gym_name: req.body.gym_name,
      user_id: userID,
      owner_name: req.body.owner_name,
      alternate_mobile: req.body.alternate_mobile,
      email_id: req.body.email_id,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      gym_logo: req.body.gym_logo,
      profile_photo: req.body.profile_photo,
      bank_name: req.body.bank_name,
      account_holder_name: req.body.account_holder_name,
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,
      cancel_cheque_photo: req.body.cancel_cheque_photo,
      pancard_name: req.body.pancard_name,
      pancard_number: req.body.pancard_number,
      gst_number: req.body.gst_number,
      gst_photo: req.body.gst_photo,
      msme_certificate_number: req.body.msme_certificate_number,
      msme_certificate_photo: req.body.msme_certificate_photo,
      shop_certificate: req.body.shop_certificate,
      shop_certificate_photo: req.body.shop_certificate_photo,
      workout_type: req.body.workout_details,
      closing_date: req.body.closing_date,
      facilities: req.body.facilities,
      about_us: req.body.about_us

    });
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Registration of gym successfull!',
      data: gym
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.gymsList = async (req, res) => {
  try {
    const offset = req.query.offset;
    const limit = req.query.limit;
    const gyms = await Gym.findAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        {
          model: User,
          as: 'usr',
          where: {
            user_type: 'gym_owner'
          }

        }
      ]
    });
    // const gym_records = [];
    //  gyms.forEach(result => {
    //     const record = result.get({plain:true});
    //     const created_date = new Date(record.created_at);
    //     //const updated_date = new Date(record.updated_at);
    //     //const { ['created_at']: oldValue, ...rest } = obj1; 
    //     const updatedObject = { ...record, ['created_at']: created_date.toLocaleString()}
    //     gym_records.push(updatedObject);
    //   })
    res.status(200).json({
      status: 200,
      success: true,
      message: 'List of all gyms',
      data: gyms
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};
