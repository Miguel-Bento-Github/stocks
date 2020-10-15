<template>
  <main>
    <nav class="nav">
      <router-link class="router-link" to="/"> Home </router-link>
    </nav>
    <router-view class="view" />
  </main>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");

#app {
  font-family: "Lato", "Avenir", "Arial," sans-serif;
  color: $dark;
  line-height: 1.5;
}

.view {
  margin-top: 4rem;
  text-align: center;
}

.nav {
  display: flex;
  align-items: center;
  top: 0;
  width: 100%;
  position: fixed;
  background: $dark;
  padding-left: 2rem;
  height: 48px;
  z-index: 1;

  .router-link {
    top: 1rem;
  }

  @media screen and (max-width: 620px) {
    padding-left: 1rem;
  }
}

.router-link {
  z-index: 0;
  color: $light;
  text-decoration: none;
  position: relative;
  padding: 0.25rem 1rem;

  &:visited {
    background-color: $light;
  }

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 2px;
    background-color: $light;
    transition: all 250ms;
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
    transition: all 250ms;
  }

  &:hover::after {
    height: 100%;
  }
}
</style>
