<template>
  <div v-if="canRender">
    <Menu @attribute-selected="selectAttribute" :attributes="attributes" />
    <section class="data">
      <header class="company-container">
        <a :aria-label="company.name" class="router-link company-link" target="_blank" rel="noopener" :href="company.weburl">
          <span>{{ company.name }}</span>
        </a>
        <a :aria-label="company.name" target="_blank" rel="noopener" :href="company.weburl">
          <img v-if="company.logo" class="img" :src="company.logo" />
        </a>
      </header>
      <Graph v-if="!attribute && canRender" :chart-data="basicChartData" />
    </section>
    <div v-if="attribute && canRender">
      <h2>{{ normaliseCasing(attribute) }}</h2>
      <Graph :chart-data="advancedChartData(attribute)" />
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import Graph from "@/components/Graph.vue";
import Menu from "@/components/Menu.vue";
import { CompanyState, ChartData } from "../types";
import normaliseCasing from "@/util/normaliseCasing";

export default {
  name: "Company",
  components: {
    Graph,
    Menu,
  },
  data(): CompanyState {
    return {
      attribute: "",
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
    attributes(): string[] | void {
      // if (!this.financials.series.annual) {
      //   this.$router.push("/");
      // }
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
      try {
        const res = await fetch(`${VUE_APP_API}/stock/metric?symbol=${this.symbol}&metric=all&token=${VUE_APP_TOKEN}`);
        this.financials = await res.json();
      } catch (error) {
        throw new Error(error);
      }
    },
    selectAttribute(attribute: string) {
      this.attribute = attribute;
    },
    advancedChartData(statistic: string): ChartData | null {
      const chartDataSchema: ChartData = {
        label: statistic,
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
.company-container {
  background: linear-gradient($dark 50%, $white 50%);
  padding: 1rem;
}

.company-link {
  display: block;
  width: max-content;
  margin: 0 auto;
}

.price {
  display: block;
}

.img {
  background: $ivory;
  padding: 2rem;
  margin: 3rem;
  border-radius: 50%;
  box-shadow: 3px 3px 12px #ccc, -3px -3px 6px $dark;
}
</style>
