import * as angular from 'angular';
import { AncillariesMMBConstants } from '@src/components/ib-MmB-ancillaries-page/constants/ib-MmB-ancillaries-constants';

export class AncillariesUpgradingTransformer {
    constructor (
        private currencyService: CurrencyService,
        private ancillariesConstant: AncillariesMMBConstants,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}

    generateAvailableCabins = (ancillaries: any, segments: BidSegment[] = []): BidSegment[] => {
        if (segments && segments.length > 0) {
            const transAncillaries: BidSegment[] = this.generateAvailableCabins(ancillaries) || [];
            if (segments.length <= transAncillaries.length) {
                transAncillaries?.forEach((trans) => {
                    if (!segments.find((segment) => segment.id === trans.id)) {
                        segments.push(trans);
                    }
                });
            }
            segments?.forEach((segment, i) => {
                transAncillaries?.forEach((transSegment) => {
                    if (transSegment.id === segment.id) {
                        segment.availableCabins?.forEach((cabin, j) => {
                            transSegment.availableCabins?.forEach((transCabin) => {
                                if (segments[i].availableCabins[j].cabinType === transCabin.cabinType) {
                                    for (const prop in cabin) {
                                        if (this.equalZero(cabin[prop])) {
                                            segments[i].availableCabins[j][prop] = transCabin[prop];
                                        }
                                    }
                                }
                            });
                        });
                    }
                });
            });
            return segments;
        } else {
            return ancillaries.type === this.ancillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID
                ? this.genBidCabins(ancillaries.segments)
                : this.genAviosCabins(ancillaries.offers);
        }
    };

    generateAvaibleFreeCabins = (segmentAncillaries: any[], segments: BidSegment[] = []): BidSegment[] => {
        if (segments.length <= segmentAncillaries.length) {
            segmentAncillaries?.forEach((trans) => {
                if (!segments.find((segment) => segment.id === trans.id)) {
                    segments.push(trans);
                }
            });
        }
        segments?.forEach((seg) => ({
            id: seg.id,
            availableCabins: seg.availableCabins?.map((cabin) => ({
                cabinType: cabin?.cabinType,
                minimumAllowedBid: cabin?.minimumAllowedBid || 0,
                maximumExpectedBid: cabin?.maximumExpectedBid || 0,
                avios: cabin?.avios || 0,
                free: 0
            }))
        }));
        segments?.forEach((segment) => {
            const segmentAncActual = segmentAncillaries.find((segmentAnc) => segment.id === segmentAnc.id);
            if (segmentAncActual) {
                segment.availableCabins?.forEach((cabin) => {
                    const numToUseBusiness =
                        segmentAncActual.cabins?.find((cabinBusiness) => cabinBusiness.type === 'BUSINESS')?.numToUse |
                        0;
                    const numToUsePremium =
                        segmentAncActual.cabins?.find((cabinPremium) => cabinPremium.type === 'PREMIUMTOURIST')
                            ?.numToUse | 0;
                    cabin.free = cabin.cabinType === 'BUSINESS' ? numToUseBusiness : numToUsePremium;
                });
            }
        });
        return segments;
    };

    getMapAvailableFreeCabins = (offer: any): BidSegment[] => {
        const transformSegment = offer.segments.map((seg) => ({
            id: seg.id,
            availableCabins: seg.cabins.map((cabin) => ({
                cabinType: cabin?.type,
                minimumAllowedBid: 0,
                maximumExpectedBid: 0,
                avios: cabin?.avios || 0,
                free: cabin.numToUse
            }))
        }));
        return transformSegment;
    };

    sumTotalOffers = (offer: any): number => {
        return offer.coupons.reduce((accumulator: number, coupon: any) => {
            return accumulator + coupon.numToUse;
        }, 0);
    };

    getTotalUserAviosFormated = (ancillariesUpgradingBidsInfo) => {
        let aviosBalance: number;
        const customerInfo: any = this.localStorageService.get('customerData');
        if (ancillariesUpgradingBidsInfo.offers[0].aviosBalance) {
            aviosBalance = ancillariesUpgradingBidsInfo.offers[0].aviosBalance;
        } else {
            aviosBalance = customerInfo.generalInfo.aviosTransformed;
        }
        aviosBalance = this.currencyService.formatAvios('.', aviosBalance);
        return aviosBalance;
    };

    private equalZero (n) {
        return typeof n === 'number' && n === 0;
    }

    private genAviosCabins (offers) {
        let segmentAvios = [];
        offers?.forEach((offer) => {
            segmentAvios = [...segmentAvios, ...this.genAviosStandardCabins(offer)];
        });
        return this.combineSegments(segmentAvios);
    }

    private combineSegments (segments) {
        const arrayHashmap = [...segments].reduce((obj, item) => {
            obj[item.id] ? obj[item.id].availableCabins.push(...item.availableCabins) : (obj[item.id] = { ...item });
            return obj;
        }, {});
        const mergedArray: BidSegment[] = Object.values(arrayHashmap);
        return mergedArray.map((segment) => {
            return {
                ...segment,
                availableCabins: this.combineCabins(segment.availableCabins).sort((a, b) =>
                    a.cabinType.localeCompare(b.cabinType)
                )
            };
        });
    }

    private combineCabins (cabins) {
        const combineCabinsByType = [...cabins].reduce((obj, item) => {
            obj[item.cabinType] = obj[item.cabinType] ? { ...obj[item.cabinType], ...item } : { ...item };
            return obj;
        }, {});
        return Object.values(combineCabinsByType) as any[];
    }

    private genAviosStandardCabins (offers) {
        if (offers.subType === 'STANDARD') {
            return offers?.segments.map((seg) => ({
                id: seg.id,
                availableCabins: seg.cabins.map((cabin) => ({
                    cabinType: cabin?.type,
                    minimumAllowedBid: 0,
                    maximumExpectedBid: 0,
                    avios: cabin?.avios || 0
                }))
            }));
        } else {
            return offers?.segments.map((seg) => ({
                id: seg.id,
                availableCabins: seg.cabins.map((cabin) => ({
                    cabinType: cabin?.type,
                    minimumAllowedBid: 0,
                    maximumExpectedBid: 0,
                    free: cabin?.numToUse || 0
                }))
            }));
        }
    }

    private genBidCabins (segments) {
        return segments?.map((seg) => ({
            id: seg.id,
            availableCabins: seg.availableCabins?.map((cabin) => ({
                cabinType: cabin?.cabinType,
                minimumAllowedBid: cabin?.minimumAllowedBid || 0,
                maximumExpectedBid: cabin?.maximumExpectedBid || 0,
                avios: 0,
                free: 0
            }))
        }));
    }
}

AncillariesUpgradingTransformer.$inject = ['CurrencyService', 'AncillariesConstants', 'localStorageService'];
try {
    const mod = angular.module('ib-MmB-transformers-module');
    mod.service('AncillariesUpgradingTransformer', AncillariesUpgradingTransformer);
} catch (error) {
    const mod = angular.module('ib-MmB-transformers-module', []);
    mod.service('AncillariesUpgradingTransformer', AncillariesUpgradingTransformer);
}
