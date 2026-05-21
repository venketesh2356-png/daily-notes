import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client.js';
import type { Reminder } from '../types/index.js';

export const useDueReminders = () => {
  return useQuery({
    queryKey: ['reminders', 'due'],
    queryFn: async () => {
      const { data } = await client.get('/reminders/due');
      return data as Reminder[];
    },
  });
};

export const useCreateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: { noteId: number; remindAt: string; message?: string }) => {
      const { data } = await client.post('/reminders', request);
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useUpdateReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...request }: { id: number; remindAt?: string; message?: string }) => {
      const { data } = await client.patch(`/reminders/${id}`, request);
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useDeleteReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await client.delete(`/reminders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useAcknowledgeReminder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await client.post(`/reminders/${id}/acknowledge`);
      return data as Reminder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};
