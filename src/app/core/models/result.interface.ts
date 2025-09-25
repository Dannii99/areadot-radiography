export interface LastResult {
  totalPoints: number;
  pointsOnStain: number;
  totalArea: number;
  estimatedStainArea: number;
};

export interface ResultRow extends LastResult {
  date: Date;
};

