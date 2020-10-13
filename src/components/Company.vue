<template>
  <div v-if="canRender">
    <section class="data">
      <div class="company-container">
        <h2>
          <a class="router-link" :aria-label="company.name" :href="company.weburl">
            {{ company.name }}
          </a>
        </h2>
        <img class="img" :src="company.logo" :alt="company.name" />
      </div>
    </section>

    <Graph v-if="canRender" :chart-data="basicChartData" />

    <div v-if="canRender">
      <div v-for="attribute in attributes" :key="attribute">
        <span class="attribute">
          {{ normaliseCasing(attribute) }}
        </span>
        <Graph :chart-data="advancedChartData(attribute)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Graph from "./Graph.vue";
import { CompanyState, ChartData } from "../types";
import normaliseCasing from "@/util/normaliseCasing";

export default {
  name: "Company",
  components: {
    Graph,
  },
  data(): CompanyState {
    return {
      symbol: "",
      data: null,
      company: null,
      financials: null,
    };
  },
  computed: {
    currentPrice(): number {
      return store.state.stock.p;
    },
    canRender(): boolean {
      return Boolean(this.data && this.company && this.financials);
    },
    basicChartData(): ChartData {
      return {
        labels: ["High price", "Open price", "Low price", "Previous close"],
        label: this.company.name,
        data: [this.data.h, this.data.o, this.data.l, this.data.pc],
      };
    },
    attributes(): string[] {
      return Object.keys(this.financials.series.annual);
    },
    /**
     * Transform camelCased financial annual keys into readable user friendly text
     */
  },
  mounted(): void {
    this.symbol = this.$route.params.id.toUpperCase();
    this.findStock();
    this.findCompany();
    this.findFinancials();
  },
  methods: {
    async findStock(): Promise<void> {
      try {
        const { VUE_APP_API, VUE_APP_TOKEN } = process.env;

        const res = await fetch(`${VUE_APP_API}/quote?symbol=${this.symbol}&token=${VUE_APP_TOKEN}`);
        this.data = await res.json();
      } catch (error) {
        throw new Error(error);
      }
    },
    async findCompany(): Promise<void> {
      const { VUE_APP_API, VUE_APP_TOKEN } = process.env;

      try {
        const res = await fetch(`${VUE_APP_API}/stock/profile2?symbol=${this.symbol}&token=${VUE_APP_TOKEN}`);
        this.company = await res.json();
      } catch (error) {
        throw new Error(error);
      }
    },
    async findFinancials(): Promise<void> {
      const { VUE_APP_API, VUE_APP_TOKEN } = process.env;
      const res = await fetch(`${VUE_APP_API}/stock/metric?symbol=${this.symbol}&metric=all&token=${VUE_APP_TOKEN}`);
      this.financials = await res.json();
    },
    advancedChartData(statistic: string): ChartData | null {
      const chartDataSchema: ChartData = {
        label: normaliseCasing(statistic),
        type: "line",
        labels: [],
        data: [],
      };

      const statistics: [{ period: string; v: number }] | null = this.financials.series.annual[statistic] || null;

      if (!statistics) return null;

      statistics.forEach((att: { period: string; v: number }): void => {
        chartDataSchema.labels.unshift(att.period);
        chartDataSchema.data.unshift(att.v);
      });

      return chartDataSchema;
    },
    normaliseCasing,
  },
};
</script>

<style lang="scss" scoped>
.price {
  display: block;
}

.img {
  background: #fff;
  padding: 2rem;
  margin: 3rem;
  border-radius: 50%;
  box-shadow: 3px 3px 12px #ccc, -3px -3px 6px #25255a;
}
</style>
