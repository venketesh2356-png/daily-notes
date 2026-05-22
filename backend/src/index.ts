import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.js";
import tagsRouter from "./routes/tags.js";
import remindersRouter from "./routes/reminders.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import prisma from "./db.js";
import cron from "node-cron";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://deluxe-phoenix-85394d.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", notesRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/reminders", remindersRouter);

app.use(errorHandler);

const reminderJob = cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    await prisma.reminder.updateMany({
      where: {
        remindAt: {
          lt: oneWeekAgo,
        },
        fired: false,
      },
      data: {
        fired: true,
      },
    });
  } catch (err) {
    console.error("Cron job error:", err);
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  reminderJob.stop();
  server.close(() => {
    prisma.$disconnect();
    process.exit(0);
  });
});
