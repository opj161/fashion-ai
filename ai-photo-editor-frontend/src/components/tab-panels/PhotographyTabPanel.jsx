import AttributeSelect from '../common/AttributeSelect';

/**
 * PhotographyTabPanel component for camera angle and lens settings
 * @param {string} cameraAngle - Selected camera angle
 * @param {string} lens - Selected lens 
 * @param {function} trackChange - Function to track changes to options
 * @param {Array} cameraAngleOptions - Camera angle options
 * @param {Array} lensOptions - Lens options
 */
function PhotographyTabPanel({
  cameraAngle,
  lens,
  trackChange,
  cameraAngleOptions,
  lensOptions
}) {
  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Photography Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Camera angle selector with visual buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Camera Angle
          </label>
          <div className="grid grid-cols-5 gap-2">
            {cameraAngleOptions.map(option => (
              <button
                key={option.value}
                onClick={() => trackChange('cameraAngle', option.value)}
                className={`p-2 border ${
                  option.value === 'default' ? 'border-dashed' : ''
                } rounded text-center ${
                  cameraAngle === option.value 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                title={option.description}
              >
                <div className="text-lg mb-1">{option.icon}</div>
                <div className="text-xs">{option.label}</div>
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {cameraAngle === 'default' ? (
              <span className="italic">{cameraAngleOptions.find(o => o.value === cameraAngle)?.description}</span>
            ) : (
              cameraAngleOptions.find(o => o.value === cameraAngle)?.description
            )}
          </p>
        </div>
        
        {/* Lens options */}
        <AttributeSelect
          label="Lens & Depth of Field"
          stateKey="lens"
          value={lens}
          onChange={trackChange}
          options={lensOptions}
        />
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
        <p className="text-xs text-blue-600 dark:text-blue-300">
          <span className="font-medium">Tip:</span> "Default" lens and camera settings work well for most items. Adjust these only for specific visual effects.
        </p>
      </div>
    </div>
  );
}

export default PhotographyTabPanel;
