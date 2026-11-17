import { Injectable } from '@angular/core';

import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { ancillariesInfo } from 'ib-web-ancillaries/app/core/models/ancillaries-info';
import { IAcceptData, IAcceptPassenger } from '@src/app/core/models/storage/cki-accept-info-model';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { CheckinAncillariesConstants } from '@src/app/core/constants/ib-ancillaries-constants';
import { IbCheckinRedirectionUtilsService } from '@src/app/shared/services/ib-utils/ib-checkin-redirection-utils.service';
import { IbCheckinSeatSummaryDigitalDataService } from './ib-checkin-seat-summary-digital-data.service';

@Injectable({ providedIn: 'root' })
export class IbCheckinSeatSummaryService {
    private bookingInfo: CkiBookingInfo.BookingInfo;
    private acceptInfo: IAcceptData;

    constructor (
        private sessionStorageService: CommonsSessionStorageService,
        private IbCheckinRedirectionUtilsService: IbCheckinRedirectionUtilsService,
        private IbCheckinSeatSummaryDigitalDataService: IbCheckinSeatSummaryDigitalDataService,
        private IbUtilsService: IbUtilsService
    ) {
        this.bookingInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
        this.acceptInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO);
    }

    getSegmentsInformation (): CkiSeatSummary.ISegment[] {
        this.bookingInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
        this.acceptInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO);

        const { outwardSegments, returnSegments } = this.bookingInfo;

        const acceptedSegmentsIds = this.acceptInfo.acceptedSegments.map(seg => seg.id);
        const acceptedSegments = [...outwardSegments, ...returnSegments].filter(seg => acceptedSegmentsIds.includes(seg.id));

        return this.getSegmentsMap(acceptedSegments);
    }

    private getSegmentsMap (segmentsInfo: CkiBookingInfo.Segment[]): CkiSeatSummary.ISegment[] {
        const { passengers: bookingPassengers } = this.bookingInfo;

        return segmentsInfo.map(seg => {
            const { id, arrival, departure, operatingFlightNumber, cabinClass, passengers } = seg;
            const acceptSegment = this.acceptInfo.acceptedSegments.find(seg => seg.id === id);

            return {
                id,
                arrival: {
                    airport: arrival.airport,
                    date: arrival.date.split(' ')[0],
                    hour: arrival.date.split(' ')[1],
                    terminal: arrival.terminal
                },
                departure: {
                    airport: departure.airport,
                    date: departure.date.split(' ')[0],
                    hour: departure.date.split(' ')[1],
                    terminal: departure.terminal
                },
                operatingFlightNumber: {
                    ...operatingFlightNumber,
                    brand: this.IbUtilsService.getAirlineLogos(operatingFlightNumber.company.code)
                },
                cabinClass: {
                    description: cabinClass.description
                },
                changeSeatAvailable: this.getAncillariesSeatState(operatingFlightNumber.company.code),
                passengers: this.getPassengerInformation(passengers, bookingPassengers, acceptSegment.passengers)
            };
        });
    }

    private getPassengerInformation (segmentPassengers: CkiBookingInfo.PassengerDetails[], passengersInfo: CkiBookingInfo.Passenger[], acceptInfo: IAcceptPassenger[]): CkiSeatSummary.IPassenger[] {
        const passengersId = segmentPassengers.map(pass => pass.id);
        const passengerAccept = acceptInfo.map(pass => pass.id);

        return passengersInfo
            .filter(pass => passengersId.includes(pass.id) && passengerAccept.includes(pass.id))
            .map(pass => {
                const { id, gender, name, surname, type } = pass;
                const passengerAccept = acceptInfo.find(pass => pass.id === id);

                return {
                    id,
                    gender,
                    name: name.toLowerCase(),
                    surname: surname.toLowerCase(),
                    type,
                    seat: passengerAccept?.seat
                };
            });
    }

    private checkCompany (company: string): boolean {
        const validCompanies = [
            CheckinAppConstants.COMPANIES.IB,
            CheckinAppConstants.COMPANIES.I2,
            CheckinAppConstants.COMPANIES.YW
        ];

        return validCompanies.includes(company);
    }

    private getAncillariesSeatState (flightCode: string): boolean {
        if (!this.checkCompany(flightCode)) return false;

        const ancillariesInfo: ancillariesInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ANCILLARIES_INFO);

        if (!ancillariesInfo) return false;

        const seatInfo = ancillariesInfo.ancillaries?.find(anc => anc.type === CheckinAncillariesConstants.TYPE_ANCILLARIE.SEAT);

        if (!seatInfo) return false;

        return seatInfo.status?.code === CheckinAncillariesConstants.GENERAL_STATUS.AVAILABLE ? true : false;
    }

    checkRedirectionPage (originalRedirection: 'ibecbp' | 'ckianc') {
        if (this.isSeatSummaryKOCase()) {
            this.sendSeatSummaryEventToMonetate(false);
            return this.IbCheckinRedirectionUtilsService.path(`/${originalRedirection}`);
        }

        this.sendSeatSummaryEventToMonetate(true);
        this.IbCheckinRedirectionUtilsService.path('/ckiacpt');
    }

    private isSeatSummaryKOCase () {
        const acceptData: IAcceptData = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO);
        const bookingInfo: CkiBookingInfo.BookingInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);

        const isEarly = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.IS_EARLY);
        const isPA = bookingInfo.airShuttleSegments && bookingInfo.airShuttleSegments.length > 0;
        const isCC = bookingInfo.carrierConnectEnabled || false;

        return isEarly || this.isUpgradingCase(acceptData) || this.isSACase(bookingInfo) || isPA || isCC || this.isStandByCase(acceptData);
    }

    private isUpgradingCase (acceptData: IAcceptData) {
        return !!acceptData.upgrading;
    }

    private isSACase (bookingInfo: CkiBookingInfo.BookingInfo) {
        const { outwardSegments, returnSegments } = bookingInfo;
        const segments = [...outwardSegments, ...returnSegments];

        return segments.some(seg =>
            seg.passengers.some(pass => pass.farebasis && pass.farebasis.includes('ID'))
        );
    }

    private isStandByCase (acceptData: IAcceptData) {
        return acceptData.acceptedSegments.some((seg) =>
            seg.passengers.some((pas) => pas.status === CheckinAppConstants.FLIGHT_PASSENGERS_STATUS.STANDBY)
        );
    }

    sendSeatSummaryEventToMonetate (state: boolean) {
        const sendState = state ? 'OK' : 'KO';
        const finalState = `Audiencia ${sendState}`;

        this.IbCheckinSeatSummaryDigitalDataService.handleEventsSeatSummary(finalState);
    }
}
downgradeToAJSService('IbCheckinSeatSummaryService', IbCheckinSeatSummaryService, 'ib-checkin-seat-summary-module');