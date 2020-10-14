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
@import url("https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap");

#app {
  font-family: "Cutive Mono", monospace;
  color: $dark;
  line-height: 1.5;
}

.view {
  margin-top: 48px;
  text-align: center;
}

.nav {
  top: 0;
  width: 100%;
  position: fixed;
  background: $dark;
  padding: 1rem 2rem 1rem;
  filter: drop-shadow(0 2px 4px $dark);
}

.router-link {
  color: $light;
  text-decoration: none;
  position: relative;
  padding: 0.25rem 1rem;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 2px;
    background-color: $light;
    transition: all 250ms ease-in-out 50ms;
  }

  &:hover::before {
    top: 100%;
  }

  &::after {
    content: "";
    position: absolute;
    height: 0;
    left: 0;
    top: 0;
    width: 2px;
    background-color: $light;
    transition: all 250ms ease-in-out 50ms;
  }

  &:hover::after {
    height: 100%;
  }
}
</style>
