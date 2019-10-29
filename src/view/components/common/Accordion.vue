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

<style lang="scss">
@import "../../_variables.scss";

.v-expansion-panel {
  box-shadow: none;

  /* arrow icon */
  & .v-expansion-panel__header__icon > .v-icon {
    color: $primary !important;
  }
}

.theme--light.v-expansion-panel .v-expansion-panel__container {
  background-color: transparent;
  
}

.v-expansion-panel__header {
  padding: 0;
  border-bottom: 1px solid #{$primary}33;
}
</style>

<template lang="pug">
v-expansion-panel(:value="expandLocation").mb-4
  v-expansion-panel-content
    div(
      slot="header",
      :class="[small ? 'font-weight-medium' : 'font-weight-bold']"
    ).text-xs-left.headline.primary--text
      | {{ title }}
    v-content
      v-container.text-xs-center
        slot
</template>
