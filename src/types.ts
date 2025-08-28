export type Step =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "overwrite"; i: number; value: number }
  | { type: "pivot"; index: number }
  | { type: "markSorted"; index: number };

export type Algo = (input: number[]) => Generator<Step, void, unknown>;

export type Complexity = {
  time: { best: string; average: string; worst: string };
  space: string;
};

export type AlgoEntry = {
  run: Algo;
  description: string;
  complexity: Complexity;
};
