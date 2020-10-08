<template>
  <main>
    <section>
      <h2>Welcome to stocks and bitches</h2>
      <fetch-by-name :query="symbol" :data="stock" />

      <div class="container">
        <input type="text" v-model="symbol" placeholder="input company symbol..." />
        <button class="subscribe" @click="subscribe()">Connect</button>
        <button class="unsubscribe" @click="unsubscribe()">Disconnect</button>
      </div>
    </section>
    <section class="stock">
      <button class="subscribe">{{ stock.s }}</button>
      <div>{{ stock.p }}</div>
    </section>
  </main>
</template>

<script>
  import FetchByName from './components/FetchByName';

  export default {
    data() {
      return {
        connected: false,
        socket: null,
        stock: [],
        symbol: '',
        currentSymbol: '',
      };
    },
    components: {
      FetchByName,
    },
    methods: {
      subscribe() {
        this.socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.VUE_APP_TOKEN}`);
        this.currentSymbol = this.symbol.toUpperCase();

        this.socket.onopen = () => {
          const options = JSON.stringify({ type: 'subscribe', symbol: this.currentSymbol });
          this.socket.send(options);
        };
        this.socket.onmessage = ({ data }) => {
          const res = JSON.parse(data);
          this.stock = res.data[0];
        };
      },
      unsubscribe() {
        const options = JSON.stringify({ type: 'unsubscribe', symbol: this.currentSymbol });
        this.socket.send(options);
      },
    },
  };
</script>

<style lang="scss">
  @import url('./reset.css');
  @import url('https://fonts.googleapis.com/css2?family=Cutive+Mono&display=swap');
  $white: #fff;
  $black: #333;

  * {
    box-sizing: border-box;
  }

  #app {
    font-family: 'Cutive Mono', monospace;
    text-align: center;
    color: #2c3e50;
    line-height: 1.5;
  }

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

  button {
    box-shadow: 1px -1px 2px $white, -1px 1px 2px $black;
    border-radius: 8px;
    padding: 1px 4px;
    color: $white;
    margin-left: 16px;
  }

  .container {
    margin-top: 2rem;
  }

  .subscribe {
    $color: #4ba479;
    background: $color;

    &:hover {
      background: saturate($color, 20%);
    }
  }
  .unsubscribe {
    $color: #78c461;
    background: #78c461;

    &:hover {
      background: saturate($color, 20%);
    }
  }

  .stock {
    margin-top: 5rem;
    font-size: 5rem;
  }
</style>
