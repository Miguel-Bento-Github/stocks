import { createStore } from "vuex";
import { Stock } from "../types";

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
    time: (state) => state.time,
    price: (state) => state.price,
  },
  mutations: {
    setStock(state, stock: Stock) {
      state.stock = stock;

      const date = new Date(stock.t * 1000);
      const minutes = date.getMinutes();
      const time = `${date.getHours()}:${minutes > 9 ? minutes : "0" + minutes}:${date.getSeconds()}`;
      const price = stock.p;

      if (state.time.includes(time)) return;
      state.time.push(time);
      state.price.push(price);
    },
  },
  actions: {
    setStock: (context, stock: Stock) => {
      context.commit("setStock", stock);
    },
  },
  plugins: [],
});

interface State {
  stock: Stock;
  time: string[];
  price: number[];
}

export default store;
