
import React from 'react';
import { Button } from "@/components/ui/button";
import { Rows3 } from 'lucide-react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import { toast } from 'sonner';

const RowControls: React.FC = () => {
  const {
    addRow,
    removeRow,
    activeShelfId,
    shelves,
  } = useBookshelfStore();
  
  const shelvesData = shelves || {};
  const activeShelf = activeShelfId ? shelvesData[activeShelfId] : null;
  
  const handleAddRow = () => {
    console.log("Add row clicked, activeShelfId:", activeShelfId);
    if (activeShelfId) {
      addRow();
      toast.success("Row added successfully");
    } else {
      toast.error("No active shelf selected");
    }
  };
  
  const handleRemoveRow = () => {
    console.log("Remove row clicked, activeShelfId:", activeShelfId);
    if (activeShelfId && activeShelf && activeShelf.rows > 1) {
      removeRow();
      toast.success("Row removed successfully");
    } else {
      toast.error("Cannot remove the last row");
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Rows</h3>
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRemoveRow}
          disabled={!activeShelf || activeShelf.rows <= 1}
          className="px-2"
        >
          -
        </Button>
        <div className="flex items-center space-x-1">
          <Rows3 className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{activeShelf ? activeShelf.rows : 0}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddRow}
          className="px-2"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default RowControls;
