const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

export const NumberExtension = {
  isEven,
} as const;
