<template>
  <transition name="fade">
    <div class="chart">
      <canvas ref="chart" />
    </div>
  </transition>
</template>

<script lang="ts">
import Chart from "chart.js";
import { ChartData } from "../types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Graph",
  props: {
    chartData: { required: true, type: Object as () => ChartData },
  },
  data(): { chart: Chart | null } {
    return {
      chart: null,
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(): void {
        this.chart.update();
      },
    },
  },
  mounted() {
    this.drawChart();
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
      const colors: string[] = ["rgba(82, 72, 156, 0.2)"];

      /**
       * Will fill the colors array with any random colour from the list
       */
      if (this.chartData.type !== "line") {
        const colorList = ["rgba(182, 203, 158, 0.5)", "rgba(247, 80, 38, 0.5)", "rgba(55, 61, 32, 0.5)", "rgba(82, 72, 156, 0.5)"];
        colors.pop();
        for (let i = 0; i < this.chartData.data.length; i++) {
          colors.push(colorList[Math.floor(Math.random() * colorList.length)]);
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
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 0.5,
              pointStyle: "circle",
              spanGaps: true,
              pointRadius: 2,
              pointHitRadius: 100000,
              pointHoverRadius: 5,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                gridLines: {
                  lineWidth: 0.3,
                },
              },
            ],
          },
          aspectRatio: window.matchMedia("(max-width: 450px)").matches ? 1 : 2,
          legend: {
            display: false,
            labels: {
              fontFamily: "Avenir",
            },
          },
        },
      });
    },
  },
});
</script>

<style>
.price {
  display: block;
}

.img {
  margin: 3rem;
  border-radius: 50%;
  box-shadow: 3px 3px 12px #090916, -3px -3px 6px #25255a;
}

.chart {
  margin: 2rem auto;
  width: 70vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
