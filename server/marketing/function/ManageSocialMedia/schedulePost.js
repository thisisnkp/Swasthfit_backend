const FacebookPost = require("../../models/facebookPost.model");

exports.createFacebookPost = async (req, res) => {
  try {
    // Get vendor_id and module_type from req.user
    const { vendor_id, module_type } = req.user;

    // Get other fields from req.body
    const { platform, embadedCode, edate, status, imageURL, caption, pageId } = req.body;

    // Validate required fields
    if (!platform || !edate || !status) {
      return res.status(400).json({
        success: false,
        message: "Platform, edate, and status are required fields.",
      });
    }

    // Create a new post in the database
    const newPost = await FacebookPost.create({
      userId: vendor_id,
      platform,
      embadedCode,
      edate,
      status,
      module_type,
      imageURL,
      caption,
      pageId,
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      data: newPost,
    });
  } catch (error) {
    console.error("Error creating Facebook post:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the post.",
      error: error.message,
    });
  }
};