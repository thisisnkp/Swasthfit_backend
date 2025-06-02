// db.js
const UserProductAction = require("./userproductaction");
exports.syncModels = async () => {
  try {
    await UserProductAction.sync({ alter: true });
    console.log("UserProductAction table synced");
  } catch (err) {
    console.error("Model sync error:", err);
  }
};


