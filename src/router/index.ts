import { Component } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: (): Component => import("@/views/Home.vue"),
  },
  {
    path: "/:id",
    name: "company",
    component: (): Component => import("@/components/Company.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
