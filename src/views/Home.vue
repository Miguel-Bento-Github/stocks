<template>
  <main>
    <section class="welcome">
      <h2 class="form-title">Advanced Stocks</h2>
      <img class="logo" src="@/assets/lucky.png" alt="logo" />
      <form class="form-container" @submit.prevent>
        <input v-model="ticker" class="input" type="text" placeholder="input ticker here..." />
        <button class="button button-subscribe" @click="subscribe()">Connect</button>
        <button class="button button-unsubscribe" @click="unsubscribe()">Disconnect</button>
      </form>
    </section>

    <section v-if="showStock" class="company-container">
      <router-link :to="stock.s.toLowerCase()" class="router-link ticker">
        {{ stock.s }}
      </router-link>
      <div class="stock">{{ stock.p.toFixed(2) }}</div>
      <Graph v-if="showStock" :chart-data="chartData" :live="true" />
    </section>

    <div v-if="isLoading">
      <Loader />
    </div>
    <p v-if="infoMessage">
      {{ infoMessage }}
    </p>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "@/components/Loader.vue";
import Graph from "@/components/Graph.vue";
import store from "../store";
import { ChartData, LiveStock } from "@/types/main";

interface State {
  showStock: boolean;
  connected: boolean;
  socket: WebSocket | null;
  ticker: string;
  currentTicker: string;
  infoMessage: string;
  isLoading: boolean;
}

export default defineComponent({
  name: "Home",
  components: {
    Loader,
    Graph,
  },
  data(): State {
    return {
      showStock: false,
      connected: false,
      socket: null,
      ticker: "",
      currentTicker: "",
      isLoading: false,
      infoMessage: "",
    };
  },
  computed: {
    stock(): LiveStock {
      return store.state.stock;
    },
    chartData(): ChartData {
      return {
        labels: store.getters.time,
        label: this.currentTicker,
        data: store.getters.price,
        type: "line",
      };
    },
  },
  /**
   * Show stock if connection hasn't been lost.
   * This can be achieved by verifying current stock price.
   */
  mounted(): void {
    if (store.state.stock.p) {
      this.showStock = true;
    }
  },
  methods: {
    /**
     *  - Handles loader and info message.
     *  - Finds current active company ticker at @property {string} currentTicker,
     *  More info on the subject here {@link https://en.wikipedia.org/wiki/Ticker_symbol}
     *  - Creates a WebSocket
     *  - Listen to 3 events and trigger @methods onopen, onerror, onmessage.
     *    - @name onopen Sends current active company ticker to the socket and subscribes to it.
     *    - @name onerror Changes infoMessage with @event Error.message
     *    - @name onmessage Dispatch required response to the application @const store,
     *    in case the response @const res.type is ping or error,
     *    handle infoMessage, loader and element visibility
     */
    subscribe(): void {
      this.infoMessage = "";
      this.isLoading = true;
      this.currentTicker = this.ticker.toUpperCase();
      this.socket = new WebSocket(process.env.VUE_APP_SOCKET);

      this.socket.onopen = (): void => {
        const options = JSON.stringify({
          type: "subscribe",
          symbol: this.currentTicker,
        });
        this.socket.send(options);
      };

      this.socket.onerror = (event: Error): void => {
        this.infoMessage = event.message;
      };

      this.socket.onmessage = (event: MessageEventInit): void => {
        const res = JSON.parse(event.data);

        if (res.data) {
          const stock = res.data[0];
          this.isLoading = false;
          this.showStock = true;
          this.infoMessage = "";
          store.dispatch("setStock", stock);
        } else if (res.type === "error") {
          this.isLoading = false;
          this.showStock = false;
          this.infoMessage = res.msg;
        } else if (res.type === "ping") {
          this.infoMessage = "Please wait, trying to connect";
        }
      };
    },
    /**
     * Tries to unsubscribe from WebSocket using currentTicker
     *
     *  - Closes WebSocket
     *  - Hide Company Stock
     *  - Hide Loader
     *  - Show info message and delete it after a second and a half
     */
    unsubscribe(): void {
      this.showStock = false;
      if (!this.socket) return;

      this.isLoading = false;
      this.infoMessage = "";
      const options = JSON.stringify({
        type: "unsubscribe",
        ticker: this.currentTicker,
      });

      this.socket.send(options);
      this.infoMessage = "Disconnected";
      this.socket.close();

      setTimeout(() => {
        this.infoMessage = "";
      }, 1500);
    },
  },
});
</script>

<style lang="scss" scoped>
.welcome {
  background: linear-gradient($dark 50%, $white 50%);
}

.logo {
  background: $white;
  border-radius: 50%;
  margin-top: 2rem;
  width: 250px;
  padding: 2rem;
  box-shadow: 3px 2px 6px $light, -3px -3px 6px $dark;
}

.input {
  border-radius: 4px;
  border: none;
  box-shadow: 1px 1px 3px $light, -1px -1px 3px $dark;
  outline: thin;
  padding: 2px 4px;

  &::placeholder {
    color: darken($white, 40%);
  }

  @media screen and (max-width: 500px) {
    display: block;
    margin: 1rem auto;
  }
}

.form {
  &-container {
    margin-top: 2rem;
  }

  &-title {
    color: $white;
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

.company-container {
  margin-top: 5rem;
}

.stock {
  font-size: 5rem;
}

.ticker {
  @extend .stock;
}
</style>
