import { useState } from "react";
import Partition from "./Partition";

import type { PartitionData } from "../types";

const initialTree: PartitionData = {
  id: 1,
  color: "bg-purple-200",
};

function PartitionRoot() {
  const [tree, setTree] = useState<PartitionData>(initialTree);

  function handleChange(next: PartitionData | null) {
    if (next === null) {
      return;
    }
    setTree(next);
  }

  return (
    <div className="w-full h-screen">
      <Partition data={tree} onChange={handleChange} />
    </div>
  );
}

export default PartitionRoot;
