const Membership = require("../../../membership/membership/membership.model"); // Path from your original controller
const User = require("../../../user/user.model"); // Path from your original controller

const getGymRegistrations = async (req, res) => {
  try {
    const { gym_id } = req.params;

    // Fetch memberships for the given gym_id and include associated User data
    const memberships = await Membership.findAll({
      where: { gym_id },
      include: [
        {
          model: User,
          as: "user", // This alias MUST match the alias defined in Membership.belongsTo(User, { as: 'user', ...})
          attributes: [
            // Explicitly list attributes you want from the User model
            "id", // Assuming 'id' is the primary key of the User model
            "trainer_id",
            "user_name",
            "user_mobile",
            "user_dob",
            "user_age",
            "user_gender",
            "user_email",
            "user_bank",
            "user_height",
            "user_weight",
            "user_aadhar",
            "user_pan",
            "user_address",
            "user_earned_coins",
            "user_gullak_money_earned",
            "user_gullak_money_used",
            "user_competitions",
            "user_type",
            "user_social_media_id",
            "user_downloads",
            "user_ratings",
            "user_qr_code",
            "is_signup",
            "otpless_token",
            "is_approved",
            "created_at",
            "updated_at",
            // Add any other fields from user.model.js that you need
          ],
        },
      ],
      // raw: true, // Add if you don't need Sequelize model instances, but be careful with nested data
      // nest: true, // Useful with raw: true for structuring included data
    });

    if (!memberships || memberships.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No registrations found for this gym.",
        });
    }

    // Extract and structure user data and membership details
    const registrations = memberships.map((membership) => {
      // Handle cases where the user might not be found (e.g., orphaned membership record)
      if (!membership.user) {
        console.warn(
          `Membership (ID: ${membership.id}) found without a valid associated user. User ID: ${membership.user_id}`
        );
        return {
          membership_details: {
            membership_id: membership.id, // from membership.model.js
            gym_id: membership.gym_id, // from membership.model.js
            membership_plan_id: membership.membership_plan_id, // from membership.model.js
            start_date: membership.start_date, // from membership.model.js
            end_date: membership.end_date, // from membership.model.js
            price: membership.price, // from membership.model.js
            status: membership.status, // from membership.model.js
            payment_method: membership.payment_method, // from membership.model.js
            transaction_id: membership.transaction_id, // from membership.model.js
            coupon_id: membership.coupon_id, // from membership.model.js
            created_at: membership.created_at, // from membership.model.js
            updated_at: membership.updated_at, // from membership.model.js
          },
          user_details: null,
          warning:
            "Associated user data could not be fetched. Check if user exists or if there's a data inconsistency.",
        };
      }

      return {
        membership_details: {
          membership_id: membership.id, // from membership.model.js
          gym_id: membership.gym_id, // from membership.model.js
          membership_plan_id: membership.membership_plan_id, // from membership.model.js
          start_date: membership.start_date, // from membership.model.js
          end_date: membership.end_date, // from membership.model.js
          price: membership.price, // from membership.model.js
          status: membership.status, // from membership.model.js
          payment_method: membership.payment_method, // from membership.model.js
          transaction_id: membership.transaction_id, // from membership.model.js
          coupon_id: membership.coupon_id, // from membership.model.js
          created_at: membership.created_at, // from membership.model.js
          updated_at: membership.updated_at, // from membership.model.js
        },
        user_details: {
          user_id: membership.user.id, // from user.model.js (implicit 'id' PK)
          trainer_id: membership.user.trainer_id, // from user.model.js
          user_name: membership.user.user_name, // from user.model.js
          user_mobile: membership.user.user_mobile, // from user.model.js
          user_dob: membership.user.user_dob, // from user.model.js
          user_age: membership.user.user_age, // from user.model.js
          user_gender: membership.user.user_gender, // from user.model.js
          user_email: membership.user.user_email, // from user.model.js
          user_bank: membership.user.user_bank, // from user.model.js
          user_height: membership.user.user_height, // from user.model.js
          user_weight: membership.user.user_weight, // from user.model.js
          user_aadhar: membership.user.user_aadhar, // from user.model.js
          user_pan: membership.user.user_pan, // from user.model.js
          user_address: membership.user.user_address, // from user.model.js
          user_earned_coins: membership.user.user_earned_coins, // from user.model.js
          user_gullak_money_earned: membership.user.user_gullak_money_earned, // from user.model.js
          user_gullak_money_used: membership.user.user_gullak_money_used, // from user.model.js
          user_competitions: membership.user.user_competitions, // from user.model.js
          user_type: membership.user.user_type, // from user.model.js
          user_social_media_id: membership.user.user_social_media_id, // from user.model.js
          user_downloads: membership.user.user_downloads, // from user.model.js
          user_ratings: membership.user.user_ratings, // from user.model.js
          user_qr_code: membership.user.user_qr_code, // from user.model.js
          is_signup: membership.user.is_signup, // from user.model.js
          otpless_token: membership.user.otpless_token, // from user.model.js
          is_approved: membership.user.is_approved, // from user.model.js
          created_at: membership.user.created_at, // from user.model.js (timestamps: true)
          updated_at: membership.user.updated_at, // from user.model.js (timestamps: true)
        },
      };
    });

    return res.status(200).json({ success: true, registrations });
  } catch (error) {
    console.error("Error fetching gym registrations:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
};

module.exports = { getGymRegistrations };
