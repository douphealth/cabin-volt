import audit from "@/data/evidence-audit.json";

export type EvidenceRecord = {
  id: string;
  checkedAt: string;
  status: "reviewed" | "needs-review" | "unavailable";
  httpStatus: number | null;
  excerpt?: string;
  applicability?: string;
  effectiveFrom?: string;
  note: string;
};

export const evidenceAudit = audit as { checkedAt: string; records: EvidenceRecord[] };
export const evidenceFor = (id: string) => evidenceAudit.records.find((record) => record.id === id);
export const evidenceLabel = (id: string) => {
  const record = evidenceFor(id);
  return record?.status === "reviewed" ? "Passage reviewed" : record?.status === "unavailable" ? "Retrieval unavailable · verify directly" : "Applicability review pending";
};