<template>
  <form class="form-container" @submit.prevent="ticker = ''">
    <label class="ticker-label" for="ticker"> Ticker </label>
    <input id="ticker" v-model="ticker" name="ticker" class="input" type="text" placeholder="eg: AMD..." />
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
  padding: 2rem;
}

.ticker-label {
  color: $dark;
}

.input,
.button {
  transition: all 150ms ease-in-out;
}

.input {
  border-radius: 1rem;
  padding: 4px 1rem;
  border: 0;
  background: rgba($light, 0.2);
  outline: thin;
  box-shadow: inset 1px -1px 1px $positive, inset -1px 1px 1px $positive;

  &:hover {
    box-shadow: inset 1px -1px 2px $positive, inset -1px 1px 2px $positive;
  }

  &::placeholder {
    color: darken($white, 40%);
  }

  &:focus {
    background: $white;
  }

  @media screen and (max-width: 500px) {
    display: block;
    margin: 1rem auto;
  }
}

.button {
  margin-left: 16px;
  padding: 4px 1rem;
  color: $white;

  &-subscribe {
    $shadow-color: lighten($positive, 10%);
    color: $positive;
    box-shadow: 1px -1px 2px $shadow-color, -1px 1px 2px $shadow-color;

    &:hover {
      box-shadow: 1px -1px 2px $light, -2px 2px 4px $shadow-color;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 -1px 2px $shadow-color, -1px 0 2px $shadow-color;
    }
  }

  &-unsubscribe {
    $shadow-color: lighten($negative, 10%);
    color: $negative;
    box-shadow: 1px -1px 2px $shadow-color, -1px 1px 2px $shadow-color;

    &:hover {
      box-shadow: 1px -1px 2px $light, -2px 2px 4px $negative;
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 -1px 2px $shadow-color, -1px 0 2px $shadow-color;
    }
  }
}
</style>
