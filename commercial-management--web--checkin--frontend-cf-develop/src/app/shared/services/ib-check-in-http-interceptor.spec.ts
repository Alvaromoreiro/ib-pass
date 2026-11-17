import { CkiIbHttpInterceptor } from './ib-check-in-http-interceptor';
import { CommonsConstantsType, CommonsHttpServicesConstantsType, CommonsLoginConstantsType } from 'ib-web-commons/constants';

describe('CkiIbHttpInterceptor', () => {
    let service: CkiIbHttpInterceptor;
    let location: jasmine.SpyObj<angular.ILocationService>;
    let injector: jasmine.SpyObj<ng.auto.IInjectorService>;
    let modalService: jasmine.SpyObj<CommonsModalService>;

    const servicePrivateMethods = () => service as unknown as {
        checkCustomerStatus: jasmine.Spy;
        changePageToPermanent: jasmine.Spy;
    };

    const createService = (): CkiIbHttpInterceptor => {
        location = jasmine.createSpyObj<angular.ILocationService>('location', ['path']);
        injector = jasmine.createSpyObj<ng.auto.IInjectorService>('injector', ['get']);
        modalService = jasmine.createSpyObj<CommonsModalService>('CommonsModalService', ['showComponentModal']);

        injector.get.and.returnValue(modalService);

        return new CkiIbHttpInterceptor(
            {} as CommonsRootScope,
            {} as ng.IWindowService,
            {} as ng.local.storage.ILocalStorageService,
            {},
            {},
            injector,
            {} as angular.IFilterService,
            location,
            {} as CommonsConstantsType,
            {},
            {} as CommonsLoginConstantsType,
            {},
            {} as angular.cookies.ICookiesService,
            {} as CommonsHttpServicesConstantsType,
            {},
            {}
        );
    };

    const createModalResult = (callback: () => void): void => {
        modalService.showComponentModal.and.returnValue({
            result: {
                then: (successCallback: () => void, errorCallback: () => void) => {
                    callback();
                    successCallback();
                    errorCallback();
                }
            }
        });
    };

    beforeEach(() => {
        service = createService();
    });

    describe('responseError', () => {
        it('should reject directly when the response contains PAC_PRM_6969', async () => {
            const response = {
                data: {
                    errors: [{ code: 'PAC_PRM_6969' }]
                }
            };

            await expectAsync(service.responseError(response)).toBeRejectedWith(response);
        });

        it('should reject directly when the response contains PAC_PRM_6970', async () => {
            const response = {
                data: {
                    errors: [{ code: 'PAC_PRM_6970' }]
                }
            };

            await expectAsync(service.responseError(response)).toBeRejectedWith(response);
        });
    });

    describe('showPermanentModal', () => {
        beforeEach(() => {
            spyOn(servicePrivateMethods(), 'checkCustomerStatus');
            spyOn(servicePrivateMethods(), 'changePageToPermanent');
        });

        it('should check customer status and redirect directly from ibcose2', () => {
            (location.path as unknown as jasmine.Spy).and.returnValue('/ibcose2');

            service.showPermanentModal();

            expect(servicePrivateMethods().checkCustomerStatus).toHaveBeenCalled();
            expect(servicePrivateMethods().changePageToPermanent).toHaveBeenCalled();
            expect(injector.get).not.toHaveBeenCalled();
        });

        it('should check customer status and redirect directly from ibcose', () => {
            (location.path as unknown as jasmine.Spy).and.returnValue('/ibcose');

            service.showPermanentModal();

            expect(servicePrivateMethods().checkCustomerStatus).toHaveBeenCalled();
            expect(servicePrivateMethods().changePageToPermanent).toHaveBeenCalled();
            expect(injector.get).not.toHaveBeenCalled();
        });

        it('should show the permanent status modal for a different route', () => {
            (location.path as unknown as jasmine.Spy).and.returnValue('/passengers');
            createModalResult(() => undefined);

            service.showPermanentModal();

            expect(modalService.showComponentModal).toHaveBeenCalledWith(
                'ibChangeStatusUserModalComponent',
                true
            );
        });

        [
            {
                description: 'should redirect when the modal is resolved',
                returnPath: '/passengers',
                returnModal: {
                    result: {
                        then: (successCallback: () => void) => successCallback()
                    }
                },
                expected: 1
            },
            {
                description: 'should redirect when the modal is rejected',
                returnPath: '/passengers',
                returnModal: {
                    result: {
                    then: (_successCallback: () => void, errorCallback: () => void) => errorCallback()
                }
                },
                expected: 1
            }
        ].forEach(({description, returnPath, returnModal, expected}) => {
            it(description, () => {
                (location.path as unknown as jasmine.Spy).and.returnValue(returnPath);
                modalService.showComponentModal.and.returnValue(returnModal);

                service.showPermanentModal();

                expect(servicePrivateMethods().changePageToPermanent).toHaveBeenCalledTimes(expected);
            });
        });
    });
});
