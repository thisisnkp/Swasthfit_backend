const cron = require("node-cron");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const FacebookPost = require("./models/facebookPost.model");
const FacebookAuth = require("./models/facebookAuth.model");
require("dotenv").config(); 
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}

const generateToken = (vendor_id, module_type) => {
  const payload = { vendor_id, module_type };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // Token valid for 1 hour
  return token;
};

const schedulePosts = async () => {
  try {
    const scheduledPosts = await FacebookPost.findAll({
      where: { status: "scheduled" },
    });

    if (!scheduledPosts.length) {
      console.log("No scheduled posts found.");
      return;
    }

    for (const post of scheduledPosts) {
      const { userId: vendor_id, module_type, platform, caption, imageURL, pageId, edate } = post;

      const currentTime = new Date();
      const scheduledTime = new Date(edate);

      if (scheduledTime > currentTime) {
        console.log(`Post ID ${post.id} is not ready to be posted yet. Scheduled for: ${scheduledTime}`);
        continue; 
      }

      const userAuth = await FacebookAuth.findOne({
        where: { vendor_id, module_type },
      });

      if (!userAuth || !userAuth.accessToken) {
        console.error(`Access token not found for vendor_id: ${vendor_id}, module_type: ${module_type}`);
        continue;
      }

      const accessToken = userAuth.accessToken;

      const token = generateToken(vendor_id, module_type);
      console.log(`Generated JWT Token for vendor_id: ${vendor_id}, module_type: ${module_type}`);

      const requestData = {
        message: caption,
        pageId: pageId,
        image: imageURL,
        vendor_id: vendor_id,
        module_type: module_type,
      };

      console.log(`Request Data for Post ID ${post.id}:`, requestData);

      try {
        if (platform === "facebook") {
          console.log(`Calling Facebook API for Post ID ${post.id}`);
          await axios.post("http://localhost:4001/marketing/site/apis/facebook/post", requestData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (platform === "instagram") {
          console.log(`Calling Instagram API for Post ID ${post.id}`);
          await axios.post("http://localhost:4001/marketing/site/apis/instagram/post", requestData, {
            headers: { Authorization: `Bearer ${token}` }, 
          });
        }

        await FacebookPost.update(
          { status: "posted" },
          { where: { id: post.id } }
        );

        console.log(`Post ID ${post.id} marked as posted.`);
      } catch (apiError) {
        console.error(`Error posting to ${platform}:`, apiError.response?.data || apiError.message);
      }
    }
  } catch (error) {
    console.error("Error scheduling posts:", error.message);
  }
};

cron.schedule("*/5 * * * * *", schedulePosts);

console.log("Post scheduler is running every 5 seconds...");