import { useState, useCallback } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  type Task,
  type TaskStatus,
} from "@/lib/kanban";

// Query options
const tasksQueryOptions = () =>
  queryOptions({
    queryKey: ["kanban", "tasks"],
    queryFn: () => getTasks(),
  });

export const Route = createFileRoute("/kanban")({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(tasksQueryOptions());
  },
  component: KanbanBoard,
});

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: "todo", title: "Todo", color: "bg-slate-500" },
  { status: "in_progress", title: "In Progress", color: "bg-blue-500" },
  { status: "done", title: "Done", color: "bg-green-500" },
];

function KanbanBoard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions());

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      await createTask({ data: { title: newTaskTitle.trim() } });
      setNewTaskTitle("");
      await queryClient.invalidateQueries({ queryKey: ["kanban", "tasks"] });
      await router.invalidate();
    } finally {
      setIsCreating(false);
    }
  }, [newTaskTitle, queryClient, router]);

  const handleStatusChange = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      await updateTaskStatus({ data: { id: taskId, status: newStatus } });
      await queryClient.invalidateQueries({ queryKey: ["kanban", "tasks"] });
      await router.invalidate();
    },
    [queryClient, router],
  );

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      await deleteTask({ data: taskId });
      await queryClient.invalidateQueries({ queryKey: ["kanban", "tasks"] });
      await router.invalidate();
    },
    [queryClient, router],
  );

  const getTasksByStatus = (status: TaskStatus) => tasks.filter((task) => task.status === status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Kanban Board</h1>

        {/* New Task Form */}
        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleCreateTask();
              }
            }}
            placeholder="New task title..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => void handleCreateTask()}
            disabled={isCreating || !newTaskTitle.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isCreating ? "Adding..." : "Add Task"}
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.status}
              title={column.title}
              color={column.color}
              tasks={getTasksByStatus(column.status)}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
              currentStatus={column.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  title: string;
  color: string;
  tasks: Task[];
  currentStatus: TaskStatus;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

function KanbanColumn({
  title,
  color,
  tasks,
  currentStatus,
  onStatusChange,
  onDelete,
}: KanbanColumnProps) {
  return (
    <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="ml-auto text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentStatus={currentStatus}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-white/40 text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  currentStatus: TaskStatus;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

function TaskCard({ task, currentStatus, onStatusChange, onDelete }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMove = async (direction: "left" | "right") => {
    setIsUpdating(true);
    const statusOrder: TaskStatus[] = ["todo", "in_progress", "done"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex =
      direction === "left"
        ? Math.max(0, currentIndex - 1)
        : Math.min(statusOrder.length - 1, currentIndex + 1);

    if (newIndex !== currentIndex) {
      await onStatusChange(task.id, statusOrder[newIndex]);
    }
    setIsUpdating(false);
  };

  const canMoveLeft = currentStatus !== "todo";
  const canMoveRight = currentStatus !== "done";

  return (
    <div className="bg-white/10 rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
      <h3 className="font-medium text-white mb-2">{task.title}</h3>
      {task.description && <p className="text-sm text-white/60 mb-3">{task.description}</p>}

      <div className="flex items-center gap-2">
        {canMoveLeft && (
          <button
            onClick={() => void handleMove("left")}
            disabled={isUpdating}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
            title="Move left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {canMoveRight && (
          <button
            onClick={() => void handleMove("right")}
            disabled={isUpdating}
            className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
            title="Move right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <button
          onClick={() => void onDelete(task.id)}
          className="ml-auto p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
