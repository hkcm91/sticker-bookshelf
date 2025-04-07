
import { defaultCustomization } from './types';
import { createUISlice } from './uiSlice';
import { createPageSlice } from './pageSlice';
import { createContainerSlice } from './containerSlice';
import { createShelvesSlice } from './shelvesSlice';
import { createSlotsSlice } from './slotsSlice';
import { createHeaderSlice } from './headerSlice';
import { createStorageSlice } from './storageSlice';
import { CustomizationSliceCreator } from './types';

// Export the default customization for use in the main store
export { defaultCustomization } from './types';

export const createCustomizationSlice: CustomizationSliceCreator = (set, get, api) => {
  // Combine all slices with default values
  return {
    // Default state values first (these are all the required properties)
    ...defaultCustomization,
    
    // Then add all actions from individual slices
    ...createUISlice(set, get, api),
    ...createPageSlice(set, get, api),
    ...createContainerSlice(set, get, api),
    ...createShelvesSlice(set, get, api),
    ...createSlotsSlice(set, get, api),
    ...createHeaderSlice(set, get, api),
    ...createStorageSlice(set, get, api)
  };
};

// Export types
export type { CustomizationState, ShelfStyling } from './types';
