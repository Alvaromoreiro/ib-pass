@Service(
    'ib-MmB-booking-dashboard-module',
    [],
    [])
export class BookingDashboardModel {

    summaryInfo = {};
    bookingGeneralInfo = {};
    summaryModel = {};
    yourFlightsModel = {};
    yourDocumentsModel = {};
    passengersModel = {};
    managementModel= {
        managePassengers: [],
        flights: []
    };
    tabs = {};
    activeTab = '';
    showMenu = false;
    showCustomizeTab = false;
    seatBid = {};
    sisterCitiesModel = {};
    voucherPartialRefund = false;
    pricesInfo = {};
    seatChangeConditions = null;
    showSpinner = false;
    flags = {
        allowedVoluntaryRefundCash: false,
        allowedVoluntaryPartialRefundCash: false
    };
    canceledSeatsFlag = false;

    constructor() {}

    initializeModel = () => {
        this.summaryInfo = {};
        this.bookingGeneralInfo = {};
        this.summaryModel = {};
        this.yourFlightsModel = {};
        this.yourDocumentsModel = {};
        this.passengersModel = {};
        this.managementModel= {
            managePassengers: [],
            flights: []
        };
        this.tabs = {};
        this.activeTab = '';
        this.showMenu = false;
        this.showCustomizeTab = false;
        this.seatBid = {};
        this.sisterCitiesModel = {};
        this.voucherPartialRefund = false;
        this.pricesInfo = {};
        this.seatChangeConditions = null;
        this.showSpinner = false;
        this.flags = {
            allowedVoluntaryRefundCash: false,
            allowedVoluntaryPartialRefundCash: false
        };
        this.canceledSeatsFlag = false;
    }
}

export interface MatchingDocumentModel {
    mandatoryDoc: MandatoryDoc;
    travelDoc: TravelDoc
}

export interface MandatoryDoc {
    type: {
        code: string;
        description: string;
    },
    requiredFields: [];
    requiredFieldsOptions: [];
}

export interface TravelDoc {
    expiry_date: string | {year: string, month: string; day: string;};
    document_number: string;
    country: string
}
