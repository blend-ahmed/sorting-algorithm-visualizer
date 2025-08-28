import { Play, Pause, RotateCcw, Shuffle } from "lucide-react";
import { Legend } from "./components/Legend";
import { Bars } from "./components/Bars";
import { useSortingRunner } from "./hooks/useSortingRunner";
import { ALGORITHMS } from "./algorithmsMeta";

export default function App() {
  const {
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
  } = useSortingRunner(ALGORITHMS, {
    defaultAlgoName: "Bubble Sort",
    defaultSize: 40,
    defaultSpeed: 100,
  });

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="m-auto xl:scale-110">
        <div className="mx-auto max-w-6xl px-4 py-6">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-center">
              Sorting Algorithm Visualizer
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-white shadow hover:bg-slate-800 disabled:opacity-50"
                onClick={run}
                disabled={running || paused}
              >
                <Play className="h-4 w-4" /> Play
              </button>
              {running && !paused ? (
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-white shadow hover:bg-amber-600"
                  onClick={handlePause}
                >
                  <Pause className="h-4 w-4" /> Pause
                </button>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-white shadow hover:bg-amber-600 disabled:opacity-40"
                  onClick={handleResume}
                  disabled={!running}
                >
                  <Play className="h-4 w-4" /> Resume
                </button>
              )}
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-200 px-4 py-2 text-slate-900 shadow hover:bg-slate-300"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-white shadow hover:bg-sky-600"
                onClick={() => newArray(size)}
              >
                <Shuffle className="h-4 w-4" /> New Array
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 grid grid-cols-1 gap-3 rounded-3xl bg-white p-4 shadow-sm sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <label className="w-24 text-sm font-medium">Algorithm:</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none"
                value={algoName as string}
                onChange={(e) => setAlgoName(e.target.value as typeof algoName)}
                disabled={running}
              >
                {Object.keys(ALGORITHMS).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 sm:ml-8">
              <label className="w-24 text-sm font-medium">Size: {size}</label>
              <input
                type="range"
                min={5}
                max={150}
                value={size}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setSize(v);
                  if (!running) newArray(v);
                }}
                className="w-full"
                disabled={running}
              />
            </div>
            <div className="flex items-center gap-3 sm:ml-8">
              <label className="w-24 text-sm font-medium">Speed: {speed}</label>
              <input
                type="range"
                min={1}
                max={150}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </div>

          {/* Algorithm description */}
          <div className="mt-2 rounded-2xl bg-white p-3 text-sm text-slate-700 shadow-sm">
            <div className="text-center">
              <span className="font-bold">{String(algoName)}:</span>{" "}
              {algoMeta.description}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full border border-slate-200 bg-green-100 px-2 py-1">
                <b>Best:</b> {algoMeta.complexity.time.best}
              </span>
              <span className="rounded-full border border-slate-200 bg-yellow-100 px-2 py-1">
                <b>Average:</b> {algoMeta.complexity.time.average}
              </span>
              <span className="rounded-full border border-slate-200 bg-red-100 px-2 py-1">
                <b>Worst:</b> {algoMeta.complexity.time.worst}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1">
                <b>Space:</b> {algoMeta.complexity.space}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-2 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-slate-500">Comparisons</div>
              <div className="text-lg font-semibold">
                {comparisons.toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-slate-500">Swaps + Array Writes</div>
              <div className="text-lg font-semibold">
                {(swaps + writes).toLocaleString()}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <div className="text-slate-500">Elapsed Time</div>
              <div className="text-lg font-semibold">
                {(elapsedMs / 1000).toFixed(2)}s
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="mt-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-2">
              <div className="absolute left-2 top-2 z-10 flex gap-2 text-xs">
                <Legend color="bg-yellow-400" label="Compare" />
                <Legend color="bg-rose-500" label="Swap" />
                {String(algoName) === "Quick Sort" ? (
                  <Legend color="bg-purple-500" label="Pivot" />
                ) : null}
                <Legend color="bg-emerald-500" label="Sorted" />
              </div>

              <Bars
                arr={arr}
                maxVal={maxVal}
                comparing={comparing.current}
                swapping={swapping.current}
                pivotIdx={pivotIdx.current}
                sortedSet={sortedSet.current}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Built with React + Tailwind CSS + Framer Motion.
          </div>
        </div>
      </div>
    </div>
  );
}
