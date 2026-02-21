export const bitmap = {
  get: (bitmap: number, index: number) => (bitmap & (1 << index)) !== 0,
  set: (bitmap: number, index: number, state: boolean) => (state ? bitmap | (1 << index) : bitmap & ~(1 << index)),
  setMany: (bitmap: number, state: boolean, ...indices: number[]) =>
    indices.reduce((bitmap, index) => (state ? bitmap | (1 << index) : bitmap & ~(1 << index)), bitmap),
  setMap: (bitmap: number, map: Record<number, boolean>) =>
    Object.entries(map).reduce(
      (bitmap, [index, state]) => (state ? bitmap | (1 << +index) : bitmap & ~(1 << +index)),
      bitmap,
    ),
  enable: (bitmap: number, index: number) => bitmap | (1 << index),
  enableMany: (bitmap: number, ...indices: number[]) =>
    indices.reduce((bitmap, index) => bitmap | (1 << index), bitmap),
  clear: (bitmap: number, index: number) => bitmap & ~(1 << index),
  clearMany: (bitmap: number, ...indices: number[]) =>
    indices.reduce((bitmap, index) => bitmap & ~(1 << index), bitmap),
  toggle: (bitmap: number, index: number) => bitmap ^ (1 << index),
  toggleMany: (bitmap: number, ...indices: number[]) =>
    indices.reduce((bitmap, index) => bitmap ^ (1 << index), bitmap),
  manipulate: (bitmap: number, value: (i: number) => boolean, ...indices: number[]) =>
    indices.reduce((bitmap, index) => (bitmap & ~(1 << index)) | (value(index) ? 1 << index : 0), bitmap),
};
