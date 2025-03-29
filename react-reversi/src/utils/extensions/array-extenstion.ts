const createMatrixWithLength = <T>(
  length: number,
  initialState: T | undefined,
): (T | undefined)[][] => {
  return Array.from({ length }, () => Array(length).fill(initialState));
};

export const ArrayExtension = {
  createMatrixWithLength,
} as const;
