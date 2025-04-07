
import { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';

export const useTheme = () => {
  const activeTheme = useBookshelfStore((state) => state.activeTheme) as ThemeName;
  const setActiveTheme = useBookshelfStore((state) => state.setActiveTheme);
  const container = useBookshelfStore((state) => state.container);
  const page = useBookshelfStore((state) => state.page);
  const shelfStyling = useBookshelfStore((state) => state.shelfStyling);
  const slots = useBookshelfStore((state) => state.slots);
  const header = useBookshelfStore((state) => state.header);
  
  // Apply CSS variables based on store values
  useEffect(() => {
    // Update CSS variables based on store values
    if (container && page && shelfStyling) {
      // Page
      document.documentElement.style.setProperty('--page-bg', page.background);
      document.documentElement.style.setProperty('--page-bg-image', page.backgroundImage ? `url(${page.backgroundImage})` : 'none');
      
      // Additional page background properties
      if (page.backgroundSize) {
        document.documentElement.style.setProperty('--page-bg-size', page.backgroundSize);
      }
      if (page.backgroundRepeat) {
        document.documentElement.style.setProperty('--page-bg-repeat', page.backgroundRepeat);
      }
      if (page.backgroundPosition) {
        document.documentElement.style.setProperty('--page-bg-position', page.backgroundPosition);
      }
      if (page.backgroundAttachment) {
        document.documentElement.style.setProperty('--page-bg-attachment', page.backgroundAttachment);
      }
      
      // Container
      document.documentElement.style.setProperty('--container-bg', container.background);
      document.documentElement.style.setProperty('--container-bg-image', container.backgroundImage ? `url(${container.backgroundImage})` : 'none');
      document.documentElement.style.setProperty('--container-opacity', container.opacity.toString());
      document.documentElement.style.setProperty('--container-border-width', `${container.borderWidth}px`);
      document.documentElement.style.setProperty('--container-border-style', container.borderStyle);
      document.documentElement.style.setProperty('--container-border-color', container.borderColor);
      document.documentElement.style.setProperty('--container-border-radius', `${container.borderRadius}px`);
      document.documentElement.style.setProperty('--container-padding', `${container.padding}px`);
      
      // Shelf
      document.documentElement.style.setProperty('--shelf-thickness', `${shelfStyling.thickness}px`);
      document.documentElement.style.setProperty('--shelf-color', shelfStyling.color);
      document.documentElement.style.setProperty('--shelf-bg-image', shelfStyling.backgroundImage ? `url(${shelfStyling.backgroundImage})` : 'none');
      document.documentElement.style.setProperty('--shelf-opacity', shelfStyling.opacity.toString());
      
      // Slots
      document.documentElement.style.setProperty('--slot-add-button-bg', slots.addButtonBg);
      document.documentElement.style.setProperty('--slot-add-button-color', slots.addButtonColor);
      document.documentElement.style.setProperty('--slot-add-button-hover-bg', slots.addButtonHoverBg);
      document.documentElement.style.setProperty('--slot-toggle-inactive-color', slots.toggleInactiveColor);
      document.documentElement.style.setProperty('--slot-toggle-active-color', slots.toggleActiveColor);
      document.documentElement.style.setProperty('--slot-toggle-border-color', slots.toggleBorderColor);
      document.documentElement.style.setProperty('--slot-empty-hover-bg', slots.emptyHoverBg);
      
      // Header
      document.documentElement.style.setProperty('--header-bg', header.background);
      document.documentElement.style.setProperty('--header-bg-image', header.backgroundImage ? `url(${header.backgroundImage})` : 'none');
      document.documentElement.style.setProperty('--header-text-color', header.textColor);
    }
  }, [container, page, shelfStyling, slots, header]);
  
  // Apply theme CSS variables from theme files
  useEffect(() => {
    if (!activeTheme) return;
    
    // If theme is custom, we're already setting all variables directly above
    if (activeTheme === 'custom') {
      document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('theme-'))
        .join(' ');
      document.body.classList.add('theme-custom');
      return;
    }
    
    // Fix for type safety
    const themeKey = activeTheme as keyof typeof themes;
    const theme = themes[themeKey] || themes.default;
    
    // Apply CSS variables to root
    Object.entries(theme.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    // Set theme class on body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ');
    document.body.classList.add(`theme-${activeTheme}`);
    
  }, [activeTheme]);
  
  // Add custom theme to available themes
  const allThemes = { ...themes };
  
  // Safely check and add custom theme if needed
  if (activeTheme === 'custom') {
    // Create a type-safe way to extend the themes object
    const customTheme = {
      name: "Custom Theme",
      variables: {},
      textures: {
        shelf: "",
        background: ""
      }
    };
    
    const extendedThemes = {
      ...allThemes,
      custom: customTheme
    };
    
    return {
      activeTheme,
      setActiveTheme,
      themes: extendedThemes,
      availableThemes: Object.keys(themes) as ThemeName[]
    };
  }
  
  return {
    activeTheme,
    setActiveTheme,
    themes: allThemes,
    availableThemes: Object.keys(themes) as ThemeName[]
  };
};
