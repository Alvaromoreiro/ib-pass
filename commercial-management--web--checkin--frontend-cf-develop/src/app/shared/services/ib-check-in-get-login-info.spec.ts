import * as angular from 'angular';

import { CkiCommonsGetLoginInfoService } from './ib-check-in-get-login-info';

interface CustomerDataServiceMock {
    getCustomerData: jasmine.Spy;
}

interface LocationServiceMock {
    path: jasmine.Spy;
}

interface ModalServiceMock {
    showComponentModal: jasmine.Spy;
}

interface LocalStorageServiceMock {
    set: jasmine.Spy;
}

interface ModalResultMock {
    then: jasmine.Spy;
}

describe('CkiCommonsGetLoginInfoService', () => {
    let service: CkiCommonsGetLoginInfoService;
    let localStorageService: LocalStorageServiceMock;
    let customerDataService: CustomerDataServiceMock;
    let locationService: LocationServiceMock;
    let modalService: ModalServiceMock;
    let modalResult: ModalResultMock;

    beforeEach(() => {
        localStorageService = {
            set: jasmine.createSpy('set')
        };

        customerDataService = {
            getCustomerData: jasmine.createSpy('getCustomerData')
        };

        locationService = {
            path: jasmine.createSpy('path')
        };

        modalResult = {
            then: jasmine.createSpy('then')
        };

        modalService = {
            showComponentModal: jasmine
                .createSpy('showComponentModal')
                .and.returnValue({
                    result: modalResult
                })
        };

        service = new CkiCommonsGetLoginInfoService(
            localStorageService as never,
            {} as never,
            {} as never,
            {} as never,
            customerDataService as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            {} as never,
            modalService as never,
            {} as never,
            locationService as unknown as angular.ILocationService,
            {} as never,
            {} as never
        );
    });

    describe('showChangeStatusModal', () => {
        it('should reload customer data and redirect from /ibcose2', () => {
            const customerDataPromise = Promise.resolve();

            locationService.path.and.returnValue('/ibcose2');
            customerDataService.getCustomerData.and.returnValue(
                customerDataPromise
            );

            const changePageToPermanentSpy = spyOn(
                service as unknown as {
                    changePageToPermanent: () => void;
                },
                'changePageToPermanent'
            );

            service.showChangeStatusModal();

            return customerDataPromise.then(() => {
                expect(customerDataService.getCustomerData)
                    .toHaveBeenCalledTimes(1);
                expect(localStorageService.set).toHaveBeenCalledWith(
                    'reloadCustomerComplete',
                    false
                );
                expect(changePageToPermanentSpy).toHaveBeenCalledTimes(1);
                expect(modalService.showComponentModal).not.toHaveBeenCalled();
            });
        });

        it('should reload customer data and redirect from /ibcose', () => {
            const customerDataPromise = Promise.resolve();

            locationService.path.and.returnValue('/ibcose');
            customerDataService.getCustomerData.and.returnValue(
                customerDataPromise
            );

            const changePageToPermanentSpy = spyOn(
                service as unknown as {
                    changePageToPermanent: () => void;
                },
                'changePageToPermanent'
            );

            service.showChangeStatusModal();

            return customerDataPromise.then(() => {
                expect(customerDataService.getCustomerData)
                    .toHaveBeenCalledTimes(1);
                expect(localStorageService.set).toHaveBeenCalledWith(
                    'reloadCustomerComplete',
                    false
                );
                expect(changePageToPermanentSpy).toHaveBeenCalledTimes(1);
            });
        });

        it('should show the modal on a different route and redirect when it resolves', () => {
            locationService.path.and.returnValue('/checkin/passengers');

            const changePageToPermanentSpy = spyOn(
                service as unknown as {
                    changePageToPermanent: () => void;
                },
                'changePageToPermanent'
            );

            modalResult.then.and.callFake(
                (resolve: () => void, reject: () => void) => {
                    resolve();
                    return reject;
                }
            );

            service.showChangeStatusModal();

            expect(customerDataService.getCustomerData).not.toHaveBeenCalled();
            expect(modalService.showComponentModal).toHaveBeenCalledWith(
                'ibChangeStatusUserModalComponent',
                true
            );
            expect(modalResult.then).toHaveBeenCalledTimes(1);
            expect(changePageToPermanentSpy).toHaveBeenCalledTimes(1);
        });

        it('should redirect when the modal is rejected', () => {
            locationService.path.and.returnValue('/checkin/summary');

            const changePageToPermanentSpy = spyOn(
                service as unknown as {
                    changePageToPermanent: () => void;
                },
                'changePageToPermanent'
            );

            modalResult.then.and.callFake(
                (resolve: () => void, reject: () => void) => {
                    reject();
                    return resolve;
                }
            );

            service.showChangeStatusModal();

            expect(modalService.showComponentModal).toHaveBeenCalledWith(
                'ibChangeStatusUserModalComponent',
                true
            );
            expect(changePageToPermanentSpy).toHaveBeenCalledTimes(1);
        });
    });
});
