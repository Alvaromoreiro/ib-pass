@Service('ib-not-avaibility-module', [], [])
class NotAvaibilityModel {
    letMeKnowRequest: any;
    constructor () {}

    initializeModel = () => {
        this.letMeKnowRequest = {
            SaleForceContactId: '0038E00000nfClHQAU',
            FrequentFlier: '12345678',
            Email: 'raul.perez@gmail.com',
            Name: 'RAUL',
            Surname: 'PEREZ LOPEZ',
            DepartureAirport: 'MAD',
            ArrivalAirport: 'LGW',
            Origin: 'Madrid(MAD)',
            Destination: 'Londres(LON)',
            TripType: 'RT',
            OutboundDate: '20-02-2020',
            InboundDate: '15-03-2020',
            AdultsPassengers: '2',
            ChildPassengers: '0',
            RdmClasses: 'Todas',
            Timestamp: '2020-02-10.12:30:21.123456',
            Languages: 'ES'
        };
    };
}