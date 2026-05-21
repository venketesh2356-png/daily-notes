import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client.js';
import type { Note, CreateNoteRequest, UpdateNoteRequest } from '../types/index.js';

export const useNotes = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const { data } = await client.get('/notes', { params });
      return data as Note[];
    },
  });
};

export const useNotesForToday = () => {
  return useQuery({
    queryKey: ['notes', 'today'],
    queryFn: async () => {
      const { data } = await client.get('/notes/today');
      return data as Note[];
    },
  });
};

export const useNote = (id: number) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data } = await client.get(`/notes/${id}`);
      return data as Note;
    },
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateNoteRequest) => {
      const { data } = await client.post('/notes', request);
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...request }: UpdateNoteRequest & { id: number }) => {
      const { data } = await client.patch(`/notes/${id}`, request);
      return data as Note;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['notes', variables.id] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await client.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
