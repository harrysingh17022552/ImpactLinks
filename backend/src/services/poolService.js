// assume each user pays 1000
const SUBSCRIPTION_AMOUNT = 1000;
const CHARITY_PERCENT = 0.1;

export const calculatePool = async (activeUsersCount, prevJackpot = 0) => {
  const totalRevenue = activeUsersCount * SUBSCRIPTION_AMOUNT;

  const charityCut = totalRevenue * CHARITY_PERCENT;

  const poolBase = totalRevenue - charityCut;

  return {
    totalPool: poolBase + prevJackpot,
    charity: charityCut,
  };
};
export const splitPool = (totalPool) => {
  return {
    tier5: totalPool * 0.4,
    tier4: totalPool * 0.35,
    tier3: totalPool * 0.25,
  };
};
