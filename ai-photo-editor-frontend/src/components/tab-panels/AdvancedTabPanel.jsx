import { toast } from 'react-hot-toast';

/**
 * AdvancedTabPanel component for prompt editing
 * @param {string} customPrompt - Custom prompt text
 * @param {boolean} isUsingCustomPrompt - Whether using custom prompt
 * @param {function} setCustomPrompt - Function to update custom prompt
 * @param {function} setIsUsingCustomPrompt - Function to update isUsingCustomPrompt state
 * @param {function} buildEnhancedPrompt - Function to build default prompt
 */
function AdvancedTabPanel({
  customPrompt,
  isUsingCustomPrompt,
  setCustomPrompt,
  setIsUsingCustomPrompt,
  buildEnhancedPrompt
}) {
  return (
    <div className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
      <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Advanced Prompt Editor</h3>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {customPrompt.length || buildEnhancedPrompt().length} characters
            {(customPrompt.length > 800 || (!customPrompt && buildEnhancedPrompt().length > 800)) && 
              <span className="text-amber-600 dark:text-amber-400 ml-2">
                (Very long prompts may be truncated)
              </span>
            }
          </div>
          <div className="space-x-2">
            <button
              onClick={() => {
                setCustomPrompt(buildEnhancedPrompt());
                setIsUsingCustomPrompt(false);
              }}
              className="text-xs py-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(customPrompt || buildEnhancedPrompt());
                toast.success('Prompt copied!');
              }}
              className="text-xs py-1 px-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              Copy
            </button>
          </div>
        </div>
        <textarea
          value={customPrompt || buildEnhancedPrompt()}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            setIsUsingCustomPrompt(true);
          }}
          className="w-full border rounded-md p-3 h-48 dark:bg-gray-800 dark:border-gray-600"
          placeholder="Edit the generation prompt..."
        />
        <div className="mt-2 flex items-center">
          <input
            type="checkbox"
            id="useCustomPrompt"
            checked={isUsingCustomPrompt}
            onChange={(e) => setIsUsingCustomPrompt(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="useCustomPrompt" className="text-sm text-gray-700 dark:text-gray-300">
            Use edited prompt instead of auto-generated
          </label>
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-md">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <span className="font-medium">Advanced users only:</span> Edit the prompt directly to fine-tune the generation. Be sure to maintain the key instruction "CREATE A PHOTOREALISTIC IMAGE" at the beginning.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdvancedTabPanel;
