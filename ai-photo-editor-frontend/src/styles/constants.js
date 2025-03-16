/**
 * Common styling constants for the application
 */

export const CARD_STYLES = {
  container: 'border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200',
  title: 'font-medium mb-4 text-gray-900 dark:text-gray-100',
};

export const BUTTON_VARIANTS = {
  primary: 'py-2 px-6 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg',
  secondary: 'py-2 px-6 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg',
  icon: 'p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded',
};

export const GRID_LAYOUTS = {
  twoColumn: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  threeColumn: 'grid grid-cols-1 md:grid-cols-3 gap-6',
};
