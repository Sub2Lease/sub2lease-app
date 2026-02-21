export function compareStrings(a: string, b: string) {
  return a.localeCompare(b);
}

export function compareNumbers(a: number, b: number) {
  return a - b;
}

function getHighestValue<T>(arr: T[], value: keyof T): number {
  return arr.reduce((acc, item) => {
    const val = item[value];
    if (typeof val === "number") {
      return val > acc ? val : acc;
    }
    return acc;
  }, 0);
}

function getValue<T>(arr: T[], value: keyof T): number {
  if (arr.length === 0) return 0;
  if (arr.length === 1 && typeof arr[0][value] === "number") return arr[0][value] as number;

  return getHighestValue(arr, value);
}

export function compareArraysWithNumberValue<T>(a: T[], b: T[], value: keyof T): number {
  const valueA = getValue(a, value);
  const valueB = getValue(b, value);

  return compareNumbers(valueA, valueB);
}
