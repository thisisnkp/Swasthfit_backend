const fs = require("fs");
const path = require("path");

const fileUploaderSingle = async (uploadPath, file) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Clean filename and get extension
    let fileExtension = path.extname(file.name).toLowerCase();
    const sanitizedName = path
      .basename(file.name, fileExtension)
      .replace(/[^a-z0-9]/gi, "_");
    const newFileName = `${Date.now()}_${sanitizedName}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;
    const fullUploadPath = path.join(
      uploadPath,
      `${newFileName}${fileExtension}`
    );

    // Move the file to the upload path
    await file.mv(fullUploadPath);

    return {
      originalFileName: file.name,
      newFileName: `${newFileName}${fileExtension}`,
    };
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

const fileUploaderMultiple = async (uploadPath, files) => {
  try {
    if (!files || Object.keys(files).length === 0) {
      throw new Error("No files provided");
    }

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
          const fileExtension = path.extname(value.name).toLowerCase();
          const sanitizedName = path
            .basename(value.name, fileExtension)
            .replace(/[^a-z0-9]/gi, "_");
          const newFileName = `${Date.now()}_${sanitizedName}_${Math.random()
            .toString(36)
            .substring(2, 8)}${fileExtension}`;
          const fullUploadPath = path.join(uploadPath, newFileName);

          await value.mv(fullUploadPath);
          imagesArr.push({ originalFileName: value.name, newFileName });
        }
      } else {
        const fileExtension = path.extname(val.name).toLowerCase();
        const sanitizedName = path
          .basename(val.name, fileExtension)
          .replace(/[^a-z0-9]/gi, "_");
        const newFileName = `${Date.now()}_${sanitizedName}_${Math.random()
          .toString(36)
          .substring(2, 8)}${fileExtension}`;
        const fullUploadPath = path.join(uploadPath, newFileName);

        await val.mv(fullUploadPath);
        imagesArr.push({ originalFileName: val.name, newFileName });
      }
    }

    return imagesArr;
  } catch (error) {
    throw new Error(`Multiple files upload failed: ${error.message}`);
  }
};

module.exports = {
  fileUploaderSingle,
  fileUploaderMultiple,
};
