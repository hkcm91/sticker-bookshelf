
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseDropTargetProps {
  onDrop?: (id: string, data: any) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
}

const useDropTarget = ({ 
  onDrop,
  onDragOver,
  onDragLeave,
  onDragEnter
}: UseDropTargetProps = {}) => {
  // Handle drag over events for drop targets
  const handleDragOver = useCallback((e: React.DragEvent) => {
    // Always prevent default to enable drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Add visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
    
    // Call custom handler if provided
    if (onDragOver) {
      onDragOver(e);
    }
  }, [onDragOver]);
  
  // Handle drag enter events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Add visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add('drag-over');
    }
    
    // Call custom handler if provided
    if (onDragEnter) {
      onDragEnter(e);
    }
  }, [onDragEnter]);
  
  // Handle drag leave events to remove visual indicators
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Remove visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    // Call custom handler if provided
    if (onDragLeave) {
      onDragLeave(e);
    }
  }, [onDragLeave]);
  
  // Generic drop handler
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual indicator class
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove('drag-over');
    }
    
    try {
      const droppedItemId = e.dataTransfer.getData('text/plain');
      
      if (droppedItemId && onDrop) {
        // Try to get JSON data if available
        let jsonData = null;
        try {
          const jsonStr = e.dataTransfer.getData('application/json');
          if (jsonStr) {
            jsonData = JSON.parse(jsonStr);
          }
        } catch (err) {
          console.error("Failed to parse JSON data:", err);
        }
        
        onDrop(droppedItemId, jsonData);
        toast.success('Item dropped successfully');
      }
    } catch (error) {
      console.error("Error handling drop:", error);
      toast.error('Failed to drop item');
    }
  }, [onDrop]);
  
  return {
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  };
};

export default useDropTarget;
