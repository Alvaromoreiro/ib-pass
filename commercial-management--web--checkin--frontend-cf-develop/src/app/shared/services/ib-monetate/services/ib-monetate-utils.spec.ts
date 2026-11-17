import { MonetateUtilsService } from "./ib-monetate-utils";
import { MonetateService } from './ib-monetate-service';
import { MonetateTransformer } from '../transformers/ib-monetate-transformer';
import { MonetateConstantsType } from '../ib-monetate-constants';

const createCartProduct = (productId: string): CommonsMonetateModels.CartProductDetails => ({
    productId,
    quantity: '1',
    unitPrice: '0'
});

describe('MonetateUtilsService', () => {
    let service: MonetateUtilsService;
    let monetateService: jasmine.SpyObj<MonetateService>;
    let monetateTransformer: jasmine.SpyObj<MonetateTransformer>;
    let rootScope: jasmine.SpyObj<CommonsRootScope>;
    let windowMock: Pick<ng.IWindowService, 'datalayer_general' | 'datalayer_ecommerce' | 'digital_data'>;

    const monetateConstants = {
        MONETATE_INFO: {
            CUSTOMVARS: 'setCustomVariables',
            SETPAGETYPE: 'setPageType'
        },
        PREFIX: {
            DATALAYER_GENERAL: 'general_',
            DATALAYER_ECOMMERCE: 'ecommerce_',
            DIGITAL_DATA: 'digital_'
        },
        TRACK_PLACE: {
            CART: 'cart',
            PURCHASE: 'purchase'
        }
    } as unknown as MonetateConstantsType;

    const createService = (): void => {
        service = new MonetateUtilsService(
            windowMock as unknown as ng.IWindowService,
            monetateService,
            rootScope,
            monetateConstants,
            monetateTransformer
        );
    };

    beforeEach(() => {
        windowMock = {
            datalayer_general: {
                quadrigam: 'CHECKIN'
            },
            datalayer_ecommerce: {},
            digital_data: {
                Quadrigam: 'DIGITAL_CHECKIN'
            }
        };

        rootScope = jasmine.createSpyObj<CommonsRootScope>('$rootScope', ['$on']);

        monetateService = jasmine.createSpyObj<MonetateService>('MonetateService', [
            'initMonetate',
            'addMonetateGeneralInfo',
            'addMonetatePageType',
            'sendMonetatePageType',
            'sendUpdateToMonetate',
            'trackAncillariesProductsAdded',
            'addProductDetails'
        ]);

        monetateTransformer = jasmine.createSpyObj<MonetateTransformer>('MonetateTransformer', [
            'createFlightReviewMonetate',
            'createFlightSearchMonetate',
            'createFlightBookingMonetate',
            'transformAncillariesInMonetateProductModel',
            'transformCabinInMonetateProductModel',
            'transformFareDataInProductModel',
            'transformDestinationAreasCitiesListInProductModel',
            'transformPurchasedInfoInProductModel',
            'transformOriginDestinationInfoIntoTripType',
            'transformFlightRouteProductDetail',
            'transformSelectedOfferInProductModel'
        ]);

        createService();
    });

    it('should register Monetate event listeners during initialization', () => {
        expect(rootScope.$on).toHaveBeenCalledWith('updateDatalayer', service.updateDatalayerMonetate);
        expect(rootScope.$on).toHaveBeenCalledWith('sendUpdateToMonetate', service.sendUpdateToMonetate);
        expect(rootScope.$on).toHaveBeenCalledWith('updateDigitalData', service.updateDigitalDataMonetate);
        expect(rootScope.$on).toHaveBeenCalledWith('updatePageType', service.updatePageType);
    });

    it('should initialize Monetate', () => {
        service.initializeMonetate();

        expect(monetateService.initMonetate).toHaveBeenCalled();
    });

    it('should add valid Monetate information', () => {
        const monetateInfo = ['setPageType', 'CHECKIN'];

        service.addMonetateInfo(monetateInfo);

        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith(monetateInfo);
    });

    it('should ignore invalid Monetate information', () => {
        service.addMonetateInfo('invalid-value' as unknown as (string | number | object)[]);

        expect(monetateService.addMonetateGeneralInfo).not.toHaveBeenCalled();
    });

    it('should update Monetate with page type and quadrigam', () => {
        service.updateMonetateWithQuadrigam('setPageType', 'CHECKIN', {
            pageCategory: 'upgrade'
        });

        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith(
            jasmine.objectContaining({
                0: 'setPageType',
                1: 'CHECKIN',
                pageCategory: 'upgrade'
            })
        );
    });

    it('should update Monetate page type and add additional information', () => {
        const monetateInfo = ['addFlightSearch', { origin: 'MAD' }];

        service.updateMonetateWithPageType('setPageType', 'CHECKIN', monetateInfo);

        expect(monetateService.addMonetatePageType).toHaveBeenCalledWith([
            'setPageType',
            'CHECKIN'
        ]);
        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith(monetateInfo);
    });

    it('should flatten nested objects into Monetate datalayer entries', () => {
        const result = service.getMonetateDatalayerFormat(
            'general_',
            ['quadrigam', 'booking'],
            {
                quadrigam: 'CHECKIN',
                booking: {
                    pnr: 'ABC123',
                    passengerCount: 2
                }
            }
        );

        expect(result).toEqual([
            {
                name: 'general_quadrigam',
                value: 'CHECKIN'
            },
            {
                name: 'general_booking_pnr',
                value: 'ABC123'
            },
            {
                name: 'general_booking_passengerCount',
                value: 2 as unknown as string
            }
        ]);
    });

    it('should add custom variables using both datalayer quadrigams', () => {
        const customVariables = [
            {
                name: 'general_pnr',
                value: 'ABC123'
            }
        ];

        service.addCustomVars(customVariables);
        service.addCustomVarsDigitalData([
            {
                name: 'digital_pnr',
                value: 'ABC123'
            }
        ]);

        expect(monetateService.addMonetatePageType.calls.argsFor(0)).toEqual([[
            'setPageType',
            'CHECKIN'
        ]]);
        expect(monetateService.addMonetatePageType.calls.argsFor(1)).toEqual([[
            'setPageType',
            'DIGITAL_CHECKIN'
        ]]);
        expect(monetateService.addMonetateGeneralInfo.calls.argsFor(0)).toEqual([[
            'setCustomVariables',
            customVariables
        ]]);
        expect(monetateService.addMonetateGeneralInfo.calls.argsFor(1)).toEqual([[
            'setCustomVariables',
            [{ name: 'digital_pnr', value: 'ABC123' }]
        ]]);
    });

    it('should transform and send general and ecommerce datalayer information', () => {
        windowMock.datalayer_general = {
            quadrigam: 'CHECKIN',
            pnr: 'ABC123'
        };
        windowMock.datalayer_ecommerce = {
            total: 120
        };

        service.updateDatalayerMonetate();

        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith([
            'setCustomVariables',
            [
                {
                    name: 'ecommerce_total',
                    value: 120
                },
                {
                    name: 'general_quadrigam',
                    value: 'CHECKIN'
                },
                {
                    name: 'general_pnr',
                    value: 'ABC123'
                }
            ]
        ]);
    });

    it('should transform and send digital data information', () => {
        windowMock.digital_data = {
            Quadrigam: 'DIGITAL_CHECKIN',
            booking: {
                pnr: 'ABC123'
            }
        };

        service.updateDigitalDataMonetate();

        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith([
            'setCustomVariables',
            [
                {
                    name: 'digital_Quadrigam',
                    value: 'DIGITAL_CHECKIN'
                },
                {
                    name: 'digital_booking_pnr',
                    value: 'ABC123'
                }
            ]
        ]);
    });

    it('should add flight review data and track selected segments', () => {
        const data = { originDestinations: [] };
        const passengers = { passengers: 1 };
        const selectedSlices = [[{ segmentId: 'SEG-1' }]];
        const offerData = { price: { total: 100 } };
        const fareFamily = [{ cabinType: 'E' }];

        monetateTransformer.createFlightReviewMonetate.and.returnValue(['addFlightReview']);
        const selectedOfferProduct = createCartProduct('SEG-1');
        monetateTransformer.transformSelectedOfferInProductModel.and.returnValue([selectedOfferProduct]);

        service.addFlightReviewMonetate(data, passengers, selectedSlices, offerData, fareFamily);

        expect(monetateTransformer.createFlightReviewMonetate).toHaveBeenCalledWith(
            data,
            passengers,
            selectedSlices,
            offerData,
            fareFamily
        );
        expect(monetateService.trackAncillariesProductsAdded).toHaveBeenCalledWith(
            [selectedOfferProduct],
            'cart'
        );
        expect(monetateService.addMonetatePageType).toHaveBeenCalledWith([
            'setPageType',
            'CHECKIN'
        ]);
        expect(monetateService.addMonetateGeneralInfo).toHaveBeenCalledWith([
            'addFlightReview'
        ]);
    });

    it('should add transformed flight search and booking information', () => {
        const data = { originDestinations: [] };
        const passengers = { passengers: 1 };
        const availability = { fareFamilyConditions: [] };
        const confirmation = { pnr: 'ABC123' };
        const fareFamilies = [{ cabinType: 'E' }];

        monetateTransformer.createFlightSearchMonetate.and.returnValue(['addFlightSearch']);
        monetateTransformer.createFlightBookingMonetate.and.returnValue(['addFlightBooking']);

        service.addFlightSearchMonetate(data, passengers, availability);
        service.addFlightBookingMonetate(data, passengers, confirmation, fareFamilies);

        expect(monetateTransformer.createFlightSearchMonetate).toHaveBeenCalledWith(
            data,
            passengers,
            availability
        );
        expect(monetateTransformer.createFlightBookingMonetate).toHaveBeenCalledWith(
            data,
            passengers,
            confirmation,
            fareFamilies
        );
        expect(monetateService.addMonetateGeneralInfo.calls.argsFor(0)).toEqual([[
            'addFlightSearch'
        ]]);
        expect(monetateService.addMonetateGeneralInfo.calls.argsFor(1)).toEqual([[
            'addFlightBooking'
        ]]);
    });

    it('should send Monetate page type updates', () => {
        service.updatePageType();

        expect(monetateService.sendMonetatePageType).toHaveBeenCalled();
    });

    it('should send Monetate updates', () => {
        service.sendUpdateToMonetate();

        expect(monetateService.sendUpdateToMonetate).toHaveBeenCalled();
    });

    it('should delegate ancillary tracking transformations', () => {
        const ancillaries = { baggages: {} } as unknown as CommonsSummaryInfoModels.AncillariesSummaryInfoModel;
        const transformedProducts = [createCartProduct('bag-23')];

        monetateTransformer.transformAncillariesInMonetateProductModel.and.returnValue(transformedProducts);

        service.trackAncillariesProductsAdded(ancillaries, 'checkout');

        expect(monetateService.trackAncillariesProductsAdded).toHaveBeenCalledWith(
            transformedProducts,
            'checkout'
        );
    });

    it('should delegate cart product tracking transformations', () => {
        const cabinProducts = [createCartProduct('cabin-economy')];
        const fareProducts = [createCartProduct('fare-basic')];
        const destinationProducts = [createCartProduct('destination-europe')];
        const tripProducts = [createCartProduct('trip-business')];

        monetateTransformer.transformCabinInMonetateProductModel.and.returnValue(cabinProducts);
        monetateTransformer.transformFareDataInProductModel.and.returnValue(fareProducts);
        monetateTransformer.transformDestinationAreasCitiesListInProductModel.and.returnValue(destinationProducts);
        monetateTransformer.transformOriginDestinationInfoIntoTripType.and.returnValue(tripProducts);

        service.trackFlightCabin([{ cabinType: 'E' }] as unknown as CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[], 'E');
        service.trackFareTypeSelected([{ commercialNameES: 'basica' }] as unknown as CommonsFareFamilyConditionsInfo.FareFamilyConditionsInfo[]);
        service.trackFlightDestination(
            [{ cities: [] }] as unknown as CommonsDestinationAreaCitiesModel.DestinationAreaCitiesListModel[],
            [{ destination: 'MAD' }] as unknown as CommonsMonetateModels.OriginDestinationInfo[]
        );
        service.trackTripType([{ origin: 'MAD', destination: 'LHR' }] as unknown as CommonsMonetateModels.OriginDestinationInfo[]);

        expect(monetateService.trackAncillariesProductsAdded.calls.allArgs()).toEqual([
            [cabinProducts, 'cart'],
            [fareProducts, 'cart'],
            [destinationProducts, 'cart'],
            [tripProducts, 'cart']
        ]);
    });

    it('should delegate purchased product tracking transformations', () => {
        const confirmation = { pnr: 'ABC123' };
        const purchasedProducts: CommonsMonetateModels.PurchaseProduct[] = [{
            purchaseId: 'purchase-1',
            productId: 'insurance-cancellation',
            quantity: '1',
            unitPrice: '0'
        }];

        monetateTransformer.transformPurchasedInfoInProductModel.and.returnValue(purchasedProducts);

        service.trackPurchasedProducts(confirmation as unknown as CommonsConfirmationInfoModel.ConfirmationInfo);

        expect(monetateService.trackAncillariesProductsAdded).toHaveBeenCalledWith(
            purchasedProducts,
            'purchase'
        );
    });

    it('should delegate route product detail tracking', () => {
        const routeDetails = ['MADLHR-20250610'];

        monetateTransformer.transformFlightRouteProductDetail.and.returnValue(routeDetails);

        service.trackRouteProductDetails([{ origin: 'MAD', destination: 'LHR' }] as unknown as CommonsMonetateModels.OriginDestinationInfo[]);

        expect(monetateService.addProductDetails).toHaveBeenCalledWith(routeDetails);
    });

    it('should update all Monetate information and send the update', () => {
        spyOn(service, 'updateDatalayerMonetate');
        spyOn(service, 'updateDigitalDataMonetate');
        spyOn(service, 'sendUpdateToMonetate');

        service.updateMonetateInfo();

        expect(service.updateDatalayerMonetate).toHaveBeenCalled();
        expect(service.updateDigitalDataMonetate).toHaveBeenCalled();
        expect(service.sendUpdateToMonetate).toHaveBeenCalled();
    });
});
