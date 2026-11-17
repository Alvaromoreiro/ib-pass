export interface UpgradingAncillaryToUpgradeInfoMapperServiceType {
    map: (upgradingAncillarieResponse: UpgradingAncillariesResponse | null | undefined) => LegacyUpgradeInfo | null;
}
 
export interface UpgradingAncillariesResponse {
    currencies?: CurrencyInfo[];
    slices?: UpgradingSlice[];
    ancillaries?: UpgradingAncillary[];
}
 
export interface UpgradingSlice {
    id?: string;
    segmentIds?: string[];
}
 
export interface CurrencyInfo {
    code: string;
    description?: string;
    symbol?: string;
    alignment?: string;
    groupingSeparator?: string;
    decimalSeparator?: string;
    decimals?: number;
    recommendedDisplay?: string;
}
 
export interface UpgradingAncillary {
    type?: string;
    status?: UpgradingAncillaryStatus;
    currency?: string | CurrencyInfo;
    needsProductCatalog?: boolean;
    cabinLayout?: string;
    cabinLayoutDescription?: string;
    conditionsByCabinClass?: CabinConditions[];
    offers?: UpgradingOffer[];
    termsAndConditions?: string;
}
 
export interface UpgradingAncillaryStatus {
    code?: string;
    reason?: string | null;
    affectedElements?: unknown | null;
}
 
export interface CabinConditions {
    code?: string;
    conditions?: string[];
}
 
export interface UpgradingOffer {
    id?: string;
    offerSegmentsClass?: UpgradingOfferSegmentClass[];
    offerSegmentClasses?: UpgradingOfferSegmentClass[];
    amountPerPassenger?: number;
    totalAmount?: number;
    cabinLayout?: string;
    cabinLayoutDescription?: string;
}
 
export interface UpgradingOfferSegmentClass {
    segmentId?: string;
    segment?: string | number;
    cabinClass?: CabinClass;
}
 
export interface CabinClass {
    code?: string;
    type?: string;
    description?: string;
}
 
export interface LegacyUpgradeInfo extends Omit<UpgradingAncillary, 'currency' | 'offers'> {
    currency?: CurrencyInfo | string;
    offers: LegacyUpgradeOffer[];
}
 
export interface LegacyUpgradeOffer extends Omit<UpgradingOffer, 'offerSegmentsClass' | 'offerSegmentClasses'> {
    offerSegmentClasses: LegacyOfferSegmentClass[];
}
 
export interface LegacyOfferSegmentClass {
    segment?: string | number;
    cabinClass?: CabinClass;
}