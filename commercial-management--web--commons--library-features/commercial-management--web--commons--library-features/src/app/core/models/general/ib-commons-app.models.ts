/**
 * From IBIS dictionary
 */
export type IbGender = "Male" | "Female";

/**
 * Iberia front state interface for stores
 */
export type State<T, X = unknown> = {
  isLoading: boolean;
  value?: T;
  error?: X;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
