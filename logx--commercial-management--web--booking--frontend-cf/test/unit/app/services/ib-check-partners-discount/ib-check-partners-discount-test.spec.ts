import { TestBed } from '@angular/core/testing';
import { IbCheckPartnersDiscountsService } from '@shared/services/ib-check-partners-discount/ib-check-partners-discount.service';
import { AJSRootScope, CommonsSessionStorageService, CommonsBrowserStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
describe ('IbCheckPartnersDiscountsService', ()=> {
    let service: IbCheckPartnersDiscountsService;
    class TestConstants {
        _FAKEROOTSCOPECONSTANT = {
            customerData: {
                personalInfo: {
                ibPlusNumber: '1'
            },
                generalInfo: {
                    hashEID : '1'
                }
            }
        };
        _BKICONSTANTS = {
            PARTNERS_INFO: {
                USER_PREFERENCES_KEY: 'ib-booking-partnerPreferences',
                USER_PREFERENCES_MAXSTORAGE: 20
            }
        };
        _PROCESSED_PARTNERS =
            [
                {
                    partnerIdentifier: 'SAN',
                    percentDiscount: 10,
                    productDescription: 'Plan Santander IberiaPlus',
                    userTier: 'ELITE',
                    isSelected: false,
                    userMustFly: true
                }, {
                    partnerIdentifier: 'IBCARDS',
                    percentDiscount: 5,
                    productDescription: 'Iberia Cards',
                    userTier: '',
                    isSelected: false,
                    userMustFly:false
                }

            ];
        _PARTNERRESPONSE = {
            partners: [
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
                    }
                }
            ]
        };
        _STOREDPREFERENCES =  {
            '1': {dontAskPartner: true, selectedPartnerId: 'SAN', timeStamp: 1664804233293},
            '2': {dontAskPartner: false, selectedPartnerId: 'IBCARDS', timeStamp: 1664804233293}
        };
        get BKIConstants () : BookingAppConstants {
            return JSON.parse(JSON.stringify(this._BKICONSTANTS));
        }
        get partnerResponse (): typeof this._PARTNERRESPONSE {
            return JSON.parse(JSON.stringify(this._PARTNERRESPONSE));
        }
        get processedPartners (): partnerDiscountInfoBKI[] {
            return JSON.parse(JSON.stringify(this._PROCESSED_PARTNERS));
        }
        get rootScope (): CommonsRootScope {
            return JSON.parse(JSON.stringify(this._FAKEROOTSCOPECONSTANT));
        }
        get userStoredPreferences (): IbCheckPartnersDiscountModel.storedPartnerPreferences {
            return JSON.parse(JSON.stringify(this._STOREDPREFERENCES));
        }
    }
    const fakeBrowserStorage = new StorageServiceMock();
    const fakeSessionStorage = new StorageServiceMock();
    const CONSTANTS = new TestConstants();
    let fakePartnerServiceResponse = CONSTANTS.partnerResponse;
    let fakeRootScope = CONSTANTS.rootScope;


    beforeEach(() => {
        fakeBrowserStorage.clear();
        fakeSessionStorage.clear();
        fakePartnerServiceResponse = CONSTANTS.partnerResponse;
        fakeRootScope = CONSTANTS.rootScope;
        fakeRootScope.isLogged = true;
        fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
        fakeRootScope.customerData.partners= fakePartnerServiceResponse.partners;
        fakeRootScope.customerData.personalInfo.applyPartersDiscounts = true;
        TestBed.configureTestingModule({
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: CommonsSessionStorageService, useValue: fakeSessionStorage },
                { provide: CommonsBrowserStorageService, useValue: fakeBrowserStorage },
            ]
        });
        service = TestBed.inject(IbCheckPartnersDiscountsService);
    });

    describe('Test getPartnersResponse', () => {
        beforeEach(()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = null;
            fakeRootScope.customerData.partners= null;
            fakeSessionStorage.clear();
            fakePartnerServiceResponse = CONSTANTS.partnerResponse;
        });
        it ('When there is no stored data', () => {
            const data = service.getPartnersResponse();
            expect(data).toEqual([]);

        });
        it ('When there is partnersInfoBKI into rootscope.customerData', () => {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
            const data = service.getPartnersResponse();
            expect(data).toEqual(CONSTANTS.processedPartners);
        });
        it ('When there is a partner service response on rootscope.customerData and sets partnersInfoBKI', () => {
            fakeRootScope.customerData.partners= CONSTANTS.partnerResponse.partners;
            const data = service.getPartnersResponse()
            const st: CustomerDataCommons =  fakeSessionStorage.get('customerData');
            expect(st.personalInfo.partnersInfoBKI).toEqual(CONSTANTS.processedPartners);

        });
        it('When partner response only has one partner on the collection and service response is on rootscope.customerData', ()=>{
            fakeRootScope.customerData.partners = [fakePartnerServiceResponse.partners[0]];
            const particularResponse = CONSTANTS.processedPartners[0];
            particularResponse.isSelected = true;
            service.getPartnersResponse()
            const st: CustomerDataCommons =  fakeSessionStorage.get('customerData');
        });

    });
    describe('Test setSelectedPartnerDiscount', () => {
        beforeEach(()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
            fakeRootScope.customerData.partners= CONSTANTS.partnerResponse.partners;
            fakeRootScope.customerData.personalInfo.applyPartersDiscounts = true;
        });
        it ('When there is no stored data', () => {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = null;
            const partner= service.setSelectedPartnerDiscount ('SAN');
            expect(partner).toBe(null);
        });
        it ('When partnersInfoBKI has data partner that matches the code', () => {
            const partner = service.setSelectedPartnerDiscount ('SAN');
            const partnerTest = CONSTANTS.processedPartners[0];
            partnerTest.isSelected = true;
            expect(partner).toEqual(partnerTest);
        });
    });
    describe('Test checkPartnersDiscount', () => {
        beforeEach(()=> {
            fakeRootScope.customerData.personalInfo.applyPartersDiscounts = true;
            fakeRootScope.isLogged = true;
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
        });
        it ('When is not logged', ()=> {
            fakeRootScope.isLogged = false;
            const result = service.checkPartnersDiscount();
            expect(result).toBeFalse();
        });
        it ('When is parnerDiscount must not apply', ()=> {
            fakeRootScope.customerData.personalInfo.applyPartersDiscounts = false;
            const result = service.checkPartnersDiscount();
            expect(result).toBeFalse();
        });
        it ('When is no partner info processed', ()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = null;
            const result = service.checkPartnersDiscount();
            expect(result).toBeFalse();
        });
        it ('When is partner info processed', ()=> {
            const result = service.checkPartnersDiscount();
            expect(result).toBeTrue();
        });
    });
    describe('Test getSelectedPartner and remove selected', () => {
        beforeEach(()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
        });
        it('No selected partner', ()=> {
            const result = service.getSelectedPartner();
            expect(result).toBe(null);
        });
        it ('There are a selected partner', ()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI['0'].isSelected = true;
            const result = service.getSelectedPartner();
            expect(result).toEqual(fakeRootScope.customerData.personalInfo.partnersInfoBKI['0']);
        });
        it('when removeSelectedPartner is called', ()=> {
            fakeRootScope.customerData.personalInfo.partnersInfoBKI['0'].isSelected = true;
            service.removeSelectedPartner();
            const result = service.getSelectedPartner();
            expect(result).toEqual(null);
        })
    });
    describe('Test setPartnersDiscountsApplicationFlag ', () => {
        it('Accessible data', ()=> {
            const result = service.setPartnersDiscountsApplicationFlag (true);
            expect(result).toBe(true);
        });
    });
    describe('Test getPartnersDiscountsApplicationFlag', () => {
        it('Accessible data', ()=> {
            const result = service.getPartnersDiscountsApplicationFlag  ();
            expect(result).toBe(true);
        });
    });
    describe('getCurrentUserStoredPreference', () => {
        beforeEach(()=> {
            fakeRootScope = Object.assign(fakeRootScope, CONSTANTS.rootScope);
            fakeRootScope.isLogged = true;
            fakeRootScope.customerData.personalInfo.partnersInfoBKI = CONSTANTS.processedPartners;
            fakeRootScope.customerData.partners= fakePartnerServiceResponse.partners;
            fakeRootScope.customerData.personalInfo.applyPartersDiscounts = true;
        });
        it ('Stored value', ()=> {
            fakeBrowserStorage.set(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, CONSTANTS.userStoredPreferences);
            const strData = service.getCurrentUserStoredPreference ();
            expect(strData).toEqual(CONSTANTS.userStoredPreferences[CONSTANTS.rootScope.customerData.generalInfo.hashEID]);
        });
        it('When user is soft and there is stored preference in sessionStorage', () => {
            fakeSessionStorage.set(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, CONSTANTS.userStoredPreferences['1']);
            fakeRootScope.customerData.personalInfo.ibPlusNumber = '***1';
            const strData = service.getCurrentUserStoredPreference();
            expect(strData).toEqual(CONSTANTS.userStoredPreferences['1']);
        });
    });
    describe('setCurrentUserStoredPreference', () => {
        beforeEach(() => {
            fakeRootScope = Object.assign(fakeRootScope, CONSTANTS.rootScope);
            fakeRootScope.customerData.generalInfo.hashEID = '2';
        });
        it('When user is soft and then store preference in sessionStorage', () => {
            fakeRootScope.customerData.personalInfo.ibPlusNumber = '***1';
            const strData = service.setCurrentUserStoredPreference(false, 'SAN');
            const data: IbCheckPartnersDiscountModel.userPartnerPreference  = fakeSessionStorage.get(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY);
            expect(data.dontAskPartner).toEqual(false);
            expect(data.selectedPartnerId).toEqual('SAN');
        });
        it ('Already stored value', ()=> {
            fakeBrowserStorage.set(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, CONSTANTS.userStoredPreferences);
            service.setCurrentUserStoredPreference (true, 'TEST');
            const storedValue = fakeBrowserStorage.get(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY);
            expect(storedValue['2'].dontAskPartner).toEqual(true);
            expect(storedValue['2'].selectedPartnerId).toEqual('TEST');
        });
        it('storage has reach the limit', (done)=> {
            const newTestStorage = {};
            let olderEntry;
            let timeStamp = new Date().getTime();
            for(let i = 1;i <= CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_MAXSTORAGE; i++) {
                const aux = {dontAskPartner: true, selectedPartnerId: 'SAN', timeStamp: timeStamp};
                if (i === 1) {
                    olderEntry = aux;
                }
                newTestStorage[timeStamp] = aux;
                timeStamp++;

            }
            fakeBrowserStorage.set(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, newTestStorage);
            setTimeout(()=> {
                service.setCurrentUserStoredPreference (true, 'TEST');
                const storedValue  = fakeBrowserStorage.get(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_KEY);
                expect(Object.keys(storedValue).length).toEqual(CONSTANTS.BKIConstants.PARTNERS_INFO.USER_PREFERENCES_MAXSTORAGE);
                expect(storedValue[2].dontAskPartner).toEqual(true);
                expect(storedValue[2].selectedPartnerId).toEqual('TEST');
                expect(storedValue[olderEntry.timeStamp]).toEqual(undefined);
                done();
            }, 50);
        });
    });
    describe('Test createPartnerDiscountFromDiscountResponse', () => {
        it ('Generate from response', ()=> {
            const discountModel = {partner: {partnerId: 'SAN'}, percentDiscount: 10, description: 'test', userMustFly: true};
            const result = service.createPartnerDiscountFromDiscountResponse(discountModel as any);
            expect(result).toEqual({
                partnerIdentifier: 'SAN',
                percentDiscount: 10,
                productDescription: 'test',
                userTier: '',
                userMustFly: true,
                isSelected: true
            });
        });
    });
});
