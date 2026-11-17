import { Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
import { BoardingCardsI, BoardingI, DocumentsI, DownloadModeEnum, FlightNumberI, FlyInfoI, ICabinClass, ISeat, MaxWeightBaggageI, PassengerI, PrintBoardingCardsData, PrintedI } from '@src/app/core/models/ib-boarding-cards/ib-boarding-cards-print.model';
import { ICkiBiometricStatusPassengers } from '@src/app/core/models/storage/cki-biometric-status-passengers.model';
import { IAcceptData, IAcceptedSegments } from '@src/app/core/models/storage/cki-accept-info-model';

@Injectable({ providedIn: 'root' })
export class IbBoardingCardsPrintTransformer {
    private model: PrintBoardingCardsData = null;
    private incomingModel: PrintBoardingCardsData = null;
    private segmentsSelected: CkiSegmentsSelected.Segment[] = null;
    private acceptStorage: IAcceptData = null;

    constructor (private sessionStorageService: CommonsSessionStorageService) {}

    getPrintedInformation (printedBoardingCardsData?: PrintBoardingCardsData) {
        this.incomingModel = printedBoardingCardsData;

        this.segmentsSelected = this.getSegmentsSelected();

        const incomingIsFull = this.isFullMode(printedBoardingCardsData);

        if (incomingIsFull) {
            this.model = printedBoardingCardsData;
            this.model.boardingCards.forEach(segment => {
                segment.passengers = segment.passengers.map(pax => this.applyDownloadStateToPassenger(pax, true));
            });
            this.model.mode = DownloadModeEnum.FULL;

            return this.model;
        }

        if (!this.model) {
            this.model = this.createAndFillBaseModel();

            return this.model;
        }

        if (this.model.mode === DownloadModeEnum.FULL) return this.model;

        this.applyPartialModel();
        return this.model;
    }

    private applyPartialPassengers (passengers: PassengerI[], incomingPassenger: PassengerI): PassengerI[] {
        return passengers.map(pax => {
            return pax.id === incomingPassenger.id
                ? this.applyDownloadStateToPassenger(incomingPassenger, true)
                : pax;
        });
    }

    private applyPartialModel () {
        if (!this.incomingModel) return;

        const modelClone = structuredClone(this.model);

        const incomingSegment = this.incomingModel.boardingCards[0];
        const incomingPassenger = this.incomingModel.boardingCards[0].passengers[0];

        const updatedBoardingCards = modelClone.boardingCards.map(segment => {
            if (segment.id !== incomingSegment.id) return segment;

            return {
                ...incomingSegment,
                passengers: this.applyPartialPassengers(segment.passengers, incomingPassenger)
            };
        });

        modelClone.boardingCards = updatedBoardingCards;
        modelClone.printed = this.applyPartialPrinted();

        this.model = modelClone;
    }

    private getSegmentsSelected (): CkiSegmentsSelected.Segment[] {
        const segmentsSelected: CkiSegmentsSelected.Segment[] = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.SEGMENTS_SELECTED);
        const acceptedInfoSegments: IAcceptData = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.ACCEPT_INFO);

        this.acceptStorage = acceptedInfoSegments;

        const boardingDocumentsStorage: ICkiBiometricStatusPassengers = this.sessionStorageService.get('biometricStatusPassengers');
        const finalPassengersIds = boardingDocumentsStorage?.passengersList.map(pax => pax.id) ?? acceptedInfoSegments.acceptedSegments.flatMap(segment => segment.passengers.map(pax => pax.id.toString()));

        return segmentsSelected.map(segment => {
            segment.passengersStatus = this.getValidPassengers(segment.passengersStatus, finalPassengersIds);
            return segment;
        });
    }

    private isFullMode (printedBoardingCardsData: PrintBoardingCardsData): boolean {
        if (!printedBoardingCardsData) return false;

        const expectedRelations = this.segmentsSelected.reduce(
            (acc, segment) =>
                acc +
                segment.passengersStatus.filter(
                    passenger => passenger.status === 'CHECKED' || passenger.status === 'CHECKABLE'
                ).length,
            0
        );

        const modelRelations = printedBoardingCardsData?.boardingCards
            ?.reduce((acc, segment) => acc + segment.passengers.length, 0) ?? 0;

        return expectedRelations === modelRelations;
    }

    private createAndFillBaseModel (): PrintBoardingCardsData {
        return {
            ...this.incomingModel,
            mode: DownloadModeEnum.PARTIAL,
            boardingCards: this.createAndFillBoardingCardsModel(),
            printed: this.incomingModel?.printed ?? []
        };
    }

    private createAndFillBoardingCardsModel (): BoardingCardsI[] {
        return this.segmentsSelected.map(segment => {
            const existedSegment = this.incomingModel?.boardingCards.find(seg => seg.id === segment.id.toString());
            const acceptSegment = this.acceptStorage?.acceptedSegments.find(seg => seg.id === segment.id);

            if (existedSegment) return {...existedSegment, passengers: this.generatePassengers(existedSegment, segment, acceptSegment) };

            return this.generateSegment(segment, acceptSegment);
        });
    }

    private generateSegment (segment: CkiSegmentsSelected.Segment, acceptSegment: IAcceptedSegments): BoardingCardsI {
        return {
            id: segment.id.toString(),
            typeOfTransport: segment.type,
            departure: this.getFlightInfo(segment.departure),
            arrival: this.getFlightInfo(segment.arrival),
            flightNumber: this.getFlightNumber(segment),
            boarding: this.generateBoardingInfo(),
            maxWeightBaggage: this.generateMaxWeightBaggage(),
            companyType: '',
            estimatedFlightTime: '',
            passengers: this.getPassengers(segment.passengersStatus, acceptSegment)
        };
    }

    private generatePassengers (existedSegment: BoardingCardsI, segment: CkiSegmentsSelected.Segment, acceptSegment: IAcceptedSegments): PassengerI[] {
        return segment.passengersStatus.map(pax => {
            const existedPassenger = existedSegment.passengers.find(expax => expax.id === pax.id.toString());
            if (existedPassenger) return this.applyDownloadStateToPassenger(existedPassenger, true);

            const acceptPassenger = acceptSegment?.passengers.find(pax => pax.id === pax.id);

            return {
                id: pax.id.toString(),
                name: pax.name,
                surname: pax.surname,
                isDownloaded: false,
                cabinClass: {
                    ...acceptSegment?.cabinClass
                },
                seat: {
                    ...acceptPassenger?.seat
                }
            };
        });
    }

    private applyDownloadStateToPassenger (passenger: PassengerI, state: boolean): PassengerI {
        return {
            ...passenger,
            isDownloaded: state
        };
    }

    private getFlightInfo (flight: CkiSegmentsSelected.Airport): FlyInfoI {
        return {
            date: flight.originalDate,
            airport: {
                code: flight.airportCode,
                description: flight.airportDescription,
                country: ''
            },
            terminal: flight.terminal
        };
    }

    private getFlightNumber (segment: CkiSegmentsSelected.Segment): FlightNumberI {
        const bookingInfo: CkiBookingInfo.BookingInfo = this.sessionStorageService.get(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO);
        const segmentBookingInfo = this.getSegmentBookingInfo(segment, bookingInfo);
        const flightInformation = segmentBookingInfo?.marketingFlightNumber ?? segmentBookingInfo?.operatingFlightNumber;

        return {
            company: this.getFlightCompany(flightInformation?.company),
            marketing: null,
            number: flightInformation?.number ?? '',
            operatedBy: segmentBookingInfo?.operatingFlightNumber?.company?.description ?? ''
        };
    }

    private getSegmentBookingInfo (segment: CkiSegmentsSelected.Segment, bookingInfo: CkiBookingInfo.BookingInfo) {
        const segments = [...(bookingInfo?.outwardSegments ?? []), ...(bookingInfo?.returnSegments ?? [])];

        return segments.find(bookingSegment => bookingSegment.id === segment.id);
    }

    private getFlightCompany (company: CkiBookingInfo.Company): FlightNumberI['company'] {
        return {
            code: company?.code ?? '',
            description: company?.description ?? ''
        };
    }

    private generateBoardingInfo (): BoardingI {
        return {
            date: '',
            limitDate: '',
            gate: null
        };
    }

    private generateMaxWeightBaggage (): MaxWeightBaggageI {
        return {
            amount: null,
            measurementType: null
        };
    }

    private getPassengers (passengers: CkiSegmentsSelected.PassengersStatus[], acceptSegment: IAcceptedSegments): PassengerI[] {
        return passengers.map(passenger => {
            const acceptPassenger = acceptSegment?.passengers.find(pax => pax.id === passenger.id);

            return {
                id: passenger.id.toString(),
                name: passenger.name,
                surname: passenger.surname,
                isDownloaded: false,
                cabinClass: {
                    ...this.fillCabinClass(acceptSegment?.cabinClass)
                },
                seat: {
                    ...this.fillSeatData(acceptPassenger?.seat)
                }
            };
        });
    }

    private fillCabinClass (cabinClass: ICabinClass | undefined): ICabinClass {
        return {
            code: cabinClass?.code ?? '',
            type: cabinClass?.type ?? '',
            description: cabinClass?.description ?? ''
        };
    }

    private fillSeatData (seat: ISeat | undefined): ISeat {
        return {
            row: seat?.row ?? '',
            column: seat?.column ?? ''
        };
    }

    private applyPartialPrinted (): PrintedI[] {
        if (!this.model.printed) return [];

        return this.model.printed.map(card => {
            return {
                ...card,
                documents: this.applyPartialPrintedDocuments(card.documents)
            };
        });
    }

    private applyPartialPrintedDocuments (documents: DocumentsI[]): DocumentsI[] {
        const incomingDoc = this.incomingModel.printed[0].documents[0];
        const returnedDocuments = structuredClone(documents);

        const existDocument = returnedDocuments.find(doc => doc.passengerId === incomingDoc.passengerId && doc.segmentId === incomingDoc.segmentId);

        if (!existDocument) returnedDocuments.push(incomingDoc);

        return returnedDocuments;
    }

    private getValidPassengers (passengers: CkiSegmentsSelected.PassengersStatus[], passengersIds: string[]) {
        return passengers.filter(pax =>
            passengersIds.includes(pax.id.toString())
        );
    }
}

downgradeToAJSService('IbBoardingCardsPrintTransformer', IbBoardingCardsPrintTransformer, 'ib-shared-services-module');
