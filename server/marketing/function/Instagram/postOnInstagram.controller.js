const axios = require("axios");
const Marketing = require("../../models/facebookPost.model"); 
const facebookAuth = require("../../models/facebookAuth.model"); 

exports.postToInstagram = async (req, res) => {
console.log("Post to Instagram called");
  try {
    
    const requestBody = Object.assign({}, req.body);
    const { message, pageId, image, status } = requestBody; 
    const { vendor_id, module_type } = req.user; 
    console.log(pageId)
    console.log(requestBody)

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


    const accountResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          fields: "instagram_business_account",
          access_token: accessToken,
        },
      }
    );

    const instagramAccountId =
      accountResponse.data?.instagram_business_account?.id;

    if (!instagramAccountId) {
      return res.status(400).json({
        success: false,
        message: "No Instagram business account linked to the Facebook page.",
      });
    }

 
    


    const mediaUploadResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        image_url:  image, 
        caption: message || "", 
        access_token: accessToken,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const creationId = mediaUploadResponse.data.id;


    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        creation_id: creationId,
        access_token: accessToken,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const newMarketingEntry = await Marketing.create({
      userId: vendor_id, 
      platform: "instagram", 
      embadedcode: publishResponse.data.id,
      edate: new Date(),
      createdAt: new Date(),
      status: status, 
      module_type: module_type,
      imageURL: image,
      caption: message,
      pageId: pageId,
    });

    res.json({
      success: true,
      message: "Post published successfully on Instagram!",
      post: newMarketingEntry,
      instagramResponse: publishResponse.data,
    });
  } catch (error) {
    console.error("Error posting to Instagram:", error);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};
