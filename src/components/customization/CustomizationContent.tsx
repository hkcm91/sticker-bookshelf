
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Palette, 
  Image, 
  AppWindow,
  SquareDashedBottomCode,
  SquareStack,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookshelfStore } from "@/store/bookshelfStore";

// Import tab content components
import GeneralTab from './tabs/GeneralTab';
import ContainerTab from './tabs/ContainerTab';
import ShelvesTab from './tabs/ShelvesTab';
import SlotsTab from './tabs/SlotsTab';
import HeaderTab from './tabs/HeaderTab';

const CustomizationContent: React.FC = () => {
  const { saveCustomization, resetCustomization } = useBookshelfStore();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full justify-start mb-4 overflow-x-auto">
          <TabsTrigger value="general" className="flex items-center">
            <AppWindow className="mr-1 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="container" className="flex items-center">
            <SquareDashedBottomCode className="mr-1 h-4 w-4" /> Container
          </TabsTrigger>
          <TabsTrigger value="shelves" className="flex items-center">
            <SquareStack className="mr-1 h-4 w-4" /> Shelves
          </TabsTrigger>
          <TabsTrigger value="slots" className="flex items-center">
            <Layers className="mr-1 h-4 w-4" /> Slots
          </TabsTrigger>
          <TabsTrigger value="header" className="flex items-center">
            <Image className="mr-1 h-4 w-4" /> Header
          </TabsTrigger>
        </TabsList>
        
        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <GeneralTab />
        </TabsContent>
        
        {/* Container Tab */}
        <TabsContent value="container" className="space-y-6">
          <ContainerTab />
        </TabsContent>
        
        {/* Shelves Tab */}
        <TabsContent value="shelves" className="space-y-6">
          <ShelvesTab />
        </TabsContent>
        
        {/* Slots Tab */}
        <TabsContent value="slots" className="space-y-6">
          <SlotsTab />
        </TabsContent>
        
        {/* Header Tab */}
        <TabsContent value="header" className="space-y-6">
          <HeaderTab />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={resetCustomization}
          size="sm"
        >
          Reset to Defaults
        </Button>
        
        <Button 
          onClick={saveCustomization}
          size="sm"
        >
          Save Customization
        </Button>
      </div>
    </div>
  );
};

export default CustomizationContent;
