
import InputField from '../InputField';
import getValidators from '../../../utils/form_validator';

export default {
  name: 'TextField',
  components: {
    InputField,
  },
  data() {
    return {
      formRules: getValidators(this.rules || []),
    };
  },
  props: [
    'name', 'label', 'placeholder', 'input', 'value', 'readonly',
    'rules',
  ],
  methods: {
  },
};
