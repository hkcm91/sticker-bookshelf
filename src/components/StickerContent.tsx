
import React, { forwardRef, useRef, useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { useBookshelfStore } from '../store/bookshelfStore';

type StickerContentProps = {
  book: any;
  scale: number;
  position2D: { x: number, y: number };
  rotation: number;
  handleStickerMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
};

// Using forwardRef to properly handle refs from PopoverTrigger
const StickerContent = forwardRef<HTMLDivElement, StickerContentProps>(({
  book,
  scale,
  position2D,
  rotation,
  handleStickerMouseDown
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 150, height: 220 });
  const { updateBook } = useBookshelfStore();

  // Measure container on mount and resize
  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        const { width, height } = containerRef.current?.getBoundingClientRect() || { width: 150, height: 220 };
        setContainerSize({ width, height });
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  if (!book || !book.isSticker) return null;
  
  try {
    // Common style for all stickers
    const stickerStyle = {
      transform: `scale(${scale}) translate(${position2D.x / scale}px, ${position2D.y / scale}px) rotate(${rotation}deg)`,
      transformOrigin: 'center',
      width: '100%',
      height: '100%'
    };
    
    // Check if it's a Lottie JSON
    let isLottie = false;
    let animationData = null;
    
    if (typeof book.coverURL === 'string') {
      // Try to parse as JSON first to check if it's a Lottie animation
      try {
        if (book.coverURL.startsWith('{') || book.coverURL.trim().startsWith('{')) {
          animationData = JSON.parse(book.coverURL);
          isLottie = Boolean(animationData && (animationData.v !== undefined || animationData.animations));
        }
      } catch (e) {
        console.log("Not a valid JSON:", e);
        isLottie = false;
      }
    }
    
    return (
      <div 
        ref={(node) => {
          // Handle both refs
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          containerRef.current = node;
        }}
        className="w-full h-full cursor-move"
        onMouseDown={handleStickerMouseDown}
        style={isLottie ? stickerStyle : {
          backgroundImage: `url(${book.coverURL})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...stickerStyle
        }}
      >
        {isLottie && animationData && (
          <div className="w-full h-full flex items-center justify-center">
            <Lottie 
              animationData={animationData} 
              loop={true} 
              autoplay={true}
              style={{ 
                width: '100%', 
                height: '100%',
                pointerEvents: 'none' // Make Lottie ignore pointer events
              }}
            />
          </div>
        )}
      </div>
    );
  } catch (e) {
    // Fallback if there's an error
    console.error("Error rendering sticker:", e);
    return (
      <div ref={ref} className="flex items-center justify-center w-full h-full text-red-500">
        Invalid sticker
      </div>
    );
  }
});

StickerContent.displayName = 'StickerContent';

export default StickerContent;
