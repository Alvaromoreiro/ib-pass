import { AncillariesConfigurationService } from './ib-web-ancillaries-configuration-service';

describe('AncillariesConfigurationService', () => {
    let service: AncillariesConfigurationService;

    beforeEach(() => {
        service = new AncillariesConfigurationService();
    });

    it('creates an ancillary model with its initial defaults', () => {
        const model = service.initializeModel();

        expect(model).toEqual(jasmine.objectContaining({
            ancillariesTrips: [],
            seatsAvailable: true,
            baggageAvailable: true,
            selectedInsurance: false,
            totalPayment: 0,
            bobAvailable: false,
            speqsQuanty: 0,
            pricesProvider: '',
            bobInfo: {}
        }));
    });

    it('creates independent mutable defaults for each model', () => {
        const firstModel = service.initializeModel();
        firstModel.ancillariesTrips.push({});
        firstModel.bobInfo['selected'] = true;

        const nextModel = service.initializeModel();

        expect(nextModel.ancillariesTrips).toEqual([]);
        expect(nextModel.bobInfo).toEqual({});
        expect(nextModel.ancillariesTrips).not.toBe(firstModel.ancillariesTrips);
        expect(nextModel.bobInfo).not.toBe(firstModel.bobInfo);
    });
});