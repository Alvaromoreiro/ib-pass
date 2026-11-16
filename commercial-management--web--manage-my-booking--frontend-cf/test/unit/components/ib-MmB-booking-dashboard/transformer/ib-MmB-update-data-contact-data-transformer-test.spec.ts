import { TestBed } from "@angular/core/testing";
import { UpdateDataContactDataTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-update-data-contact-data-transformer";

describe('UpdateSpecialNeedsTransformer test ', () => {
    let transformer;

    const passengerContactInfo = require('./mocks/passenger-contact-info.json');

    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [UpdateDataContactDataTransformer],
        });
        transformer = new UpdateDataContactDataTransformer();
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and transformUpdateDataContactData', () => {
        it(' have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(null, null);
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and type contactInfo have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(passengerContactInfo, 'contactInfo');
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and type frequentFlyer have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(passengerContactInfo, 'frequentFlyer');
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and type primaryContact have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(passengerContactInfo, 'primaryContact');
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and type emergencyContact have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(passengerContactInfo, 'emergencyContact');
            expect(result).toBeDefined();
            done();
        });

        it(' with parameters and type personalInfo have been called', (done) => {
            const result = transformer.transformUpdateDataContactData(passengerContactInfo, 'personalInfo');
            expect(result).toBeDefined();
            done();
        });
    });

    describe('and transformEmergencyContactInfo', () => {
        it(' have been called', (done) => {
            const result = transformer.transformEmergencyContactInfo(null);
            expect(result).toBeDefined();
            done();
        });
    });
});