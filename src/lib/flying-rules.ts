// Shared figures for the flying-with-batteries guides. Thresholds follow FAA PackSafe and TSA guidance.
export const FAA_URL = "https://www.faa.gov/hazmat/packsafe/lithium-batteries";
export const TSA_URL = "https://www.tsa.gov/travel/security-screening/whatcanibring/items/power-banks";

/** Watt-hours from mAh at a nominal cell voltage, rounded to one decimal. */
export const whFrom = (mah: number, v = 3.7) => Math.round((mah * v) / 100) / 10;
/** Largest mAh (rounded down to 100) that stays at or under a Wh limit at a nominal voltage. */
export const mahFor = (wh: number, v = 3.7) => Math.floor((wh * 1000) / v / 100) * 100;

export const verdict = (wh: number) =>
  wh <= 100 ? "Carry-on, no approval needed" : wh <= 160 ? "Carry-on with airline approval (max two spares)" : "Not allowed as a passenger power bank";

export const TABLE_MAH = [5000, 10000, 15000, 20000, 25000, 26800, 30000, 40000, 50000];
