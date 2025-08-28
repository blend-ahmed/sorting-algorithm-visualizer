import type { AlgoEntry } from "./types";
import {
  bubbleSort,
  insertionSort,
  selectionSort,
  mergeSort,
  quickSort,
} from "./components/Algorithms";

export const ALGORITHMS = {
  "Bubble Sort": {
    run: bubbleSort,
    description:
      "Repeatedly compares adjacent elements and swaps them when they are out of order.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
  },
  "Insertion Sort": {
    run: insertionSort,
    description:
      "Iteratively inserts each new element of the unsorted portion of a list into its correct spot.",
    complexity: {
      time: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
  },
  "Selection Sort": {
    run: selectionSort,
    description:
      "Repeatedly finds the minimum value in the unsorted portion and swaps it to its correct position.",
    complexity: {
      time: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
      space: "O(1)",
    },
  },
  "Merge Sort": {
    run: mergeSort,
    description:
      "Divides the list into two halves, recursively sorts the two halves, then merges them back together into one sorted list.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
      space: "O(n)",
    },
  },
  "Quick Sort": {
    run: quickSort,
    description:
      "Partitions the array around a pivot by placing the pivot in its correct position on each pass.",
    complexity: {
      time: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
      space: "O(log n)",
    },
  },
} as const satisfies Record<string, AlgoEntry>;

export type AlgoName = keyof typeof ALGORITHMS;
