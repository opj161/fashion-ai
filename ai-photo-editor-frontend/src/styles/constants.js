/**
 * Common styling constants for the application
 */

// Define common styling constants for reusability throughout the app

export const CARD_STYLES = {
  container: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5',
  title: 'text-lg font-medium text-gray-900 dark:text-gray-100 mb-4'
};

export const BUTTON_VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
  secondary: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600',
  icon: 'p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none'
};

export const GRID_LAYOUTS = {
  twoColumn: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  threeColumn: 'grid grid-cols-1 md:grid-cols-3 gap-4'
};
