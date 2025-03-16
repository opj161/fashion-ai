import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import InfoBox from '../common/InfoBox';
import { CARD_STYLES, BUTTON_VARIANTS } from '../../styles/constants';

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
    <div className={CARD_STYLES.container}>
      <h3 className={CARD_STYLES.title}>Advanced Prompt Editor</h3>
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
        
        <InfoBox type="warning" title="Advanced users only">
          Edit the prompt directly to fine-tune the generation. Be sure to maintain the key instruction "CREATE A PHOTOREALISTIC IMAGE" at the beginning.
        </InfoBox>
      </div>
    </div>
  );
}

// Add PropTypes validation
AdvancedTabPanel.propTypes = {
  customPrompt: PropTypes.string.isRequired,
  isUsingCustomPrompt: PropTypes.bool.isRequired,
  setCustomPrompt: PropTypes.func.isRequired,
  setIsUsingCustomPrompt: PropTypes.func.isRequired,
  buildEnhancedPrompt: PropTypes.func.isRequired
};

export default AdvancedTabPanel;
