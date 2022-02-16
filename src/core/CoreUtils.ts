export async function asyncFilter<T>(
  arr: T[],
  predicate: (x: T) => Promise<boolean>
): Promise<T[]> {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
}

export function groupBy<T>(list: T[], keyGetter: (value: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
export const distinct = <T>(value: T, index: number, self: T[]): boolean => {
  return self.indexOf(value) === index;
};
export const distinctBy = <T>(array: T[], key: keyof T): T[] => {
  return [...new Map(array.map(item => [item[key], item])).values()];
};
export const isDefined = <T>(item: T | undefined): item is T => {
  return !!item;
};
