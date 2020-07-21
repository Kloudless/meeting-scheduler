/**
 * An async function to load less.js script and recompile styles with
 * customStyleVars option.
 *
 * The function should always be resolved, regardless of the error, to guarantee
 * that the view page will still be fully loaded.
 */
const LINK_TAG_ID = 'custom-style-vars';
let customStyleTask = Promise.resolve();

const displayError = (...args) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

const loadLessScript = () => {
  // Create script tag:
  // <script type="text/javascript" src="./less.js" />.
  const script = document.createElement('script');
  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onreadystatechange = resolve; // for IE
    script.onerror = reject;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', './less.js');
    document.body.append(script);
  }).catch((err) => {
    displayError('Loading less script fails.');
    displayError(err);
    script.remove();
    throw new Error('Loading less script fails.');
  });
};

const loadLessStyleAndCompile = async (customStyleVars) => {
  // Create <link> tag if not exists:
  // <link id="LINK_TAG_ID"
  //       rel="stylesheet/less" type="text/css" href="index.less" />.
  let linkElement = document.getElementById(LINK_TAG_ID);
  if (!linkElement) {
    linkElement = document.createElement('link');
    linkElement.id = LINK_TAG_ID;
    linkElement.href = 'index.less';
    linkElement.type = 'text/css';
    linkElement.rel = 'stylesheet/less';
    document.head.append(linkElement);
  }
  try {
    // Load <link> tag. The method is not on LESS official document.
    // Check it at node_modules/less/dist/less.js L14165.
    window.less.registerStylesheetsImmediately();
    await window.less.modifyVars(customStyleVars);
  } catch (err) {
    displayError('Less build fails:', customStyleVars);
    displayError(err);
    if (linkElement) {
      linkElement.remove();
    }
    throw Error('Less build fails.');
  }
};

export default (customStyleVars) => {
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

  // Chain the current task behind the previous task to ensure they are
  // processed in order.
  customStyleTask = customStyleTask.then(async () => {
    try {
      if (!window.less) {
        // Only load less script if not exist.
        await loadLessScript();
      }
      await loadLessStyleAndCompile(customStyleVars);
    } catch (err) {
      displayError(err);
    }
  });
  return customStyleTask;
};
