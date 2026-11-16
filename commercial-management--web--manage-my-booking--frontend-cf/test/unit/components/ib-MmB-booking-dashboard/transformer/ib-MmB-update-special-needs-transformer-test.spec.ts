import { TestBed } from "@angular/core/testing";
import { UpdateSpecialNeedsTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-update-special-needs-transformer";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('UpdateSpecialNeedsTransformer test ', () => {
    let localStorageService: StorageServiceMock = new StorageServiceMock();
    let transformer;

    const specialNeedsPassengerEntryPoint = require('./mocks/special-needs-passenger.json');

    const specialNeedsPassenger = [
        {
            "passengerId": "ADULT_01", "specialNeedsCodes": ["BLND", "DEAF", "WCHS"]
        }
    ];

    let specialNeedExpected = {
        specialNeeds: [{
            passengerId: 'ADULT_01', specialNeedsCodes: ["BLND", "SVAN"]
        }]
    }

    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [UpdateSpecialNeedsTransformer],
        });
        transformer = new UpdateSpecialNeedsTransformer(localStorageService as any);
        localStorageService.set('specialNeedsPassengers', specialNeedsPassenger)
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('and getDifferenceBetweenTwoArrayObjects', () => {
        it(' have been called', (done) => {
            const result = transformer.transformUpdateSpecialNeeds(specialNeedsPassengerEntryPoint);
            expect(result).toBeDefined();
            expect(result).toEqual(specialNeedExpected);
            done();
        });
    });
});