/* eslint-disable @typescript-eslint/no-loop-func */
import * as angular from 'angular';
import { AncillariesTemporalUtilsService } from '../services/ib-web-ancillaries-utils';
import { BidSegment } from '../../../core/models/upgBidAndAvios/upgBidsandAvios-model';
import { AncillariesUpgradingTransformer } from './ib-web-ancillaries-upgrading-transformer.service';
import { TypesBidEnum } from '../../../core/enums/ib-bids/types-bid.enum';
import { DatalayerUtilsService } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAncillariesConstant } from '@src/app/core/constants/ib-ancillaries-constants';
import { PetSummaryBox } from 'ib-web-ancillaries';
export class AncillariesTransformer {
    constructor (
        private CurrencyService: CurrencyService,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private AncillariesTemporalUtilsService: AncillariesTemporalUtilsService,
        private $rootScope: CommonsRootScope,
        private $filter: ng.IFilterService,
        private DatalayerUtilsService: DatalayerUtilsService,
        private ancillariesUpgradingTransformer: AncillariesUpgradingTransformer

    ) { }

    /**
       *
       * @param {*} oldSegment
       */
    showSegmentsSelected = (oldSegment: any): any => {
        const selectedSegments: any = [];
        const idSelectedSegments: any = this.CommonsSessionStorageService.get('ancillariesAvailableSegments') || [];
        for (let i = 0; i < oldSegment.length; i++) {
            for (let j = 0; j < idSelectedSegments.length; j++) {
                if (oldSegment[i].id === idSelectedSegments[j]) {
                    selectedSegments.push(oldSegment[i]);
                }
            }
        }
        return selectedSegments;
    };




    countBaggageTotal = (passengers: any) => {
        let count = 0;
        angular.forEach(passengers, (passenger) => {
            angular.forEach(passenger.trips, (trip) => {
                angular.forEach(trip.pieces, (piece) => {
                    count += piece.purchasedPieces;
                    count += piece.quantySelected;
                });
            });
        });
        return count;
    };


    concatData = (quantity: any, description: any, text: any, type: any) => {
        if (text === null) {
            if (type === BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE) {
                text = quantity.toString() + ' ' +
                    (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) + ' ' + description;
            } else {
                text = quantity.toString() + ' ' + description;
            }

        } else {
            if (type === BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE) {
                text += ', ' + quantity.toString() + ' ' +
                    (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) + ' ' + description;
            } else {
                text += ', ' + quantity.toString() + ' ' + description;
            }
        }
        return text;
    };

    generateBaggageSpeqsHaveInfo = (info: any, type: any): any => {
        let text, count;
        angular.forEach(info, (data) => {
            angular.forEach(data.trips, (trip) => {
                text = null;
                angular.forEach(trip.pieces, (piece) => {
                    count = 0;
                    count += piece.purchasedPieces ? piece.purchasedPieces : 0;
                    count += piece.franchisePieces ? piece.franchisePieces : 0;
                    count += piece.extraPieces && piece.extraPieces.units ? piece.extraPieces.units : 0;
                    if (count > 0) {
                        text = this.concatData(count, piece.description, text, type);
                    }
                });
                trip.text = text;
            });
        });
        return info;
    };

