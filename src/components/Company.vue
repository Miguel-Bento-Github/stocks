<template>
  <div v-if="canRender">
    <aside class="navigator">
      <nav v-if="showMenu" class="navigator-list">
        <button
          v-for="attribute in attributes"
          :key="attribute"
          class="router-link navigator-link"
          @click="
            scrollTo(attribute);
            showMenu = false;
          "
        >
          {{ normaliseCasing(attribute) }}
        </button>
      </nav>
      <button :class="{ 'menu-selector-hide': showMenu }" class="menu-selector" @click="showMenu = !showMenu"></button>
    </aside>
    <section class="data">
      <header class="company-container">
        <a :aria-label="company.name" target="_blank" rel="noopener" :href="company.weburl">
          <h2>
            <span class="router-link">
              {{ company.name }}
            </span>
          </h2>
          <img v-if="company.logo" class="img" :src="company.logo" />
        </a>
      </header>
      <Graph v-if="canRender" :chart-data="basicChartData" />
    </section>
    <div v-if="canRender">
      <section v-for="attribute in attributes" :id="attribute" :key="attribute">
        <h3 class="attribute">
          {{ normaliseCasing(attribute) }}
        </h3>
        <Graph :chart-data="advancedChartData(attribute)" />
      </section>
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
      showMenu: false,
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
    scrollTo(location: string): void {
      document?.getElementById(location)?.scrollIntoView();
    },
    normaliseCasing,
  },
};
</script>

<style lang="scss" scoped>
.line {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  top: 0;
  left: 0;
  background: $light;
  transition: transform 250ms ease-in-out;
}

.navigator {
  background: $dark;
  color: $ivory;
  text-align: left;
  padding: 1rem;
}

.navigator-hitpoints {
  cursor: pointer;
  width: min-content;
}

.navigator-link {
  display: block;
  box-shadow: none;
  margin: 1rem 0;

  &::before {
    width: 0;
  }
}

.menu-selector {
  all: unset;
  margin: 1rem;
  position: fixed;
  top: 8px;
  right: 8px;
  height: 24px;
  width: 32px;
  cursor: pointer;

  &::before {
    @extend .line;
    transform: translateY(4px);
  }

  &::after {
    @extend .line;
    transform: translateY(-4px);
  }

  &:hover::before {
    transform: translateY(-4px);
  }

  &:hover::after {
    transform: translateY(4px);
  }

  &-hide::after {
    display: none;
  }
}

.company-container {
  background: linear-gradient($dark 50%, $white 50%);
  padding: 1rem;
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
