import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Types
export type BookData = {
  id: string;
  title: string;
  author: string;
  coverURL: string;
  series?: string;
  progress: number;
  rating: number;
  position: number;
  shelfId: string;
  characters?: string;
  plot?: string;
  notes?: string;
  quizzes?: {question: string, answer: string}[];
  isSticker?: boolean;
};

export type ShelfData = {
  id: string;
  name: string;
  rows: number;
  columns: number;
};

type BookshelfState = {
  books: Record<string, BookData>;
  shelves: Record<string, ShelfData>;
  activeShelfId: string;
  isModalOpen: boolean;
  activeBookId: string | null;
  draggedBook: string | null;
  zoomLevel: number;
  addBook: (bookData: Omit<BookData, 'id'>) => string;
  updateBook: (id: string, data: Partial<Omit<BookData, 'id'>>) => void;
  deleteBook: (id: string) => void;
  addShelf: (shelfData: Omit<ShelfData, 'id'>) => string;
  updateShelf: (id: string, data: Partial<Omit<ShelfData, 'id'>>) => void;
  deleteShelf: (id: string) => void;
  setActiveShelf: (id: string) => void;
  switchShelf: (id: string) => void;
  openModal: (bookId: string) => void;
  closeModal: () => void;
  setDraggedBook: (bookId: string | null) => void;
  getDraggedBook: () => BookData | null;
  addRow: () => void;
  removeRow: () => void;
  addColumn: () => void;
  removeColumn: () => void;
  setZoom: (level: number) => void;
  findEmptyPosition: (shelfId: string) => number;
};

// Load saved data from localStorage
const loadInitialState = () => {
  try {
    const savedBooks = localStorage.getItem('ritual-bookshelf-books');
    const savedShelves = localStorage.getItem('ritual-bookshelf-shelves');
    const savedActiveShelf = localStorage.getItem('ritual-bookshelf-active-shelf');
    
    return {
      books: savedBooks ? JSON.parse(savedBooks) : {},
      shelves: savedShelves ? JSON.parse(savedShelves) : {},
      activeShelfId: savedActiveShelf || '',
    };
  } catch (error) {
    console.error('Error loading saved state', error);
    return {
      books: {},
      shelves: {},
      activeShelfId: '',
    };
  }
};

const initialState = loadInitialState();

