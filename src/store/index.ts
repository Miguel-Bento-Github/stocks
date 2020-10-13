import { createStore } from "vuex";
import { LiveStock } from "@/types";

const state: State = {
  stock: {
    p: 0,
    s: "",
    t: 0,
    v: 0,
  },
  time: [],
  price: [],
};

const store = createStore({
  state,
  getters: {
    time: (state): string[] => state.time,
    price: (state): number[] => state.price,
  },
  mutations: {
    setStock(state, stock: LiveStock): void {
      const toTwoDigits = (number: number): string | number =>
        number > 9 ? number : "0" + number;
      state.stock = stock;

      const date = new Date();
      const hours = date.getHours();
      const minutes = toTwoDigits(date.getMinutes());
      const seconds = toTwoDigits(date.getSeconds());

      const time = `${hours}:${minutes}:${seconds}`;
      const price = stock.p;

      if (state.time.includes(time)) return;
      state.time.push(time);
      state.price.push(price);
    },
  },
  actions: {
    setStock: (context, stock: LiveStock): void => {
      context.commit("setStock", stock);
    },
  },
  plugins: [],
});

interface State {
  stock: LiveStock;
  time: string[];
  price: number[];
}

export default store;
