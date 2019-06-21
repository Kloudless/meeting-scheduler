import InputLabel from '../InputLabel';

export default {
  name: 'InputField',
  components: {
    InputLabel,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
};
