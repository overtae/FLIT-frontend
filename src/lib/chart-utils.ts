export function formatYAxisValue(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}만`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}천`;
  }
  return value.toString();
}

export function formatYAxisValueShort(value: number): string {
  if (value >= 100000000) {
    return `${Math.round(value / 100000000)}억`;
  }
  if (value >= 10000) {
    return `${Math.round(value / 10000)}만`;
  }
  if (value >= 1000) {
    return `${Math.round(value / 1000)}천`;
  }
  return value.toString();
}

export const DEFAULT_CHART_MARGIN = {
  top: 5,
  right: 30,
  left: 60,
  bottom: 5,
};
