const Category = require("../models/FoodCategory");
const fileUploaderSingle =
  require("../../../utilities/fileUpload").fileUploaderSingle;
const FoodSubCategory = require("../models/FoodSubCategory");
const slugify = require("slugify"); 
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const { createObjectCsvStringifier } = require('csv-writer');

// Create a new category

exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    const created_by = req?.user?.userId;

    // Validate
    if (!name) {
      return res.status(400).json({ status: false, message: "Category name is required" });
    }

    // Handle image upload
    let image;
    if (req.files && req.files.img) {
      console.log("Uploading image:", req.files.img.name);
      image = await fileUploaderSingle("./public/uploads/", req.files.img);
      console.log("Uploaded image:", image);
    }

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Create the category
    const category = await Category.create({
      name,
      slug,
      description,
      parent_id: parent_id || null,
      img: image?.newFileName || null,
      created_by: created_by || null,
      status: true, // active by default
    });

    // Generate the full image path
    const fullImagePath = category.img
      ? `${process.env.APP_URL}public/uploads/${category.img}`
      : null;

    return res.status(200).json({
      status: true,
      message: "Category added successfully",
      data: {
        ...category.toJSON(),
        img: fullImagePath, // full image URL
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    // Correct Base URL
    const baseUrl = `http://localhost:4001/public/uploads/`;  // This matches your folder structure

    // Add the correct image URL to each category
    const categoriesWithImagePath = categories.map((category) => {
      const categoryJson = category.toJSON();
      return {
        ...categoryJson,
        img: categoryJson.img ? `${baseUrl}${categoryJson.img}` : null,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Categories fetched successfully",
      data: {
        baseUrl,
        categories: categoriesWithImagePath,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


// exports.getCategories = async (req, res) => {
//   try {
//     const categories = await Category.findAll();

//     // Normalize APP_URL to avoid double slashes
//     const baseUrl = process.env.APP_URL.replace(/\/$/, ""); // remove trailing slash if present
//     const uploadPath = "/public/uploads/";

//     // Add the full image path for each category
//     const categoriesWithImagePath = categories.map((category) => {
//       const fullImagePath = category.img
//         ? `${baseUrl}${uploadPath}${category.img}`
//         : null;
//       return {
//         ...category.toJSON(),
//         img: fullImagePath,
//       };
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Categories fetched successfully",
//       data: {
//         baseUrl: `${baseUrl}${uploadPath}`,
//         categories: categoriesWithImagePath,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return res.status(500).json({ status: false, message: error.message });
//   }
// };

// get all categories with sub categories
exports.getSubCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: FoodSubCategory,
          as: "subcategories",
          required: false, // optional: still include category even if no subcategories
        },
      ],
    });

    return res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data: {
        baseUrl: `${process.env.APP_URL}uploads/`,
        categories,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new subcategory
exports.createSubCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      slug,
      category_id,
      commission,
      created_by,
      status,
    } = req.body;

    // Handle image upload if an image is provided
    let image;
    if (req.files && req.files.img) {
      image = await fileUploaderSingle("./public/uploads/", req.files.img);
    }

    // Create the subcategory
    const subcategory = await FoodSubCategory.create({
      name,
      description,
      slug,
      category_id,
      commission: commission || 0.0, // Default to 0.0 if no commission is provided
      created_by,
      status: status !== undefined ? status : true, // Default to true if no status is provided
      img: image?.newFileName, // Store the uploaded image filename if an image is uploaded
    });

    // Generate the full image path for the response
    const fullImagePath = subcategory.img
      ? `${process.env.APP_URL}/uploads/${subcategory.img}`
      : null;

    // Return the response with subcategory details including the full image path
    return res.status(200).json({
      status: true,
      message: "Subcategory created successfully",
      data: {
        ...subcategory.toJSON(),
        img: fullImagePath, // Add the full image path to the response
      },
    });
  } catch (error) {
    console.error("Error creating subcategory:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    // Add full image URL
    const data = category.toJSON();
    data.img = data.img ? `${process.env.APP_URL}/uploads/${data.img}` : null;

    return res.status(200).json({
      status: true,
      message: "Category fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Update a category

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    const { name, description, parent_id } = req.body;

    let image = category.img; // default to existing image

    if (req.files && req.files.img) {
      const uploaded = await fileUploaderSingle(
        "./public/uploads/",
        req.files.img,
      );
      image = uploaded.newfileName;
    }

    const updated = await category.update({
      name,
      description,
      parent_id,
      img: image,
    });

    // Add full image path in response
    const updatedData = updated.toJSON();
    updatedData.img = image ? `${process.env.APP_URL}/uploads/${image}` : null;

    return res.status(200).json({
      status: true,
      message: "Category updated successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    const deleted = await category.destroy();
    return res.status(200).json({
      status: true,
      message: "Category delete successfully",
    });
  } catch (error) {
    return res.status(500).json({ status: true, message: error.message });
  }
};


// Add these new functions to the exports object

exports.exportCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ raw: true });

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'name', title: 'Name' },
        { id: 'description', title: 'Description' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' },
      ],
    });

    // 👇 Compose the final CSV content
    const csvContent = csvStringifier.getHeaderString() +
                       csvStringifier.stringifyRecords(categories);

    // 👇 Set headers and send CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="categories.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: "Failed to export categories." });
  }
};

exports.importCategories = async (req, res) => {
  
  try {
    // const authToken = req.headers.Token;
    // if (!authToken) {
    //   return res.status(401).json({ status: false, message: "Unauthorized" });
    // }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ status: false, message: 'No file uploaded' });
    }
console.log(req.files);

    const file = req.files.file;
    const tempPath = path.join(process.cwd(), 'temp-categories.csv');
    console.log(file);
    console.log(tempPath);
    
    await file.mv(tempPath);
    
    const categories = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(tempPath)
        .pipe(csv())
        .on('data', (row) => {
          categories.push({
            name: row.Name,
            description: row.Description,
            parent_id: row.Parent_ID || null,
            status: row.Status === '1',
            created_by: req?.user?.userId || null,
            slug: slugify(row.Name, { lower: true, strict: true })
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await Category.bulkCreate(categories);
    fs.unlinkSync(tempPath);
    
    res.status(200).json({
      status: true,
      message: 'Categories imported successfully'
    });
  } catch (error) {
    console.error('Error processing import:', error);
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    res.status(500).json({ status: false, message: error.message });
  }
};
