import { useState } from 'react';
import { useNotes } from '../api/notes';
import { useUiStore } from '../store/uiStore';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';

export default function AllNotes() {
  const { searchQuery, setSearchQuery, activeTagId, isNoteModalOpen, setIsNoteModalOpen } = useUiStore();
  const [page, setPage] = useState(1);

  const params: Record<string, any> = { page, limit: 20 };
  if (searchQuery) params.search = searchQuery;
  if (activeTagId) params.tagId = activeTagId;

  const { data: notes = [], isLoading } = useNotes(params);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="input flex-1"
        />
        <button
          onClick={() => setIsNoteModalOpen(true)}
          className="btn-primary"
        >
          + New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No notes found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {isNoteModalOpen && (
        <NoteModal
          date={new Date().toISOString().split('T')[0]}
          onClose={() => setIsNoteModalOpen(false)}
        />
      )}
    </div>
  );
}
