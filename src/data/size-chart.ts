export type SizeRow = {
  size: "XS" | "S" | "M" | "L";
  thumb: number;
  index: number;
  middle: number;
  ring: number;
  pinky: number;
};

export const SIZE_CHART_MM: SizeRow[] = [
  { size: "XS", thumb: 15, index: 12, middle: 13, ring: 11, pinky: 8 },
  { size: "S", thumb: 16, index: 13, middle: 14, ring: 12, pinky: 9 },
  { size: "M", thumb: 17, index: 13, middle: 14, ring: 12, pinky: 10 },
  { size: "L", thumb: 18, index: 14, middle: 15, ring: 13, pinky: 10.5 },
];

export const SIZE_LABELS = SIZE_CHART_MM.map((r) => r.size);
