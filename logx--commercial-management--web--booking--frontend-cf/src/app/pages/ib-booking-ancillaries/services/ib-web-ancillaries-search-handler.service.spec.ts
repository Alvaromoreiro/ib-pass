import { AncillariesSearchHandlerService } from '@src/app/pages/ib-booking-ancillaries/services/ib-web-ancillaries-search-handler.service';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

describe('AncillariesSearchHandlerService', () => {
    let service: AncillariesSearchHandlerService;
    let localStorageService: StorageServiceMock;
    let currencyService: any;
    let newMainHeaderFacade: any;
    let ibCheckPartnersDiscountsService: any;
    let $rootScope: any;
    let commonsAncillariesService: any;
    let modalServiceAncillaries: any;
    beforeEach(() => {
        localStorageService = new StorageServiceMock();

        currencyService = { formatPrice: jasmine.createSpy('formatPrice').and.returnValue('100 EUR') };
        newMainHeaderFacade = { updateBasketDiscountsNew: jasmine.createSpy('updateBasketDiscountsNew') };
        ibCheckPartnersDiscountsService = { isDiscountTypePartnerEquivalent: jasmine.createSpy('isDiscountTypePartnerEquivalent').and.returnValue(false) };
        $rootScope = { $broadcast: jasmine.createSpy('$broadcast') };
        commonsAncillariesService = { updateAncillaries: jasmine.createSpy('updateAncillaries').and.returnValue(Promise.resolve()) };
        modalServiceAncillaries = {
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            showGenericError: jasmine.createSpy('showGenericError').and.returnValue({ result: { finally: jasmine.createSpy('finally') } })
        };

        service = new AncillariesSearchHandlerService(
            localStorageService as any,
            currencyService,
            newMainHeaderFacade,
            ibCheckPartnersDiscountsService,
            $rootScope,
            commonsAncillariesService,
            modalServiceAncillaries
        );
    });


    describe('mapResponseToModel()', () => {
        it('should map all response fields to the model', () => {
            const model: any = {};
            const response = {
                ancillariesTrips: ['trip1'],
                seatsAvailable: true,
                baggageAvailable: true,
                seatsQuanty: 3,
                ancillariesInsurance: ['ins1'],
                insuranceAvailable: true,
                insuranceInfo: { id: 'ins' },
                insuranceAllianzFusionAvailable: false,
                flexibilizationInfo: { info: [] },
                pendingSeats: false,
                passengerData: ['pax1'],
                passengerBaggagesTrips: ['bag1'],
                currency: 'EUR',
                isCurrencyLong: false,
                baggageAvailablePrice: { priceFrom: 25 },
                bobAvailable: true,
                bobInfo: { id: 'bob' },
                upgradingInfo: { id: 'upg' },
                speqsAvailablePrice: { priceFrom: 30 },
                ancillariesSpeqs: ['speq1'],
                showBannerConfort: true,
                preorderAncillarieInfo: { id: 'pre' },
                priorityBoardingInfo: { confirmed: false },
                ancillariesCarbonFootprint: { confirmed: false },
                flags: { flag1: true },
                pet: { id: 'pet' },
                assistCard: { id: 'card' }
            };

            service.mapResponseToModel(model, response);

            expect(model.ancillariesTrips).toEqual(response.ancillariesTrips);
            expect(model.seatsAvailable).toBe(response.seatsAvailable);
            expect(model.baggageAvailable).toBe(response.baggageAvailable);
            expect(model.seatsQuanty).toBe(response.seatsQuanty);
            expect(model.ancillariesInsurance).toEqual(response.ancillariesInsurance);
            expect(model.insuranceInfo).toBe(response.insuranceInfo);
            expect(model.ancillariesInsuranceAllianzFusion).toBe(response.insuranceInfo);
            expect(model.ancillariesFlexibilization).toBe(response.flexibilizationInfo);
            expect(model.currency).toBe(response.currency);
            expect(model.baggageAvailablePrice).toBe(response.baggageAvailablePrice.priceFrom);
            expect(model.speqsAvailablePrice).toBe(response.speqsAvailablePrice.priceFrom);
            expect(model.upgrading).toBe(response.upgradingInfo);
            expect(model.petc).toBe(response.pet);
            expect(model.assistCard).toBe(response.assistCard);
        });
    });


    describe('applyTransfersIfAvailable()', () => {
        const mockResponse = { ancillariesTransfersGlobick: { id: 'transfers' } };

        it('should not set transfers when headerModel is null', () => {
            const model: any = {};
            localStorageService.set('headerModel', null);

            service.applyTransfersIfAvailable(model, mockResponse);

            expect(model.ancillariesTransfersGlobick).toBeUndefined();
        });

        it('should not set transfers when isONB is true', () => {
            const model: any = {};
            localStorageService.set('headerModel', { greyBarModel: { isONB: true } });
            localStorageService.set('fareData', { contextMetadata: { language: 'es' } });

            service.applyTransfersIfAvailable(model, mockResponse);

            expect(model.ancillariesTransfersGlobick).toBeUndefined();
        });

        it('should set transfers when language is "es"', () => {
            const model: any = {};
            localStorageService.set('headerModel', { greyBarModel: { isONB: false } });
            localStorageService.set('fareData', { contextMetadata: { language: 'es' } });

            service.applyTransfersIfAvailable(model, mockResponse);

            expect(model.ancillariesTransfersGlobick).toEqual(mockResponse.ancillariesTransfersGlobick);
        });

        it('should set transfers when language is "en"', () => {
            const model: any = {};
            localStorageService.set('headerModel', { greyBarModel: { isONB: false } });
            localStorageService.set('fareData', { contextMetadata: { language: 'en' } });

            service.applyTransfersIfAvailable(model, mockResponse);

            expect(model.ancillariesTransfersGlobick).toEqual(mockResponse.ancillariesTransfersGlobick);
        });

        it('should not set transfers when language is neither "es" nor "en"', () => {
            const model: any = {};
            localStorageService.set('headerModel', { greyBarModel: { isONB: false } });
            localStorageService.set('fareData', { contextMetadata: { language: 'fr' } });

            service.applyTransfersIfAvailable(model, mockResponse);

            expect(model.ancillariesTransfersGlobick).toBeUndefined();
        });
    });


    describe('applyTotalPaymentIfMissing()', () => {
        it('should format and set totalPayment when it is 0', () => {
            const model: any = { totalPayment: 0, currency: 'EUR' };

            service.applyTotalPaymentIfMissing(model);

            expect(currencyService.formatPrice).toHaveBeenCalledWith('EUR', 0, true, false, false);
            expect(model.totalPayment).toBe('100 EUR');
        });

        it('should not modify totalPayment when it already has a value', () => {
            const model: any = { totalPayment: 50, currency: 'EUR' };

            service.applyTotalPaymentIfMissing(model);

            expect(currencyService.formatPrice).not.toHaveBeenCalled();
            expect(model.totalPayment).toBe(50);
        });
    });


    describe('applyDiscountsToBasket()', () => {
        it('should do nothing when there are no discounts', () => {
            service.applyDiscountsToBasket({ order: { discountsApplied: { discounts: [] } } });

            expect(newMainHeaderFacade.updateBasketDiscountsNew).not.toHaveBeenCalled();
        });

        it('should do nothing when createOrderData has no discounts structure', () => {
            service.applyDiscountsToBasket({});

            expect(newMainHeaderFacade.updateBasketDiscountsNew).not.toHaveBeenCalled();
        });

        const discountCases = [
            {
                description: 'non-partner discount uses full price',
                isPartnerEquivalent: false,
                discountType: 'VOUCHER',
                totalDiscount: 20,
                priceTotal: 180,
                expectedPrice: 180
            },
            {
                description: 'PARTNER type discount uses price minus discount',
                isPartnerEquivalent: false,
                discountType: 'PARTNER',
                totalDiscount: 30,
                priceTotal: 200,
                expectedPrice: 170
            },
            {
                description: 'partner-equivalent discount uses price minus discount',
                isPartnerEquivalent: true,
                discountType: 'SOME_EQUIVALENT',
                totalDiscount: 40,
                priceTotal: 200,
                expectedPrice: 160
            }
        ];

        discountCases.forEach(({ description, isPartnerEquivalent, discountType, totalDiscount, priceTotal, expectedPrice }) => {
            it(`should call updateBasketDiscountsNew correctly when ${description}`, () => {
                ibCheckPartnersDiscountsService.isDiscountTypePartnerEquivalent.and.returnValue(isPartnerEquivalent);
                const discount = { type: discountType, totalDiscount };
                const createOrderData = {
                    order: {
                        discountsApplied: { originalPrice: 200, totalDiscount, discounts: [discount] },
                        price: { total: priceTotal }
                    }
                };

                service.applyDiscountsToBasket(createOrderData);

                expect(newMainHeaderFacade.updateBasketDiscountsNew).toHaveBeenCalledWith(
                    discount, 200, totalDiscount, expectedPrice
                );
            });
        });
    });


    describe('restoreSelectedInsurance()', () => {
        it('should do nothing when no insurance is saved in localStorage', () => {
            const model: any = { ancillariesInsurance: [] };

            service.restoreSelectedInsurance(model);

            expect(model.selectedInsurance).toBeUndefined();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });

        it('should set selectedInsurance and broadcast when a matching insurance is found', () => {
            localStorageService.set('insuranceSelected', { id: 'ins-1' });
            const insurance = { id: 'ins-1', name: 'Basic' };
            const model: any = { ancillariesInsurance: [insurance] };

            service.restoreSelectedInsurance(model);

            expect(model.selectedInsurance).toBe(insurance);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('setSelectedInsurance', insurance);
            expect(localStorageService.get('selectInsurance')).toBe(true);
        });

        it('should not set selectedInsurance when no insurance matches', () => {
            localStorageService.set('insuranceSelected', { id: 'ins-99' });
            const model: any = { ancillariesInsurance: [{ id: 'ins-1' }] };

            service.restoreSelectedInsurance(model);

            expect(model.selectedInsurance).toBeUndefined();
            expect($rootScope.$broadcast).not.toHaveBeenCalled();
        });
    });


    describe('restoreSelectedFlex()', () => {
        it('should do nothing when no flex is saved in localStorage', () => {
            const model: any = { ancillariesFlexibilization: { info: [] } };

            service.restoreSelectedFlex(model);

            expect(commonsAncillariesService.updateAncillaries).not.toHaveBeenCalled();
        });

        it('should set selectedFlex and confirmed when a matching flex is found', () => {
            localStorageService.set('selectedFlex', { subtype: 'PLUS' });
            const flexInfo = { subtype: 'PLUS' };
            const model: any = { ancillariesFlexibilization: { info: [flexInfo], selectedFlex: null, confirmed: false } };

            service.restoreSelectedFlex(model);

            expect(model.ancillariesFlexibilization.selectedFlex).toBe(flexInfo);
            expect(model.ancillariesFlexibilization.confirmed).toBe(true);
        });

        it('should call updateAncillaries for each flex info item', () => {
            localStorageService.set('selectedFlex', { subtype: 'PLUS' });
            const model: any = {
                ancillariesFlexibilization: {
                    info: [{ subtype: 'PLUS' }, { subtype: 'BASIC' }],
                    selectedFlex: null,
                    confirmed: false
                }
            };

            service.restoreSelectedFlex(model);

            expect(commonsAncillariesService.updateAncillaries).toHaveBeenCalledTimes(2);
        });

        it('should set confirmed false and selectedFlex null on updateAncillaries error', async () => {
            const rejectedPromise = Promise.reject('error');
            commonsAncillariesService.updateAncillaries.and.returnValue(rejectedPromise);
            localStorageService.set('selectedFlex', { subtype: 'PLUS' });
            const model: any = {
                ancillariesFlexibilization: {
                    info: [{ subtype: 'PLUS' }],
                    selectedFlex: null,
                    confirmed: false
                }
            };

            service.restoreSelectedFlex(model);

            await rejectedPromise.catch(() => {});
            expect(model.ancillariesFlexibilization.confirmed).toBe(false);
            expect(model.ancillariesFlexibilization.selectedFlex).toBeNull();
            expect(modalServiceAncillaries.isNotWaiting).toHaveBeenCalled();
        });
    });


    describe('getShoppingBasket()', () => {
        it('should return headerModel.shoppingBasket when it exists', () => {
            const basket = { total: 100 };
            const headerModel = { shoppingBasket: basket };

            const result = service.getShoppingBasket(headerModel);

            expect(result).toBe(basket);
        });

        it('should return headerModel.headerModel.shoppingBasket when shoppingBasket is null', () => {
            const basket = { total: 200 };
            const headerModel = { shoppingBasket: null, headerModel: { shoppingBasket: basket } };

            const result = service.getShoppingBasket(headerModel);

            expect(result).toBe(basket);
        });
    });


    describe('updateSeatsQuantyFromBasket()', () => {
        it('should not update seatsQuanty when hasSeats is false', () => {
            const model: any = { seatsQuanty: 0 };
            const seats = { hasSeats: false, segments: [] };

            service.updateSeatsQuantyFromBasket(model, seats);

            expect(model.seatsQuanty).toBe(0);
        });

        it('should sum segment quanty values and set seatsQuanty', () => {
            const model: any = { seatsQuanty: 0 };
            const seats = { hasSeats: true, segments: [{ quanty: 2 }, { quanty: 3 }] };

            service.updateSeatsQuantyFromBasket(model, seats);

            expect(model.seatsQuanty).toBe(5);
        });

        it('should handle segments with zero quanty', () => {
            const model: any = { seatsQuanty: 0 };
            const seats = { hasSeats: true, segments: [{ quanty: 0 }, { quanty: 0 }] };

            service.updateSeatsQuantyFromBasket(model, seats);

            expect(model.seatsQuanty).toBe(0);
        });
    });
});
