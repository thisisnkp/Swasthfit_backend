const fs = require("fs");
const path = require("path");

/**
 * Upload a single file to the specified path.
 * @param {string} uploadPath - The directory where the file will be uploaded.
 * @param {object} file - The file object to be uploaded.
 * @returns {Promise<object>} - An object containing the original and new file names.
 */
const fileUploaderSingle = async (uploadPath, file) => {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Generate a new file name using the current timestamp
    const newFileName = `${Date.now()}_${file.name}`;
    const fullUploadPath = path.join(uploadPath, newFileName);

    // Move the file to the upload path
    await file.mv(fullUploadPath);

    return { originalFileName: file.name, newFileName };
};

/**
 * Upload multiple files to the specified path.
 * @param {string} uploadPath - The directory where the files will be uploaded.
 * @param {object} files - The files object containing one or more files to be uploaded.
 * @returns {Promise<Array<object>>} - An array of objects containing original and new file names.
 */
const fileUploaderMultiple = async (uploadPath, files) => {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const imagesArr = [];

    // Iterate over the files object
    for (const [key, val] of Object.entries(files)) {
        if (Array.isArray(val)) {
            // Handle multiple files in an array
            for (const value of val) {
                const newFileName = `${Date.now()}_${value.name}`;
                const fullUploadPath = path.join(uploadPath, newFileName);
                await value.mv(fullUploadPath);
                imagesArr.push({ originalFileName: value.name, newFileName });
            }
        } else {
            // Handle a single file
            const newFileName = `${Date.now()}_${val.name}`;
            const fullUploadPath = path.join(uploadPath, newFileName);
            await val.mv(fullUploadPath);
            imagesArr.push({ originalFileName: val.name, newFileName });
        }
    }

    return imagesArr;
};

module.exports = {
    fileUploaderSingle,
    fileUploaderMultiple,
};

// const multer = require('multer');
// const path = require('path');

// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads/'); // Ensure this directory exists
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });

// // File filter to accept only images
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed!'), false);
//     }
// };

// // Multer configuration
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // 5MB file limit
// });

// module.exports = upload;
