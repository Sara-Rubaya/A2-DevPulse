import type { TIssueStatus, TIssueType } from "../../types";


export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: TIssueType;
}

export interface IUpdateIssuePayload {
  title?: string;
  description?: string;
  type?: TIssueType;
}

export interface IIssueRow {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IIssueWithReporter {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter: {
    id: number;
    name: string;
    role: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface IIssueQueryParams {
  sort?: "newest" | "oldest";
  type?: TIssueType;
  status?: TIssueStatus;
}
