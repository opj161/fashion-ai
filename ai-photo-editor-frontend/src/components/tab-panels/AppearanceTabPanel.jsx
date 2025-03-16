import AttributeSelect from '../common/AttributeSelect';

/**
 * AppearanceTabPanel component for model characteristics settings
 * @param {string} bodyType - Selected body type
 * @param {string} age - Selected age range
 * @param {string} ethnicity - Selected ethnicity
 * @param {function} trackChange - Function to track changes to options
 * @param {Array} bodyTypeOptions - Body type options
 * @param {Array} ageOptions - Age options
 * @param {Array} ethnicityOptions - Ethnicity options
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
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Model Characteristics</h3>
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
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
        <p className="text-xs text-blue-600 dark:text-blue-300">
          <span className="font-medium">Tip:</span> "Default" options won't be included in the prompt - the AI will decide based on context. Select specific values only when important for your item.
        </p>
      </div>
    </div>
  );
}

export default AppearanceTabPanel;
