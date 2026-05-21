import { Request, Response } from "express";
import prisma from "../db.js";

export const createReminder = async (req: Request, res: Response) => {
  const { noteId, remindAt, message = "" } = req.body;

  const reminder = await prisma.reminder.create({
    data: {
      noteId,
      remindAt: new Date(remindAt),
      message,
    },
  });

  res.status(201).json(reminder);
};

export const updateReminder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { remindAt, message } = req.body;

  const updateData: any = {};
  if (remindAt !== undefined) updateData.remindAt = new Date(remindAt);
  if (message !== undefined) updateData.message = message;

  const reminder = await prisma.reminder.update({
    where: { id: parseInt(id) },
    data: updateData,
  });

  res.json(reminder);
};

export const deleteReminder = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.reminder.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
};

export const getDueReminders = async (req: Request, res: Response) => {
  const now = new Date();

  const reminders = await prisma.reminder.findMany({
    where: {
      remindAt: {
        lte: now,
      },
      fired: false,
    },
    include: {
      note: true,
    },
  });

  res.json(reminders);
};

export const acknowledgeReminder = async (req: Request, res: Response) => {
  const { id } = req.params;

  const reminder = await prisma.reminder.update({
    where: { id: parseInt(id) },
    data: {
      fired: true,
    },
  });

  res.json(reminder);
};
