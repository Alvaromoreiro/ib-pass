import { Method } from 'cypress/types/net-stubbing';

export type RegressionDataLayerInformation = {
    idioma?: string;
    mercado?: string;
    versionWeb?: string;
    modeWeb?: string;
    DynamicPricing?: string;
    SearchCity?: string;
    SearchOrigin?: string;
    SearchDest?: string;
    SearchCountry?: string;
    antelacionCompra?: string;
    fecha?: string;
    trayectoBuscado?: string;
    trayectoPais?: string;
    tipoBusqueda?: string;
    flightRatio?: string;
    proceso?: string;
    paso?: string;
    familianumerosa?: string;
    residentCode?: string;
    origenBusqueda?: string;
    numeroPax?: string;
    SearchOriginName?: string;
    SearchDestName?: string;
    estanciaDestino?: string;
    tipoVuelo?: string;
    resultadosIda?: string;
    resultadosVuelta?: string;
    rutaIda?: string;
    rutaVuelta?: string;
    numeroAdultos?: string;
    quadrigam?: string;
    codigoSeguimiento?: string;
    EstadoUsuario?: string;
    descuentosAplicados?: string;
    precioPax?: string;
    tarifaBarata?: string;
    precioTotalOriginal?: number;
    porcentajeDescuentos?: number;
    totalDescuentos?: number;
    recoveryLink?: string;
    cabinas?: string;
    ffida?: string;
    ffvuelta?: string;
    escalas?: string;
    horarioVuelo?: string;
    trayectoAeropuerto?: string;
    operadoraVuelo?: string;
    Identifier?: string;
    nombreTarifas?: string;
    titularIberiaPlus?: string;
    claseReserva?: string;
    moneda?: string;
    precioTotal?: string;
    precioTotalSinTasas?: string;
    slice1Origin?: string;
    slice1Destination?: string;
    slice1Cabin?: string;
    slice1FareRegistration?: string;
    slice1Stops?: number;
    slice1Date?: string;
    slice1Hour?: string;
    slice1Route?: string;
    slice1Haul?: string;
    slice1FareFamilyName?: string;
    slice2Origin?: string;
    slice2Destination?: string;
    slice2Cabin?: string;
    slice2FareRegistration?: string;
    slice2Stops?: number;
    slice2Date?: string;
    slice2Hour?: string;
    slice2Route?: string;
    slice2Haul?: string;
    slice2FareFamilyName?: string;
    hashEBKI?: string;
    hashEID?: string;
    provider?: string;
    reference?: string;
    ancillariesAction?: string;
    eventCategory?: string;
    eventAction?: string;
    eventLabel?: string;
    totalNumAsientos?: number;
    ancillariesAsientos?: string;
    totalCosteAsientos?: number;
    totalNumEquipajes?: number;
    ancillariesMaletas?: string;
    totalCosteEquipaje?: number;
    tipoSeguro?: string;
    ancillariesSeguros?: string;
    ancillariesFlexibility?: string;
    totalNumEquipajesEspeciales?: number;
    ancillariesEquipajesEspeciales?: string;
    totalCosteEquipajeEspeciales?: number;
    Quantity?: string;
    paxMovilidadReducida?: string;
    elegibleBono?: string;
    OrderId?: string;
    tipoTarjeta?: string;
    cashAviosUsado?: string;
    bonoUsado?: string;
};

export type RegressionDigitalDataInformation = {
    Language?: string;
    Market?: string;
    VersionWeb?: string;
    ModeWeb?: string;
    DynamicPricing?: string;
    SearchCity?: string;
    SearchOrigin?: string;
    SearchDest?: string;
    SearchCountry?: string;
    AdvancePurchase?: string;
    SearchOD?: string;
    SearchCountries?: string;
    SearchType?: string;
    FlightHaul?: string;
    Process?: string;
    Step?: string;
    LargeFamily?: string;
    ResidentCode?: string;
    ProcessStart?: string;
    PaxTotal?: string | number;
    SearchOriginName?: string;
    SearchDestName?: string;
    LengthStay?: string;
    FlightType?: string;
    Slice1Results?: string;
    Slice2Results?: string;
    PaxAdult?: string;
    Quadrigam?: string;
    TrackingCode?: string;
    UserStatus?: string;
    DiscountsApplied?: string;
    PaxPrice?: string;
    CheapestFare?: string;
    precioTotalOriginal?: number;
    RecoveryLink?: string;
    AirportSeg?: string;
    Slice1Flights?: string;
    Slice1Operator?: string;
    Slice2Flights?: string;
    Slice2Operator?: string;
    IbplusHolder?: string;
    BookingClass?: string;
    Currency?: string;
    TotalPrice?: number;
    TotalPriceWithoutTaxes?: number;
    Slice1Cabin?: string;
    Slice1Date?: string;
    Slice1Routing?: string;
    Slice1FareFamily?: string;
    Slice2Cabin?: string;
    Slice2Date?: string;
    Slice2Routing?: string;
    Slice2FareFamily?: string;
    HashEBKI?: string;
    Provider?: string;
    Reference?: string;
    Quantity?: string;
    pmr?: string;
    EligibleVoucher?: string;
    OrderID?: string;
    PaymentMethod?: string;
    CashAviosUsed?: string;
    VoucherUsed?: string;
};

export type ContactData = {
    phone?: string;
    email?: string;
};

export type FillApisDetailsParams = {
    emergencyRequired?: boolean;
    isApisUSA?: boolean;
};

export type IbcoacLandingParams = {
    isApis?: boolean;
    isApisUSA?: boolean;
    isAirShuttleOpen?: boolean;
    isLogged?: boolean;
    modalInfo?: boolean;
    requiredContactData?: boolean;
};

export type CkiancLandingParams = {
    addSeat?: SeatParams;
    addBaggages?: boolean;
};

export type SeatParams = {
    clickOpenSeatMap?: boolean;
    idsSeatSelected: string[];
};

export type VisitQuadrigamParams = {
    quadrigam?: string;
    urlParams?: UrlParams;
    logged?: boolean;
    disabledGA4?: boolean;
    isDeinvoice?: boolean;
};

export type UrlParams = {
    language?: string;
    market?: string;
};

export type InterceptServicesParams = {
    nameFlow: string;
    logged?: boolean;
    payment?: boolean;
};

export type Service = {
    file?: string;
    statics?: boolean;
    request: Method;
    endpoint: string;
};

export type IbcobpLanding = {
    inhibitBC?: InhibitBC;
};
type InhibitBC = {
    status: boolean;
    isHomogeneous: boolean;
    type: TYPE_INHIBIT;
};

type TYPE_INHIBIT = 'SEE_AGENT' | 'AIRCHECK' | 'INHIBIT' | 'SVAN' | 'RESI' | 'UMNR' | 'AVIH' | 'PETC' | 'COUR';

export type FillContactDetails = {
    isLogged?: boolean;
    clickCheckUserForAll?: boolean;
};

export type MockContactData = {
    isRequired: boolean;
    contactData: ContactData[];
};

export type IbCheckinApisParams = {
    isApisUSA?: boolean;
    emergencyRequired?: boolean;
};
