/**
 * An async function to load less.js script and recompile styles with
 * customStyleVars option.
 *
 * The function should always be resolved, regardless of the error, to guarantee
 * that the view page will still be fully loaded.
 */

let loadLessScriptTask = null;
let customStyleTask = null;
let script = null;
const CUSTOM_STYLE_TAG_ID = 'custom-style';

const displayError = (message) => {
  // eslint-disable-next-line no-console
  console.error(message);
};

export default async (customStyleVars) => {
  /** Set font-face related vars to null by default,
   * because we embed default fonts into the view CSS,
   * and adding style for the same font again would cause default fonts
   * to disappear.
   */
  // eslint-disable-next-line no-param-reassign
  customStyleVars = {
    fontFaceName: null,
    fontFacePath: null,
    fontFaceFormat: null,
    ...customStyleVars,
  };
  Object.keys(customStyleVars).forEach((key) => {
    /**
     * less supports passing variables with @
     * but we need to remove them in order to apply defaults properly
     */
    if (key.startsWith('@')) {
      delete customStyleVars[key];
    }
  });
  if (loadLessScriptTask === null) {
    // only need to load less.js once
    loadLessScriptTask = new Promise((resolve, reject) => {
      script = document.createElement('script');
      script.onload = resolve;
      script.onreadystatechange = resolve; // for IE
      script.onerror = reject;
      script.setAttribute('type', 'text/javascript');
      script.setAttribute('src', './less.js');
      document.body.append(script);
    });
  }
  try {
    await loadLessScriptTask;
  } catch (e) {
    displayError('load less script failed');
    // try again next time
    if (script) {
      script.remove();
      script = null;
    }
    loadLessScriptTask = null;
    return Promise.resolve();
  }

  // wait until the previous less build finishes, if any
  if (customStyleTask) {
    await customStyleTask;
  }

  const oldStyleElement = document.getElementById(CUSTOM_STYLE_TAG_ID);

  // this promise will always be resolved even if less build fails
  customStyleTask = new Promise((resolve) => {
    if (!window.less) {
      displayError('window.less is not defined.');
      resolve();
      return;
    }
    // create style tag
    const id = CUSTOM_STYLE_TAG_ID;
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', id);
    // setting type will make less to use this tag as input source
    styleElement.setAttribute('type', 'text/less');
    styleElement.textContent = '@import "index.less";';
    document.head.append(styleElement);
    (async () => {
      try {
        const lessTask = window.less.modifyVars(customStyleVars);
        if (!(lessTask instanceof Promise)) {
          throw new Error('window.less.modifyVars() does not return Promise');
        }
        await lessTask;
        // the modifyVars promise resolves before styles are actually inserted
        // into DOM, so add an extra wait
        const interval = setInterval(() => {
          // less inserts compiled styles by updating input source tag
          if (styleElement.getAttribute('type') === 'text/css') {
            clearInterval(interval);
            if (oldStyleElement) {
              oldStyleElement.remove();
            }
            resolve();
          }
        }, 300);
      } catch (e) {
        displayError('less build failed:');
        displayError(e);
        styleElement.remove();
        resolve();
      }
    })();
  });
  return customStyleTask;
};
