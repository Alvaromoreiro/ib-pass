import { IbSetHeaderService } from '../../../../../../src/app/shared/services/ib-header/ib-set-header-service';

describe('IbSetHeaderService', () => {
    let service: IbSetHeaderService;
    let mockNewMainHeaderFacade: any;
    let mockRootScope: any;
    let mockLocalStorageService: any;
    let mockBookingUtilService: any;

    beforeEach(() => {
        mockNewMainHeaderFacade = {
            initHeader: jasmine.createSpy('initHeader'),
            deleteTripsBasketFromDispo: jasmine.createSpy('deleteTripsBasketFromDispo'),
            updateTripsBasketFromDispo: jasmine.createSpy('updateTripsBasketFromDispo'),
        };
        mockRootScope = {
            isRedemptionFlow: false,
            isShuttleFlow: false,
            isPointsOBFlow: false,
        };
        mockLocalStorageService = {
            get: jasmine.createSpy('get').and.returnValue(null),
        };
        mockBookingUtilService = {
            getURLFirstParameterByName: jasmine.createSpy('getURLFirstParameterByName').and.returnValue(null),
        };

        service = new IbSetHeaderService(
            mockNewMainHeaderFacade,
            mockRootScope,
            mockLocalStorageService,
            mockBookingUtilService
        );
    });

    describe('setHeader', () => {
        it('should call initHeader with correct parameters', () => {
            const originDestination = 'MAD-BCN';
            const currency = 'EUR';
            const onLogin = jasmine.createSpy('onLogin');
            const onError = jasmine.createSpy('onError');
            const activate = jasmine.createSpy('activate');

            mockLocalStorageService.get.and.callFake((key) => {
                if (key === 'actualStepFlow') return 'step1';
                if (key === 'userLogged') return true;
                if (key === 'customerData') return { name: 'John Doe' };
                return null;
            });

            service.setHeader(originDestination, currency, onLogin, onError, activate);

            expect(mockNewMainHeaderFacade.initHeader).toHaveBeenCalledWith(
                {
                    originDestination,
                    redemption: false,
                    flightType: 'availabilityFlight',
                    currency,
                    showModalBackHome: true,
                    showAdvancedSearch: false,
                },
                {
                    hasSteps: true,
                    steps: 'DEFAULT_STEPS',
                    position: 'step1',
                },
                {
                    onLogin,
                    onError,
                    afterLogin: activate,
                    userLogged: true,
                    loggedData: { name: 'John Doe' },
                }
            );
        });
    });

    describe('getSteps', () => {
        it('should return DEFAULT_STEPS when no conditions are met', () => {
            const steps = service['getSteps']();
            expect(steps).toBe('DEFAULT_STEPS');
        });

        it('should return REDEMPTION_STEPS when isRedemptionFlow is true', () => {
            mockRootScope.isRedemptionFlow = true;
            const steps = service['getSteps']();
            expect(steps).toBe('REDEMPTION_STEPS');
        });

        it('should return SHUTTLE_STEPS when isShuttleFlow is true', () => {
            mockRootScope.isShuttleFlow = true;
            const steps = service['getSteps']();
            expect(steps).toBe('SHUTTLE_STEPS');
        });

        it('should return FLASH_OFFER_STEPS when flashOffer and flashOfferId are present', () => {
            mockBookingUtilService.getURLFirstParameterByName.and.callFake((param) => {
                if (param === 'flashOffer') return 'offer';
                if (param === 'flashOfferId') return '123';
                return null;
            });
            const steps = service['getSteps']();
            expect(steps).toBe('FLASH_OFFER_STEPS');
        });

        it('should return REDEMPTION_OB_STEPS when isPointsOBFlow is true', () => {
            mockRootScope.isPointsOBFlow = true;
            const steps = service['getSteps']();
            expect(steps).toBe('REDEMPTION_OB_STEPS');
        });
    });

    describe('setDataOnBasket', () => {
        it('should call deleteTripsBasketFromDispo and updateTripsBasketFromDispo with correct parameters', () => {
            const data = { trip: 'MAD-BCN' };
            const model = { type: 'economy' };

            service.setDataOnBasket(data, model);

            expect(mockNewMainHeaderFacade.deleteTripsBasketFromDispo).toHaveBeenCalled();
            expect(mockNewMainHeaderFacade.updateTripsBasketFromDispo).toHaveBeenCalledWith(data, model);
        });
    });
});