const TrainerHiringData = require("./payment.model");
const Trainer = require("../user/trainer.model");
const TrainersAllPayments = require("./trainersAllPayments.model");

const hireTrainer = async (req, res) => {
  try {
    const { trainer_id, starting_date, ending_date } = req.body;
    const client_id = req.user.id;

    if (!trainer_id || !starting_date || !ending_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch trainer charges from trainer model
    const trainer = await Trainer.findOne({ where: { id: trainer_id } });
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }

    const trainerCharges = trainer.client_price || 0;

    // Placeholder for platform fees (to be updated later)
    const platformFees = 500;

    // Calculate total amount
    const totalAmount = trainerCharges + platformFees;

    // Check if hiring record exists for this client and trainer
    let hiringRecord = await TrainerHiringData.findOne({
      where: { trainer_id, client_id },
    });

    if (hiringRecord) {
      // Update existing hiring record
      hiringRecord.starting_date = starting_date;
      hiringRecord.ending_date = ending_date;
      hiringRecord.total_amount = totalAmount;
      await hiringRecord.save();
    } else {
      // Create new hiring record
      hiringRecord = await TrainerHiringData.create({
        trainer_id,
        client_id,
        starting_date,
        ending_date,
        total_amount: totalAmount,
      });
    }

    // Create new entry in trainers_all_payments
    await TrainersAllPayments.create({
      trainer_id,
      client_id,
      date: starting_date,
      amount: totalAmount,
    });

    return res.status(201).json({
      message: "Trainer hired successfully",
      data: hiringRecord,
    });
  } catch (error) {
    console.error("Error hiring trainer:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  hireTrainer,
};
