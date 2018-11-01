
export default {
  name: 'Accordion',
  components: {
  },
  data() {
    return {
      expandLocation: this.expanded ? 0 : -1,
    };
  },
  props: {
    title: String,
    expanded: {
      type: Boolean,
      default: true,
    },
  },
};
