import { useEffect } from 'react';
import { useDueReminders, useAcknowledgeReminder } from '../api/reminders';
import { useNotifications } from './useNotifications';

export const useReminderPoller = () => {
  const { data: reminders, refetch } = useDueReminders();
  const { notify } = useNotifications();
  const acknowledgeReminder = useAcknowledgeReminder();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (reminders && reminders.length > 0) {
      reminders.forEach((reminder) => {
        notify(
          `Reminder for "${reminder.note.title}"`,
          reminder.message || 'Time to review your note!'
        );
        acknowledgeReminder.mutate(reminder.id);
      });
    }
  }, [reminders, notify, acknowledgeReminder]);
};
