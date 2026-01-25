import { useState, useCallback, useEffect } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { getNote, updateNote, deleteNote } from "@/lib/notes";

// Query options
const noteQueryOptions = (noteId: string) =>
  queryOptions({
    queryKey: ["notes", noteId],
    queryFn: () => getNote({ data: noteId }),
  });

export const Route = createFileRoute("/notes/$noteId")({
  loader: ({ context, params }) => {
    return context.queryClient.ensureQueryData(noteQueryOptions(params.noteId));
  },
  component: NoteDetailPage,
});

function NoteDetailPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { noteId } = Route.useParams();
  const { data: note } = useSuspenseQuery(noteQueryOptions(noteId));

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagsInput, setTagsInput] = useState(note.tags.join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const currentTags = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const changed =
      title !== note.title ||
      content !== note.content ||
      JSON.stringify(currentTags) !== JSON.stringify(note.tags);
    setHasChanges(changed);
  }, [title, content, tagsInput, note]);

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
      await updateNote({
        data: {
          id: noteId,
          title,
          content,
          tags,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  }, [noteId, title, content, tagsInput, hasChanges, queryClient]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    await deleteNote({ data: noteId });
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    await router.navigate({ to: "/notes" });
  }, [noteId, queryClient, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/notes"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Notes
          </Link>
          <div className="flex items-center gap-3">
            {hasChanges && <span className="text-sm text-yellow-400/70">Unsaved changes</span>}
            <button
              onClick={() => void handleSave()}
              disabled={isSaving || !hasChanges}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => void handleDelete()}
              className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Note Editor */}
        <div className="space-y-6">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-3xl font-bold bg-transparent border-none text-white placeholder-white/30 focus:outline-none"
          />

          {/* Tags */}
          <div>
            <label className="block text-sm text-white/50 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="work, ideas, todo..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-white/50 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={15}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Metadata */}
          <div className="text-sm text-white/40 space-y-1">
            <p>Created: {new Date(note.createdAt).toLocaleString("ja-JP")}</p>
            <p>Updated: {new Date(note.updatedAt).toLocaleString("ja-JP")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
