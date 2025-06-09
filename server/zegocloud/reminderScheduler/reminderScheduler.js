const cron = require("node-cron");
const { Op } = require("sequelize");
const Channel = require("../channel/models/channel.model");

// const sendEmail = require("./sendEmail");
// const sendInAppNotification = require("./sendEmail");

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();
  const tenMinLater = new Date(now.getTime() + 10 * 60000);
  const fiveMinLater = new Date(now.getTime() + 5 * 60000);

  try {
    // Get all scheduled meetings within the next 10 minutes
    const meetings = await Channel.findAll({
      where: {
        status: "scheduled",
        scheduledAt: {
          [Op.between]: [now, tenMinLater],
        },
      },
    });

    for (const meeting of meetings) {
      const timeDiff = (new Date(meeting.scheduledAt) - now) / 60000;

      // 10-minute email + notification
      if (timeDiff <= 10 && timeDiff > 9) {
        // await sendEmail(meeting.participant1, "Meeting starts in 10 minutes");
        // await sendEmail(meeting.participant2, "Meeting starts in 10 minutes");
        await sendInAppNotification(
          meeting.participant1,
          "Meeting starts in 10 minutes"
        );
        await sendInAppNotification(
          meeting.participant2,
          "Meeting starts in 10 minutes"
        );
      }

      // 5-minute notification
      if (timeDiff <= 5 && timeDiff > 4) {
        await sendInAppNotification(
          meeting.participant1,
          "Meeting starts in 5 minutes"
        );
        await sendInAppNotification(
          meeting.participant2,
          "Meeting starts in 5 minutes"
        );
      }
    }
  } catch (error) {
    console.error("Error in reminder scheduler:", error);
  }
});
