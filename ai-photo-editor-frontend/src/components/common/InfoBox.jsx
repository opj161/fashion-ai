import PropTypes from 'prop-types';

/**
 * InfoBox component for displaying tips, notes, and warnings
 * @param {string} type - Type of info box (tip, note, warning)
 * @param {string} title - Bold title text
 * @param {node} children - Content to display
 * @param {string} className - Additional CSS classes
 */
function InfoBox({ type = 'tip', title, children, className = '' }) {
  // Define styles based on type
  const styles = {
    tip: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-300',
    },
    note: {
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      border: 'border-blue-100 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-300',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      border: 'border-amber-100 dark:border-amber-800/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/10',
      border: 'border-red-100 dark:border-red-800/30',
      text: 'text-red-600 dark:text-red-400',
    }
  };
  
  const style = styles[type] || styles.tip;
  
  return (
    <div className={`mt-4 p-3 ${style.bg} border ${style.border} rounded-md ${className}`}>
      <p className={`text-xs ${style.text}`}>
        {title && <span className="font-medium">{title}:</span>} {children}
      </p>
    </div>
  );
}

InfoBox.propTypes = {
  type: PropTypes.oneOf(['tip', 'note', 'warning', 'error']),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

InfoBox.defaultProps = {
  type: 'tip',
  title: null,
  className: ''
};

export default InfoBox;
