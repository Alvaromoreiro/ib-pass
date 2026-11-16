namespace CommonsHttpModels {
  export type GenericResponse<T> = {
    data?: T;
    code?: number;
    status?: unknown;
  };
}
