const Menu = require("../models/MenuCard");

exports.getMenus = async (req, res) => {
  try {
    const menus = await Menu.findAll();

    // Correct Base URL
    const baseUrl = `http://localhost:4001/public/uploads/`;  // This matches your folder structure

    // Add the correct image URL to each menu
    const updatedMenus = menus.map((menu) => {
      const menuJson = menu.toJSON();
      return {
        ...menuJson,
        image_url: menuJson.image_url ? `${baseUrl}${menuJson.image_url}` : null,  // Update image URL
      };
    });

    return res.status(200).json({
      success: true,
      data: updatedMenus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.createMenu = async (req, res) => {
  try {
    const { title, branch, visit_message, order_details, image_url } = req.body;

    // Validation
    if (!title || !branch) {
      return res
        .status(400)
        .json({ success: false, message: "Title and Branch are required" });
    }

    const newMenu = await Menu.create({
      title,
      branch,
      visit_message,
      order_details,
      image_url,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "Menu created successfully",
        data: newMenu,
      });
  } catch (error) {
    console.error("Error creating menu:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
