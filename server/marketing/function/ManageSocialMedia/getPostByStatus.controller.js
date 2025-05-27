const Facebook = require("../../models/facebookPost.model");

exports.getPostsByStatus = async (req, res) => {
  try {
    const { vendor_id, module_type } = req.user;
    console.log("Vendor ID:", vendor_id);

    const posts = await Facebook.findAll({
      where: {
        userId: vendor_id,
        module_type: module_type,
        status: ['scheduled', 'posted'], // Fetch both statuses
      },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts.",
      error: error.message,
    });
  }
};
