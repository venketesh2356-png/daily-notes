import { useState, useEffect } from 'react';
import { useCreateNote, useUpdateNote, useDeleteNote, useNote } from '../../api/notes';
import { useTags, useCreateTag } from '../../api/tags';
import { useCreateReminder } from '../../api/reminders';
import { useUiStore } from '../../store/uiStore';
import toast from 'react-hot-toast';

interface NoteModalProps {
  date: string;
  onClose: () => void;
}

export default function NoteModal({ date, onClose }: NoteModalProps) {
  const { editingNoteId, setEditingNoteId } = useUiStore();
  const { data: existingNote } = useNote(editingNoteId || 0);
  const { data: tags = [] } = useTags();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [remindAt, setRemindAt] = useState('');

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const createTag = useCreateTag();
  const createReminder = useCreateReminder();

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setSelectedTagIds(existingNote.tags.map((t) => t.tagId));
      if (existingNote.reminders.length > 0) {
        setRemindAt(existingNote.reminders[0].remindAt);
      }
    }
  }, [existingNote]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Note title is required');
      return;
    }

    try {
      if (editingNoteId) {
        await updateNote.mutateAsync({
          id: editingNoteId,
          title,
          content,
          noteDate: date,
          tagIds: selectedTagIds,
        });
        toast.success('Note updated');
      } else {
        await createNote.mutateAsync({
          title,
          content,
          noteDate: date,
          tagIds: selectedTagIds,
        });
        toast.success('Note created');
      }

      if (remindAt) {
        const noteId = editingNoteId || createNote.data?.id;
        if (noteId) {
          await createReminder.mutateAsync({
            noteId,
            remindAt,
          });
        }
      }

      onClose();
      setEditingNoteId(null);
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async () => {
    if (editingNoteId && window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote.mutateAsync(editingNoteId);
        toast.success('Note deleted');
        onClose();
        setEditingNoteId(null);
      } catch (error) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleAddTag = async () => {
    if (newTagName.trim()) {
      try {
        const newTag = await createTag.mutateAsync({ name: newTagName });
        setSelectedTagIds([...selectedTagIds, newTag.id]);
        setNewTagName('');
      } catch {
        toast.error('Failed to create tag');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {editingNoteId ? 'Edit Note' : 'New Note'}
            </h2>
            <button
              onClick={() => {
                onClose();
                setEditingNoteId(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-lg font-semibold"
            />

            <textarea
              placeholder="Note content (markdown supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input h-40"
            />

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTagIds.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return tag ? (
                    <span
                      key={tagId}
                      className="text-sm px-3 py-1 rounded-full text-white cursor-pointer"
                      style={{ backgroundColor: tag.color }}
                      onClick={() =>
                        setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId))
                      }
                    >
                      {tag.name} ✕
                    </span>
                  ) : null;
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="input flex-1"
                />
                <button
                  onClick={handleAddTag}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reminder</label>
              <input
                type="datetime-local"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
                className="input"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              {editingNoteId && (
                <button
                  onClick={handleDelete}
                  className="btn bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  setEditingNoteId(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
