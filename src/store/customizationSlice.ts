
import { StateCreator } from 'zustand';
import { BookshelfState } from './bookshelfStore';
import { toast } from 'sonner';

// Define customization state structure
export interface CustomizationState {
  // General theme settings
  page: {
    background: string;
    backgroundImage: string;
  };
  // Bookshelf container settings
  container: {
    background: string;
    backgroundImage: string;
    opacity: number;
    borderWidth: number;
    borderStyle: string;
    borderColor: string;
    borderRadius: number;
    padding: number;
  };
  // Shelf settings
  shelves: {
    thickness: number;
    color: string;
    backgroundImage: string;
    opacity: number;
    dividers: {
      enabled: boolean;
      booksPerSection: number;
      thickness: number;
      color: string;
    };
  };
  // Slot customization
  slots: {
    addButtonBg: string;
    addButtonColor: string;
    addButtonHoverBg: string;
    toggleInactiveColor: string;
    toggleActiveColor: string;
    toggleBorderColor: string;
    emptyHoverBg: string;
  };
  // Header styling
  header: {
    background: string;
    backgroundImage: string;
    textColor: string;
  };
  // UI state for customization
  ui: {
    isCustomizationModalOpen: boolean;
  };
  
  // Actions
  openCustomizationModal: () => void;
  closeCustomizationModal: () => void;
  
  // Page settings
  updatePageBackground: (color: string) => void;
  updatePageBackgroundImage: (url: string) => void;
  
  // Container settings
  updateContainerBackground: (color: string) => void;
  updateContainerBackgroundImage: (url: string) => void;
  updateContainerOpacity: (opacity: number) => void;
  updateContainerBorder: (property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius', value: any) => void;
  updateContainerPadding: (padding: number) => void;
  
  // Shelf settings
  updateShelfThickness: (thickness: number) => void;
  updateShelfColor: (color: string) => void;
  updateShelfBackgroundImage: (url: string) => void;
  updateShelfOpacity: (opacity: number) => void;
  
  // Divider settings
  toggleDividers: (enabled: boolean) => void;
  updateDividersSetting: (property: 'booksPerSection' | 'thickness' | 'color', value: any) => void;
  
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg',
    value: string
  ) => void;
  
  // Header settings
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => void;
  
  // Storage actions
  saveCustomization: () => void;
  loadCustomization: () => void;
  resetCustomization: () => void;
}

// Default values
const defaultCustomization = {
  page: {
    background: '#f5f5f5',
    backgroundImage: '',
  },
  container: {
    background: '#a47148',
    backgroundImage: '',
    opacity: 1,
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
  },
  shelves: {
    thickness: 20,
    color: '#8B5A2B',
    backgroundImage: '',
    opacity: 1,
    dividers: {
      enabled: false,
      booksPerSection: 6,
      thickness: 2,
      color: '#714621',
    },
  },
  slots: {
    addButtonBg: 'rgba(255, 255, 255, 0.9)',
    addButtonColor: '#555555',
    addButtonHoverBg: '#ffffff',
    toggleInactiveColor: 'rgba(200, 200, 200, 0.5)',
    toggleActiveColor: 'rgba(80, 80, 80, 0.9)',
    toggleBorderColor: 'rgba(180, 180, 180, 0.7)',
    emptyHoverBg: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    background: '#a47148',
    backgroundImage: '',
    textColor: '#ffffff',
  },
  ui: {
    isCustomizationModalOpen: false,
  }
};

// Create the customization slice
export const createCustomizationSlice: StateCreator<
  BookshelfState,
  [],
  [],
  CustomizationState
