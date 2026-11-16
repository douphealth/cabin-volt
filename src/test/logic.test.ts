import { describe, expect, it } from "vitest";
import { calculateWh, evaluateLookup } from "@/lib/logic";
import { REG } from "@/lib/registry";
const now = new Date(`${REG.edition}T00:00:00Z`);
describe("safety logic", () => {
  it("20000 mAh at 3.7V is 74 Wh", () => expect(calculateWh(20000, 3.7)).toBe(74));
  it("above 160 Wh is danger", () => expect(evaluateLookup({ whInput: "170", airlineId: "easyjet" }, REG, now).severity).toBe("danger"));
  it("more than 2 power banks is danger", () => expect(evaluateLookup({ quantity: 3, whInput: "50" }, REG, now).reasons.some((r: { code: string }) => r.code === "quantity-exceeds")).toBe(true));
  it("unknown model is never cleared", () => expect(evaluateLookup({ modelText: "ZZZ999", airlineId: "aegean", whInput: "50" }, REG, now).severity).not.toBe("info"));
});
