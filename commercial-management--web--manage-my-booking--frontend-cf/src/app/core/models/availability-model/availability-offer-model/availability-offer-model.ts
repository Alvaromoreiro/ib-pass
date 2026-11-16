namespace ImportOrderData {
    export interface offer {
        offerId:string,
        offerItem:offerItem[],
        originDestination: AvailabilityData.originDestination[],
        timeLimits:string,
        paymentTimeLimit:unknown,
        specialDiscountsApplied:unknown[],
        providerOfferId:string,
        privateFare:boolean,
        offerType:string,
        flightModificationOnDemand:boolean,
        discountsApplied:unknown,
        excludePenalties:boolean,
        price:Price
    }

    export interface offerItem {
        offerItemId:string,
        price:Price,
        passengerIds:string[],
        privateFareInformation:unknown
    }
}