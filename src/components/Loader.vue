<template>
  <div class="loader">
    <div class="loader-inner" />
    <div class="loader-inner delayed" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loader",
});
</script>

<style lang="scss" scoped>
.loader {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.loader-inner {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border: 4px solid $light;
  border-radius: 50%;
  animation: loader 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.delayed {
  animation-delay: -0.5s;
}

@keyframes loader {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>
