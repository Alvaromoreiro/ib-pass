namespace IbCheckPartnersDiscountModel {
    export type storedPartnerPreferences = {
        [id: string] : userPartnerPreference
    };
    export type userPartnerPreference = {
        dontAskPartner: boolean;
        selectedPartnerId: string;
        timeStamp: number;
    };
}