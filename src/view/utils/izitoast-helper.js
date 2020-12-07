import iziToast from 'izitoast';
import { CAN_COPY } from '../../constants';


const BASE_OPTIONS = {
  layout: 1, // 1: small layout, 2: medium layout
  timeout: false,
  close: false,
  overlay: true,
  toastOnce: false,
  position: 'center',
  // to allow text selections
  drag: false,
};

function confirm(message, onConfirm = () => {}, onCancel = () => {}) {
  iziToast.show({
    ...BASE_OPTIONS,
    message,
    title: '',
    class: 'iziToast__confirm-dialog',
    icon: 'material-icons',
    iconText: 'help_outline',
    toastOnce: true,
    buttons: [
      [
        '<button class="iziToast__destructive-btn"><b>YES</b></button>',
        (instance, toast) => {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          onConfirm();
        },
        false,
      ],
      [
        '<button class="iziToast__cancel-btn"><b>No</b></button>',
        (instance, toast) => {
          instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
          onCancel();
        },
        false,
      ],
    ],
  });
}

/**
 * @param {string} message
 * @param {string=} options.detail
 */
function error(message, options = {}) {
  // TODO: add copy button
  const { detail } = options;
  const buttons = [];
  let msg = message;
  if (detail) {
    msg += `
      <details>
        <summary class="iziToast__details-toggle-btn">show details</summary>
        ${detail}
      </details>`;
    if (CAN_COPY) {
      buttons.push([
        '<button class="iziToast__copy-btn">Copy</button>',
        () => {
          const eltemp = document.createElement('textarea');
          eltemp.value = `${message} (detail: ${detail})`;
          eltemp.readOnly = true;
          eltemp.className = 'iziToast__copy';
          eltemp.setAttribute('aria-hidden', 'true');
          document.body.appendChild(eltemp);
          eltemp.select();
          document.execCommand('copy');
          document.body.removeChild(eltemp);
        }, false,
      ]);
    }
  }
  iziToast.show({
    ...BASE_OPTIONS,
    message: msg,
    title: 'ERROR',
    class: 'iziToast__error-dialog',
    icon: 'material-icons',
    iconText: 'error_outline',
    close: true,
    layout: detail ? 2 : 1,
    buttons,
  });
}

export default {
  error,
  confirm,
};
