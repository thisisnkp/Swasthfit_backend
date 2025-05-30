const AppMembershipPlan = require("./appmembership.model");

exports.createMembershipPlan = async (req, res) => {
  try {
    const {
      created_by,
      type,
      gym_id,
      name,
      features,
      description,
      membership_type,
      price,
      duration,
      status,
    } = req.body;

    const newPlan = await AppMembershipPlan.create({
      created_by,
      type,
      gym_id: gym_id || null,
      name,
      features,
      description,
      membership_type,
      price,
      duration,
      status,
      create_at: new Date(),
    });

    res.status(201).json({ success: true, data: newPlan });
  } catch (error) {
    console.error("Error creating membership plan:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getMembershipPlans = async (req, res) => {
  try {
    const plans = await AppMembershipPlan.findAll();
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    console.error("Error fetching membership plans:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
