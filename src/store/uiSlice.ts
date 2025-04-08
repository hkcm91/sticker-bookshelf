
import { StateCreator } from 'zustand';
import { toast } from 'sonner';

export interface UISlice {
  isModalOpen: boolean;
  activeBookId: string | null;
  isSettingsOpen: boolean;
  draggedBookId: string | null;
  openModal: (bookId: string | null) => void;
  closeModal: () => void;
  toggleSettings: () => void;
  closeSettings: () => void;
  setDraggedBook: (bookId: string | null) => void;
  getDraggedBook: () => any | null;
}

export const createUISlice: StateCreator<
  UISlice & { books: Record<string, any> },
  [],
  [],
  UISlice
> = (set, get) => ({
  isModalOpen: false,
  activeBookId: null,
  isSettingsOpen: false,
  draggedBookId: null,
  
  openModal: (bookId) => {
    console.log("[UISlice] Opening book modal with ID:", bookId);
    set({ isModalOpen: true, activeBookId: bookId });
  },
  
  closeModal: () => {
    console.log("[UISlice] Closing book modal");
    set({ isModalOpen: false });
  },
  
  toggleSettings: () => {
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen }));
  },
  
  closeSettings: () => {
    set({ isSettingsOpen: false });
  },
  
  setDraggedBook: (bookId) => {
    console.log("[UISlice] Setting dragged book:", bookId);
    set({ draggedBookId: bookId });
  },
  
  getDraggedBook: () => {
    const { draggedBookId, books } = get();
    if (!draggedBookId) return null;
    return books[draggedBookId] || null;
  }
});
