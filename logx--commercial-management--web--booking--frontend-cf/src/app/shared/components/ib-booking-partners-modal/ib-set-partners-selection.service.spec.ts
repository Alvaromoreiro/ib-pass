import { IbSetPartnersSelectionUtilsService } from '@shared/components/ib-booking-partners-modal/ib-set-partners-selection.service';
import { TestBed } from '@angular/core/testing';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { IbCModalService } from 'ib-web-commons/ib-modal';

class IbCheckPartnersDiscountsServiceMock {
    public partnerResponse =  [
        {
            partnerIdentifier: 'SAN',
            partnerName: 'SANTANDER',
            type: 'Product and registration (cobrand) assignment',
            partnerProduct: {
                identifier: '68',
                productName: 'SANTANDER SME ELITE',
                percentDiscount: 10,
                productDescription: 'Plan Santander IberiaPlus',
                productTier: 'ELITE',
                startDate: '2021-04-20T11:37:21.000Z',
                priority: '9',
                userMustFly: true
            }
        },
        {
            partnerIdentifier: 'IBCARDS',
            partnerName: 'Iberia Cards',
            type: 'Collection Partner assigment',
            partnerProduct: {
                identifier: '0',
                productName: 'Iberia Cards',
                productDescription: 'Iberia Cards',
                productTier: '',
                percentDiscount: 5,
                startDate: '2021-04-20T11:37:21.000Z',
                priority: '0',
                userMustFly: false
            }}
    ];
    public storedPreference: IbCheckPartnersDiscountModel.userPartnerPreference = {selectedPartnerId: 'SAN', dontAskPartner: false, timeStamp: new Date().getTime()};
    public selectedPartner: partnerDiscountInfoBKI = {isSelected: true, partnerIdentifier: 'SAN', percentDiscount: 5, productDescription: 'Dumbo', userTier: 'tier', userMustFly: true};
    public getSelectedPartner = jasmine.createSpy('getSelectedPartner').and.callFake(()=> this.selectedPartner);
    public getPartnersResponse = jasmine.createSpy('getPartnersResponse').and.callFake(()=> this.partnerResponse);
    public checkPartnersDiscount = jasmine.createSpy('checkPartnersDiscount').and.callFake(()=> this.partnerResponse!=null);
    public getCurrentUserStoredPreference = jasmine.createSpy('getCurrentUserStoredPreference').and.callFake(()=> (this.storedPreference));
    public setSelectedPartnerDiscount = jasmine.createSpy('setSelectedPartnerDiscount').and.callFake(()=> {
        this.selectedPartner = {isSelected: true, partnerIdentifier: 'SAN', percentDiscount: 5, productDescription: 'Dumbo', userTier: 'tier', userMustFly: true};
        return this.selectedPartner;
    });
}
class IbCModalServiceMock { 
    public showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.callFake(()=> ({result: Promise.resolve()}));
}

class TestBench {
    public IbCheckPartnersDiscountsService: IbCheckPartnersDiscountsServiceMock;
    public IbCModalService: IbCModalServiceMock;
    public service: IbSetPartnersSelectionUtilsService;

    constructor () {
        this.IbCheckPartnersDiscountsService = new IbCheckPartnersDiscountsServiceMock();
        this.IbCModalService = new IbCModalServiceMock();
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            providers: [
                { provide: IbCheckPartnersDiscountsService, useValue: this.IbCheckPartnersDiscountsService },
                { provide: IbCModalService, useValue: this.IbCModalService },
                IbSetPartnersSelectionUtilsService
            ]
        });
        this.service = TestBed.inject(IbSetPartnersSelectionUtilsService);
    }

    public testCheckPartnerDiscountSelection = () => {
        return this.service.checkPartnerDiscountSelection().then((result)=> {
            expect(result).toEqual(this.IbCheckPartnersDiscountsService.selectedPartner);
        });
    };
}

describe ('Test IbSetPartnersSelectionUtilsService', ()=> {
    
    let testBench: TestBench ;
    beforeEach(() => {
        testBench = new TestBench();
    });

    
    it('CheckPartnerDiscountSelection when currently selected partner', (done) => {
        testBench.testCheckPartnerDiscountSelection().then(done);
    });
    it('CheckPartnerDiscountSelection when partner response is null', (done) => {
        testBench.IbCheckPartnersDiscountsService.partnerResponse = null;
        testBench.IbCheckPartnersDiscountsService.selectedPartner = null;
        testBench.testCheckPartnerDiscountSelection().then(done);
    });
    it('CheckPartnerDiscountSelection when has stored preference and ask for partners', (done) => {
        testBench.IbCheckPartnersDiscountsService.selectedPartner = null;
        testBench.testCheckPartnerDiscountSelection().then(done);
    });
    it('CheckPartnerDiscountSelection when has stored preference and dont ask for partners', (done) => {
        testBench.IbCheckPartnersDiscountsService.selectedPartner = null;
        testBench.IbCheckPartnersDiscountsService.storedPreference.dontAskPartner = true;
        testBench.testCheckPartnerDiscountSelection().then(done);
    });
    it('CheckPartnerDiscountSelection when has stored preference and dont and partnerResponse only have one partner', (done) => {
        testBench.IbCheckPartnersDiscountsService.selectedPartner = null;
        testBench.IbCheckPartnersDiscountsService.partnerResponse = testBench.IbCheckPartnersDiscountsService.partnerResponse.slice(0, 1);
        testBench.testCheckPartnerDiscountSelection().then(done);
    });
    
    
    
});
