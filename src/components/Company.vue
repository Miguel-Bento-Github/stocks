<template>
  <section class="data" v-if="showData">
    <h2>{{ symbol }}</h2>
    <span class="price">Open price of the day: {{ data.o }}</span>
    <span class="price">High price of the day: {{ data.h }}</span>
    <span class="price">Low price of the day: {{ data.l }}</span>
    <span class="price">Previous close price: {{ data.pc }}</span>
    <span class="price">Current price: {{ currentPrice }}</span>
  </section>
</template>

<script>
  export default {
    name: 'Company',
    props: {
      currentPrice: Number,
    },
    data() {
      return {
        symbol: this.$route.params.id.toUpperCase(),
        showData: false,
        data: {
          c: 0,
          h: 0,
          l: 0,
          o: 0,
          pc: 0,
          t: 0,
        },
      };
    },
    methods: {
      async findStock() {
        try {
          const { VUE_APP_API, VUE_APP_TOKEN } = process.env;
          const res = await fetch(
            `${VUE_APP_API}/quote?symbol=${this.symbol}&token=${VUE_APP_TOKEN}`,
          );
          this.data = await res.json();
          this.showData = true;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    mounted() {
      this.findStock();
    },
  };
</script>

<style lang="scss" scoped>
  .price {
    display: block;
  }
</style>
