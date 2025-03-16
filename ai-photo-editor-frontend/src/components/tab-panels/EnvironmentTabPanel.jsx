import AttributeSelect from '../common/AttributeSelect';

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
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Environment & Style</h3>
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
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
        <p className="text-xs text-blue-600 dark:text-blue-300">
          <span className="font-medium">Note:</span> Background and pose greatly impact how your clothing item appears. Choose settings that highlight your product best.
        </p>
      </div>
    </div>
  );
}

export default EnvironmentTabPanel;
