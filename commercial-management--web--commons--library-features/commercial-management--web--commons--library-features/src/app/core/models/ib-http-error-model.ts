namespace IbHttpErrorModelNamespace {
  export type ErrorGeneric = {
    errors?: ErrorGenericData[];
    error?: string;
  };

  export type ErrorGenericResponse = {
    data: ErrorGeneric;
    errorCode: number;
  };

  export type ErrorGenericData = {
    code: string;
    reason: string;
    uuid?: any;
    timeStamp: string;
  };
}