> = (set, get) => ({
  ...defaultCustomization,

  // Actions for customization state
  
  // General UI actions
  openCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: true } 
  })),
  
  closeCustomizationModal: () => set((state) => ({ 
    ui: { ...state.ui, isCustomizationModalOpen: false } 
  })),
  
  // Page settings
  updatePageBackground: (color: string) => set((state) => ({ 
    page: { ...state.page, background: color } 
  })),
  
  updatePageBackgroundImage: (url: string) => set((state) => ({ 
    page: { ...state.page, backgroundImage: url } 
  })),
  
  // Container settings
  updateContainerBackground: (color: string) => set((state) => ({ 
    container: { ...state.container, background: color } 
  })),
  
  updateContainerBackgroundImage: (url: string) => set((state) => ({ 
    container: { ...state.container, backgroundImage: url } 
  })),
  
  updateContainerOpacity: (opacity: number) => set((state) => ({ 
    container: { ...state.container, opacity } 
  })),
  
  updateContainerBorder: (property: 'borderWidth' | 'borderStyle' | 'borderColor' | 'borderRadius', value: any) => 
    set((state) => ({ 
      container: { ...state.container, [property]: value } 
    })),
  
  updateContainerPadding: (padding: number) => set((state) => ({ 
    container: { ...state.container, padding } 
  })),
  
  // Shelf settings
  updateShelfThickness: (thickness: number) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('thickness' in customShelves) {
      customShelves.thickness = thickness;
    }
    return { shelves: customShelves };
  }),
  
  updateShelfColor: (color: string) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('color' in customShelves) {
      customShelves.color = color;
    }
    return { shelves: customShelves };
  }),
  
  updateShelfBackgroundImage: (url: string) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('backgroundImage' in customShelves) {
      customShelves.backgroundImage = url;
    }
    return { shelves: customShelves };
  }),
  
  updateShelfOpacity: (opacity: number) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('opacity' in customShelves) {
      customShelves.opacity = opacity;
    }
    return { shelves: customShelves };
  }),
  
  // Divider settings
  toggleDividers: (enabled: boolean) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('dividers' in customShelves) {
      customShelves.dividers = { ...customShelves.dividers, enabled };
    }
    return { shelves: customShelves };
  }),
  
  updateDividersSetting: (property: 'booksPerSection' | 'thickness' | 'color', value: any) => set((state) => {
    const customShelves = { ...state.shelves };
    if ('dividers' in customShelves) {
      customShelves.dividers = { ...customShelves.dividers, [property]: value };
    }
    return { shelves: customShelves };
  }),
  
  // Slots settings
  updateSlotSetting: (
    property: 'addButtonBg' | 'addButtonColor' | 'addButtonHoverBg' | 
              'toggleInactiveColor' | 'toggleActiveColor' | 'toggleBorderColor' | 
              'emptyHoverBg',
    value: string
  ) => set((state) => ({ 
    slots: { ...state.slots, [property]: value } 
  })),
  
  // Header settings
  updateHeaderSetting: (
    property: 'background' | 'backgroundImage' | 'textColor',
    value: string
  ) => set((state) => ({ 
    header: { ...state.header, [property]: value } 
  })),
  
  // Save all customization settings to localStorage
  saveCustomization: () => {
    try {
      const state = get();
      const { page, container, slots, header } = state;
      const shelves = {
        thickness: state.shelves.thickness,
        color: state.shelves.color,
        backgroundImage: state.shelves.backgroundImage,
        opacity: state.shelves.opacity,
        dividers: state.shelves.dividers
      };
      
      const settings = { page, container, shelves, slots, header };
      localStorage.setItem('ritual-shelf-customization', JSON.stringify(settings));
      toast.success('Customization settings saved');
    } catch (error) {
      console.error('Error saving customization settings:', error);
      toast.error('Failed to save customization settings');
    }
  },
  
  // Load customization settings from localStorage
  loadCustomization: () => {
    try {
      const savedSettings = localStorage.getItem('ritual-shelf-customization');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        set((state) => {
          // Create a properly structured state update
          const customShelves = { ...state.shelves };
          if (parsed.shelves) {
            if ('thickness' in parsed.shelves) customShelves.thickness = parsed.shelves.thickness;
            if ('color' in parsed.shelves) customShelves.color = parsed.shelves.color;
            if ('backgroundImage' in parsed.shelves) customShelves.backgroundImage = parsed.shelves.backgroundImage;
            if ('opacity' in parsed.shelves) customShelves.opacity = parsed.shelves.opacity;
            if ('dividers' in parsed.shelves) customShelves.dividers = parsed.shelves.dividers;
          }
          
          return {
            page: parsed.page || state.page,
            container: parsed.container || state.container,
            shelves: customShelves,
            slots: parsed.slots || state.slots,
            header: parsed.header || state.header
          };
        });
      }
    } catch (error) {
      console.error('Error loading customization settings:', error);
    }
  },
  
  // Reset to default settings
  resetCustomization: () => {
    set((state) => {
      const customShelves = {
        ...state.shelves,
        thickness: defaultCustomization.shelves.thickness,
        color: defaultCustomization.shelves.color,
        backgroundImage: defaultCustomization.shelves.backgroundImage,
        opacity: defaultCustomization.shelves.opacity,
        dividers: defaultCustomization.shelves.dividers
      };
      
      return {
        page: defaultCustomization.page,
        container: defaultCustomization.container,
        shelves: customShelves,
        slots: defaultCustomization.slots,
        header: defaultCustomization.header
      };
    });
    
    localStorage.removeItem('ritual-shelf-customization');
    toast.success('Customization settings reset to defaults');
  }
});
