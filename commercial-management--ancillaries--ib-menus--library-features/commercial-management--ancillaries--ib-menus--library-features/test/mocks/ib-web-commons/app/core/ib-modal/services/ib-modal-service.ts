export class CommonsModalService {
    public openBuildGenericModal (
        _scope: unknown,
        _template: string,
        _classes: string,
        _controller: string
    ): never {
        throw new Error('CommonsModalService mock must be configured by the test');
    }

    public showGenericError (): never {
        throw new Error('CommonsModalService mock must be configured by the test');
    }

    public showWaitingModal (): never {
        throw new Error('CommonsModalService mock must be configured by the test');
    }

    public finishWaiting (): void {
        throw new Error('CommonsModalService mock must be configured by the test');
    }

    public closeAllCurrentModals (): void {
        throw new Error('CommonsModalService mock must be configured by the test');
    }
}
