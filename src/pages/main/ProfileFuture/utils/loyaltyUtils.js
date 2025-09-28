export const LOYALTY_TIERS = {
  BRONZE: {
    name: "Bronze",
    minBookings: 0,
    maxBookings: 4,
    minSpent: 0,
    maxSpent: 999,
    color: "#cd7f32",
    bgColor: "from-orange-100 to-yellow-100",
    benefits: ["Basic support", "Standard booking"],
    multiplier: 1,
  },
  SILVER: {
    name: "Silver",
    minBookings: 5,
    maxBookings: 14,
    minSpent: 1000,
    maxSpent: 4999,
    color: "#c0c0c0",
    bgColor: "from-gray-100 to-slate-100",
    benefits: ["Priority support", "Early check-in", "5% discount"],
    multiplier: 1.1,
  },
  GOLD: {
    name: "Gold",
    minBookings: 15,
    maxBookings: 29,
    minSpent: 5000,
    maxSpent: 14999,
    color: "#ffd700",
    bgColor: "from-yellow-100 to-orange-100",
    benefits: ["VIP support", "Room upgrade", "10% discount", "Late checkout"],
    multiplier: 1.25,
  },
  DIAMOND: {
    name: "Diamond",
    minBookings: 30,
    maxBookings: Infinity,
    minSpent: 15000,
    maxSpent: Infinity,
    color: "#b9f2ff",
    bgColor: "from-blue-100 to-purple-100",
    benefits: [
      "Personal concierge",
      "Free room upgrade",
      "15% discount",
      "Exclusive access",
    ],
    multiplier: 1.5,
  },
};

export const getLoyaltyTier = (confirmedBookings = 0, totalSpent = 0) => {
  const bookingCount = Number(confirmedBookings);
  const spentAmount = Number(totalSpent);

  // Check if user qualifies for tier based on both bookings AND spending
  if (
    bookingCount >= LOYALTY_TIERS.DIAMOND.minBookings &&
    spentAmount >= LOYALTY_TIERS.DIAMOND.minSpent
  ) {
    return LOYALTY_TIERS.DIAMOND;
  } else if (
    bookingCount >= LOYALTY_TIERS.GOLD.minBookings &&
    spentAmount >= LOYALTY_TIERS.GOLD.minSpent
  ) {
    return LOYALTY_TIERS.GOLD;
  } else if (
    bookingCount >= LOYALTY_TIERS.SILVER.minBookings &&
    spentAmount >= LOYALTY_TIERS.SILVER.minSpent
  ) {
    return LOYALTY_TIERS.SILVER;
  } else {
    return LOYALTY_TIERS.BRONZE;
  }
};

export const getNextTierProgress = (confirmedBookings = 0, totalSpent = 0) => {
  const currentTier = getLoyaltyTier(confirmedBookings, totalSpent);
  const bookingCount = Number(confirmedBookings);
  const spentAmount = Number(totalSpent);

  if (currentTier.name === "Diamond") {
    return 100;
  }

  const nextTier = Object.values(LOYALTY_TIERS).find(
    (tier) =>
      tier.minBookings > currentTier.minBookings ||
      tier.minSpent > currentTier.maxSpent
  );

  if (!nextTier) return 100;

  // Calculate progress based on both bookings and spending requirements
  // User needs to meet BOTH requirements to advance
  const bookingProgress = Math.min(
    (bookingCount / nextTier.minBookings) * 100,
    100
  );

  const spendingProgress = Math.min(
    (spentAmount / nextTier.minSpent) * 100,
    100
  );

  // Return the minimum of the two progress values (both must be met)
  // This ensures progress never shows 100% unless both requirements are met
  return Math.min(Math.round(bookingProgress), Math.round(spendingProgress));
};

export const getNextTierName = (confirmedBookings = 0, totalSpent = 0) => {
  const currentTier = getLoyaltyTier(confirmedBookings, totalSpent);

  if (currentTier.name === "Diamond") return null;

  return Object.values(LOYALTY_TIERS).find(
    (tier) =>
      tier.minBookings > currentTier.maxBookings ||
      tier.minSpent > currentTier.maxSpent
  )?.name;
};

export const getNextTierRequirements = (
  confirmedBookings = 0,
  totalSpent = 0
) => {
  // const currentTier = getLoyaltyTier(confirmedBookings, totalSpent);
  const nextTierName = getNextTierName(confirmedBookings, totalSpent);

  if (!nextTierName) return null;

  const nextTier = Object.values(LOYALTY_TIERS).find(
    (tier) => tier.name === nextTierName
  );

  const bookingsNeeded = Math.max(0, nextTier.minBookings - confirmedBookings);
  const amountNeeded = Math.max(0, nextTier.minSpent - totalSpent);

  return {
    bookingsNeeded,
    amountNeeded,
    nextTierName: nextTierName,
    // Add detailed progress info
    currentBookings: confirmedBookings,
    requiredBookings: nextTier.minBookings,
    currentSpent: totalSpent,
    requiredSpent: nextTier.minSpent,
  };
};

// Add utility function to calculate loyalty points with multiplier
export const calculateLoyaltyPoints = (
  confirmedBookings = 0,
  totalSpent = 0
) => {
  const tier = getLoyaltyTier(confirmedBookings, totalSpent);
  const basePointsFromSpending = Math.floor(totalSpent / 10); // 1 point per $10
  const basePointsFromBookings = confirmedBookings * 100; // 100 points per booking
  const basePoints = basePointsFromSpending + basePointsFromBookings;

  return Math.round(basePoints * tier.multiplier);
};
