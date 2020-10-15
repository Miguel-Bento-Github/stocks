<template>
  <main>
    <nav class="nav">
      <div class="router-link-container">
        <router-link class="router-link" to="/"> Home </router-link>
      </div>
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
  top: 0;
  width: 100%;
  position: fixed;
  background: $dark;
  padding: 0 2rem;
  height: 48px;
  z-index: 1;
  filter: drop-shadow(0 2px 4px $dark);

  .router-link {
    top: 1rem;
  }
}

.router-link {
  z-index: 0;
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
