<template>
  <section class="data" v-if="showData">
    {{ companySymbol }}
    <span class="price">{{ data.o }} Open price of the day </span>
    <span class="price">{{ data.h }} High price of the day </span>
    <span class="price">{{ data.l }} Low price of the day </span>
    <span class="price">{{ data.pc }} Previous close price </span>

    <button @click="findStock">Find</button>
  </section>
</template>

<script>
  export default {
    name: 'Company',
    props: {
      query: String,
    },
    data() {
      return {
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
          const symbol = this.query.toUpperCase();
          const res = await fetch(
            `${VUE_APP_API}/api/v1/quote?symbol=${symbol}&token=${VUE_APP_TOKEN}`,
          );
          this.data = await res.json();
          this.showData = true;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .price {
    display: block;
  }
</style>
