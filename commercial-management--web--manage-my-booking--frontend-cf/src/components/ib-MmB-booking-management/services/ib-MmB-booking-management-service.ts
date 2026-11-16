import { MmBAirlinesLogoService } from '@src/components/services/ib-MmB-airlines-logo-service';

@Service(
    'ib-MmB-booking-management-module',
    ['BookingManagementTransformer', 'localStorageService', 'MmBAirlinesLogoService', 'BookingManagementConstants', '$location', 'MmBAppConstants', 'RedirectionService', '$filter', '$cookies'],
    [])

export class BookingManagementService {

    constructor (
        private BookingManagementTransformer: any,
        private localStorageService: any,
        private MmBAirlinesLogoService: MmBAirlinesLogoService,
        private BookingManagementConstants: any,
        private $location: any,
        private MmBAppConstants: any,
        private RedirectionService: RedirectionService,
        private $filter: any,
        private $cookies: any,
        private generateMinAndMaxSearchDate: any,
        private optionSelected: any
    ) {
        /**
     * Create in localstorage the min and max date for change flights
     */
        this.generateMinAndMaxSearchDate = (dataSegments, selectedSegment) => {
            this.BookingManagementTransformer.generateMinAndMaxSearchDate(dataSegments, selectedSegment);
        };

        /**
             * Checks the selected segment option nextStep to make the decision on where it should go for the next step.
             * <ul>
             *  <li>DO_SEAT_MAP -> Should go to checkin app - Seat map step</li>
             *  <li>BOARDING -> Should go to checkin app - Boarding Card step</li>
             *  <li>FLY_NOW_CKI -> Should go to checkin app - Fly Now step</li>
             *  <li>FLY_NOW_MMB -> Should go to MMB app - Change Fly Step</li>
             * </ul>
             * @param {Object} selectedSegmentInfo
             * #param {Array} segments Array with previous and next segment of selectedSegment
             */
        this.optionSelected = (selectedSegmentInfo, passengers) => {
            var checkinStep;
            this.localStorageService.set('selectedSegment', selectedSegmentInfo.segmentInfo);
            this.localStorageService.set('selectedPassengerId', [passengers[0].passengerId]);

            const generateCheckinAppRequest = (nextStep) => {
                const generateCheckinSelectedSegment = (mmbSegmentInfo) => {
                    return [{
                        'id': mmbSegmentInfo.id,
                        'type': mmbSegmentInfo.type,
                        'cabinClass': {
                            'code': mmbSegmentInfo.cabinClass.rbd,
                            'type': mmbSegmentInfo.cabinClass.bookingClass,
                            'description': mmbSegmentInfo.cabinClass.description
                        },
                        'departure': {
                            'terminal': mmbSegmentInfo.departure.terminal,
                            'airport': mmbSegmentInfo.departureCity
                        },
                        'arrival': {
                            'terminal': mmbSegmentInfo.arrival.terminal,
                            'airport': mmbSegmentInfo.arrivalCity
                        },
                        'transformedDepartureDate': mmbSegmentInfo.transformedDepartureDate,
                        'transformedArrivalDate': mmbSegmentInfo.transformedArrivalDate,
                        'segment': mmbSegmentInfo.segment,
                        'status': mmbSegmentInfo.segmentStatus,
                        'transportIcon': '../../content-mmb/iconos/vuelos_pasajeros/ticket-icon-airplane.png'
                    }];
                };

                const OBJECT_GDR_PA_ACCESS = {
                    'nextStep': nextStep,
                    'checkinId': this.localStorageService.get('flowId'),
                    'selectedSegment': generateCheckinSelectedSegment(this.localStorageService.get('selectedSegment')),
                    'selectedPassenger': this.localStorageService.get('selectedPassengerId')
                }

                sessionStorage.setItem(this.MmBAppConstants.COOKIES.BOOKING_INFO, JSON.stringify(OBJECT_GDR_PA_ACCESS));
                this.RedirectionService.externalRedirect(this.$filter('LinksFilter')('CHECKIN_ONLINE_APP') + '?surname=' + this.localStorageService.get('checkinSurname') + '&pnr=' + this.localStorageService.get('PNR'));


            };

            switch (selectedSegmentInfo.selectedOption.nextStep) {
                    case this.BookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_MMB:
                        this.$location.path(this.MmBAppConstants.PAGES_URL.CHANGE_FLIGHT).search({}); break;
                    case this.BookingManagementConstants.SEGMENT_OPTION_STEP.SEAT: checkinStep = this.MmBAppConstants.CHECKIN_NEXT_STEP.SEATS_MAP;
                    case this.BookingManagementConstants.SEGMENT_OPTION_STEP.BOARDING: checkinStep = checkinStep || this.MmBAppConstants.CHECKIN_NEXT_STEP.BOARDING_CARDS;
                    case this.BookingManagementConstants.SEGMENT_OPTION_STEP.FLIGHT_PASSENGER_CKI: checkinStep = checkinStep || this.MmBAppConstants.CHECKIN_NEXT_STEP.FLIGHT_PASSENGER;
                    case this.BookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_CKI:
                        generateCheckinAppRequest(checkinStep || this.MmBAppConstants.CHECKIN_NEXT_STEP.FLY_NOW);
                        break;
            }
        };
    }






    /**
     * Makes the call to the airlines rest services and transform the booking info in the object nedded for the view
     * @returns {Object<Promise>} a promise that when it is resolve returns the page view object transformed. In case of error rejects
     *  with the error object to show in the view.
     */
    getBookingInfo = () => {
        return new Promise((resolve, reject) => {

            const getAirlinesLogosFinish = () => {
                const generateSelectedSegmentInfo = (allSegmentsInfo, selectedSegmentId) => {
                    let sIndex = 0, sFound = false, returnedSegmentInfo;
                    while (!sFound && sIndex < allSegmentsInfo.length) {
                        if (allSegmentsInfo[sIndex].id === selectedSegmentId) {
                            returnedSegmentInfo = allSegmentsInfo[sIndex];
                            sFound = true;
                        }
                        sIndex++;
                    }
                    return returnedSegmentInfo;
                };

                let bookingInformation = this.BookingManagementTransformer.transformBookingManagementView(bookingInfo);
                let checkinSegmentId = this.localStorageService.get('checkinSegmentId'), selectedSegmentInfo;
                if (checkinSegmentId) {
                    this.localStorageService.remove('checkinSegmentId');
                    selectedSegmentInfo = generateSelectedSegmentInfo(bookingInformation.segments, checkinSegmentId);
                    this.generateMinAndMaxSearchDate(bookingInformation.segments, selectedSegmentInfo);
                    this.optionSelected({
                        'segmentInfo': selectedSegmentInfo,
                        'selectedOption': { 'nextStep': this.BookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_MMB }
                    }, bookingInformation.passengers);
                }
                resolve(bookingInformation);
            };

            const getInfoServiceError = (error, reject) => {
                reject(error);
            };

            var bookingInfo = this.localStorageService.get('bookingInfo');
            if (bookingInfo != null) {
                this.MmBAirlinesLogoService.getAirlinesLogos().then(getAirlinesLogosFinish, getAirlinesLogosFinish);
            } else {
                getInfoServiceError({
                    'errorCode': 'BOOKING_INFO_NOT_FOUND',
                    'message': 'REST_SERVICE_ERROR_GENERAL',
                    'needsTranslate': true,
                    'internalErrorCode': 'BOOKING_INFO_NOT_FOUND'
                }, reject);
            }
        });
    };
}
