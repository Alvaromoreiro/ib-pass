class ModalGenericObject  {
    componentInstance = {
        model: {} as any
    }
    result= Promise.resolve() 
}


export class IbCModalServiceMock {
    
    public showGenericComponentModalResponse = new ModalGenericObject();


    public showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(
        () => this.showGenericComponentModalResponse);
    
    public showGenericModalResponse = new ModalGenericObject();
    public showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => this.showGenericModalResponse);

}
