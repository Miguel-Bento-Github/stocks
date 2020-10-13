<template>
  <main>
    <nav class="nav">
      <transition name="underline">
        <router-link class="router-link" to="/"> Home </router-link>
      </transition>
    </nav>
    <router-view class="view" />
  </main>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
#app {
  font-family: "Cutive Mono", monospace;
  color: #2c3e50;
  line-height: 1.5;
}

.view {
  text-align: center;
}

.nav {
  background: #2c3e50;
  padding: 0.25rem 2rem;
}

.router-link {
  color: #a3c0d4;
  text-decoration: none;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -2px;
    left: 0;
    background-color: #a3c0d4;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out 0s;
  }

  &:hover::before {
    transform: scaleX(1);
  }
}
</style>
