// controllers/vendorTransactionController.js
const VendorTransaction = require("../../model/allTransaction.model");

exports.getVendorTransactionsByGymId = async (req, res) => {
  try {
    const gymId = req.params.id;

    if (!gymId) {
      return res.status(400).json({ message: "Gym ID is required" });
    }

    const transactions = await VendorTransaction.findAll({
      where: {
        vendor_id: gymId,
        vendor_type: "gym",
      },
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
