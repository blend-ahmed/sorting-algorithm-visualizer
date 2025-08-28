import type { Step } from "../types";

const emitSwap = (a: number[], i: number, j: number): Step => {
  [a[i], a[j]] = [a[j], a[i]];
  return { type: "swap", i, j } as const;
};

export function* bubbleSort(input: number[]): Generator<Step, void, unknown> {
  const a = input.slice();
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: "compare", i: j, j: j + 1 };
      if (a[j] > a[j + 1]) {
        yield emitSwap(a, j, j + 1);
        swapped = true;
      }
    }
    yield { type: "markSorted", index: n - 1 - i };
    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++)
        yield { type: "markSorted", index: k };
      break;
    }
  }
}

export function* insertionSort(
  input: number[]
): Generator<Step, void, unknown> {
  const a = input.slice();
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0) {
      yield { type: "compare", i: j, j: j + 1 };
      if (a[j] > key) {
        a[j + 1] = a[j];
        yield { type: "overwrite", i: j + 1, value: a[j] };
        j--;
      } else {
        break;
      }
    }
    if (a[j + 1] !== key) {
      a[j + 1] = key;
      yield { type: "overwrite", i: j + 1, value: key };
    }
  }
  for (let i = 0; i < a.length; i++) yield { type: "markSorted", index: i };
}

export function* selectionSort(
  input: number[]
): Generator<Step, void, unknown> {
  const a = input.slice();
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", i: min, j };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) yield emitSwap(a, i, min);
    yield { type: "markSorted", index: i };
  }
}

export function* quickSort(input: number[]): Generator<Step, void, unknown> {
  const a = input.slice();
  const stack: Array<[number, number]> = [[0, a.length - 1]];

  while (stack.length) {
    const [lo, hi] = stack.pop()!;
    if (lo >= hi) {
      if (lo === hi) yield { type: "markSorted", index: lo };
      continue;
    }
    const pivot = a[hi];
    let i = lo;
    yield { type: "pivot", index: hi };
    for (let j = lo; j < hi; j++) {
      yield { type: "compare", i: j, j: hi };
      if (a[j] <= pivot) {
        if (i !== j) yield emitSwap(a, i, j);
        i++;
      }
    }
    if (i !== hi) yield emitSwap(a, i, hi);
    yield { type: "markSorted", index: i };

    const leftSize = i - 1 - lo;
    const rightSize = hi - (i + 1);
    if (leftSize > rightSize) {
      if (lo < i - 1) stack.push([lo, i - 1]);
      if (i + 1 < hi) stack.push([i + 1, hi]);
    } else {
      if (i + 1 < hi) stack.push([i + 1, hi]);
      if (lo < i - 1) stack.push([lo, i - 1]);
    }
  }
}

export function* mergeSort(input: number[]): Generator<Step, void, unknown> {
  const a = input.slice();
  const tmp = a.slice();

  function* merge(
    lo: number,
    mid: number,
    hi: number
  ): Generator<Step, void, unknown> {
    let i = lo,
      j = mid + 1,
      k = lo;
    while (i <= mid && j <= hi) {
      yield { type: "compare", i, j };
      if (a[i] <= a[j]) tmp[k++] = a[i++];
      else tmp[k++] = a[j++];
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    for (let t = lo; t <= hi; t++) {
      a[t] = tmp[t];
      yield { type: "overwrite", i: t, value: a[t] };
    }
  }

  function* sort(lo: number, hi: number): Generator<Step, void, unknown> {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    yield* sort(lo, mid);
    yield* sort(mid + 1, hi);
    yield* merge(lo, mid, hi);
  }

  yield* sort(0, a.length - 1);
  for (let i = 0; i < a.length; i++) yield { type: "markSorted", index: i };
}
