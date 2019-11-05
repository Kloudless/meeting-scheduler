<script>

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
    small: {
      type: Boolean,
      default: false,
    },
  },
};

/* eslint-disable */
</script>

<template lang="pug">
v-expansion-panel(:value="expandLocation").mb-4
  v-expansion-panel-content
    div(
      slot="header",
      :class="[small ? 'font-weight-medium' : 'font-weight-bold']"
    ).text-xs-left.font-size--subtitle.primary--text
      | {{ title }}
    v-content
      v-container.text-xs-center
        slot
</template>
