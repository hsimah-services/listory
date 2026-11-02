export type ChecklistStatus = "all" | "active" | "completed";

// Helpers for the URL `status` field. Absent (or any unknown value) means every checklist.
export const CHECKLIST_STATUS = {
  options: ["all", "active", "completed"] as const satisfies readonly ChecklistStatus[],
  fromParam(status: string | undefined): ChecklistStatus {
    if (status === "active" || status === "completed") return status;
    return "all";
  },
  // Maps the URL `status` field to the `completed` filter of listoryChecklistSearch.
  completedFilter(status: string | undefined): boolean | null {
    if (status === "active") return false;
    if (status === "completed") return true;
    return null;
  },
};
