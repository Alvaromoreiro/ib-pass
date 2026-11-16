namespace MenusModel {
    export type LoginData = {
        onLogin: (...args: any[]) => any,
        afterLogin: (...args: any[]) => any,
        onError: (...args: any[]) => any,
    };
    export type Document = {
        type: string
    };
    export type FrequentFlyer = {
        airline: number,
        number: string,
        airlineName: string;
    };
    export type Beneficiary = {
        beneficiaryNumber: string,
        title: string,
        name: string
        surname1: string
        surname2: string,
        birthDate: string
        document: Document
        documentNumber: string,
        frequentFlyer: FrequentFlyer
    };
    export type LoggedData = {
        name: string,
        surname: string,
        avios: string,
    };
    export type BasketTotal = {
        total: number,
        totalFormatted: string
        original?: number
    };
    export type BasketBaggageModel = {
        segments: [],
        hasBaggages: boolean,
        total: BasketTotal
    };
    export type BasketBundleModel = {
        info: [],
        hasBundle: boolean,
        total: BasketTotal
    };
    export type BasketSeatModel = {
        segments: [],
        hasSeats: boolean,
        total: BasketTotal
    };
    export type BasketOtherModel = {
        others: [],
        hasElements: boolean,
        total: BasketTotal
    };
    export type BasketDiscountModel = {
        others: [],
        hasElements: boolean,
        total: BasketTotal
    };
    export type BasketInsuranceModel = {
        info: [],
        hasInsurance: boolean,
        total: BasketTotal
    };
    export type BasketFlexibilizationModel = {
        info: [],
        hasFlexibilization: boolean,
        total: BasketTotal
    };
    export type BasketUpgradingModel = {
        segments: [],
        hasUpgrading: boolean,
        total: BasketTotal
    };
    export type BasketSpeqsModel = {
        segments: [],
        hasSpeqs: boolean,
        total: BasketTotal
    };
    export type BasketPriorityBoardingModel = {
        hasPriorityBoarding: boolean,
        total: BasketTotal
    };
    export type BasketCarbonFootprintModel = {
        info: [],
        hasCarbonFootprint: boolean,
        total: BasketTotal,
    };
    export type BasketGlobickTransfersModel = {
        info: [],
        hasTransfersGlobick: boolean,
        total: BasketTotal,
    };
    export type BasketGlobickActivitiesModel = {
        info: [],
        hasActivitiesGlobick: boolean,
        total: BasketTotal,
    };
    export type ShoppingBasketInsuranceAllianzFusion = {
        info: [],
        hasInsuranceAllianzFusion: boolean;
        total?: BasketTotal;
    };
    export type ShoppingBasket = {
        baggages: BasketBaggageModel
        bundle: BasketBundleModel
        seats: BasketSeatModel
        insurance: BasketInsuranceModel
        flexibilization: BasketFlexibilizationModel
        upgrading: BasketUpgradingModel
        speqs: BasketSpeqsModel
        priorityBoarding: BasketPriorityBoardingModel
        carbonFootprint: BasketCarbonFootprintModel
        globickTransfers: BasketGlobickTransfersModel
        globickActivities: BasketGlobickActivitiesModel
        insuranceAllianzFusionInfo: ShoppingBasketInsuranceAllianzFusion;
        discountsModel: BasketDiscountModel
        othersModel: BasketOtherModel,
        currency: any,
        total: BasketTotal
    };
    export type HeaderStep = {
        index: number,
        position: string,
        text: string
    };
    export type FooterPhoneInfo = {
        prefix: string,
        phoneNumber: string
    };
    export type TripOption = {
        description: string,
        code: number
    };
    export type CitiesModel = {
        listGroups: string [],
        listCities: CityModel[],
    };
    export type AreasModel = {
        cities: CitiesModel,
        origin: CityModel,
        destiny: CityModel
    };
    export type CabinModel = {
        code: string,
        description: string,
        cabinClass: string
    };
    export type CityModel = {
        code: string,
        description: string,
        country: string,
        countryLong: string,
        group: string,
        selected: boolean
    };
    export type PassengerModel = {
        passengerType: string,
        minPassenger: number,
        maxPassengers: number,
        infoAge: string,
        count: number,
        isActive: boolean,
        isHidden: boolean,
        showMessage: boolean
    };
    export type AdvancedSearchModel = {
        payWithAvios: boolean,
        payWithPoints: boolean,
        resetToggleCounter: boolean,
        specialTypeAvailableLastSearch: boolean,
        specialPassengerTypeHasError: boolean,
        aviosChecked: boolean,
        showDatepicker: boolean,
        tripOptions: TripOption[],
        tripOptionSelected: TripOption,
        cityOrigin: CityModel,
        cityDestiny: CityModel,
        cities: CitiesModel,
        passengersSelected: PassengerModel[],
        passengersConditions: IbUiPassengerSelectorComponent['passengersConditions'],
        selectedOutbondDate: Date,
        selectedReturnDate: Date,
        flexDates: boolean,
        passengers: RedBarModel.PassengerInfo,
        discountResident: LocalDiscountConfig['items'][0],
        discountFamily:  LocalDiscountConfig['items'][0],
        desFamilyConfig: LocalDiscountConfig,
        desResiConfig: LocalDiscountConfig,
        typeCabins: CabinModel[],
        cabinSelected: CabinModel,
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //          HEADER
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    export type MenuModel = {
        redBarModel: RedBarModel,
        greyBarModel: GreyBarModel,
        stepBarModel: StepsModel
    };
    export type RedBarModel = {
        isVisible: boolean,
        showChildren: {
            iberiIcon: boolean,
            travelInfo: boolean,
            passengers: boolean,
            advandedSearch: boolean,
            shoppingBasket: boolean,
            iberiaLogo: boolean,
            oneWorldLogo:boolean
        },
        flightType: string, //enumerado, tenemos la lista de tipos de vuelos admitidos en la cabecera??
        redemption: boolean,
        passengers: RedBarModel.PassengerInfo,
        trips: RedBarModel.originDestinationResponse [],
        shoppingBasket: ShoppingBasket,
        showModalBackHome: boolean
    };

    export type GreyBarModel = {
        isVisible: boolean,
        showChildren: {
            loginApp: boolean,
            changeLanguage: boolean,
            LoginHome: boolean
        },
        login: LoginData,
        loggedData: LoggedData,
        userLogged: boolean,
        isONB: boolean,
        isLogged: boolean,
    };

    export type StepsModel = {
        isVisible: boolean,
        steps: HeaderStep[],
        position: string,
        totalSteps: number
    };
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    //          FOOTER
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    export type FooterModel = {
        isVisible: boolean,
        showChildren: {
            accessibilityLink: boolean,
            protectionPolicy: boolean,
            phoneInfo: boolean
        },
        year: string,
        isBV: boolean,
        isFullWidth: boolean,
        isFixed: boolean,
        phoneInfo: FooterPhoneInfo
    };

    export type footerIconsRequestModel = {
        market: string,
        applicationId: number
    };
/////////////////////////////////////////////////////////////////////////////////////////////////////
}