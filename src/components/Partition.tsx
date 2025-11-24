import { useState, useRef } from "react";
import type { PartitionData } from "../types";

type PartitionProps = {
  data: PartitionData;
  onChange: (next: PartitionData | null) => void;
};

function Partition({ data, onChange }: PartitionProps) {
  const isLeaf = !data.children;
  const isVertical = data.type === "v";

  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(data.ratio ?? 0.5);

  // Helper: Update a specific child or collapse parent
  function updateChild(index: 0 | 1, next: PartitionData | null) {
    if (next === null) {
      // Collapse parent: the other child becomes the parent
      const otherIndex = index === 0 ? 1 : 0;
      return onChange(data.children![otherIndex]);
    }

    const clone: PartitionData = {
      ...data,
      children: [...data.children!],
    };

    if (clone.children) {
      clone.children[index] = next;
      onChange(clone);
    }
  }

  // Leaf node
  if (isLeaf) {
    return (
      <div
        className={`w-full h-full ${data.color ?? "bg-gray-200"} 
                    flex items-center justify-center`}
      >
        <div className="flex gap-2">
          {/* H SPLIT */}
          <button
            className="px-2 py-1 bg-blue-500 text-white text-sm rounded"
            onClick={() =>
              onChange({
                id: data.id,
                type: "h",
                ratio: 0.5,
                children: [
                  { id: Date.now(), color: "bg-blue-100" },
                  { id: Date.now() + 1, color: "bg-blue-200" },
                ],
              })
            }
          >
            H
          </button>

          {/* V SPLIT */}
          <button
            className="px-2 py-1 bg-green-500 text-white text-sm rounded"
            onClick={() =>
              onChange({
                id: data.id,
                type: "v",
                ratio: 0.5,
                children: [
                  { id: Date.now(), color: "bg-green-100" },
                  { id: Date.now() + 1, color: "bg-green-200" },
                ],
              })
            }
          >
            V
          </button>

          {/* DELETE */}
          <button
            className="px-2 py-1 bg-red-500 text-white text-sm rounded"
            onClick={() => onChange(null)}
          >
            D
          </button>
        </div>
      </div>
    );
  }

  // DRAG HANDLER
  function startDrag(e: React.MouseEvent) {
    e.preventDefault();
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return;

    const onMove = (ev: MouseEvent) => {
      if (isVertical) {
        const r = (ev.clientY - box.top) / box.height;
        setRatio(Math.min(0.95, Math.max(0.05, r)));
      } else {
        const r = (ev.clientX - box.left) / box.width;
        setRatio(Math.min(0.95, Math.max(0.05, r)));
      }
    };

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      // persist ratio to parent
      onChange({ ...data, ratio });
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  // LAYOUT CALC
  const barClass = isVertical
    ? "h-1 w-full cursor-row-resize bg-gray-400"
    : "w-1 h-full cursor-col-resize bg-gray-400";

  const child1Style = isVertical
    ? { height: `${ratio * 100}%` }
    : { width: `${ratio * 100}%` };

  const child2Style = isVertical
    ? { height: `${(1 - ratio) * 100}%` }
    : { width: `${(1 - ratio) * 100}%` };

  // SPLIT NODE
  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex ${isVertical ? "flex-col" : "flex-row"}`}
    >
      <div style={child1Style}>
        <Partition
          data={data.children![0]}
          onChange={(next) => updateChild(0, next)}
        />
      </div>

      <div className={barClass} onMouseDown={startDrag} />

      <div style={child2Style}>
        <Partition
          data={data.children![1]}
          onChange={(next) => updateChild(1, next)}
        />
      </div>
    </div>
  );
}

export default Partition;
