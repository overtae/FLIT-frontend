export type AgeData = {
  age: string;
  count: number;
};

export type ItemRanking = {
  rank: number;
  name: string;
  count: number;
};

export type StackedBarData = {
  item: string;
  [ageGroup: string]: string | number;
};

export type GenderData = {
  name: string;
  value: number;
};

export type CustomerAnalysisParams = {
  period?: "last-week" | "last-month" | "last-year";
  date?: string;
};

export type CustomerAnalysisResponse = {
  ageData: AgeData[];
  genderData: GenderData[];
  topItems: ItemRanking[];
  allItems: ItemRanking[];
  stackedBarData: StackedBarData[];
};
