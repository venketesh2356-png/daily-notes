import { Router } from "express";
import {
  getTags,
  createTag,
  deleteTag,
} from "../controllers/tagsController.js";
import { validateBody, createTagSchema } from "../middleware/validate.js";

const router = Router();

router.get("/", getTags);
router.post("/", validateBody(createTagSchema), createTag);
router.delete("/:id", deleteTag);

export default router;
