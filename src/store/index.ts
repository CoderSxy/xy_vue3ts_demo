// src/store/index.ts
import { defineStore } from 'pinia';

export const indexStore = defineStore('index', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});