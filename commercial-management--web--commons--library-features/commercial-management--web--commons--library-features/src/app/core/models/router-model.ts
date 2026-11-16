namespace CommonsRouterNamespace {
  export type preconditionStructure = {
    [key: string]: stateType;
  };
  export type stateType = {
    transitionEvaluator: Function;
    otherwise: otherwise;
  };
  export type otherwise =
    | string
    | {
        uri: string;
        externalRedirect: boolean;
      };
}
