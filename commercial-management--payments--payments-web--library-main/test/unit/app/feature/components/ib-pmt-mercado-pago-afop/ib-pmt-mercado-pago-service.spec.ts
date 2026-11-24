import { TestBed } from '@angular/core/testing';
import { ibPmtMercadoPagoService } from '../../../../../../src/app/feature/components/ib-pmt-mercado-pago-afop/ib-pmt-mercado-pago.service';
import {AJSRootScope} from 'ib-web-commons/utils';

describe('ibPmtMercadoPagoService', () => {
    let service: ibPmtMercadoPagoService;
    let mockRootScope;

    beforeEach(() => {
        mockRootScope = {
            $broadcast: jasmine.createSpy('$broadcast')
        };

        TestBed.configureTestingModule({
            providers: [
                ibPmtMercadoPagoService,
                { provide: AJSRootScope, useValue: mockRootScope }
            ]
        });

        service = TestBed.inject(ibPmtMercadoPagoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setMercadoPagoAvailable should update the value', (done) => {
        let callCount = 0;
        const values = [];

        service.mercadoPagoIsAvailableObserver.subscribe(value => {
            values.push(value);
            callCount++;

            if (callCount === 2) {
                expect(values).toEqual([false, true]);
                done();
            }
        });

        service.setMercadoPagoAvailable(true);
    });

    it('submitPayment should call $rootScope.$broadcast', () => {
        service.submitPayment();
        expect(mockRootScope.$broadcast).toHaveBeenCalledWith('submitedPaymentEvent', 'iberiaPayAfop');
    });
});
