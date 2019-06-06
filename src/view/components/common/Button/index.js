
export default {
  name: 'Button',
  components: {
  },
  props: {
    btnProps: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: Boolean,
      default: true,
    },
    click: Function,
    color: {
      type: String,
      default: 'primary',
    },
  },
};
