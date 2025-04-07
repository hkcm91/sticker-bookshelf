import { useState, useRef, useEffect } from 'react';
import { useBookshelfStore } from '../store/bookshelfStore';
import { useDragAndDrop } from './useDragAndDrop';
import { useFileHandler } from './useFileHandler';
import { useTransformControls } from './useTransformControls';
import { BookData } from '../store/bookshelfStore';

type UseBookSlotProps = {
  position: number;
  slotType: "book" | "sticker";
};

export const useBookSlot = ({ position, slotType }: UseBookSlotProps) => {
  const { activeShelfId, getBookByPosition, deleteBook } = useBookshelfStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isAltDrag, setIsAltDrag] = useState(false);
  
  // Get book from store by position, explicitly passing the activeShelfId
  const book = getBookByPosition(position, activeShelfId);
  
  // Log for debugging
  console.log(`Slot ${position}: Book present: ${!!book}`, book ? `ID: ${book.id}` : '');
  if (book) {
    console.log(`Book cover: ${book.coverURL ? 'Present' : 'Missing'}`);
  }
  
  // For stickers, keep track of 2D position, scale, rotation
  const [position2D, setPosition2D] = useState({ x: 0, y: 0 });
  const { scale, rotation, handleScaleChange, handleRotate, handleResetTransform } = useTransformControls();
  
  // Handle file input for empty slots
  const { fileInputRef, handleFileChange, handleClick } = useFileHandler({ position, slotType });
  
  // For drag and drop functionality
  const { 
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleDragOver,
    handleDrop,
    isDragging,
    setIsDragging,
  } = useDragAndDrop({
    position,
    setPosition2D,
    book: book as BookData,
    slotType
  });
  
  // Alt key detection for special drag operations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltDrag(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Handler for deleting a sticker
  const handleDeleteSticker = () => {
    if (book) {
      deleteBook(book.id);
      setShowDeleteDialog(false);
    }
  };
  
  return {
    book,
    fileInputRef,
    scale,
    position2D,
    rotation,
    showDeleteDialog,
    setShowDeleteDialog,
    handleFileChange,
    handleClick,
    handleDragOver,
    handleDrop,
    handleStickerMouseDown,
    handleStickerMouseMove,
    handleStickerMouseUp,
    handleRotate,
    handleScaleChange,
    handleResetTransform,
    handleDeleteSticker,
    isAltDrag
  };
};
