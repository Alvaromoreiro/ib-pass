
export class IbCUserUtilsServiceMock {
    isIbplusResponse: boolean = false;
    isUserLoggedResponse:boolean = false;
    isUserLogged = jasmine.createSpy('isUserLogged').and.callFake(() => this.isUserLoggedResponse);
    isIbPlus = jasmine.createSpy('isIbPlus').and.callFake(() => this.isIbplusResponse);
    getUserRole = jasmine.createSpy('getUserRole').and.callFake(() => false);
    isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(() => false);
}
