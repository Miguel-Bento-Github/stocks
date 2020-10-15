<template>
  <div v-if="canRender">
    <Menu :attributes="attributes" @attribute-selected="selectAttribute" />
    <section class="data">
      <header class="company-container">
        <a :aria-label="company.name" class="router-link company-link" target="_blank" rel="noopener" :href="company.weburl">
          <span>{{ company.name }}</span>
        </a>
        <a :aria-label="company.name" target="_blank" rel="noopener" :href="company.weburl">
          <img v-if="company.logo" class="img" :src="company.logo" />
        </a>
        <p :class="{ 'current-price': !company.logo }">
          Current price: {{ currentPrice || data.c.toFixed(2) }} {{ company.currency }}
        </p>
      </header>
      <Graph v-if="!attribute && canRender" class="company-chart" :chart-data="basicChartData" />
      <div v-if="attribute && canRender" class="company-chart">
        <h2>{{ normaliseCasing(attribute) }}</h2>
        <Graph :chart-data="advancedChartData" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import store from "../store";
import Graph from "../components/Graph.vue";
import Menu from "../components/Menu.vue";
import { LiveStock, Company, ChartData } from "../types/main";
import { Financials, Annual } from "../types/financial.types";
import normaliseCasing from "../util/normaliseCasing";
import router from "../router";

export default {
  name: "Company",
  components: {
    Graph,
    Menu,
  },
  data(): CompanyState {
    return {
      attributes: null,
      attribute: "",
      symbol: "",
      data: null,
      company: null,
      financials: null,
    };
  },
  computed: {
    canRender(): boolean {
      return Boolean(this.data && this.company && this.financials && this.attributes);
    },
    currentPrice(): number {
      return store.state.stock.p;
    },
    basicChartData(): ChartData {
      return {
        labels: ["Low price", "High price", "Previous close", "Open price"],
        label: this.company.name,
        data: [this.data.l, this.data.h, this.data.pc, this.data.o],
      };
    },
    advancedChartData(): ChartData | null {
      const statistics: Annual[] | null = this.financials?.series?.annual[this.attribute] || null;
      if (!statistics) return null;

      const chartDataSchema: ChartData = {
        label: this.attribute,
        type: "line",
        labels: [],
        data: [],
      };

      statistics.forEach((att: Annual): void => {
        chartDataSchema.labels.unshift(att.period);
        chartDataSchema.data.unshift(att.v);
      });

      return chartDataSchema;
    },
    /**
     * Transform camelCased financial annual keys into readable user friendly text
     */
  },
  watch: {
    financials: {
      /**
       * If no reports can be found the user will be redirected to the homepage
       */
      handler(report: Financials): void {
        if (report.series.annual) {
          this.attributes = Object.keys(this.financials.series.annual);
        } else {
          router.push("/");
        }
      },
    },
  },
  mounted(): void {
    this.symbol = this.$route.params.id.toUpperCase();
    this.findStock();
    this.findCompany();
    this.findFinancials();
  },
  updated(): void {
    if (this.canRender) document.title = this.company.name;
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
    selectAttribute(attribute: string): void {
      this.attribute = attribute;
    },

    normaliseCasing,
  },
};

export interface CompanyState {
  attribute: string;
  symbol: string;
  data: LiveStock | null;
  company: Company | null;
  financials: Financials | null;
  attributes: string[] | null;
}
</script>

<style lang="scss" scoped>
.data {
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.company-container {
  background: linear-gradient($dark 50%, $white 50%);
  padding: 1rem;
  justify-self: flex-start;
}

.company-link {
  display: block;
  width: max-content;
  margin: 0 auto;
}

.company-chart {
  margin: auto;
}

.current-price {
  padding-top: 2rem;
}

.img {
  background: $ivory;
  padding: 2rem;
  margin: 3rem;
  border-radius: 50%;
  box-shadow: 3px 3px 6px $light, -3px -3px 6px $dark;
}
</style>
