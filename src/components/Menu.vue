<template>
  <aside class="navigator">
    <nav :class="{ 'navigator-list-active': showMenu }" class="navigator-list">
      <button
        class="router-link navigator-link"
        @click="
          $emit('attribute-selected', '');
          showMenu = false;
        "
      >
        Basic values
      </button>
      <button
        v-for="attribute in attributes"
        :key="attribute"
        class="router-link navigator-link"
        @click="
          $emit('attribute-selected', attribute);
          scrollTo(attribute);
          showMenu = false;
        "
      >
        {{ normaliseCasing(attribute) }}
      </button>
    </nav>
    <button :class="{ 'menu-selector-hide': showMenu }" class="menu-selector" @click="focusMenu(!showMenu)"></button>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import normaliseCasing from "../util/normaliseCasing";

export default defineComponent({
  name: "Menu",
  props: {
    attributes: {
      type: Array as () => string[],
      required: true,
    },
  },
  data(): { showMenu: boolean } {
    return {
      showMenu: false,
    };
  },
  methods: {
    normaliseCasing,
    scrollTo(location: string): void {
      this.$emit("open-chart", location);
      document?.getElementById(location)?.scrollIntoView();
    },
    focusMenu(visibility: boolean): void {
      this.showMenu = visibility;
    },
  },
});
</script>

<style lang="scss" scoped>
.navigator {
  z-index: 1;
  position: relative;
  background: $dark;
  color: $ivory;
  text-align: left;
  padding: 0 1rem;
}

.navigator-list {
  padding: 1rem;
  background: $dark;
  position: fixed;
  top: 48px;
  right: 0;
  height: 100%;
  filter: drop-shadow(0 2px 4px $dark);
  transform: translateX(150%);
  transition: transform 250ms ease;

  &-active {
    transform: translateX(0);
  }
}

.navigator-link {
  display: block;
  box-shadow: none;
  margin: 1rem 0;

  &::before {
    width: 0;
  }

  &::before,
  &::after {
    transition: all 150ms ease-in-out;
  }
}

.line {
  content: "";
  position: absolute;
  width: 50%;
  height: 2px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background: $light;
  transition: transform 250ms ease-in-out;
}

.menu-selector {
  all: unset;
  position: fixed;
  top: 0;
  right: 0;
  height: 2px; // router-link bar height
  width: 1rem;
  padding: 1rem 2rem;
  cursor: pointer;

  &::before {
    @extend .line;
    transform: translateY(8px);
  }

  &::after {
    @extend .line;
    transform: translateY(0);
  }

  &:hover::before {
    transform: translateY(0);
  }

  &:hover::after {
    transform: translateY(8px);
  }

  &-hide:hover::before,
  &-hide:hover::after,
  &-hide::before,
  &-hide::after {
    cursor: pointer;
    transform: translateY(0);
  }
}
</style>
