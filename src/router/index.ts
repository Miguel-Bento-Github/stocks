import { Component, nextTick } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: {
      title: "MoneyWell",
      metaTags: [
        {
          name: "description",
          content: "The home page of our app.",
        },
      ],
    },
    component: (): Component => import("@/views/Home.vue"),
  },
  {
    path: "/:id",
    name: "company",
    meta: {
      title: "Company overview",
      metaTags: [
        {
          name: "description",
          content: "Here you can find all sorts of statistics about each individual company",
        },
      ],
    },
    component: (): Component => import("@/views/Company.vue"),
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: Home },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.resolve({
  name: "not-found",
  params: { pathMatch: ["not", "found"] },
}).href;

router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = to.meta.title || "MoneyWell";
  });
});

export default router;
