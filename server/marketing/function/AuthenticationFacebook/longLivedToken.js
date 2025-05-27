const axios = require("axios");
const facebookAuth = require("../../models/facebookAuth.model"); // Ensure this path is correct

const exchangeToken = async (req, res) => {
  try {
    const { vendor_id, module_type } = req.user;

    const user = await facebookAuth.findOne({
      where: { vendor_id, module_type },
      attributes: ["accessToken"],
    });

    if (!user || !user.accessToken) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Short-lived token not found for this user and module.",
        });
    }

    const shortLivedToken = user.accessToken;
    console.log("Short-lived token being used:", shortLivedToken); // Good for debugging

    // Check if environment variables are loaded
    if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_SECRET_KEY) {
      console.error(
        "Facebook Client ID or Secret Key is missing from environment variables."
      );
      return res
        .status(500)
        .json({ success: false, message: "Server configuration error." });
    }
    console.log("Using Facebook Client ID:", process.env.FACEBOOK_CLIENT_ID); // Good for debugging

    const response = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`, // Removed trailing '?'
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_SECRET_KEY,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    // IMPORTANT: Check if Facebook returned an error object in the response data
    if (response.data.error) {
      console.error(
        "Facebook API Error (in response.data):",
        response.data.error
      );
      return res.status(400).json({
        // Use 400 for client-side errors like invalid token
        success: false,
        message: `Failed to exchange token: ${
          response.data.error.message || "Unknown Facebook error"
        }`,
        fb_error_code: response.data.error.code,
        fb_error_type: response.data.error.type,
      });
    }

    const { access_token: longLivedToken, expires_in } = response.data; // expires_in is also useful

    if (!longLivedToken) {
      console.error(
        "Long-lived token not found in Facebook's response:",
        response.data
      );
      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to retrieve long-lived token from Facebook's response.",
        });
    }

    await facebookAuth.update(
      { accessToken: longLivedToken }, // Consider storing expires_in too
      { where: { vendor_id, module_type } }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Token exchanged successfully.",
        longLivedToken,
      });
  } catch (error) {
    // This will catch network errors or if Axios itself throws before getting a Facebook response structure
    console.error(
      "Token exchange HTTP/Network error:",
      error.isAxiosError ? error.toJSON() : error
    );

    // If it's an Axios error and there's a response from Facebook with an error structure
    if (error.response && error.response.data && error.response.data.error) {
      console.error(
        "Facebook error response data (in catch block):",
        error.response.data.error
      );
      return res.status(error.response.status || 500).json({
        success: false,
        message: `Token exchange failed: ${
          error.response.data.error.message || "Facebook API error"
        }`,
        fb_error_code: error.response.data.error.code,
        fb_error_type: error.response.data.error.type,
      });
    } else if (error.response) {
      // Other types of error responses from Facebook not fitting the .error structure
      console.error(
        "Facebook raw error response (in catch block):",
        error.response.data
      );
      return res.status(error.response.status || 500).json({
        success: false,
        message: `Token exchange failed. Status: ${error.response.status}`,
        raw_error: error.response.data, // Be cautious sending raw errors to client
      });
    }

    res
      .status(500)
      .json({
        success: false,
        message: "Token exchange failed due to an internal server error.",
      });
  }
};

module.exports = { exchangeToken };
