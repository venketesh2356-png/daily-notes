import { Request, Response } from "express";
import prisma from "../db.js";

export const getTags = async (req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const tagsWithCount = tags.map((tag) => ({
    ...tag,
    noteCount: tag._count.notes,
    _count: undefined,
  }));

  res.json(tagsWithCount);
};

export const createTag = async (req: Request, res: Response) => {
  const { name, color = "#6366f1" } = req.body;

  const tag = await prisma.tag.create({
    data: {
      name,
      color,
    },
  });

  res.status(201).json(tag);
};

export const deleteTag = async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.tag.delete({
    where: { id: parseInt(id) },
  });

  res.status(204).send();
};
