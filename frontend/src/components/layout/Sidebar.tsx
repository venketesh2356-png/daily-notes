import { Link } from 'react-router-dom';
import { useTags } from '../../api/tags';
import { useUiStore } from '../../store/uiStore';

export default function Sidebar() {
  const { data: tags } = useTags();
  const { activeTagId, setActiveTagId } = useUiStore();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Navigation</h2>
        <nav className="space-y-2">
          <Link
            to="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            📅 Today
          </Link>
          <Link
            to="/all"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            📝 All Notes
          </Link>
          <Link
            to="/calendar"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            📆 Calendar
          </Link>
        </nav>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
          Tags
        </h3>
        <div className="space-y-1">
          {tags?.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTagId(activeTagId === tag.id ? null : tag.id)}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                activeTagId === tag.id
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              style={activeTagId === tag.id ? { backgroundColor: tag.color + '20' } : undefined}
            >
              {tag.name}
              <span className="float-right text-xs text-gray-500">
                {tag.noteCount || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
