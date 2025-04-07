
import { useEffect } from 'react';
import { useBookshelfStore } from '@/store/bookshelfStore';
import themes, { ThemeName } from '@/themes';
import { toast } from 'sonner';

export function useTheme() {
  const { 
    activeTheme, 
    setActiveTheme, 
    page, 
    container, 
    shelfStyling,
    loadCustomization 
  } = useBookshelfStore();

  // Apply theme whenever activeTheme changes
  useEffect(() => {
    if (!activeTheme) {
      return;
    }
    
    try {
      console.log('Applying theme:', activeTheme);
      
      // Fix for type safety
      let themeToApply = themes.default; // Default fallback
      
      if (activeTheme !== 'custom' && activeTheme in themes) {
        const themeKey = activeTheme as keyof typeof themes;
        themeToApply = themes[themeKey];
        
        // Apply CSS variables to root
        Object.entries(themeToApply.variables).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value as string);
        });
        
        // Apply textures for backgrounds if available
        if (themeToApply.textures) {
          document.documentElement.style.setProperty(
            '--shelf-texture', 
            `url(${themeToApply.textures.shelf || ''})`
          );
          
          if (themeToApply.textures.background) {
            document.documentElement.style.setProperty(
              '--page-bg-image', 
              `url(${themeToApply.textures.background})`
            );
          } else {
            document.documentElement.style.setProperty('--page-bg-image', 'none');
          }
        }
      } else if (activeTheme === 'custom') {
        // For custom theme, we apply the current state values directly
        
        // Page background
        document.documentElement.style.setProperty('--page-bg', page?.background || '#f5f5f5');
        document.documentElement.style.setProperty(
          '--page-bg-image', 
          page?.backgroundImage ? `url(${page.backgroundImage})` : 'none'
        );
        document.documentElement.style.setProperty('--page-bg-size', page?.backgroundSize || 'cover');
        document.documentElement.style.setProperty('--page-bg-repeat', page?.backgroundRepeat || 'no-repeat');
        document.documentElement.style.setProperty('--page-bg-position', page?.backgroundPosition || 'center');
        document.documentElement.style.setProperty('--page-bg-attachment', page?.backgroundAttachment || 'fixed');
        
        // Container
        document.documentElement.style.setProperty('--container-bg', container?.background || '#a47148');
        document.documentElement.style.setProperty(
          '--container-bg-image', 
          container?.backgroundImage ? `url(${container.backgroundImage})` : 'none'
        );
        document.documentElement.style.setProperty('--container-opacity', `${container?.opacity || 1}`);
        document.documentElement.style.setProperty('--container-border-width', `${container?.borderWidth || 0}px`);
        document.documentElement.style.setProperty('--container-border-style', container?.borderStyle || 'solid');
        document.documentElement.style.setProperty('--container-border-color', container?.borderColor || '#e0e0e0');
        document.documentElement.style.setProperty('--container-border-radius', `${container?.borderRadius || 8}px`);
        document.documentElement.style.setProperty('--container-padding', `${container?.padding || 16}px`);
        
        // Shelves
        document.documentElement.style.setProperty('--shelf-thickness', `${shelfStyling?.thickness || 20}px`);
        document.documentElement.style.setProperty('--shelf-color', shelfStyling?.color || '#8B5A2B');
        document.documentElement.style.setProperty(
          '--shelf-bg-image', 
          shelfStyling?.backgroundImage ? `url(${shelfStyling.backgroundImage})` : 'none'
        );
        document.documentElement.style.setProperty('--shelf-opacity', `${shelfStyling?.opacity || 1}`);
        
        // Dividers
        if (shelfStyling?.dividers) {
          document.documentElement.style.setProperty('--divider-thickness', `${shelfStyling.dividers.thickness || 2}px`);
          document.documentElement.style.setProperty('--divider-color', shelfStyling.dividers.color || '#714621');
        }
      }
      
      console.log('Theme applied successfully');
    } catch (error) {
      console.error('Error applying theme:', error);
      toast.error('Error applying theme');
    }
  }, [activeTheme, page, container, shelfStyling]);
  
  // Determine if the current state is a custom theme or matches a predefined theme
  const isCustomTheme = () => {
    if (activeTheme !== 'custom') {
      return false;
    }
    
    // The user has explicitly set a custom theme
    return true;
  };
  
  // Get current custom theme
  const currentCustomTheme = {
    name: "Custom Theme",
    variables: {
      '--page-bg': page?.background || '#f5f5f5',
      '--container-bg': container?.background || '#a47148',
      '--shelf-color': shelfStyling?.color || '#8B5A2B',
      // Add more variables as needed
    },
    textures: {
      shelf: shelfStyling?.backgroundImage || '',
      background: page?.backgroundImage || '',
    }
  };
  
  return {
    activeTheme: activeTheme as ThemeName,
    setActiveTheme,
    themes: { ...themes, custom: currentCustomTheme },
    availableThemes: Object.keys(themes) as ThemeName[],
    isCustomTheme: isCustomTheme(),
    currentCustomTheme,
    loadSavedTheme: loadCustomization
  };
}
