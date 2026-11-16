import { TestBed } from '@angular/core/testing';
import { AncillariesUpgradingTransformer } from '@src/app/pages/ib-booking-ancillaries/transformer/ib-web-ancillaries-upgrading-transformer.service';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';

describe('AncillariesUpgradingTransformer Test:', () => {
    let localStorageService: StorageServiceMock;
    let service: AncillariesUpgradingTransformer;
    const fakeCurrencyService = {
        formatAvios: jasmine.createSpy().and.callFake((symbol, value) => {
            return value;
        })
    };
    const segments: any = [
        { id: 'IB625120230515', cabins: [{ type: 'BUSINESS', rbd: 'C', numToUse: 1 }] },
        {
            id: 'IB625020230521',
            cabins: [
                { type: 'BUSINESS', rbd: 'C', numToUse: 2 },
                { type: 'PREMIUMTOURIST', rbd: 'E', numToUse: 1 }
            ]

        }
    ];
    const segmentAncillaries = [
        { id: 'IB625120230515', cabins: [{ type: 'BUSINESS', rbd: 'C', numToUse: 1 }] },
        {
            id: 'IB625020230521',
            cabins: [
                { type: 'BUSINESS', rbd: 'C', numToUse: 2 },
                { type: 'PREMIUMTOURIST', rbd: 'E', numToUse: 1 }
            ]
        }
    ];
    const segmentAncillary = {
        status: { code: 'AVAILABLE', reason: null },
        currency: null,
        offers: [
            {
                subType: 'STANDARD',
                aviosBalance: 2360108,
                segments: [{ id: 'IB625020230521', cabins: [{ type: 'PREMIUMTOURIST', rbd: 'T', avios: 8500 }] }]
            },
            {
                subType: 'FREE',
                coupons: [
                    { id: '1000009227568', numToUse: 1 },
                    { id: '1000009227537', numToUse: 1 },
                    { id: '1000009227575', numToUse: 1 },
                    { id: '1000007149770', numToUse: 1 },
                    { id: '1000007149787', numToUse: 1 },
                    { id: '1000000143126', numToUse: 1 }
                ],
                segments: [
                    { id: 'IB625120230515', cabins: [{ type: 'BUSINESS', rbd: 'C', numToUse: 1 }] },
                    {
                        id: 'IB625020230521',
                        cabins: [
                            { type: 'BUSINESS', rbd: 'C', numToUse: 2 },
                            { type: 'PREMIUMTOURIST', rbd: 'E', numToUse: 1 }
                        ]
                    }
                ]
            }
        ],
        type: 'UPGRADING_AVIOS'
    };
    const offer = {
        subType: 'FREE',
        coupons: [
            { id: '1000009227568', numToUse: 1 },
            { id: '1000009227537', numToUse: 1 },
            { id: '1000009227575', numToUse: 1 },
            { id: '1000007149770', numToUse: 1 },
            { id: '1000007149787', numToUse: 1 },
            { id: '1000000143126', numToUse: 1 }
        ],
        segments: [
            { id: 'IB625120230515', cabins: [{ type: 'BUSINESS', rbd: 'C', numToUse: 1 }] },
            {
                id: 'IB625020230521',
                cabins: [
                    { type: 'BUSINESS', rbd: 'C', numToUse: 2 },
                    { type: 'PREMIUMTOURIST', rbd: 'E', numToUse: 1 }
                ]
            }
        ]
    };
    const ancillariesUpgradingBidsInfo = {
        status: { code: 'AVAILABLE', reason: null },
        currency: null,
        offers: [
            {
                subType: 'STANDARD',
                aviosBalance: 2360108,
                segments: [{ id: 'IB625020230521', cabins: [{ type: 'PREMIUMTOURIST', rbd: 'T', avios: 8500 }] }]
            },
            {
                subType: 'FREE',
                coupons: [
                    { id: '1000009227568', numToUse: 1 },
                    { id: '1000009227537', numToUse: 1 },
                    { id: '1000009227575', numToUse: 1 },
                    { id: '1000007149770', numToUse: 1 },
                    { id: '1000007149787', numToUse: 1 },
                    { id: '1000000143126', numToUse: 1 }
                ],
                segments: [
                    { id: 'IB625120230515', cabins: [{ type: 'BUSINESS', rbd: 'C', numToUse: 1 }] },
                    {
                        id: 'IB625020230521',
                        cabins: [
                            { type: 'BUSINESS', rbd: 'C', numToUse: 2 },
                            { type: 'PREMIUMTOURIST', rbd: 'E', numToUse: 1 }
                        ]
                    }
                ]
            }
        ],
        type: 'UPGRADING_AVIOS'
    };
  
    localStorageService = new StorageServiceMock();
    beforeEach(() => {
        
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                { provide: CommonsSessionStorageService, useValue: localStorageService}
            ],
            schemas: []
        });
        service = TestBed.inject(AncillariesUpgradingTransformer);
        
    });

    it('should return BidSegment cabins when generate available cabins', () => {
        const returnedValue = service.generateAvailableCabins(segmentAncillary, segments);

        expect(returnedValue.length).toEqual(segments.length);
    });

    it('should return BidSegment parse with free cabins', () => {
        const returnedValue = service.generateAvaibleFreeCabins(segmentAncillaries, segments);

        expect(returnedValue.length).toEqual(segments.length);
    });

    it('should return map of segments from offers', () => {
        const returnedValue = service.getMapAvailableFreeCabins(offer);

        expect(returnedValue.length).toEqual(offer.segments.length);
    });

    it('should return total count of avios from offers', () => {
        const returnedValue = service.sumTotalOffers(offer);

        expect(returnedValue).toEqual(6);
    });

    it('should return avios balance when segments avios from offers', () => {
        const aviosBalance = service.getTotalUserAviosFormated(ancillariesUpgradingBidsInfo);

        expect(fakeCurrencyService.formatAvios).toHaveBeenCalled();
        expect(aviosBalance).toEqual(ancillariesUpgradingBidsInfo.offers[0].aviosBalance);
    });
});
