export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type TRole = "contributor" | "maintainer";
export type TIssueType = "bug" | "feature_request";
export type TIssueStatus = "open" | "in_progress" | "resolved";
