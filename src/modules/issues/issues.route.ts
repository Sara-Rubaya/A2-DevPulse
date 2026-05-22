import { Router } from "express";
import { issuesController } from "./issues.controller";
import { USER_ROLE } from "../../types";
import auth from "../../middleware/auth";

const router = Router();

// POST /api/issues
router.post(
  "/",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.createIssue
);

// GET /api/issues 
router.get("/", issuesController.getAllIssues);

// GET /api/issues/:id 
router.get("/:id", issuesController.getSingleIssue);

// PATCH /api/issues/:id — 
router.patch(
  "/:id",
  auth(USER_ROLE.contributor, USER_ROLE.maintainer),
  issuesController.updateIssue
);

// DELETE /api/issues/:id 
router.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issuesController.deleteIssue
);

export const issuesRoute = router;
