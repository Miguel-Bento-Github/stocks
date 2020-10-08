<template>
  <main>
    <section>
      <h2>Welcome to stocks and bitches</h2>

      <div class="container">
        <input type="text" v-model="symbol" placeholder="input company symbol..." />
        <button class="button button-subscribe" @click="subscribe()">Connect</button>
        <button class="button button-unsubscribe" @click="unsubscribe()">Disconnect</button>
      </div>
    </section>

    <section class="stock" v-if="stock.p">
      <router-link :to="stock.s.toLowerCase()" class="router-link">{{ stock.s }}</router-link>
      <div>{{ stock.p }}</div>
    </section>

    <div v-if="isLoading">
      <Loader />
    </div>

    <p v-if="infoMessage">{{ infoMessage }}</p>
  </main>
</template>

<script>
  import { defineComponent } from 'vue';
  import Loader from '@/components/Loader';

  export default defineComponent({
    name: 'home',
    data() {
      return {
        connected: false,
        socket: null,
        stock: {
          p: 0,
          s: '',
          t: 0,
          v: 0,
        },
        symbol: '',
        currentSymbol: '',
        isLoading: false,
        infoMessage: '',
      };
    },
    components: {
      Loader,
    },
    methods: {
      subscribe() {
        this.isLoading = true;
        this.socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.VUE_APP_TOKEN}`);
        this.currentSymbol = this.symbol.toUpperCase();

        this.socket.onopen = () => {
          const options = JSON.stringify({ type: 'subscribe', symbol: this.currentSymbol });
          try {
            this.socket.send(options);
          } catch (error) {
            this.error = true;
          }
        };

        this.socket.onmessage = ({ data }) => {
          const res = JSON.parse(data);
          if (res.data) {
            this.isLoading = false;
            this.infoMessage = '';
            this.stock = res.data[0];
          } else if (res.type === 'error') {
            this.loading = false;
            this.infoMessage = res.msg;
          } else if (res.type === 'ping') {
            this.infoMessage = 'Please wait, trying to connect';
          }
        };
      },
      unsubscribe() {
        this.isLoading = false;
        this.infoMessage = '';
        const options = JSON.stringify({ type: 'unsubscribe', symbol: this.currentSymbol });

        try {
          this.socket.send(options);
        } catch (error) {
          this.infoMessage = error.message;
        } finally {
          this.socket.onclose = () => {
            this.stock = {};
            this.infoMessage = 'Disconnected';
          };
        }
      },
    },
  });
</script>

<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap');
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
      background: #78c461;

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
