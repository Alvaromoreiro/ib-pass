namespace CommonExecModel {
  export interface IExecutable {
    getName(): string;
    getCurrentState(): ExecutableState;
    execFunction(data?): void;
    getResult(): IExecutableResult;
    setChainedActions(fun: Function);
  }
  export type CommonExec = {
    name: string;
    resolvePromise: boolean;
    execFunction: Function;
    success?: CommonExec;
    error?: CommonExec;
  };
  interface IExecutableResult {
    setStatus(result: ExecutableResult): void;
    getStatus(): ExecutableResult;
    setData(data: any): void;
    getData(): any;
  }

  enum ExecutableState {
    PENDING,
    RUNNING,
    FINISHED,
  }
  enum ExecutableResult {
    INITIALIZED,
    SUCCESS,
    FAIL,
  }
  interface IExecutableResult {
    setStatus(result: ExecutableResult): void;
    getStatus(): ExecutableResult;
    setData(data: any): void;
    getData(): any;
  }

  export class CommonExecResult implements IExecutableResult {
    private result: ExecutableResult;
    private data: any;
    constructor() {
      this.result = ExecutableResult.INITIALIZED;
    }
    setStatus(result: ExecutableResult): void {
      this.result = result;
    }
    getStatus(): ExecutableResult {
      return this.result;
    }
    setData(data: any): void {
      this.data = data;
    }
    getData() {
      return this.data;
    }
  }

  export class Executable implements IExecutable {
    private name: string;
    private state: ExecutableState;
    private exec: Function;
    private data: any;
    private upNext: Function;
    private failed: CommonsErrorsModel.IManageError;
    constructor(
      name: string,
      exec: Function,
      failed: CommonsErrorsModel.IManageError,
    ) {
      this.name = name;
      this.exec = exec;
      this.state = ExecutableState.PENDING;
      this.failed = failed;
    }
    getName = (): string => {
      return this.name;
    };
    getCurrentState = (): ExecutableState => {
      return this.state;
    };
    execFunction = (data?): void => {
      let err: CommonsErrorsModel.ErrorDataGeneralDataErrors;
      this.state = ExecutableState.RUNNING;
      this.data = data;
      try {
        this.execProc(this.exec(data), ExecutableResult.SUCCESS, this.upNext);
      } catch (error: any) {
        err = {
          code: error.errorCode,
          reason: error,
        };
        this.failed.action(err);
      }
    };
    getResult = (): IExecutableResult => {
      return this.data;
    };
    setChainedActions = (upNext: Function) => {
      this.upNext = upNext;
    };
    private execProc(data: any, status: ExecutableResult, next: Function) {
      this.state = ExecutableState.FINISHED;
      next(data ? data : this.data);
    }
  }

  export class AsyncExecutable implements IExecutable {
    private name: string;
    private state: ExecutableState;
    private exec: Function;
    private data: IExecutableResult;
    private upNext: Function;
    private failed: CommonsErrorsModel.IManageError;
    constructor(
      name: string,
      exec: Function,
      failed: CommonsErrorsModel.IManageError,
    ) {
      this.name = name;
      this.exec = exec;
      this.state = ExecutableState.PENDING;
      this.data = new CommonExecResult();
      this.failed = failed;
    }
    getName = (): string => {
      return this.name;
    };
    getCurrentState = (): ExecutableState => {
      return this.state;
    };
    execFunction = (data): void => {
      this.state = ExecutableState.RUNNING;
      this.exec(data).then(this.execProc, this.processError);
    };
    getResult = (): IExecutableResult => {
      return this.data;
    };
    setChainedActions = (upNext: Function) => {
      this.upNext = upNext;
    };
    private processError = (error) => {
      const err: CommonsErrorsModel.ErrorDataGeneralDataErrors = {
        code: error.code,
        reason: error.data,
      };
      this.data.setStatus(ExecutableResult.FAIL);
      this.state = ExecutableState.FINISHED;
      this.failed.action(err);
    };
    private execProc = (data: any) => {
      this.data.setData(data);
      this.data.setStatus(ExecutableResult.SUCCESS);
      this.state = ExecutableState.FINISHED;
      this.upNext(data);
    };
  }
}
