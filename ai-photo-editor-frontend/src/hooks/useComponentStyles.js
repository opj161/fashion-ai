import { useMemo } from 'react';
import { CARD_STYLES, BUTTON_VARIANTS, GRID_LAYOUTS } from '../styles/constants';

/**
 * Custom hook for consistent component styling
 * @param {Object} customizations - Optional customizations for base styles
 * @returns {Object} Style objects for various UI elements
 */
export default function useComponentStyles(customizations = {}) {
  return useMemo(() => {
    return {
      card: {
        container: `${CARD_STYLES.container} ${customizations.cardContainer || ''}`,
        title: `${CARD_STYLES.title} ${customizations.cardTitle || ''}`,
      },
      button: {
        primary: `${BUTTON_VARIANTS.primary} ${customizations.buttonPrimary || ''}`,
        secondary: `${BUTTON_VARIANTS.secondary} ${customizations.buttonSecondary || ''}`,
        icon: `${BUTTON_VARIANTS.icon} ${customizations.buttonIcon || ''}`,
      },
      grid: {
        twoColumn: `${GRID_LAYOUTS.twoColumn} ${customizations.gridTwoColumn || ''}`,
        threeColumn: `${GRID_LAYOUTS.threeColumn} ${customizations.gridThreeColumn || ''}`,
      }
    };
  }, [customizations]);
}
