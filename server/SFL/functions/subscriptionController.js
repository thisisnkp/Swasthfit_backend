const UserSubscription = require("../models/UserSubscription");
const Transaction = require("../models/coinTransaction");

exports.createSubscription = async (req, res) => {
  try {
    const { user_id, subscription_type, duration_months } = req.body;

    // Validate required fields
    if (!user_id || !subscription_type || !duration_months) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["user_id", "subscription_type", "duration_months"],
      });
    }

    // Set multiplier based on subscription type
    let multiplier = 1.0;
    switch (subscription_type) {
      case "Corporate Subscription":
        multiplier = 1.5;
        break;
      case "Gym Subscription":
        multiplier = 1.2;
        break;
      case "Swasthfit Subscription":
        multiplier = 2.0;
        break;
      default:
        return res.status(400).json({
          message: "Invalid subscription type",
          valid_types: [
            "Corporate Subscription",
            "Gym Subscription",
            "Swasthfit Subscription",
          ],
        });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + parseInt(duration_months));

    // Check if user already has a subscription
    const existingSubscription = await UserSubscription.findOne({
      where: { user_id, is_active: true },
    });

    if (existingSubscription) {
      // Update existing subscription
      existingSubscription.subscription_type = subscription_type;
      existingSubscription.multiplier = multiplier;
      existingSubscription.start_date = startDate;
      existingSubscription.end_date = endDate;
      await existingSubscription.save();

      return res.status(200).json({
        message: "Subscription updated successfully",
        subscription: existingSubscription,
      });
    }

    // Create new subscription
    const subscription = await UserSubscription.create({
      user_id,
      subscription_type,
      multiplier,
      start_date: startDate,
      end_date: endDate,
    });

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({
      message: "Error creating subscription",
      error: error.message,
    });
  }
};

exports.getUserSubscription = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing user_id parameter",
      });
    }

    const subscription = await UserSubscription.findOne({
      where: { user_id, is_active: true },
    });

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found for this user",
      });
    }

    res.status(200).json({
      subscription,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({
      message: "Error fetching subscription",
      error: error.message,
    });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        message: "Missing user_id parameter",
      });
    }

    const subscription = await UserSubscription.findOne({
      where: { user_id, is_active: true },
    });

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found for this user",
      });
    }

    // Deactivate subscription
    subscription.is_active = false;
    await subscription.save();

    res.status(200).json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({
      message: "Error cancelling subscription",
      error: error.message,
    });
  }
};
