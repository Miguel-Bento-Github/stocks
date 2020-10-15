<template>
  <div class="chart">
    <canvas ref="chart" />
  </div>
</template>

<script lang="ts">
import Chart from "chart.js";
import { ChartData } from "@/types/main";
import { defineComponent } from "vue";
import colorList from "@/util/colorList";

export default defineComponent({
  name: "Graph",
  props: {
    chartData: { required: true, type: Object as () => ChartData },
    realTime: { required: false, type: Boolean, default: true },
  },
  data(): { chart: Chart | null; updatedData: ChartData | null } {
    return {
      chart: null,
      updatedData: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      /**
       * this will trigger a new render with live data
       */
      handler(): void {
        if (this.realTime) {
          this.chart.update();
        }
      },
    },
  },
  mounted() {
    this.drawChart();
  },
  /**
   * This will update chart data and datasets when the prop changes
   */
  updated() {
    const { label, labels, data, type } = this.chartData;
    this.chart.config.type = type;
    this.chart.config.labels = labels;
    this.chart.config.data.datasets[0].label = label;
    this.chart.config.data.datasets[0].data = data;
    this.chart.update();
  },
  methods: {
    /**
     * Chart.js doc can be found here
     * {@link https://www.chartjs.org/docs/latest/}
     *
     * Due to the size of the chart configuration this documentation will be inside the function.
     */
    drawChart(): void {
      /**
       * Similar to a getElementById but in a vuesque way of writing. More info here
       * {@link https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements}
       */
      const context: CanvasRenderingContext2D = this.$refs.chart.getContext("2d");
      const colors: Set<string> = new Set(["rgba(82, 72, 156, 0.3)"]);

      /**
       * Will fill the colors array with any random colour from the list
       */
      if (this.chartData.type !== "line") {
        colors.clear();
        for (let i = 0; i < this.chartData.data.length; i++) {
          colors.add(colorList[Math.floor(Math.random() * colorList.length)]);
        }
      }

      this.chart = new Chart(context, {
        type: this.chartData.type || "bar",
        data: {
          labels: this.chartData.labels,
          datasets: [
            {
              label: this.chartData.label,
              data: this.chartData.data,
              backgroundColor: Array.from(colors),
              borderColor: Array.from(colors),
              borderWidth: 2,
              pointStyle: "circle",
              spanGaps: true,
              pointRadius: 2,
              pointHitRadius: 100000,
              pointHoverRadius: 2,
              barPercentage: 0.6,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  fontFamily: "Cutive Mono",
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  lineWidth: 1,
                },
                ticks: {
                  fontFamily: "Cutive Mono",
                },
              },
            ],
          },
          aspectRatio: window.matchMedia("(max-width: 960px)").matches ? 1 : 2,
          legend: {
            display: false,
          },
        },
      });
    },
  },
});
</script>

<style lang="scss">
.price {
  display: block;
}

.img {
  margin: 3rem;
  border-radius: 50%;
  box-shadow: 3px 2px 6px $light, -3px -3px 6px $dark;
}

.chart {
  margin: 5rem auto 0;
  width: 70vw;
  min-height: 40vh;
}
</style>
