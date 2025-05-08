// manages the drag-and-drop state for lists of items.

import { defineStore } from "pinia";

export const useDragStore = defineStore("drag", () => {
  const lists = [
    ["thing 1", "thing2"],
    ["thing 3", "thing 4"],
  ];

  return { lists };
});
