import { useState, useCallback, useMemo } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { getNotes, createNote, deleteNote, type Note } from "@/lib/notes";

// Query options
const notesQueryOptions = () =>
  queryOptions({
    queryKey: ["notes"],
    queryFn: () => getNotes(),
  });

export const Route = createFileRoute("/notes/")({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(notesQueryOptions());
  },
  component: NotesPage,
});

function NotesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: notes } = useSuspenseQuery(notesQueryOptions());

  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateNote = useCallback(async () => {
    if (!newNoteTitle.trim()) return;

    setIsCreating(true);
    try {
      const note = await createNote({ data: { title: newNoteTitle.trim() } });
      setNewNoteTitle("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await router.navigate({ to: "/notes/$noteId", params: { noteId: note.id } });
    } finally {
      setIsCreating(false);
    }
  }, [newNoteTitle, queryClient, router]);

  const handleDeleteNote = useCallback(
    async (noteId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await deleteNote({ data: noteId });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      await router.invalidate();
    },
    [queryClient, router],
  );

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [notes, searchQuery]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Notes</h1>

        {/* New Note Form */}
        <div className="mb-6 flex gap-3">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleCreateNote();
              }
            }}
            placeholder="New note title..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => void handleCreateNote()}
            disabled={isCreating || !newNoteTitle.trim()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isCreating ? "Creating..." : "New Note"}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 text-white/70 rounded-full transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
          ))}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-white/40">
              {searchQuery ? "No notes match your search" : "No notes yet. Create one!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string, e: React.MouseEvent) => Promise<void>;
}

function NoteCard({ note, onDelete }: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      to="/notes/$noteId"
      params={{ noteId: note.id }}
      className="block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-1 truncate">{note.title}</h3>
          {note.content && (
            <p className="text-white/60 text-sm line-clamp-2 mb-2">{note.content}</p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">{formattedDate}</span>
            {note.tags.length > 0 && (
              <div className="flex gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-green-400/70">
                    #{tag}
                  </span>
                ))}
                {note.tags.length > 3 && (
                  <span className="text-xs text-white/40">+{note.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={(e) => void onDelete(note.id, e)}
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
    </Link>
  );
}
