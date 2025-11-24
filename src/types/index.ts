export type PartitionData = {
  id: number;
  type?: "h" | "v"; // split type (horizontal/vertical)
  ratio?: number; // split ratio (0–1)
  color?: string; // leaf only
  children?: [PartitionData, PartitionData];
};
