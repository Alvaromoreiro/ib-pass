import * as angular from 'angular';
import { Injectable } from '@angular/core';
import { downgradeToAJSService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { SegmentInfo, SegmentInfoSource, SegmentAirportInfo } from '../../../core/models/ib-utils.model';

export interface SelectedSegmentsType {
    isAllowed: boolean;
    newSegmentsId: any[];
    checkablePassengers: any[];
}

interface SelectedSegmentDates {
    departureDateTime: string;
    arrivalDateTime: string;
}

interface AcceptedPassengerInfo {
    id: any;
    seat: any;
    status: string;
}

interface AcceptedSegmentInfo {
    id: any;
    cabinClass?: any;
    passengers: AcceptedPassengerInfo[];
}

type AdditionalInfoField = 'gender' | 'disruptionContact' | 'frequentFlyer';

interface FilterableDisruptionContact {
    language?: string;
    email?: string;
    phone?: {
        countryCode?: string | { code: string; description: string };
        number?: string;
    };
}

interface FilterablePassengerAdditionalInfo {
    id: string | number;
    gender?: string | null;
    disruptionContact?: FilterableDisruptionContact | null;
    frequentFlyer?: {
        iataCompanyCode?: string;
        number?: string | null;
    } | null;
}

interface PassengerInfoOption {
    field: AdditionalInfoField;
    isRequired: boolean;
    isOptional: boolean;
}

interface PassengerOptions {
    isSomethingRequired: boolean;
    options: Record<string, PassengerInfoOption>;
}

interface FilterAdditionalInfoResult {
    additionalInfo: FilterablePassengerAdditionalInfo[];
    needsUpdate: boolean;
}

interface PassengerInfoProcessingResult {
    additionalInfo?: FilterablePassengerAdditionalInfo;
    needsUpdate: boolean;
}

const ADDITIONAL_INFO_OPTIONS: Array<{ id: string; field: AdditionalInfoField }> = [
    { id: 'GENDER', field: 'gender' },
    { id: 'CONTACT_DATA', field: 'disruptionContact' },
    { id: 'FREQUENT_FLYER', field: 'frequentFlyer' }
];

@Injectable({
    providedIn: 'root'
})
export class IbPassengerBookingUtilsService {
    constructor (private commonsSessionStorageService: CommonsSessionStorageService) { }

    updateCachedInfo (acceptedSegments: AcceptedSegmentInfo[] | null = []): any[] {
        const bookingInfo = this.commonsSessionStorageService.get<CkiBookingInfo.BookingInfo>('bookingInfo');
        const uncheckableSegments: any[] = [];

        (acceptedSegments || []).forEach((acceptedSegment) => {
            const cachedSegment = this.findCachedSegment(bookingInfo, acceptedSegment.id);
            if (cachedSegment) {
                this.updateCachedSegment(cachedSegment, acceptedSegment, uncheckableSegments);
            }
        });

        this.commonsSessionStorageService.set('bookingInfo', bookingInfo);

        return uncheckableSegments;
    }

    setAircraftDatalayer (): any {
        const bookingInfo = this.commonsSessionStorageService.get<CkiBookingInfo.BookingInfo>('bookingInfo');
        let aircraft;

        bookingInfo.outwardSegments?.forEach((segment) => {
            aircraft = segment.aircraft;
        });

        return aircraft;
    }

    updateSelectedSegments (): SelectedSegmentsType {
        const selectedSegment = this.commonsSessionStorageService.get<SelectedSegmentDates>('newSelectedSegment');
        const bookingInfo = this.commonsSessionStorageService.get<CkiBookingInfo.BookingInfo>('bookingInfo');
        const selectedSegments = bookingInfo.airShuttleSegments.filter(
            (segment) => this.isSelectedSegment(segment, selectedSegment)
        );
        const newSelectedIds = selectedSegments.map((segment) => segment.id);
        const checkablePassengers = selectedSegments.reduce(
            (passengerIds, segment) => passengerIds.concat(this.getCheckablePassengerIds(segment)),
            []
        );
        const isAllowed = checkablePassengers.length > 0;

        this.commonsSessionStorageService.set('passengersSelected', checkablePassengers);

        return { isAllowed, newSegmentsId: newSelectedIds, checkablePassengers };
    }

    updateLanguageAdditionalInfo<T> (additionalInfo: T): T {
        if (Array.isArray(additionalInfo)) {
            const confirmationDigitalInfo = this.commonsSessionStorageService.get<any>('confirmationDigitalInfo');
            additionalInfo.forEach((element) => {
                if (element.disruptionContact?.language) {
                    element.disruptionContact.language = confirmationDigitalInfo.Language;
                }
            });
        }

        return additionalInfo;
    }

    filterAdditionalInfo (
        bookingInfo: CkiBookingInfo.BookingInfo,
        additionalInfoData?: FilterablePassengerAdditionalInfo[] | null
    ): FilterAdditionalInfoResult {
        const addInfoFiltered: FilterablePassengerAdditionalInfo[] = [];
        const selectedPassengers = (this.commonsSessionStorageService.get('passengersSelected') || []) as Array<string | number>;
        let needsUpdate = false;
        const additionalInfo = additionalInfoData || [];

        for (const passenger of bookingInfo.passengers) {
            const result = this.processPassengerInfo(
                passenger,
                additionalInfo,
                selectedPassengers,
                !needsUpdate
            );
            if (result.additionalInfo) {
                addInfoFiltered.push(result.additionalInfo);
            }
            needsUpdate = needsUpdate || result.needsUpdate;
        }

        return {
            additionalInfo: addInfoFiltered,
            needsUpdate
        };
    }

    private processPassengerInfo (
        passenger: CkiBookingInfo.Passenger,
        additionalInfo: FilterablePassengerAdditionalInfo[],
        selectedPassengers: Array<string | number>,
        shouldCheckForUpdates: boolean
    ): PassengerInfoProcessingResult {
        const optionStatus = this.checkPassengerOptions(passenger);
        const passengerAdditionalInfo = additionalInfo.find((info) => passenger.id === info.id);

        if (!passengerAdditionalInfo) {
            return {
                needsUpdate: this.isSelectedPassengerMissingRequiredInfo(passenger, selectedPassengers, optionStatus)
            };
        }

        const needsUpdate = shouldCheckForUpdates && this.updatePassengerInfo(passengerAdditionalInfo, optionStatus.options);
        const filteredInfo = this.hasAdditionalInformation(passengerAdditionalInfo)
            ? angular.copy(passengerAdditionalInfo)
            : undefined;

        return {
            additionalInfo: filteredInfo,
            needsUpdate
        };
    }

    private checkPassengerOptions (passenger: CkiBookingInfo.Passenger): PassengerOptions {
        const passengerOptions: PassengerOptions = { isSomethingRequired: false, options: {} };

        for (const option of ADDITIONAL_INFO_OPTIONS) {
            const isRequired = passenger.requiredInformation.indexOf(option.id) !== -1;
            passengerOptions.options[option.id] = {
                field: option.field,
                isRequired,
                isOptional: passenger.optionalInformation.indexOf(option.id) !== -1
            };
            passengerOptions.isSomethingRequired = passengerOptions.isSomethingRequired || isRequired;
        }

        return passengerOptions;
    }

    private updatePassengerInfo (
        passenger: FilterablePassengerAdditionalInfo,
        optionsChecked: Record<string, PassengerInfoOption>
    ): boolean {
        let requiresUpdate = false;

        for (const option of Object.values(optionsChecked)) {
            if (this.isDisallowedPassengerInfoPresent(passenger, option)) {
                delete passenger[option.field];
            }
            if (this.isRequiredPassengerInfoMissing(passenger, option)) {
                requiresUpdate = true;
            }
        }

        return requiresUpdate;
    }

    private hasAdditionalInformation (passenger: FilterablePassengerAdditionalInfo): boolean {
        if (passenger.gender) {
            return true;
        }
        if (passenger.disruptionContact) {
            return true;
        }
        return !!passenger.frequentFlyer;
    }

    private isSelectedPassengerMissingRequiredInfo (
        passenger: CkiBookingInfo.Passenger,
        selectedPassengers: Array<string | number>,
        optionStatus: PassengerOptions
    ): boolean {
        if (selectedPassengers.indexOf(passenger.id) === -1) {
            return false;
        }
        return optionStatus.isSomethingRequired;
    }

    private isDisallowedPassengerInfoPresent (passenger: FilterablePassengerAdditionalInfo, option: PassengerInfoOption): boolean {
        if (option.isRequired) {
            return false;
        }
        if (option.isOptional) {
            return false;
        }
        return !!passenger[option.field];
    }

    private isRequiredPassengerInfoMissing (passenger: FilterablePassengerAdditionalInfo, option: PassengerInfoOption): boolean {
        if (!option.isRequired) {
            return false;
        }
        return !passenger[option.field];
    }

    getSegmentsInfo (): SegmentInfo[] {
        const bookingInfo = this.commonsSessionStorageService.get('bookingInfo') as CkiBookingInfo.BookingInfo | null;

        if (!bookingInfo) {
            return [];
        }

        const segments = this.getBookingSegments(bookingInfo);
        const segmentsInfo = segments.map((segment) => this.createSegmentInfo(segment));

        this.commonsSessionStorageService.set('segmentsInfo', segmentsInfo);

        return segmentsInfo;
    }

    private isValidPassengerStatus (status: string): boolean {
        return status === 'CHECKED' || status === 'CHECKABLE' || status === 'REISSUE'
            || status === 'STANDBY' || status === 'PENDING_AQQ' || status === 'PENDING_EVUS';
    }

    private isSelectedSegment (segment: CkiBookingInfo.Segment, selectedSegment: SelectedSegmentDates): boolean {
        return selectedSegment.departureDateTime === segment.departure.date
            && selectedSegment.arrivalDateTime === segment.arrival.date;
    }

    private getCheckablePassengerIds (segment: CkiBookingInfo.Segment): any[] {
        return segment.passengers
            .filter((passenger) => this.isValidPassengerStatus(passenger.status.code))
            .map((passenger) => passenger.id);
    }

    private findCachedSegment (bookingInfo: CkiBookingInfo.BookingInfo, segmentId: any): any {
        return [
            ...bookingInfo.outwardSegments,
            ...bookingInfo.returnSegments,
            ...bookingInfo.airShuttleSegments
        ].find((segment) => segment.id === segmentId);
    }

    private updateCachedSegment (
        cachedSegment: any,
        acceptedSegment: AcceptedSegmentInfo,
        uncheckableSegments: any[]
    ): void {
        cachedSegment.cabinClass = acceptedSegment.cabinClass || cachedSegment.cabinClass;

        acceptedSegment.passengers.forEach((acceptedPassenger) => {
            this.updateCachedPassenger(cachedSegment, acceptedSegment, acceptedPassenger, uncheckableSegments);
        });
    }

    private updateCachedPassenger (
        cachedSegment: any,
        acceptedSegment: AcceptedSegmentInfo,
        acceptedPassenger: AcceptedPassengerInfo,
        uncheckableSegments: any[]
    ): void {
        const cachedPassenger = cachedSegment.passengers.find((passenger) => passenger.id === acceptedPassenger.id);
        if (!cachedPassenger) {
            return;
        }

        cachedPassenger.seat = acceptedPassenger.seat;
        cachedPassenger.status.code = acceptedPassenger.status;

        if (acceptedPassenger.status === 'UNCHECKABLE' && !uncheckableSegments.includes(acceptedSegment.id)) {
            uncheckableSegments.push(acceptedSegment.id);
        }
    }

    private hasAirportInfo = (info: CkiBookingInfo.AirportInfo): boolean => !!info?.airport?.code && !!info?.airport?.description;
    private getAirShuttleSegments (segments: CkiBookingInfo.Segment[]): SegmentInfoSource[] {
        return (
            segments?.filter(
                (segment) => segment?.id !== undefined && this.hasAirportInfo(segment.departure) && this.hasAirportInfo(segment.arrival)
            ) ?? []
        );
    }

    private getBookingSegments (bookingInfo: CkiBookingInfo.BookingInfo): SegmentInfoSource[] {
        const regularSegments: SegmentInfoSource[] = [...bookingInfo.outwardSegments, ...bookingInfo.returnSegments];
        const airShuttleSegments: SegmentInfoSource[] = this.getAirShuttleSegments(bookingInfo.airShuttleSegments);

        return [...regularSegments, ...airShuttleSegments];
    }

    private createSegmentInfo (segment: SegmentInfoSource): SegmentInfo {
        return {
            id: String(segment.id),
            origin: this.createSegmentAirportInfo(segment.departure.airport),
            destination: this.createSegmentAirportInfo(segment.arrival.airport)
        };
    }

    private createSegmentAirportInfo (airport: CkiBookingInfo.Airport): SegmentAirportInfo {
        return {
            code: airport.code,
            description: airport.description
        };
    }
}

downgradeToAJSService('IbPassengerBookingUtilsService', IbPassengerBookingUtilsService, 'ib-shared-components-module');
