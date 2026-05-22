import type { Note } from '../../types';
import { useUiStore } from '../../store/uiStore';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const { setEditingNoteId, setIsNoteModalOpen } = useUiStore();

  const handleEdit = () => {
    setEditingNoteId(note.id);
    setIsNoteModalOpen(true);
  };

  const preview = note.content.substring(0, 100).replace(/[#*_]/g, '') || 'No content';

  return (
    <div
      className="card cursor-pointer"
      onClick={handleEdit}
    >
      <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{preview}...</p>
      <div className="flex flex-wrap gap-1">
        {note.tags.map((nt) => (
          <span
            key={nt.tagId}
            className="text-xs px-2 py-1 rounded-full text-white"
            style={{ backgroundColor: nt.tag.color }}
          >
            {nt.tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
