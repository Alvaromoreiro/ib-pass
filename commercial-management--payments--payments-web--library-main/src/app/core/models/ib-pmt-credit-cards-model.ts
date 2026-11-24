namespace creditCardModel {

    export interface Country {
        code: string,
        description: string,
        isoCode: string
    }

    export type SelectedData = {
        state?: string,
        zipCode?: string,
        selectedCard?: SelectedCard
    };

    export type SelectedCard = {
        cardTypeCode: string,
        cardTypeId?: string,
        cvv?: {
            length: number,
            mandatory: boolean,
        },
        description?: string,
        extendedDescription?: unknown,
        fee?: unknown,
        pattern?: string,
        totalFee?: unknown,
        totalToPay?: unknown,
        unityFee?: unknown,
        icon?: string
    };

    export type ObjetIBDC = {
        addError: (number: boolean, cvv: boolean) => void;
        init: (vaultId: string, visible?: boolean, profile?: boolean, ccfee?: unknown) => void;
        removeError: (number: boolean, cvv: boolean) => void;
        setStyle: (attr: string, styl3: string, text: string) => void;
        tokenizeCreditCard: () => void;
        getDccDataCreditCard: () => void;
    };

    export type CvvStatusEvent = {
        code: string
    };

    export type TypecardResponseEvent = {
        type: string,
        code: string,
        resultCode: number,
        length: number,
        eventHandler: string,
        enabledCvv?: boolean
    };

    export type CreditCardBinResponseEvent = {
        issueCountry: string,
        issueBank: string,
        cardType: string,
        creditCardType: string,
        creditCardSubtype: string,
        errorCode: string,
        errorDesc: string,
        ccFee?: number
    };
}