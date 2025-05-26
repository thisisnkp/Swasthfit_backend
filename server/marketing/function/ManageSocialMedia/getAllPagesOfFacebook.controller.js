const axios = require("axios");
const facebookAuth = require("../../models/facebookAuth.model"); // Adjust path if needed

exports.getAllFacebookPages = async (req, res) => {
    console.log("get all pages of facebook called");
  try {
    const { vendor_id, module_type } = req.user;

    if (!vendor_id || !module_type) {
      return res.status(400).json({ success: false, message: "Vendor ID and Module Type are required." });
    }

    // Find Access Token from DB
    const userAuth = await facebookAuth.findOne({
      where: {
        vendor_id: vendor_id,
        module_type: module_type,
      },
    });

    if (!userAuth || !userAuth.accessToken) {
      return res.status(404).json({ success: false, message: "Access Token not found for the provided vendor_id and module_type." });
    }

    const accessToken = userAuth.accessToken;

    // Fetch Facebook Pages
    const pagesResponse = await axios.get(`https://graph.facebook.com/v18.0/me/accounts`, {
      params: {
        access_token: accessToken,
      },
    });

    const pages = pagesResponse.data.data;

    if (!pages || pages.length === 0) {
      return res.status(404).json({ success: false, message: "No pages found for this account." });
    }

    return res.json({
      success: true,
      pages: pages.map(page => ({
        id: page.id,
        name: page.name,
        access_token: page.access_token,
        category: page.category,
        tasks: page.tasks,
      })),
    });

  } catch (error) {
    console.error("Error fetching Facebook Pages:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