// Store
export const useBookshelfStore = create<BookshelfState>((set, get) => ({
  books: initialState.books,
  shelves: initialState.shelves,
  activeShelfId: initialState.activeShelfId,
  isModalOpen: false,
  activeBookId: null,
  draggedBook: null,
  zoomLevel: 1,
  
  // Find empty position
  findEmptyPosition: (shelfId: string) => {
    const { books, shelves } = get();
    const shelf = shelves[shelfId];
    if (!shelf) return -1;
    
    const maxPositions = shelf.rows * shelf.columns;
    const occupiedPositions = new Set(
      Object.values(books)
        .filter(book => book.shelfId === shelfId)
        .map(book => book.position)
    );
    
    // Find the first available position
    for (let i = 0; i < maxPositions; i++) {
      if (!occupiedPositions.has(i)) {
        return i;
      }
    }
    
    return -1; // No positions available
  },
  
  // Book operations
  addBook: (bookData) => {
    const id = uuidv4();
    const { findEmptyPosition } = get();
    
    // If position is -1, find an empty slot
    const position = bookData.position === -1 ? 
      findEmptyPosition(bookData.shelfId) : 
      bookData.position;
    
    if (position === -1) {
      // No empty slots found
      toast.error("No empty slots on this shelf!");
      return "";
    }
    
    set((state) => {
      const updatedBooks = {
        ...state.books,
        [id]: { ...bookData, id, position }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return { books: updatedBooks };
    });
    return id;
  },
  
  updateBook: (id, data) => {
    set((state) => {
      const updatedBooks = {
        ...state.books,
        [id]: { ...state.books[id], ...data }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return { books: updatedBooks };
    });
  },
  
  deleteBook: (id) => {
    set((state) => {
      const { [id]: removed, ...remaining } = state.books;
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(remaining));
      
      return { books: remaining };
    });
  },
  
  // Shelf operations
  addShelf: (shelfData) => {
    const id = uuidv4();
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [id]: { ...shelfData, id }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-active-shelf', id);
      
      return {
        shelves: updatedShelves,
        activeShelfId: id
      };
    });
    return id;
  },
  
  updateShelf: (id, data) => {
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [id]: { ...state.shelves[id], ...data }
      };
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
  },
  
  deleteShelf: (id) => {
    set((state) => {
      if (Object.keys(state.shelves).length <= 1) return state;
      
      const { [id]: removed, ...remainingShelves } = state.shelves;
      
      // Delete books on this shelf
      const updatedBooks = { ...state.books };
      Object.keys(updatedBooks).forEach(bookId => {
        if (updatedBooks[bookId].shelfId === id) {
          delete updatedBooks[bookId];
        }
      });
      
      // Set new active shelf
      const newActiveId = Object.keys(remainingShelves)[0];
      
      // Save to localStorage
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(remainingShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      localStorage.setItem('ritual-bookshelf-active-shelf', newActiveId);
      
      return { 
        shelves: remainingShelves,
        books: updatedBooks,
        activeShelfId: newActiveId
      };
    });
  },
  
  setActiveShelf: (id) => {
    set({ activeShelfId: id });
    localStorage.setItem('ritual-bookshelf-active-shelf', id);
  },
  
  // Added the switchShelf method that was missing
  switchShelf: (id) => {
    set({ activeShelfId: id });
    localStorage.setItem('ritual-bookshelf-active-shelf', id);
  },
  
  // UI operations
  openModal: (bookId) => {
    set({ isModalOpen: true, activeBookId: bookId });
  },
  
  closeModal: () => {
    set({ isModalOpen: false, activeBookId: null });
  },
  
  // Drag and drop
  setDraggedBook: (bookId) => {
    set({ draggedBook: bookId });
  },
  
  getDraggedBook: () => {
    const { draggedBook, books } = get();
    return draggedBook ? books[draggedBook] : null;
  },
  
  // Grid operations
  addRow: () => {
    const { activeShelfId, shelves } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          rows: shelf.rows + 1
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      
      return { shelves: updatedShelves };
    });
  },
  
  removeRow: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    if (shelf.rows <= 1) return;
    
    // Calculate which positions will be removed
    const lastRowPositions = [];
    for (let i = 0; i < shelf.columns; i++) {
      lastRowPositions.push((shelf.rows - 1) * shelf.columns + i);
    }
    
    // Check and remove books in the last row
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId && lastRowPositions.includes(book.position)) {
        delete updatedBooks[bookId];
      }
    });
    
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          rows: shelf.rows - 1
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  addColumn: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    const newColumns = shelf.columns + 1;
    
    // Adjust book positions for the new column layout
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId) {
        const currentRow = Math.floor(book.position / shelf.columns);
        const currentCol = book.position % shelf.columns;
        const newPosition = currentRow * newColumns + currentCol;
        updatedBooks[bookId] = { ...book, position: newPosition };
      }
    });
    
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          columns: newColumns
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  removeColumn: () => {
    const { activeShelfId, shelves, books } = get();
    if (!activeShelfId) return;
    
    const shelf = shelves[activeShelfId];
    if (shelf.columns <= 1) return;
    
    const newColumns = shelf.columns - 1;
    
    // Find books in the last column of each row
    const lastColumnPositions = [];
    for (let row = 0; row < shelf.rows; row++) {
      lastColumnPositions.push(row * shelf.columns + (shelf.columns - 1));
    }
    
    // Remove books in the last column and adjust positions for remaining
    const updatedBooks = { ...books };
    Object.keys(updatedBooks).forEach(bookId => {
      const book = updatedBooks[bookId];
      if (book.shelfId === activeShelfId) {
        if (lastColumnPositions.includes(book.position)) {
          delete updatedBooks[bookId];
        } else {
          const currentRow = Math.floor(book.position / shelf.columns);
          const currentCol = book.position % shelf.columns;
          const newPosition = currentRow * newColumns + currentCol;
          updatedBooks[bookId] = { ...book, position: newPosition };
        }
      }
    });
    
    set((state) => {
      const updatedShelves = {
        ...state.shelves,
        [activeShelfId]: {
          ...shelf,
          columns: newColumns
        }
      };
      
      localStorage.setItem('ritual-bookshelf-shelves', JSON.stringify(updatedShelves));
      localStorage.setItem('ritual-bookshelf-books', JSON.stringify(updatedBooks));
      
      return {
        shelves: updatedShelves,
        books: updatedBooks
      };
    });
  },
  
  setZoom: (level) => {
    set({ zoomLevel: level });
  }
}));

// Helper to initialize a default shelf if none exists
export const initializeDefaultShelf = () => {
  const { shelves, addShelf } = useBookshelfStore.getState();
  
  if (Object.keys(shelves).length === 0) {
    const defaultShelfId = addShelf({
      name: 'My First Shelf',
      rows: 2,
      columns: 4
    });
    return defaultShelfId;
  }
  
  return null;
};
