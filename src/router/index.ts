import { Component } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home.vue";

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

export default router;
