<template>
  <form class="form-container" @submit.prevent="ticker = ''">
    <label for="ticker"> Ticker </label>
    <input name="ticker" id="ticker" v-model="ticker" class="input" type="text" placeholder="eg: AMD..." />
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
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 2rem;
  background: $white;
  box-shadow: -3px -3px 6px $light;
}

.input {
  border-radius: 1rem;
  padding: 4px 1rem;
  border: 0;
  background: rgba($light, 0.2);
  outline: thin;
  color: $dark;

  &::placeholder {
    color: darken($white, 40%);
  }

  @media screen and (max-width: 500px) {
    display: block;
    margin: 1rem auto;
  }
}

.button {
  background: $white;
  margin-left: 16px;
  padding: 4px 1rem;
  transition: all 150ms ease-in-out;

  &-subscribe {
    $color: #def5d9;
    background: $color;
    color: $dark;

    &:hover {
      background: lighten($color, 5%);
    }
  }

  &-unsubscribe {
    $color: #9b4a4a;
    background: $color;
    color: $white;

    &:hover {
      background: darken($color, 10%);
    }
  }
}
</style>
