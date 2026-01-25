import fs from "node:fs";
import { createServerFn } from "@tanstack/react-start";

// Types
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

interface KanbanData {
  tasks: Task[];
}

// File path for persistence
const DATA_FILE = "kanban-data.json";

// Helper functions
async function readData(): Promise<KanbanData> {
  try {
    const content = await fs.promises.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { tasks: [] };
  }
}

async function writeData(data: KanbanData): Promise<void> {
  await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Server Functions
export const getTasks = createServerFn({
  method: "GET",
}).handler(async () => {
  const data = await readData();
  return data.tasks;
});

interface CreateTaskInput {
  title: string;
  description?: string;
}

export const createTask = createServerFn({ method: "POST" })
  .inputValidator((data: CreateTaskInput) => data)
  .handler(async ({ data: input }) => {
    const kanbanData = await readData();
    const now = new Date().toISOString();

    const newTask: Task = {
      id: generateId(),
      title: input.title,
      description: input.description ?? "",
      status: "todo",
      createdAt: now,
      updatedAt: now,
    };

    kanbanData.tasks.push(newTask);
    await writeData(kanbanData);
    return newTask;
  });

interface UpdateStatusInput {
  id: string;
  status: TaskStatus;
}

export const updateTaskStatus = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateStatusInput) => data)
  .handler(async ({ data: input }) => {
    const kanbanData = await readData();
    const taskIndex = kanbanData.tasks.findIndex((t) => t.id === input.id);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    kanbanData.tasks[taskIndex].status = input.status;
    kanbanData.tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeData(kanbanData);
    return kanbanData.tasks[taskIndex];
  });

interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
}

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateTaskInput) => data)
  .handler(async ({ data: input }) => {
    const kanbanData = await readData();
    const taskIndex = kanbanData.tasks.findIndex((t) => t.id === input.id);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    if (input.title !== undefined) {
      kanbanData.tasks[taskIndex].title = input.title;
    }
    if (input.description !== undefined) {
      kanbanData.tasks[taskIndex].description = input.description;
    }
    kanbanData.tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeData(kanbanData);
    return kanbanData.tasks[taskIndex];
  });

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: id }) => {
    const kanbanData = await readData();
    kanbanData.tasks = kanbanData.tasks.filter((t) => t.id !== id);
    await writeData(kanbanData);
    return { success: true };
  });
