import { memo } from "react";
import { motion } from "framer-motion";

type BarsProps = {
  arr: number[];
  maxVal: number;
  comparing: Set<number>;
  swapping: Set<number>;
  pivotIdx: number | null;
  sortedSet: Set<number>;
};

function BarsImpl({
  arr,
  maxVal,
  comparing,
  swapping,
  pivotIdx,
  sortedSet,
}: BarsProps) {
  return (
    <div
      className="flex h-full w-full items-end gap-[2px] pt-16"
      style={{ contain: "layout paint" }}
    >
      {arr.map((v, idx) => {
        const isCompare = comparing.has(idx);
        const isSwap = swapping.has(idx);
        const isPivot = pivotIdx === idx;
        const isSorted = sortedSet.has(idx);
        let cls = "bg-sky-500";
        if (isSorted) cls = "bg-emerald-500";
        else if (isPivot) cls = "bg-purple-500";
        else if (isSwap) cls = "bg-rose-500";
        else if (isCompare) cls = "bg-yellow-400";
        return (
          <motion.div
            key={idx}
            initial={false}
            animate={{ scaleY: v / maxVal }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className={`flex-1 origin-bottom rounded-t ${cls} will-change-transform`}
            style={{ height: "100%" }}
            title={`${v}`}
          />
        );
      })}
    </div>
  );
}

export const Bars = memo(BarsImpl);
