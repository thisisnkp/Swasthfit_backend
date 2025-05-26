function setupAssociations() {
  const Activity = require("./Activities");
  const UserActivity = require("./UserActivities");
  const Competition = require("./Competition");
  const CompetitionPrize = require("./CompetitionPrize");
  const CompetitionParticipation = require("./CompetitionParticipation");

  const CoinSeller = require("./CoinSeller");
  const CoinBid = require("./CoinBid");

  // Define the association between UserActivity and Activity
  UserActivity.belongsTo(Activity, {
    foreignKey: "activity_id",
    as: "activity",
  });

  Activity.hasMany(UserActivity, {
    foreignKey: "activity_id",
    as: "userActivities",
  });

  // Add Competition associations
  // This association might be causing issues - consider using ID instead of name
  CompetitionPrize.belongsTo(Competition, {
    foreignKey: "competition_name",
    targetKey: "name",
    as: "competition",
  });

  Competition.hasMany(CompetitionPrize, {
    foreignKey: "competition_name",
    sourceKey: "name",
    as: "prizes",
  });

  CompetitionParticipation.belongsTo(Competition, {
    foreignKey: "competition_id",
    as: "competition",
  });

  Competition.hasMany(CompetitionParticipation, {
    foreignKey: "competition_id",
    as: "participants",
  });

  // Define the association between CoinSeller and CoinBid
  CoinSeller.hasMany(CoinBid, {
    foreignKey: "coin_seller_id",
    as: "bids",
  });

  CoinBid.belongsTo(CoinSeller, {
    foreignKey: "coin_seller_id",
    as: "seller",
  });

  console.log("Associations set up successfully");
}

// Make sure to export the function
module.exports = setupAssociations;
