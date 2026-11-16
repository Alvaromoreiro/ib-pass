
export class MmBUtilsSharedServiceMock {
    'getFormatedDate' = jasmine.createSpy('getFormatedDate').and.callFake(() => {});
    'isUserLogged' = jasmine.createSpy('isUserLogged').and.callFake(() => {});
    'updateQuadrigam' = jasmine.createSpy('isUserLogged').and.callFake(() => {});
    'getProcessByStatus' =  jasmine.createSpy('getProcessByStatus').and.callFake(() => {return 'test'});
    'updateSisterCitiesModel' = jasmine.createSpy('updateSisterCitiesModel').and.callFake(() => {});
}
