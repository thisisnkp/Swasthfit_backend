const multer = require("multer");
let files = [];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/gym");
  },
  filename: function (req, file, cb) {
    // let modifiedfilename = Date.now()+'-'+file.originalname;
    // file.modifiedfilename = modifiedfilename;

    // req.gym_logo = file.fieldname == 'gym_logo' ? modifiedfilename : null
    // req.profile_photo = file.fieldname == 'profile_photo' ? modifiedfilename : null
    // req.cancel_cheque_photo = file.fieldname == 'cancel_cheque_photo' ? modifiedfilename : null
    // req.msme_certificate_photo = file.fieldname == 'msme_certificate_photo' ? modifiedfilename : null
    // req.shop_certificate_photo = file.fieldname == 'shop_certificate_photo' ? modifiedfilename : null

    if (file.fieldname == "gym_logo") {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.gym_logo = modifiedfilename;
      cb(null, modifiedfilename);
    } else if (file.fieldname == "profile_photo") {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.profile_photo = modifiedfilename;
      cb(null, modifiedfilename);
    } else if (req.body.cancel_cheque_photo) {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.cancel_cheque_photo = modifiedfilename;
      cb(null, modifiedfilename);
    } else if (file.fieldname == "gst_photo") {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.gst_photo = modifiedfilename;
      cb(null, modifiedfilename);
    } else if (req.body.msme_certificate_photo) {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.msme_certificate_photo = modifiedfilename;
      cb(null, modifiedfilename);
    } else if (req.body.shop_certificate_photo) {
      let fileExtension = file.originalname.split(".").pop();
      let randomString = Math.random().toString(36).substring(2, 15);
      let modifiedfilename = `${randomString}.${fileExtension}`;

      req.body.shop_certificate_photo = modifiedfilename;
      cb(null, modifiedfilename);
    }
  },
});

const upload = multer({ storage });

module.exports = upload;
