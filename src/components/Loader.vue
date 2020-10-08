<template>
  <div class="loader">
    <div></div>
    <div></div>
  </div>
</template>

<script>
  export default {
    name: 'loader',
  };
</script>

<style scoped>
  .loader {
    margin-top: 4rem;
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .loader div {
    position: absolute;
    border: 4px solid #ccc;
    opacity: 1;
    border-radius: 50%;
    animation: loader 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .loader div:nth-child(2) {
    animation-delay: -0.5s;
  }

  @keyframes loader {
    0% {
      top: 36px;
      left: 36px;
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      top: 0px;
      left: 0px;
      width: 72px;
      height: 72px;
      opacity: 0;
    }
  }
</style>
