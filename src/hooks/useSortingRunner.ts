import { useEffect, useMemo, useRef, useState } from "react";
import type { Step, AlgoEntry } from "../types";
import { makeRandomArray, msFromSpeed, sleep } from "../lib/utils";

export function useSortingRunner<Algos extends Record<string, AlgoEntry>>(
  ALGOS: Algos,
  opts?: {
    defaultAlgoName?: keyof Algos;
    defaultSize?: number;
    defaultSpeed?: number;
  }
) {
  type AlgoName = keyof Algos;
  const [algoName, setAlgoName] = useState<AlgoName>(
    opts?.defaultAlgoName ?? (Object.keys(ALGOS)[0] as AlgoName)
  );
  const [size, setSize] = useState<number>(opts?.defaultSize ?? 40);
  const [speed, setSpeed] = useState<number>(opts?.defaultSpeed ?? 100);
  const speedRef = useRef<number>(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const [arr, setArr] = useState<number[]>(() => makeRandomArray(size));
  const initialArrRef = useRef<number[]>([]);
  useEffect(() => {
    initialArrRef.current = arr.slice();
  }, []);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [writes, setWrites] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const abortRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    runningRef.current = running;
    pausedRef.current = paused;
  }, [running, paused]);

  const lastResumeRef = useRef(0);
  const elapsedOffsetRef = useRef(0);

  const comparing = useRef<Set<number>>(new Set());
  const swapping = useRef<Set<number>>(new Set());
  const pivotIdx = useRef<number | null>(null);
  const sortedSet = useRef<Set<number>>(new Set());

  const maxVal = useMemo(
    () => arr.reduce((m, v) => (v > m ? v : m), 100),
    [arr]
  );

  const resetHighlights = (): void => {
    comparing.current = new Set();
    swapping.current = new Set();
    pivotIdx.current = null;
    sortedSet.current = new Set();
  };

  const stopRaf = (): void => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const newArray = (n: number = size): void => {
    abortRef.current = true;
    stopRaf();
    runningRef.current = false;
    pausedRef.current = false;
    setRunning(false);
    setPaused(false);
    resetHighlights();
    setComparisons(0);
    setSwaps(0);
    setWrites(0);
    setElapsedMs(0);
    elapsedOffsetRef.current = 0;
    lastResumeRef.current = 0;
    const next = makeRandomArray(n);
    setArr(next);
    initialArrRef.current = next.slice();
  };

  useEffect(() => {
    if (!runningRef.current) {
      const next = makeRandomArray(size);
      setArr(next);
      initialArrRef.current = next.slice();
      resetHighlights();
    }
  }, [size]);

  const applyStep = (step: Step): void => {
    if (!step) return;
    if (step.type === "compare") {
      comparing.current = new Set([step.i, step.j]);
      setComparisons((c) => c + 1);
    } else if (step.type === "swap") {
      swapping.current = new Set([step.i, step.j]);
      setSwaps((s) => s + 1);
      setWrites((w) => w + 2);
      setArr((prev) => {
        const next = prev.slice();
        [next[step.i], next[step.j]] = [next[step.j], next[step.i]];
        return next;
      });
    } else if (step.type === "overwrite") {
      setWrites((w) => w + 1);
      setArr((prev) => {
        const next = prev.slice();
        next[step.i] = step.value;
        return next;
      });
    } else if (step.type === "pivot") {
      pivotIdx.current = step.index;
    } else if (step.type === "markSorted") {
      sortedSet.current = new Set(sortedSet.current).add(step.index);
    }
  };

  const startTimerLoop = (): void => {
    const tick = (): void => {
      if (runningRef.current && !pausedRef.current) {
        const now = performance.now();
        setElapsedMs(elapsedOffsetRef.current + (now - lastResumeRef.current));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const run = async (): Promise<void> => {
    if (runningRef.current) return;
    abortRef.current = false;
    resetHighlights();
    setRunning(true);
    runningRef.current = true;
    setPaused(false);
    pausedRef.current = false;
    setComparisons(0);
    setSwaps(0);
    setWrites(0);
    setElapsedMs(0);
    elapsedOffsetRef.current = 0;
    lastResumeRef.current = performance.now();

    initialArrRef.current = arr.slice();

    const gen = ALGOS[algoName].run(arr.slice());

    startTimerLoop();

    try {
      let next = gen.next();
      while (!next.done) {
        if (abortRef.current) throw new Error("aborted");

        while (pausedRef.current) {
          if (abortRef.current) throw new Error("aborted");
          await sleep(25);
        }

        if (abortRef.current) throw new Error("aborted");

        applyStep(next.value as Step);
        await sleep(msFromSpeed(speedRef.current));
        comparing.current = new Set();
        swapping.current = new Set();
        next = gen.next();
      }

      comparing.current = new Set();
      swapping.current = new Set();
      pivotIdx.current = null;
      sortedSet.current = new Set(arr.map((_, i) => i));
    } catch {
    } finally {
      stopRaf();
      setRunning(false);
      runningRef.current = false;
      setPaused(false);
      pausedRef.current = false;
    }
  };

  const handlePause = (): void => {
    if (!runningRef.current || pausedRef.current) return;
    setPaused(true);
    pausedRef.current = true;
    elapsedOffsetRef.current += performance.now() - lastResumeRef.current;
  };

  const handleResume = (): void => {
    if (!runningRef.current || !pausedRef.current) return;
    setPaused(false);
    pausedRef.current = false;
    lastResumeRef.current = performance.now();
    startTimerLoop();
  };

  const handleReset = (): void => {
    abortRef.current = true;
    stopRaf();
    runningRef.current = false;
    pausedRef.current = false;
    setRunning(false);
    setPaused(false);
    resetHighlights();
    setComparisons(0);
    setSwaps(0);
    setWrites(0);
    setElapsedMs(0);
    elapsedOffsetRef.current = 0;
    lastResumeRef.current = 0;
    setArr(initialArrRef.current.slice());
  };

  const algoMeta = useMemo(() => ALGOS[algoName], [algoName]);

  return {
    algoName,
    setAlgoName,
    size,
    setSize,
    speed,
    setSpeed,

    arr,
    maxVal,

    running,
    paused,
    comparisons,
    swaps,
    writes,
    elapsedMs,

    comparing,
    swapping,
    pivotIdx,
    sortedSet,

    run,
    handlePause,
    handleResume,
    handleReset,
    newArray,

    algoMeta,
  } as const;
}
