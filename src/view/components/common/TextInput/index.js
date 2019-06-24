
import InputField from '../InputField';
import { isRequired } from '../../../utils/form_validator';

export default {
  name: 'TextField',
  components: {
    InputField,
  },
  computed: {
    rules() {
      const { required } = this;
      return required ? [isRequired] : [];
    },
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
};
