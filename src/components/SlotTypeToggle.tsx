
import React from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { BookOpen, Sticker } from 'lucide-react';

type SlotTypeToggleProps = {
  slotType: "book" | "sticker";
  handleTypeToggle: (value: string) => void;
  isVisible?: boolean;
};

const SlotTypeToggle: React.FC<SlotTypeToggleProps> = ({ 
  slotType, 
  handleTypeToggle,
  isVisible = true
}) => {
  const { slots } = useBookshelfStore();
  
  // If not visible, don't render anything
  if (!isVisible) return null;
  
  return (
    <div className="slot-toggle-container absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3">
      <button
        className="toggle-dot flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: slotType === 'book' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          border: slotType === 'book' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTypeToggle('book');
        }}
        aria-label="Switch to book mode"
      >
        <BookOpen size={12} className={slotType === 'book' ? 'text-white' : 'text-gray-300'} />
      </button>
      <button
        className="toggle-dot flex items-center justify-center w-5 h-5 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: slotType === 'sticker' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          border: slotType === 'sticker' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTypeToggle('sticker');
        }}
        aria-label="Switch to sticker mode"
      >
        <Sticker size={12} className={slotType === 'sticker' ? 'text-white' : 'text-gray-300'} />
      </button>
    </div>
  );
};

export default SlotTypeToggle;
