const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const uploadImageToFacebook = async (pageId, pageAccessToken, imagePath) => {
  try {
    const formData = new FormData();
    formData.append("published", "false"); 
    formData.append("access_token", pageAccessToken);
    formData.append("source", fs.createReadStream(imagePath));

    const response = await axios.post(
      `https://graph.facebook.com/${pageId}/photos`,
      formData,
      {
        headers: formData.getHeaders()
      }
    );

    return response.data.id; 
  } catch (err) {
    console.error("Failed to upload image:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = {  
  uploadImageToFacebook
};  