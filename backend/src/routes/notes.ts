import { Router } from "express";
import {
  getNotes,
  getNotesForToday,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import { validateBody, createNoteSchema, updateNoteSchema } from "../middleware/validate.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getNotes);
router.get("/today", getNotesForToday);
router.get("/:id", getNoteById);
router.post("/", validateBody(createNoteSchema), createNote);
router.patch("/:id", validateBody(updateNoteSchema), updateNote);
router.delete("/:id", deleteNote);

export default router;
