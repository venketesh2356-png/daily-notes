import prisma from "../db.js";
export const getNotes = async (req, res) => {
    const { search, tagId, date, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let whereClause = { userId: req.userId };
    if (date) {
        const dateObj = new Date(date);
        const nextDate = new Date(dateObj);
        nextDate.setDate(nextDate.getDate() + 1);
        whereClause.noteDate = {
            gte: dateObj,
            lt: nextDate,
        };
    }
    if (tagId) {
        whereClause.tags = {
            some: {
                tagId: parseInt(tagId),
            },
        };
    }
    if (search) {
        const query = search;
        const notes = await prisma.$queryRaw `
      SELECT * FROM "Note"
      WHERE search_vector @@ plainto_tsquery('english', ${query})
      ${tagId ? `AND "Note".id IN (
        SELECT "noteId" FROM "NoteTag" WHERE "tagId" = ${parseInt(tagId)}
      )` : ""}
      ORDER BY "createdAt" DESC
      LIMIT ${parseInt(limit)}
      OFFSET ${skip}
    `;
        return res.json(notes);
    }
    const notes = await prisma.note.findMany({
        where: whereClause,
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            reminders: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
    });
    res.json(notes);
};
export const getNotesForToday = async (req, res) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const notes = await prisma.note.findMany({
        where: {
            userId: req.userId,
            noteDate: {
                gte: today,
                lt: tomorrow,
            },
        },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            reminders: true,
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(notes);
};
export const getNoteById = async (req, res) => {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
        where: { id: parseInt(id) },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            reminders: true,
        },
    });
    if (!note || note.userId !== req.userId) {
        return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
};
export const createNote = async (req, res) => {
    const { title, content = "", noteDate, tagIds = [] } = req.body;
    const note = await prisma.note.create({
        data: {
            title,
            content,
            noteDate: noteDate ? new Date(noteDate) : new Date(),
            userId: req.userId,
            tags: {
                create: tagIds.map((tagId) => ({
                    tagId,
                })),
            },
        },
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            reminders: true,
        },
    });
    res.status(201).json(note);
};
export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, noteDate, tagIds } = req.body;
    // Check ownership
    const existingNote = await prisma.note.findUnique({
        where: { id: parseInt(id) },
    });
    if (!existingNote || existingNote.userId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (content !== undefined)
        updateData.content = content;
    if (noteDate !== undefined)
        updateData.noteDate = new Date(noteDate);
    if (tagIds !== undefined) {
        updateData.tags = {
            deleteMany: {},
            create: tagIds.map((tagId) => ({
                tagId,
            })),
        };
    }
    const note = await prisma.note.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
            tags: {
                include: {
                    tag: true,
                },
            },
            reminders: true,
        },
    });
    res.json(note);
};
export const deleteNote = async (req, res) => {
    const { id } = req.params;
    // Check ownership
    const note = await prisma.note.findUnique({
        where: { id: parseInt(id) },
    });
    if (!note || note.userId !== req.userId) {
        return res.status(403).json({ error: "Unauthorized" });
    }
    await prisma.note.delete({
        where: { id: parseInt(id) },
    });
    res.status(204).send();
};
