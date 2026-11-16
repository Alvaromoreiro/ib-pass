describe('AncillariesConfigurationService', () => {
    let AncillariesConfigurationService: any;

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module');
        inject((_AncillariesConfigurationService_) => {
            AncillariesConfigurationService = _AncillariesConfigurationService_;
        });
    });

    it('should be defined', () => {
        expect(AncillariesConfigurationService).toBeDefined();
    });

    it('should initialize model with default values', () => {
        const model = AncillariesConfigurationService.initializeModel();

        expect(model).toEqual({
            ancillariesTrips: [],
            seatsAvailable: true,
            insuranceForm: null,
            baggageAvailable: true,
            selectedInsurance: false,
            baggagesQuanty: null,
            seatsQuanty: null,
            currency: null,
            infoHeader: null,
            isAllowed: false,
            isShowedModal: false,
            totalPayment: 0,
            baggageAvailablePrice: 0,
            showInsuranceBox: false,
            bobAvailable: false,
            bobInfo: {},
            speqsQuanty: 0,
            ancillariesAvailable: null,
            ancillariesInsurance: null,
            insuranceAvailable: null,
            ancillariesFlexibilization: null,
            ancillariesCarbonFootprint: null,
            insuranceInfo: null,
            pendingSeats: null,
            passengerBaggagesTrips: null,
            isCurrencyLong: null,
            speqsAvailablePrice: null,
            passengerSpeqsTrips: null,
            showBannerConfort: null,
            ancillariesPreorder: null,
            ancillariesPriorityBoarding: null,
            upgrading: null,
            flags: null,
            newSelectedIndurancePerCountry: null,
            pricesProvider: '',
            infoToShowNewMap: null,
            bundles: null,
            ancillariesTransfersGlobick: null,
            ancillariesAllianzFusionInsurance: null,
            insuranceAllianzFusionAvailable: null
        });
    });

    it('should not throw when service file is loaded (defensive catch)', () => {
        expect(() => {
            angular.module('ib-MmB-services-module');
        }).not.toThrow();
    });
});
