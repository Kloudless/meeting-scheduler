export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    text: {
      type: String,
    },
    caption: {
      type: String,
    },
  },
  methods: {
    onClick() {
      this.$emit('click', this.value);
    },
  },
};
