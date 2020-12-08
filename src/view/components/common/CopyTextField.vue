<script>
import { CAN_COPY } from '../../../constants';

export default {
  name: 'CopyTextField',
  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hint: '',
      timeoutHandler: null,
      icon: CAN_COPY ? 'content_copy' : null,
    };
  },
  beforeDestroy() {
    clearTimeout(this.timeoutHandler);
  },
  methods: {
    copy() {
      this.$refs.input.$el.getElementsByTagName('input')[0].select();
      if (CAN_COPY) {
        this.copied = document.execCommand('copy');
        this.hint = 'Copied!';
        clearTimeout(this.timeoutHandler);
        this.timeoutHandler = setTimeout(() => {
          this.hint = '';
        }, 3000);
      }
    },
  },
};
</script>

<template lang="pug">
.copy-text-field
  v-text-field(
    ref="input",
    :label="label",
    :append-icon="icon",
    @click:append="copy",
    @click="copy",
    v-model="value",
    :readonly="true",
    :persistent-hint="true"
    :hint="hint")
</template>
