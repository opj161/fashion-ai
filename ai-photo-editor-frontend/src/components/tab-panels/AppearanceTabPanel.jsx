import PropTypes from 'prop-types';
import AttributeSelect from '../common/AttributeSelect';
import InfoBox from '../common/InfoBox';
import { CARD_STYLES } from '../../styles/constants';

/**
 * AppearanceTabPanel component for model characteristics settings
 */
function AppearanceTabPanel({
  bodyType,
  age,
  ethnicity,
  trackChange,
  bodyTypeOptions,
  ageOptions,
  ethnicityOptions
}) {
  return (
    <div className={CARD_STYLES.container}>
      <h3 className={CARD_STYLES.title}>Model Characteristics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AttributeSelect 
          label="Body Type" 
          stateKey="bodyType"
          value={bodyType} 
          onChange={trackChange} 
          options={bodyTypeOptions}
        />
        <AttributeSelect 
          label="Age Range" 
          stateKey="age"
          value={age} 
          onChange={trackChange} 
          options={ageOptions}
        />
        <AttributeSelect 
          label="Ethnicity" 
          stateKey="ethnicity"
          value={ethnicity} 
          onChange={trackChange} 
          options={ethnicityOptions}
        />
      </div>
      
      <InfoBox type="tip" title="Tip">
        "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
      </InfoBox>
    </div>
  );
}

// Add PropTypes validation
AppearanceTabPanel.propTypes = {
  bodyType: PropTypes.string.isRequired,
  age: PropTypes.string.isRequired,
  ethnicity: PropTypes.string.isRequired,
  trackChange: PropTypes.func.isRequired,
  bodyTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  ageOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  ethnicityOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default AppearanceTabPanel;
