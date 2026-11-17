import { Injectable } from '@angular/core';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';


export interface PendingSegmentSeat {
    segmentId: number;
    pasId: number;
    isCompleted: boolean;
    isLast: boolean;
}

@Injectable({ providedIn: 'root' })
export class IbSeatEarlyCheckinService {

    private readonly bookingInfoKey = 'bookingInfo';
    private readonly selectedSegmentsKey = 'segmentsSelected';
    private readonly firstEarlyMapKey = 'isFirstEarlyMap';
    private readonly pendingSegmentSeatsKey = 'pendingSegmentSeats';
    private readonly isEarlyKey = 'isEarly';

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    /**
    * Checks if the selected segments exactly match the
    * early check-in group and saves the passengers who need a seat.
    *
    * @param passengers Passengers in the view, with the status `isSelected`.
    * @param segmentsSelected Segments in the view. If not specified, 
    * they are retrieved from CommonsSessionStorageService.
    */
    checkEarlySegments (
        passengers: readonly CkiBookingInfo.SelectableEntity[],
        segmentsSelected?: readonly CkiBookingInfo.SelectableEntity[]
    ): boolean {
        const bookingInfo = this.CommonsSessionStorageService.get<CkiBookingInfo.BookingInfo>(this.bookingInfoKey);

        if (!bookingInfo) {
            return this.saveAndReturn(false, []);
        }

        const selectedSegments = segmentsSelected ?? 
        this.CommonsSessionStorageService.get<CkiBookingInfo.SelectableEntity[]>(this.selectedSegmentsKey) ?? [];

        const selectedSegmentIds = this.getSelectedIds(selectedSegments);
        const selectedPassengerIds = new Set(this.getSelectedIds(passengers));
        const checkinGroup = bookingInfo.checkinSegmentsInGroup ?? [];

        const isEarlyFlow = this.areIdsEqual(selectedSegmentIds, checkinGroup);

        const pendingSegmentSeats = isEarlyFlow
            ? this.getPendingSegmentSeats(bookingInfo, checkinGroup, selectedPassengerIds)
            : [];

        if (isEarlyFlow) {
            this.initializeFirstEarlyMap();
        }

        return this.saveAndReturn(isEarlyFlow, pendingSegmentSeats);
    }

    private saveAndReturn (isEarly: boolean, pendingSegmentSeats: PendingSegmentSeat[]): boolean {
        this.CommonsSessionStorageService.set(this.isEarlyKey, isEarly);
        this.CommonsSessionStorageService.set(this.pendingSegmentSeatsKey, pendingSegmentSeats);

        return isEarly;
    }

    private getSelectedIds (entities: readonly CkiBookingInfo.SelectableEntity[]): number[] {
        return entities
            .filter(({ isSelected }) => isSelected)
            .map(({ id }) => id);
    }

    private areIdsEqual (
        selectedIds: readonly number[], 
        groupIds: readonly number[]
    ): boolean {
        return selectedIds.length === groupIds.length && selectedIds.every((id, index) => id === groupIds[index]);
    }

    private getPendingSegmentSeats (
        bookingInfo: CkiBookingInfo.BookingInfo,
        checkinGroup: readonly number[],
        selectedPassengerIds: ReadonlySet<number>
    ): PendingSegmentSeat[] {
        const segmentsById = this.createSegmentsIndex(bookingInfo);

        return checkinGroup.flatMap((segmentId) => {
            const segment = segmentsById.get(segmentId);

            if (!segment) {
                return [];
            }

            return segment.passengers
                .filter((passenger) =>
                    this.requiresSeat(passenger, selectedPassengerIds)
                )
                .map((passenger) =>
                    this.createPendingSegmentSeat(segment.id, passenger.id)
                );
        });
    }

    private createSegmentsIndex (bookingInfo: CkiBookingInfo.BookingInfo): Map<number, CkiBookingInfo.Segment> {
        const allSegments = [
            ...(bookingInfo.outwardSegments ?? []),
            ...(bookingInfo.returnSegments ?? [])
        ];

        return new Map(
            allSegments.map((segment) => [segment.id, segment])
        );
    }

    private requiresSeat (
        passenger: CkiBookingInfo.PassengerDetails,
        selectedPassengerIds: ReadonlySet<number>
    ): boolean {
        return this.hasNoSeat(passenger) &&
            selectedPassengerIds.has(passenger.id) &&
            !this.isPassengerNotAvailable(passenger);
    }

    private hasNoSeat (passenger: CkiBookingInfo.PassengerDetails): boolean {
        return passenger.seat === null;
    }

    private isPassengerNotAvailable (passenger: CkiBookingInfo.PassengerDetails): boolean {
        const notAvailableStatuses = CheckinAppConstants.FLIGHT_PASSENGERS_STATUS_LIST.NOT_AVAILABLE;
        return notAvailableStatuses.includes(
            passenger.status.code
        );
    }

    private createPendingSegmentSeat (segmentId: number, passengerId: number): PendingSegmentSeat {
        return {
            segmentId,
            pasId: passengerId,
            isCompleted: false,
            isLast: false
        };
    }

    private initializeFirstEarlyMap (): void {
        const isFirstEarlyMap = this.CommonsSessionStorageService.get<boolean>(
            this.firstEarlyMapKey
        );

        if (isFirstEarlyMap === null) {
            this.CommonsSessionStorageService.set(this.firstEarlyMapKey, true);
        }
    }
}


downgradeToAJSService('IbSeatEarlyCheckinService', IbSeatEarlyCheckinService, 'ib-shared-components-module');