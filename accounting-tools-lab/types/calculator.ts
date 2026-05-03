export type CalculatorResult<TData = unknown> = {
  isValid: boolean;
  data?: TData;
  message?: string;
};
