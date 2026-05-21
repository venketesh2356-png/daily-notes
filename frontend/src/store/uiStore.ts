import { create } from 'zustand';

interface UiState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTagId: number | null;
  setActiveTagId: (tagId: number | null) => void;
  isNoteModalOpen: boolean;
  setIsNoteModalOpen: (open: boolean) => void;
  editingNoteId: number | null;
  setEditingNoteId: (id: number | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeTagId: null,
  setActiveTagId: (tagId) => set({ activeTagId: tagId }),
  isNoteModalOpen: false,
  setIsNoteModalOpen: (open) => set({ isNoteModalOpen: open }),
  editingNoteId: null,
  setEditingNoteId: (id) => set({ editingNoteId: id }),
}));
