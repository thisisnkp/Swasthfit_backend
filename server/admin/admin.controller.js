const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');
const Admin = require('./admin.model');
exports.signup = async (req, res) => {
    // Save Admin to Database
	  try {
		console.log(req.body);
		const admin = await Admin.create({
		  email: req.body.email,
		  password: bcrypt.hashSync(req.body.password, 8),
		});
		res.status(200).json({ success : 'Admin user created successfully!'});
	  } catch (error) {
		res.status(500).json({ message : error.message });
	  }
};

exports.signin = async (req, res) => {
    try {
		
		const admin = await Admin.findOne({
		  where: {
			email: req.body.email,
		  },
		});

		if (!admin) {
		  return res.status(404).json({ message: "Admin Not found." });
		}

		const passwordIsValid = bcrypt.compareSync(
		  req.body.password,
		  admin.password
		);

		if (!passwordIsValid) {
		  return res.status(401).json({
			message: "Invalid Password!",
		  });
		}

		const token = jwt.sign({ id: admin.id },process.env.JWT_SECRET,{expiresIn: process.env.TOKEN_EXPIRATION});
		return res.status(200).json({
		  id: admin.id,
		  token
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

exports.verifyToken = async (req, res) => {
    try {
		const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => { 
			if (err) { 
				return res.status(401).json({ error:true, message: 'Token is expired or invalid' }); 
			} 
				res.json({ message: 'Token is valid', decoded }); 
			})
		
	} catch (error) {
		
		res.status(401).json({ error: 'Invalid token' });
	}
};

