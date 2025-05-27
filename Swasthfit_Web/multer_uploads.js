const multer = require('multer');
let files = [];
let profilePic = '';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (req.body.userType == 'Trainer') {
            cb(null, "./uploads/trainers")
        } else if (req.body.userType == 'User') {
            cb(null, "./uploads/users")
        } else if (req.body.userType == 'Gym') {
            cb(null, "./uploads/gyms")
        }

    },
    filename: function (req, file, cb) {
        let modifiedfilename = Date.now() + '-' + file.originalname;
        file.modifiedfilename = modifiedfilename;
        if (file.fieldname == 'profile_image') {
            req.profilePic = modifiedfilename
        }
        else {
            files.push(modifiedfilename);
            req.images = files;
        }

        cb(null, modifiedfilename)
    }
});

const uploadFiles = multer({ storage });

module.exports = uploadFiles;