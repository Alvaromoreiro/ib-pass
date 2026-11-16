import { DigitalDataConstants } from '@src/app/core/constants/ib-digital-data-constants';
const digital_data = require('../../unit/app/shared/services/mocks/DigitalDataRTStepRecap.json')
export class DigitalDataServiceMock {
    addDigitalDataInfo = jasmine.createSpy('addDigitalDataInfo');
    getDigitalData = jasmine.createSpy( 'getDigitalData' ).and.returnValue( digital_data );
    getDigitalDataProcess = jasmine.createSpy( 'getDigitalDataProcess' ).and.returnValue( digital_data[ DigitalDataConstants.PROCESS ] );
    emitViewEvent = jasmine.createSpy('emitViewEvent');
    addDigitalDataEcommerceEvent = jasmine.createSpy('addDigitalDataEcommerceEvent');
    emitEvent = jasmine.createSpy('emitEvent');
}
