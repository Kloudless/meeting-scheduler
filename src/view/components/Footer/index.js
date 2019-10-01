import { mapState } from 'vuex';

export default {
  name: 'Footer',
  components: {
  },
  props: [
  ],
  computed: mapState({
    show: state => !state.appHasLogo,
  }),
  methods: {
  },
};
