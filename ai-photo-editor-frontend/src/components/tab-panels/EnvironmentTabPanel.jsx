import PropTypes from 'prop-types';
import AttributeSelect from '../common/AttributeSelect';
import InfoBox from '../common/InfoBox';
import { CARD_STYLES } from '../../styles/constants';

/**
 * EnvironmentTabPanel component for background and pose settings
 * @param {string} background - Selected background
 * @param {string} pose - Selected pose
 * @param {function} trackChange - Function to track changes to options
 * @param {Array} backgroundOptions - Background options
 * @param {Array} poseOptions - Pose options
 */
function EnvironmentTabPanel({
  background,
  pose,
  trackChange,
  backgroundOptions,
  poseOptions
}) {
  return (
    <div className={CARD_STYLES.container}>
      <h3 className={CARD_STYLES.title}>Environment & Style</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AttributeSelect 
          label="Background" 
          stateKey="background"
          value={background} 
          onChange={trackChange} 
          options={backgroundOptions}
        />
        <AttributeSelect 
          label="Pose Style" 
          stateKey="pose"
          value={pose} 
          onChange={trackChange} 
          options={poseOptions}
        />
      </div>
      
      <InfoBox type="note" title="Note">
        Background and pose greatly impact how your clothing item appears. Choose settings that highlight your product best.
      </InfoBox>
    </div>
  );
}

// Add PropTypes validation
EnvironmentTabPanel.propTypes = {
  background: PropTypes.string.isRequired,
  pose: PropTypes.string.isRequired,
  trackChange: PropTypes.func.isRequired,
  backgroundOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired,
  poseOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string
    })
  ).isRequired
};

export default EnvironmentTabPanel;
