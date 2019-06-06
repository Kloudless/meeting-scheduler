export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
  },
};
