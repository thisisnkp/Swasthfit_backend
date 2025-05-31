// pages/api/checkPermission.js
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { moduleName, action, staff_id } = req.body;

  if (!moduleName || !action || !staff_id) {
    return res.status(400).json({
      hasPermission: false,
      message: "Missing moduleName, action, or staff_id.",
    });
  }

  try {
    const user = await YourUserModel.findOne({
      where: { id: staff_id },
      attributes: ["id", "role_id"],
    });

    if (!user || !user.role_id) {
      return res.status(403).json({
        hasPermission: false,
        message: "User or role not found.",
      });
    }

    // Check permissions logic here
    // ...

    res.status(200).json({ hasPermission: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
