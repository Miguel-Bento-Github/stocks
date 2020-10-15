import { Component, nextTick } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { title: "MoneyWell" },
    component: (): Component => import("@/views/Home.vue"),
  },
  {
    path: "/:id",
    name: "company",
    meta: { title: "Company overview" },
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
