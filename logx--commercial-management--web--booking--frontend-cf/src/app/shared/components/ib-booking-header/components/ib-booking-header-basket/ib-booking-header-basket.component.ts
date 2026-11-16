/* eslint-disable @typescript-eslint/no-loop-func */
import { Component, Inject, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { AJSCurrencyService, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingHeaderConstants } from '../../ib-booking-header-constants';
import { IbBasketTransformerService } from './services/ib-booking-header-basket-transformer.service';
import { ShoppingBasketViewModelService } from './shared/services/ib-booking-header-basket-view-model.service';
import { type ShoppingBasketAssistCard, ShoppingBasketType, type HeaderDataHeaderModel, type ShoppingBasketPetc } from '@src/app/core/models/ib-booking-availability/header-model';
import { cloneDeep } from 'lodash-es';
import { AJSBookingModalService, BookingModalServiceType } from '@shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSCommonsAncillariesServiceToken, CommonsAncillariesServiceType } from '../../services/upgraded/ib-commons-ancillaries-bridge.service';
import { skip, Subject, takeUntil } from 'rxjs';
import { IbPetcBasketService as IbAncPetcBasketService, IbAncillariesManagementService, IbAssistCardBasketService as IbAncAssistCardBasketService } from 'ib-web-ancillaries';
import { IbBookingPriceDetailModalService } from '@src/app/shared/services/ib-booking-price-detail-modal/ib-booking-price-detail-modal.service';
import { IbBookingHeaderFacadeService } from '../../services/ib-booking-header-facade.service';

@Component({
    selector: 'ib-booking-header-basket',
    templateUrl: './ib-booking-header-basket.component.html',
    styleUrls: ['./ib-booking-header-basket.component.scss']
})
export class IbBookingHeaderBasketComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public model;
    @Input() public showButtonPay;
    @Input() public flightType;
    @Input() public mobileInstance: boolean = false;
    public isLoading: boolean = false;
    public isLoadingVoucher: boolean = false;
    public isONB: boolean = false;
    public commonsBasketFunctions: any;
    public open: boolean = false;
    private unsuscribeUpdatesStm = new Subject<void>();
    public shouldShowPriceDetailCTA: boolean = false;
    private unsuscribePriceDetailModal = new Subject<void>();
    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        @Inject(WINDOW_TOKEN) private window: ng.IWindowService,
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject(AJSCommonsAncillariesServiceToken) private CommonsAncillariesService: CommonsAncillariesServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBasketTransformerService: IbBasketTransformerService,
        private ShoppingBasketViewModelService: ShoppingBasketViewModelService,
        private NewMainHeaderFacade: IbBookingHeaderFacadeService,
        private ibAncPetcBasketService: IbAncPetcBasketService,
        private IbBookingPriceDetailModalService: IbBookingPriceDetailModalService,
        private IbAncManagementService: IbAncillariesManagementService,
        private ibAncAssistCardBasketService: IbAncAssistCardBasketService


    ) {
        this.rootScope.$on('initializeHeader', this.removeDiscounts);
        this.rootScope.$on('updateHeaderCurrency', this.updateCurrency);
        this.rootScope.$on('updateHeaderTrips', this.updateTrips);
        this.rootScope.$on('updateHeaderSeats', this.updateHeaderSeats);
        this.rootScope.$on('updateHeaderUpgrading', this.updateHeaderUpgrading);
        this.rootScope.$on('updateHeaderInsurance', this.updateHeaderInsurance);
        this.rootScope.$on('updateHeaderBaggages', this.updateHeaderBaggages);
        this.rootScope.$on('updateHeaderBundle', this.updateHeaderBundle);
        this.rootScope.$on('updateHeaderBasket', this.updateBasket);
        this.rootScope.$on('changeStatusBasket', this.changeStatusBasket);
        this.rootScope.$on('updateTripList', this.updateTripList);
        this.rootScope.$on('updateHeaderSpeqs', this.updateHeaderSpeqs);
        this.rootScope.$on('updateHeaderCarbonFootprint', this.updateHeaderCarbonFootprint);
        this.rootScope.$on('updateHeaderGlobickTransfers', this.updateHeaderGlobickTransfers);
        this.rootScope.$on('updateHeaderAllianzFusionInsurance', this.updateHeaderAllianzFusionInsurance);
        this.rootScope.$on('deleteFees', this.deleteFees);
        this.rootScope.$on('updatePendingItems', this.updatePendingItems);
        this.rootScope.$on('loadingVoucherBasket', this.loadingVoucherBasket);
        this.commonsBasketFunctions = {
            calculateAllBasket: this.calculateAllBasket,
            saveHeaderModel: this.saveHeaderModel,
            deleteAncillarie: this.deleteAncillarie,
            isLoading: this.isLoadingBasket,
            isNotLoading: this.isNotLoadingBasket,
            modalService: this.BookingModalService,
            deleteAncillariesService: this.CommonsAncillariesService,
            deleteNewAncillariesService: this.IbAncManagementService,
            CurrencyService: this.CurrencyService
        };
    }

    ngOnDestroy (): void {
        this.unsuscribeUpdatesStm.next();
        this.unsuscribeUpdatesStm.complete();
        this.unsuscribePriceDetailModal.next();
        this.unsuscribePriceDetailModal.complete();
    }

    ngOnInit () {
        this.activate();
        this.NewMainHeaderFacade.getLoadingBasket().pipe(takeUntil(this.unsuscribeUpdatesStm)).subscribe((data) => this.loadingVoucherBasket({}, data));
        this.subscribeToHeaderModelForPriceDetail();
        this.setPetSubscription();
        this.setAssistCardSubscription();
    }

    ngOnChanges (): void {
        this.isONB = this.rootScope.isPointsOBFlow || false;
    }

    private subscribeToHeaderModelForPriceDetail = () => {
        this.NewMainHeaderFacade.getObservableHeader()
            .pipe(
                takeUntil(this.unsuscribePriceDetailModal)
            )
            .subscribe(headerData => {
                this.shouldShowPriceDetailCTA = this.IbBookingPriceDetailModalService.checkShouldShowCTA('header');
            });
    };


    public activate = () => {
        this.isONB = this.rootScope.isPointsOBFlow || false;
        this.model && this.formatPrice();
        this.updateTotalBasket();
    };

    private setPetSubscription = () => {
        this.ibAncPetcBasketService.initPetcSummarySubject();
        this.ibAncPetcBasketService.petcBasketUpdates$
            .pipe(skip(1), takeUntil(this.unsuscribeUpdatesStm))
            .subscribe(petData => this.updatePetcBasket(petData));
    };

    private setAssistCardSubscription = () => {
        this.ibAncAssistCardBasketService.updateAssistCardBasket();
        this.ibAncAssistCardBasketService.assistCardBasketUpdates$
            .pipe(skip(1), takeUntil(this.unsuscribeUpdatesStm))
            .subscribe(assistCardData => this.updateAssistCardBasket(assistCardData));
    };

    public formatPrice = () => {
        let totalPrice;
        if (this?.model?.total?.original) {
            totalPrice = this.model.total.original;
        } else {
            this.model.total = {};
            totalPrice = 0;
        }
        this.model.total.formatted = this.CurrencyService.formatPrice(this.model.currency, totalPrice, true);
    };
    /**
    * Emits event for go to payment page
    */
    public goToPayment = () => {
        this.rootScope.$broadcast('goToPayment');
        this.toggle();
    };
    /**
     * Change status for show or hide basket
     * @param {*} evt
     * @param {*} status
     */
    public changeStatusBasket = (evt, status) => {
        this.model.showBasket = status;
    };
    /**
     * Emits event with total of basket formatted
     */
    public updateTotalBasket = () => {
        const actualPage = this.window.location.hash.substring(2);
        this.model && this.formatPrice();
        if (actualPage === BookingHeaderConstants.ANCILLARIES_PAGES_HASH.BOOKING && this.model?.total) {
            this.rootScope.$broadcast('totalBasket', this.model.total.formatted);
        }
    };
    /**
     * Set initial values to model of header
     *
     * @param {Object} evt
     * @param {Object} model Model data
     */
    public removeDiscounts = () => {
        this.model.discountsModel = { hasDiscounts: false, discounts: {}, total: 0 };
    };
    /**
     * Save header model on localStorage
     */
    public saveHeaderModel = () => {
        const mainHeaderModel: any = this.getHeaderModel();
        mainHeaderModel.headerModel.shoppingBasket = this.model;
        this.NewMainHeaderFacade.updateHeaderModel(mainHeaderModel);
        this.rootScope.$broadcast('updateBasketAllModel', this.model);
    };
    /**
     * Recover header model of localStorage
     */
    public getHeaderModel = () => {
        return this.CommonsSessionStorageService.get('headerModel');
    };
    /**
     * Update seats on basket
     * @param {Object} evt
     * @param {Object} data
     */
    public updateHeaderSeats = (evt, data) => {
        let i: number = 0,
            k: number = 0,
            j: number = 0,
            l: number = 0,
            isSeatFound: boolean = false,
            isPassengerFound: boolean = false,
            seatFound: boolean = false,
            segmentFound: boolean = false,
            isEarly = this.checkEarlySegments(data.segmentId),
            subTotal,
            segmentIdSeat,
            seatsSelectedInfoData = this.CommonsSessionStorageService.get('seatsSelectedInfoData') ? this.CommonsSessionStorageService.get('seatsSelectedInfoData') : {};
        const generateSeatSegment = (segmentId, seatPassengers) => {
            let segment = { segmentId: segmentId, isEarly: isEarly, seats: [], origin: null, destination: null, quanty: 0, total: 0, totalFormatted: 0 }, segmentInfo: any = this.CommonsSessionStorageService.get('segmentsInfo');
            seatPassengers.forEach((seatPas) => {
                addNewSeat(segment, seatPas);
                segment.quanty++;
            });
            if (this.model.segmentsInfo?.length > 0) {
                for (let i = 0; i < this.model.segmentsInfo.length; i++) {
                    if (this.model.segmentsInfo[i].id === segment.segmentId) {
                        segment.origin = this.model.segmentsInfo[i].origin;
                        segment.destination = this.model.segmentsInfo[i].destination;
                    }
                }
            } else {
                for (let i = 0; i < segmentInfo.length; i++) {
                    if (segmentInfo[i].id === segment.segmentId) {
                        segment.origin = segmentInfo[i].origin;
                        segment.destination = segmentInfo[i].destination;
                    }
                }
            }
            calculateTotalSegment(segment);
            return segment;
        };
        const setPriceFormatted = (info) => {
            Object.entries(info).forEach((segment: any, value) => {
                segment[1].passengersInfo.forEach((passenger) => {
                    passenger.seatPriceFormatted = this.CurrencyService.formatPrice(this.model.currency, passenger.seatPrice, true);
                });
            });
            return info;
        };
        const addNewSeat = (segment, seatPas) => {
            let i = 0, isFound = false, seatType;
            while (i < segment.seats.length && !isFound) {
                if (segment.seats[i].type === seatPas.seatType) {
                    segment.seats[i].passengers.push({ id: seatPas.id.toString(), amount: seatPas.price });
                    segment.seats[i].amount += seatPas.price;
                    segment.seats[i].totalFormatted = this.CurrencyService.formatPrice(this.model.currency, segment.seats[i].amount, true);
                    segment.seats[i].quanty++;
                    isFound = true;
                }
                i++;
            }
            if (!isFound) {
                seatType = { type: seatPas.seatType, description: seatPas.seatTypeDescription, quanty: 1, passengers: [], amount: 0, totalFormatted: null };
                seatType.amount += seatPas.price;
                seatType.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, seatType.amount, true);
                seatType.passengers.push({ id: seatPas.id.toString(), amount: seatPas.price });
                segment.seats.push(seatType);
            }
        };
        const calculateSeatTypePrice = (segments) => {
            let i: number,
                k: number,
                segmentsSeats;
            for (i = 0; i < segments.length; i++) {
                segmentsSeats = [];
                for (k = 0; k < segments[i].seats.length; k++) {
                    if (segments[i].seats[k].quanty > 0) {
                        segmentsSeats.push(segments[i].seats[k]);
                    }
                }
                segmentsSeats.forEach((seat) => {
                    seat.amount = 0;
                    seat.passengers.forEach((pas) => {
                        seat.amount += pas.amount;
                    });
                    seat.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, seat.amount, true);
                });
                segments[i].seats = segmentsSeats;
            }
        };
        const calculateTotalSegment = (segment) => {
            segment.total = 0;
            segment.totalFormatted = null;
            segment.seats.forEach((seat) => {
                if (seat.quanty > 0) {
                    seat.passengers.forEach((pas) => {
                        segment.total += pas.amount;
                    });
                }
            });
            segment.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, segment.total, true);
        };
        const cleanEmptySegments = (segments) => {
            let seats;
            segments.forEach((segment) => {
                seats = null;
                seats = segment.seats.filter((seat) => {
                    return (seat.quanty > 0);
                });
                segment.seats = seats;
            });
            this.model.seats.segments = segments.filter((segment: any) => segment.seats.length > 0);
        };
        const calculateSubTotalSeats = () => {
            subTotal = 0;
            this.model.seats.segments.forEach((segment) => {
                subTotal += segment.total;
            });
            this.model.seats.total = {
                total: subTotal,
                totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
            };
        };
        segmentIdSeat = data.segmentId.toString();
        seatsSelectedInfoData[segmentIdSeat] = data;
        seatsSelectedInfoData[segmentIdSeat].id = segmentIdSeat;
        for (i = 0; i < this.model.seats.segments.length; i++) {
            if (data.segmentId.toString() === this.model.seats.segments[i].segmentId) {
                segmentFound = true, k = 0;
                for (k = 0; k < data.passengers.length; k++) {
                    isSeatFound = false;
                    this.model.seats.segments[i].seats.forEach((seat) => {
                        j = 0, isPassengerFound = false;
                        while (j < seat.passengers.length && !isPassengerFound && !isSeatFound) {
                            if (data.passengers[k].id.toString() === seat.passengers[j].id.toString() && data.passengers[k].seatType === seat.type && !data.passengers[k].isDeletedFromSeatmap) {
                                seat.passengers[j].amount = data.passengers[k].price;
                                seat.type = data.passengers[k].seatType;
                                seat.description = data.passengers[k].seatTypeDescription;
                                isSeatFound = true;
                            } else if (data.passengers[k].id.toString() === seat.passengers[j].id.toString() && (data.passengers[k].seatType !== seat.type || data.passengers[k].isDeletedFromSeatmap)) {
                                seat.quanty--;
                                seat.amount = seat.amount - seat.passengers[j].amount;
                                seat.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, seat.amount, true);
                                if (seat.passengers.length === 1) {
                                    seat.passengers = [];
                                } else {
                                    let l = 0;
                                    while (l < seat.passengers.length && !seatFound) {
                                        if (seat.passengers[l].id === data.passengers[k].id.toString()) {
                                            seatFound = true;
                                            seat.passengers.splice(l, 1);
                                        }
                                        l++;
                                    }
                                }
                                isPassengerFound = true;
                            }
                            j++;
                        }
                    });
                    if (!isSeatFound && !data.passengers[k].isDeletedFromSeatmap) {
                        addNewSeat(this.model.seats.segments[i], data.passengers[k]);
                    }
                }
                calculateTotalSegment(this.model.seats.segments[i]);
                cleanEmptySegments(this.model.seats.segments);
            }
        }

        if (!segmentFound) {
            this.model.seats.segments.push(generateSeatSegment(data.segmentId.toString(), data.passengers));
        }
        if (this.model?.seats?.segments?.length > 0) {
            this.model.seats.hasSeats = true;
        } else {
            this.model.seats.hasSeats = false;
        }
        calculateSeatTypePrice(this.model.seats.segments);
        calculateSubTotalSeats();
        this.calculateAllBasket();
        this.model.seats = this.IbBasketTransformerService.checkFreeSeats(this.model.seats);
        seatsSelectedInfoData = setPriceFormatted(seatsSelectedInfoData);
        this.CommonsSessionStorageService.set('seatsSelectedInfoData', seatsSelectedInfoData);
        this.saveHeaderModel();
    };
    /**
     * Update or add baggages to basket model
     * @param {Object} evt Event
     * @param {Array} passengerBaggages List of passenger baggages
     */
    public updateHeaderBaggages = (evt, passengerBaggages) => {
        let isSegmentFound = false, baggage, totalBaggage, subTotal, segmentInfo, baggageFound, baggageInfo;
        const selectedBundle: any = this.CommonsSessionStorageService.get('selectedBundle');
        const generateBaggageTrip = (trip, passenger) => {
            const tripBaggage = { segmentId: trip.id, baggages: [], total: 0, origin: trip.departure, destination: trip.arrival };
            trip.pieces.forEach((piece) => {
                baggage = { type: piece.subtype, quanty: piece.quantySelected, description: piece.description, passengers: [passenger.id] };
                Object.assign(baggage, calculateToltalBaggageRange(piece.quantySelected, piece.availablePriceRanges, piece.bundlePieces));
                if (baggage.quanty > 0) {
                    tripBaggage.baggages.push(baggage);
                    tripBaggage.total += baggage.total;
                }
            });
            return tripBaggage;
        };
        const generateBaggageType = (piece) => {
            totalBaggage = calculateToltalBaggageRange(piece.quantySelected, piece.availablePriceRanges, piece.bundlePieces);
            return {
                type: piece.subtype,
                quanty: piece.quantySelected,
                description: piece.description,
                passengers: [],
                total: totalBaggage.total,
                totalFormatted: this.CurrencyService.formatPrice(this.model.currency, totalBaggage.total, true)
            };
        };
        const calculateToltalBaggageRange = (quantySelected, priceRanges, bundlePieces) => {
            let i, numBag = 1, numBagsInterval, baggageCounter = 0, totalPrice = 0;
            if (bundlePieces) {
                quantySelected += bundlePieces;
            } else {
                bundlePieces = 0;
            }
            while (numBag <= quantySelected) {
                if (quantySelected > 0) {
                    for (i = 0; i < priceRanges.length; i++) {
                        numBagsInterval = 1;
                        baggageCounter = priceRanges[i].to - priceRanges[i].from + 1;
                        while (numBagsInterval <= baggageCounter && numBag <= quantySelected) {
                            if (numBag > bundlePieces) {
                                totalPrice += priceRanges[i].amount;
                            }
                            numBagsInterval++;
                            numBag++;
                        }
                    }
                }
            }
            return { total: totalPrice, totalFormatted: this.CurrencyService.formatPrice(this.model.currency, totalPrice, true) };
        };
        const checkBaggageSubtypes = () => {
            let baggages;
            if (this.model.baggages.segments.length > 0) {
                this.model.baggages.segments.forEach((segment) => {
                    baggages = segment.baggages.filter((bag) => {
                        return (bag.quanty > 0);
                    });
                    segment.baggages = baggages;
                });
            }
        };
        /*
        ** Modify max number of buyable baggages if bundle includes them
        */
        const calculateBundleBaggages = (selectedBundle, passengerBaggages) => {
            if (passengerBaggages) {
                passengerBaggages.forEach(passenger => {
                    passenger.trips.forEach(trip => {
                        if (!trip.defaultAditionalPieces) {
                            trip.defaultAditionalPieces = trip.maxAdditionalPieces;
                        } else {
                            trip.maxAdditionalPieces = trip.defaultAditionalPieces;
                        }
                    });
                });
                if (selectedBundle) {
                    selectedBundle.items.forEach(item => {
                        if (item.type === 'BAGGAGE') {
                            passengerBaggages.forEach(passenger => {
                                passenger.trips.forEach(trip => {
                                    trip.maxAdditionalPieces = trip.maxAdditionalPieces - item.quantityPassAndTrips;
                                    trip.pieces.forEach(piece => {
                                        if (piece.subtype === item.subtype) {
                                            piece.bundlePieces = item.quantityPassAndTrips;
                                        }
                                    });
                                });
                            });
                        }
                    });
                }
            }
        };
        this.model.baggages.segments = [];
        this.model.baggages.hasBaggage = false;
        if (selectedBundle) {
            calculateBundleBaggages(selectedBundle, passengerBaggages);
        }
        passengerBaggages?.forEach((passenger) => {
            passenger.trips.forEach((trip) => {
                isSegmentFound = false;
                if (this.model.baggages.segments.length > 0) {
                    this.model.baggages.segments.forEach((segment) => {
                        if (trip.id === segment.segmentId) {
                            trip.pieces.forEach((piece) => {
                                baggageFound = false;
                                if (piece.quantySelected > 0) {
                                    segment.baggages.forEach((baggage) => {
                                        if (piece.subtype === baggage.type) {
                                            baggageFound = true;
                                            totalBaggage = calculateToltalBaggageRange(piece.quantySelected, piece.availablePriceRanges, piece.bundlePieces);
                                            baggage.quanty += piece.quantySelected;
                                            baggage.total += totalBaggage.total;
                                            segment.total += totalBaggage.total;
                                            baggage.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, baggage.total, true);
                                            this.model.baggages.hasBaggage = true;
                                            calculateToltalBaggageRange(baggage.quanty, piece.availablePriceRanges, piece.bundlePieces);
                                            if (baggage.passengers.indexOf(passenger.id) === -1) {
                                                baggage.passengers.push(passenger.id);
                                            }
                                        }
                                    });
                                    if (!baggageFound) {
                                        baggageInfo = generateBaggageType(piece);
                                        segment.total += totalBaggage.total;
                                        calculateToltalBaggageRange(baggageInfo.quanty, piece.availablePriceRanges, piece.bundlePieces);
                                        if (baggageInfo.passengers.indexOf(passenger.id) === -1) {
                                            baggageInfo.passengers.push(passenger.id);
                                        }
                                        segment.baggages.push(baggageInfo);
                                    }
                                }

                            });
                            isSegmentFound = true;
                        }
                    });
                    if (!isSegmentFound && trip.piecesChoosed > 0) {
                        segmentInfo = generateBaggageTrip(trip, passenger);
                        if (segmentInfo.total > 0) {
                            this.model.baggages.segments.push(segmentInfo);
                        }
                    }
                } else {
                    segmentInfo = generateBaggageTrip(trip, passenger);
                    if (segmentInfo.total > 0) {
                        this.model.baggages.segments.push(segmentInfo);
                    }
                }
            });
        });
        if (this.model.baggages.segments.length > 0) {
            this.model.baggages.hasBaggage = true;
        }
        checkBaggageSubtypes();
        this.calculateSubTotalBaggages();
        this.calculateAllBasket();
        this.saveHeaderModel();
    };
    /**
     * Update or add bundle to basket model
     * @param {Object} evt Event
     * @param {Array} passengerBaggages List of passenger bundle
     */
    public updateHeaderBundle = (evt, addedBundle) => {
        this.model.bundle.hasBundle = false;
        if (addedBundle) {
            this.model.bundle.info = {
                id: addedBundle.id,
                items: addedBundle.items,
                totalPassengers: addedBundle.totalPassengers
            };
            this.model.bundle.total = {
                total: addedBundle.priceItemsAllDiscount,
                totalFormatted: this.CurrencyService.formatPrice(this.model.currency, addedBundle.priceItemsAllDiscount, true)
            };

            this.model.bundle.hasBundle = true;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
    };
    public calculateSubTotalBaggages = () => {
        let subTotal = 0;
        this.model.baggages.segments.forEach((baggage) => {
            subTotal += baggage.total;
        });
        this.model.baggages.total = {
            total: subTotal,
            totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
        };
    };
    /**
     * Update or add baggages to basket model
     * @param {Object} evt Event
     * @param {Array} passengerSpeqs List of passenger speqs
     */
    public updateHeaderSpeqs = (evt, passengerSpeqs: any[]) => {
        let isSegmentFound = false, segmentSpeqs, isSpeqFound, newSpeq, subTotal;
        const calculateSubTotalSpeqs = () => {
            subTotal = 0;
            this.model.speqs.segments.forEach((speq) => {
                subTotal += speq.total;
            });
            this.model.speqs.total = {
                total: subTotal,
                totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
            };
        };
        const generateSpeqTrip = (trip, passenger) => {
            let tripSpeq = { segmentId: trip.id, speqs: [], total: trip.totalPrice, origin: trip.departure, destination: trip.arrival };
            passenger.trips.forEach((pasTrip) => {
                if (trip.id === pasTrip.id && pasTrip.speqsChoosed > 0) {
                    trip.pieces.forEach((piecePassenger) => {
                        if (piecePassenger.quantySelected > 0) {
                            tripSpeq.speqs.push(generateSpeq(piecePassenger, passenger));
                        }
                    });
                }
            });
            return tripSpeq;
        };
        const generateSpeq = (piece, passenger) => {
            let speqType;
            speqType = { type: piece.subtype, quanty: piece.quantySelected, description: piece.description, passengers: [passenger.id] };
            Object.assign(speqType, calculateToltalSpeqRange(piece.quantySelected, piece.availablePriceRanges));
            return speqType;
        };
        const calculateToltalSpeqRange = (quantySelected, priceRanges) => {
            let i, numSpeq = 1, numSpeqsInterval, speqCounter = 0, totalPrice = 0;
            while (numSpeq <= quantySelected) {
                if (quantySelected > 0) {
                    for (i = 0; i < priceRanges.length; i++) {
                        numSpeqsInterval = 1;
                        speqCounter = priceRanges[i].to - priceRanges[i].from + 1;
                        while (numSpeqsInterval <= speqCounter && numSpeq <= quantySelected) {
                            totalPrice += priceRanges[i].amount;
                            numSpeqsInterval++;
                            numSpeq++;
                        }
                    }
                }
            }
            return { total: totalPrice, totalFormatted: this.CurrencyService.formatPrice(this.model.currency, totalPrice, true) };
        };
        const checkSpeqSubtypes = () => {
            let speqs;
            if (this.model.speqs.segments.length > 0) {
                this.model.speqs.segments.forEach((segment) => {
                    speqs = segment.speqs.filter((speq) => {
                        return (speq.quanty > 0);
                    });
                    segment.speqs = speqs;
                });
            }
        };
        this.model.speqs.segments = [];
        passengerSpeqs.forEach((passenger) => {
            passenger.trips.forEach((trip) => {
                isSegmentFound = false;
                if (trip.speqsChoosed > 0) {
                    if (this.model.speqs.segments.length > 0) {
                        this.model.speqs.segments.forEach((segmentBasket) => {
                            if (trip.id === segmentBasket.segmentId) {
                                trip.totalPrice += segmentBasket.total;
                                trip.pieces.forEach((piece) => {
                                    if (piece.quantySelected > 0) {
                                        isSpeqFound = false;
                                        segmentBasket.speqs.forEach((speq) => {
                                            if (piece.subtype === speq.type) {
                                                isSpeqFound = true;
                                                segmentBasket.total -= speq.total;
                                                speq.quanty += piece.quantySelected;
                                                Object.assign(speq, calculateToltalSpeqRange(speq.quanty, piece.availablePriceRanges));
                                                segmentBasket.total += speq.total;
                                                if (speq.passengers.indexOf(passenger.id) === -1) {
                                                    speq.passengers.push(passenger.id);
                                                }
                                            }
                                        });
                                        if (!isSpeqFound) {
                                            newSpeq = generateSpeq(piece, passenger);
                                            segmentBasket.total += newSpeq.total;
                                            segmentBasket.speqs.push(newSpeq);
                                        }
                                    }
                                });
                                isSegmentFound = true;
                            }
                        });

                        if (!isSegmentFound) {
                            this.model.speqs.segments.push(generateSpeqTrip(trip, passenger));
                        }
                    } else {
                        this.model.speqs.segments.push(generateSpeqTrip(trip, passenger));
                    }
                }
            });
        });
        segmentSpeqs = this.model.speqs.segments.filter((segment) => {
            return (segment.total > 0);
        });
        this.model.speqs.segments = segmentSpeqs;
        if (this.model.speqs.segments.length > 0) {
            this.model.speqs.hasSpeqs = true;
        }
        checkSpeqSubtypes();
        calculateSubTotalSpeqs();
        this.calculateAllBasket();
        this.saveHeaderModel();
    };

    /**
     * Update or add upgrading information
     * @param {Object} evt Event recieved
     * @param {Object} upgradingInfo Information of upgrading accepted by client to add on basket
     */
    public updateHeaderUpgrading = (evt, upgradingInfo) => {
        this.model.upgrading.segments = upgradingInfo.upgradingTrips;
        if (this.model.upgrading.segments.length > 0) {
            this.model.upgrading.hasUpgrading = true;
        }
        this.model.upgrading.total = upgradingInfo.total ? upgradingInfo.total : 0;
        this.model.upgrading.totalFormatted = upgradingInfo.totalFormatted ? upgradingInfo.totalFormatted : 0;
        this.calculateAllBasket();
        this.saveHeaderModel();
    };
    public calculateSubTotalUpgrading = () => {
        let subTotal = 0;
        this.model.upgrading.segments.forEach((upgrading) => {
            subTotal += upgrading.total;
        });
        this.model.upgrading.total = {
            total: subTotal,
            totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
        };
    };
    /**
     * Update or add insurance to basket
     * @param {Object} evt Event object emited by view
     * @param {Object} insurance Insurance information for update in basket
     */
    public updateHeaderInsurance = (evt, insurance) => {
        if (insurance) {
            this.model.insurance.info = {
                offer: insurance.id,
                passengers: 1,
                type: insurance.name
            };
            this.model.insurance.total = {
                total: insurance.originalPrice,
                totalFormatted: this.CurrencyService.formatPrice(this.model.currency, insurance.originalPrice, true)
            };
            this.model.insurance.hasInsurance = true;
        } else {
            this.model.insurance.info = null;
            this.model.insurance.hasInsurance = false;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
    };

    /**
     * Update or add globick transfers ancillary to basket
     *
     * @param {Object} evt Event object emitted by view
     * @param {Object} globickTransfersInfo information for update in basket
     */
    updateHeaderGlobickTransfers = (evt, globickTransfersInfo) => {
        if (globickTransfersInfo) {
            const price = globickTransfersInfo.price ? globickTransfersInfo.price : globickTransfersInfo.priceGoing;
            const totalFormatted = this.CurrencyService.formatPrice(this.model.currency, price, true);
            this.model.globickTransfers.info = {
                date: globickTransfersInfo.dateGoingTrip,
                dateReturn: '',
                transferCar: globickTransfersInfo.transferCar,
                totalFormatted: totalFormatted,
                totalFormattedReturn: ''
            };
            this.model.globickTransfers.total = {
                total: price,
                totalFormatted: totalFormatted
            };
            if (globickTransfersInfo.dateReturnTrip) {
                const totalFormattedReturn = this.CurrencyService.formatPrice(this.model.currency, globickTransfersInfo.priceReturn, true);
                this.model.globickTransfers.info.totalFormattedReturn = totalFormattedReturn;
                this.model.globickTransfers.info.dateReturn = globickTransfersInfo.dateReturnTrip;
                this.model.globickTransfers.total.total = globickTransfersInfo.priceGoing + globickTransfersInfo.priceReturn;
                this.model.globickTransfers.total.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, this.model.globickTransfers.total.total, true);
            }
            this.model.globickTransfers.hasTransfersGlobick = true;
        } else {
            this.model.globickTransfers.info = null;
            this.model.globickTransfers.total = null;
            this.model.globickTransfers.hasTransfersGlobick = false;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
        this.rootScope.$broadcast('clearViewOnBasketUpdate', false);
    };

    /**
     * Update or add globick transfers ancillary to basket
     *
     * @param {Object} evt Event object emitted by view
     * @param {Object} insuranceAllianzFusionInfo information for update in basket
     */
    updateHeaderAllianzFusionInsurance = (evt, insuranceAllianzFusionInfo) => {
        if (insuranceAllianzFusionInfo) {
            const price = insuranceAllianzFusionInfo.price;
            const totalFormatted = this.CurrencyService.formatPrice(this.model.currency, price, true);
            this.model.insuranceAllianzFusionInfo.info = {
                description: insuranceAllianzFusionInfo.description,
                totalFormatted: totalFormatted
            };
            this.model.insuranceAllianzFusionInfo.total = {
                total: price,
                totalFormatted: totalFormatted
            };
            this.model.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion = true;
        } else {
            this.model.insuranceAllianzFusionInfo.info = null;
            this.model.insuranceAllianzFusionInfo.total = null;
            this.model.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion = false;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
        this.rootScope.$broadcast('clearViewOnBasketUpdate', false);
    };

    /**
     * Update or add carbon footprint ancillary to basket
     *
     * @param {Object} evt Event object emitted by view
     * @param {Object} carbonFootprintInfo information for update in basket
     */
    public updateHeaderCarbonFootprint = (evt, carbonFootprintInfo) => {
        if (carbonFootprintInfo) {
            const totalFormatted = this.CurrencyService.formatPrice(this.model.currency, carbonFootprintInfo.price, true);
            this.model.carbonFootprint.info = {
                kilosCo2Equivalent: carbonFootprintInfo.kilosCo2Equivalent,
                kilosCo2EquivalentFormatted: carbonFootprintInfo.kilosCo2Equivalent ? carbonFootprintInfo.kilosCo2Equivalent.toString().replace('.', ',') : '',
                totalFormatted: totalFormatted
            };
            this.model.carbonFootprint.total = {
                total: carbonFootprintInfo.price,
                totalFormatted: totalFormatted
            };
            this.model.carbonFootprint.hasCarbonFootprint = true;
        } else {
            this.model.carbonFootprint.info = null;
            this.model.carbonFootprint.total = null;
            this.model.carbonFootprint.hasCarbonFootprint = false;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
        this.rootScope.$broadcast('clearViewOnBasketUpdate', false);
    };

    public updatePetcBasket (petData: ShoppingBasketPetc): void {
        this.model.petc = this.model.petc || {};

        if (petData && petData.segments.length > 0) {
            this.model.petc.segments = petData.segments;
            this.model.petc.total = petData.total;
            this.model.petc.hasPetc = petData.segments.length > 0;
        } else {
            this.model.petc.segments = [];
            this.model.petc.total = 0;
            this.model.petc.hasPetc = false;
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
    }

    public updateAssistCardBasket (assistCardData: ShoppingBasketAssistCard): void {
        this.model.assistCard = this.model.assistCard || {};

        if (assistCardData?.hasAssistCard) {
            this.model.assistCard.total = assistCardData.total;
            this.model.assistCard.hasAssistCard = true;
            this.model.assistCard.name = assistCardData.name;
        } else {
            this.model.assistCard.total = null;
            this.model.assistCard.hasAssistCard = false;
            this.model.assistCard.name = '';
        }
        this.calculateAllBasket();
        this.saveHeaderModel();
    }

    /**
     * Enable loading view
     */
    public isLoadingBasket = () => {
        this.isLoading = true;
    };
    /**
     * Disable loading view
     */
    public isNotLoadingBasket = () => {
        this.isLoading = false;
    };
    /**
    * Change value of model depend of width of window.
    */
    public calculateModelTripsHeader = () => {
        const width = this.window.innerWidth;
        if (width <= 320) {
            if (this.model.trips.list.length >= 1) {
                this.model.trips.tipFlights = cloneDeep(this.model.trips.list);
            }
        } else if (width > 320 && width < 768) {
            this.model.trips.tipFlights = cloneDeep(this.model.trips.list);
        } else if (width >= 768 && width < 1024) {
            this.model.trips.tipFlights = cloneDeep(this.model.trips.list);
        } else if (width >= 1024 && width < 1280) {
            while (this.model.trips.list.length > 3) {
                this.model.trips.tipFlights.push(this.model.trips.list.pop());
            }
        } else if (width >= 1280) {
            while (this.model.trips.list.length > 4) {
                this.model.trips.tipFlights.push(this.model.trips.list.pop());
            }
        }
    };
    /**
     * Set currency  of $rootScope to model  and update model on localStorage
     * @param {Object} evt Event object
     * @param {Object} currency Currency object
     */
    public updateCurrency = (evt, currency) => {
        if (!this.model.currency) {
            this.model.currency = currency;
            this.model.total.formatted = this.CurrencyService.formatPrice(this.model.currency, this.model.total.original, true);
            this.saveHeaderModel();
            this.updateTotalBasket();
        }
    };
    /**
     * Update trips of header and calculate trips of tooltip depending of resolution of
     * screen
     * @param {Object} evt Event
     * @param {Object} info Object with list of trips and passengers number
     */
    public updateTrips = (evt, info) => {
        this.model.trips.list = this.model.trips.list.concat(info.trips);
        this.model.trips.passengers = info.passengers;
        this.model.segmentsInfo = info.segmentsInfo;
        this.calculateModelTripsHeader();
    };
    /**
     * Update all trips on model
     */
    public updateTripList = (evt, trips) => {
        this.model.trips.list = trips;
        this.saveHeaderModel();
        this.calculateModelTripsHeader();
    };
    /**
     * Add ancillaries to basket and calculate total price of all
     * @param {Object} evt
     * @param {Object} data Information for update all basket
     */
    public updateBasket = (evt, data: ShoppingBasketType) => {
        if (!this.model) {
            return;
        }
        this.model = { ...this.model, ...data };

        this.saveHeaderModel();
    };
    public calculateAllBasket = (actualPage?) => {
        const calculateTotalBasket = (amount) => {
            this.model.total.original += amount;
            this.model.total.formatted = this.CurrencyService.formatPrice(this.model.currency, this.model.total.original, true);
        };
        if (this.model.total?.totalPrice !== undefined) {
            this.model.total.totalPrice = 0;
        }
        this.model.total.original = this.model.trips?.total?.original;
        this.model.total.formatted = this.CurrencyService.formatPrice(this.model.currency, this.model.total.original, true);
        this.model.baggages.segments.forEach((segment) => {
            calculateTotalBasket(segment.total);
            this.calculateSubTotalBaggages();
        });
        this.model.seats.segments.forEach((segment) => {
            calculateTotalBasket(segment.total);
            this.calculateSubTotalSeats();
        });
        if (this.model.insurance.info) {
            calculateTotalBasket(this.model.insurance.total.total);
        }
        if (this.model.carbonFootprint.info) {
            calculateTotalBasket(this.model.carbonFootprint.total.total);
        }
        if (this.model.upgrading.hasUpgrading) {
            calculateTotalBasket(this.model.upgrading.total);
        }
        if (this.model.othersModel.hasElements) {
            calculateTotalBasket(this.model.othersModel.total.total);
        }
        if (this.model.flexibilization.hasFlexibilization) {
            calculateTotalBasket(this.model.flexibilization.info.amount.price);
        }
        if (this.model.discountsModel.hasDiscounts) {
            calculateTotalBasket(-this.model.discountsModel.total);
            this.model.discountsModel.totalFormatted = this.CurrencyService.formatPrice(this.model.currency, -this.model.discountsModel.discounts.total, true);
        }
        if (this.model.bundle.hasBundle) {
            calculateTotalBasket(this.model.bundle.total.total);
        }
        if (this.model.globickTransfers.hasTransfersGlobick) {
            calculateTotalBasket(this.model.globickTransfers.total.total);
        }
        if (this.model.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion) {
            calculateTotalBasket(this.model.insuranceAllianzFusionInfo.total.total);
        }
        if (this.model.assistCard?.hasAssistCard) {
            calculateTotalBasket(this.model.assistCard.total.total);
        }
        this.model.speqs.segments.forEach((segment) => {
            calculateTotalBasket(segment.total);
            this.calculateSubTotalSpeqs();
        });
        if (this.model?.priorityBoarding?.info?.trips) {
            this.model.priorityBoarding.info.trips.forEach((trip) => {
                calculateTotalBasket(trip.amount);
                this.calculateSubTotalPriority();
            });
        }
        if (this.model?.petc?.hasPetc) {
            calculateTotalBasket(this.model?.petc?.total.total);
        }
        this.model.total.formatted = this.CurrencyService.formatPrice(this.model.currency, this.model.total.original, true);
        this.rootScope.$broadcast('totalBasket', this.model.total.formatted);
        this.rootScope.$broadcast('calculateHeightScrollEvent');
    };
    public calculateSubTotalSeats = () => {
        let subTotal = 0;
        this.model.seats.segments.forEach((segment) => {
            subTotal += segment.total;
        });
        this.model.seats.total = {
            total: subTotal,
            totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
        };
    };
    public calculateSubTotalSpeqs = () => {
        let subTotal = 0;
        this.model.speqs.segments.forEach((speq) => {
            subTotal += speq.total;
        });
        this.model.speqs.total = {
            total: subTotal,
            totalFormatted: this.CurrencyService.formatPrice(this.model.currency, subTotal, true)
        };
    };
    public calculateSubTotalPriority = () => {
        let subTotal = 0;
        this.model.priorityBoarding.info.trips.forEach((trip) => {
            subTotal += trip.amount;
        });
        this.model.priorityBoarding.info.priceFormatted = this.CurrencyService.formatPrice(this.model.currency, subTotal, true);
    };
    /**
     * Check if have early segments
     */
    public checkEarlySegments = (sementSelectedId) => {
        let isEarly = false;
        const bookingInfo: any = this.CommonsSessionStorageService.get('bookingInfo');
        bookingInfo?.checkinSegmentsInGroup?.forEach((earlySegmentId) => {
            if (earlySegmentId.toString() === sementSelectedId || earlySegmentId === sementSelectedId) {
                isEarly = true;
            }
        });
        return isEarly;
    };
    public deleteFees = () => {
        this.ShoppingBasketViewModelService.updateOthersFee({ shoppingBasket: this.model } as HeaderDataHeaderModel, null, null);
        this.calculateAllBasket();
    };
    public updatePendingItems = () => {
        this.calculateAllBasket();
    };
    public loadingVoucherBasket = (event, isLoading) => {
        this.isLoadingVoucher = isLoading;
    };
    public toggle = () => {
        this.open = !this.open;
    };
    public deleteAncillarie = (status: boolean = true): void => {
        this.NewMainHeaderFacade.setAncillariesDeletion(status);
    };

    public openPriceDetailModal = ($event: Event): any => {
        this.IbBookingPriceDetailModalService.openPriceDetailModal($event);

    };

}
