import { TestBed } from '@angular/core/testing';
import { IbFlagsTransformer } from '@src/components/services/ib-MmB-flags-transformer';
import { StorageServiceMock } from '../../../utils/StorageServiceMock';

describe('Flags transformer tests', () => {
    let localStorageService: StorageServiceMock = new StorageServiceMock();

    let transformer:IbFlagsTransformer;

    const getMock = (flags: any, extraOptions) => {
        let orderFlags = [];
        flags = [].concat(flags);
        flags.forEach((flag: any)=> orderFlags.push(flag))
        return {
            'order': {
                'bookingReferences': [{
                    provider: 'IB'
                }],
                'slices': [{
                    passengerFlags: [{
                        flags: [
                            {
                                type: 'FLIGHT_MODIFICATION_FLEXIBLE',
                                enabled: true
                            },
                            {
                                type: 'FLIGHT_MODIFICATION',
                                enabled: true
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE',
                                enabled: true
                            },
                            {
                                type: 'FLIGHT_DISRUPTION_SEARCH',
                                enabled: true
                            }
                        ]
                    }]
                }]
            },
            'orderFlags': orderFlags,
            ...extraOptions
        }
    };

    const commonCheck = (backFlags, frontFlag, extraOptions?) => transformer.generateFlagsMenu(getMock(backFlags, extraOptions))[frontFlag];


    beforeEach(async ()=>{
        TestBed.configureTestingModule({
            declarations: [IbFlagsTransformer],
        });
        transformer = new IbFlagsTransformer(localStorageService as any);
    })


    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    it('should return default flags', () => {
        expect(transformer.generateFlagsMenu({
            'order': {
                'bookingReferences': []
            }
        })).toEqual({
            'showRefundLink': false,
            'showChangeFlightLink': false,
            'showChangeFlightDeepLink': true,
            'showFlexibilizationChangeSection': false,
            'showVoluntaryChangeFlightSection': false,
            'showRefundCashSection': false,
            'showCashRefundOnline': false,
            'showRefundVoucherSection': false,
            'showRefundVoucherSectionFunctional': false,
            'refundVoucherSection80': false,
            'showModalRefound48hs': false,
            'showLinkToRubiQ': false,
            'showFlexibilizationExceptionalMsg': false,
            'hideCashRefundSection': true,
            'allowedRefundVoucher': false,
            'enableExternalRefundLink': false,
            'showContactCenterText': false,
            'showOnlyVoucherRefundText': false,
            'cashPartialRefund': false,
            'importOrderFromDeepLink': false,
            'slicesWithFlexibilization': {},
            'slicesWithChangeFlight': {},
            'sisterCitiesData': {
                'hasSistercitiesPossibility': false,
                'allowedSlices': []
            },
            'showMonetateAlertCFPhone': false,
            'allowedInvoluntaryFlightChange': false,
            'hideChangeFlightMenuOption': false,
            'showVoluntaryFlexibleFlightChange': false,
            'flightModificationActive': false,
            'flexibleFlight': false,
            'displayCCPhone': false,
            'showSimulation': false
        });
    })

    it('should handle all showRefundCashSection interactions properly',()=>{
        const check = (flags) => commonCheck(flags, 'showRefundCashSection');
        expect(check([{type:'ALLOWED_REFUND_CASH',enabled:true}])).toBeTrue();
        expect(check([{type:'ALLOWED_REFUND_CASH',enabled:false}])).toBeFalse();
        expect(check({type:'CASH_PARTIAL_REFUND',enabled:true})).toBeTrue();
    })
    it('should handle all showCashRefundOnline interactions properly',()=>{
        const check = (flags) => commonCheck(flags, 'showCashRefundOnline');
        expect(check([{type:'CASH_REFUND',enabled:false},{type:'ALLOWED_REFUND_CASH',enabled:false}])).toBeFalse();
        expect(check([{type:'CASH_REFUND',enabled:true},{type:'ALLOWED_REFUND_CASH',enabled:false}])).toBeFalse();
        expect(check([{type:'CASH_REFUND',enabled:false},{type:'ALLOWED_REFUND_CASH',enabled:true}])).toBeFalse();
        expect(check([{type:'CASH_REFUND',enabled:true},{type:'ALLOWED_REFUND_CASH',enabled:true}])).toBeTrue();
        expect(check({type:'CASH_PARTIAL_REFUND',enabled:true})).toBeTrue();
    })
    it('should handle all showRefundVoucherSection interactions properly',()=>{
        const check = (flags, extraOptions?) => commonCheck(flags,'showRefundVoucherSection', extraOptions);
        expect(check([{type:'VOUCHER_REFUND',enabled:true},{type:'ALLOWED_REFUND_VOUCHER',enabled:true}])).toBeTrue();
        expect(check([{type:'VOUCHER_REFUND',enabled:true},{type:'ALLOWED_REFUND_VOUCHER',enabled:false}])).toBeFalse();
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:true}, {})).toBeTrue();
    })
    it('should handle all showRefundVoucherSectionFunctional interactions properly',()=>{
        const check = (flags, extraOptions?) => commonCheck(flags, 'showRefundVoucherSectionFunctional', extraOptions);
        expect(check([{type:'VOUCHER_REFUND',enabled:false},{type:'ALLOWED_REFUND_VOUCHER',enabled:false}])).toBeFalse();
        expect(check([{type:'VOUCHER_REFUND',enabled:true},{type:'ALLOWED_REFUND_VOUCHER',enabled:false}])).toBeFalse();
        expect(check([{type:'VOUCHER_REFUND',enabled:false},{type:'ALLOWED_REFUND_VOUCHER',enabled:true}])).toBeFalse();
        expect(check([{type:'VOUCHER_REFUND',enabled:true},{type:'ALLOWED_REFUND_VOUCHER',enabled:true}])).toBeTrue();
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:true}, {})).toBeTrue();
    })
    it('should handle all refundVoucherSection80 interactions properly',()=>{
        const check = (flags, extraOptions?) => commonCheck(flags,'refundVoucherSection80', extraOptions);
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:false}, {flexibilizationCapabilitiesInformation: null})).toBeFalse();
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:true}, {flexibilizationCapabilitiesInformation: 1})).toBeFalse();
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:true}, {flexibilizationCapabilitiesInformation: {code: 'COVID19'}})).toBeFalse();
        expect(check({type:'VOUCHER_REFUND_ON_DEMAND',enabled:true}, {flexibilizationCapabilitiesInformation: null})).toBeTrue();
    })
    it('should handle all showModalRefound48hs interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'showModalRefound48hs');
        expect(check([{type:'VOUCHER_REFUND_ON_DEMAND',enabled:true},{type:'VOUCHER_REFUND_RESTRICTION',enabled:false}])).toBeFalse();
        expect(check([{type:'VOUCHER_REFUND_ON_DEMAND',enabled:false},{type:'VOUCHER_REFUND_RESTRICTION',enabled:true}])).toBeFalse();
        expect(check([{type:'VOUCHER_REFUND_ON_DEMAND',enabled:true},{type:'VOUCHER_REFUND_RESTRICTION',enabled:true}])).toBeTrue();
    })
    it('should handle all hideCashRefundSection interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'hideCashRefundSection');
        expect(check([{type:'ALLOWED_REFUND_CASH',enabled:false}])).toBeTrue();
        expect(check([{type:'ALLOWED_REFUND_CASH',enabled:true}])).toBeFalse();
    })
    it('should handle all allowedRefundVoucher interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'allowedRefundVoucher');
        expect(check([{type:'ALLOWED_REFUND_VOUCHER',enabled:true}])).toBeTrue();
    })
    it('should handle all importOrderFromDeepLink interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'importOrderFromDeepLink');
        expect(check({type:'IMPORT_ORDER_FROM_DEEPLINK',enabled:false})).toBeFalse();
        expect(check({type:'IMPORT_ORDER_FROM_DEEPLINK',enabled:true})).toBeTrue();
    })
    it('should handle all allowedInvoluntaryFlightChange interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'allowedInvoluntaryFlightChange');
        expect(check({type:'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE',enabled:true})).toBeTrue();
    })
    it('should handle all cashPartialRefund interactions properly',()=>{
        const check = (flags) => commonCheck(flags,'cashPartialRefund');
        expect(check({type:'CASH_PARTIAL_REFUND',enabled:false})).toBeFalse();
        expect(check({type:'CASH_PARTIAL_REFUND',enabled:true})).toBeTrue();
    })

})
