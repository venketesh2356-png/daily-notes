import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { useNotes } from '../api/notes';
import { useUiStore } from '../store/uiStore';
import NoteModal from '../components/notes/NoteModal';
import { useState } from 'react';

export default function CalendarPage() {
  const { data: notes = [] } = useNotes();
  const { setEditingNoteId, setIsNoteModalOpen } = useUiStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const events = notes.map((note) => ({
    id: note.id.toString(),
    title: note.title,
    date: new Date(note.noteDate).toISOString().split('T')[0],
  }));

  const handleEventClick = (info: any) => {
    setEditingNoteId(parseInt(info.event.id));
    setIsNoteModalOpen(true);
  };

  const handleDateSelect = (info: any) => {
    setSelectedDate(info.dateStr);
    setEditingNoteId(null);
    setIsNoteModalOpen(true);
  };

  return (
    <div className="p-6 h-full">
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listMonth',
        }}
        height="auto"
      />

      {selectedDate && (
        <NoteModal
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}
