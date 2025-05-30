const Channel = require("./channel.model");

// Schedule a new channel
exports.scheduleChannel = async (req, res) => {
  try {
    const { channelName, participant1, participant2, scheduledAt } = req.body;
    if (!channelName || !participant1 || !participant2 || !scheduledAt) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const channel = await Channel.create({
      channelName,
      participant1,
      participant2,
      scheduledAt,
    });
    res.status(201).json({ success: true, channel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// List all scheduled channels
exports.listChannels = async (req, res) => {
  const channels = await Channel.findAll();
  res.json({ success: true, channels });
};

// Update channel status
exports.updateChannelStatus = async (req, res) => {
  const { channelName, status } = req.body;
  const channel = await Channel.findOne({ where: { channelName } });
  if (!channel)
    return res
      .status(404)
      .json({ success: false, message: "Channel not found" });
  channel.status = status;
  await channel.save();
  res.json({ success: true, channel });
};
