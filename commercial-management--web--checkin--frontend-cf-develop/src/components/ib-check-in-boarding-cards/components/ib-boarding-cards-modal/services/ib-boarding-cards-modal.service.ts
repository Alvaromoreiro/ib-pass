import { Injectable } from '@angular/core';
import { IbCModalService, IbModalRef } from 'ib-web-commons/ib-modal';
import { IbBoardingCardsModalComponent } from '../ib-boarding-cards-modal.component';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';

@Injectable({
    providedIn: 'root'
})
export class IbBoardingCardsModalService {
    private modalRef: IbModalRef<IbBoardingCardsModalComponent>;

    constructor ( 
        private IbCModalService: IbCModalService,
        private sessionStorageService: CommonsSessionStorageService
    ) {}

    showGoogleWalletModal = (viewModel: CkiBoardingCardModal.BoardingCardsModalModel): Promise<any> => {
        this.modalRef = this.IbCModalService.showGenericComponentModal(
            IbBoardingCardsModalComponent,
            {
                modalBlocked: true,
                windowClass: 'ib-modals ib-modals__gw'
            }
        );

        const componentInstance = this.modalRef.componentInstance;
        componentInstance.model = viewModel;

        return this.modalRef.result;
    };

    closeGoogleWalletModal (state: 'dismiss' | 'close', result?: CkiBoardingCardModal.PrintResultModel) {
        this.modalRef[state](result);
    }

    mapSegmentsInformation (segments: CkiBoardingCardModal.ModalSegmentInfo[]): CkiBoardingCardModal.BoardingCardsModalMap[] {
        return segments.map(segment => {
            const { id, arrival, departure, passengers } = segment;

            return {
                id,
                arrival: {
                    airport: arrival.airport
                },
                departure: {
                    airport: departure.airport,
                    date: departure.date
                },
                passengers: this.mapPassengersInformation(passengers)
            };
        });
    }

    private mapPassengersInformation (passengers: CkiBoardingCardModal.Passenger[]): CkiBoardingCardModal.PassengerMap[] {
        return passengers.map(pax => {
            const { id, name, surname } = pax;

            return {
                id,
                name,
                surname,
                gender: this.getPassengerGender(id)
            };
        });
    }

    private getPassengerGender (passengerId: string) {
        const bookingInfo: CkiBookingInfo.BookingInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
        const DEFAULT_VALUE = 'MALE';

        if (!bookingInfo) return DEFAULT_VALUE;

        const { passengers } = bookingInfo;

        return passengers.find(pax => pax.id.toString() === passengerId)?.gender ?? DEFAULT_VALUE;
    }
}

downgradeToAJSService('IbBoardingCardsModalService', IbBoardingCardsModalService, 'ib-boarding-cards-modal-module');