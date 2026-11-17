export const OTHER_APP_STORAGE_PATTERN: RegExp = /(?!(ib-check-in-app).*)^(ib-[\w\-]+-app\.[\w\-]+)/i;

export enum PassengerStorageKey {
    additionalInfoPa = 'additionalInfoPa',
    passengersContactData = 'passengersContactData',
    passengersNOAPIS = 'passengersNOAPIS',
    passengersApisDocs = 'passengersApisDocs',
    birthDate = 'birthDate',
    counterDocs = 'counterDocs',
    gdprInfo = 'gdprInfo',
    isCheckedAllPassengers = 'isCheckedAllPassengers',
    passengersSelected = 'passengersSelected'
}

export enum UserStorageKey {
    NivelUsuario = 'NivelUsuario',
    userID = 'userID',
    userLoggedBookingInfo = 'userLoggedBookingInfo',
    customerData = 'customerData',
    userLogged = 'userLogged'
}

export enum BookingStorageKey {
    selectedSegments = 'selectedSegments',
    segmentsSelected = 'segmentsSelected',
    segmentsInfo = 'segmentsInfo',
    bookingInfo = 'bookingInfo',
    tripsChanged = 'tripsChanged',
    flightConfirmationNeedsCheckin = 'flightConfirmationNeedsCheckin',
    confirmationInfo = 'confirmationInfo'
}

export enum AncillariesStorageKey {
    ancillariesInfo = 'ancillariesInfo',
    ancillariesSeatInfo = 'ancillariesSeatInfo',
    ancillariesTransformedInfo = 'ancillariesTransformedInfo',
    ancillariesAvailableSegments = 'ancillariesAvailableSegments',
    ancillariesSlices = 'ancillariesSlices',
    summaryAncillaries = 'summaryAncillaries',
    acceptInfoSegments = 'acceptInfoSegments',
    segmentsBaggageSelected = 'segmentsBaggageSelected',
    hasSelectedBaggage = 'hasSelectedBaggage',
    selectInsurance = 'selectInsurance',
    selectedInsurance = 'selectedInsurance',
    insuranceSelected = 'insuranceSelected',
    hasSelectedInsurance = 'hasSelectedInsurance',
    selectedPriorityBoarding = 'selectedPriorityBoarding',
    totalPricePriorityBoarding = 'totalPricePriorityBoarding',
    headerModel = 'headerModel',
    headerInfo = 'headerInfo',
    breakDownInfo = 'breakDownInfo',
    passengerBaggagesTrips = 'passengerBaggagesTrips',
    passengerSpeqsTrips = 'passengerSpeqsTrips',
    seatMapSegment = 'seatMapSegment',
    seatInfoConfirmation = 'seatInfoConfirmation',
    oldSeatsConfig = 'oldSeatsConfig',
    longHaulAircrafts = 'longHaulAircrafts',
    seatMapTourAircrafts = 'seatMapTourAircrafts',
    currentSeatmapData = 'currentSeatmapData',
    aircraftSeatMapVR = 'aircraftSeatMapVR',
    globick_transfercki = 'globick_transfercki',
    globick_activitiescki = 'globick_activitiescki',
    bobInfo = 'bobInfo',
    bobOrder = 'bobOrder',
    bobFormModel = 'bobFormModel',
    frequentFlyerBOB = 'frequentFlyerBOB',
    showBasket = 'showBasket',
    lastFieldBob = 'lastFieldBob',
    specialUserBob = 'specialUserBob',
    upgradinfInfoAccepted = 'upgradinfInfoAccepted',
    upgradeInfo = 'upgradeInfo',
    summaryTripForUpg = 'summaryTripForUpg',
    upgSlices = 'upgSlices',
    addToCart = 'addToCart'
}

export enum PaymentStorageKey {
    currency = 'currency',
    pendingPayments = 'pendingPayments',
    modelPaymentData = 'modelPaymentData',
    issueOrderInfo = 'issueOrderInfo',
    paymentMethodsWithoutDiscount = 'paymentMethodsWithoutDiscount',
    fullIssuedPaiment = 'fullIssuedPaiment',
    typeCardSelected = 'typeCardSelected',
    selectedLoggedCard = 'selectedLoggedCard',
    redirectionPaymentCallback = 'redirectionPaymentCallback',
    totalPriceFormatted = 'totalPriceFormatted',
    posOfferPriceFormatted = 'posOfferPriceFormatted',
    showPriceCombinated = 'showPriceCombinated'
}

export enum CheckinFlowStorageKey {
    flowPages = 'flowPages',
    flowId = 'flowId',
    isPaFlow = 'isPaFlow',
    isFlowDuplicated = 'isFlowDuplicated',
    isEarly = 'isEarly',
    addEarlyChecking = 'addEarlyChecking',
    earlyCheckinCode = 'earlyCheckinCode',
    isFirstEarlyMap = 'isFirstEarlyMap',
    nextStepAllowed = 'nextStepAllowed',
    noShowMessageBockBack = 'noShowMessageBockBack',
    printBoardingCards = 'printBoardingCards',
    alreadyLoaded = 'alreadyLoaded',
    disruptionContactApis = 'disruptionContactApis',
    usTracing = 'usTracing',
    widgetProMonetate = 'widgetProMonetate',
    pnr = 'PNR'
}

export enum BiometricStorageKey {
    biometricBoardingAssociation = 'biometricBoardingAssociation',
    biometricBoardingAssociationSuccess = 'biometricBoardingAssociationSuccess',
    showBiometric = 'showBiometric',
    biometricUserNotInterested = 'biometricUserNotInterested',
    biometricSomeComplete = 'biometricSomeComplete'
}

export enum BoardingPassStorageKey {
    inhibitBoardingCard = 'inhibitBoardingCard',
    inhibitionBC = 'inhibitionBC'
}

export enum GenericStorageKey {
    buildNumber = 'buildNumber'
}

export const CHECKIN_STORAGE_KEYS_TO_REMOVE: readonly string[] = [
    ...Object.values(PassengerStorageKey),
    ...Object.values(UserStorageKey),
    ...Object.values(BookingStorageKey),
    ...Object.values(AncillariesStorageKey),
    ...Object.values(PaymentStorageKey),
    ...Object.values(CheckinFlowStorageKey),
    ...Object.values(BiometricStorageKey),
    ...Object.values(BoardingPassStorageKey)
];
