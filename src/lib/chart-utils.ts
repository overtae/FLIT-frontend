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

export function formatNumberShort(value: number): string {
  const absValue = Math.abs(value);

  if (absValue >= 1000000000000) {
    const jo = value / 1000000000000;
    return `${jo.toFixed(1)}조`;
  }
  if (absValue >= 100000000) {
    const eok = value / 100000000;
    return `${eok.toFixed(1)}억`;
  }
  if (absValue >= 100000) {
    const man = value / 10000;
    return `${man.toFixed(1)}만`;
  }
  return value.toString();
}

export const DEFAULT_CHART_MARGIN = {
  top: 5,
  right: 30,
  left: 60,
  bottom: 5,
};
