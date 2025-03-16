import AttributeSelect from '../common/AttributeSelect';

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
  return (
    <div className="space-y-6">
      {/* Gender selection */}
      <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Gender</h3>
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
      </div>
      
      {/* Basic body size selection */}
      <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
        <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Basic Sizing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
          <p className="text-xs text-blue-600 dark:text-blue-300">
            <span className="font-medium">Tip:</span> "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BasicsTabPanel;
