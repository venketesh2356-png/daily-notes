import { useNotesForToday } from '../api/notes';
import { useUiStore } from '../store/uiStore';
import NoteCard from '../components/notes/NoteCard';
import NoteModal from '../components/notes/NoteModal';
import { useState } from 'react';

export default function Dashboard() {
  const { data: notes = [], isLoading } = useNotesForToday();
  const { isNoteModalOpen, setIsNoteModalOpen } = useUiStore();
  const [newNoteDate] = useState(new Date().toISOString().split('T')[0]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Today's Notes</h2>
        <button
          onClick={() => setIsNoteModalOpen(true)}
          className="btn-primary"
        >
          + New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No notes yet for today</p>
          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="btn-primary"
          >
            Create Your First Note
          </button>
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
          date={newNoteDate}
          onClose={() => setIsNoteModalOpen(false)}
        />
      )}
    </div>
  );
}
