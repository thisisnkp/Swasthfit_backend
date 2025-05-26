class CoinCalculator {
  // Define coin value constant - 1 coin = 10 paise (0.1 rupees)
  static COIN_VALUE_IN_PAISE = 10;

  // Method to convert coins to monetary value in rupees
  static coinsToRupees(coins) {
    return (coins * this.COIN_VALUE_IN_PAISE) / 100;
  }

  // Method to convert rupees to coins
  static rupeesToCoins(rupees) {
    return Math.floor((rupees * 100) / this.COIN_VALUE_IN_PAISE);
  }

  static calculateSubscriptionBonus(subscription_type, coins) {
    const subscriptionMultipliers = {
      "Corporate Subscription": 1.5,
      "Gym Subscription": 1.2,
      "Swasthfit Subscription": 2.0,
    };

    const multiplier = subscriptionMultipliers[subscription_type] || 1.0;
    return Math.floor(coins * multiplier);
  }

  static calculateActivityCoins(
    activity,
    value,
    todayScans = 0,
    sleep_quality = null
  ) {
    let coins = 0;

    switch (activity.name) {
      case "Steps Count":
        const achievedTarget = value >= activity.daily_target;
        coins = achievedTarget
          ? activity.base_coin_value
          : Math.floor(
              (value / activity.daily_target) * activity.base_coin_value
            );
        break;

      case "Food Scan":
      case "Body Scan":
      case "Face Scan":
      case "Posture Analysis":
      case "Activity Scan":
        if (todayScans < 4) coins = activity.scan_rewards.first_4;
        else if (todayScans < 8) coins = activity.scan_rewards.after_4;
        else coins = activity.scan_rewards.after_8;
        break;

      case "Sleep Well-Being":
        coins = activity.base_coin_value; // Base 100 coins
        break;

      case "Daily Goals":
        // Sleep quality based rewards
        if (sleep_quality) {
          coins =
            activity.sleep_quality_rewards[sleep_quality] ||
            activity.base_coin_value;
        } else {
          coins = activity.base_coin_value;
        }
        break;

      case "Calorie Target":
        const calorieTargetAchieved = value >= activity.daily_target;
        coins = calorieTargetAchieved
          ? activity.base_coin_value
          : Math.floor(
              (value / activity.daily_target) * activity.base_coin_value
            );
        break;

      default:
        coins = activity.base_coin_value;
    }

    return coins;
  }

  static calculateStreakBonus(activity, currentStreak) {
    if (!activity || !activity.streak_bonuses) return 0;

    // Define streak bonuses based on streak days
    if (currentStreak >= 30) return activity.streak_bonuses[30] || 0;
    if (currentStreak >= 15) return activity.streak_bonuses[15] || 0;
    if (currentStreak >= 7) return activity.streak_bonuses[7] || 0;
    if (currentStreak >= 3) return activity.streak_bonuses[3] || 0;

    return 0;
  }

  static calculatePurchaseReward(reward_type, purchase_amount) {
    switch (reward_type) {
      case "double":
        return purchase_amount * 2;
      case "triple":
        return purchase_amount * 3;
      default:
        return purchase_amount;
    }
  }

  static calculateBusinessCategoryReward(business_category, purchase_amount) {
    const categoryRewards = {
      "E-Commerce": "double",
      "Food Order": "double",
      "Travel Booking": "double",
      Insurance: "double",
      "Blood Test": "double",
      Subscription: "triple",
    };

    const reward_type = categoryRewards[business_category] || "default";
    return this.calculatePurchaseReward(reward_type, purchase_amount);
  }

  // Brain game rewards calculation
  static calculateBrainGameReward(duration_seconds, is_subscribed) {
    if (is_subscribed) {
      // 1 coin per second for subscribers
      return Math.floor(duration_seconds);
    } else {
      // 2 coins per 5 seconds for non-subscribers
      return Math.floor(duration_seconds / 5) * 2;
    }
  }

  static calculateSocialReward(activity_type, count) {
    switch (activity_type) {
      case "share":
        if (count <= 5) return 25;
        else if (count <= 8) return 15;
        else return 5;
      case "like":
        return 5;
      case "comment":
        return 15;
      case "referral":
        return 2000;
      default:
        return 0;
    }
  }

  static calculateRedemptionMargin(business_category, purchase_amount) {
    const marginRates = {
      "E-Commerce": 0.4,
      "Food Order": 0.25,
      "Travel Booking": 1.0,
      Insurance: 1.0,
      "Blood Test": 1.0,
    };

    const rate = marginRates[business_category] || 0.5;
    return purchase_amount * rate;
  }

  static calculateCoinApplicability(business_category, margin) {
    const applicabilityRates = {
      "E-Commerce": 0.5,
      "Food Order": 0.5,
      "Travel Booking": 0.7,
      Insurance: 0.6,
      "Blood Test": 0.6,
    };

    const rate = applicabilityRates[business_category] || 0.5;
    return margin * rate;
  }

  static calculateSwasthfitMargin(business_category, margin) {
    const marginRates = {
      "E-Commerce": 0.5,
      "Food Order": 0.5,
      "Travel Booking": 0.3,
      Insurance: 0.4,
      "Blood Test": 0.4,
    };

    const rate = marginRates[business_category] || 0.5;
    return margin * rate;
  }

  static calculateGullakDeposit(business_category, margin) {
    switch (business_category) {
      case "E-Commerce":
        return margin * 0.5; // Money Deposit in Gullak = 0.5*Y (same as Swaasthfiit Margin)
      case "Food Order":
        return margin * 0.5; // Money Deposit in Gullak = 0.5*Y
      case "Travel Booking":
        return margin * 0.7; // Money Deposit in Gullak = 0.7*Y
      case "Insurance":
      case "Blood Test":
        return margin * 0.6; // Money Deposit in Gullak = 0.6*Y
      default:
        return margin * 0.5; // Default to E-Commerce formula
    }
  }

  // Calculate total coins for steps count
  static calculateTotalCoinsForSteps(
    steps,
    currentStreak,
    trackingStreak,
    subscriptionType
  ) {
    const baseCoins = this.calculateDailyStepsCoins(steps);
    const streakBonus = this.calculateStreakBonus(currentStreak);
    const trackingBonus = this.calculateRegularTrackingBonus(trackingStreak);

    let totalCoins = baseCoins + streakBonus + trackingBonus;

    // Apply subscription multiplier
    const multiplier = this.calculateSubscriptionMultiplier(subscriptionType);
    totalCoins *= multiplier;

    return totalCoins;
  }

  // Calculate daily target-based coins
  static calculateDailyStepsCoins(steps) {
    const targetSteps = 6000;
    const maxCoins = 100;
    const coins = Math.floor((steps / targetSteps) * maxCoins);
    return Math.min(coins, maxCoins);
  }

  // Calculate regular tracking bonus
  static calculateRegularTrackingBonus(trackingStreak) {
    if (trackingStreak >= 30) return 1000;
    if (trackingStreak >= 15) return 500;
    if (trackingStreak >= 7) return 200;
    if (trackingStreak >= 3) return 50;
    return 0;
  }

  // Calculate subscription multiplier
  static calculateSubscriptionMultiplier(subscriptionType) {
    const multipliers = {
      Corporate: 1.5,
      Gym: 1.2,
      Swaasthfiit: 2.0,
      Free: 1.0,
    };
    return multipliers[subscriptionType] || 1.0;
  }
}

module.exports = CoinCalculator;
