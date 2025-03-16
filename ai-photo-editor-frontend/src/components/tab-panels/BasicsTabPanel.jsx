import PropTypes from 'prop-types';
import AttributeSelect from '../common/AttributeSelect';
import InfoBox from '../common/InfoBox';
import CardContainer from '../common/CardContainer';
import useComponentStyles from '../../hooks/useComponentStyles';

/**
 * BasicsTabPanel component for basic model settings
 * @param {string} gender - Selected gender
 * @param {function} trackChange - Function to track changes to options
 * @param {string} bodySize - Selected body size
 * @param {string} height - Selected height
 * @param {Array} bodySizeOptions - Body size options
 * @param {Array} heightOptions - Height options
 */
function BasicsTabPanel({ 
  gender, 
  trackChange, 
  bodySize, 
  height, 
  bodySizeOptions, 
  heightOptions 
}) {
  const styles = useComponentStyles();
  
  return (
    <div className="space-y-6">
      {/* Gender selection */}
      <CardContainer title="Model Gender">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => trackChange('gender', 'female')}
            className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'female' 
              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
          >
            <div className="text-2xl mb-1">👩</div>
            <div className="font-medium">Female</div>
          </button>
          <button
            onClick={() => trackChange('gender', 'male')}
            className={`flex-1 py-3 px-4 rounded-lg border ${gender === 'male' 
              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400' 
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700'} transition-colors`}
          >
            <div className="text-2xl mb-1">👨</div>
            <div className="font-medium">Male</div>
          </button>
        </div>
      </CardContainer>
      
      {/* Basic body size selection */}
      <CardContainer title="Basic Sizing">
        <div className={styles.grid.twoColumn}>
          <AttributeSelect 
            label="Body Size" 
            stateKey="bodySize"
            value={bodySize} 
            onChange={trackChange} 
            options={bodySizeOptions}
          />
          <AttributeSelect 
            label="Height" 
            stateKey="height"
            value={height} 
            onChange={trackChange} 
            options={heightOptions}
          />
        </div>
        
        <InfoBox type="tip" title="Tip">
          "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
        </InfoBox>
      </CardContainer>
    </div>
  );
}

// Add PropTypes validation
BasicsTabPanel.propTypes = {
  gender: PropTypes.string.isRequired,
  trackChange: PropTypes.func.isRequired,
  bodySize: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  bodySizeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  heightOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default BasicsTabPanel;
