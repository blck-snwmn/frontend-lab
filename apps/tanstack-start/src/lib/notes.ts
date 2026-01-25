import fs from "node:fs";
import { createServerFn } from "@tanstack/react-start";

// Types
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesData {
  notes: Note[];
}

// File path for persistence
const DATA_FILE = "notes-data.json";

// Helper functions
async function readData(): Promise<NotesData> {
  try {
    const content = await fs.promises.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { notes: [] };
  }
}

async function writeData(data: NotesData): Promise<void> {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Server Functions
export const getNotes = createServerFn({
  method: "GET",
}).handler(async () => {
  const data = await readData();
  return data.notes;
});

export const getNote = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const notesData = await readData();
    const note = notesData.notes.find((n) => n.id === id);
    if (!note) {
      throw new Error("Note not found");
    }
    return note;
  });

interface CreateNoteInput {
  title: string;
  content?: string;
  tags?: string[];
}

export const createNote = createServerFn({ method: "POST" })
  .inputValidator((data: CreateNoteInput) => data)
  .handler(async ({ data: input }) => {
    const notesData = await readData();
    const now = new Date().toISOString();

    const newNote: Note = {
      id: generateId(),
      title: input.title,
      content: input.content ?? "",
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
    };

    notesData.notes.unshift(newNote);
    await writeData(notesData);
    return newNote;
  });

interface UpdateNoteInput {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
}

export const updateNote = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateNoteInput) => data)
  .handler(async ({ data: input }) => {
    const notesData = await readData();
    const noteIndex = notesData.notes.findIndex((n) => n.id === input.id);

    if (noteIndex === -1) {
      throw new Error("Note not found");
    }

    if (input.title !== undefined) {
      notesData.notes[noteIndex].title = input.title;
    }
    if (input.content !== undefined) {
      notesData.notes[noteIndex].content = input.content;
    }
    if (input.tags !== undefined) {
      notesData.notes[noteIndex].tags = input.tags;
    }
    notesData.notes[noteIndex].updatedAt = new Date().toISOString();

    await writeData(notesData);
    return notesData.notes[noteIndex];
  });

export const deleteNote = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const notesData = await readData();
    notesData.notes = notesData.notes.filter((n) => n.id !== id);
    await writeData(notesData);
    return { success: true };
  });
