import { Inject, Injectable } from '@angular/core';
import { DateFormatPipe, DateFormatResult } from '@src/app/shared/pipes/date-format.pipe';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { AJSCurrencyService, CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';

import { IbPassengerBookingUtilsService } from './ib-passenger-booking-utils.service';
import {
    AncillaryItem,
    BobOrder,
    BobProduct,
    BobSummary,
    CancelData,
    DisruptionContactApi,
    FailedItemSegment,
    FailedPaymentItem,
    FareFamily,
    FareFamilyConditions,
    FlightDate,
    HeaderCity,
    HeaderFlightDates,
    HeaderSegmentInfo,
    HeaderTripInfo,
    PassengerHeaderCounters,
    PassengerTypeCounter,
    SegmentInfo,
    UpgradeInfoStorage,
    UpgradeOfferSegment,
    UpgradingAncillary,
    UpgradingHeaderInfo,
    UpgradingTrip
} from '../../../core/models/ib-utils.model';

@Injectable({
    providedIn: 'root'
})
export class IbAncillariesPaymentUtilsService {
    private readonly passengerTypeCounters: Readonly<Partial<Record<string, PassengerTypeCounter>>> = {
        [CheckinAppConstants.PASSENGER_TYPE.SENIOR]: 'numSeniors',
        [CheckinAppConstants.PASSENGER_TYPE.ADULT]: 'numAdults',
        [CheckinAppConstants.PASSENGER_TYPE.CHILD]: 'numChilds',
        [CheckinAppConstants.PASSENGER_TYPE.INFANT]: 'numInfant',
        [CheckinAppConstants.PASSENGER_TYPE.YOUTH]: 'numYoung'
    };

    constructor (
        private readonly commonsSessionStorageService: CommonsSessionStorageService,
        private readonly ibPassengerBookingService: IbPassengerBookingUtilsService,
        private readonly dateFormatPipe: DateFormatPipe,
        @Inject(AJSCurrencyService) private readonly currencyService: CurrencyService
    ) {}

    /**
   * Checks whether any passenger in the booking has a pending payment.
   *
   * @param bookingInfo Booking information.
   * @returns `true` if there is any pending payment.
   */
    checkPendingPayments (bookingInfo?: CkiBookingInfo.BookingInfo): boolean {
        return bookingInfo?.passengers?.some((passenger) => passenger?.pendingPayment) ?? false;
    }

    /**
   * Builds the error text for pending payments that could not be removed.
   *
   * @param cancelData Cancellation response containing failed items.
   * @returns Concatenated error descriptions.
   */
    checkFailedPendingPayments (cancelData?: CancelData): string {
        const failedItems = cancelData?.failedToDelete ?? [];

        return failedItems
            .flatMap((failedItem) => this.getFailedPaymentDescriptions(failedItem))
            .filter((description): description is string => Boolean(description))
            .join('');
    }

    /**
   * Stores fare family conditions in the session.
   *
   * @param fareFamilyInfo Received fare families.
   * @returns Updated fare conditions.
   */
    setFareFamilyConditions (fareFamilyInfo: FareFamily[] = []): FareFamilyConditions {
        const fareFamilyConditions = (this.commonsSessionStorageService.get('fareFamilyConditions') as FareFamilyConditions | null) ?? {};

        const conditions = fareFamilyInfo.reduce(
            (accumulator, fareFamily) => this.addFareFamilyCondition(accumulator, fareFamily),
            fareFamilyConditions
        );

        this.commonsSessionStorageService.set('fareFamilyConditions', conditions);

        return conditions;
    }

    /**
   * Stores the currency corresponding to the booking issue currency.
   *
   * @param currencies Available currencies.
   * @param issueCurrency Booking currency code.
   */
    setAncillariesCurrency (currencies: Currency[] = [], issueCurrency?: string): void {
        const currency = currencies.find(({ code }) => code === issueCurrency);

        if (!currency) {
            return;
        }

        this.commonsSessionStorageService.set('currency', this.currencyService.getCurrencyObject(currency));
    }

    /**
   * Creates and stores the integrated Buy on Board order.
   *
   * @param freeItems Available free ancillary services.
   */
    setAncillariesBob (freeItems: AncillaryItem[] = []): void {
        const integratedBobItem = this.getIntegratedBobItem(freeItems);

        if (!integratedBobItem) {
            return;
        }

        const bobOrder = this.createBobOrder(integratedBobItem, this.getDisruptionContactEmail());

        this.commonsSessionStorageService.set('bobOrder', bobOrder);
    }

    /**
   * Generates upgrading information for the common header.
   *
   * @param ancillaries Ancillaries pending payment.
   * @returns Upgrading trips and their formatted total amount.
   */
    getHeaderUpgradingInfo (ancillaries: UpgradingAncillary[] = []): UpgradingHeaderInfo {
        const segmentsById = this.getSegmentsById(this.ibPassengerBookingService.getSegmentsInfo());

        const upgradingAncillaries = ancillaries.filter(
            (ancillary) => ancillary.type === CheckinAppConstants.ANCILLARIES_TYPES.UPGRADING
        );

        const upgradingTrips = upgradingAncillaries.flatMap((ancillary) =>
            this.createUpgradingTrips(ancillary.upgrading?.offerSegmentsClass ?? [], segmentsById)
        );

        const lastUpgradingAncillary = upgradingAncillaries.at(-1);
        const total = lastUpgradingAncillary?.total ?? null;

        return {
            upgradingTrips,
            total,
            totalFormatted: total === null ? null : this.formatUpgradingTotal(total)
        };
    }

    /**
   * Generates segment and passenger information for the common header.
   *
   * @param segments Booking segments.
   * @param passengers Booking passengers.
   * @returns Header information for each segment.
   */
    getInfoHeader (segments: CkiBookingInfo.Segment[], passengers: CkiBookingInfo.Passenger[]): HeaderSegmentInfo[] {
        const passengerCounters = this.getPassengerHeaderCounters(passengers);
        const result = segments.map((segment) => ({
            originCity: this.createHeaderCity(segment.departure),
            destinationCity: this.createHeaderCity(segment.arrival),
            dates: this.createHeaderFlightDates(segment.departure),
            ...passengerCounters
        }));

        return result;
    }

    /**
   * Generates the flight routes displayed in the common header.
   *
   * @returns Routes with origin, destination, and departure date.
   */
    generateHeaderTripsInfo (): HeaderTripInfo[] {
        const bookingInfo = this.commonsSessionStorageService.get('bookingInfo') as CkiBookingInfo.BookingInfo | null;

        if (!bookingInfo) {
            return [];
        }

        const airShuttleSegments = bookingInfo.airShuttleSegments
            .filter(
                (segment) =>
                    segment.type !== CheckinAppConstants.SHUTTLE_SEGMENTS_TYPES.OPEN
            );

        const segments = [
            ...airShuttleSegments,
            ...(bookingInfo.outwardSegments ?? []),
            ...(bookingInfo.returnSegments ?? [])
        ];

        return segments.map((segment) => this.createHeaderTripInfo(segment));
    }

    /**
   * Gets error descriptions according to the type of failed ancillary.
   *
   * @param failedItem Item that could not be removed.
   * @returns List of error descriptions.
   */
    private getFailedPaymentDescriptions (failedItem?: FailedPaymentItem): Array<string | undefined> {
        const { SEAT, BAGGAGE, UPGRADING } = CheckinAppConstants.ANCILLARIES_TYPES;

        const handlers: Record<string, (item: FailedPaymentItem) => Array<string | undefined>> = {
            [SEAT]: (item) => this.getErrorDescriptions(item.segments),
            [BAGGAGE]: (item) => this.getErrorDescriptions(item.pasengers),
            [UPGRADING]: (item) => [item.error?.description]
        };

        return failedItem?.type && handlers[failedItem.type] ? handlers[failedItem.type](failedItem) : [];
    }

    /**
   * Extracts error descriptions from a list of items.
   *
   * @param items Segments or passengers with errors.
   * @returns Found descriptions.
   */
    private getErrorDescriptions (items: FailedItemSegment[] = []): Array<string | undefined> {
        return items.map((item) => item?.error?.description);
    }

    /**
   * Adds a fare family if it does not already exist in the conditions.
   *
   * @param conditions Already stored conditions.
   * @param fareFamily Fare family to be added.
   * @returns Updated conditions.
   */
    private addFareFamilyCondition (conditions: FareFamilyConditions, fareFamily: FareFamily): FareFamilyConditions {
        const commercialCode = fareFamily?.commercialCode;

        if (!commercialCode || conditions[commercialCode]) {
            return conditions;
        }

        return {
            ...conditions,
            [commercialCode]: fareFamily
        };
    }

    /**
   * Gets the last integrated Buy on Board ancillary.
   *
   * @param freeItems List of free ancillaries.
   * @returns Integrated ancillary, if available.
   */
    private getIntegratedBobItem (freeItems: AncillaryItem[]): AncillaryItem | undefined {
        return freeItems.filter((item) => item?.type === CheckinAppConstants.ANCILLARIES_TYPES.INTEGRATED_BOB).pop();
    }

    /**
   * Gets the disruption contact email stored in the session.
   *
   * @returns Email in uppercase, if available.
   */
    private getDisruptionContactEmail (): string | undefined {
        const contactApi = this.commonsSessionStorageService.get('disruptionContactApis') as DisruptionContactApi[] | null;

        return contactApi?.[0]?.disruptionContact?.email?.toUpperCase();
    }

    /**
   * Creates the order structure required by the Buy on Board flow.
   *
   * @param item Integrated Buy on Board ancillary.
   * @param email Disruption contact email.
   * @returns Buy on Board order.
   */
    private createBobOrder (item: AncillaryItem, email?: string): BobOrder {
        return {
            id: item.orderId,
            status: item.status,
            bookingCode: item.bookingCode,
            summary: [this.createBobSummary(item, email)]
        };
    }

    /**
   * Creates the summary of a Buy on Board order.
   *
   * @param item Integrated Buy on Board ancillary.
   * @param email Disruption contact email.
   * @returns Order summary.
   */
    private createBobSummary (item: AncillaryItem, email?: string): BobSummary {
        return {
            number: null,
            type: null,
            status: item.status,
            amount: item.total,
            products: [this.createBobProduct(item)],
            date: null,
            slot: null,
            address: null,
            email
        };
    }

    /**
   * Creates the product for a Buy on Board summary.
   *
   * @param item Integrated Buy on Board ancillary.
   * @returns Product associated with the order.
   */
    private createBobProduct (item: AncillaryItem): BobProduct {
        return {
            type: 'checkin',
            quantity: item.bags,
            price: item.total,
            tax: 0
        };
    }

    /**
   * Converts the segments of an upgrading offer into header trips.
   *
   * @param offerSegments Segments included in the offer.
   * @param segmentsById Booking segments indexed by identifier.
   * @returns Upgrading trips with their route.
   */
    private createUpgradingTrips (
        offerSegments: UpgradeOfferSegment[],
        segmentsById: Map<string, SegmentInfo>
    ): UpgradingTrip[] {
        return offerSegments.map((offerSegment) => {
            const segment = segmentsById.get(offerSegment.segmentId.toString());

            return {
                segmentId: offerSegment.segmentId,
                cabin: offerSegment.cabinClass.description,
                origin: segment?.origin ?? null,
                destination: segment?.destination ?? null
            };
        });
    }

    /**
   * Creates a segment index using its identifier.
   *
   * @param segments Booking segment information.
   * @returns Map of segments indexed by ID.
   */
    private getSegmentsById (segments: SegmentInfo[]): Map<string, SegmentInfo> {
        return new Map(segments.map((segment) => [segment.id, segment]));
    }

    /**
   * Formats the total upgrading amount with its corresponding currency.
   *
   * @param total Total upgrading amount.
   * @returns Formatted amount.
   */
    private formatUpgradingTotal (total: number): string {
        const upgradeInfo = this.commonsSessionStorageService.get('upgradeInfo') as UpgradeInfoStorage | null;

        const currency = this.currencyService.getCurrencyObject(upgradeInfo?.currency);

        return this.currencyService.formatPrice(currency, total, true);
    }

    /**
   * Calculates the passenger counters required by the header.
   *
   * @param passengers Booking passengers.
   * @returns Aggregated passenger counters.
   */
    private getPassengerHeaderCounters (passengers: CkiBookingInfo.Passenger[]): PassengerHeaderCounters {
        const initialCounters = this.createPassengerHeaderCounters(passengers.length);

        return passengers.reduce(
            (counters, passenger) => this.addPassengerToHeaderCounters(counters, passenger),
            initialCounters
        );
    }

    /**
   * Creates the initial passenger counter structure.
   *
   * @param passengerCount Total number of passengers.
   * @returns Initialized counters.
   */
    private createPassengerHeaderCounters (passengerCount: number): PassengerHeaderCounters {
        return {
            passengers: passengerCount,
            numAdults: 0,
            numSeniors: 0,
            numYoung: 0,
            numTeenager: 0,
            numInfant: 0,
            numChilds: 0,
            numberPassengrsWithoutInfant: 0
        };
    }

    /**
   * Updates header counters with a passenger's information.
   *
   * @param counters Accumulated counters.
   * @param passenger Passenger being processed.
   * @returns Updated counters.
   */
    private addPassengerToHeaderCounters (
        counters: PassengerHeaderCounters,
        passenger: CkiBookingInfo.Passenger
    ): PassengerHeaderCounters {
        this.incrementPassengerTypeCounter(counters, passenger.type);
        this.incrementPassengersWithoutInfant(counters, passenger);

        return counters;
    }

    /**
   * Increments the counter associated with the passenger type.
   *
   * @param counters Accumulated counters.
   * @param passengerType Passenger type.
   */
    private incrementPassengerTypeCounter (counters: PassengerHeaderCounters, passengerType: string): void {
        const counterKey = this.passengerTypeCounters[passengerType];

        if (counterKey) {
            counters[counterKey] += 1;
        }
    }

    /**
   * Increments the counter for passengers without an associated infant.
   *
   * @param counters Accumulated counters.
   * @param passenger Passenger being processed.
   */
    private incrementPassengersWithoutInfant (
        counters: PassengerHeaderCounters,
        passenger: CkiBookingInfo.Passenger
    ): void {
        if (passenger.infant === null) {
            counters.numberPassengrsWithoutInfant += 1;
        }
    }

    /**
   * Adapts airport information to the header city format.
   *
   * @param airport Airport information.
   * @returns City in the format required by the header.
   */
    private createHeaderCity (airport: any): HeaderCity {
        return {
            code: airport.airportCode,
            description: airport.airportDescription,
            timezone: airport.originalDate,
            country: {
                code: airport.cityCode,
                description: airport.cityCode
            }
        };
    }

    /**
   * Creates the flight date structure for the header.
   *
   * @param departure Segment departure information.
   * @returns Formatted flight dates.
   */
    private createHeaderFlightDates (departure: CkiBookingInfo.AirportInfo): HeaderFlightDates {
        const outboundFlight = this.getMiddleDashDate(departure.date);

        return {
            outboundFlight,
            formatedOutboundFlight: `${outboundFlight}T00:00:00.000Z`,
            returnFlight: '',
            formatedReturnFlight: ''
        };
    }

    /**
   * Normalizes a date to the YYYY-MM-DD format.
   *
   * @param date Booking date.
   * @returns Date with dash separators.
   */
    private getMiddleDashDate (date: FlightDate): string {
        if (!date) {
            return '';
        }

        if (typeof date === 'string') {
            return date.split('T')[0];
        }

        const { year, monthNumber, monthDay } = date;

        return `${year}-${this.padDatePart(monthNumber)}-${this.padDatePart(monthDay)}`;
    }

    /**
   * Converts a booking segment to the header trip format.
   *
   * @param segment Segment with route and departure information.
   * @returns Trip information for the header.
   */
    private createHeaderTripInfo (segment: Pick<CkiBookingInfo.Segment, 'departure' | 'arrival'>): HeaderTripInfo {
        return {
            originCode: segment.departure.airport.code,
            destinyCode: segment.arrival.airport.code,
            dateFlight: this.formatHeaderDepartureDate(segment.departure.date)
        };
    }

    /**
   * Formats a departure date to the DD/MM/YYYY format.
   *
   * @param departureDate Original departure date.
   * @returns Formatted date for the header.
   */
    private formatHeaderDepartureDate (departureDate: string): string {
        const dateWithoutTime = departureDate.split(' ')[0];
        const formattedDate = this.dateFormatPipe.transform(dateWithoutTime);

        return this.getSlashDate(formattedDate);
    }

    /**
   * Converts date parts to the DD/MM/YYYY format.
   *
   * @param date Date parts returned by the pipe.
   * @returns Date with slash separators.
   */
    private getSlashDate (date: DateFormatResult | null | undefined): string {
        if (!date) {
            return '';
        }

        const day = this.padDatePart(date.monthDay as number);
        const month = this.padDatePart(date.monthNumber as number);

        return `${day}/${month}/${date.year}`;
    }

    /**
   * Pads a numeric date part with a leading zero.
   *
   * @param value Numeric date value.
   * @returns Two-digit value.
   */
    private padDatePart (value: number): string {
        return String(value).padStart(2, '0');
    }
}

downgradeToAJSService('IbAncillariesPaymentUtilsService', IbAncillariesPaymentUtilsService, 'ib-shared-components-module');
