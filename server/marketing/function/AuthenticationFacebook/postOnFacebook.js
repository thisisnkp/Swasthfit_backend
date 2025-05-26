const axios = require("axios");
const Marketing = require("../../models/facebookPost.model");
const facebookAuth = require("../../models/facebookAuth.model");

exports.postToFacebook = async (req, res) => {
  try {
    const { message, status, pageId, image } = req.body; // Use image as a URL
    const { vendor_id, module_type } = req.user;

    console.log("Page ID:", pageId);
    console.log("Request Body:", req.body);

    // Fetch user authentication details
    const userAuth = await facebookAuth.findOne({
      where: {
        vendor_id: vendor_id,
        module_type: module_type,
      },
    });

    if (!userAuth || !userAuth.accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token is not available for the user.",
      });
    }

    const accessToken = userAuth.accessToken;

    // Fetch all pages associated with the access token
    const pageDetailsResponse = await axios.get(
      `https://graph.facebook.com/v11.0/me/accounts`,
      {
        params: { access_token: accessToken },
      }
    );

    if (!pageDetailsResponse.data?.data?.length) {
      return res.status(400).json({
        success: false,
        message: "No pages found for the user.",
      });
    }

    // Find the page that matches the provided page_id
    const page = pageDetailsResponse.data.data.find((p) => p.id === pageId);

    if (!page) {
      return res.status(400).json({
        success: false,
        message: "The provided page_id does not match any of the user's pages.",
      });
    }

    const pageAccessToken = page.access_token;

    // Create a post directly with the image URL and message
    const facebookResponse = await axios.post(
      `https://graph.facebook.com/${pageId}/photos`,
      {
        url: image, // Use the image URL directly
        caption: message || "", // Add a caption if provided
        access_token: pageAccessToken,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Add accountId to the database entry
    const newMarketingEntry = await Marketing.create({
      accountId: pageId,
      platform: "facebook",
      embadedcode: facebookResponse.data.id,
      edate: new Date(),
      createdAt: new Date(),
      userId: vendor_id, // Pass vendor_id as userId
      status, // Add status from frontend
      module_type, // Add module_type from req.user
      imageURL: image, // Save the image URL
    });

    return res.json({
      success: true,
      message: "Post published successfully!",
      post: newMarketingEntry,
      facebookResponse: facebookResponse.data,
    });
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};