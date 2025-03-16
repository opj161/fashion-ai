import PropTypes from 'prop-types';

/**
 * TabButton component for navigation tabs
 * @param {boolean} isActive - Whether this tab is currently active
 * @param {function} onClick - Click handler function
 * @param {string|ReactNode} icon - Icon to display in the tab
 * @param {string} label - Text label for the tab
 */
function TabButton({ isActive, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 flex items-center space-x-2 whitespace-nowrap transition-colors ${
        isActive 
          ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400 font-medium' 
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/30'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Add PropTypes validation
TabButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired
};

export default TabButton;
