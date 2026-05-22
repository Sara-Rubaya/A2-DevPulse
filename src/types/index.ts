export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
  user : "user",
} as const;

export type TRole = 'contributor' | 'maintainer' | 'user';
export type TIssueType = "bug" | "feature_request";
export type TIssueStatus = "open" | "in_progress" | "resolved";
