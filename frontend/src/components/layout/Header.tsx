import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return "Today's Notes";
      case '/all':
        return 'All Notes';
      case '/calendar':
        return 'Calendar';
      default:
        return 'Daily Notes';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
    </header>
  );
}
