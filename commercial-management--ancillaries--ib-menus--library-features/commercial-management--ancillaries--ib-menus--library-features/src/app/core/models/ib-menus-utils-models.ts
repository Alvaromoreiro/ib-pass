namespace MenusUtilServicesTypes {
    export type HeaderModel = {
        headerModel: {
            shoppingBasket:{
                baggages?:{
                    hasBaggage:boolean,
                    segments:BaggagesModel[],
                    total:{
                        total:number
                    }
                },
                bundle?: {
                    hasBundle:boolean,
                    info: any,
                    total: {
                        total:number
                    }
                }
                seats?:{
                    hasSeats:boolean,
                    segments:AncillarieGenericModel[],
                    total:{
                        total:number
                    }
                },
                insurance?:{
                    hasInsurance:boolean,
                    info:{
                        type:string;
                    },
                    total:{
                        total:number
                    }
                },
                speqs?:{
                    hasSpeqs:boolean,
                    segments:SpeqsModel[],
                    total:{
                        total:number
                    }
                },
                flexibilization:{
                    hasFlexibilization:boolean,
                    info:{
                        amount:{
                            price:number
                        }
                    }
                },
                globickTransfers?: {
                    hasTransfersGlobick: boolean,
                    info: {
                        date: string,
                        dateReturn?: string,
                        transferCar: string,
                        price: number,
                        priceFormatted: number
                    }
                },
                globickActivities?: {
                    hasActivitiesGlobick: boolean,
                    info: {
                        date: string,
                        description: string,
                        price: number,
                        priceFormatted: number
                    }
                },
                insuranceAllianzFusionInfo?: {
                    hasInsuranceAllianzFusion: boolean,
                    info: {
                        description: string,
                        price: number,
                        priceFormatted: number
                    }
                },
                carbonFootprint?: {
                    hasCarbonFootprint: boolean,
                    info: {
                        price: number,
                        priceFormatted: string,
                        kilosCo2Equivalent: number,
                        kilosCo2EquivalentFormatted: string
                    }
                }
            }
        }
    };
    export type BaggagesModel = {
        baggages: AncillarieGenericModel[]
    };
    export type SpeqsModel = {
        speqs: AncillarieGenericModel[]
    };
    export type AncillarieGenericModel = {
        quanty:number;
    };

}