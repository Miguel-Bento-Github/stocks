<template>
  <form class="form-container" @submit.prevent="ticker = ''">
    <input v-model="ticker" class="input" type="text" placeholder="input ticker here..." />
    <button class="button button-subscribe" @click="$emit('subscribe', ticker)">Connect</button>
    <button class="button button-unsubscribe" @click="$emit('unsubscribe')">Disconnect</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Search",
  data(): { ticker: string } {
    return {
      ticker: "",
    };
  },
});
</script>

<style lang="scss" scoped>
.form-container {
  position: fixed;
  bottom: 0;
  background: $white;
  width: 100%;
  padding: 2rem;
}

.input {
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  box-shadow: 3px 2px 6px $light, -3px -3px 6px $dark;
  outline: thin;

  &::placeholder {
    color: darken($white, 40%);
  }

  @media screen and (max-width: 500px) {
    display: block;
    margin: 1rem auto;
  }
}

.button {
  color: $white;
  margin-left: 16px;

  &-subscribe {
    $color: #4ba479;
    background: $color;

    &:hover {
      background: desaturate($color, 20%);
    }
  }

  &-unsubscribe {
    $color: #78c461;
    background: $color;

    &:hover {
      background: saturate($color, 20%);
    }
  }
}
</style>
