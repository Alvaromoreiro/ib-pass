import { OthersFeesViewModelService } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-basket/shared/services/ib-booking-header-other-fees-view-model.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AJSCurrencyService } from 'ib-web-commons/utils';

const fakeCurrencyService = {
    formatPrice: jasmine.createSpy().and.callFake((symbol, value) => {
        return `${value} €`;
    })
};

const otherFee = {
    parsedFee: '5 €',
    totalFee: 5
}
const othersModelEmpty = {
    hasElements: false,
    others: [],
    total: {
        total: 0,
        totalFormatted: '0 €'
    }
}

describe('OthersFeesViewModelService tests', () => {
    let service: OthersFeesViewModelService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                OthersFeesViewModelService,
                { provide: AJSCurrencyService, useValue: fakeCurrencyService }
            ]
        });
        service = TestBed.inject(OthersFeesViewModelService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('when getOthersViewModel is called,', () => {
        it(' it will return others view model', ()=>{
            let returnService = service.getOthersViewModel('€')
            expect(returnService).toEqual(othersModelEmpty)
        })
    })
    describe('when getOtherInfo is called', () => {
        it(' and other fees type is DONATION, it will return donation model', ()=>{
            const otherFee = {
                description: 'Donación',
                total: 5,
                totalFormatted: '5 €'
            }
            let returnService = service.getOtherInfo(otherFee, 'DONATION', null)
            expect(returnService).toEqual({...otherFee, type: 'DONATION'})
        })
        it(' and other fees type is ONHOLD_IBERIA_PAY_AFOP, it will return on hold model', ()=>{
            const otherFee = {
                description: 'On Hold',
                total: 5,
                totalFormatted: '5 €'
            }
            let returnService = service.getOtherInfo(otherFee, 'ONHOLD_IBERIA_PAY_AFOP', null)
            expect(returnService).toEqual({
                type:'ONHOLD',
                description:'PRICE_BREAKDOWN_ON_HOLD',
                totalFormatted:'-5 €',
                total: -5
            })
        })
        it(' and other fees type is SUMMARY_OTHER_FEES_ADMINISTRATION, it will return administration model', ()=>{
            let returnService = service.getOtherInfo(otherFee, 'SUMMARY_OTHER_FEES_ADMINISTRATION', null)
            expect(returnService).toEqual({
                type:'SUMMARY_OTHER_FEES_ADMINISTRATION',
                description: 'SUMMARY_OTHER_FEES_ADMINISTRATION',
                totalFormatted: otherFee.parsedFee,
                total: otherFee.totalFee
            })
        })
        it(' and other fees type is CARD, it will return card model', ()=>{
            let returnService = service.getOtherInfo(otherFee, 'CARD', null)
            expect(returnService).toEqual({
                type: 'CARD',
                description: 'SUMMARY_OTHER_FEES_CREDIT_CARD',
                totalFormatted: otherFee.parsedFee,
                total: otherFee.totalFee
            })
        })
    })
    describe('when deleteInfo is called,', () => {
        const othersModel = {
            hasElements: false,
            others: [{
                type: 'DONATION',
                description: 'DONATION'
            }],
            total: {
                total: 0,
                totalFormatted: '0 €'
            }
        }
        it(' and otherType is filled, it will delete otherType from othersModel', ()=>{
            service.deleteInfo(othersModel, 'DONATION', '€')
            expect(othersModel).toEqual(othersModelEmpty)
        })
        it(' and otherType is empty, it will delete otherType from othersModel', ()=>{
            service.deleteInfo(othersModel, null, '€')
            expect(othersModel).toEqual(othersModel)
        })
    })
    describe('when updateInfo is called,', () => {
        it(' it will update price from othersModel', ()=>{
            const othersModel = {
                hasElements: false,
                others: [{
                    total: 10
                }],
                total: {
                    total: 0,
                    totalFormatted: '0 €'
                }
            }
            service.updateInfo(othersModel, '€')
            expect(othersModel).toEqual({...othersModel,
                hasElements: true,
                total: {
                    total: 10,
                    totalFormatted: '10 €'
                }
            })
        })
    })
});

