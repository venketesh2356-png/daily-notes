import { Router } from "express";
import {
  createReminder,
  updateReminder,
  deleteReminder,
  getDueReminders,
  acknowledgeReminder,
} from "../controllers/remindersController.js";
import { validateBody, createReminderSchema, updateReminderSchema } from "../middleware/validate.js";

const router = Router();

router.post("/", validateBody(createReminderSchema), createReminder);
router.patch("/:id", validateBody(updateReminderSchema), updateReminder);
router.delete("/:id", deleteReminder);
router.get("/due", getDueReminders);
router.post("/:id/acknowledge", acknowledgeReminder);

export default router;
