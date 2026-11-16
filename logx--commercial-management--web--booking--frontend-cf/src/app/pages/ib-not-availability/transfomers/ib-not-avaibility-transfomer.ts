@Service('ib-not-avaibility-module', [
    'BookingAppConstants',
    'localStorageService'
], [])
class NotAvaibilityTransformer {
    defer: any;
    constructor (
        private BookingAppConstants: any,
        private localStorageService: angular.local.storage.ILocalStorageService
    ) {}
    generateRequest = () => {
        const letMeKnowRequest = {
            salesforceContactId: '',
            frequentFlier: '',
            email: '',
            name: '',
            surname: '',
            departureAirport: '',
            arrivalAirport: '',
            departure: '',
            arrival: '',
            journey: '',
            departureDate: '',
            returnDate: '',
            nbrAdultSeats: 0,
            nbrChildSeats: 0,
            fare: [''],
            registrationDate: '',
            language: ''
        };
        const customerData:any = this.localStorageService.get('customerData');
        const searchRequest:any = this.localStorageService.get('originDestination');
        const fareType = [];
        fareType.push(this.localStorageService.get('bookingUrlParams'));
        letMeKnowRequest.name = customerData.personalInfo.name;
        letMeKnowRequest.surname = customerData.personalInfo.surname1;
        letMeKnowRequest.email = customerData.personalInfo.contactEmail;
        letMeKnowRequest.frequentFlier = customerData.personalInfo.ibPlusNumber.replace(/^(0+)/g, '');
        letMeKnowRequest.arrivalAirport = searchRequest.destinationCity.code;
        letMeKnowRequest.departureAirport = searchRequest.originCity.code;
        letMeKnowRequest.departure = searchRequest.originCity.description;
        letMeKnowRequest.arrival = searchRequest.destinationCity.description;
        letMeKnowRequest.language = this.BookingAppConstants.lang;
        letMeKnowRequest.nbrAdultSeats = searchRequest.numAdults;
        letMeKnowRequest.nbrChildSeats = searchRequest.numChilds;
        letMeKnowRequest.registrationDate = new Date().toJSON();
        if (searchRequest.dates.returnFlight) {
            letMeKnowRequest.journey = 'RT';
            letMeKnowRequest.departureDate = searchRequest.dates.outboundFlight;
            letMeKnowRequest.returnDate = searchRequest.dates.returnFlight;
        } else {
            letMeKnowRequest.journey = 'OW';
            letMeKnowRequest.departureDate = searchRequest.dates.outboundFlight;
            letMeKnowRequest.returnDate = searchRequest.dates.outboundFlight;
        }
        if(fareType[0].preferredCabin === 'R') {
            letMeKnowRequest.fare = ['TC'];
        }else if(fareType[0].preferredCabin === 'N') {
            letMeKnowRequest.fare = ['TP'];
        } else {
            letMeKnowRequest.fare = ['BU'];
        }
        return letMeKnowRequest;
    };
}