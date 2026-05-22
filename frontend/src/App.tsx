import { useState, useEffect } from 'react';
import Login from './pages/Login';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  noteDate: string;
  tags: any[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );
  const [page, setPage] = useState('today');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  if (!authToken) {
    return <Login onLogin={(token) => {
      setAuthToken(token);
      localStorage.setItem('authToken', token);
    }} />;
  }

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  });

  // Fetch notes on page change
  useEffect(() => {
    fetchNotes();
  }, [page]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/notes`;

      if (page === 'today') {
        url = `${API_URL}/notes/today`;
      }

      const response = await fetch(url, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert('Error loading notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) {
      alert('Please enter a note title');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newNoteTitle,
          content: newNoteContent,
          noteDate: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to create note');

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setShowNewNoteForm(false);
      alert('Note created successfully!');
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Error creating note');
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete note');

      setNotes(notes.filter((n) => n.id !== id));
      alert('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note');
    }
  };

  const handleUpdateNote = async (id: number) => {
    if (!editingNote) return;

    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: editingNote.title,
          content: editingNote.content,
        }),
      });

      if (!response.ok) throw new Error('Failed to update note');

      const updated = await response.json();
      setNotes(notes.map((n) => (n.id === id ? updated : n)));
      setEditingNote(null);
      alert('Note updated!');
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note');
    }
  };

  const getPageTitle = () => {
    switch (page) {
      case 'today':
        return "Today's Notes";
      case 'all':
        return 'All Notes';
      case 'calendar':
        return 'Calendar';
      default:
        return 'Daily Notes';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Daily Notes</h2>

          <nav className="space-y-2 mb-8">
            <button
              onClick={() => setPage('today')}
              className={`w-full text-left block px-4 py-2 rounded-lg transition-colors ${
                page === 'today'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📅 Today
            </button>
            <button
              onClick={() => setPage('all')}
              className={`w-full text-left block px-4 py-2 rounded-lg transition-colors ${
                page === 'all'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📝 All Notes
            </button>
            <button
              onClick={() => setPage('calendar')}
              className={`w-full text-left block px-4 py-2 rounded-lg transition-colors ${
                page === 'calendar'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              📆 Calendar
            </button>
          </nav>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Tags</h3>
            <p className="text-sm text-gray-500">{notes.length} notes</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                setAuthToken(null);
              }}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Logout
            </button>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            {(page === 'today' || page === 'all') && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{formatDate(new Date().toISOString())}</h2>
                  <button
                    onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                  >
                    + New Note
                  </button>
                </div>

                {showNewNoteForm && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Create New Note</h3>
                    <input
                      type="text"
                      placeholder="Note title..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <textarea
                      placeholder="Note content..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateNote}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => {
                          setShowNewNoteForm(false);
                          setNewNoteTitle('');
                          setNewNoteContent('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {loading ? (
                  <p className="text-gray-600">Loading notes...</p>
                ) : notes.length === 0 ? (
                  <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center">
                    <p className="text-gray-600">
                      No notes yet. Click "+ New Note" to create one!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{note.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {note.content.substring(0, 100)}
                          {note.content.length > 100 ? '...' : ''}
                        </p>
                        <div className="text-xs text-gray-500 mb-4">
                          Created: {formatDate(note.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingNote(note)}
                            className="flex-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="flex-1 text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {page === 'calendar' && (
              <div className="text-gray-600">
                <p className="text-lg">Calendar view coming soon...</p>
              </div>
            )}

            {editingNote && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                  <h3 className="text-xl font-bold mb-4">Edit Note</h3>
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <textarea
                    value={editingNote.content}
                    onChange={(e) =>
                      setEditingNote({ ...editingNote, content: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateNote(editingNote.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
