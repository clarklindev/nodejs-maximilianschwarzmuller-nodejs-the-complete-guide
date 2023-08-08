export const floatWithTwoDecimals = (value: string) => {
  if (!value || !/^\d+(\.\d{2})$/.test(value)) {
    return 'must be a float with exactly two decimal places';
  }
};