    generatePreorderInfo = (ancillary: any, transformedInfo: any): any => {
        const preOrderConfig = {
            currency: ancillary.currency,
            info: ancillary.externalUrl,
            priceFrom: '',
            status: ancillary.status,
            type: ancillary.type,
            name: BookingAncillariesConstant.PREORDER_CONFIGURATION.NAME,
            cardCols: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDCOLS,
            cardType: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTYPE,
            cardImg: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDIMG,
            cardTitle: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTITLE,
            cardText: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTEXT,
            cardSubtext: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDSUBTEXT,
            cardSubtextSelect: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDSUBTEXTSELECT,
            cardButton: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDBUTTON,
            confirmed: this.CommonsSessionStorageService.get('hasPreorderAncillarie'),
            selectedFlex: null,
            modal: BookingAncillariesConstant.PREORDER_CONFIGURATION.MODAL,
            datalayer: BookingAncillariesConstant.DATALAYER_INFO.PREORDER_DISPLAY,
            cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(parseFloat(BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDPRICE)), false, false)
        };
        return preOrderConfig;
    };
    getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
        const info = { departure: null, arrival: null };
        for (let i = 0; i < segmentsInfo.length; i++) {
            if (segmentsInfo[i].id.toString() === segmentId) {
                info.arrival = segmentsInfo[i].arrival.airport;
                info.departure = segmentsInfo[i].departure.airport;
            }
        }

        return info;
    };
    generateBaggageTripsInformation = (ancillariesSlices: any, ancillariesTrips: any, cachedData: any): any => {

        const passengersBaggages = [];
        const segmentsInfo = this.AncillariesTemporalUtilsService.getBookingSegmentInformation();
        const getInfoInfant = (infoPassengers, infoAdultWithInfant) => {
            const infoInfantRelated = infoPassengers.find( infoPassenger => infoPassenger.passengerId === infoAdultWithInfant.personalInfo.infant.id);

            infoAdultWithInfant.personalInfo.infant.name = infoInfantRelated.personalInfo.name;
            infoAdultWithInfant.personalInfo.infant.surname = infoInfantRelated.personalInfo.surname;
            return infoAdultWithInfant.personalInfo.infant;
        };
        const getInfoPassenger = (id: any): any => {
            const pasInfo: any = {};
            angular.forEach(cachedData.passengers, (pas) => {
                if (pas.passengerId.toString() === id) {
                    const infoInfant = pas.personalInfo.infant ? getInfoInfant(cachedData.passengers, pas) : pas.personalInfo.infant;
                    pasInfo.name = pas.personalInfo.name;
                    pasInfo.surname = pas.personalInfo.surname;
                    pasInfo.infant = infoInfant;
                }
            });
            return pasInfo;
        };

        for (let i = 0; i < ancillariesTrips.length; i++) {
            let isFound = false;
            if (ancillariesTrips[i].status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                angular.forEach(ancillariesTrips[i].passengers, (passengerTrip) => {
                    const passenger = {
                        id: passengerTrip.id,
                        trips: [],
                        info: getInfoPassenger(passengerTrip.id)
                    };
                    const trip: any = {
                        id: ancillariesTrips[i].id,
                        pieces: [],
                        maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
                        piecesChoosed: 0,
                        totalPrice: 0,
                        totalBaggages: 0
                    };

                    angular.forEach(ancillariesSlices, (slice) => {
                        if (slice.id === ancillariesTrips[i].id) {
                            if (slice.segmentIds.length > 1) {
                                trip.departure = this.getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                trip.arrival = this.getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                            } else {
                                angular.extend(trip, this.getInfoSegment(slice.segmentIds[0], segmentsInfo));
                            }

                        }
                    });

                    angular.forEach(passengerTrip.pieces, (pasPieces) => {
                        isFound = false;
                        if (pasPieces.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                            pasPieces.quantySelected = 0;
                            pasPieces.purchasedPieces > 0 ? trip.totalBaggages += pasPieces.purchasedPieces : angular.noop;
                            pasPieces.franchisePieces > 0 ? trip.totalBaggages += pasPieces.franchisePieces : angular.noop;
                            pasPieces.extraPieces ? trip.totalBaggages += pasPieces.extraPieces.units : angular.noop;
                            trip.pieces.push(pasPieces);

                        }
                    });

                    for (let j = 0; j < passengersBaggages.length; j++) {
                        if (passenger.id === passengersBaggages[j].id) {
                            passengersBaggages[j].trips.push(trip);
                            isFound = true;
                        }
                    }
                    if (!isFound && trip.pieces.length > 0) {
                        passenger.trips.push(trip);
                        passengersBaggages.push(passenger);
                    }
                });
            }

        }


        return passengersBaggages;
    };

    formatPriceFlexibilization = (flexInfo: any, transformedInfo: any): any => {
        angular.forEach(flexInfo, (info) => {
            if (info.passengerPrices.length > 0) {
                info.priceFormatted = this.CurrencyService.formatPrice(transformedInfo.currency, info.passengerPrices[0].amount, true, false);
            }
        });
        return flexInfo;
    };

    generateFlexibilizationInfo = (ancillarie: any, transformedInfo: any): any => {
        const flexibilization = {
            currency: ancillarie.currency,
            info: this.formatPriceFlexibilization(ancillarie.flexibilityAncillaries, transformedInfo),
            priceFrom: ancillarie.priceFrom,
            cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancillarie.priceFrom), false, false),
            status: ancillarie.status,
            type: ancillarie.type,
            name: BookingAncillariesConstant.FLEX_CONFIGURATION.NAME,
            cardCols: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDCOLS,
            cardType: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDTYPE,
            cardImg: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDIMG,
            cardTitle: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDTITLE,
            cardText: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDTEXT,
            cardSubtext: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDSUBTEXT,
            cardSubtextSelect: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDSUBTEXTSELECT,
            cardButton: BookingAncillariesConstant.FLEX_CONFIGURATION.CARDBUTTON,
            confirmed: false,
            selectedFlex: null,
            modal: BookingAncillariesConstant.FLEX_CONFIGURATION.MODAL,
            datalayer: BookingAncillariesConstant.DATALAYER_INFO.FLEXIBILIZATION_OPEN
        };
        return flexibilization;
    };

    generatePriorityOffersInfo = (segments: any, ancilariesInfoSlices: any, cachedData: any): any => {
        let segmentsInfo, index, i, trip, passenger: any = {};
        const passengersPriority = [], currency: any = this.CommonsSessionStorageService.get('currency'), bookingInfo = this.CommonsSessionStorageService.get('bookingInfo');

        const checkPassengersSegments = (segments: any): void => {
            let i = 0, isFound = false, passengerAux = [];
            while (i < segments.length && !isFound) {
                if (segments[i].passengers.length > 0) {
                    passengerAux = {... segments[i].passengers};
                    isFound = true;
                }
                i++;
            }
            for (i = 0; i < passengerAux.length; i++) {
                passengerAux[i].amount = null;
                passengerAux[i].status.code = 'NOT_AVAILABLE';
            }
            for (i = 0; i < segments.length; i++) {
                if (segments[i].passengers.length === 0) {
                    segments[i].passengers = passengerAux;
                }
            }
        };


        const createSlicesSegmentsInfo = (segments: any, ancilariesInfoSlices: any, segmentsInfo: any): any => {
            let i, j = 0, isFound;
            const sliceInfo: any = {};

            const getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
                let i = 0, isFound = false;
                const info = { departure: null, arrival: null };
                while (i < segmentsInfo.length && !isFound) {
                    if (String(segmentsInfo[i].id) === segmentId) {
                        info.arrival = segmentsInfo[i].arrival.city;
                        info.departure = segmentsInfo[i].departure.city;
                        isFound = true;
                    }
                    i++;
                }
                return info;
            };
            angular.forEach(ancilariesInfoSlices, (slice) => {
                if (slice.segmentIds.length > 1) {
                    isFound = false;
                    j = 0;
                    sliceInfo.departure = getInfoSegment( slice.segmentIds[0], segmentsInfo).departure;
                    sliceInfo.arrival = getInfoSegment( slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                    for (i = 0; i < slice.segmentIds.length; i++) {
                        while (j < segments.length && !isFound) {
                            if (segments[j].id === slice.segmentIds[i]) {
                                segments[j].withSliceInfo = true;
                                segments[j].sliceInfo = {};
                                segments[j].sliceInfo.departure = sliceInfo.departure;
                                segments[j].sliceInfo.arrival = sliceInfo.arrival;
                                isFound = true;
                            }
                            j++;
                        }
                    }
                } else {
                    j = 0;
                    isFound = false;
                    while (j < segments.length && !isFound) {
                        if (segments[j].id === slice.segmentIds[0]) {
                            segments[j].onlySliceInfo = true;
                            isFound = true;
                        }
                        j++;
                    }
                }
            });
        };

        const getInfoTrip = (segmentId: any, segmentsInfo: any): any => {
            let i = 0, isFound = false;
            const info = { departure: null, arrival: null };
            while (i < segmentsInfo.length && !isFound) {
                if (String(segmentsInfo[i].id) === segmentId) {
                    info.arrival = segmentsInfo[i].arrival.city;
                    info.departure = segmentsInfo[i].departure.city;
                    isFound = true;
                }
                i++;
            }
            return info;
        };


        const searchPassenger = (passengersPriority: any, idPassenger: any): any => {
            let i, j, index = -1;
            for (i = 0; i < passengersPriority.length; i++) {
                if (passengersPriority[i].id === idPassenger) {
                    passengersPriority[i].trips.push(trip);
                    index = 0;
                }
            }
            return index;
        };

        const putPassengerType = (idPassenger: any, bookingInfo: any): any => {
            let passengerType = '';
            for (let i = 0; i < bookingInfo.passengers.length; i++) {
                if (idPassenger === bookingInfo.passengers[i].passengerId) {
                    passengerType = bookingInfo.passengers[i].passengerType;
                }

            }
            return passengerType;
        };
        const getPriorityInfoPassenger = (id: any): any => {
            const pasInfo: any = {};
            angular.forEach(cachedData.passengers, (pas) => {
                if (pas.passengerId.toString() === id) {
                    pasInfo.name = pas.personalInfo.name;
                    pasInfo.surname = pas.personalInfo.surname;
                    pasInfo.infant = pas.personalInfo.infant;
                }
            });
            return pasInfo;
        };





        segmentsInfo = this.AncillariesTemporalUtilsService.getMmBbookingSegmentInformation();

        checkPassengersSegments(segments);
        createSlicesSegmentsInfo( segments, ancilariesInfoSlices, segmentsInfo);
        angular.forEach(segments, (segment) => {
            for (i = 0; i < segment.passengers.length; i++) {
                trip = { id: null, amount: segment.passengers[i].amount, tripPrice: this.CurrencyService.formatPrice(currency, segment.passengers[i].amount, true, false), checkedTrip: false };
                if (segment.sliceInfo) {
                    trip.sliceInfo = segment.sliceInfo;
                    trip.withSliceInfo = segment.withSliceInfo;
                } else if (segment.onlySliceInfo) {
                    trip.onlySliceInfo = true;
                } else {
                    trip.withSliceInfo = false;
                }
                trip.id = segment.id;
                trip.status = segment.passengers[i].status.code;
                trip.departure = getInfoTrip(segment.id, segmentsInfo).departure;
                trip.arrival = getInfoTrip( segment.id, segmentsInfo).arrival;
                index = searchPassenger(passengersPriority, segment.passengers[i].id);
                if (index === -1) {
                    passenger = {};
                    passenger = { id: segment.passengers[i].id, trips: [], passengerType: putPassengerType(segment.passengers[i].id, bookingInfo) };
                    passenger.info = getPriorityInfoPassenger(passenger.id);
                    passenger.trips.push(trip);
                    passengersPriority.push(passenger);
                }
            }
        });



        return passengersPriority;
    };


    checkFlags = (transformedInfo: any): void => {
        const orderInformation: any = this.CommonsSessionStorageService.get('createOrderData');
        if (orderInformation && orderInformation.orderFlags) {
            orderInformation.orderFlags.forEach((flag) => {
                switch (flag.type) {
                        case BookingAncillariesConstant.FLAGS_KEYS.XL_BANNER:
                            transformedInfo.flags.showBannerConfort = flag.enabled;
                            break;
                        case BookingAncillariesConstant.FLAGS_KEYS.RESIDENT_BAGGAGE:
                            transformedInfo.flags.showBannerResident = flag.enabled;
                            break;
                }
            });
        }
    };

    generatePriorityBoardingInfo = (ancillarie: any, ancilariesInfoSlices: any, cachedData: any, transformedInfo: any): any => {
        const priorityBoarding = {
            currency: ancillarie.currency,
            info: this.generatePriorityOffersInfo(ancillarie.segments, ancilariesInfoSlices, cachedData),
            priceFrom: ancillarie.priceFrom,
            cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancillarie.priceFrom), false, false),
            status: ancillarie.status,
            type: ancillarie.type,
            name: BookingAncillariesConstant.PRIORITY_BOARDING.NAME,
            cardCols: BookingAncillariesConstant.PRIORITY_BOARDING.CARDCOLS,
            cardType: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTYPE,
            cardImg: BookingAncillariesConstant.PRIORITY_BOARDING.CARDIMG,
            cardTitle: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTITLE,
            cardText: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTEXT,
            cardSubtext: BookingAncillariesConstant.PRIORITY_BOARDING.CARDSUBTEXT,
            cardSubtextSelect: BookingAncillariesConstant.PRIORITY_BOARDING.CARDSUBTEXTSELECT,
            cardButton: BookingAncillariesConstant.PRIORITY_BOARDING.CARDBUTTON,
            confirmed: false,
            selectedPriorityBoarding: null,
            modal: BookingAncillariesConstant.PRIORITY_BOARDING.MODAL,
            datalayer: BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING_OPEN
        };
        return priorityBoarding;
    };

    generatePetInfo = (ancillaryInfo: any): BookingAncillariesModel.AncillaryBoxModel => {
        const priceFrom: number = ancillaryInfo.slices
            .flatMap((slice: any) => slice.passengers)
            .flatMap((passenger: any) => passenger.pets)
            .reduce((minAmount: number, pet: any) => 
                Math.min(minAmount, pet.amount), 
            Infinity);
        
        const petcSummary: PetSummaryBox[] = this.CommonsSessionStorageService.get('petcSummary');
        const modifyButton: boolean = petcSummary?.length > 0;

        const pet: BookingAncillariesModel.AncillaryBoxModel = {
            type: ancillaryInfo.type,
            modal: BookingAncillariesConstant.TYPE_ANCILLARIE.PET,
            textModels: {
                title:  this.$filter('translate')('PETC_IN_CABIN'),
                subtitle:  this.$filter('translate')('CKIANC_INSURANCE_FROM'),
                bulletPoints: [
                    this.$filter('translate')('PET_CONFORT_TRAVEL'),
                    this.$filter('translate')('PETC_LIMITED_SPACES')
                ],
                imgPath: '/pets/pets-icon.svg'
            },
            priceFrom: priceFrom,
            currency: ancillaryInfo.currency,
            modifyButton: modifyButton,
            status: ancillaryInfo.status
        };
        return pet;
    };

    generateAssistCardInfo = (ancillaryInfo: any): BookingAncillariesModel.AncillaryBoxModel => {

        const summaryInfo: any = this.CommonsSessionStorageService.get('summaryInfo');
        const modifyButton: boolean = summaryInfo.pendingPaymentItems?.some(item => item.type === BookingAncillariesConstant.TYPE_ANCILLARIE.ASSIST_CARD);


        const assistCardModule: BookingAncillariesModel.AncillaryBoxModel = {
            type: ancillaryInfo.type,
            modal: BookingAncillariesConstant.TYPE_ANCILLARIE.ASSIST_CARD,
            textModels: {
                title:  this.$filter('translate')('ANCILLARIES_ASSIST_CARD_BOX_TITLE'),
                subtitle:  '',
                bulletPoints: [
                    this.$filter('translate')('ANCILLARIES_ASSIST_CARD_BOX_TEXT_1'),
                    this.$filter('translate')('ANCILLARIES_ASSIST_CARD_BOX_TEXT_2')
                ],
                imgPath: '/assist_card/assist_card_box.svg'
            },
            avoidPrice: true,
            modifyButton: modifyButton,
            status: ancillaryInfo.status
        };
        return assistCardModule;
    };

    ////////////////
    generateInfoCommon = (ancillariesInfo: any, cachedData: any): any => {
        let ancilleriesBaggageInfo, i, preorderInfo;
        const ancilariesInfoSlices = ancillariesInfo.slices;
        const flowApp = this.CommonsSessionStorageService.get('flowApp');

        const transformedInfo: any = {
            ancillariesAvailable: [],
            currency: null,
            isCurrencyLong: false,
            pendingSeats: false,
            isPaFlow: false,
            upgradingInfo: null,
            baggageAvailable: false,
            passengerBaggagesTrips: [],
            baggageAvailablePrice: {
                priceFrom: ''
            },
            flexibilizationInfo: {},
            flags: {
                showBannerConfort: false,
                showBannerResident: false
            },
            preorderAncillarieInfo: {},
            priorityBoardingInfo: {},
            baggagesQuanty: 0
        };

        transformedInfo.currency = this.CommonsSessionStorageService.get('currency');
        transformedInfo.isCurrencyLong = this.AncillariesTemporalUtilsService.isCurrencyLong(transformedInfo.currency.code);
        angular.forEach(ancillariesInfo.ancillaries, (ancillarie) => {
            switch (ancillarie.type) {
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE:
                        ancilleriesBaggageInfo = ancillarie;
                        transformedInfo.baggageAvailable = ancilleriesBaggageInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                        if (transformedInfo.baggageAvailable) {
                            transformedInfo.ancillariesAvailable.push(ancilleriesBaggageInfo.type);
                            transformedInfo.baggageAvailablePrice.priceFrom = this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancilleriesBaggageInfo.priceFrom), false, false);
                        }
                        break;
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY:
                        if (ancillarie.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.flexibilizationInfo = this.generateFlexibilizationInfo(ancillarie, transformedInfo);
                            for (i = 0; i < transformedInfo.flexibilizationInfo.info.length; i++) {
                                if (transformedInfo.flexibilizationInfo.info[i].subtype === 'VOUCHER_REFUND') {
                                    if (transformedInfo.flexibilizationInfo.info[i].percentage >= 100) {
                                        transformedInfo.flexibilizationInfo.info[i].description = '';
                                        transformedInfo.flexibilizationInfo.info[i].description = this.$filter('translate')('ANCILLARIES_VOUCHER_REFUND_MODAL_TITLE');
                                        this.$rootScope.$broadcast('isTotalRefund', true);
                                    }
                                }
                            }
                        }
                        break;
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.PREORDER:
                        preorderInfo = ancillarie;
                        if (preorderInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(preorderInfo.type);
                            transformedInfo.preorderAncillarieInfo = this.generatePreorderInfo(preorderInfo, transformedInfo);
                        }
                        break;
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.PRIORITY_BOARDING:
                        if (ancillarie.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.priorityBoardingInfo = this.generatePriorityBoardingInfo(ancillarie, ancilariesInfoSlices, cachedData, transformedInfo);
                        }
                        break;
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.PET:
                        if (ancillarie.status.code !== BookingAncillariesConstant.STATUS.NOT_AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.pet = this.generatePetInfo(ancillarie);
                        }
                        break;
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.ASSIST_CARD:
                        if (ancillarie.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                            transformedInfo.ancillariesAvailable.push(ancillarie.type);
                            transformedInfo.assistCard = this.generateAssistCardInfo(ancillarie);
                        }
                        break;    
            }
        });

        if (transformedInfo.baggageAvailable) {
            if (this.CommonsSessionStorageService.get('passengerBaggagesTrips')) {
                transformedInfo.passengerBaggagesTrips = this.CommonsSessionStorageService.get('passengerBaggagesTrips');
            } else {
                transformedInfo.passengerBaggagesTrips = this.generateBaggageSpeqsHaveInfo(this.generateBaggageTripsInformation(ancillariesInfo.slices, ancilleriesBaggageInfo.slices, cachedData), BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE);
            }
            transformedInfo.baggagesQuanty = this.countBaggageTotal(transformedInfo.passengerBaggagesTrips);
        }
        transformedInfo.passengerData = cachedData.passengers;


        transformedInfo.pendingSeats = this.AncillariesTemporalUtilsService.checkEarlySegments();
        transformedInfo.upgradingInfo = this.AncillariesTemporalUtilsService.getUpgradingInfo(transformedInfo.currency);
        transformedInfo.isPaFlow = this.CommonsSessionStorageService.get('isPaFlow');
        this.checkFlags(transformedInfo);
        return transformedInfo;
    };

    countSpeqsTotal = (passengers: any): any => {
        let count = 0;
        angular.forEach(passengers, (passenger) => {
            angular.forEach(passenger.trips, (trip) => {
                angular.forEach(trip.pieces, (piece) => {
                    count += piece.purchasedPieces;
                    count += piece.quantySelected;
                });
            });
        });
        return count;
    };

    transformAncillariesView = (transfomerFlow: any, ancillariesInfo: any, cachedData: any): any => {

        let ancillariesInsuranceInfo, i, countryInsurance = '';
        let numOfPassenger, pricePerPerson;
        const transformedInfo = {
            ancillariesAvailable: transfomerFlow.ancillariesAvailable ? transfomerFlow.ancillariesAvailable : [],
            ancillariesTrips: transfomerFlow.ancillariesTrips ? transfomerFlow.ancillariesTrips : [],
            ancillariesInsurance: [],
            insuranceInfo: { countriesList: [], insuranceCountry: null, id: null, price: null, priceZero: null, originalPrice: null, passengers: cachedData.passengers, conditionsUri: '', isModalLoading: false, countryInsurance: '', insurancePatterns: {}, consent: '', issueCountry: null, oldInsuranceCountry: null },
            seatsAvailable: {
                status: false,
                priceFrom: 0,
                statusCode: null
            },
            insuranceAvailable: false,
            insuranceAllianzFusionAvailable: false,
            bobAvailable: false,
            bobInfo: { slices: [], priceFrom: '', additionalBagsPrice: '' },
            currency: <any>this.CommonsSessionStorageService.get('currency'),
            ancillariesSpeqs: [],
            speqsAvailablePrice: {
                priceFrom: ''
            },
            speqsQuanty: 0,
            ancillariesCarbonFootprint: null,
            ancillariesTransfersGlobick: null
        };

        const getInsuranceDescription = (coverages: any): any => {
            let coveragesIndex;
            const descriptionCoverages = [];
            for (coveragesIndex = 0; coveragesIndex < coverages.length; coveragesIndex++) {
                descriptionCoverages.push({ title: coverages[coveragesIndex].title, description: coverages[coveragesIndex].description });
            }
            return descriptionCoverages;
        };

        const getNumPassengerByInsurance = (passengers: any): any => {
            let totalNumPassengerByInsurance = 0, passengersInfo;
            angular.forEach(passengers, (passenger, key) => {
                if (passenger.type !== 'INF') {
                    totalNumPassengerByInsurance = totalNumPassengerByInsurance + 1;
                }
            });
            if (totalNumPassengerByInsurance === 0) {
                return 1; //Avoid division by zero
            }
            return totalNumPassengerByInsurance;
        };

        const checkTypeUser = (slices: any): any => {
            const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
            const specialUser = [];
            let specialValue;
            if (bookingInfo) {
                angular.forEach(bookingInfo.passengers, (passenger) => {
                    specialValue = null;
                    specialValue = BookingAncillariesConstant.BOB_FREE_TYPES.filter((type) => {
                        return passenger.frequentFlyer !== null &&
                            type === passenger.frequentFlyer.topTier;
                    });
                    if (specialValue.length > 0) {
                        specialUser.push(passenger.frequentFlyer);
                    }
                });
                if (specialUser.length > 0) {
                    this.CommonsSessionStorageService.set('frequentFlyerBOB', specialUser[0]);
                    angular.forEach(slices, (slice) => {
                        angular.forEach(slice.products, (product) => {
                            product.additionalBagsPrice = 0;
                            product.price = 0;
                        });
                    });
                }
            }
            return slices;
        };

        const addSegmentSeatAvailable = (info: any): any => {
            const ids = [];
            angular.forEach(info.segments, (segment) => {
                const availableSegment = segment.status.code === BookingAncillariesConstant.STATUS.AVAILABLE || segment.status.code === BookingAncillariesConstant.STATUS.AVAILABLE_WITH_WARNING;
                if (availableSegment) {
                    ids.push(segment.id);
                }
            });
            this.CommonsSessionStorageService.set('seatsAvailableSegments', ids);
        };

        const createComplianceModel = (index: any): any => {
            if (ancillariesInfo.ancillaries[index].offers && ancillariesInfo.ancillaries[index].offers[0] && ancillariesInfo.ancillaries[index].offers[0].compliance) {
                const infoModal = ancillariesInfo.ancillaries[index].offers[0].compliance.informativeMessage.split('<br />');
                infoModal[2] = infoModal[2].replace('</p>', '');
                infoModal[0] = infoModal[0].replace('<p><strong>', '');
                infoModal[0] = infoModal[0].replace('</strong>', '');
                ancillariesInfo.ancillaries[index].offers[0].compliance.informativeMessage = infoModal;
                const insuranceTax = ancillariesInfo.ancillaries[index].offers[0].compliance.premiumSplitProvision.split('<br />');
                insuranceTax[0] = insuranceTax[0].replace('<p>', '');
                insuranceTax[1] = insuranceTax[1].replace('-', '');
                insuranceTax[2] = insuranceTax[2].replace('-', '');
                insuranceTax[2] = insuranceTax[2].replace('&nbsp;</p>', '');
                ancillariesInfo.ancillaries[index].offers[0].compliance.premiumSplitProvision = insuranceTax;
            }

        };

        /**
              * Return passenger speqs trips information
              * @param {Array} ancillariesTrips
              * @param {Object} cachedData
              */
        const generateSpeqsTripsInformation = (ancillariesSlices: any, ancillariesTrips: any, cachedData: any): any => {
            const passengersSpeqs = [];
            const segmentsInfo = this.AncillariesTemporalUtilsService.getBookingSegmentInformation();

            const speqTitle = (speqInfo: any): string => {
                let speqDescription = '';
                switch (speqInfo.subtype) {
                        case 'BICYCLE':
                            speqDescription = this.$filter('translate')('SPEQS_BICYCLE');
                            break;
                        case 'SURFBOARD':
                            speqDescription = this.$filter('translate')('SPEQS_SURFBOARD_TITLE');
                            break;
                        case 'SKI_SNOW':
                            speqDescription = this.$filter('translate')('SPEQS_SKI_SNOW');
                            break;
                        case 'GOLF_EQUIPMENT':
                            speqDescription = this.$filter('translate')('SPEQS_GOLF_EQUIPMENT');
                            break;
                        case 'FISHING_EQUIPMENT':
                            speqDescription = this.$filter('translate')('SPEQS_FISHING_TITLE');
                            break;
                        case 'SCUBA_DIVING':
                            speqDescription = this.$filter('translate')('SPEQS_SCUBA_TITLE');
                            break;
                }
                return speqDescription;
            };

            const getPiecePriceFormmated = (trip: any): any => {
                let i, k;
                for (i = 0; i < trip.pieces.length; i++) {
                    for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                        trip.pieces[i].availablePriceRanges[k].amountPrice = this.CurrencyService.formatPrice(transformedInfo.currency, trip.pieces[i].availablePriceRanges[k].amount, false, false, true);
                    }
                }
            };

            const getInfoPassenger = (id: any): any => {
                const pasInfo: any = {};

                angular.forEach(cachedData.passengers, (pas) => {
                    switch (this.CommonsSessionStorageService.get('flowApp')) {
                            case BookingAncillariesConstant.APPLICATION_FLOW.BBOOKING:
                                if (pas.passengerId.toString() === id) {
                                    pasInfo.name = pas.personalInfo.name;
                                    pasInfo.surname = pas.personalInfo.surname;
                                    pasInfo.infant = pas.personalInfo.infant;
                                }
                                break;
                            default:
                                if (pas.id.toString() === id) {
                                    pasInfo.name = pas.name;
                                    pasInfo.surname = pas.surname;
                                    pasInfo.infant = pas.infant;
                                }
                                break;
                    }
                });

                return pasInfo;
            };

            for (let i = 0; i < ancillariesTrips.length; i++) {
                if (ancillariesTrips[i].status.code === BookingAncillariesConstant.GENERAL_STATUS.AVAILABLE) {
                    angular.forEach(ancillariesTrips[i].passengers, (passengerTrip) => {
                        if (passengerTrip.maxAdditionalPieces > 0) {
                            let isFound = false;
                            const passenger = {
                                id: passengerTrip.id,
                                trips: [],
                                info: getInfoPassenger(passengerTrip.id)
                            };
                            const trip: any = {
                                id: ancillariesTrips[i].id,
                                pieces: [],
                                maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
                                speqsChoosed: 0,
                                totalPrice: 0
                            };

                            angular.forEach(ancillariesSlices, (slice) => {
                                if (slice.id === ancillariesTrips[i].id) {
                                    if (slice.segmentIds.length > 1) {
                                        trip.departure = this.getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                        trip.arrival = this.getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                                    } else {
                                        angular.extend(trip, this.getInfoSegment(slice.segmentIds[0], segmentsInfo));
                                    }
                                }
                            });

                            angular.forEach(passengerTrip.pieces, (pasPieces) => {
                                isFound = false;

                                if (pasPieces.status.code === BookingAncillariesConstant.GENERAL_STATUS.AVAILABLE) {
                                    pasPieces.quantySelected = 0;
                                    pasPieces.description = speqTitle(pasPieces);
                                    trip.pieces.push(pasPieces);
                                }
                            });

                            for (let j = 0; j < passengersSpeqs.length; j++) {
                                if (passenger.id === passengersSpeqs[j].id) {
                                    getPiecePriceFormmated(trip);
                                    passengersSpeqs[j].trips.push(trip);
                                    isFound = true;
                                }
                            }
                            if (!isFound) {
                                getPiecePriceFormmated(trip);
                                passenger.trips.push(trip);
                                passengersSpeqs.push(passenger);
                            }
                        }
                    });
                }
            }


            return passengersSpeqs;
        };

        const getMinPriceSeat = (segments: any): any => {
            const listPrice = [];
            let price = null;
            angular.forEach(segments, (segment) => {
                angular.forEach(segment.passengers, (pas) => {
                    if (pas.priceFrom !== null && pas.priceFrom >= 0) {
                        listPrice.push(pas.priceFrom);
                    }
                });
            });

            if (listPrice.length > 0) {
                price = listPrice.sort((a, b) => {
                    return a - b;
                });
                price = this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(price[0]), false, false);
            }
            return price;
        };
        for (let i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT) {
                const ancillariesSeatInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.seatsAvailable.status = ancillariesSeatInfo.status.code !== BookingAncillariesConstant.STATUS.NOT_AVAILABLE;
                if (transformedInfo.seatsAvailable.status) {
                    transformedInfo.seatsAvailable.statusCode = ancillariesSeatInfo.status;
                    transformedInfo.ancillariesAvailable.push(ancillariesSeatInfo.type);
                    addSegmentSeatAvailable(ancillariesSeatInfo);
                    transformedInfo.seatsAvailable.priceFrom = getMinPriceSeat(ancillariesSeatInfo.segments);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INTEGRATED_BOB) {
                const ancillariesBobInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.bobAvailable = ancillariesBobInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.bobAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesBobInfo.type);
                    transformedInfo.bobInfo.slices = checkTypeUser(ancillariesBobInfo.slices);
                    const currency = this.CurrencyService.getCurrencyObject(transformedInfo.bobInfo.slices[0].products[0].currency);
                    transformedInfo.bobInfo.slices[0].products[0].currency = currency;
                    transformedInfo.bobInfo.priceFrom = this.CurrencyService.formatPrice(currency, Math.floor(transformedInfo.bobInfo.slices[0].products[0].price), false, false);
                    transformedInfo.bobInfo.additionalBagsPrice = this.CurrencyService.formatPrice(currency, Math.floor(transformedInfo.bobInfo.slices[0].products[0].additionalBagsPrice), false, false);
                    this.CommonsSessionStorageService.set('bobInfo', transformedInfo.bobInfo);

                    const trackingCode = `${this.$rootScope.appLang}/${this.$rootScope.appMarket}/${this.CommonsSessionStorageService.get('actualStepFlow')}`;
                    this.DatalayerUtilsService.updateDatalayerEvents(BookingAncillariesConstant.DATALAYER_INFO.MODULE_BOB, trackingCode, BookingAncillariesConstant.DATALAYER_INFO.IMPRESSION + (Math.floor(transformedInfo.bobInfo.slices[0].products[0].price) < 1 ? BookingAncillariesConstant.DATALAYER_INFO.FREE : BookingAncillariesConstant.DATALAYER_INFO.PAYMENT), BookingAncillariesConstant.DATALAYER_INFO.INTERACCION);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE) {
                ancillariesInsuranceInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.insuranceAvailable = ancillariesInsuranceInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.insuranceAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInsuranceInfo.type);
                    transformedInfo.insuranceInfo.countriesList = ancillariesInfo.ancillaries[i].countriesAllowed;
                    transformedInfo.insuranceInfo.priceZero = this.CurrencyService.formatPrice(transformedInfo.currency, 0, true, false);
                    transformedInfo.insuranceInfo.conditionsUri = ancillariesInfo.ancillaries[i].offers[0].termsAndConditionsDocumentURI;
                    transformedInfo.insuranceInfo.id = ancillariesInfo.ancillaries[i].offers[0].code;
                    countryInsurance = ancillariesInfo.ancillaries[i].issueCountry;
                    transformedInfo.insuranceInfo.issueCountry = ancillariesInfo.ancillaries[i].issueCountry;
                    transformedInfo.insuranceInfo.consent = ancillariesInfo.ancillaries[i].offers[0].consent;
                    if (ancillariesInfo.ancillaries[i].offers[0].compliance !== null) {
                        createComplianceModel(i);
                    }
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE_ALLIANZ) {
                ancillariesInsuranceInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.insuranceAllianzFusionAvailable = ancillariesInsuranceInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.insuranceAllianzFusionAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInsuranceInfo.type);
                    transformedInfo.insuranceInfo = ancillariesInfo.ancillaries[i].locations[0];
                    transformedInfo.insuranceInfo.countriesList = [];
                    transformedInfo.insuranceInfo.priceZero = null;
                    transformedInfo.insuranceInfo.conditionsUri = '';
                    transformedInfo.insuranceInfo.id = null;
                    countryInsurance = '';
                    transformedInfo.insuranceInfo.issueCountry = '';
                    transformedInfo.insuranceInfo.consent = '';
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS) {
                const ancillariesSpeqsInfo = ancillariesInfo.ancillaries[i];
                if (ancillariesSpeqsInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesSpeqsInfo.type);
                    if (this.CommonsSessionStorageService.get('passengerSpeqsTrips')) {
                        transformedInfo.ancillariesSpeqs = this.CommonsSessionStorageService.get('passengerSpeqsTrips');
                    } else {
                        transformedInfo.ancillariesSpeqs = this.generateBaggageSpeqsHaveInfo(generateSpeqsTripsInformation(ancillariesInfo.slices, ancillariesSpeqsInfo.slices, cachedData), BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS);
                    }
                    transformedInfo.speqsAvailablePrice.priceFrom = this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(ancillariesSpeqsInfo.priceFrom), false, false);
                    transformedInfo.speqsQuanty = this.countSpeqsTotal(transformedInfo.ancillariesSpeqs);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.CO2_FOOTPRINT) {
                const ancillariesCarbonFootprintInfo = ancillariesInfo.ancillaries[i];
                const summaryInfo: any = this.CommonsSessionStorageService.get('summaryInfo');
                const purchased = summaryInfo &&
                    summaryInfo.issuedItems.some(e => e.type === BookingAncillariesConstant.TYPE_ANCILLARIE.CO2_FOOTPRINT);
                if (ancillariesCarbonFootprintInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE && !purchased) {
                    transformedInfo.ancillariesAvailable.push(ancillariesCarbonFootprintInfo.type);
                    transformedInfo.ancillariesCarbonFootprint = {
                        price: ancillariesCarbonFootprintInfo.price,
                        priceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesCarbonFootprintInfo.price, true, false),
                        priceFrom: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesCarbonFootprintInfo.price, true, false),
                        kilosCo2Equivalent: ancillariesCarbonFootprintInfo.kilosCo2Equivalent,
                        kilosCo2EquivalentFormatted: ancillariesCarbonFootprintInfo.kilosCo2Equivalent ? ancillariesCarbonFootprintInfo.kilosCo2Equivalent.toString().replace('.', ',') : '',
                        confirmed: false
                    };
                    this.CommonsSessionStorageService.set('co2Footprint', transformedInfo.ancillariesCarbonFootprint);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK) {
                const ancillariesTransfersGlobickInfo = ancillariesInfo.ancillaries[i];
                const summaryInfo: any = this.CommonsSessionStorageService.get('summaryInfo');
                const transfer = ancillariesTransfersGlobickInfo.subTypes.find((subtype) => subtype.glbType === 'TRANS');
                const exp = ancillariesTransfersGlobickInfo.subTypes.find((subtype) => subtype.glbType === 'EXP');
                const purchased = summaryInfo &&
                    summaryInfo.issuedItems.some(e => e.type === BookingAncillariesConstant.TYPE_ANCILLARIE.GLOBICK);
                if (ancillariesTransfersGlobickInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE
                    && !purchased && transfer.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesTransfersGlobickInfo.type);
                    transformedInfo.ancillariesTransfersGlobick = {
                        price: ancillariesTransfersGlobickInfo.price,
                        priceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesTransfersGlobickInfo.price, true, false),
                        date: ancillariesTransfersGlobickInfo.date,
                        transferCar: ancillariesTransfersGlobickInfo.transferCar,
                        confirmed: false
                    };
                    this.CommonsSessionStorageService.set('globickTransfers', transformedInfo.ancillariesTransfersGlobick);
                }
                if (exp) {
                    this.CommonsSessionStorageService.set('isGlobickActivities', true);
                }
            }
        }



        if (transformedInfo.insuranceAvailable) {
            for (let i = 0; i < ancillariesInsuranceInfo.offers.length; i++) {
                numOfPassenger = getNumPassengerByInsurance(cachedData.passengers);
                pricePerPerson = ancillariesInsuranceInfo.offers[i].premium / numOfPassenger;
                transformedInfo.ancillariesInsurance.push({
                    provider: ancillariesInsuranceInfo.provider,
                    offer: ancillariesInsuranceInfo.offerId,
                    id: ancillariesInsuranceInfo.offers[i].code,
                    name: ancillariesInsuranceInfo.offers[i].name,
                    originalPrice: ancillariesInsuranceInfo.offers[i].premium,
                    price: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesInsuranceInfo.offers[i].premium, true, false),
                    originalPricePerPerson: pricePerPerson,
                    pricePerPerson: this.CurrencyService.formatPrice(transformedInfo.currency, pricePerPerson, true, false),
                    passengerInfo: cachedData.passengers,
                    termsAndConditionsDocumentURI: ancillariesInsuranceInfo.offers[i].termsAndConditionsDocumentURI,
                    descriptionCoverages: getInsuranceDescription(ancillariesInsuranceInfo.offers[i].coverages),
                    addOns: ancillariesInsuranceInfo.offers[i].addOns,
                    consent: ancillariesInsuranceInfo.offers[i].consent,
                    compliance: ancillariesInsuranceInfo.offers[i].compliance,
                    issueCountry: ancillariesInsuranceInfo.issueCountry
                });
            }
        }

        if (transformedInfo.ancillariesInsurance.length > 0) {
            transformedInfo.insuranceInfo.price = transformedInfo.ancillariesInsurance[0].price;
            transformedInfo.insuranceInfo.originalPrice = transformedInfo.ancillariesInsurance[0].originalPrice;
        }

        if (transformedInfo.insuranceInfo.countriesList.length > 1) {
            angular.forEach(transformedInfo.insuranceInfo.countriesList, (country) => {
                if (country.country.code === countryInsurance) {
                    transformedInfo.insuranceInfo.insuranceCountry = country;
                    transformedInfo.insuranceInfo.oldInsuranceCountry = country;
                    transformedInfo.insuranceInfo.countryInsurance = country.country.description;
                }
                if (country.passengerRequiredFields.length > 0) {
                    angular.forEach(country.passengerRequiredFields, (field) => {
                        angular.forEach(field.requiredFieldsGroups, (reqFieldGroup) => {
                            angular.forEach(reqFieldGroup.requiredFields, (reqField) => {
                                if (reqField.requiredField === BookingAncillariesConstant.PASSENGERFIELDS.DOCUMENT_ID) {
                                    transformedInfo.insuranceInfo.insurancePatterns[country.country.code] = reqField.pattern;
                                }
                            });
                        });
                    });
                }
            });
        }

        if (transformedInfo.insuranceInfo.insuranceCountry === null && transformedInfo.insuranceInfo.countriesList.length > 0) {
            transformedInfo.insuranceInfo.insuranceCountry = transformedInfo.insuranceInfo.countriesList[0];
            transformedInfo.insuranceInfo.oldInsuranceCountry = transformedInfo.insuranceInfo.countriesList[0];
            transformedInfo.insuranceInfo.countryInsurance = transformedInfo.insuranceInfo.countriesList[0].country.description;
        }

        if (transformedInfo.ancillariesAvailable.length >= 1) {
            this.CommonsSessionStorageService.set('ancillariesSlices', ancillariesInfo.slices);
        }

        return angular.extend(transformedInfo, transfomerFlow);




    };


    /**
        *
        * @param {*} passengerId
        * @param {*} segmentId
        * @param {*} seat
        */
    updateCachedInformation = (passengerId: any, segmentId: any, seat: any): any => {
        const cachedInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        let j = 0, l, pasFound = false;
        while (!pasFound && j < cachedInfo.outwardSegments.length) {
            if (segmentId === cachedInfo.outwardSegments[j].id) {
                l = 0;
                while (!pasFound && l < cachedInfo.outwardSegments[j].passengers.length) {
                    if (passengerId === cachedInfo.outwardSegments[j].passengers[l].id) {
                        pasFound = true;
                        cachedInfo.outwardSegments[j].passengers[l].seat.row = seat.row;
                        cachedInfo.outwardSegments[j].passengers[l].seat.column = seat.column;
                    }
                    l++;
                }
            }
            j++;
        }
        j = 0;
        while (!pasFound && j < cachedInfo.returnSegments.length) {
            if (segmentId === cachedInfo.returnSegments[j].id) {
                l = 0;
                while (!pasFound && l < cachedInfo.returnSegments[j].passengers.length) {
                    if (passengerId === cachedInfo.returnSegments[j].passengers[l].id) {
                        pasFound = true;
                        cachedInfo.returnSegments[j].passengers[l].seat.row = seat.row;
                        cachedInfo.returnSegments[j].passengers[l].seat.column = seat.column;
                    }
                    l++;
                }
            }
            j++;
        }
        this.CommonsSessionStorageService.set('bookingInfo', cachedInfo);
    };

    /**
     * Update ancillaries information of passenger and save in localStorage
     * @param {Integer} passengerId LAYQL8
     * @param {Integer} segmentId
     */
    updateAncillariesInformation = (passengerId: any, segmentId: any): any => {
        let i = 0, k, pasFound = false;
        const ancillariesSeatInfo: any = this.CommonsSessionStorageService.get('ancillariesSeatInfo') || [];
        while (!pasFound && i < ancillariesSeatInfo.length) {
            if (ancillariesSeatInfo[i].id === parseInt(segmentId)) {
                k = 0;
                while (!pasFound && k < ancillariesSeatInfo[i].passengers.length) {
                    if (parseInt(passengerId) === ancillariesSeatInfo[i].passengers[k].id) {
                        pasFound = true;
                        ancillariesSeatInfo[i].passengers.splice(k, 1);
                        if (ancillariesSeatInfo[i].passengers.length === 0) {
                            ancillariesSeatInfo.splice(i, 1);
                        }
                        this.CommonsSessionStorageService.set('ancillariesSeatInfo', ancillariesSeatInfo);
                    }
                    k++;
                }
            }
            i++;
        }
    };

    /**
       *
       * @param {Object} data
       */
    transformDeleteResponse = (data: any): any => {
        const transformedDelete: any = {};
        if (data.failedToDelete && data.failedToDelete.length > 0) {
            transformedDelete.error = {
                message: data.failedToDelete[0].segments[0].error.description,
                internalErrorCode: data.failedToDelete[0].segments[0].error.code
            };
        } else if (data.ancillaries && data.ancillaries.length > 0) {
            transformedDelete.data = {
                row: data.ancillaries[0].segments[0].passengers[0].seat.row,
                column: data.ancillaries[0].segments[0].passengers[0].seat.column
            };
            this.updateCachedInformation(data.ancillaries[0].segments[0].passengers[0].id, data.ancillaries[0].segments[0].id, transformedDelete.data);
            this.updateAncillariesInformation(data.ancillaries[0].segments[0].passengers[0].id, data.ancillaries[0].segments[0].id);
        }
        return transformedDelete;
    };

    /**
        * Update ancillarie information of passengers in localStorage
        * @param {Object} transformedInfo
        * @param {Object} ancillariesLocalInfo
        */

    transformFromLocalStorage = (transformedInfo: any, ancillariesLocalInfo: any): any => {
        updateBaggagesPassenger(transformedInfo, ancillariesLocalInfo);
        return transformedInfo;

        function updateBaggagesPassenger (transformedInfo, ancillariesLocalInfo) {
            for (let i = 0; i < transformedInfo.ancillariesTrips.length; i++) {
                if (transformedInfo.ancillariesTrips[i].baggages) {
                    for (let j = 0; j < transformedInfo.ancillariesTrips[i].baggages.passengersBaggage.length; j++) {
                        const passengerInfo = getLocalPassengerInformation(ancillariesLocalInfo, transformedInfo.ancillariesTrips[i].id,
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].id);
                        if (passengerInfo !== null) {
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].baggageChoosed = passengerInfo.baggageChoosed;
                            transformedInfo.ancillariesTrips[i].baggages.passengersBaggage[j].totalBaggage += passengerInfo.baggageChoosed.quantity;
                            transformedInfo.ancillariesTrips[i].baggages.totalBaggages += passengerInfo.baggageChoosed.quantity;
                            transformedInfo.ancillariesTrips[i].baggages.numExtraBaggages += passengerInfo.baggageChoosed.quantity;
                        }
                    }
                }
            }

            function getLocalPassengerInformation (ancillariesLocalInfo, tripId, passengerId) {
                let pasInfo = null, i = 0, j, found = false;
                while (!found && i < ancillariesLocalInfo.ancillariesTrips.length) {
                    if (ancillariesLocalInfo.ancillariesTrips[i].id === tripId) {
                        j = 0;
                        while (!found && j < ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage.length) {
                            if (ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage[j].id === passengerId) {
                                found = true;
                                pasInfo = ancillariesLocalInfo.ancillariesTrips[i].baggages.passengersBaggage[j];
                            }
                            j++;
                        }
                    }
                    i++;
                }
                return pasInfo;
            }
        }
    };

    buildDeleteAllAncillariesBaggageRequest = (model: any, typeAncillarie: any, passengerBaggagesTrips: any): any => {
        let ancillariesData: any = {}, cont = 0;
        const deleteRequest = [];
        angular.forEach(model.trips, (data) => {
            ancillariesData = {
                type: typeAncillarie,
                slices: [{
                    id: data.id,
                    passengers: [{
                        subtypes: []
                    }]
                }]
            };
            angular.forEach(data.pieces, (piece) => {
                if (piece.quantySelected > 0) {
                    ancillariesData.slices[0].passengers[0].subtypes.push(piece.subtype);
                }
            });
            if (ancillariesData.slices[0].passengers[0].subtypes.length > 0) {
                deleteRequest.push(ancillariesData);
            }
        });
        angular.forEach(passengerBaggagesTrips, (data) => {
            angular.forEach(data.trips, (trip) => {
                angular.forEach(trip.pieces, (piece) => {
                    if (piece.quantySelected > 0) {
                        angular.forEach(deleteRequest, (delReq) => {
                            if (piece.quantySelected > 0) {
                                delReq.slices[0].passengers[0].id = model.id;
                            }
                        });
                    }
                });
                cont++;
            });
        });
        return deleteRequest;
    };

    mergePassengerItemsForDelete = (deleteInfo: any): any => {
        let cont = 0, deleteInfoReturn, skip;
        if (deleteInfo[0].length >= deleteInfo[1].length) {
            deleteInfoReturn = deleteInfo[0];
            skip = 0;
        } else {
            deleteInfoReturn = deleteInfo[1];
            skip = 1;
        }
        angular.forEach(deleteInfo, (data) => {
            if (cont !== skip) {
                angular.forEach(deleteInfoReturn, (deleteRetunr, index) => {
                    if (data[index] && deleteRetunr.slices[0].id === data[index].slices[0].id) {
                        deleteRetunr.slices[0].passengers.push(data[index].slices[0].passengers[0]);
                    }
                });
            }
            cont++;
        });
        return deleteInfoReturn;
    };

    buildDeleteOneAncillariesBaggageRequest = (model: any, typeAncillarie: any, baggageTypeSelected: any, segmentId: any, passengerBaggagesTrips: any): any => {
        let ancillariesData: any = {}, passengerIdTemp = null, passengerTemp = null, check = false;
        const deleteRequest = [];
        angular.forEach(model.trips, (data) => {
            if (data.id === segmentId) {
                ancillariesData = {
                    type: typeAncillarie,
                    slices: [{
                        id: segmentId,
                        passengers: [{
                            subtypes: []
                        }]
                    }]
                };
                ancillariesData.slices[0].passengers[0].subtypes.push(baggageTypeSelected);
                if (ancillariesData.slices[0].passengers[0].subtypes.length > 0) {
                    deleteRequest.push(ancillariesData);
                }
            }
        });
        angular.forEach(passengerBaggagesTrips, (data) => {
            passengerIdTemp = data.id;
            angular.forEach(data.trips, (trip) => {
                if (trip.id === segmentId) {
                    angular.forEach(trip.pieces, (piece) => {
                        if (piece.subtype === baggageTypeSelected && piece.quantySelected > 0) {
                            if (!check) {
                                deleteRequest[0].slices[0].passengers[0].id = passengerIdTemp;
                                check = true;
                            } else {
                                passengerTemp = {... deleteRequest[0].slices[0].passengers[0]};
                                passengerTemp.id = passengerIdTemp;
                                deleteRequest[0].slices[0].passengers.push(passengerTemp);
                            }
                        }
                    });
                }
            });
        });
        return deleteRequest;
    };

    /**
        * Builds the delete ancillaries request to deleta a trip baggage
        * @param {Integer} index the trip index to be deleted
        * @param {Object} model the current model page state
        */
    buildDeleteAncillariesBaggageRequest = (index: any, model: any): any => {
        let j, pasLength, ancillariesData: any = {};
        const deleteRequest = [];
        if (index >= 0 && index < model.ancillariesTrips.length) {
            ancillariesData = {
                type: 'BAGGAGE',
                trips: [{ id: model.ancillariesTrips[index].id, passengers: [] }]
            };
            for (j = 0, pasLength = model.ancillariesTrips[index].baggages.passengersBaggage.length; j < pasLength; j++) {
                if (model.ancillariesTrips[index].baggages.passengersBaggage[j].totalBaggage > 0) {
                    ancillariesData.trips[0].passengers.push(model.ancillariesTrips[index].baggages.passengersBaggage[j].id);
                }
            }
            deleteRequest.push(ancillariesData);
        }
        return deleteRequest;
    };

    /**
      * Update Insurance from localStorage
      * @param {Object} transformedInfo Information of ancillaries for update with new insurance
      */
    updateInsuranceSelected = (transformedInfo: any): any => {
        const insuranceSelected: any = this.CommonsSessionStorageService.get('insuranceSelected');
        if (insuranceSelected) {
            transformedInfo.insuranceInfo = insuranceSelected;
            transformedInfo.ancillariesInsurance[0].id = insuranceSelected.id;
            transformedInfo.ancillariesInsurance[0].originalPrice = insuranceSelected.originalPrice;
            transformedInfo.ancillariesInsurance[0].price = insuranceSelected.price;
            transformedInfo.ancillariesInsurance[0].termsAndConditionsDocumentURI = insuranceSelected.conditionsUri;
        }

        return transformedInfo;
    };

    /**
        * Return quantry of baggages selected
        * @param {Array} passengerTrips List of trips
        */
    calculateTotalBaggages = (passengerTrips: any): any => {
        let counter = 0;
        angular.forEach(passengerTrips, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                counter += trip.piecesChoosed;
            });
        });

        return counter;
    };

    /**
      * Return quantry of speqs selected
      * @param {Array} passengerTrips List of trips
      */
    calculateTotalSpeqs = (passengerTrips: any): any => {
        let counter = 0;
        angular.forEach(passengerTrips, (pas) => {
            angular.forEach(pas.trips, (trip) => {
                counter += trip.speqsChoosed;
            });
        });

        return counter;
    };


    /**
     *
     * @param {Object} seats
     */
    calculateTotalSeats = (segments): any => {
        let counterSeats = 0;
        angular.forEach(segments, (segment) => {
            angular.forEach(segment.passengers, (pas) => {
                if (pas.currentSeat?.row !== pas.initialSeat?.row || pas.currentSeat?.column !== pas.initialSeat?.column) {
                    counterSeats++;
                }
            });
        });
        return counterSeats;
    };

    countSeatsTotal = (orderItems: any): any => {
        let count = 0;
        angular.forEach(orderItems, (passenger) => {
            angular.forEach(passenger.trips, (trip) => {
                angular.forEach(trip.pieces, (piece) => {
                    count += piece.purchasedPieces;
                });
            });
        });
        return count;
    };

    /**
      * Update seats information of passenger returned by service when delete seat of passenger.
      * @param {*} trips Ancillaries trips
      * @param {*} seats Seats returned by service for update
      */
    updateSeatInformation = (passengerTrips: any, segmentSeats: any): any => {
        angular.forEach(passengerTrips, (trip) => {
            angular.forEach(trip.segments, (segment) => {
                angular.forEach(segmentSeats, (segmentSeat) => {
                    if (segment.id.toString() === segmentSeat.id) {
                        angular.forEach(segment.passengers, (pasTrip) => {
                            angular.forEach(segmentSeat.passengers, (pasUpdated) => {
                                if (pasTrip.id.toString() === pasUpdated.id) {
                                    pasTrip.seat = pasUpdated.seat;
                                    pasTrip.hasSeatPrice = false;
                                }
                            });
                        });
                    }
                });
            });
        });
    };

    /**
     * Return array with segments seats update by service
     * @param {Object} seatInfo
     */
    getUpdateSeatInfo = (seatInfo: any): any => {
        const segmentsSeatsInfo = [];
        angular.forEach(seatInfo.seats, (typeSeat) => {
            angular.forEach(typeSeat.segments, (segment) => {
                segmentsSeatsInfo.push({ id: segment.id, passengers: segment.passengers });
            });
        });
        return segmentsSeatsInfo;
    };

    /**
     * Return array with the additional info if is required
     * @param {Object} insurance data of the insurance selected
     */
    hasAdditionalInfo = (insurance: any): any => {
        let i = 0, additionalInfoFound = false, additionalInfo = [];
        if (insurance.passengerInfo) {
            while (!additionalInfoFound && i < insurance.passengerInfo.length) {
                if (insurance.passengerInfo[i].document) {
                    additionalInfoFound = true;
                    additionalInfo = [{
                        passengerId: insurance.passengerInfo[i].passengerId ? insurance.passengerInfo[i].passengerId : insurance.passengerInfo[i].id,
                        policyHolder: true,
                        values: [{ idDoc: insurance.passengerInfo[i].document, type: 'DOCUMENT_ID' }, { birthDate: insurance.passengerInfo[i].birthDate, type: 'BIRTH_DATE' }]
                    }];
                }
                i++;
            }
        }
        return additionalInfo;
    };

    /**
       * Create model of ancillaries summary for show on basket (common header)
       * @param {Object} breakDownInfo Information recovered by ancillaries
       * @param {Array} segmentsInfo List of segments for get information of origin/destination
       * @return {Object} basket
       */
    generateAncillariesHeaderInfo = (breakDownInfo: any, segmentsInfo: any): any => {
        const basket = {
            baggages: [],
            speqs: [],
            seats: [],
            insurance: null,
            upgrading: {
                upgradingTrips: [],
                total: null,
                totalFormatted: null
            },
            currency: null
        };
        const trip: any = {
            segmentId: null,
            cabin: null,
            seats: [],
            origin: null,
            destination: null,
            quanty: 0,
            total: 0,
            totalFormatted: 0
        };

        const getTypeAndDescription = (features: any): any => {
            const seat = { type: null, description: null };

            if (features.indexOf(BookingAncillariesConstant.SeatFeatures.emergencyExit) !== -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.emergencyExit;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.emergencyExit) === -1 && features.indexOf(BookingAncillariesConstant.SeatFeatures.extraSize) !== -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.extraSize;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.emergencyWindow) !== -1 && features.indexOf(BookingAncillariesConstant.SeatFeatures.extraSize) === -1) {
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.infant) !== -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.infant;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.promo) !== -1 && features.indexOf(BookingAncillariesConstant.SeatFeatures.emergencyExit) === -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.promo;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.upfront) !== -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.upfront;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.mobility) !== -1) {
                seat.type = BookingAncillariesConstant.SeatFeatures.mobility;
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.screen) !== -1) {
                seat.type = '';
            } if (features.indexOf(BookingAncillariesConstant.SeatFeatures.nonReclining) !== -1) {
                seat.type = '';
            }

            switch (seat.type) {
                    case BookingAncillariesConstant.SeatFeatures.emergencyExit: seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_EMERGENCY_XL'); break;
                    case BookingAncillariesConstant.SeatFeatures.extraSize: seat.description = this.$filter('translate')('SEATS_EXTRA_SIZE_SEAT'); break;
                    case BookingAncillariesConstant.SeatFeatures.promo: seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_PROMO'); break;
                    case BookingAncillariesConstant.SeatFeatures.infant: seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_INFANT'); break;
                    case BookingAncillariesConstant.SeatFeatures.mobility: seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_HANDICAP'); break;
                    case BookingAncillariesConstant.SeatFeatures.upfront: seat.description = this.$filter('translate')('CKIANCSEATS_SEAT_UPFRONT'); break;
                    default: seat.description = ''; break;
            }

            return seat;
        };

        const addNewSeat = (segment: any, passengerInfo: any): any => {
            let i = 0, isFound = false, seatType: any = {}, seatInfo;
            if (passengerInfo.seat.features.length > 0) {
                seatInfo = getTypeAndDescription(passengerInfo.seat.features);
            } else {
                seatInfo = { type: '', description: '' };
            }

            while (i < segment.seats.length && !isFound) {
                if (segment.seats[i].type === seatInfo.type) {
                    segment.seats[i].passengers.push({ id: passengerInfo.id, amount: passengerInfo.amount });
                    segment.seats[i].quanty++;
                    segment.seats[i].amount += passengerInfo.amount;
                    segment.seats[i].totalFormatted = this.CurrencyService.formatPrice(basket.currency, segment.seats[i].amount, true, false);
                    trip.quanty++;
                    trip.total += passengerInfo.amount;
                    isFound = true;
                }
                i++;
            }

            if (!isFound) {
                seatType = { quanty: 1, passengers: [], amount: 0, totalFormatted: null };
                angular.extend(seatType, seatInfo);
                seatType.amount += passengerInfo.amount;
                seatType.totalFormatted = this.CurrencyService.formatPrice(basket.currency, seatType.amount, true, false);
                seatType.passengers.push({ id: passengerInfo.id, amount: passengerInfo.amount });
                trip.total += seatType.amount;
                trip.quanty++;
                segment.seats.push(seatType);
            }
        };
        const getOriginAndDestination = (trips: any, segmentsInfo: any): any => {
            let i, j, isFound;
            for (i = 0; i < trips.length; i++) {
                j = 0; isFound = false;
                while (!isFound && j < segmentsInfo.length) {
                    if (trips[i].segmentId === segmentsInfo[j].id) {
                        trips[i].origin = segmentsInfo[j].origin;
                        trips[i].destination = segmentsInfo[j].destination;
                        isFound = true;
                    }
                    j++;
                }
            }
        };

        const getCurrencyAncillarie = (summaryCurrencies, ancillarie): any => {
            let i = 0, isFound = false, currency = null;

            while (!isFound || i < summaryCurrencies.length) {
                if (summaryCurrencies[i].code === ancillarie.currency) {
                    currency = summaryCurrencies[i];
                    isFound = true;
                }
                i++;
            }
            return currency;

        };



        if (breakDownInfo.pendingPaymentItems.length > 0) {
            basket.currency = this.CurrencyService.getCurrencyObject(getCurrencyAncillarie(breakDownInfo.currencies, breakDownInfo.pendingPaymentItems[0]));
        }

        for (let i = 0; i < breakDownInfo.pendingPaymentItems.length; i++) {
            switch (breakDownInfo.pendingPaymentItems[i].type) {
                    case BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].segments, (segment) => {
                            trip.segmentId = segment.id;
                            angular.forEach(segment.passengers, (passenger) => {
                                addNewSeat(trip, passenger);
                                trip.quanty += 1;
                            });
                            trip.totalFormatted = this.CurrencyService.formatPrice(basket.currency, trip.total, true, false);
                            basket.seats.push(trip);
                        });
                        getOriginAndDestination(basket.seats, segmentsInfo);

                        break;

                    case BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE:
                        basket.insurance = {
                            offer: breakDownInfo.pendingPaymentItems[i].offer,
                            total: breakDownInfo.pendingPaymentItems[i].total,
                            totalFormatted: this.CurrencyService.formatPrice(basket.currency, breakDownInfo.pendingPaymentItems[i].total, true, false),
                            passengers: 1,
                            type: 'Anulaci?n + Asistencia'
                        };
                        break;

                    case BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].upgrading.offerSegmentsClass, (segment) => {
                            const trip = {
                                segmentId: segment.segmentId,
                                cabin: segment.cabinClass.description,
                                origin: null,
                                destination: null
                            };
                            basket.upgrading.upgradingTrips.push(trip);
                        });
                        basket.upgrading.total = breakDownInfo.pendingPaymentItems[i].total;
                        basket.upgrading.totalFormatted = this.CurrencyService.formatPrice(basket.currency, basket.upgrading.total, true, false);

                        getOriginAndDestination(basket.upgrading.upgradingTrips, segmentsInfo);
                        break;

                    case BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                            let isFound = false;
                            const tripBaggage = { segmentId: slice.id, baggages: [], total: slice.total };

                            angular.forEach(slice.passengers, (passenger) => {
                                angular.forEach(passenger.pieces, (piece) => {
                                    if (tripBaggage.baggages.length > 0) {
                                        for (let j = 0; j < tripBaggage.baggages.length; j++) {
                                            if (tripBaggage.baggages[j].type === piece.subtype) {
                                                tripBaggage.baggages[j].quanty += piece.quantity;
                                                tripBaggage.baggages[j].total += piece.total;
                                                tripBaggage.baggages[j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, tripBaggage.baggages[j].total, true, false);
                                                tripBaggage.baggages[j].passengers.push(passenger.id);
                                                isFound = true;
                                            }
                                        }
                                    }
                                    if (!isFound || tripBaggage.baggages.length < 1) {
                                        tripBaggage.baggages.push({ type: piece.subtype, quanty: piece.quantity, description: piece.description, total: piece.total, totalFormatted: this.CurrencyService.formatPrice(basket.currency, piece.total, true, false), passengers: [passenger.id] });
                                    }
                                });
                            });
                            basket.baggages.push(tripBaggage);
                        });
                        getOriginAndDestination(basket.baggages, segmentsInfo);
                        break;

                    case BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS:
                        angular.forEach(breakDownInfo.pendingPaymentItems[i].slices, (slice) => {
                            let isFound = false;
                            const tripSpeq = { segmentId: slice.id, speqs: [], total: slice.total };

                            angular.forEach(slice.passengers, (passenger) => {
                                angular.forEach(passenger.pieces, (piece) => {
                                    if (tripSpeq.speqs.length > 0) {
                                        for (let j = 0; j < tripSpeq.speqs.length; j++) {
                                            if (tripSpeq.speqs[j].type === piece.subtype) {
                                                tripSpeq.speqs[j].quanty += piece.quantity;
                                                tripSpeq.speqs[j].total += piece.total;
                                                tripSpeq.speqs[j].totalFormatted = this.CurrencyService.formatPrice(basket.currency, tripSpeq.speqs[j].total, true, false);
                                                tripSpeq.speqs[j].passengers.push(passenger.id);
                                                isFound = true;
                                            }
                                        }
                                    }
                                    if (!isFound || tripSpeq.speqs.length < 1) {
                                        tripSpeq.speqs.push({ type: piece.subtype, quanty: piece.quantity, description: piece.description, total: piece.total, totalFormatted: this.CurrencyService.formatPrice(basket.currency, piece.total, true, false), passengers: [passenger.id] });
                                    }
                                });
                            });
                            basket.speqs.push(tripSpeq);
                        });
                        getOriginAndDestination(basket.speqs, segmentsInfo);
                        break;
            }
        }



        return basket;


    };



    /**
       * Build information with ancillaries selected  for send to service
       * @param {Array} passengersBaggages
       * @param {Array} passengersSpeqs
       * @param {Object} passengerInsurance
       */
    buildAncillariesRequest = (passengersBaggages: any, passengersSpeqs: any, passengerInsurance: any): any => {
        const requestAncilaries = [];
        const baggageTrips = {
            slices: [],
            type: BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE
        };
        const sepqTrips = {
            slices: [],
            type: BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS
        };
        let passenger;

        const addBaggage = (trip: any, pas: any, piece: any): any => {
            let isSliceFound = false, isPieceFound = false, isPasFound = false, tripBaggage;
            if (baggageTrips.slices.length < 1) {
                addNewTrip();
            } else {
                angular.forEach(baggageTrips.slices, (sliceBaggage) => {
                    if (sliceBaggage.id === trip.id) {
                        isSliceFound = true;
                        angular.forEach(sliceBaggage.passengers, (pasSlice) => {
                            if (pasSlice.id === pas.id) {
                                isPasFound = true;
                                angular.forEach(pasSlice.subtypes, (pasPiece) => {
                                    if (pasPiece.subtype === piece.subtype) {
                                        isPieceFound = true;
                                        pasPiece.units += piece.quantySelected;
                                    }
                                });
                                if (!isPieceFound) {
                                    pasSlice.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                                }
                            }
                        });
                        if (!isPasFound) {
                            passenger = { id: pas.id, subtypes: [] };
                            passenger.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                            sliceBaggage.passengers.push(passenger);
                        }
                    }

                });
                if (!isSliceFound) {
                    addNewTrip();
                }
            }

            function addNewTrip () {
                tripBaggage = { id: trip.id, passengers: [] };
                passenger = { id: pas.id, subtypes: [] };
                passenger.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                tripBaggage.passengers.push(passenger);
                baggageTrips.slices.push(tripBaggage);
            }
        };

        const addSpeq = (trip: any, pas: any, piece: any): any => {
            let isSliceFound = false, isPieceFound = false, isPasFound = false, tripSpeq;
            if (sepqTrips.slices.length < 1) {
                addNewTrip();
            } else {
                angular.forEach(sepqTrips.slices, (sliceSpeq) => {
                    if (sliceSpeq.id === trip.id) {
                        isSliceFound = true;
                        angular.forEach(sliceSpeq.passengers, (pasSlice) => {
                            if (pasSlice.id === pas.id) {
                                isPasFound = true;
                                angular.forEach(pasSlice.subtypes, (pasPiece) => {
                                    if (pasPiece.subtype === piece.subtype) {
                                        isPieceFound = true;
                                        pasPiece.units += piece.quantySelected;
                                    }
                                });
                                if (!isPieceFound) {
                                    pasSlice.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                                }
                            }
                        });
                        if (!isPasFound) {
                            passenger = { id: pas.id, subtypes: [] };
                            passenger.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                            sliceSpeq.passengers.push(passenger);
                        }
                    }

                });
                if (!isSliceFound) {
                    addNewTrip();
                }
            }

            function addNewTrip () {
                tripSpeq = { id: trip.id, passengers: [] };
                passenger = { id: pas.id, subtypes: [] };
                passenger.subtypes.push({ subtype: piece.subtype, units: piece.quantySelected });
                tripSpeq.passengers.push(passenger);
                sepqTrips.slices.push(tripSpeq);
            }
        };


        const addInsurance = (): any => {
            this.CommonsSessionStorageService.set('selectedInsurance', passengerInsurance);
            this.CommonsSessionStorageService.set('hasSelectedInsurance', true);
            if (!passengerInsurance.type) {
                passengerInsurance = {
                    type: BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE,
                    offer: passengerInsurance.code ? passengerInsurance.code : passengerInsurance.id,
                    addons: [],
                    additionalInfo: this.hasAdditionalInfo(passengerInsurance)
                };
            }
            requestAncilaries.push(passengerInsurance);
        };

        if (passengersBaggages) {
            if (passengersBaggages.length > 0) {
                angular.forEach(passengersBaggages, (pas) => {
                    angular.forEach(pas.trips, (trip) => {
                        if (trip.piecesChoosed > 0) {
                            angular.forEach(trip.pieces, (piece) => {
                                if (piece.quantySelected > 0) {
                                    addBaggage(trip, pas, piece);
                                }
                            });
                        }
                    });
                });
                baggageTrips.slices.length > 0 ? requestAncilaries.push(baggageTrips) : angular.noop;
            }
        }
        if (passengersSpeqs) {
            if (passengersSpeqs.length > 0) {
                angular.forEach(passengersSpeqs, (pas) => {
                    angular.forEach(pas.trips, (trip) => {
                        if (trip.speqsChoosed > 0) {
                            angular.forEach(trip.pieces, (piece) => {
                                if (piece.quantySelected > 0) {
                                    addSpeq(trip, pas, piece);
                                }
                            });
                        }
                    });
                });
                sepqTrips.slices.length > 0 ? requestAncilaries.push(sepqTrips) : angular.noop;
            }
        }
        if (passengerInsurance) {
            addInsurance();
        }

        return requestAncilaries;

    };

    passengerTransformData = (cacheData: any, summaryInfo: any): any => {
        angular.forEach(summaryInfo.context.passengers, (passenger) => {
            angular.forEach(cacheData.passengers, (passengerCache, index) => {
                if (passengerCache.passengerId === passenger.id) {
                    cacheData.passengers[index].personalInfo.infant = passenger.infant;
                    cacheData.passengers[index].resiberId = passenger.resiberId;
                }
            });
        });

        return cacheData;
    };


    /**
     * Return literal text for offerClass type
     * @param {String} offerClass Type cabin offer
     */
    getOfferTitle = (offerClass): any => {
        let title = '';
        switch (offerClass) {
                case 'ECONOMY': title = 'MMB_UPGRADING_BIDS_ECONOMY_CLASS'; break;
                case 'PREMIUM_ECONOMY':
                case 'PREMIUM_TOURIST':
                case 'PREMIUMTOURIST': title = 'MMB_UPGRADING_BIDS_PREMIUM_ECONOMY'; break;
                case 'BUSINESS_PLUS': title = 'MMB_UPGRADING_BIDS_BUSINESS_PLUS'; break;
                case 'BUSINESS_CLUB': title = 'MMB_UPGRADING_BIDS_BUSINESS_CLUB'; break;
                case 'BUSINESS_CLASS':
                case 'BUSINESS_AIR_NOSTRUM':
                case 'BUSINESS_IBERIA_EXPRESS':
                case 'BUSINESS': title = 'MMB_UPGRADING_BIDS_BUSINESS_CLASS'; break;
        }

        return title;
    };

    getImagesByCabin = (cabinType: any, haul: string): any => {
        let listImages = [];
        if (cabinType === 'BUSINESS') {
            switch (haul) {
                    case 'LH':
                        cabinType = 'BUSINESS_PLUS';
                        break;
                    case 'MH':
                        cabinType = 'BUSINESS_CLUB';
                        break;
                    case 'DO':
                        cabinType = 'BUSINESS_CLASS';
                        break;
                    default:
                        cabinType = 'BUSINESS_CLASS';
            }
        }
        switch (cabinType) {
                case 'PREMIUMTOURIST':
                case 'PREMIUM_ECONOMY': listImages = [
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_turista-premium/Carrusel_01.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_turista-premium/Carrusel_02.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_turista-premium/Carrusel_03.png'];
                    break;
                case 'BUSINESS_PLUS': listImages = [
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-plus/Carrusel_01.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-plus/Carrusel_02.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-plus/Carrusel_03.png'];
                    break;
                case 'BUSINESS_CLUB':
                case 'BUSINESS':
                case 'BUSINESS_CLASS': listImages = [
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_01.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_02.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_03.png'
                ]; break;
                case 'BUSINESS_AIR_NOSTRUM': listImages = [
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_01.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_02.png',
                    BookingAncillariesConstant.ROUTES.imagesUpgBids + '/upgrade/info_business-class/Carrusel_03.png'
                ]; break;

        }

        return listImages;
    };

    getCodeOrSymbolcurrency = (currency): any => {
        let currencyCode = currency.currencySymbol;
        if (currency.recommendedDisplay === 'symbol') {
            currencyCode = currency.symbol;
        } else if (currency.recommendedDisplay === 'code') {
            currencyCode = currency.code;
        }
        return currencyCode;
    };

    getConditionsOffer = (cabinClass): any => {
        let i = 0, isFound = false;
        const conditions = { onLand: [], onBoard: [] };

        while (!isFound && i < BookingAncillariesConstant.UPGRADE_TYPES.length) {
            if (cabinClass === BookingAncillariesConstant.UPGRADE_TYPES[i].type) {
                isFound = true;
                conditions.onLand = BookingAncillariesConstant.UPGRADE_TYPES[i].onLand;
                conditions.onBoard = BookingAncillariesConstant.UPGRADE_TYPES[i].onBoard;
            }
            i++;
        }
        return conditions;
    };


    /**
           * This function searchs for Open status in upgraidng bids
           */
    controlUpgradingBidsStatusOpen = (transformedInfo: any): boolean => {
        let openBids = [], upgradingBidsStatus = false, totalAmountBids = 0;
        const ancillariesSummaryInfo: any = this.CommonsSessionStorageService.get('breakdownInfo');

        if (ancillariesSummaryInfo.pendingPaymentItems.length > 0) {
            const ancillaryBids: any[] = ancillariesSummaryInfo.pendingPaymentItems.filter((pendingItem: any) =>  pendingItem.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID);
            ancillaryBids.forEach((openBid: any) => {
                openBid.segments.forEach((segment: any) => {
                    openBids = segment.cabins.filter((cabin: any) => cabin.status === 'OPEN' || cabin.status === 'OPEN_UPDATE' || cabin.status === 'BLOCKED' || cabin.status === 'CLOSED');
                    if (openBids.length > 0) {
                        upgradingBidsStatus = true;
                        openBids.sort((a, b) => {
                            return Number(b.amountPax) - Number(a.amountPax);
                        });
                        totalAmountBids += openBids[0].amountPax * ancillariesSummaryInfo.context.passengers.length;
                        transformedInfo.bidsUpgradingInfo.totalAmountBidsFormated = this.CurrencyService.formatPrice(transformedInfo.currency, totalAmountBids, false, false);
                        this.CommonsSessionStorageService.set('totalAmountBids', totalAmountBids);
                    }
                });
            });
        }
        return upgradingBidsStatus;
    };

    calculatePriceFromUpgBid = (bidSegments: any, currency: any) => {
        let priceFrom = 0;
        for (let i = 0; i < bidSegments.length; i++) {
            for (let j = 0; j < bidSegments[i].availableCabins.length; j++) {
                if (priceFrom === 0 || bidSegments[i].availableCabins[j].minimumAllowedBid < priceFrom) {
                    priceFrom = bidSegments[i].availableCabins[j].minimumAllowedBid;
                }
            }
        }
        return priceFrom;
    };
    /**
        * This function searchs for Closed status in upgraidng bids
        */
    controlUpgradingBidsStatusClosed = (transformedInfo: any): any => {
        let upgradingBidsStatus = false, statusList: any[] = [], totalAmountBids = 0;
        const ancillariesSummaryInfo: any = this.CommonsSessionStorageService.get('breakdownInfo');

        if (ancillariesSummaryInfo.issuedItems.length > 0) {
            const openBids: any[] = ancillariesSummaryInfo.issuedItems.filter((issuedItem: any) =>  issuedItem.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID);
            openBids.forEach((openBid: any) => {
                openBid.segments.forEach((segment: any) => {
                    statusList = segment.cabins.filter((cabin: any) => cabin.status === 'REJECTED' || cabin.status === 'GRANTED' || cabin.status === 'FAILED');
                    if (statusList.length > 0) {
                        upgradingBidsStatus = true;
                        statusList = statusList.filter((cabin: any) => cabin.status === 'GRANTED');
                        if (statusList.length > 0) {
                            totalAmountBids += statusList[0].amountPax * ancillariesSummaryInfo.context.passengers.length;
                            transformedInfo.bidsUpgradingInfo.totalAmountBidsFormated = this.CurrencyService.formatPrice(transformedInfo.currency, totalAmountBids, false, false);
                            this.CommonsSessionStorageService.set('totalAmountBids', totalAmountBids);
                        }
                    }
                });
            });
        }
        return upgradingBidsStatus;
    };


    upgIsReallyAvailable (ancillarie, bidsClosed, bidsBlocked): boolean {
        let isAvailable = false;
        if(ancillarie.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_AVIOS && (!ancillarie.offers || ancillarie.offers.length === 0))
            isAvailable = false;
        if(ancillarie.status?.code === BookingAncillariesConstant.STATUS.AVAILABLE)
            isAvailable = true;
        if(ancillarie.status?.code !== BookingAncillariesConstant.STATUS.AVAILABLE && BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID) {
            if (ancillarie.bids && ancillarie.bids.length > 0) {
                ancillarie.bids.forEach((bid) => {
                    bid.cabins.forEach((cabin) => {
                        if (cabin.status === 'BLOCKED') {
                            isAvailable = true;
                        }
                    });
                });
            }
        }
        if (bidsClosed || bidsBlocked) {
            isAvailable = true;
        }
        return isAvailable;
    }

    generateSlicesUpgradingBidsInfoOnlyFinishedBids = (): any => {
        const upgradingSummaryBidsSlicesInfo = [];
        const summaryInfo: any = this.CommonsSessionStorageService.get('breakdownInfo');
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        const currency: any = this.CommonsSessionStorageService.get('currency');
        let flightsInfo = [];
        if (bookingInfo && bookingInfo.order && bookingInfo.order.slices) {
            flightsInfo = bookingInfo.order.slices;
        }
        for (let i = 0; i < summaryInfo.issuedItems.length; i++) {
            if (summaryInfo.issuedItems[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID) {
                angular.forEach(summaryInfo.issuedItems[i].segments, (slice) => {
                    const flightInfo = this.getFlightInfo(flightsInfo, slice.id);
                    upgradingSummaryBidsSlicesInfo.push({});
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure = {};
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival = {};
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.description = flightInfo.departure.name;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.code = flightInfo.departure.code;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.description = flightInfo.arrival.name;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.code = flightInfo.arrival.code;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].dateToOrder = flightInfo.departureUtcDateTime;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departureDateParsed = this.$filter('date')(flightInfo.departureUtcDateTime, 'dd MMM yyyy');
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrivalDayAndMonthDate = this.$filter('date')(flightInfo.arrivalUtcDateTime, 'dd MMM yyyy');
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabinType = flightInfo.cabin.type;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabin = this.$filter('translate')(this.getOfferTitle(flightInfo.cabin.type));
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].passengers = flightsInfo[0].passengerFlags.length;
                    upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished = [];
                    angular.forEach(slice.cabins, (cabin) => {
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished.push({
                            cabinType: cabin.type,
                            cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(cabin.type)),
                            amountPax: cabin.amountPax,
                            totalCurrentBid: this.CurrencyService.formatPrice(currency, cabin.amountPax, true, false),
                            status: cabin.status,
                            images: this.getImagesByCabin(cabin.type, ''),
                            conditions: this.getConditionsOffer(cabin.type),
                            currencySimbol: this.getCodeOrSymbolcurrency(currency)
                        });
                    });
                });
            }
        }
        return upgradingSummaryBidsSlicesInfo;
    };



    getFlightInfo = (flightsInfo: any, sliceId: any): any => {
        let data = {};
        for (let i = 0; i < flightsInfo.length; i++) {
            angular.forEach(flightsInfo[i].segments, (segment) => {
                if (sliceId === segment.id) {
                    data = segment;
                }
            });
        }
        return data;
    };

    /**
     * Create the info of slices and type of cabins for the
     * @param {Array} ancillariesSlices
     * @param {Arrayt} ancillariesTrips
     */
    generateSlicesUpgradingBidsInfo = (ancillariesSlices: any, ancillariesTrips: any, cachedData: any, currency: any, upgradingBidsSlicesInfoResult: any, isWaitingList: boolean): any => {
        let departureDayAndMonthDate, arrivalDayAndMonthDate, isFound = false, i, j = 0;
        const upgradingBidsSlicesInfo = [];
        const segmentsInfo = this.AncillariesTemporalUtilsService.getMmBbookingSegmentInformation();
        const summaryInfo = this.CommonsSessionStorageService.get('breakdownInfo');
        /**
         * Return information of segment
         * @param {String} segmentId Id of segment
         * @param {Array} segmentsInfo List of segments with information
         */
        const getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
            let i = 0, isFound = false;
            const info = { departure: null, arrival: null };
            while (i < segmentsInfo.length && !isFound) {
                if (segmentsInfo[i].id === segmentId) {
                    info.arrival = segmentsInfo[i].arrival.city;
                    info.departure = segmentsInfo[i].departure.city;
                    isFound = true;
                }
                i++;
            }
            return info;
        };

        angular.forEach(ancillariesSlices, (slice) => {
            for (i = 0; i < ancillariesTrips.length; i++) {
                if (slice.segmentIds.indexOf(ancillariesTrips[i].id) !== -1) {
                    let isFirstElement = false;
                    const trip: any = {};
                    trip.id = ancillariesTrips[i].id;
                    trip.departure = getInfoSegment(ancillariesTrips[i].id, segmentsInfo).departure;
                    trip.arrival = getInfoSegment(ancillariesTrips[i].id, segmentsInfo).arrival;
                    while (j < segmentsInfo.length && !isFound) {
                        if (segmentsInfo[j].id === ancillariesTrips[i].id) {
                            departureDayAndMonthDate = this.$filter('date')(segmentsInfo[j].departureDateTime, 'dd MMM yyyy');
                            arrivalDayAndMonthDate = this.$filter('date')(segmentsInfo[j].arrivalDateTime, 'dd MMM yyyy');
                            trip.dateToOrder = segmentsInfo[j].departureDateTime;
                            trip.departureDateParsed = departureDayAndMonthDate;
                            trip.arrivalDateParsed = arrivalDayAndMonthDate;
                            trip.cabinType = segmentsInfo[j].cabinDescription;
                            trip.currentCabin = this.$filter('translate')(this.getOfferTitle(segmentsInfo[j].cabinType));
                            trip.haul = segmentsInfo[j].haul;
                            isFound = true;
                        }
                        j++;
                    }
                    trip.passengers = cachedData.passengers.length;
                    j = 0;
                    isFound = false;
                    if (isWaitingList) {
                        angular.forEach(ancillariesTrips[i].cabins, (tripCabin) => {
                            if (tripCabin !== null) {
                                if (!isFirstElement) {
                                    isFirstElement = true;
                                    trip.cabins = [];
                                }
                                trip.cabins.push({
                                    cabinType: tripCabin.type,
                                    cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(tripCabin.type)),
                                    maximumExpectedBid: 0,
                                    minimumAllowedBid: 0,
                                    avios: 0,
                                    formatAvios: this.CurrencyService.formatAvios('.', tripCabin.avios),
                                    images: this.getImagesByCabin(tripCabin.type, trip.haul),
                                    conditions: this.getConditionsOffer(tripCabin.type),
                                    currencySimbol: this.getCodeOrSymbolcurrency(currency),
                                    waitingList: true,
                                    offered: false,
                                    numToUse: tripCabin.numToUse
                                });
                            }
                        });
                        isFirstElement = false;
                        upgradingBidsSlicesInfo.push(trip);
                    } else if (ancillariesTrips[i].availableCabins.length > 0) {
                        const availableOpenCabins = ancillariesTrips[i].availableCabins.filter((cabin: any) => cabin.status === 'OPEN' || cabin.status === 'OPEN_UPDATE' || cabin.status === 'BLOCKED' || cabin.avios || cabin.free);
                        availableOpenCabins.forEach((tripCabin: any) => {
                            if (tripCabin !== null) {
                                if (!isFirstElement) {
                                    isFirstElement = true;
                                    trip.cabins = [];
                                }
                                trip.cabins.push({
                                    cabinType: tripCabin.cabinType,
                                    cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(tripCabin.cabinType)),
                                    maximumExpectedBid: tripCabin.maximumExpectedBid,
                                    minimumAllowedBid: tripCabin.minimumAllowedBid,
                                    avios: tripCabin.avios,
                                    free: tripCabin.free,
                                    formatAvios: this.CurrencyService.formatAvios(currency.groupingSeparator, tripCabin.avios),
                                    images: this.getImagesByCabin(tripCabin.cabinType, trip.haul),
                                    conditions: this.getConditionsOffer(tripCabin.cabinType),
                                    currencySimbol: this.getCodeOrSymbolcurrency(currency),
                                    currentBidByPax: tripCabin.amountPax,
                                    maxFraud: tripCabin.maxFraud,
                                    status: tripCabin.status
                                });
                            }
                        });
                        isFirstElement = false;
                        if (availableOpenCabins.length > 0) {
                            upgradingBidsSlicesInfo.push(trip);
                        }
                    }
                }
            }
        });
        angular.forEach(upgradingBidsSlicesInfo, (slice) => {
            if (slice.cabins) {
                for (i = 0; i < slice.cabins.length; i++) {
                    slice.cabins[i].currentCabin = slice.currentCabin;
                    slice.cabins[i].id = slice.id;
                }
            }
        });

        upgradingBidsSlicesInfoResult = this.checkFinishedBidsOffers(upgradingBidsSlicesInfo, summaryInfo);
        upgradingBidsSlicesInfoResult = upgradingBidsSlicesInfoResult.concat(upgradingBidsSlicesInfo);
        this.orderSegmentsByDate(upgradingBidsSlicesInfoResult);
        this.deleteFinishedCabins(upgradingBidsSlicesInfoResult);
        return upgradingBidsSlicesInfoResult;
    };

    mixAncillariesTripsUpgradingInfo (bidsUpgradingInfo: any) {
        let i, j;
        if (bidsUpgradingInfo.waitingListAvailable) {
            if (bidsUpgradingInfo.ancillariesTrips.length > 0) {
                for (i = 0; i < bidsUpgradingInfo.ancillariesTrips.length; i++) {
                    for (j = 0; j < bidsUpgradingInfo.ancillariesTripsWL.length; j++) {
                        if (bidsUpgradingInfo.ancillariesTrips[i].id === bidsUpgradingInfo.ancillariesTripsWL[j].id) {
                            bidsUpgradingInfo.ancillariesTrips[i].cabins.push(bidsUpgradingInfo.ancillariesTripsWL[j].cabins[0]);
                        }
                    }
                }
            } else {
                bidsUpgradingInfo.ancillariesTrips = bidsUpgradingInfo.ancillariesTripsWL;
            }
        } else {
            if (bidsUpgradingInfo.ancillariesTrips && bidsUpgradingInfo.ancillariesTrips.length > 0) {
                if (!bidsUpgradingInfo.ancillariesTrips[0].cabins) {
                    for (i = 0; i < bidsUpgradingInfo.bidsSegments.length; i++) {
                        if(bidsUpgradingInfo.bidsSegments[i].availableCabins) {
                            bidsUpgradingInfo.ancillariesTrips[0].cabins = bidsUpgradingInfo.bidsSegments[i].availableCabins;
                        }
                    }
                    if (bidsUpgradingInfo.ancillariesTrips[0].cabins) {
                        for (i = 0; i < bidsUpgradingInfo.ancillariesTrips[0].cabins.length; i++) {
                            bidsUpgradingInfo.ancillariesTrips[0].cabinsFinished.forEach((cabinFinished: any) => {
                                if (bidsUpgradingInfo.ancillariesTrips[0].cabins[i].cabinType === cabinFinished.cabinType) {
                                    bidsUpgradingInfo.ancillariesTrips[0].cabins.splice(i, 1);
                                    i = i - 1;
                                } else {
                                    bidsUpgradingInfo.ancillariesTrips[0].cabins[i].cabinTypeDescription = this.$filter('translate')(this.getOfferTitle(bidsUpgradingInfo.ancillariesTrips[0].cabins[i].cabinType));
                                    bidsUpgradingInfo.ancillariesTrips[0].cabins[i].formatAvios = this.CurrencyService.formatAvios('.', bidsUpgradingInfo.ancillariesTrips[0].cabins[i].avios);
                                }
                            });
                        }
                    }
                }
            }
        }
        return bidsUpgradingInfo.ancillariesTrips;
    }

    orderSegmentsByDate = (upgradingBidsSlicesInfoResult: any): any => {
        upgradingBidsSlicesInfoResult = upgradingBidsSlicesInfoResult.sort((a, b) => {
            const dateA: any = new Date(a.dateToOrder), dateB: any = new Date(b.dateToOrder);
            return dateA - dateB;
        });
    };

    deleteFinishedCabins = (upgradingBidsSlicesInfoResult: any): void => {
        let cabinToDelete: any, indexOfCabinToDelete = 0, blockedContinueSection = true;
        for (let i = 0; i < upgradingBidsSlicesInfoResult.length; i++) {
            if (upgradingBidsSlicesInfoResult[i].cabinsFinished && upgradingBidsSlicesInfoResult[i].cabinsFinished.length > 0) {
                for (let k = 0; k < upgradingBidsSlicesInfoResult[i].cabinsFinished.length; k++) {
                    if (upgradingBidsSlicesInfoResult[i].cabins) {
                        cabinToDelete = upgradingBidsSlicesInfoResult[i].cabins.filter((cabin: any) =>  cabin.cabinType === upgradingBidsSlicesInfoResult[i].cabinsFinished[k].cabinType);
                        if (cabinToDelete.length > 0) {
                            indexOfCabinToDelete = upgradingBidsSlicesInfoResult[i].cabins.indexOf(cabinToDelete[0]);
                            if (indexOfCabinToDelete !== -1) {
                                upgradingBidsSlicesInfoResult[i].cabins.splice(indexOfCabinToDelete, 1);
                            }
                        }
                    }
                }
            }
            if (upgradingBidsSlicesInfoResult[i].cabins && upgradingBidsSlicesInfoResult[i].cabins.length > 0) {
                blockedContinueSection = false;
            }
        }
        this.CommonsSessionStorageService.set('blockedContinueSection', blockedContinueSection);
    };


    checkBlockedBidsOffers (transformedInfo: any): boolean {
        let upgradingBidsStatus = false, statusList: any[] = [], totalAmountBids = 0;
        const ancillariesSummaryInfo: any = this.CommonsSessionStorageService.get('breakdownInfo');

        if (ancillariesSummaryInfo.pendingPaymentItems.length > 0) {
            const openBids: any[] = ancillariesSummaryInfo.pendingPaymentItems.filter((pendingPaymentItem: any) =>  pendingPaymentItem.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID);
            openBids.forEach((openBid: any) => {
                openBid.segments.forEach((segment: any) => {
                    statusList = segment.cabins.filter((cabin: any) => cabin.status === 'BLOCKED' || cabin.status === 'CLOSED');
                    if (statusList.length > 0) {
                        upgradingBidsStatus = true;
                        statusList.forEach((cabinOffer) => {
                            totalAmountBids += cabinOffer.amountPax * ancillariesSummaryInfo.context.passengers.length;
                        });
                        transformedInfo.bidsUpgradingInfo.totalAmountBidsFormated = this.CurrencyService.formatPrice(transformedInfo.currency, totalAmountBids, false, false);
                        this.CommonsSessionStorageService.set('totalAmountBids', totalAmountBids);
                    }
                });
            });
        }
        return upgradingBidsStatus;
    }

    checkFinishedBidsOffers = (upgradingBidsSlicesInfo, summaryInfo): any => {
        const upgradingSummaryBidsSlicesInfo = [];
        const upgradingBidsSlicesInfoResult = [];
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        const currencies: any = summaryInfo.currencies;
        const passengersCount = summaryInfo.context.passengers.length;
        let flightsInfo = [];
        if (bookingInfo && bookingInfo.order && bookingInfo.order.slices) {
            flightsInfo = bookingInfo.order.slices;
        }
        for (let i = 0; i < summaryInfo.pendingPaymentItems.length; i++) {
            if (summaryInfo.pendingPaymentItems[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID) {
                angular.forEach(summaryInfo.pendingPaymentItems[i].segments, (slice) => {
                    if (upgradingBidsSlicesInfo.length > 0) {
                        for (let j = 0; j < upgradingBidsSlicesInfo.length; j++) {
                            if (slice.id.indexOf(upgradingBidsSlicesInfo[j].id) !== -1) {
                                upgradingBidsSlicesInfo[j].cabinsFinished = [];
                                angular.forEach(slice.cabins, (cabin) => {
                                    let currency = this.obtainSummaryCurrency (currencies, cabin.currency);
                                    currency = this.CurrencyService.getCurrencyObject(currency);
                                    if (cabin.status === 'BLOCKED' || cabin.status === 'CLOSED') {
                                        upgradingBidsSlicesInfo[j].cabinsFinished.push({
                                            cabinType: cabin.type,
                                            cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(cabin.type)),
                                            amountPax: cabin.amountPax,
                                            totalCurrentBid: this.CurrencyService.formatPrice(currency, cabin.amountPax, true, false),
                                            status: cabin.status,
                                            images: this.getImagesByCabin(cabin.type, ''),
                                            conditions: this.getConditionsOffer(cabin.type),
                                            currencySimbol: this.getCodeOrSymbolcurrency(currency)
                                        });
                                    }
                                });
                            } else {
                                const flightInfo = this.getFlightInfo(flightsInfo, slice.id);
                                upgradingSummaryBidsSlicesInfo.push({});
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure = {};
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival = {};
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.description = flightInfo.departure.name;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.code = flightInfo.departure.code;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.description = flightInfo.arrival.name;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.code = flightInfo.arrival.code;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].dateToOrder = flightInfo.departureUtcDateTime;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departureDateParsed = this.$filter('date')(flightInfo.departureUtcDateTime, 'dd MMM yyyy');
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrivalDayAndMonthDate = this.$filter('date')(flightInfo.arrivalUtcDateTime, 'dd MMM yyyy');
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabinType = flightInfo.cabin.type;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabin = flightInfo.cabin.description;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].passengers = upgradingBidsSlicesInfo[j].passengers;
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished = [];
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].id = flightInfo.id;
                                angular.forEach(slice.cabins, (cabin) => {
                                    let currency = this.obtainSummaryCurrency (currencies, cabin.currency);
                                    currency = this.CurrencyService.getCurrencyObject(currency);
                                    if (cabin.status !== 'OPEN' && cabin.status !== 'BLOCKED') {
                                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished.push({
                                            cabinType: cabin.type,
                                            cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(cabin.type)),
                                            amountPax: cabin.amountPax,
                                            totalCurrentBid: this.CurrencyService.formatPrice(currency, cabin.amountPax, true, false, false),
                                            status: cabin.status,
                                            images: this.getImagesByCabin(cabin.type, ''),
                                            conditions: this.getConditionsOffer(cabin.type),
                                            currencySimbol: this.getCodeOrSymbolcurrency(currency)
                                        });
                                    }
                                });
                            }
                        }
                    } else {
                        const flightInfo = this.getFlightInfo(flightsInfo, slice.id);
                        upgradingSummaryBidsSlicesInfo.push({});
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure = {};
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival = {};
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.description = flightInfo.departure.name;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departure.code = flightInfo.departure.code;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.description = flightInfo.arrival.name;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrival.code = flightInfo.arrival.code;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].dateToOrder = flightInfo.departureUtcDateTime;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].departureDateParsed = this.$filter('date')(flightInfo.departureUtcDateTime, 'dd MMM yyyy');
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].arrivalDayAndMonthDate = this.$filter('date')(flightInfo.arrivalUtcDateTime, 'dd MMM yyyy');
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabinType = flightInfo.cabin.type;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].currentCabin = flightInfo.cabin.description;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].passengers = passengersCount;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].id = flightInfo.id;
                        upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished = [];
                        angular.forEach(slice.cabins, (cabin) => {
                            let currency = this.obtainSummaryCurrency (currencies, cabin.currency);
                            currency = this.CurrencyService.getCurrencyObject(currency);
                            if (cabin.status === 'BLOCKED' || cabin.status === 'CLOSED') {
                                upgradingSummaryBidsSlicesInfo[upgradingSummaryBidsSlicesInfo.length - 1].cabinsFinished.push({
                                    cabinType: cabin.type,
                                    cabinTypeDescription: this.$filter('translate')(this.getOfferTitle(cabin.type)),
                                    amountPax: cabin.amountPax,
                                    totalCurrentBid: this.CurrencyService.formatPrice(currency, cabin.amountPax, true, false, false),
                                    status: cabin.status,
                                    images: this.getImagesByCabin(cabin.type, ''),
                                    conditions: this.getConditionsOffer(cabin.type),
                                    currencySimbol: this.getCodeOrSymbolcurrency(currency)
                                });
                            }
                        });
                    }
                });
                for (let k = 0; k < upgradingSummaryBidsSlicesInfo.length; k++) {
                    if (upgradingSummaryBidsSlicesInfo[k].cabinsFinished.length > 0) {
                        upgradingBidsSlicesInfoResult.push(upgradingSummaryBidsSlicesInfo[k]);
                    }
                }
            }
        }
        return upgradingBidsSlicesInfoResult;
    };

    obtainSummaryCurrency = (currencies: any, cabinCurrency: string): any => {
        let currency = {}, i: number;
        for (i = 0; i < currencies.length; i++) {
            if (currencies[i].code === cabinCurrency) {
                currency = currencies[i];
            }
        }
        return currency;
    };

    calcAviosFrom = (segments: BidSegment[]): number => {
        if(segments) {
            return segments.flatMap(segment => segment.availableCabins)
                .reduce((a, b) => {
                    if (a === 0 || b.avios === 0) {
                        return a + b.avios;
                    } else {
                        return a > b.avios ? b.avios : a;
                    }
                }, segments[0].availableCabins[0].avios);
        }
        return 0;
    };

    generateInfoManageMyBooking = (ancillariesInfo: any, cachedData: any): any => {
        let ancilleriesBaggageInfo: any = {}, i, j, x,
            isMeals = false, ancillariesSeatInfo: any = {},
            ancillariesInsuranceInfo: any = {}, countryInsurance = {},
            upgradingBidsSlicesInfoResult;
        const transformedInfo: any = {
            ancillariesAvailable: [],
            ancillariesTrips: [],
            currency: null,
            pendingSeats: false,
            baggageAvailable: false,
            passengerBaggagesTrips: [],
            passengerSpeqsTrips: [],
            baggageAvailablePrice: {
                priceFrom: 0
            },
            ancillariesInsurance: [],
            insuranceInfo: { countriesList: [], insuranceCountry: null, id: null, price: null, priceZero: null, originalPrice: null, passengers: cachedData.passengers, conditionsUri: '', isModalLoading: false, countryInsurance: '', insurancePatterns: {}, consent: '' },
            ancillariesSpeqs: [],
            insuranceAvailable: false,
            thirdPartyCompanies: [],
            specialMealsInfo: {
                specialMealAvailable: false,
                specialMealListOptions: [],
                specialMealSegments: [],
                specialMealNumSelected: 0,
                specialMealIsClose: false,
                passengersInfo: [],
                flowId: cachedData.flowId,
                orderedMeals: []
            },
            speqsAvailablePrice: {
                priceFrom: 0
            },
            seatsAvailable: {
                status: false,
                priceFrom: 0
            },
            isCurrencyLong: false,
            bidsUpgradingInfo: {
                bidsOpen: false,
                bidsClosed: false,
                bidsBlocked: false,
                totalAmountBidsFormated: '',
                bidsAvailable: false,
                freePossibility: false,
                aviosBidAvailable: false,
                waitingListAvailable: false,
                freeUpgradesAvailable: 0,
                priceFrom: 0,
                bidsSegments: [],
                bidsSegmentsWL: [],
                currency: '',
                ancillariesTrips: [],
                ancillariesTripsWL: [],
                ancillariesTripsFinished: []
            },
            preorderAncillarieInfo: {},
            speqsQuanty: 0,
            seatsQuanty: 0,
            bobInfo: { slices: [], priceFrom: '', additionalBagsPrice: '' },
            ancillariesCarbonFootprint: null,
            ancillariesTransfersGlobick: null
        };

        /**
     * Return covereage of insurance
     * @param {*} coverages
     */
        const getInsuranceDescription = (coverages): any => {
            const descriptionCoverages = [];
            for (let coveragesIndex = 0; coveragesIndex < coverages.length; coveragesIndex++) {
                descriptionCoverages.push({ title: coverages[coveragesIndex].title, description: coverages[coveragesIndex].description });
            }
            return descriptionCoverages;
        };

        /**
         *
         * @param {*} passengers
         */
        const getNumPassengerByInsurance = (passengers): any => {
            let totalNumPassengerByInsurance = 0, passengersInfo;
            angular.forEach(passengers, (passenger, key) => {
                if (passenger.passengerType !== 'INF') {
                    totalNumPassengerByInsurance = totalNumPassengerByInsurance + 1;
                }
            });
            if (totalNumPassengerByInsurance === 0) {
                return 1; //Avoid division by zero
            }
            return totalNumPassengerByInsurance;
        };


        const generatePriorityOffersInfo = (ancillariesSlices: any, segments: any, cachedData: any): any => {
            let index, i, trip, passenger: any = {};
            const passengersPriority = [], segmentsInfo = this.AncillariesTemporalUtilsService.getMmBbookingSegmentInformation(), currency: any = this.CommonsSessionStorageService.get('currency');

            const getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
                let i = 0, isFound = false;
                const info = { departure: null, arrival: null };
                while (i < segmentsInfo.length && !isFound) {
                    if (segmentsInfo[i].id === segmentId) {
                        info.arrival = segmentsInfo[i].arrival.city;
                        info.departure = segmentsInfo[i].departure.city;
                        isFound = true;
                    }
                    i++;
                }
                return info;
            };

            const createSlicesSegmentsInfo = (segments: any, ancilariesInfoSlices: any, segmentsInfo: any): any => {
                let i, j = 0, isFound;
                const sliceInfo: any = {};
                angular.forEach(ancilariesInfoSlices, (slice) => {
                    if (slice.segmentIds.length > 1) {
                        isFound = false;
                        j = 0;
                        sliceInfo.departure = getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                        sliceInfo.arrival = getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                        for (i = 0; i < slice.segmentIds.length; i++) {
                            while (j < segments.length && !isFound) {
                                if (segments[j].id === slice.segmentIds[i]) {
                                    segments[j].withSliceInfo = true;
                                    segments[j].sliceInfo = {};
                                    segments[j].sliceInfo.departure = sliceInfo.departure;
                                    segments[j].sliceInfo.arrival = sliceInfo.arrival;
                                    isFound = true;
                                }
                                j++;
                            }
                        }
                    } else {
                        j = 0;
                        isFound = false;
                        while (j < segments.length && !isFound) {
                            if (segments[j].id === slice.segmentIds[0]) {
                                segments[j].onlySliceInfo = true;
                                isFound = true;
                            }
                            j++;
                        }
                    }
                });

            };
            const checkPassengersSegments = (segments: any): any => {
                let i = 0, isFound = false, passengerAux = [];
                while (i < segments.length && !isFound) {
                    if (segments[i].passengers.length > 0) {
                        passengerAux = {... segments[i].passengers};
                        isFound = true;
                    }
                    i++;
                }
                for (i = 0; i < passengerAux.length; i++) {
                    passengerAux[i].amount = null;
                    passengerAux[i].status.code = 'NOT_AVAILABLE';
                }
                for (i = 0; i < segments.length; i++) {
                    if (segments[i].passengers.length === 0) {
                        segments[i].passengers = passengerAux;
                    }
                }
            };

            const getInfoTrip = (segmentId: any, segmentsInfo: any): any => {
                let i = 0, isFound = false;
                const info = { departure: null, arrival: null };
                while (i < segmentsInfo.length && !isFound) {
                    if (segmentsInfo[i].id === segmentId) {
                        info.arrival = segmentsInfo[i].arrival.city;
                        info.departure = segmentsInfo[i].departure.city;
                        isFound = true;
                    }
                    i++;
                }
                return info;
            };

            const searchPassenger = (passengersPriority: any, idPassenger: any): any => {
                let i, j, index = -1;
                for (i = 0; i < passengersPriority.length; i++) {
                    if (passengersPriority[i].id === idPassenger) {
                        passengersPriority[i].trips.push(trip);
                        index = 0;
                    }
                }
                return index;
            };

            const putPassengerType = (idPassenger: any, cachedData: any): any => {
                let passengerType = '';
                for (let i = 0; i < cachedData.passengers.length; i++) {
                    if (idPassenger === cachedData.passengers[i].passengerId) {
                        passengerType = cachedData.passengers[i].passengerType;
                    }
                }
                return passengerType;
            };

            const getPriorityInfoPassenger = (id: any): any => {
                const pasInfo: any = {};
                angular.forEach(cachedData.passengers, (pas) => {
                    if (pas.passengerId.toString() === id) {
                        pasInfo.name = pas.personalInfo.name;
                        pasInfo.surname = pas.personalInfo.surname;
                        pasInfo.infant = pas.personalInfo.infant;
                    }
                });
                return pasInfo;
            };
            const getPriorityInfoCkiPassenger = (id: any): any => {
                const pasInfo: any = {};
                angular.forEach(cachedData.passengers, (pas) => {
                    if (pas.id.toString() === id) {
                        pasInfo.name = pas.name;
                        pasInfo.surname = pas.surname;
                        pasInfo.infant = pas.infant;
                    }
                });

                return pasInfo;
            };
            checkPassengersSegments(segments);
            createSlicesSegmentsInfo(segments, ancillariesSlices, segmentsInfo);
            angular.forEach(segments, (segment) => {
                for (i = 0; i < segment.passengers.length; i++) {
                    trip = { id: null, amount: segment.passengers[i].amount, tripPrice: this.CurrencyService.formatPrice(currency, segment.passengers[i].amount, true, false), checkedTrip: false };
                    if (segment.sliceInfo) {
                        trip.sliceInfo = segment.sliceInfo;
                        trip.withSliceInfo = segment.withSliceInfo;
                    } else if (segment.onlySliceInfo) {
                        trip.onlySliceInfo = true;
                    } else {
                        trip.withSliceInfo = false;
                    }
                    trip.id = segment.id;
                    trip.status = segment.passengers[i].status.code;
                    trip.departure = getInfoTrip(segment.id, segmentsInfo).departure;
                    trip.arrival = getInfoTrip(segment.id, segmentsInfo).arrival;
                    index = searchPassenger(passengersPriority, segment.passengers[i].id);
                    if (index === -1) {
                        passenger = {};
                        passenger = { id: segment.passengers[i].id, trips: [], passengerType: putPassengerType(segment.passengers[i].id, cachedData) };
                        passenger.info = getPriorityInfoPassenger(passenger.id);
                        passenger.trips.push(trip);
                        passengersPriority.push(passenger);
                    }
                }
            });
            return passengersPriority;
        };

        const generatePriorityBoardingInfo = (copyCurrency: any, ancillariesSlices: any, ancillarie: any, cachedData: any): any => {
            const priorityBoarding = {
                currency: ancillarie.currency,
                info: generatePriorityOffersInfo(ancillariesSlices, ancillarie.segments, cachedData),
                priceFrom: ancillarie.priceFrom,
                cardPriceFormatted: this.CurrencyService.formatPrice(copyCurrency, Math.floor(ancillarie.priceFrom), false, false),
                status: ancillarie.status,
                type: ancillarie.type,
                name: BookingAncillariesConstant.PRIORITY_BOARDING.NAME,
                cardCols: BookingAncillariesConstant.PRIORITY_BOARDING.CARDCOLS,
                cardType: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTYPE,
                cardImg: BookingAncillariesConstant.PRIORITY_BOARDING.CARDIMG,
                cardTitle: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTITLE,
                cardText: BookingAncillariesConstant.PRIORITY_BOARDING.CARDTEXT,
                cardSubtext: BookingAncillariesConstant.PRIORITY_BOARDING.CARDSUBTEXT,
                cardSubtextSelect: BookingAncillariesConstant.PRIORITY_BOARDING.CARDSUBTEXTSELECT,
                cardButton: BookingAncillariesConstant.PRIORITY_BOARDING.CARDBUTTON,
                confirmed: false,
                selectedPriorityBoarding: null,
                modal: BookingAncillariesConstant.PRIORITY_BOARDING.MODAL,
                datalayer: BookingAncillariesConstant.DATALAYER_INFO.PRIORITY_BOARDING_OPEN
            };
            return priorityBoarding;
        };

        /**
         * Return passenger baggages trips information
         * @param {Array} ancillariesTrips
         * @param {Object} cachedData
         */
        const generateBaggageTripsInformation = (ancillariesSlices, ancillariesTrips, cachedData): any => {
            const passengersBaggages = [];

            const segmentsInfo = this.AncillariesTemporalUtilsService.getMmBbookingSegmentInformation();
            /**
              * Return information of segment
              * @param {String} segmentId Id of segment
              * @param {Array} segmentsInfo List of segments with information
              */
            const getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
                let i = 0, isFound = false;
                const info = { departure: null, arrival: null };
                while (i < segmentsInfo.length && !isFound) {
                    if (segmentsInfo[i].id === segmentId) {
                        info.arrival = segmentsInfo[i].arrival.city;
                        info.departure = segmentsInfo[i].departure.city;
                        isFound = true;
                    }
                    i++;
                }
                return info;
            };

            const getInfoPassenger = (id: any): any => {
                const pasInfo: any = {},
                    infantCollection = cachedData.passengers.filter((passenger) => passenger.passengerType === BookingAncillariesConstant.TYPE_PASSENGER.INFANT);
                angular.forEach(cachedData.passengers, (pas) => {
                    if (pas.passengerId === id) {
                        pasInfo.name = pas.externalPersonalInfo ? pas.externalPersonalInfo.name : pas.personalInfo.name;
                        pasInfo.surname = pas.externalPersonalInfo ? pas.externalPersonalInfo.firstSurname + ' ' + pas.externalPersonalInfo.lastSurname : pas.personalInfo.surname;
                    } else if (pas.passengerType === BookingAncillariesConstant.TYPE_PASSENGER.INFANT &&
                        infantCollection.some(infant => infant.relatedPassengerId === id)) {
                        pasInfo.infant = getRelatedInfant(id, infantCollection);
                    }
                });
                return pasInfo;
            };

            const getRelatedInfant = (adultId: any, infants: any): any => {
                let adultIdInfantIndex = 0, foundedAdultInfant = false, foundedInfant = null;
                while (!foundedAdultInfant && adultIdInfantIndex < infants.length) {
                    if (adultId === infants[adultIdInfantIndex].relatedPassengerId) {
                        foundedInfant = infants[adultIdInfantIndex];
                        foundedAdultInfant = true;
                    }
                    adultIdInfantIndex++;
                }
                return foundedInfant.personalInfo.name + ' ' + foundedInfant.personalInfo.surname;
            };

            for (let i = 0; i < ancillariesTrips.length; i++) {
                if (ancillariesTrips[i].status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    let isFound = false;
                    angular.forEach(ancillariesTrips[i].passengers, (passengerTrip) => {
                        const passenger = {
                            id: passengerTrip.id,
                            trips: [],
                            info: getInfoPassenger(passengerTrip.id)
                        };
                        const trip: any = {
                            id: ancillariesTrips[i].id,
                            pieces: [],
                            maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
                            piecesChoosed: 0,
                            totalPrice: 0,
                            totalBaggages: 0
                        };

                        angular.forEach(ancillariesSlices, (slice) => {
                            if (slice.id === ancillariesTrips[i].id) {
                                if (slice.segmentIds.length > 1) {
                                    trip.departure = getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                    trip.arrival = getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                                } else {
                                    trip.departure = getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                    trip.arrival = getInfoSegment(slice.segmentIds[0], segmentsInfo).arrival;
                                }
                            }
                        });

                        angular.forEach(passengerTrip.pieces, (pasPieces) => {
                            isFound = false;
                            if (pasPieces.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                                pasPieces.quantySelected = 0;
                                pasPieces.purchasedPieces > 0 ? trip.totalBaggages += pasPieces.purchasedPieces : angular.noop;
                                pasPieces.franchisePieces > 0 ? trip.totalBaggages += pasPieces.franchisePieces : angular.noop;
                                pasPieces.extraPieces ? trip.totalBaggages += pasPieces.extraPieces.units : angular.noop;
                                trip.pieces.push(pasPieces);

                            }
                        });

                        for (let j = 0; j < passengersBaggages.length; j++) {
                            if (passenger.id === passengersBaggages[j].id) {
                                passengersBaggages[j].trips.push(trip);
                                isFound = true;
                            }
                        }
                        if (!isFound && trip.pieces.length > 0) {
                            passenger.trips.push(trip);
                            passengersBaggages.push(passenger);
                        }
                    });
                }
            }

            return passengersBaggages;
        };

        const generateSegmentSpecialMeal = (ancilleriesSpecialMealInfo, bookingInfo): any => {
            const slices: any = bookingInfo.order.slices;
            const allSegments = {};
            let specialMealSegments = [];
            for (let i = 0; i < slices.length; i++) {
                for (let j = 0; j < slices[i].segments.length; j++) {
                    allSegments[slices[i].segments[j].id] = {
                        departure: slices[i].segments[j].departure,
                        arrival: slices[i].segments[j].arrival,
                        departureDateParsed: this.$filter<any>('DateFormatFilter')(slices[i].segments[j].departureDateTime, 'shortDate'),
                        arrivalDateParsed: this.$filter<any>('DateFormatFilter')(slices[i].segments[j].arrivalDateTime, 'shortDate'),
                        cabin: slices[i].segments[j].cabin
                    };
                }
            }

            if (ancilleriesSpecialMealInfo.segments) {
                specialMealSegments = ancilleriesSpecialMealInfo.segments;

                angular.forEach(specialMealSegments, (segment) => {
                    segment.segmentInfo = allSegments[segment.id];
                });

            }

            return specialMealSegments;
        };


        const generateThirdPartyCompanies = (thirdPartyCompanies, bookingInfo): any => {
            const data = [];

            for (let i = 0; i < thirdPartyCompanies.thirdPartyCompanies.length; i++) {
                data.push({
                    title: thirdPartyCompanies.thirdPartyCompanies[i].message,
                    description: 'MMB_RES_COMPANY',
                    externalUrl: thirdPartyCompanies.thirdPartyCompanies[i].externalUrl,
                    segmentsIds: thirdPartyCompanies.thirdPartyCompanies[i].segmentIds,
                    segments: []
                });
            }

            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].segmentsIds.length; j++) {
                    for (let k = 0; k < bookingInfo.order.slices.length; k++) {
                        for (let l = 0; l < bookingInfo.order.slices[k].segments.length; l++) {
                            if (data[i].segmentsIds[j] === bookingInfo.order.slices[k].segments[l].id) {
                                data[i].segments.push(bookingInfo.order.slices[k].segments[l]);
                            }
                        }

                    }

                }
            }
            return data;
        };



        const generateMealsPreSelected = (cachedData): any => {
            const pasInfo = [];
            angular.forEach(cachedData.order.orderItems, (orderItem) => {
                if (orderItem.type === BookingAncillariesConstant.TYPES.MEAL) {
                    pasInfo.push(orderItem);
                }
            });

            return pasInfo;
        };


        const getMinPriceSeat = (segments: any, currency: any): any => {
            const listPrice = [];
            let price = null;
            angular.forEach(segments, (segment) => {
                angular.forEach(segment.passengers, (pas) => {
                    if (pas.priceFrom !== null && pas.priceFrom >= 0) {
                        listPrice.push(pas.priceFrom);
                    }
                });
            });

            if (listPrice.length > 0) {
                price = listPrice.sort((a, b) => {
                    return a - b;
                });
                price = this.CurrencyService.formatPrice(currency, price[0], true, false);
            }
            return price;
        };


        /**
        * Return passenger speqs trips information
        * @param {Array} ancillariesTrips
        * @param {Object} cachedData
        */
        const generateSpeqsTripsInformation = (ancillariesSlices: any, ancillariesTrips: any, cachedData: any): any => {
            const passengersSpeqs = [];
            const segmentsInfo = this.AncillariesTemporalUtilsService.getMmBbookingSegmentInformation();

            const speqTitle = (speqInfo: any): string => {
                let speqDescription = '';
                switch (speqInfo.subtype) {
                        case 'BICYCLE':
                            speqDescription = this.$filter('translate')('SPEQS_BICYCLE');
                            break;
                        case 'SURFBOARD':
                            speqDescription = this.$filter('translate')('SPEQS_SURFBOARD_TITLE');
                            break;
                        case 'SKI_SNOW':
                            speqDescription = this.$filter('translate')('SPEQS_SKI_SNOW');
                            break;
                        case 'GOLF_EQUIPMENT':
                            speqDescription = this.$filter('translate')('SPEQS_GOLF_EQUIPMENT');
                            break;
                        case 'FISHING_EQUIPMENT':
                            speqDescription = this.$filter('translate')('SPEQS_FISHING_TITLE');
                            break;
                        case 'SCUBA_DIVING':
                            speqDescription = this.$filter('translate')('SPEQS_SCUBA_TITLE');
                            break;
                }
                return speqDescription;
            };

            const getInfoSegment = (segmentId: any, segmentsInfo: any): any => {
                let i = 0, isFound = false;
                const info = { departure: null, arrival: null };
                while (i < segmentsInfo.length && !isFound) {
                    if (segmentsInfo[i].id === segmentId) {
                        info.arrival = segmentsInfo[i].arrival.city;
                        info.departure = segmentsInfo[i].departure.city;
                        isFound = true;
                    }
                    i++;
                }
                return info;
            };

            const getPiecePriceFormmated = (trip: any): any => {
                let i, k;
                for (i = 0; i < trip.pieces.length; i++) {
                    for (k = 0; k < trip.pieces[i].availablePriceRanges.length; k++) {
                        trip.pieces[i].availablePriceRanges[k].amountPrice = this.CurrencyService.formatPrice(transformedInfo.currency, trip.pieces[i].availablePriceRanges[k].amount, false, false, true);
                    }
                }
            };

            const getInfoPassenger = (id: any): any => {
                const pasInfo: any = {};
                angular.forEach(cachedData.passengers, (pas) => {
                    if (pas.passengerId === id) {
                        pasInfo.name = pas.externalPersonalInfo ? pas.externalPersonalInfo.name : pas.personalInfo.name;
                        pasInfo.surname = pas.externalPersonalInfo ? pas.externalPersonalInfo.firstSurname + ' ' + pas.externalPersonalInfo.lastSurname : pas.personalInfo.surname;
                        pasInfo.infant = pas.infant;
                    }
                });

                return pasInfo;
            };

            for (let i = 0; i < ancillariesTrips.length; i++) {
                if (ancillariesTrips[i].status.code === BookingAncillariesConstant.GENERAL_STATUS.AVAILABLE) {
                    angular.forEach(ancillariesTrips[i].passengers, (passengerTrip) => {
                        if (passengerTrip.maxAdditionalPieces > 0) {
                            const passenger = {
                                id: passengerTrip.id,
                                trips: [],
                                info: getInfoPassenger(passengerTrip.id)
                            };
                            const trip: any = {
                                id: ancillariesTrips[i].id,
                                pieces: [],
                                maxAdditionalPieces: passengerTrip.maxAdditionalPieces,
                                speqsChoosed: 0,
                                totalPrice: 0
                            };
                            let isFound = false;
                            angular.forEach(ancillariesSlices, (slice) => {
                                if (slice.id === ancillariesTrips[i].id) {
                                    if (slice.segmentIds.length > 1) {
                                        trip.departure = getInfoSegment(slice.segmentIds[0], segmentsInfo).departure;
                                        trip.arrival = getInfoSegment(slice.segmentIds[slice.segmentIds.length - 1], segmentsInfo).arrival;
                                    } else {
                                        angular.extend(trip, getInfoSegment(slice.segmentIds[0], segmentsInfo));
                                    }
                                }
                            });

                            angular.forEach(passengerTrip.pieces, (pasPieces) => {
                                if (pasPieces.status.code === BookingAncillariesConstant.GENERAL_STATUS.AVAILABLE) {
                                    pasPieces.quantySelected = 0;
                                    pasPieces.description = speqTitle(pasPieces);
                                    trip.pieces.push(pasPieces);
                                } else if (pasPieces.status.code === 'NOT_AVAILABLE' && pasPieces.subtype === 'SURFBOARD') {
                                    pasPieces.quantySelected = pasPieces.purchasedPieces;
                                    pasPieces.description = speqTitle(pasPieces);
                                    trip.pieces.push(pasPieces);
                                }
                            });

                            for (let j = 0; j < passengersSpeqs.length; j++) {
                                if (passenger.id === passengersSpeqs[j].id) {
                                    getPiecePriceFormmated(trip);
                                    passengersSpeqs[j].trips.push(trip);
                                    isFound = true;
                                }
                            }
                            if (!isFound) {
                                getPiecePriceFormmated(trip);
                                passenger.trips.push(trip);
                                passengersSpeqs.push(passenger);
                            }
                        }
                    });
                }

            }


            return passengersSpeqs;
        };

        const generateBaggageSpeqsHaveInfo = (info: any, type: any): any => {
            let text, count;
            angular.forEach(info, (data) => {
                angular.forEach(data.trips, (trip) => {
                    text = null;
                    angular.forEach(trip.pieces, (piece) => {
                        count = 0;
                        count += piece.purchasedPieces ? piece.purchasedPieces : 0;
                        count += piece.franchisePieces ? piece.franchisePieces : 0;
                        count += piece.extraPieces && piece.extraPieces.units ? piece.extraPieces.units : 0;
                        if (count > 0) {
                            text = concatData(count, piece.description, text, type);
                        }
                    });
                    trip.text = text;
                });
            });
            return info;
        };

        const concatData = (quantity: any, description: any, text: any, type: any): any => {
            if (text === null) {
                if (type === BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE) {
                    text = quantity.toString() + ' ' +
                        (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) + ' ' + description;
                } else {
                    text = quantity.toString() + ' ' + description;
                }

            } else {
                if (type === BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE) {
                    text += ', ' + quantity.toString() + ' ' +
                        (quantity === 1 ? this.$filter('translate')('BAGGAGE_SINGULAR_TEXT') : this.$filter('translate')('BAGGAGE_PLURAL_TEXT')) + ' ' + description;
                } else {
                    text += ', ' + quantity.toString() + ' ' + description;
                }
            }
            return text;
        };



        const generatePassengersInfoSpecialMeals = (bookingInfo: any): any => {
            const pasInfo = [];
            angular.forEach(bookingInfo.passengers, (pas) => {
                pasInfo.push({
                    id: pas.passengerId,
                    name: pas.externalPersonalInfo ? pas.externalPersonalInfo.name : pas.personalInfo.name,
                    surname: pas.externalPersonalInfo ? pas.externalPersonalInfo.firstSurname + ' ' + pas.externalPersonalInfo.lastSurname : pas.personalInfo.surname,
                    infant: pas.passengerType === BookingAncillariesConstant.TYPE_PASSENGER.INFANT,
                    relatedPassengerId: pas.relatedPassengerId
                });
            });

            return pasInfo;
        };

        const generateNumSelectSpecial = (specialMeal: any): any => {
            let contSpecialMeal;
            let w;

            contSpecialMeal = 0;
            for (w = 0; w < specialMeal.length; w++) {
                if (specialMeal[w].type === BookingAncillariesConstant.TYPES.MEAL && specialMeal[w].serviceCode !== 'standard') {
                    contSpecialMeal++;
                }
            }
            return contSpecialMeal;
        };

        const countBaggageTotal = (passengers: any): any => {
            let count = 0;
            angular.forEach(passengers, (passenger) => {
                angular.forEach(passenger.trips, (trip) => {
                    angular.forEach(trip.pieces, (piece) => {
                        count += piece.purchasedPieces;
                        count += piece.quantySelected;
                    });
                });
            });
            return count;
        };
        const countSpeqsTotal = (passengers): any => {
            let count = 0;
            angular.forEach(passengers, (passenger) => {
                angular.forEach(passenger.trips, (trip) => {
                    angular.forEach(trip.pieces, (piece) => {
                        count += piece.purchasedPieces;
                    });
                });
            });
            return count;
        };

        const countSeatsTotal = (orderItems: any): any => {
            let count = 0;
            angular.forEach(orderItems, (item) => {
                if (item.type.toLowerCase() === BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT.toLowerCase()) {
                    count += 1;
                }
            });
            return count;
        };

        const generatePreorderInfo = (ancillarie: any, transformedInfo: any): any => {
            const preOrderConfig = {
                currency: ancillarie.currency,
                info: ancillarie.externalUrl,
                status: ancillarie.status,
                type: ancillarie.type,
                name: BookingAncillariesConstant.PREORDER_CONFIGURATION.NAME,
                cardCols: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDCOLS,
                cardType: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTYPE,
                cardImg: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDIMG,
                cardTitle: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTITLE,
                cardText: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDTEXT,
                cardSubtext: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDSUBTEXT,
                cardSubtextSelect: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDSUBTEXTSELECT,
                cardButton: BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDBUTTON,
                confirmed: this.CommonsSessionStorageService.get('hasPreorderAncillarie'),
                selectedFlex: null,
                modal: BookingAncillariesConstant.PREORDER_CONFIGURATION.MODAL,
                datalayer: BookingAncillariesConstant.DATALAYER_INFO.PREORDER_OPEN,
                cardPriceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, Math.floor(parseFloat(BookingAncillariesConstant.PREORDER_CONFIGURATION.CARDPRICE)), false, false)
            };
            return preOrderConfig;
        };


        const generateAncillariesTripsBaggages = (ancillariesBaggagesInfo: any): any => {
            const segmentList = [];
            if(ancillariesBaggagesInfo.slices[0]) {
                segmentList.push(ancillariesBaggagesInfo.slices[0].id);
            }
            return segmentList;
        };
        const generateSlicesSeatInfo = (ancillariesSeatInfo: any): any => {
            const segmentList = [], passengerList = [], orderSegmentList = [], segmentsOrderedAvailable = [],
                segmentsSeatAvailable = [];

            angular.forEach(cachedData.order.slices, (slice) => {
                angular.forEach(slice.segments, (segment) => {
                    orderSegmentList.push(segment.id);
                });
            });

            angular.forEach(ancillariesSeatInfo.segments, (segment) => {
                angular.forEach(segment.passengers, (pas) => {
                    if (passengerList.indexOf(pas) === -1) {
                        passengerList.push(pas);
                    }
                });
                if (segment.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    segmentsSeatAvailable.push(segment.id);
                }
                segmentList.push(segment.id);
            });

            for (let i = 0; i < orderSegmentList.length; i++) {
                if (segmentList.indexOf(orderSegmentList[i]) !== -1) {
                    segmentsOrderedAvailable.push(orderSegmentList[i]);
                }
            }
            this.CommonsSessionStorageService.set('seatsAvailableSegments', segmentsSeatAvailable);
            this.CommonsSessionStorageService.set('ancillariesAvailableSegments', segmentsOrderedAvailable);
            this.CommonsSessionStorageService.set('ancillariesAvailablePassengers', passengerList);

            return segmentsOrderedAvailable;
        };

        const meals = generateMealsPreSelected(cachedData);
        if (meals.length) {
            isMeals = true;
        }
        transformedInfo.currency = this.CommonsSessionStorageService.get('currency');
        const copyCurrency = {... transformedInfo.currency};
        copyCurrency.decimals = 0;
        copyCurrency.numberDecimals = 0;
        transformedInfo.isCurrencyLong = this.AncillariesTemporalUtilsService.isCurrencyLong(transformedInfo.currency.code);
        for (i = 0; i < ancillariesInfo.ancillaries.length; i++) {
            if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE) {
                ancilleriesBaggageInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.ancillariesTripsBaggages = generateAncillariesTripsBaggages(ancilleriesBaggageInfo);
                transformedInfo.baggageAvailable = ancilleriesBaggageInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.baggageAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancilleriesBaggageInfo.type);
                    transformedInfo.baggageAvailablePrice.priceFrom = this.CurrencyService.formatPrice(copyCurrency, ancilleriesBaggageInfo.priceFrom, true, false);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.SEAT) {
                ancillariesSeatInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.seatsAvailable.status = ancillariesSeatInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.seatsAvailable.status) {
                    transformedInfo.ancillariesAvailable.push(ancillariesSeatInfo.type);
                    transformedInfo.ancillariesTrips = generateSlicesSeatInfo(ancillariesSeatInfo);
                    transformedInfo.seatsAvailable.priceFrom = getMinPriceSeat(ancillariesSeatInfo.segments, copyCurrency);
                    transformedInfo.seatsQuanty = 0;
                    const segmentsWithAvailableSeats = [];
                    for(let j = 0; j < ancillariesInfo.ancillaries.length; j++) {
                        if(ancillariesInfo.ancillaries[j].type.toLowerCase() === 'seat') {
                            for(let k = 0; k < ancillariesInfo.ancillaries[j].segments.length; k++) {
                                if(ancillariesInfo.ancillaries[j].segments[k].status.code.toLowerCase() === 'available') {
                                    segmentsWithAvailableSeats.push(ancillariesInfo.ancillaries[j].segments[k].id);
                                }
                            }
                        }
                    }
                    for(let j = 0; j < cachedData.order.orderItems.length; j++) {
                        if(cachedData.order.orderItems[j].type.toLowerCase() === 'seat') {
                            for(let k = 0; k < segmentsWithAvailableSeats.length; k++) {
                                if(cachedData.order.orderItems[j].segmentId === segmentsWithAvailableSeats[k]) {
                                    transformedInfo.seatsQuanty++;
                                }
                            }
                        }
                    }
                    this.CommonsSessionStorageService.set('seatsQuanty', transformedInfo.seatsQuanty);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.THIRD_PARTY_COMPANIES) {
                const thirdPartyCompanies = ancillariesInfo.ancillaries[i];
                transformedInfo.thirdPartyCompanies = generateThirdPartyCompanies(thirdPartyCompanies, cachedData);
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.SPECIAL_MEALS) {
                const ancilleriesSpecialMealInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.specialMealsInfo.specialMealIsClose = false;
                if (ancilleriesSpecialMealInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.specialMealsInfo.specialMealAvailable = true;
                } else {
                    if (ancilleriesSpecialMealInfo.segments) {
                        for (j = 0; j < ancilleriesSpecialMealInfo.segments.length; j++) {
                            const statusSegment = ancilleriesSpecialMealInfo.segments[j].status;
                            if (statusSegment.reason === BookingAncillariesConstant.SPECIAL_MEALS_NOT_AVAILABLE_REASONS.LESS_THAN_ONE_DAYS && isMeals) {
                                transformedInfo.specialMealsInfo.specialMealAvailable = true;
                                transformedInfo.specialMealsInfo.specialMealIsClose = true;
                            }
                        }
                    }
                }

                if (ancilleriesSpecialMealInfo.specialMeals) {
                    transformedInfo.specialMealsInfo.specialMealListOptions = ancilleriesSpecialMealInfo.specialMeals;
                }
                transformedInfo.specialMealsInfo.specialMealSegments = generateSegmentSpecialMeal(ancilleriesSpecialMealInfo, cachedData);
                transformedInfo.specialMealsInfo.passengersInfo = generatePassengersInfoSpecialMeals(cachedData);
                transformedInfo.specialMealsInfo.orderedMeals = generateMealsPreSelected(cachedData);
                transformedInfo.specialMealsInfo.specialMealNumSelected = generateNumSelectSpecial(transformedInfo.specialMealsInfo.orderedMeals);

                if (transformedInfo.specialMealsInfo.specialMealAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancilleriesSpecialMealInfo.type);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS) {
                const ancillariesSpeqsInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.ancillariesTripsSpeqs = generateAncillariesTripsBaggages(ancillariesSpeqsInfo);
                if (ancillariesSpeqsInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesSpeqsInfo.type);
                    transformedInfo.passengerSpeqsTrips = generateBaggageSpeqsHaveInfo(generateSpeqsTripsInformation(ancillariesInfo.slices, ancillariesSpeqsInfo.slices, cachedData), BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS);
                    transformedInfo.speqsAvailablePrice.priceFrom = this.CurrencyService.formatPrice(copyCurrency, ancillariesSpeqsInfo.priceFrom, true, false);
                    transformedInfo.speqsQuanty = countSpeqsTotal(transformedInfo.passengerSpeqsTrips);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE) {
                ancillariesInsuranceInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.insuranceAvailable = ancillariesInsuranceInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.insuranceAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInsuranceInfo.type);
                    transformedInfo.insuranceInfo.countriesList = ancillariesInfo.ancillaries[i].countriesAllowed;
                    transformedInfo.insuranceInfo.priceZero = this.CurrencyService.formatPrice(transformedInfo.currency, 0, true, false);
                    transformedInfo.insuranceInfo.priceFrom = this.CurrencyService.formatPrice(copyCurrency, ancillariesInfo.ancillaries[i].offers[0].premium, true, false);
                    transformedInfo.insuranceInfo.conditionsUri = ancillariesInfo.ancillaries[i].offers[0].termsAndConditionsDocumentURI;
                    transformedInfo.insuranceInfo.id = ancillariesInfo.ancillaries[i].offers[0].code;
                    countryInsurance = ancillariesInfo.ancillaries[i].issueCountry;
                    transformedInfo.insuranceInfo.consent = ancillariesInfo.ancillaries[i].offers[0].consent;
                }
            } else if ((ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID) || (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_AVIOS)) {
                const ancillariesUpgradingBidsInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.bidsUpgradingInfo.bidsClosed = this.controlUpgradingBidsStatusClosed(transformedInfo);
                transformedInfo.bidsUpgradingInfo.bidsBlocked = this.checkBlockedBidsOffers(transformedInfo);
                if ((transformedInfo.bidsUpgradingInfo.bidsClosed || transformedInfo.bidsUpgradingInfo.bidsBlocked) && ancillariesInfo.ancillaries[i].type !== BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_AVIOS) {
                    /*transformedInfo.bidsUpgradingInfo.bidsAvailable = true;
                    transformedInfo.ancillariesAvailable.push(ancillariesUpgradingBidsInfo.type);*/
                    transformedInfo.bidsUpgradingInfo.ancillariesTripsFinished = this.generateSlicesUpgradingBidsInfoOnlyFinishedBids();
                }
                if (this.upgIsReallyAvailable(ancillariesUpgradingBidsInfo, transformedInfo.bidsUpgradingInfo.bidsClosed, transformedInfo.bidsUpgradingInfo.bidsBlocked)) {
                    transformedInfo.ancillariesAvailable.push(ancillariesUpgradingBidsInfo.type);
                    transformedInfo.bidsUpgradingInfo.bidsSegments = this.ancillariesUpgradingTransformer.generateAvailableCabins(ancillariesUpgradingBidsInfo, transformedInfo.bidsUpgradingInfo.bidsSegments);
                    transformedInfo.bidsUpgradingInfo.bidsOpen = this.controlUpgradingBidsStatusOpen(transformedInfo);
                    if (ancillariesUpgradingBidsInfo.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID) {
                        transformedInfo.bidsUpgradingInfo.priceFrom = this.calculatePriceFromUpgBid(transformedInfo.bidsUpgradingInfo.bidsSegments, transformedInfo.currency);
                        transformedInfo.bidsUpgradingInfo.bidsAvailable = true;
                        this.CommonsSessionStorageService.set('flowAviosOrBid', 'bidFlow');
                        if (transformedInfo.bidsUpgradingInfo.priceFrom === 0 && transformedInfo.bidsUpgradingInfo.bidsSegments.length === 0) {
                            this.CommonsSessionStorageService.set('blockedContinueSection', true);
                        }
                    }
                    if (ancillariesUpgradingBidsInfo.type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_AVIOS && ancillariesInfo.ancillaries[i].status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                        transformedInfo.bidsUpgradingInfo.priceFrom = this.calcAviosFrom(transformedInfo.bidsUpgradingInfo.bidsSegments);
                        transformedInfo.bidsUpgradingInfo.aviosBalance = this.ancillariesUpgradingTransformer.getTotalUserAviosFormated(ancillariesUpgradingBidsInfo);
                        const offer = ancillariesUpgradingBidsInfo.offers.find(offer => offer.subType === 'FREE');
                        if(offer) {
                            transformedInfo.bidsUpgradingInfo.priceFrom = 0;
                            transformedInfo.bidsUpgradingInfo.freePossibility = true;
                            transformedInfo.bidsUpgradingInfo.freeUpgradesAvailable = this.ancillariesUpgradingTransformer.sumTotalOffers(offer);
                            if(!transformedInfo.bidsUpgradingInfo.bidsSegments) {
                                transformedInfo.bidsUpgradingInfo.bidsSegments = this.ancillariesUpgradingTransformer.getMapAvailableFreeCabins(offer);
                            }
                            transformedInfo.bidsUpgradingInfo.bidsSegments = this.ancillariesUpgradingTransformer.generateAvaibleFreeCabins(offer.segments, transformedInfo.bidsUpgradingInfo.bidsSegments);
                        }
                        transformedInfo.bidsUpgradingInfo.subtype = ancillariesUpgradingBidsInfo.offers[0].subType;
                        transformedInfo.bidsUpgradingInfo.aviosBidAvailable  = true;
                        this.CommonsSessionStorageService.set('flowAviosOrBid', 'aviosFlow');
                        if(transformedInfo.bidsUpgradingInfo.bidsAvailable) {
                            this.CommonsSessionStorageService.set('flowAviosOrBid', 'aviosBidFlow');
                        }
                    }
                    if (transformedInfo.bidsUpgradingInfo.ancillariesTrips.length === 0 || transformedInfo.bidsUpgradingInfo.aviosBidAvailable || transformedInfo.bidsUpgradingInfo.bidsClosed) {
                        transformedInfo.bidsUpgradingInfo.ancillariesTrips = this.generateSlicesUpgradingBidsInfo(ancillariesInfo.slices, transformedInfo.bidsUpgradingInfo.bidsSegments, cachedData, transformedInfo.currency, upgradingBidsSlicesInfoResult, false);
                    }
                }
                if (transformedInfo.bidsUpgradingInfo.ancillariesTripsFinished.length > 0) {
                    transformedInfo.bidsUpgradingInfo.ancillariesTrips = transformedInfo.bidsUpgradingInfo.ancillariesTrips.concat(transformedInfo.bidsUpgradingInfo.ancillariesTripsFinished);
                    transformedInfo.bidsUpgradingInfo.ancillariesTrips.sort((a, b) => {
                        const dateA: any = new Date(a.dateToOrder), dateB: any = new Date(b.dateToOrder);
                        return dateA - dateB;
                    });
                }
                this.CommonsSessionStorageService.set('upgradingBidsInfo', transformedInfo.bidsUpgradingInfo);
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.PREORDER) {
                if (ancillariesInfo.ancillaries[i].status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInfo.ancillaries[i].type);
                    transformedInfo.preorderAncillarieInfo = generatePreorderInfo(ancillariesInfo.ancillaries[i], transformedInfo);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.PRIORITY_BOARDING) {
                if (ancillariesInfo.ancillaries[i].status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInfo.ancillaries[i].type);
                    transformedInfo.priorityBoardingInfo = generatePriorityBoardingInfo(copyCurrency, ancillariesInfo.slices, ancillariesInfo.ancillaries[i], cachedData);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INTEGRATED_BOB) { // TODO: MMB test
                const ancillariesBobInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.bobAvailable = ancillariesBobInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.bobAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesBobInfo.type);
                    transformedInfo.bobInfo.slices = ancillariesBobInfo.slices;
                    transformedInfo.bobInfo.priceFrom = this.CurrencyService.formatPrice(transformedInfo.bobInfo.slices[0].products[0].currency, transformedInfo.bobInfo.slices[0].products[0].price, false, false);
                    this.CommonsSessionStorageService.set('bobInfo', transformedInfo.bobInfo);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.CO2_FOOTPRINT) {
                const ancillariesCarbonFootprintInfo = ancillariesInfo.ancillaries[i];
                if (ancillariesCarbonFootprintInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesCarbonFootprintInfo.type);
                    transformedInfo.ancillariesCarbonFootprint = {
                        price: ancillariesCarbonFootprintInfo.price,
                        priceFormatted: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesCarbonFootprintInfo.price, true, false),
                        priceFrom: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesCarbonFootprintInfo.price, true, false),
                        kilosCo2Equivalent: ancillariesCarbonFootprintInfo.kilosCo2Equivalent,
                        kilosCo2EquivalentFormatted: ancillariesCarbonFootprintInfo.kilosCo2Equivalent ? ancillariesCarbonFootprintInfo.kilosCo2Equivalent.toString().replace('.', ',') : ''
                    };
                    this.CommonsSessionStorageService.set('co2Footprint', transformedInfo.ancillariesCarbonFootprint);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_WAITING_LIST) {
                const ancillariesUpgradingWaitingList = ancillariesInfo.ancillaries[i], isWaitingList = true;
                if (ancillariesUpgradingWaitingList.status.code === BookingAncillariesConstant.STATUS.AVAILABLE) {
                    transformedInfo.ancillariesAvailable.push(ancillariesUpgradingWaitingList.type);
                    transformedInfo.bidsUpgradingInfo.waitingListAvailable  = true;
                    for (x = 0; x < ancillariesUpgradingWaitingList.waitingList.coupons.length; x++) {
                        transformedInfo.bidsUpgradingInfo.freeUpgradesAvailable += ancillariesUpgradingWaitingList.waitingList.coupons[x].numToUse;
                    }
                    transformedInfo.bidsUpgradingInfo.bidsSegmentsWL = ancillariesUpgradingWaitingList.waitingList.segments;
                    transformedInfo.bidsUpgradingInfo.ancillariesTripsWL = this.generateSlicesUpgradingBidsInfo(ancillariesInfo.slices, ancillariesUpgradingWaitingList.waitingList.segments, cachedData, transformedInfo.currency, upgradingBidsSlicesInfoResult, isWaitingList);
                    this.CommonsSessionStorageService.set('waitingListInfo', ancillariesUpgradingWaitingList);
                    this.CommonsSessionStorageService.set('flowAviosOrBid', 'waitingList');
                    this.CommonsSessionStorageService.set('upgradingBidsInfo', transformedInfo.bidsUpgradingInfo);
                }
            } else if (ancillariesInfo.ancillaries[i].type === BookingAncillariesConstant.TYPE_ANCILLARIE.INSURANCE_ALLIANZ) {
                ancillariesInsuranceInfo = ancillariesInfo.ancillaries[i];
                transformedInfo.insuranceAllianzFusionAvailable = ancillariesInsuranceInfo.status.code === BookingAncillariesConstant.STATUS.AVAILABLE;
                if (transformedInfo.insuranceAllianzFusionAvailable) {
                    transformedInfo.ancillariesAvailable.push(ancillariesInsuranceInfo.type);
                    transformedInfo.insuranceInfo = ancillariesInfo.ancillaries[i].locations[0];
                    transformedInfo.insuranceInfo.countriesRequiredInfo = ancillariesInfo.ancillaries[i].countriesRequiredInfo;
                    transformedInfo.insuranceInfo.countriesList = [];
                    transformedInfo.insuranceInfo.priceZero = null;
                    transformedInfo.insuranceInfo.conditionsUri = '';
                    transformedInfo.insuranceInfo.id = null;
                    countryInsurance = '';
                    transformedInfo.insuranceInfo.issueCountry = '';
                    transformedInfo.insuranceInfo.consent = '';
                    transformedInfo.insuranceInfo.priceFrom = this.allianzFusionPriceFrom (ancillariesInsuranceInfo, transformedInfo.currency);
                }
            }
        }
        if (transformedInfo.ancillariesAvailable.indexOf('UPGRADING_WAITING_LIST') !== -1)
            transformedInfo.bidsUpgradingInfo.ancillariesTrips = this.mixAncillariesTripsUpgradingInfo (transformedInfo.bidsUpgradingInfo);
        if (transformedInfo.ancillariesAvailable.indexOf('UPGRADING_AVIOS') !== -1 && transformedInfo.ancillariesAvailable.indexOf('UPGRADING_WAITING_LIST') !== -1) {
            delete transformedInfo.ancillariesAvailable[transformedInfo.ancillariesAvailable.indexOf('UPGRADING_WAITING_LIST')];
        }
        if (transformedInfo.baggageAvailable) {
            transformedInfo.passengerBaggagesTrips = generateBaggageSpeqsHaveInfo(generateBaggageTripsInformation(ancillariesInfo.slices, ancilleriesBaggageInfo.slices, cachedData), BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE);
            transformedInfo.baggagesQuanty = countBaggageTotal(transformedInfo.passengerBaggagesTrips);
        }

        if (transformedInfo.insuranceAvailable) {
            for (i = 0; i < ancillariesInsuranceInfo.offers.length; i++) {
                const numOfPassenger = getNumPassengerByInsurance(cachedData.passengers);
                const pricePerPerson = ancillariesInsuranceInfo.offers[i].premium / numOfPassenger;
                transformedInfo.ancillariesInsurance.push({
                    provider: ancillariesInsuranceInfo.provider,
                    offer: ancillariesInsuranceInfo.offerId,
                    id: ancillariesInsuranceInfo.offers[i].code,
                    name: ancillariesInsuranceInfo.offers[i].name,
                    originalPrice: ancillariesInsuranceInfo.offers[i].premium,
                    price: this.CurrencyService.formatPrice(transformedInfo.currency, ancillariesInsuranceInfo.offers[i].premium, true, false),
                    originalPricePerPerson: pricePerPerson,
                    pricePerPerson: this.CurrencyService.formatPrice(transformedInfo.currency, pricePerPerson, true, false),
                    passengerInfo: cachedData.passengers,
                    termsAndConditionsDocumentURI: ancillariesInsuranceInfo.offers[i].termsAndConditionsDocumentURI,
                    descriptionCoverages: getInsuranceDescription(ancillariesInsuranceInfo.offers[i].coverages),
                    addOns: ancillariesInsuranceInfo.offers[i].addOns,
                    consent: ancillariesInsuranceInfo.offers[i].consent
                });
            }
        }

        if (transformedInfo.ancillariesInsurance.length > 0) {
            transformedInfo.insuranceInfo.price = transformedInfo.ancillariesInsurance[0].price;
            transformedInfo.insuranceInfo.originalPrice = transformedInfo.ancillariesInsurance[0].originalPrice;
        }

        if (transformedInfo.insuranceInfo.countriesList.length > 1) {
            angular.forEach(transformedInfo.insuranceInfo.countriesList, (country) => {
                if (country.country.code === countryInsurance) {
                    transformedInfo.insuranceInfo.insuranceCountry = country;
                    transformedInfo.insuranceInfo.oldInsuranceCountry = country;
                    transformedInfo.insuranceInfo.countryInsurance = country.country.description;
                }
                if (country.passengerRequiredFields.length > 0) {
                    angular.forEach(country.passengerRequiredFields, (field) => {
                        angular.forEach(field.requiredFieldsGroups, (reqFieldGroup) => {
                            angular.forEach(reqFieldGroup.requiredFields, (reqField) => {
                                if (reqField.requiredField === 'DOCUMENT_ID') {
                                    transformedInfo.insuranceInfo.insurancePatterns[country.country.code] = reqField.pattern;
                                }
                            });
                        });
                    });
                }
            });
        }

        if (transformedInfo.insuranceInfo.insuranceCountry === null && transformedInfo.insuranceInfo.countriesList.length > 0) {
            transformedInfo.insuranceInfo.insuranceCountry = transformedInfo.insuranceInfo.countriesList[0];
            transformedInfo.insuranceInfo.oldInsuranceCountry = transformedInfo.insuranceInfo.countriesList[0];
            transformedInfo.insuranceInfo.countryInsurance = transformedInfo.insuranceInfo.countriesList[0].country.description;
        }

        if (transformedInfo.ancillariesAvailable.length > 1) {
            this.CommonsSessionStorageService.set('ancillariesSlices', ancillariesInfo.slices);
        }


        return transformedInfo;
    };

    allianzFusionPriceFrom = (allianzFusionInfo: any, currency: any) => {
        let priceFrom = 0;
        for (const product of allianzFusionInfo.products) {
            if ((priceFrom === 0 || priceFrom > product.totalPrice) && product.totalPrice !== 0) {
                priceFrom = product.totalPrice;
            }
        }
        return this.CurrencyService.formatPrice(currency, priceFrom, true, false);
    };

    formatMonthDate = (flightsInfo: any): any => {
        for (let i = 0; i < flightsInfo.length; i++) {
            const month = flightsInfo[i].departureDateParsed.formatedDate.split('/');
            flightsInfo[i].departureDateParsed.originalDate = this.$filter('date')(flightsInfo[i].departureDateParsed.originalDate, 'dd MMM yyyy');
        }
        return flightsInfo;
    };

    /**
       * Generate all the info related to upgrading bids
       * @param {object} upgradingBidsPaymentInfo info of the payment methods service
       * @param {string} issueCountry
       */
    generateModelPayMethods = (upgradingBidsPaymentInfo: any, issueCountry: any): any => {
        const creditCards = this.CommonsSessionStorageService.get('creditCardsList');
        const countriesList = this.CommonsSessionStorageService.get('countriesList');
        const currencyData: any = this.CommonsSessionStorageService.get('currency');
        const sessionUpgradingBidsInfo: any = this.CommonsSessionStorageService.get('sessionUpgradingBidsInfo');
        let flightsInfo = this.CommonsSessionStorageService.get('flightsInfo');

        flightsInfo = this.formatMonthDate(flightsInfo);
        upgradingBidsPaymentInfo.upgradingBidsSegments = sessionUpgradingBidsInfo.ancillariesTrips;
        upgradingBidsPaymentInfo.countryList = countriesList;
        upgradingBidsPaymentInfo.issueCountry = countriesList[0];
        upgradingBidsPaymentInfo.creditCards = creditCards;
        upgradingBidsPaymentInfo.flightsInfo = flightsInfo;
        upgradingBidsPaymentInfo.paymentInfo = upgradingBidsPaymentInfo.data.paymentMethods[0];
        for (let i = 0; i < upgradingBidsPaymentInfo.paymentInfo.types.length; i++) {
            upgradingBidsPaymentInfo.paymentInfo.types[i].parsedFee = this.CurrencyService.formatPrice(currencyData, upgradingBidsPaymentInfo.paymentInfo.types[i].totalFee, true, false);
            upgradingBidsPaymentInfo.paymentInfo.types[i].iconUrl = this.AncillariesTemporalUtilsService.getCreditCardIcon(upgradingBidsPaymentInfo.paymentInfo.types[i].cardTypeId, creditCards);
        }
        this.CommonsSessionStorageService.set('paymentInfoUpgradingBids', upgradingBidsPaymentInfo);
        return upgradingBidsPaymentInfo;
    };


    upgradingBidsCabins = (trip: any, passenger: any): any => {
        const cabins = [];
        for (let i = 0; i < trip.cabins.length; i++) {
            const cabinInfo = { type: '', bid: 0 };
            if (trip.cabins[i].AmountBid > 0) {
                cabinInfo.bid = passenger ? trip.cabins[i].AmountBid * passenger : trip.cabins[i].AmountBid;
                cabinInfo.type = trip.cabins[i].cabinType;
                cabins.push(cabinInfo);
            }
        }
        return cabins;
    };

    /**
        * Return the payment info of upgrading bids to update the payment
        * @param {Object} upgBidsInfoUpdated Information about the upgrading bids
        * @param {Object} selectedPaymentData Information of the payment form
        */
    transformInfoSendPay = (upgBidsInfoUpdated: any, selectedPaymentData: any, selectedcontactData: any): any => {
        const expirationYear = this.$filter('date')(selectedPaymentData.year, 'yy');
        const transformUpgBidsInfoUpdated: any = {
            type: BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID,
            segments: [],
            paymentInfo: {}
        };
        const segmentCabins = { id: '', cabins: [] };
        transformUpgBidsInfoUpdated.paymentInfo.cardTypeId = selectedPaymentData.selectedCard.cardTypeId;
        transformUpgBidsInfoUpdated.paymentInfo.cardNumber = selectedPaymentData.cardNumber;
        transformUpgBidsInfoUpdated.paymentInfo.expiration = selectedPaymentData.month + expirationYear.toString();
        transformUpgBidsInfoUpdated.paymentInfo.personalInfo = { name: selectedcontactData.ownerName, surname: selectedcontactData.surname };
        transformUpgBidsInfoUpdated.paymentInfo.contactInfo = { phone: selectedPaymentData.phone, email: selectedPaymentData.email };
        angular.forEach(upgBidsInfoUpdated.ancillariesTrips, (trip) => {
            if (trip.cabins) {
                segmentCabins.id = trip.id;
                segmentCabins.cabins = this.upgradingBidsCabins(trip, null);
                if (segmentCabins.cabins.length > 0) {
                    transformUpgBidsInfoUpdated.segments.push(segmentCabins);
                }
            }
        });
        return transformUpgBidsInfoUpdated;
    };

    upgradeBidsAviosUpdate = (data: any, passengersData: any) => {

        const upgradeBidsRequest = (aviosBids: any): any => {
            const response = {
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID,
                segments: aviosBids.ancillariesTrips.reduce((filtered, trip) => {
                    const cabins = trip.cabins?.reduce((cabinsFiltered, cabin) => {
                        if (cabin.AmountBid > 0 && (cabin.AmountBid !== cabin.currentBidByPax)) {
                            cabinsFiltered.push({ cabin: cabin.cabinType, amountPax: cabin?.AmountBid});
                        }
                        return cabinsFiltered;
                    }, []);
                    if (cabins && cabins.length > 0) {
                        filtered.push({ id: trip.id, cabins: cabins });
                    }
                    return filtered;
                }, [])
            };
            return response.segments.length > 0 ? response: null;
        };
        const upgradeAviosRequest = (aviosBids: any): any => {
            let existFree = false, existStandard = false;
            const segmentsListAvios = aviosBids.ancillariesTrips.reduce((filteredAvios, trip) => {
                const segmentsAvios = trip.cabins?.reduce((cabinFiltered, cabin) => {
                    if (cabin.selectedOffers === TypesBidEnum.STANDARD) {
                        existStandard = true;
                        cabinFiltered.push({ id: cabin.id, cabinType: cabin.cabinType });
                    }
                    return cabinFiltered;
                }, []);
                if (segmentsAvios && segmentsAvios.length > 0) {
                    filteredAvios.push(segmentsAvios);
                }
                return filteredAvios;
            }, []).flat();
            const segmentsListFree = aviosBids.ancillariesTrips.reduce((filteredFree, trip) => {
                const segmentsFree = trip.cabins?.reduce((cabinFiltered, cabin) => {
                    if (cabin.selectedOffers === TypesBidEnum.FREE) {
                        cabin.avios = 0;
                        cabin.formatAvios = '0';
                        existFree = true;
                        cabinFiltered.push({ id: cabin.id, cabinType: cabin.cabinType });
                    }
                    return cabinFiltered;
                }, []);
                if (segmentsFree && segmentsFree.length > 0) {
                    filteredFree.push(segmentsFree);
                }
                return filteredFree;
            }, []).flat();
            const response = {
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_AVIOS,
                offers: []
            };
            if(existStandard) {
                const offerStandard = {
                    subType: aviosBids.subtype,
                    segments: segmentsListAvios
                };
                response.offers.push(offerStandard);
            }
            if(existFree) {
                const offerFree = {
                    subType: 'FREE',
                    segments: segmentsListFree
                };
                response.offers.push(offerFree);
            }
            return response.offers.length > 0 ? response : null;
        };
        const arr = [];
        if(data.bidsAvailable) {
            const upgBidsrequest = upgradeBidsRequest(data);
            if(upgBidsrequest) {
                arr.push(upgBidsrequest);
            }
        }
        if(data.aviosBidAvailable) {
            const upgAviosrequest = upgradeAviosRequest(data);
            if(upgAviosrequest) {
                arr.push(upgAviosrequest);
            }
        }
        return arr;
    };

    deleteBidsCabins = (trip: any): any => {
        const cabins = [];
        for (const cabin of trip.cabins) {
            if (cabin.AmountBid > 0 || cabin.avios > 0) {
                cabins.push(cabin.cabinType);
            }
        }
        return cabins;
    };

    deleteBidsAviosRequest = (upgBidsInfoUpdated) => {

        const deleteBidsRequest = (upgBidsInfoUpdated: any): any => {
            const response = {
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.UPGRADING_BID,
                segments: upgBidsInfoUpdated.ancillariesTrips.reduce((filtered, trip) => {
                    const cabins = trip.cabins.reduce((cabinsFiltered, cabin) => {
                        if (cabin.AmountBid > 0) {
                            cabinsFiltered.push({ type: cabin.cabinType, bid: cabin?.AmountBid });
                        }
                        return cabinsFiltered;
                    }, []);
                    if (cabins.length > 0) {
                        filtered.push({ id: trip.id, cabins: cabins });
                    }
                    return filtered;
                }, [])
            };
            return response.segments.length > 0 ? response: null;
        };
        const deleteAviosRequest = (upgBidsInfoUpdated: any): any => {
            const segmentsList = upgBidsInfoUpdated.ancillariesTrips.reduce((filtered, trip) => {
                const segments = trip.cabins.reduce((cabinFiltered, cabin) => {
                    if (cabin.selectedOffers === TypesBidEnum.STANDARD || cabin.selectedOffers === TypesBidEnum.FREE) {
                        cabinFiltered.push({ id: cabin.id, cabinType: cabin.cabinType });
                    }
                    return cabinFiltered;
                }, []);
                if (segments.length > 0) {
                    filtered.push(segments);
                }
                return filtered;
            }, []).flat();
            const response = {
                type: 'UPGRADING_AVIOS'
            };
            return segmentsList.length > 0 ? response : null;
        };
        const arr = [];
        if(upgBidsInfoUpdated.bidsAvailable) {
            const upgBidsrequest = deleteBidsRequest(upgBidsInfoUpdated);
            if(upgBidsrequest) {
                arr.push(upgBidsrequest);
            }
        }
        if(upgBidsInfoUpdated.aviosBidAvailable) {
            const upgAviosrequest = deleteAviosRequest(upgBidsInfoUpdated);
            if(upgAviosrequest) {
                arr.push(upgAviosrequest);
            }
        }
        return arr;
    };

    /**
      * Return the confirmation payment info of upgrading
      */
    transformInfoSendToConfirmation = (): any => {
        const upgBidsSegmentsInfo = [];
        const infoUpgBidsofUpdatedData: any = this.CommonsSessionStorageService.get('infoUpgBidsofUpdatedData');
        const pnrInfo = this.CommonsSessionStorageService.get('PNR');
        const flightsInfo: any = this.CommonsSessionStorageService.get('upgradingPaymentsInfo');
        const upgBidsInfoUpdated: any = this.CommonsSessionStorageService.get('sessionUpgradingBidsInfo');
        for (let i = 0; i < flightsInfo.flightsInfo.length; i++) {
            let j = 0;
            let isFound = false;
            while (j < upgBidsInfoUpdated.ancillariesTrips.length && !isFound) {
                if (flightsInfo.flightsInfo[i].segmentId === upgBidsInfoUpdated.ancillariesTrips[j].id && upgBidsInfoUpdated.ancillariesTrips[j].hasBid) {
                    const segment = {
                        cabins: upgBidsInfoUpdated.ancillariesTrips[j].cabins,
                        passengers: upgBidsInfoUpdated.ancillariesTrips[j].passengers,
                        departure: upgBidsInfoUpdated.ancillariesTrips[j].departure,
                        arrival: upgBidsInfoUpdated.ancillariesTrips[j].arrival,
                        departureDateParsed: upgBidsInfoUpdated.ancillariesTrips[j].departureDateParsed,
                        departureDateTimeParsed: flightsInfo.flightsInfo[i].departureDateTimeParsed,
                        arrivalDateParsed: upgBidsInfoUpdated.ancillariesTrips[j].arrivalDateParsed,
                        arrivalDateTimeParsed: flightsInfo.flightsInfo[i].arrivalDateTimeParsed,
                        marketingFlightCode: flightsInfo.flightsInfo[i].flight.operationalDisclosure + flightsInfo.flightsInfo[i].flight.marketingFlightNumber,
                        operationalCarrierName: flightsInfo.flightsInfo[i].flight.operationalCarrier.name,
                        companyURL: flightsInfo.flightsInfo[i].companyURL,
                        departureTerminal: flightsInfo.flightsInfo[i].departure.terminal,
                        arrivalTerminal: flightsInfo.flightsInfo[i].arrival.terminal,
                        departureName: flightsInfo.flightsInfo[i].departure.name,
                        arrivalName: flightsInfo.flightsInfo[i].arrival.name
                    };
                    upgBidsSegmentsInfo.push(segment);
                    isFound = true;
                }
                j++;
            }
        }
        upgBidsInfoUpdated.upgBidsSegmentsInfo = upgBidsSegmentsInfo;
        upgBidsInfoUpdated.pnr = pnrInfo;
        upgBidsInfoUpdated.contactEmail = infoUpgBidsofUpdatedData.paymentInfo.contactInfo.email;
        return upgBidsInfoUpdated;
    };

    /**
     * Creación de metodo que devuelve la estructura correcta del ancillaries
     * para que se pueda hacer su transformer correspondiente
     * @param passengers
     * @returns
     */
    genStructureForAncillaries = (passengers) => {
        return passengers.map((passengers) => ({
            id: passengers.id,
            trips: passengers.trips
        }));
    };

    /**
     * Creación de metodo que devuelve la estructura con el ID correcto
     * para que se pueda hacer su transformer correspondiente
     * @param passen
     * @returns
     */
    genStructureForCKIAncillaries = (type, passen) => {
        if(type === 'CKI') {
            const pass: any = this.CommonsSessionStorageService.get('bookingInfo');
            const LS_passenger = pass.passengers;
            passen.forEach((myObject, index) => {
                LS_passenger[index].id < 10 ? LS_passenger[index].id = '0' + LS_passenger[index].id : LS_passenger[index].id;
                myObject.id = LS_passenger[index].type + '_' + LS_passenger[index].id;
            });
        }

        return passen;
    };


    genReqAviosAncillariesBaggages = (passengersData: any[]) => {
        const ancillariesSlices: any[] = this.CommonsSessionStorageService.get('ancillariesSlices');
        passengersData = this.genStructureForCKIAncillaries(this.CommonsSessionStorageService.get('flowApp'), passengersData);
        return passengersData.map((passenger) => ({
            id: passenger.id,
            ancillaries: passenger.trips.flatMap((trip) => trip.pieces.map((baggage) => ({
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.BAGGAGE,
                subType: baggage.subtype,
                slices: [{
                    id: trip.id,
                    amounts: baggage.availablePriceRanges.filter(price => price.from <= baggage.quantySelected).map(price => ({
                        fare: price.amount,
                        quantity: Math.min(((price.to - price.from) + 1), ((baggage.quantySelected - price.from) + 1))
                    })),
                    segments: ancillariesSlices.find(el => el.id === trip.id)?.segmentIds.map(seg => ({
                        id: seg
                    })) || []
                }]
            }))).filter((el) => el.slices[0].amounts.length > 0)
        }));
    };
    //Prioridad de embarque
    genAviosPriorityReq = (priorityBoarding: any[]) => {
        priorityBoarding = this.genStructureForCKIAncillaries(this.CommonsSessionStorageService.get('flowApp'), priorityBoarding);
        const ancillariesSlices: any[] = this.CommonsSessionStorageService.get('ancillariesSlices');
        return priorityBoarding.map(passenger => ({
            id: passenger.id,
            ancillaries: [{
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.PRIORITY_BOARDING,
                slices: passenger.trips.reduce((arr, segment) => {
                    if (segment.checkedTrip) {
                        const sliceId = ancillariesSlices.find(slice => slice.segmentIds.includes(segment.id))?.id;
                        const i = arr.findIndex(el=>el.id === sliceId);
                        if (i >= 0) {
                            arr[i].segments.push({id: segment.id,
                                amounts: [{
                                    fare: segment.amount,
                                    quantity: 1
                                }]});
                        } else {
                            arr.push({
                                id: sliceId,
                                segments: [{
                                    id: segment.id,
                                    amounts: [{
                                        fare: segment.amount,
                                        quantity: 1
                                    }]
                                }]
                            });
                        }
                    }
                    return arr;
                }, [])
            }]
        }));
    };
    //equipajes especiales
    genAviosSpeqReq = (speqs: any[]) => {
        const ancillariesSlices: any[] = this.CommonsSessionStorageService.get('ancillariesSlices');
        speqs = this.genStructureForCKIAncillaries(this.CommonsSessionStorageService.get('flowApp'), speqs);
        return speqs.map((speq) => ({
            id: speq.id,
            ancillaries: speq.trips.flatMap((trip) => trip.pieces.map((piece) => ({
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.SPEQS,
                subType: piece.subtype,
                slices: [{
                    id: trip.id,
                    amounts: piece.availablePriceRanges.map(price=> ({fare: price.amount, quantity: piece.quantySelected})).reduce((arr, el) => {
                        if (el.quantity > 0) arr.push(el);
                        return arr;
                    }, []),
                    segments: ancillariesSlices.find(el => el.id === trip.id)?.segmentIds.map(seg => ({
                        id: seg
                    })) || []
                }]
            }))).filter((el) => el.slices[0].amounts.length > 0)
        }));
    };

    genAviosFlexOnDemandReq = (flexData) => {
        const ancillariesSlices: any[] = this.CommonsSessionStorageService.get('ancillariesSlices');
        return flexData.passengerPrices.map(passenger => ({
            id: passenger.id,
            ancillaries: [{
                type: BookingAncillariesConstant.TYPE_ANCILLARIE.FLEXIBILITY,
                subType: flexData.subtype,
                amounts: [{
                    fare: passenger.amount,
                    quantity: 1
                }],
                slices: [{
                    id: ancillariesSlices[0].id,
                    segments: [{
                        id: ancillariesSlices[0].segmentIds[0]
                    }]
                }]
            }]}));
    };
    genAviosAncillariesReq = (ancillariesArr: any[]) => {
        const flightInfo: any = this.CommonsSessionStorageService.get('flightAviosInfo');
        try {
            flightInfo.passengers.forEach(passenger => {
                const ancillary = ancillariesArr.find(anci => anci.id === passenger.id);
                delete passenger.flight;
                if (ancillary) {
                    passenger.ancillaries = ancillary.ancillaries;
                }else{
                    passenger.ancillaries = [];
                }
            });
            return flightInfo;
        } catch (error) {
            return {};
        }
    };

    //request general Ancillaries
    genAviosAncillariesSummaryReq = (ancillariesPassengers, type) => {
        const flightInfo: any = this.CommonsSessionStorageService.get('flightAviosInfo');
        const updateAncillaries = (passengersArray, ancillariesArray, type) => {
            passengersArray.forEach(passenger => {
                const newAncillaries = ancillariesArray.find(el=>el.id === passenger.id)?.ancillaries;
                if (passenger.ancillaries) {
                    passenger.ancillaries = passenger.ancillaries.filter((typ) => {
                        return typ.type !== type;
                    });
                    newAncillaries.forEach(ancillary => passenger.ancillaries.push(ancillary));
                } else {
                    passenger.ancillaries = newAncillaries;
                }
            });

            return passengersArray;
        };

        try {
            this.CommonsSessionStorageService.set('flightAviosInfo', {
                currency: flightInfo.currency,
                flight: flightInfo.flight,
                passengers: updateAncillaries(flightInfo.passengers, ancillariesPassengers, type)
            });
        } catch (error) {
            return {};
        }
    };

    TransCalcPointsData = (data) => {
        return data.passengers.map(passenger => ({
            id: passenger.id,
            ancillaries: passenger.ancillaries.map(ancillary => ({
                code: ancillary.code,
                subCode: ancillary.subCode,
                monetaryAmount: ancillary.monetaryAmount
            })),
            totalMonetaryAmount: passenger.totalMonetaryAmount
        }));
    };
    deleteAncillaryByType = (segId: string, type: string, passengers: any[]): any[] => {
        const ancillariesSlices: any[] = this.CommonsSessionStorageService.get('ancillariesSlices');
        const sliceId = ancillariesSlices.find(anc => anc.segmentIds.includes(segId))?.id || null;
        return passengers.map(passenger => ({
            ...passenger, ancillaries: passenger.ancillaries?.map(anc => ({...anc,  slices: anc.slices.filter(slice => !((type === anc.type) && (sliceId === slice.id)))})).filter(anc => anc.slices.length > 0)
        }));
    };
    deleteAncillaryBySubType = (sliceId: string, subType: string, passengers: any[]): any[] => passengers.map(passenger => ({
        ...passenger,
        ancillaries: sliceId ? passenger.ancillaries?.filter(anc => !((subType === anc.subType) && (sliceId === anc.slices[0].id))) : passenger.ancillaries?.filter(anc => (subType !== anc.subType))
    }));

    genCalAviosFligthReq = (summaryInfo) => {
        const passengerIdBuilder = (id, type) => `${type}_${id < 9 ? '0'+id : id}`;
        return {
            currency: {code: summaryInfo?.currencies[0]?.code},
            flight: {
                yq: 0,
                discounts:[],
                slices: summaryInfo.context?.slices.map((slice)=>({
                    id: slice.id,
                    segments: summaryInfo.context.segments
                        .filter(segment => slice.segmentIds[0] === segment.id)
                        .map((segmentMap)=>({
                            id: segmentMap.id,
                            operatingCarrier: {
                                code: segmentMap.operatingFlight?.cabin?.carrier
                            },
                            marketingCarrier: {
                                code: segmentMap.marketingFlight?.cabin?.carrier || (segmentMap.operatingFlight?.cabin?.carrier === 'YW' ? 'IB' : segmentMap.operatingFlight?.cabin?.carrier)
                            },
                            schedule: {
                                departureAirportCode: segmentMap.departureAirport,
                                arrivalAirportCode: segmentMap.arrivalAirport,
                                departureDate: segmentMap.departureDate.split(' ')[0]
                            },
                            bookingClass: {
                                code: segmentMap.operatingFlight.cabin.cabinClass.rbd
                            },
                            bookingCabin: {
                                code: segmentMap.passengerCoupons[0]?.seat?.column
                            }
                        }))
                }))
            },
            passengers: summaryInfo.context.passengers.map((passenger) => ({
                id: passengerIdBuilder(passenger.id, passenger.passengerType),
                memberIdentifier: passenger.frequentFlyer?.number || null,
                ancillaries: [],
                flight:null
            }))
        };
    };

}

AncillariesTransformer.$inject =
    ['CurrencyService', 'CommonsSessionStorageService', 'AncillariesTemporalUtilsService', '$rootScope', '$filter', 'DatalayerUtilsService', 'AncillariesUpgradingTransformer'];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service(
        'BookingAncillariesTransformer',
        AncillariesTransformer
    );
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service(
        'BookingAncillariesTransformer',
        AncillariesTransformer
    );
}
