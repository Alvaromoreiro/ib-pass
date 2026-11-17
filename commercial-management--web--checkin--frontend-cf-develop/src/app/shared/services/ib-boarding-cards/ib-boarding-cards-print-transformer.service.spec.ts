import { TestBed } from '@angular/core/testing';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbBoardingCardsPrintTransformer } from './ib-boarding-cards-print-transformer.service';
import { BoardingCardsI, DownloadModeEnum, PassengerI } from '@src/app/core/models/ib-boarding-cards/ib-boarding-cards-print.model';
import { fakeSegmentsSelected, DeepPartial, getFakeBoardingCards, getBiometricStatusPassengeMock, getAcceptedSegmentsMock } from './mocks';

interface ISessionStorageMock {
    get: jasmine.Spy
}

describe('IbBoardingCardsPrintTransformer', () => {
    let transformer: IbBoardingCardsPrintTransformer;
    let mockSessionStorage: ISessionStorageMock;
    let fakeSegmentsSelectedClone: DeepPartial<CkiSegmentsSelected.Segment>[];

    beforeEach(() => {
        mockSessionStorage = {
            get: jasmine.createSpy('mockSessionStorage.get')
        }

        TestBed.configureTestingModule({
            providers: [
                IbBoardingCardsPrintTransformer,
                { provide: CommonsSessionStorageService, useValue: mockSessionStorage }
            ]
        });

        transformer = TestBed.inject(IbBoardingCardsPrintTransformer);

        mockSessionStorage.get.and.stub();
        fakeSegmentsSelectedClone = structuredClone(fakeSegmentsSelected);

        mockSessionStorage.get.withArgs('segmentsSelected').and.returnValue(fakeSegmentsSelectedClone);
        mockSessionStorage.get.withArgs('biometricStatusPassengers').and.returnValue(getBiometricStatusPassengeMock());
        mockSessionStorage.get.withArgs('acceptInfoSegments').and.returnValue(getAcceptedSegmentsMock());
    });

    describe('Service Initialization', () => {
        it('should be created', () => {
            expect(transformer).toBeTruthy();
        });
    });

    describe('getPrintedInformation', () => {
        it('should return the model with full mode when the incoming contains all the data (full)', () => {
            const fakeBoardingCards = getFakeBoardingCards();

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.mode).toBe(DownloadModeEnum.FULL);
            expect(result.boardingCards[0].passengers[0].isDownloaded).toBe(true);
        });

        it('should return the previous model if old mode is full', () => {
            const fakeBoardingCards = getFakeBoardingCards(true);
            fakeBoardingCards.mode = DownloadModeEnum.FULL;

            transformer['model'] = fakeBoardingCards;

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.mode).toBe(DownloadModeEnum.FULL);
        });

        it('should apply partialModel if is partial and exist a previous model partial', () => {
            const fakeBoardingCardsInitial = getFakeBoardingCards();
            fakeBoardingCardsInitial.mode = DownloadModeEnum.PARTIAL;

            transformer['model'] = fakeBoardingCardsInitial;

            const fakeBoardingCardsNew = getFakeBoardingCards(true);
            fakeBoardingCardsNew.boardingCards[0].passengers[0].id = '2';

            const result = transformer.getPrintedInformation(fakeBoardingCardsNew);

            expect(result.boardingCards[0].passengers.length).toBe(3);
            const updatedPassenger = result.boardingCards[0].passengers.find(pax => pax.id === '2');
            expect(updatedPassenger.isDownloaded).toBe(true);
        });

        it('should update the new segment if is partial and exist model', () => {
            const fakeBoardingCardsInitial = getFakeBoardingCards(true);
            fakeBoardingCardsInitial.mode = DownloadModeEnum.PARTIAL;
            fakeBoardingCardsInitial.boardingCards.push({
                id: '2',
                passengers: [{ id: '1' } as PassengerI]
            } as BoardingCardsI);

            transformer['model'] = fakeBoardingCardsInitial;

            const fakeBoardingCardsNew = getFakeBoardingCards(true);
            fakeBoardingCardsNew.boardingCards[0].id = '2';

            const result = transformer.getPrintedInformation(fakeBoardingCardsNew);

            expect(result.boardingCards[1]).toBeDefined();
            expect(result.boardingCards[1].passengers[0].isDownloaded).toBe(true);
        });

        it('should create and populate the model if it doesn\'t exist', () => {
            const fakeBoardingCards = getFakeBoardingCards(true);

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.mode).toBe(DownloadModeEnum.PARTIAL);
            expect(result.boardingCards.length).toBeGreaterThan(1);
            const hasDownloadedPassenger = result.boardingCards[1].passengers.some(pax => pax.isDownloaded);
            expect(hasDownloadedPassenger).toBe(false);
        });

        it('should set empty the description in flightNumber if operatedBy is falsy', () => {
            fakeSegmentsSelectedClone[1].operatedBy = undefined;
            mockSessionStorage.get.withArgs('segmentsSelected').and.returnValue(fakeSegmentsSelectedClone);

            const fakeBoardingCards = getFakeBoardingCards(true);

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.boardingCards[1].flightNumber.company.description).toBe('');
        });

        it('should set the flightNumber from the marketing flight number of the booking info', () => {
            const flight = { company: { code: 'IB', description: 'Iberia' }, number: '123' };
            mockSessionStorage.get.withArgs('bookingInfo').and.returnValue({
                outwardSegments: fakeSegmentsSelectedClone.map(seg => ({ id: seg.id, marketingFlightNumber: flight })),
                returnSegments: []
            });

            const result = transformer.getPrintedInformation(getFakeBoardingCards(true));

            expect(result.boardingCards[1].flightNumber.number).toBe('123');
            expect(result.boardingCards[1].flightNumber.company.code).toBe('IB');
        });

        it('should set operatedBy from the operating flight company description', () => {
            const marketing = { company: { code: 'IB', description: 'Iberia' }, number: '123' };
            const operating = { company: { code: 'BA', description: 'British Airways' }, number: '456' };
            mockSessionStorage.get.withArgs('bookingInfo').and.returnValue({
                outwardSegments: fakeSegmentsSelectedClone.map(seg => ({ id: seg.id, marketingFlightNumber: marketing, operatingFlightNumber: operating })),
                returnSegments: []
            });

            const result = transformer.getPrintedInformation(getFakeBoardingCards(true));

            expect(result.boardingCards[1].flightNumber.company.description).toBe('Iberia');
            expect(result.boardingCards[1].flightNumber.operatedBy).toBe('British Airways');
        });

        it('should set an empty flightNumber when the booking info has no matching segment (one-way)', () => {
            mockSessionStorage.get.withArgs('bookingInfo').and.returnValue({ outwardSegments: [] });

            const result = transformer.getPrintedInformation(getFakeBoardingCards(true));

            expect(result.boardingCards[1].flightNumber.number).toBe('');
            expect(result.boardingCards[1].flightNumber.company).toEqual({ code: '', description: '' });
        });

        it('should add incomingDoc if not exists', () => {
            const fakeBoardingCardsInitial = getFakeBoardingCards(true);
            fakeBoardingCardsInitial.printed[0].documents.splice(1);
            transformer['model'] = fakeBoardingCardsInitial;

            const fakeBoardingCards = getFakeBoardingCards(true);
            fakeBoardingCards.printed[0].documents = [{
                advertisementImages: null,
                base64Bytes: '',
                fileName: '',
                passengerId: '2',
                segmentId: '1',
                url: ''
            }];

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.printed[0].documents.length).toBeGreaterThan(1);
        });

        it('should return full model if passengers has CHECKABLE status', () => {
            fakeSegmentsSelectedClone[0].passengersStatus[0].status = 'CHECKABLE';
            mockSessionStorage.get.withArgs('segmentsSelected').and.returnValue(fakeSegmentsSelectedClone);

            const fakeBoardingCards = getFakeBoardingCards();

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(result.mode).toBe(DownloadModeEnum.FULL);
            expect(result.boardingCards[0].passengers[0].isDownloaded).toBe(true);
        });

        it('should set a single passenger when only one passenger is valid', () => {
            const initialPassengersLength = fakeSegmentsSelectedClone[0].passengersStatus.length;

            mockSessionStorage.get.withArgs('biometricStatusPassengers').and.returnValue(getBiometricStatusPassengeMock(true));

            const fakeBoardingCards = getFakeBoardingCards(true);

            const result = transformer.getPrintedInformation(fakeBoardingCards);

            expect(initialPassengersLength).toBeGreaterThan(1);
            expect(result.boardingCards[0].passengers[0].isDownloaded).toBe(true);
            expect(result.boardingCards[0].passengers.length).toBe(1);
        });
    });
});
