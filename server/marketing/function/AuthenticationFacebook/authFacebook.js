const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../../models/facebookAuth.model"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyJWT = require("../../../../checkAccess");


passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET_KEY,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, cb) => {
      try {
        console.log("🌐 Facebook Access Token:", accessToken);
        console.log("🔁 Facebook Refresh Token:", refreshToken);
        console.log("👤 Facebook Profile Data:", profile);
    
        const { vendor_id, module_type } = JSON.parse(req.query.state || "{}");
        console.log("Using values from JWT for auth:", { vendor_id, module_type });
    
        let user = await User.findOne({ where: { accountId: profile.id } });
    
        if (!user) {
          user = await User.create({
            accountId: profile.id,
            name: profile.displayName,
            provider: profile.provider,
            accessToken: accessToken,
            module_type: module_type,
            vendor_id: vendor_id,
          });
        } else {
          user.accessToken = accessToken;
          user.module_type = module_type;
          user.vendor_id = vendor_id;
          await user.save();
        }
    
        return cb(null, user);
      } catch (error) {
        console.error("❌ Error in Facebook Strategy:", error);
        return cb(error, null);
      }
    }
    
    
  )
);

// const facebookLogin = [
//   verifyJWT,

//   // 🔥 Custom middleware to access JWT payload
//   (req, res, next) => {
//     console.log("🔓 Decoded JWT payload:", req.user); // ✅ Access payload here
//     // You can also do conditional logic here based on payload
//     next();
//   },

//   passport.authenticate("facebook", { 
//     scope: ["email"], 
//     session: false,
//   }),
// ];

const facebookLogin = [
  verifyJWT,

  (req, res) => {
    const { vendor_id, module_type } = req.user;

    const redirectUrl = `http://localhost:4001/marketing/site/apis/redirect/facebook?vendor_id=${vendor_id}&module_type=${module_type}`;

    res.redirect(redirectUrl);
  }
];





const redirectToFacebookAuth = (req, res, next) => {
  try {
    // Capture vendor_id and module_type from query params
    const { vendor_id, module_type } = req.query;
    console.log("vendor_id:", vendor_id);
    console.log("module_type:", module_type);

    if (!vendor_id || !module_type) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Passing state with vendor_id and module_type
    passport.authenticate("facebook", {
      scope: ["email"],
      session: false,
      state: JSON.stringify({
        vendor_id,
        module_type,
      }),
    })(req, res, next);
  } catch (error) {
    console.error("Error in redirectToFacebookAuth:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};






const facebookCallback = passport.authenticate("facebook", {
  failureRedirect: "http://localhost:4001/marketing/site/apis/facebook/error",
  session: false,
});

const facebookSuccess = (req, res) => {
  try {
    const redirectUrl = "http://localhost:5173/managesocialmedia";
    
    // No token generation, just redirect
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error in facebook success handler:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const facebookError = (req, res) => {
  res.status(400).json({ message: "Facebook login failed" });
};

const facebookSignout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

const checkFacebookAuth = async (req, res) => {
  try {
    const userData = req.user;
    console.log("usu" , userData)

    
    // Check if there's a user with these hardcoded values
    const user = await User.findOne({
      where: { 
        module_type: userData.module_type,
        vendor_id: userData.vendor_id
      }
    });
    
    if (!user) {
      return res.status(200).json({
        authenticated: false,
        message: "User not authenticated with Facebook"
      });
    }
    
    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        accountId: user.accountId,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error("Error checking Facebook auth:", error);
    return res.status(500).json({ 
      authenticated: false,
      message: "Internal server error"
    });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const userData = req.user;  
    const module_type = userData.module_type; 
    const vendor_id = userData.vendor_id;
    
    // Find user by module_type and vendor_id
    const user = await User.findOne({ 
      where: { 
        module_type: module_type,
        vendor_id: vendor_id
      } 
    });
    
    if (!user) {
      return res.status(200).json({ 
        authenticated: false, // Return false if user not found
        message: "User not found" 
      });
    }
    
    return res.status(200).json({
      authenticated: true, 
      user: {
        id: user.id,
        name: user.name,
        accountId: user.accountId,
        provider: user.provider,
        accessToken: user.accessToken,
      }
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return res.status(500).json({ 
      authenticated: false, // Return false in case of an error
      message: "Internal server error" 
    });
  }
};




module.exports = {
  facebookLogin,
  facebookCallback,
  facebookSuccess,
  facebookError,
  facebookSignout,
  checkFacebookAuth,
  getUserByToken,
  redirectToFacebookAuth,
};


// authFacebook.js
// const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
// const User = require("../../models/facebookAuth.model");
// require("dotenv").config();

// // Setup Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_SECRET_KEY,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//       profileFields: ['id', 'displayName', 'email'],
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       try {
//         let user = await User.findOne({ where: { accountId: profile.id } });

//         if (!user) {
//           user = await User.create({
//             accountId: profile.id,
//             name: profile.displayName,
//             provider: profile.provider,
//             accessToken: accessToken,
//           });
//         } else {
//           user.accessToken = accessToken;
//           await user.save();
//         }

//         return cb(null, user);
//       } catch (error) {
//         console.error("❌ Facebook strategy error:", error);
//         return cb(error, null);
//       }
//     }
//   )
// );

// // Start Facebook Login
// const facebookLogin = passport.authenticate("facebook", {
//   scope: ["email"],
//   session: false,
// });

// // Handle Callback
// const facebookCallback = passport.authenticate("facebook", {
//   failureRedirect: "/facebook/error",
//   session: false,
// });

// // On Successful Login
// const facebookSuccess = (req, res) => {
//   res.redirect("http://localhost:5173/managesocialmedia");
// };

// // On Failed Login
// const facebookError = (req, res) => {
//   res.status(400).json({ message: "Facebook login failed" });
// };

// module.exports = {
//   facebookLogin,
//   facebookCallback,
//   facebookSuccess,
//   facebookError,
// };
