import PropTypes from 'prop-types';
import { CARD_STYLES } from '../../styles/constants';

/**
 * Reusable card container with consistent styling
 * @param {node} children - Card content 
 * @param {string} title - Optional card title
 * @param {node} actions - Optional card action buttons
 * @param {string} className - Additional CSS classes
 */
function CardContainer({ children, title, actions, className = '' }) {
  return (
    <div className={`${CARD_STYLES.container} ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className={CARD_STYLES.title}>{title}</h3>}
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

CardContainer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string
};

CardContainer.defaultProps = {
  title: null,
  actions: null,
  className: ''
};

export default CardContainer;
