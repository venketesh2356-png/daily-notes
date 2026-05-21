import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Validation failed" });
    }
  };
};

export const createNoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional().default(""),
  noteDate: z.coerce.date().optional(),
  tagIds: z.array(z.number()).optional().default([]),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  noteDate: z.coerce.date().optional(),
  tagIds: z.array(z.number()).optional(),
});

export const createTagSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#6366f1"),
});

export const createReminderSchema = z.object({
  noteId: z.number().int(),
  remindAt: z.coerce.date(),
  message: z.string().optional().default(""),
});

export const updateReminderSchema = z.object({
  remindAt: z.coerce.date().optional(),
  message: z.string().optional(),
});
