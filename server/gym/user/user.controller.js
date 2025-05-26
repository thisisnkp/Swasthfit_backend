const GymUser = require("./user.model"); // Import the GymUser model

exports.registerGymUser = async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      membershipName,
      membershipType,
      totalAmount,
    } = req.body;

    // Validate input
    if (
      !username ||
      !email ||
      !phone ||
      !membershipName ||
      !membershipType ||
      !totalAmount
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await GymUser.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Add the user to the database
    const newUser = await GymUser.create({
      username,
      email,
      phone,
      membership_name: membershipName,
      membership_type: membershipType,
      total_amount: totalAmount,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error registering gym user:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
