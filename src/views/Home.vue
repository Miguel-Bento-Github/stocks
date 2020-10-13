<template>
  <main>
    <section>
      <h2>Wall Street Live</h2>

      <form class="container" @submit.prevent>
        <input
          v-model="ticker"
          type="text"
          placeholder="input company ticker..."
        />
        <button class="button button-subscribe" @click="subscribe()">
          Connect
        </button>
        <button class="button button-unsubscribe" @click="unsubscribe()">
          Disconnect
        </button>
      </form>
    </section>

    <section v-if="showStock" class="stock">
      <router-link :to="stock.s.toLowerCase()" class="router-link">
        {{ stock.s }}
      </router-link>
      <div>{{ stock.p.toFixed(4) }}</div>
    </section>

    <div v-if="isLoading">
      <Loader />
    </div>

    <p v-if="infoMessage">
      {{ infoMessage }}
    </p>

    <Graph v-if="showStock" :chart-data="chartData" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Loader from "@/components/Loader.vue";
import Graph from "@/components/Graph.vue";
import store from "../store";
// eslint-disable-next-line no-unused-vars
import { ChartData, LiveStock } from "../types";

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
      const data: ChartData = {
        labels: store.getters.time,
        label: this.currentTicker,
        data: store.getters.price,
        type: "line",
      };

      return data;
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

interface State {
  showStock: boolean;
  connected: boolean;
  socket: WebSocket | null;
  ticker: string;
  currentTicker: string;
  infoMessage: string;
  isLoading: boolean;
}
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap");
$white: #fff;
$black: #333;

input {
  border-radius: 4px;
  border: none;
  box-shadow: 1px -1px 2px $white, -1px 1px 2px $black;
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

.container {
  margin-top: 2rem;
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

.stock {
  margin-top: 5rem;
  font-size: 5rem;
}
</style>
