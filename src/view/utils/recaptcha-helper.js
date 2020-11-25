/**
 * REF: https://developers.google.com/recaptcha/docs/invisible
 */

// TODO: modify the language of reCAPTCHA when we enable i18n
const SRC = 'https://www.google.com/recaptcha/api.js' +
  '?onload=recaptchaLoaded&render=explicit&hl=en';

let onRecaptchaScriptLoad = null;

/**
 * Internal used only.
 * Only load reCaptcha script at the first call. Do nothing in further calls.
 *
 * @async
 */
function load() {
  if (onRecaptchaScriptLoad === null) {
    const recaptchaScript = document.createElement('script');

    recaptchaScript.src = SRC;
    recaptchaScript.async = true;
    recaptchaScript.defer = true;

    onRecaptchaScriptLoad = new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        // window.recaptchaLoaded will be called when reCaptcha script is
        // loaded
        window.recaptchaLoaded = resolve;
      }
    });
    document.head.appendChild(recaptchaScript);
  }
  return onRecaptchaScriptLoad;
}


/**
 * Render reCAPTCHA badge. Cannot render the same element multiple times.
 *
 * @param {*} element - Element ID or a DOM element.
 * @param {string} recaptchaSiteKey
 * @param {function} callback
 * @param {function} errorCallback
 *
 * @returns {Promise<number>} Resolved with the reCAPTCHA widget ID.
 */
async function render(element, recaptchaSiteKey, callback, errorCallback) {
  await load();
  return grecaptcha.render(
    element,
    {
      badge: 'bottomleft',
      sitekey: recaptchaSiteKey,
      // The reCAPTCHA widget is still visible even if we set invisible.
      // To actually hide it, set badge to 'none' and see
      // https://developers.google.com/recaptcha/docs/faq.
      size: 'invisible',
      callback,
      'error-callback': errorCallback,
      lang: 'en',
      isolated: true,
    },
  );
}

/**
 * Invoke the reCAPTCHA check.
 *
 * @param {number} recaptchaId - The reCAPTCHA widget ID resolved from render().
 */
async function execute(recaptchaId) {
  await load();
  grecaptcha.execute(recaptchaId);
}

export default { render, execute };
