import { Inject, Injectable } from '@angular/core';
import { CommonsBrowserStorageService, CommonsSessionStorageService, AJSRootScope, downgradeToAJSService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

@Injectable({
    providedIn: 'root'
})
export class IbCheckPartnersDiscountsService {
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsBrowserStorageService: CommonsBrowserStorageService
    ) {}
    getPartnersResponse = (): partnerDiscountInfoBKI[] => {
        const transformData = (array: Array<partnersInfo>): Array<partnerDiscountInfoBKI> => {
            return array.map((partnerProgram) => this.mapPartnerProgram(partnerProgram));
        };

        if (this.hasPartnersInfoBKI()) {
            return this.$rootScope.customerData.personalInfo.partnersInfoBKI;
        } else if (this.hasValidPartners()) {
            const partnerList: Array<partnerDiscountInfoBKI> = transformData(this.$rootScope.customerData.partners);
            this.selectSinglePartner(partnerList);
            this.setPartnersDiscountsApplicationFlag(true);
            this.updateCustomerData(partnerList);
            return partnerList;
        } else {
            return [];
        }
    };

    private mapPartnerProgram (partnerProgram: partnersInfo): partnerDiscountInfoBKI {
        return {
            partnerIdentifier: partnerProgram.partnerIdentifier || '',
            percentDiscount: partnerProgram.partnerProduct.percentDiscount || 0,
            productDescription: partnerProgram.partnerProduct.productDescription || '',
            userTier: partnerProgram.partnerProduct.productTier || '',
            userMustFly: partnerProgram.partnerProduct.userMustFly ?? true,
            isSelected: false
        };
    }

    private hasPartnersInfoBKI (): boolean {
        return this.$rootScope.customerData && this.$rootScope.customerData?.personalInfo?.partnersInfoBKI?.length > 0;
    }

    private hasValidPartners (): boolean {
        return this.$rootScope.customerData && this.$rootScope.customerData.partners && Array.isArray(this.$rootScope.customerData.partners);
    }

    private selectSinglePartner (partnerList: Array<partnerDiscountInfoBKI>): void {
        if (partnerList !== null && partnerList.length === 1) {
            partnerList[0].isSelected = true;
        }
    }

    private updateCustomerData (partnerList: Array<partnerDiscountInfoBKI>): void {
        this.$rootScope.customerData.personalInfo.partnersInfoBKI = partnerList;
        this.CommonsSessionStorageService.set('customerData', this.$rootScope.customerData);
    }
    setSelectedPartnerDiscount = (selectedProgram: string) :partnerDiscountInfoBKI => {
      
        let matchElement: partnerDiscountInfoBKI = null;
        try{
            if (selectedProgram?.length > 0 && this.checkPartnersDiscount()) {
                this.$rootScope.customerData.personalInfo.partnersInfoBKI.map((element): partnerDiscountInfoBKI => {
                    element.isSelected = selectedProgram === element.partnerIdentifier;
                    if(element.isSelected) {
                        matchElement = element;
                    }
                    return element;
                });
                matchElement.isSelected = true;
                this.CommonsSessionStorageService.set('customerData', this.$rootScope.customerData);
                if ( this.$rootScope.customerData !== null ) {
                    this.$rootScope.$broadcast( 'getCustomerDataBonusCheck', this.$rootScope.customerData );
                }
            }
            return matchElement;
        } catch (e) {
            return matchElement;
        }

    };
    removeSelectedPartner = () => {
        try {
            const partners = this.$rootScope.customerData.personalInfo.partnersInfoBKI ?? [];
            partners.forEach(e => {e.isSelected = false;});
            this.CommonsSessionStorageService.set('customerData', this.$rootScope.customerData);
            if ( this.$rootScope.customerData !== null ) {
                this.$rootScope.$broadcast( 'getCustomerDataBonusCheck', this.$rootScope.customerData );
            }
        } catch(exception) {
            return;
        }
    };

    checkPartnersDiscount = () :boolean=>{
        try {
            const usePartner: boolean = this.$rootScope.customerData.personalInfo.applyPartersDiscounts;
            return this.$rootScope.isLogged === true && this.$rootScope.customerData.personalInfo.partnersInfoBKI.length > 0 && usePartner;
        }catch (e) {
            return false;
        }
    };
    getSelectedPartner = (): partnerDiscountInfoBKI => {
        let result = null;
        if (this.checkPartnersDiscount()) {
            result = this.$rootScope.customerData.personalInfo.partnersInfoBKI.find((element: partnerDiscountInfoBKI) => element.isSelected) || null;
        }
        return result;
    };
    /**
     *
     * @returns value of the variable this.$rootScope.customerData.personalInfo.applyPartersDiscount that controls if discounts are active or false if it's unrechable
     */
    setPartnersDiscountsApplicationFlag = (value: boolean):boolean => {
        try {
            this.$rootScope.customerData.personalInfo.applyPartersDiscounts = value;
            this.CommonsSessionStorageService.set('customerData', this.$rootScope.customerData);
            return this.$rootScope.customerData.personalInfo.applyPartersDiscounts;
        }catch(e) {
            return false;
        }
    };
    getPartnersDiscountsApplicationFlag = ():boolean => {
        try {
            return this.$rootScope.customerData.personalInfo.applyPartersDiscounts;
        }catch(e) {
            return false;
        }
    };
    getCurrentUserStoredPreference = (): IbCheckPartnersDiscountModel.userPartnerPreference => {
        try {
            return this.getStoredPreference(this.getCurrentUserId());
        } catch (e) {
            return null;
        }
    };

    private getCurrentUserId (): string {
        const currentUserId: string =
            (this.$rootScope.customerData?.personalInfo?.ibPlusNumber.indexOf('*') === -1) ? this.$rootScope.customerData?.generalInfo?.hashEID ?? '' : 'session';
        return currentUserId;
    }

    private getStoredPreference (currentUserId: string): IbCheckPartnersDiscountModel.userPartnerPreference {
        if (currentUserId.length > 0 && currentUserId !== 'session') {
            const key = currentUserId;
            const storedValue: IbCheckPartnersDiscountModel.storedPartnerPreferences
                = <IbCheckPartnersDiscountModel.storedPartnerPreferences>this.CommonsBrowserStorageService.get(BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_KEY);
            return storedValue[key] || null;
        } else if (currentUserId === 'session') {
            return <IbCheckPartnersDiscountModel.userPartnerPreference>this.CommonsSessionStorageService.get(BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_KEY) || null;
        } else {
            return null;
        }
    }
    /**
     * @returns Returns true if was able to set the information in the browserstorage
     */
    setCurrentUserStoredPreference = (dontAskPartner, selectedPartnerId): boolean => {
        const userPreference : IbCheckPartnersDiscountModel.userPartnerPreference = {dontAskPartner, selectedPartnerId, timeStamp: new Date().getTime()};
        try {
            const currentUserId: string = this.determineCurrentUserId();
            if (currentUserId.length > 0 && currentUserId !== 'session') {
                return this.storeUserPreference(currentUserId, userPreference);
            } else if (currentUserId === 'session') {
                this.CommonsSessionStorageService.set(BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, userPreference);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    };

    private determineCurrentUserId (): string {
        return (this.$rootScope.customerData?.personalInfo?.ibPlusNumber.indexOf('*') === -1) ? this.$rootScope.customerData?.generalInfo?.hashEID ?? '' : 'session';
    }

    private storeUserPreference (currentUserId: string, userPreference: IbCheckPartnersDiscountModel.userPartnerPreference): boolean {
        const currentObj = this.CommonsBrowserStorageService.get<IbCheckPartnersDiscountModel.storedPartnerPreferences | object>(BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_KEY) ?? {};
        const key = currentUserId;
        let minTimeStamp: number = Number.MAX_SAFE_INTEGER;
        let olderKey;
        currentObj[key] = userPreference;
        if (Object.keys(currentObj).length > BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_MAXSTORAGE) {
            for (const auxKey in currentObj) {
                if (currentObj[auxKey].timeStamp <= minTimeStamp) {
                    minTimeStamp = currentObj[auxKey].timeStamp;
                    olderKey = auxKey;
                }
            }
            if (olderKey) {
                delete currentObj[olderKey];
            }
        }
        this.CommonsBrowserStorageService.set(BookingAppConstants.PARTNERS_INFO.USER_PREFERENCES_KEY, currentObj);
        return true;
    }

    createPartnerDiscountFromDiscountResponse = (discountResponse: discountAppliedResponse): partnerDiscountInfoBKI => {
        return {
            partnerIdentifier: discountResponse?.partner.partnerId ?? '',
            percentDiscount: discountResponse.percentDiscount ?? 0,
            productDescription: discountResponse.description ?? '',
            userTier: '',
            userMustFly: discountResponse.userMustFly ?? false,
            isSelected: true
        };
    };


    isDiscountTypePartnerEquivalent = (discountType): boolean => {
        return discountType === BookingAppConstants.DISCOUNT_TYPES.DUMBO || discountType === BookingAppConstants.DISCOUNT_TYPES.PLUTO;
    };


}
downgradeToAJSService('IbCheckPartnersDiscountsService', IbCheckPartnersDiscountsService, 'ib-booking-services-module');
