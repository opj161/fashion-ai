/**
 * AttributeSelect component for selecting model attributes with descriptions
 * @param {string} label - Label text for the select input
 * @param {string} stateKey - Key to identify this attribute in state
 * @param {string} value - Current selected value
 * @param {function} onChange - Handler function called when selection changes
 * @param {Array} options - Array of option objects {value, label, description}
 * @param {string} className - Additional CSS classes
 */
function AttributeSelect({ label, stateKey, value, onChange, options, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(stateKey, e.target.value)}
        className={`w-full rounded-md border ${
          value === 'default' 
            ? 'border-dashed border-gray-300 dark:border-gray-600' 
            : 'border-gray-300 dark:border-gray-700'
        } bg-white dark:bg-gray-800 py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} title={option.description}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="mt-1 text-xs">
        {value === 'default' ? (
          <span className="text-gray-500 dark:text-gray-400 italic">
            {options.find(o => o.value === value)?.description}
          </span>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">
            {options.find(o => o.value === value)?.description}
          </span>
        )}
      </div>
    </div>
  );
}

export default AttributeSelect;
