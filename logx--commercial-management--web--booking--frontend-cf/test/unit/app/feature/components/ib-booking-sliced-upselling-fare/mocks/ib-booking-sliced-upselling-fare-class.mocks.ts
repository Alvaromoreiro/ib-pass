
const { model } = require( './ib-booking-sliced-upselling-fare.mocks.json' );
export class IbBookingUpsellingUtilsServiceMock {
    private forbiddenUpsellingMap = {
        'optima-Flex': ['confort'],
        'business-optima': ['business-flexible']
    };
    private operatorsMap = {
        iberia: true, 'air nostrum': true, 'iberia express': true, 'level': true
    };
    private zonesMap = ['ES', 'EU', 'LATAM'];
    isAnyValidOperator = jasmine.createSpy( 'isAnyValidOperator' ).and.callFake( () => true );
    checkUpsellingAvailableFares = jasmine.createSpy( 'checkUpsellingAvailableFares' ).and.callFake( () => true );
    isForbiddenUpsell = jasmine.createSpy( 'isForbiddenUpsell' ).and.callFake( () => false );
    getInfoToShow = jasmine.createSpy( 'getInfoToShow' ).and.callFake( () => Promise.resolve(model));
};
