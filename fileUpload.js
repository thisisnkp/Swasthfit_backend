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
    let fileExtension = file.name.split('.').pop(); 
    const newFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const fullUploadPath = path.join(uploadPath, `${newFileName}.${fileExtension}`);

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