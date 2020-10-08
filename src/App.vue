<template>
  <main>
    <router-link to="/">Home</router-link>
    <router-view />
  </main>
</template>

<style lang="scss">
  @import url('./styles/keyframes.css');

  #app {
    font-family: 'Cutive Mono', monospace;
    text-align: center;
    color: #2c3e50;
    line-height: 1.5;
  }

  .router-link {
    color: #719fc0;
    text-decoration: none;
    position: relative;
  }

  .router-link:hover {
    &::before {
      content: '';
      position: absolute;
      height: 1px;
      background: #719fc0;
      bottom: 0;
      left: 0;
      animation: width 250ms ease forwards;
    }
  }
</style>
