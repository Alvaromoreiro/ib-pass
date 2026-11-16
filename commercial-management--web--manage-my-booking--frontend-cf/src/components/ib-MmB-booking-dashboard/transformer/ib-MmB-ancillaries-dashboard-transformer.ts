import angular from "angular";
import dayjs from 'dayjs';

@Service(
    'ib-MmB-booking-dashboard-module',
    ['BookingDashboardConstants', 'MmBAppConstants', 'localStorageService', '$filter', 'CurrencyService', 'InvoiceDashboardTransformer'],
    [])
export class AncillariesDashboardTransformer {

    constructor(
        private BookingDashboardConstants,
        private MmBAppConstants,
        private localStorageService,
        private $filter,
        private CurrencyService,
        private InvoiceDashboardTransformer
    ) {}

    checkAncillariesInTime = (ancillariesAvailable, transformedInfo, haveIberiaFlights) => {
        let isInTime = true, isSpecialMealsInTime = false, currentDate = dayjs(new Date()), dateFlight = null, ancillariesAvailableTypes, showRedirection = false;
        angular.forEach(transformedInfo?.yourFlightsModel?.allSegments, (segment) => {
            if (this.BookingDashboardConstants.IAG_MARKETING_CODE_CARRIER.indexOf(segment.flight.operationalCarrier.code) !== -1) {
                haveIberiaFlights = true;
                dateFlight = dayjs(segment.departureDateParsed.originalDate);
                angular.forEach(ancillariesAvailable, (typeAncillarie) => {
                    isInTime = true;
                    switch (typeAncillarie) {
                            case this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS:
                                if (dateFlight.diff(currentDate, 'hour') >= Number(24))
                                    isSpecialMealsInTime = true;
                                break;
                            default:
                                if (dateFlight.diff(currentDate, 'hour') >= Number(0) && dateFlight.diff(currentDate, 'hour') <= Number(2)) {
                                    isInTime = false;
                                    showRedirection = true;
                                }
                                break;
                    }
                });
            }
        });

        ancillariesAvailableTypes = ancillariesAvailable;

        if (ancillariesAvailable.indexOf(this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS) !== -1 && !isSpecialMealsInTime) {
            ancillariesAvailableTypes = ancillariesAvailable.filter((ancillarie) => {
                return ancillarie !== this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS;
            });
        }

        if (!isInTime && ancillariesAvailable.length > 0 && isSpecialMealsInTime) {
            ancillariesAvailableTypes = ancillariesAvailable.filter((ancillarie) => {
                return ancillarie === this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS;
            });
        }

        return { isIntime: isInTime, isSpecialMealsInTime: isSpecialMealsInTime, showRedirection: showRedirection };
    }

    isSpecialMealsAvailable = (transformedInfo) => {
        let i = 0, isFound = false;
        while (!isFound && i < transformedInfo.ancillariesInfo?.ancillariesAvailable?.length) {
            if (transformedInfo.ancillariesInfo.ancillariesAvailable[i] === this.MmBAppConstants.ANCILLARIES_TYPES.SPECIAL_MEALS) {
                isFound = true;
            }
            i++;
        }
        return isFound;
    }

    removeAncillariesIfAlreadyPurchased = (transformedInfo, breakDownInfo) => {
        if (this.isAncillariesInfoAvailable(transformedInfo, breakDownInfo)) {
            return;
        };

        const ancillariesToBeRemovedIfAlreadyPurchased = [ this.MmBAppConstants.ANCILLARIES_TYPES.CO2_FOOTPRINT ];

        const ancillariesToRemove = breakDownInfo.issuedItems.reduce((acc, {type}) => {
            if (ancillariesToBeRemovedIfAlreadyPurchased.includes(type)) {
                acc.push(type);
            }
            return acc;
        }, []);

        return transformedInfo.ancillariesInfo.ancillariesAvailable.filter((element) => !ancillariesToRemove.includes(element));
    };

    private isAncillariesInfoAvailable = (transformedInfo, breakDownInfo) => {
        return (!transformedInfo.ancillariesInfo || !transformedInfo.ancillariesInfo.ancillariesAvailable || !breakDownInfo || !breakDownInfo.issuedItems);
    };

    generateManagementMeals = (bookingInfo) => {
        let mealsInfo: any = { segments: [] }, mealSelected, meal, passengerMeal, numSpecialMeals;
        let meals = [];
        let specialMealNumSelectedTotal = 0;
        let segmentInfoOfAncillaries: any = {};
        let arrAncillaries = this.localStorageService.get('ancillariesInfo');
        let listUserInfants = [];
        const arrSegmentsAvailable = [];
        let passengerFound;
        arrAncillaries = arrAncillaries ? arrAncillaries.ancillaries : [];
        // SEGMENTS AVAILABLE WITH SPECIAL MEALS
        for (let x = 0; x < arrAncillaries.length; x++) {
            if (arrAncillaries[x].type === 'SPECIAL_MEALS') {
                for (let y = 0; y < arrAncillaries[x].segments.length; y++) {
                    if (arrAncillaries[x].segments[y].status.code === 'AVAILABLE') {
                        arrSegmentsAvailable.push(arrAncillaries[x].segments[y]);
                    }
                }
            }
        }
        this.localStorageService.set('segmentsAvailable', arrSegmentsAvailable);
        meals = this.generateMealsPreSelected(bookingInfo);
        // SPECIAL MEALS SEGMENTS
        if (bookingInfo?.order.slices && bookingInfo?.order?.slices.length > 0) {
            for (let i = 0; i < bookingInfo.order.slices.length; i++) {
                for (let h = 0; h < bookingInfo.order.slices[i].segments.length; h++) {
                    segmentInfoOfAncillaries = this.getSegmentAvailableInAncillaries(bookingInfo.order.slices[i].segments[h], arrSegmentsAvailable);
                    mealSelected = {
                        id_segment: bookingInfo.order.slices[i].segments[h].id,
                        id_departure: bookingInfo.order.slices[i].segments[h].departureCity.code,
                        desc_departure: bookingInfo.order.slices[i].segments[h].departureCity.description,
                        id_arrival: bookingInfo.order.slices[i].segments[h].arrivalCity.code,
                        desc_arrival: bookingInfo.order.slices[i].segments[h].arrivalCity.description,
                        cabin: bookingInfo.order.slices[i].segments[h].cabin.type,
                        flightDate: bookingInfo.order.slices[i].segments[h].departureDateTime,
                        flightNumber: bookingInfo.order.slices[i].segments[h].flight.operationalFlightNumber,
                        company: bookingInfo.order.slices[i].segments[h].flight.operationalDisclosure,
                        specialMealAvailable: false,
                        passengers: [
                        ]
                    };
                    if(segmentInfoOfAncillaries) {
                        listUserInfants = [];
                        for (let j = 0; j < bookingInfo.passengers.length; j++) {
                            passengerFound = false;
                            angular.forEach(segmentInfoOfAncillaries.passengers, (p) => {
                                if (p === bookingInfo.passengers[j].passengerId) {
                                    passengerFound = true;
                                }
                            });
                            if (passengerFound) {
                                meal = meals.filter((x) => {
                                    return x.segmentId === bookingInfo.order.slices[i].segments[h].id
                                        && x.passengerId === bookingInfo.passengers[j].passengerId;
                                });

                                passengerMeal = {
                                    id_passenger: bookingInfo.passengers[j].passengerId,
                                    name: bookingInfo.passengers[j].externalPersonalInfo ? bookingInfo.passengers[j].externalPersonalInfo.name : bookingInfo.passengers[j].personalInfo.name,
                                    surname: bookingInfo.passengers[j].externalPersonalInfo ? (bookingInfo.passengers[j].externalPersonalInfo.firstSurname + ' ' + bookingInfo.passengers[j].externalPersonalInfo.lastSurname) : bookingInfo.passengers[j].personalInfo.surname,
                                    infant: false
                                };

                                // assign the values if the meal was preselected
                                if (meal.length === 1) {
                                    passengerMeal.menu = meal[0].serviceCode;
                                    passengerMeal.menudesc = meal[0].description;
                                }

                                mealSelected.passengers.push(passengerMeal);
                            } else {
                                if (bookingInfo.passengers[j].passengerType === 'INFANT') {
                                    listUserInfants.push(bookingInfo.passengers[j]);
                                }
                            }
                        }
                        angular.forEach(listUserInfants, (i) => {
                            angular.forEach(mealSelected.passengers, (p) => {
                                if (i.relatedPassengerId === p.id_passenger) {
                                    p.infant = true;
                                    p.nameInfant = i.externalPersonalInfo ? i.externalPersonalInfo.name : i.personalInfo.name;
                                    p.surnameInfant = i.externalPersonalInfo ? (i.externalPersonalInfo.firstSurname + ' ' + i.externalPersonalInfo.lastSurname) : i.personalInfo.surname;
                                }
                            });
                        });
                        // search the number of specials meals preselected by segment
                        numSpecialMeals = mealSelected.passengers.filter((x) => {
                            return x.menu && x.menudesc;
                        });
                        // assign the number of specials meals preselected
                        mealSelected.numSpecialMeals = numSpecialMeals.length;
                        specialMealNumSelectedTotal = specialMealNumSelectedTotal + mealSelected.numSpecialMeals;
                        mealSelected.specialMealAvailable = true;
                    }
                    mealsInfo.segments.push(mealSelected);
                }
            }
        }
        mealsInfo.specialMealNumSelected = specialMealNumSelectedTotal;
        this.specialMealInitialize(mealsInfo);
        this.localStorageService.set('mealsInfo', mealsInfo);
        return mealsInfo;
    }

    createInfoManagementBaggagesModel = (transformedInfo, actualFlight, InfoManagement): void => {
        let cabin, hold, auxBaggagesIndex, totalHold = 0, passengerHold = 0,
            title, titleHold, nameCabin, nameHold, totalQuantitySlicePerPassenger,
            ancillaries = angular.copy(transformedInfo.ancillariesInfo);
        actualFlight.sliceBaggage = {
            passBaggages: angular.copy(InfoManagement.managePassengers)
        };
        totalQuantitySlicePerPassenger = ancillaries?.passengerBaggagesTrips ? this.setTotalQuantitySlice(actualFlight, ancillaries.passengerBaggagesTrips) :  [];

        let totalQuantitySlice = 0;
        totalQuantitySlicePerPassenger?.forEach(passenger => totalQuantitySlice += passenger.totalBaggages);
        let totalFareQuantitySlice = 0;
        totalQuantitySlicePerPassenger?.forEach(passenger => totalFareQuantitySlice += passenger.totalExtraBaggages23);

        if (actualFlight?.fareFamilyConditions && actualFlight?.fareFamilyConditions.length > 0) {
            for (let sIndex = 0; sIndex < actualFlight.fareFamilyConditions.length; sIndex++) {

                if (actualFlight.fareFamilyConditions[sIndex].code === this.MmBAppConstants.FARE_CODES.EQMANO) {

                    title = actualFlight.fareFamilyConditions[sIndex].message ? actualFlight.fareFamilyConditions[sIndex].message.replace(/^[0-9]/, '') : '';
                    title = title ? title.slice(title.indexOf('('), title.indexOf(')') + 1) : '';
                    nameCabin = actualFlight.fareFamilyConditions[sIndex].name ? actualFlight.fareFamilyConditions[sIndex].name.replace(/^[0-9]/, '') : '';
                    cabin = {
                        units: actualFlight.fareFamilyConditions[sIndex].units ? actualFlight.fareFamilyConditions[sIndex].units : 0,
                        title: ' ' + title
                    };
                }

                if (actualFlight.fareFamilyConditions[sIndex].code === this.MmBAppConstants.FARE_CODES.EQBODEGA && totalQuantitySlice) {
                    title = actualFlight.fareFamilyConditions[sIndex].title ? actualFlight.fareFamilyConditions[sIndex].title.replace(/^[0-9]/, '') : '';
                    nameHold = actualFlight.fareFamilyConditions[sIndex].name ? actualFlight.fareFamilyConditions[sIndex].name.replace(/^[0-9]/, '') : '';

                    hold = {
                        units: totalQuantitySlice,
                        title: title
                    };
                }
            }
        } else if (totalQuantitySlice) {
            titleHold = this.$filter('translate')('MMB_HOLD_BAGGAGE_TEXT');
            nameHold = this.$filter('translate')('MMB_HOLD_BAGGAGE_TEXT');
            hold = {
                units: totalQuantitySlice,
                titleHold: titleHold
            };
        }
        for (let sIndex = 0; sIndex < actualFlight.sliceBaggage.passBaggages.length; sIndex++) {
            if (cabin && actualFlight.sliceBaggage.passBaggages[sIndex].passengerType !== this.MmBAppConstants.PASSENGER_TYPES.infant) actualFlight.sliceBaggage.passBaggages[sIndex].cabin = angular.copy(cabin);
            if (totalFareQuantitySlice) {
                actualFlight.sliceBaggage.passBaggages[sIndex].baggageData = this.addInfoBaggage(actualFlight.sliceBaggage.passBaggages[sIndex].baggageData,
                    { subtype: this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES.BAGGAGE_23 },
                    actualFlight.sliceBaggage.passBaggages[sIndex].passengerId, totalQuantitySlicePerPassenger);
            }
            if (InfoManagement?.orderItems?.baggage) {
                passengerHold = 0;
                for (auxBaggagesIndex = 0; auxBaggagesIndex < InfoManagement.orderItems.baggage.length; auxBaggagesIndex++) {
                    if (InfoManagement.orderItems.baggage[auxBaggagesIndex].sliceId === actualFlight.sliceId) {
                        let extraHold = InfoManagement.orderItems.baggage[auxBaggagesIndex].amount ? InfoManagement.orderItems.baggage[auxBaggagesIndex].amount : 1;
                        if (InfoManagement.orderItems.baggage[auxBaggagesIndex].passengerId === actualFlight.sliceBaggage.passBaggages[sIndex].passengerId) {
                            actualFlight.sliceBaggage.passBaggages[sIndex].baggageData = this.addInfoBaggage(actualFlight.sliceBaggage.passBaggages[sIndex].baggageData,
                                InfoManagement.orderItems.baggage[auxBaggagesIndex], actualFlight.sliceBaggage.passBaggages[sIndex].passengerId,
                                [{passengerId: actualFlight.sliceBaggage.passBaggages[sIndex].passengerId, totalExtraBaggages23:  extraHold}]);
                            actualFlight.sliceBaggage.passBaggages[sIndex].extraHold = extraHold;
                            actualFlight.sliceBaggage.passBaggages[sIndex].totalHold = extraHold + passengerHold;

                            totalHold = totalHold + extraHold;
                            passengerHold = passengerHold + extraHold;
                        }
                    }
                }
            }
        }

        if (cabin) actualFlight.sliceBaggage.cabin = {
            name: nameCabin,
            totalUnits: cabin.units
        };
        if (hold && hold.units) {
            actualFlight.sliceBaggage.hold = {
                name: nameHold,
                totalUnits: totalHold,
                totalglobal: hold.units
            };
        } else if (totalHold) {
            actualFlight.sliceBaggage.hold = {
                name: this.$filter('translate')('MMB_EXTRA_HOLD_BAGGAGE_TEXT'),
                totalUnits: totalHold,
                totalglobal: totalHold
            };
        }
    }

    createInfoManagementSpeqsModel = (transformedInfo,actualFlight, InfoManagement): void => {
        if (InfoManagement?.orderItems?.specialEquipment) {
            let hold, auxBaggagesIndex, totalHold = 0, passengerHold = 0,
                titleHold, nameHold, totalQuantitySlice = 0, SpeqsByRoutes = [],
                ancillaries = angular.copy(transformedInfo.ancillariesInfo);
            actualFlight.sliceSpeqs = {
                passBaggages: angular.copy(InfoManagement.managePassengers)
            };
            totalQuantitySlice = ancillaries?.speqsQuanty;


            if (totalQuantitySlice) {
                titleHold = this.$filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT');
                nameHold = this.$filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT');
                hold = {
                    units: totalQuantitySlice,
                    titleHold: titleHold
                };
            }

            for (let sIndex = 0; sIndex < actualFlight.sliceSpeqs.passBaggages.length; sIndex++) {
                const speqsByPassenger = [];
                if (hold) actualFlight.sliceSpeqs.passBaggages[sIndex].hold = angular.copy(hold);
                if (InfoManagement.orderItems.specialEquipment) {
                    passengerHold = 0;
                    for (auxBaggagesIndex = 0; auxBaggagesIndex < InfoManagement.orderItems.specialEquipment.length; auxBaggagesIndex++) {
                        if (InfoManagement.orderItems.specialEquipment[auxBaggagesIndex].sliceId === actualFlight.sliceId) {
                            if (InfoManagement.orderItems.specialEquipment[auxBaggagesIndex].passengerId === actualFlight.sliceSpeqs.passBaggages[sIndex].passengerId) {
                                speqsByPassenger.push(InfoManagement.orderItems.specialEquipment[auxBaggagesIndex]);
                                actualFlight.sliceSpeqs.passBaggages[sIndex].Speqs = speqsByPassenger;
                            }
                        }
                    }
                }
            }
            const bicycle = 'SPEQS_BICYCLE';
            const golf = 'SPEQS_GOLF_EQUIPMENT';
            const ski = 'SPEQS_SKI_SNOW';
            const scuba = 'SPEQS_SCUBA_TITLE';
            const fishing = 'SPEQS_FISHING_TITLE';
            const surfboard = 'SPEQS_SURFBOARD_TITLE';

            actualFlight.sliceSpeqs.passBaggages.forEach((element) => {
                if (element.Speqs) {
                    element.Speqs.forEach((elementSpeq) => {
                        if (elementSpeq.subtype == 'BICYCLE') {
                            elementSpeq.subtype = bicycle;
                        } else if (elementSpeq.subtype == 'GOLF_EQUIPMENT') {
                            elementSpeq.subtype = golf;
                        } else if (elementSpeq.subtype == 'SKI_SNOW') {
                            elementSpeq.subtype = ski;
                        } else if (elementSpeq.subtype == 'SCUBA_DIVING') {
                            elementSpeq.subtype = scuba;
                        } else if (elementSpeq.subtype == 'FISHING_EQUIPMENT') {
                            elementSpeq.subtype = fishing;
                        } else if (elementSpeq.subtype == 'SURFBOARD') {
                            elementSpeq.subtype = surfboard;
                        }
                    });
                }
            });



            if (hold && hold.units) {
                actualFlight.sliceSpeqs.hold = {
                    name: nameHold,
                    totalUnits: hold.units,
                    totalglobal: totalHold + hold.units,
                    speqs: SpeqsByRoutes
                };
            } else if (totalHold) {
                actualFlight.sliceSpeqs.hold = {
                    name: this.$filter('translate')('ANCILLARIES_SPEQS_TITLE_TEXT'),
                    totalUnits: totalHold,
                    totalglobal: totalHold,
                    speqs: SpeqsByRoutes
                };
            }
        }
    }

    generateCardInfo = (data, transformedInfo, breakDownInfo): void => {
        if (data?.PriorityInfo) {
            let actualflight = 0, i;
            const Priority = {
                type: 'ancillarie',
                category: 'priority',
                title: 'PriorityBoarding',
                fullWidth: false,
                showTravel: true,
                items: []
            };

            angular.forEach(data.PriorityInfo.PriorityInfo, (ItemPriority) => {
                let temporalItem: any = {};
                let quantityTotalByRoute = 0;
                let concept;
                temporalItem.concepts = [];
                temporalItem.showQuantity = false;
                for (i = 0; i < ItemPriority.segments.length; i++) {
                    temporalItem = {}, temporalItem.concepts = [];
                    if (ItemPriority.segments[i].slicePriority.hold) {
                        temporalItem.departure = {
                            city: ItemPriority.segments[i].departureCity.city.description,
                            code: ItemPriority.segments[i].departureCity.city.code
                        };
                        temporalItem.arrival = {
                            city: ItemPriority.segments[i].arrivalCity.city.description,
                            code: ItemPriority.segments[i].arrivalCity.city.code
                        };
                        quantityTotalByRoute = ItemPriority.segments[i].slicePriority.hold.totalUnits;
                        concept = {
                            status: null,
                            quantity: quantityTotalByRoute,
                            text: 'PRIORITY_BOARDING_TITLE'
                        };
                        temporalItem.concepts.push(concept);
                        Priority.items.push(temporalItem);
                        actualflight++;
                    }
                }
            });
            var cards = [];
            cards.push(Priority);
            transformedInfo.managementModel.CardPriority = cards;
            transformedInfo.managementModel.PriorityInfo.PriorityInfo.CardPriority = cards;
        }
        if (data?.invoice && data?.invoice?.specialEquipmentPricesByType) {
            const Speqs = {
                type: 'ancillarie',
                category: 'special-baggages',
                title: 'Equipaje especial',
                fullWidth: false,
                showTravel: true,
                items: []
            };

            var cards = [];


            angular.forEach(data.invoice.specialEquipmentPricesByType, (ItemSpecialEquipmentByType) => {

                const temporalItem: any = {};
                let quantityTotalByRoute = 0;
                temporalItem.concepts = [];
                temporalItem.showQuantity = false;


                angular.forEach(ItemSpecialEquipmentByType, (specialEquipmentByRoute) => {
                    temporalItem.departure = { city: specialEquipmentByRoute.departureCity, code: specialEquipmentByRoute.departureCityCode };
                    temporalItem.arrival = { city: specialEquipmentByRoute.arrivalCity, code: specialEquipmentByRoute.arrivalCityCode };
                    quantityTotalByRoute = quantityTotalByRoute + specialEquipmentByRoute.units;
                });

                const concept = { status: null, quantity: quantityTotalByRoute, text: 'ANCILLARIES_SPEQS_TITLE_TEXT' };

                temporalItem.concepts.push(concept);

                Speqs.items.push(temporalItem);
            });

            cards.push(Speqs);
            transformedInfo.managementModel.CardSpeqs = cards;
            transformedInfo.managementModel.SpeqsInfo.SpeqsInfo.CardSpeqs = cards;
        }
        if (data?.orderItems?.upgradingBid) {
            data.flights.forEach((flight, index) => {
                data.orderItems.upgradingBid.forEach((upgrade) => {
                    if (flight.segmentId === upgrade.segmentId) {
                        data.flights[index].upgradingBids = upgrade;
                    }
                });
            });
        }
        if (breakDownInfo && breakDownInfo.bundles && breakDownInfo.bundles.length > 0) {
            transformedInfo.managementModel.orderItems.bundles = [];
            transformedInfo.managementModel.invoice.bundle = {amount: 0, formatPrice: '', passengerAmount: 0, passengerPrice: '', passengersQuantity: 0};
            for (let i = 0; i < breakDownInfo.bundles.length; i++) {
                for (let j = 0; j < breakDownInfo.bundles[i].items.length; j++) {
                    switch (breakDownInfo.bundles[i].items[j].type) {
                        case this.MmBAppConstants.ANCILLARIES_TYPES.BAGGAGE:
                            // quitar maletas de los order items
                            break;
                        case this.MmBAppConstants.ANCILLARIES_TYPES.SEAT:
                            // quitar asientos de los order items
                            break;
                        case this.MmBAppConstants.ANCILLARIES_TYPES.INSURANCE:
                            // quitar seguro de los order items
                            break;
                        case this.MmBAppConstants.ANCILLARIES_TYPES.SPEQS:
                            // quitar speqs de los order items
                            break;
                        case this.MmBAppConstants.ANCILLARIES_TYPES.FLEXIBILITY:
                            if (transformedInfo.managementModel.orderItems.flexibilityOnDemand) {
                                delete transformedInfo.managementModel.orderItems.flexibilityOnDemand;
                                delete transformedInfo.managementModel.invoice.flexibilityOnDemand;
                            }
                            transformedInfo.managementModel.invoice.bundle.amount += breakDownInfo.bundles[i].items[j].priceItemAll;
                            break;
                        case this.MmBAppConstants.ANCILLARIES_TYPES.PRIORITY_BOARDING:
                            if (transformedInfo.managementModel.orderItems.priorityBoarding) {
                                transformedInfo.managementModel.orderItems.priorityBoarding.forEach((priority) => {
                                    delete transformedInfo.managementModel.orderItems.priorityBoarding;
                                });
                                transformedInfo.managementModel.CardPriority.forEach((priority) => {
                                    delete transformedInfo.managementModel.CardPriority;
                                });
                                transformedInfo.managementModel.PriorityInfo.PriorityInfo.forEach((priority) => {
                                    delete transformedInfo.managementModel.PriorityInfo.PriorityInfo;
                                });
                                for (let clave in transformedInfo.managementModel.invoice.priorityPricesByType) {
                                    delete transformedInfo.managementModel.invoice.priorityPricesByType[clave];
                                }
                                transformedInfo.managementModel.invoice.paidPriority = false;
                            }
                            transformedInfo.managementModel.invoice.bundle.amount += breakDownInfo.bundles[i].items[j].priceItemAll;
                            break;
                    }
                }

            }
            transformedInfo.managementModel.invoice.bundle.passengersQuantity = breakDownInfo.context.passengers.length;
            let passengerPrice = 0;
            for (let i = 0; i < breakDownInfo.bundles.length; i++) {
                for (let j = 0; j < breakDownInfo.bundles[i].items.length; j++) {
                    passengerPrice += breakDownInfo.bundles[i].items[j].priceItemAll;
                }
            }
            transformedInfo.managementModel.invoice.bundle.passengerAmount = passengerPrice / transformedInfo.managementModel.invoice.bundle.passengersQuantity;
            transformedInfo.managementModel.invoice.bundle.passengerPrice = this.CurrencyService.formatPrice(transformedInfo.managementModel.invoice.currency, transformedInfo.managementModel.invoice.bundle.passengerAmount, true);
            transformedInfo.managementModel.invoice.bundle.formatPrice = this.CurrencyService.formatPrice(transformedInfo.managementModel.invoice.currency, passengerPrice, true);
            transformedInfo.managementModel.orderItems.bundles.push(breakDownInfo.bundles);
        }
    }

    private specialMealInitialize = (meal) => {
        let arrPassengers = [];

        for (let x = 0; x < meal.segments.length; x++) {
            arrPassengers = this.generateArrPassengers(meal, x);
        };
        this.localStorageService.set('specialMealsCopy', arrPassengers);
        return arrPassengers;
    };

    private generateArrPassengers = (meal, x) => {
        let arrPassengersInit = [];
        for (let y = 0; y < meal.segments[x].passengers.length; y++) {
            arrPassengersInit.push({
                segmentId: this.getSegmentId(meal, x),
                id: this.getId(meal, x, y),
                infant: this.getInfant(meal, x, y),
                menu: this.getMenu(meal, x, y),
                menudesc: this.getMenuDesc(meal, x, y),
                name: this.getName(meal, x, y),
                surname: this.getSurname(meal, x, y)
            });
        };
        return arrPassengersInit;
    };

    private getSegmentId = (meal, x) => {
        return (meal.segments[x].id_segment ? meal.segments[x].id_segment : '');
    };

    private getId = (meal, x, y) => {
        return (meal.segments[x].passengers[y].id_passenger ? meal.segments[x].passengers[y].id_passenger : '');
    };

    private getInfant = (meal, x, y) => {
        return (meal.segments[x].passengers[y].infant ? meal.segments[x].passengers[y].infant : '');
    };

    private getMenu = (meal, x, y) => {
        return (meal.segments[x].passengers[y].menu ? meal.segments[x].passengers[y].menu : 'standard');
    };

    private getMenuDesc = (meal, x, y) => {
        return (meal.segments[x].passengers[y].menudesc ? meal.segments[x].passengers[y].menudesc : 'standard');
    };

    private getName = (meal, x, y) => {
        return (meal.segments[x].passengers[y].name ? meal.segments[x].passengers[y].name : '');
    };

    private getSurname = (meal, x, y) => {
        return (meal.segments[x].passengers[y].surname ? meal.segments[x].passengers[y].surname : '');
    };

    private getSegmentAvailableInAncillaries = (segment, allAvailableSegments) => {
        let result;
        angular.forEach(allAvailableSegments, (s) => {
            if (segment.id === s.id) {
                result = s;
            };
        });
        return result;
    };

    private generateMealsPreSelected = (getBookingInfo) => {
        const pasInfo = [];
        angular.forEach(getBookingInfo?.order?.orderItems, (orderItem) => {
            if (orderItem.type === 'meal') {
                pasInfo.push(orderItem);
            }
        });

        return pasInfo;
    };

    private setTotalQuantitySlice = (actualFlight, passengerBaggagesTrips) => {
        let totalQuantity;
        passengerBaggagesTrips.forEach(passenger => {
            const passengerTrip = passenger.trips.filter(trip =>trip.id === actualFlight.sliceId);

            if(passengerTrip.length > 0) {
                const baggages23 = passengerTrip[0].pieces.filter(baggage => baggage.subtype === this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES.BAGGAGE_23)[0];
                if (this.isExtraPiecesOrFranchisePieces(baggages23, totalQuantity)) {
                    const totalBaggages23 = baggages23.franchisePieces + (baggages23.extraPieces !== null ? baggages23.extraPieces.units : 0);
                    if(totalQuantity) {
                        totalQuantity.push({passengerId: passenger.id, totalBaggages:  passengerTrip[0].totalBaggages, totalExtraBaggages23: totalBaggages23});
                    } else {
                        totalQuantity = [{passengerId: passenger.id, totalBaggages:  passengerTrip[0].totalBaggages, totalExtraBaggages23: totalBaggages23}];
                    }
                } else {
                    totalQuantity = [{passengerId: passenger.id, totalBaggages:  passengerTrip[0].totalBaggages, totalExtraBaggages23: 0}];
                };
            };
        });
        return totalQuantity;
    };

    private isExtraPiecesOrFranchisePieces = (baggages23, totalQuantity) => {
        return (baggages23 && (totalQuantity || baggages23.extraPieces !== null || baggages23.franchisePieces > 0));
    };

    private addInfoBaggage = (actualData, baggageTrip, passengerId, totalQuantitySlicePerPassenger) => {
        let data = [], baggageData, find = false;
        if(baggageTrip) {
            baggageData = {
                passengerId: passengerId,
                subtype: baggageTrip.subtype,
                description: this.getDescription(baggageTrip.subtype),
                purchasedPieces: totalQuantitySlicePerPassenger.filter(passenger => passenger.passengerId === passengerId)[0]?.totalExtraBaggages23
            };
        };
        if (actualData) {
            angular.forEach(actualData, (baggage) => {
                if (baggage.subtype === baggageData.subtype) {
                    baggage.purchasedPieces += baggageData.purchasedPieces;
                    find = true;
                }
                data.push(baggage);
            });
        };
        if (!find && baggageData?.purchasedPieces > 0) {
            data.push(baggageData);
        };
        return data;
    };

    private getDescription = (type): string => {
        switch (type) {
                case this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES.BAGGAGE_15:
                    return this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_15;
                case this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES.BAGGAGE_23:
                    return this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_23;
                case this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES.BAGGAGE_32:
                    return this.BookingDashboardConstants.ANCILLARIES_BAGGAGES_TYPES_DESCRIPTION.BAGGAGE_32;
        };
    };

    handleTransformedInfoAncillariesInfo = (paramsAncillariesInfo) => {
        let { breakDownInfo, transformedInfo, haveIberiaFlights } = paramsAncillariesInfo;
        this.generateCardInfo(transformedInfo.managementModel, transformedInfo, breakDownInfo);
        if (transformedInfo.ancillariesInfo) {
            transformedInfo.isAncillariesInTime = 
                transformedInfo.ancillariesInfo?.ancillariesAvailable?.length > 0 ?
                this.checkAncillariesInTime(transformedInfo.ancillariesInfo.ancillariesAvailable, transformedInfo, haveIberiaFlights) : 
                false;
            transformedInfo.ancillariesInfo.isAncillariesInTime = transformedInfo.isAncillariesInTime;
            transformedInfo.ancillariesInfo.isPnrGroup = transformedInfo.isPnrGroup;
        };
    };

    manageAncillariesSeatBySpeqsModel = (InfoManagement, flightsSlices, transformedInfo) => {
        for (let tIndex = 0; tIndex < InfoManagement.flights.length; tIndex++) {
            this.createInfoManagementSpeqsModel(transformedInfo, InfoManagement.flights[tIndex], InfoManagement);
            if (InfoManagement?.orderItems?.seat) {
                for (let sIndex = 0; sIndex < InfoManagement.orderItems.seat.length; sIndex++) {
                    this.processSpeqsSeat(InfoManagement, flightsSlices, tIndex, sIndex);
                };
            };
        };
    };

    private processSpeqsSeat = (InfoManagement, flightsSlices, tIndex, sIndex) => {
        if (
            InfoManagement.flights[tIndex].segmentId === InfoManagement.orderItems.seat[sIndex].segmentId &&
            InfoManagement.orderItems.seat[sIndex].emd !== 'PENDING_PAYMENT'
        ) {
            this.findAndSetArrivalCity(InfoManagement, flightsSlices, tIndex, sIndex);
        };
    };

    private findAndSetArrivalCity = (InfoManagement, flightsSlices, tIndex, sIndex) => {
        let found = false;
        let j = 0;
        while (!found && j < flightsSlices.length) {
            for (let xIndex = 0; xIndex < flightsSlices[j].segments.length; xIndex++) {
                if (InfoManagement.flights[tIndex].segmentId === flightsSlices[j].segments[xIndex].segmentId) {
                    InfoManagement.orderItems.seat[sIndex].arrivalCity = flightsSlices[j].segments[xIndex].arrivalCity.city.description;
                    InfoManagement.orderItems.seat[sIndex].arrivalCityCode = flightsSlices[j].segments[xIndex].arrivalCity.code;
                    found = true;
                };
            };
            j++;
        };
    };

    setManagementInsurances = (InfoManagement, getBookingInfo) => {
        const currency = this.getCurrencyFromBooking(getBookingInfo);
        InfoManagement.manageInsurances = InfoManagement?.orderItems?.insurance ? InfoManagement.orderItems.insurance : [];
        this.setManageInsurance(InfoManagement, currency);
        InfoManagement.manageAllianzFusionInsurances = InfoManagement?.orderItems?.allianzFusion ? InfoManagement.orderItems.allianzFusion : [];
        this.setManageallianzFusion(InfoManagement, currency);
    };

    private getCurrencyFromBooking = (getBookingInfo) => {
        if (getBookingInfo?.contextMetadata?.currencies && getBookingInfo.contextMetadata.currencies[0]) {
            return getBookingInfo.contextMetadata.currencies[0];
        }
        return null;
    };

    private setManageallianzFusion = (InfoManagement, currency) => {
        angular.forEach(InfoManagement.manageAllianzFusionInsurances, (allianzFusion) => {
            if (allianzFusion.price && allianzFusion.price.total) {
                allianzFusion.totalPrice = this.CurrencyService.formatPrice(
                    this.CurrencyService.getCurrencyObject(currency),
                    allianzFusion.price.total,
                    true
                ).replace(' ', '');
            } else {
                allianzFusion.totalPrice = '';
            }
        });
    };

    private setManageInsurance = (InfoManagement, currency) => {
        angular.forEach(InfoManagement.manageInsurances, (insurance) => {
            if (insurance.price && insurance.price.total) {
                insurance.totalPrice = this.CurrencyService.formatPrice(
                    this.CurrencyService.getCurrencyObject(currency),
                    insurance.price.total,
                    true
                ).replace(' ', '');
            } else {
                insurance.totalPrice = '';
            }
        });
    };

    manageVehicleInfo = (InfoManagement, printVoucherUrlVehicle) => {
        let vehicleTitle;
        if (InfoManagement?.orderItems?.vehicle) {
            if (InfoManagement.orderItems.vehicle.length === 1) {
                vehicleTitle = this.$filter('translate')('MMB_VC_IB_VACIONES_YOUR_CAR');
                InfoManagement.orderItems.vehicleTitle = vehicleTitle;
            } else {
                vehicleTitle = this.$filter('translate')('MMB_VC_IB_VACIONES_YOUR_CARS');
                InfoManagement.orderItems.vehicleTitle = vehicleTitle;
            };
            InfoManagement.orderItems.vehicle = this.createVehicles(InfoManagement, vehicleTitle, printVoucherUrlVehicle);
        };
    };

    private createVehicles = (InfoManagement, vehicleTitle, printVoucherUrlVehicle) => {
        let dateVehiclePickUp, dateVehicleReturn;
        for (let indexVehicle = 0; indexVehicle < InfoManagement.orderItems.vehicle.length; indexVehicle++) {
            dateVehiclePickUp = InfoManagement.orderItems.vehicle[indexVehicle].pickupDateTime;
            dateVehicleReturn = InfoManagement.orderItems.vehicle[indexVehicle].returnDateTime;
            let dateFormatCheckInVehicle = this.$filter('DateFormatFilter')(dateVehiclePickUp);
            let dateFormatCheckOutVehicle = this.$filter('DateFormatFilter')(dateVehicleReturn);
            InfoManagement.orderItems.vehicle[indexVehicle].checkDateVehicleIn = dateFormatCheckInVehicle.formatedDate;
            InfoManagement.orderItems.vehicle[indexVehicle].checkDateTimeVehicleIn = dateFormatCheckInVehicle.dateTime;
            InfoManagement.orderItems.vehicle[indexVehicle].checkDateVehicleOut = dateFormatCheckOutVehicle.formatedDate;
            InfoManagement.orderItems.vehicle[indexVehicle].checkDateVehicleTimeOut = dateFormatCheckOutVehicle.dateTime;
            let dateFormatMilliseconsVehicle = dayjs(InfoManagement.orderItems.vehicle[indexVehicle].pickupDateTime);
            InfoManagement.orderItems.vehicle[indexVehicle].orderDate = dateFormatMilliseconsVehicle.valueOf();
            InfoManagement.orderItems.vehicle[0].vehicleTitle = vehicleTitle;
            InfoManagement.orderItems.vehicle[indexVehicle].printURL = printVoucherUrlVehicle;
            if (InfoManagement.orderItems.vehicle[indexVehicle].provider.code === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS) {
                InfoManagement.orderItems.vehicle[indexVehicle].imagenVehicle = this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_LINK_AVIS;
            } else {
                InfoManagement.orderItems.vehicle[indexVehicle].imagenVehicle = this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_LINK_BUDGET;
            }
        };
    };

    manageHotelInfo = (InfoManagement, printVoucherUrlHotel): void => {
        let hotelTitle;
        let dateHotelIn;
        let dateHotelOut;
        if (InfoManagement?.orderItems?.hotel) {
            if (InfoManagement.orderItems.hotel.length === 1) {
                hotelTitle = this.$filter('translate')('MMB_VC_IB_VACIONES_YOUR_HOTEL');
                InfoManagement.orderItems.hotelTitle = hotelTitle;
            } else {
                hotelTitle = this.$filter('translate')('MMB_VC_IB_VACIONES_YOUR_HOTELS');
                InfoManagement.orderItems.hotelTitle = hotelTitle;
            }
            for (let indexHotel = 0; indexHotel < InfoManagement.orderItems.hotel.length; indexHotel++) {
                dateHotelIn = InfoManagement.orderItems.hotel[indexHotel].checkInDateTime;
                dateHotelOut = InfoManagement.orderItems.hotel[indexHotel].checkOutDateTime;
                let dateFormatCheckInHotel = this.$filter('DateFormatFilter')(dateHotelIn);
                let dateFormatCheckOutHotel = this.$filter('DateFormatFilter')(dateHotelOut);
                InfoManagement.orderItems.hotel[indexHotel].checkDateHotelIn = dateFormatCheckInHotel.formatedDate;
                InfoManagement.orderItems.hotel[indexHotel].checkDateTimeHotelIn = dateFormatCheckInHotel.dateTime;
                InfoManagement.orderItems.hotel[indexHotel].checkDateHotelOut = dateFormatCheckOutHotel.formatedDate;
                InfoManagement.orderItems.hotel[indexHotel].checkDateHotelTimeOut = dateFormatCheckOutHotel.dateTime;
                let dateFormatMilliseconsHotel = dayjs(InfoManagement.orderItems.hotel[indexHotel].checkInDateTime);
                InfoManagement.orderItems.hotel[indexHotel].orderDate = dateFormatMilliseconsHotel.valueOf();
                InfoManagement.orderItems.hotel[0].hotelTitle = hotelTitle;
                InfoManagement.orderItems.hotel[indexHotel].printURL = printVoucherUrlHotel;
            };
        };
    };

    manageAncillariesPriorityBoarding = (InfoManagement, flightsSlicesPriority) => {
        if (InfoManagement?.orderItems?.priorityBoarding) {
            for (let tIndex = 0; tIndex < InfoManagement.flights.length; tIndex++) {
                this.processPriorityBoardingForFlight(InfoManagement, flightsSlicesPriority, tIndex);
            }
            InfoManagement.PriorityInfo = {
                PriorityInfo: flightsSlicesPriority ? flightsSlicesPriority : []
            };
            this.localStorageService.set('PriorityInfo', InfoManagement.PriorityInfo);
        }
    };

    private processPriorityBoardingForFlight = (InfoManagement, flightsSlicesPriority, tIndex) => {
        this.createInfoManagementPriorityModel(InfoManagement.flights[tIndex], InfoManagement);
        if (InfoManagement.orderItems.priorityBoarding) {
            for (let sIndex = 0; sIndex < InfoManagement.orderItems.priorityBoarding.length; sIndex++) {
                this.processPriorityBoardingForSegment(InfoManagement, flightsSlicesPriority, tIndex, sIndex);
            }
        }
    };

    private createInfoManagementPriorityModel = (actualFlight, InfoManagement): void => {
        if (InfoManagement?.orderItems?.priorityBoarding) {
            this.initializeFlightPriorityStructure(actualFlight, InfoManagement);
            this.enrichPriorityBoardingWithPassengerData(actualFlight, InfoManagement);
        };
    };

    private initializeFlightPriorityStructure = (actualFlight, InfoManagement): void => {
        actualFlight.slicePriority = {
            passBaggages: angular.copy(InfoManagement.managePassengers),
            hold: { 
                passengerId: null,
                segmentId: actualFlight.segmentId,
                totalUnits: 0
            }
        };
    };

    private isPriorityBoardingForPassenger = (priorityItem, passengerId, segmentId): boolean => {
        return priorityItem.segmentId === segmentId && 
               priorityItem.passengerId === passengerId;
    };

    private assignPassengerDataToPriorityItem = (passenger, priorityItem, priorityByPassenger): void => {
        priorityItem.name = passenger.personalInfo.name;
        priorityItem.surname = passenger.personalInfo.surname;
        priorityByPassenger.push(priorityItem);
    };

    private enrichPriorityBoardingWithPassengerData = (actualFlight, InfoManagement): void => {
        const passengers = actualFlight.slicePriority.passBaggages;
        const priorityItems = InfoManagement.orderItems.priorityBoarding;
        let units = 0;
        let priorityByPassenger = [];

        for (let sIndex = 0; sIndex < passengers.length; sIndex++) {
            const passenger = passengers[sIndex];
            
            for (let auxBaggagesIndex = 0; auxBaggagesIndex < priorityItems.length; auxBaggagesIndex++) {
                if (!this.isPriorityBoardingForPassenger(priorityItems[auxBaggagesIndex], passenger.passengerId, actualFlight.segmentId)) {
                    continue;
                }
                
                this.assignPassengerDataToPriorityItem(passenger, priorityItems[auxBaggagesIndex], priorityByPassenger);
                units = units + 1;
                actualFlight.slicePriority.hold.passengerId = passenger.passengerId;
                actualFlight.slicePriority.hold.totalUnits = units;
            }
        }
        
        if (priorityByPassenger.length > 0) {
            actualFlight.slicePriority.passBaggages[0].priority = priorityByPassenger;
        };
    };

    private processPriorityBoardingForSegment = (InfoManagement, flightsSlicesPriority, tIndex, sIndex) => {
        if (InfoManagement.flights[tIndex].segmentId === InfoManagement.orderItems.priorityBoarding[sIndex].segmentId && InfoManagement.orderItems.priorityBoarding[sIndex].emd !== 'PENDING_PAYMENT') {
            let found = false;
            let j = 0;
            while (!found && j < flightsSlicesPriority.length) {
                let paramsPriory = { flightsSlicesPriority, j, tIndex, sIndex, InfoManagement, found };
                found = this.forPriorityBoarding(paramsPriory);
                j++;
            }
        }
    };

    private forPriorityBoarding = (paramsPriority) => {
        let { flightsSlicesPriority, j, tIndex, sIndex, InfoManagement, found } = paramsPriority;
        for (let xIndex = 0; xIndex < flightsSlicesPriority[j].segments.length; xIndex++) {
            if (InfoManagement.flights[tIndex].segmentId === flightsSlicesPriority[j].segments[xIndex].segmentId) {
                InfoManagement.orderItems.priorityBoarding[sIndex].departureCity = flightsSlicesPriority[j].departureCity.city.description;
                InfoManagement.orderItems.priorityBoarding[sIndex].departureCityCode = flightsSlicesPriority[j].departureCity.code;
                InfoManagement.orderItems.priorityBoarding[sIndex].arrivalCity = flightsSlicesPriority[j].arrivalCity.city.description;
                InfoManagement.orderItems.priorityBoarding[sIndex].arrivalCityCode = flightsSlicesPriority[j].arrivalCity.code;
                found = true;
            };
        };
        return found;
    };

     manageAncillariesThirdPartyCompanies = (ancillariesInfo, InfoManagement) => {
        if (!this.hasValidAncillariesData(ancillariesInfo, InfoManagement)) {
            return;
        }
        for (let tIndex = 0; tIndex < ancillariesInfo.ancillaries.length; tIndex++) {
            if (ancillariesInfo.ancillaries[tIndex].companies && InfoManagement.flights) {
                angular.forEach(ancillariesInfo.ancillaries[tIndex].companies, (item, indexId) => {
                    InfoManagement.flights.find((flight, index) => {
                        angular.forEach(item.deeplinks, (deeplink, i) => {
                            if (flight.segmentId === deeplink.segmentId) {
                                flight.thirdPartyCompanies = item;
                            }
                        });
                    });
                });
            };
        };
    };

    private hasValidAncillariesData = (ancillariesInfo, InfoManagement): boolean => {
        return ancillariesInfo?.ancillaries?.length > 0 &&
            InfoManagement?.flights?.length > 0;
    };

    manageAncillariesSeatByBaggageModel = (InfoManagement, noInfantPass, flightsSlices, transformedInfo) => {
        let found = false;
        for (let tIndex = 0; tIndex < InfoManagement.flights.length; tIndex++) {
            this.createInfoManagementBaggagesModel(transformedInfo, InfoManagement.flights[tIndex], InfoManagement);
            if (InfoManagement?.orderItems?.seat) {
                let paramsOrderItemsSeat = {InfoManagement, found, noInfantPass, tIndex, flightsSlices};
                this.handleOrderItemsSeat(paramsOrderItemsSeat);
            };
        };
    };

    private handleOrderItemsSeat = (paramsOrderItemsSeat) => {
        let {InfoManagement, found, noInfantPass, tIndex, flightsSlices} = paramsOrderItemsSeat;
        let j = 0;
        for (let sIndex = 0; sIndex < InfoManagement.orderItems.seat.length; sIndex++) {
            let paramsNoInfant = { found, noInfantPass, InfoManagement, sIndex, j }
            this.noInfantPass(paramsNoInfant);
            if (InfoManagement.flights[tIndex].segmentId === InfoManagement.orderItems.seat[sIndex].segmentId && InfoManagement.orderItems.seat[sIndex].emd !== 'PENDING_PAYMENT') {
                InfoManagement.flights[tIndex].seats.push({
                    id:InfoManagement.orderItems.seat[sIndex].passengerId,
                    code: InfoManagement.orderItems.seat[sIndex].row + InfoManagement.orderItems.seat[sIndex].column,
                    userName: InfoManagement.orderItems.seat[sIndex].userName,
                    userSurname: InfoManagement.orderItems.seat[sIndex].userSurname,
                    extraInfo: InfoManagement.orderItems.seat[sIndex].extraInfo ? InfoManagement.orderItems.seat[sIndex].extraInfo : null,
                    infant: InfoManagement.orderItems.seat[sIndex].infant,
                    selected: InfoManagement.orderItems.seat[sIndex].selected
                });
                InfoManagement.orderItems.seat[sIndex].departureCity = InfoManagement.flights[tIndex].departureCity.city.description;
                InfoManagement.orderItems.seat[sIndex].departureCityCode = InfoManagement.flights[tIndex].departureCity.code;
                found = false, j = 0;
                let paramsWhileSlices = {found, flightsSlices, InfoManagement,tIndex, sIndex, j}
                this.whileSlices(paramsWhileSlices);
            };
        };
    };

    private whileSlices = (paramsWhileSlices) => {
        let {found, flightsSlices, InfoManagement,tIndex, sIndex, j} = paramsWhileSlices;
         while (!found && j < flightsSlices.length) {
            for (let xIndex = 0; xIndex < flightsSlices[j].segments.length; xIndex++) {
                if (InfoManagement.flights[tIndex].segmentId === flightsSlices[j].segments[xIndex].segmentId) {
                    InfoManagement.orderItems.seat[sIndex].arrivalCity = flightsSlices[j].segments[xIndex].arrivalCity.city.description;
                    InfoManagement.orderItems.seat[sIndex].arrivalCityCode = flightsSlices[j].segments[xIndex].arrivalCity.code;
                    found = true;
                };
            };
            j++;
        };
    };

    private noInfantPass = (paramsNoInfant) => {
        let { found, noInfantPass, InfoManagement, sIndex, j } = paramsNoInfant;
         while (!found && j < noInfantPass.length) {
            if (InfoManagement.orderItems.seat[sIndex].passengerId === noInfantPass[j].passengerId) {
                InfoManagement.orderItems.seat[sIndex].userName = noInfantPass[j].personalInfo.name;
                InfoManagement.orderItems.seat[sIndex].userSurname = noInfantPass[j].personalInfo.surname;
                InfoManagement.orderItems.seat[sIndex].infant = noInfantPass[j].infant;
                found = true;
            }
            j++;
        };
    };

    setPackagedProduct = (paramsPackaged) => {
        let {InfoManagement, phonesListIBHolidays, getBookingInfo, countInfants, flightsSlices, breakDownInfo} = paramsPackaged;
        let printURLs = null;
        if (InfoManagement?.orderItems?.packagedProduct) {
            printURLs = this.fillInfoManagementWithPackageProducts(phonesListIBHolidays, InfoManagement);
            InfoManagement.packages = InfoManagement.orderItems.packagedProduct;
        } else {
            InfoManagement.invoice = this.InvoiceDashboardTransformer.getInvoiceDataInfo(
                getBookingInfo,
                InfoManagement,
                countInfants,
                flightsSlices,
                breakDownInfo
            );
        };
        return printURLs;
    };

    private fillInfoManagementWithPackageProducts = (phonesListIBHolidays, InfoManagement) => {
        const print = {
            printVoucherUrlHotel: '',
            printVoucherUrlVehicle: '',
            printVoucherUrlItinerary: '',
            printVoucherUrlExperience: '',
            printVoucherUrlTransfer: ''
        };
        
        this.handlePhonesListStorage(phonesListIBHolidays);

        for (let productPackage = 0; productPackage < InfoManagement.orderItems.packagedProduct.length; productPackage++) {
            const currentPackage = InfoManagement.orderItems.packagedProduct[productPackage];
            
            for (let typeProductPackage = 0; typeProductPackage < currentPackage.products.length; typeProductPackage++) {
                const product = currentPackage.products[typeProductPackage];
                const url = currentPackage.printVoucherUrl;
                
                this.classifyProduct(product, url, InfoManagement, print);
            }
        }

        return print;
    };

     private handlePhonesListStorage(phonesListIBHolidays) {
        if (phonesListIBHolidays) {
            phonesListIBHolidays.packagedProduct = true;
            this.localStorageService.set('phonesListIBV', phonesListIBHolidays);
        }
    };

    private classifyProduct(product, url, InfoManagement, print) {
        const context = { InfoManagement, print };
        
        if (product.type === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL) {
            this.addProductToCategory(context, { categoryKey: 'hotel', product, url, printUrlKey: 'printVoucherUrlHotel', addPrintURL: false });
        } else if (product.type === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_VEHICLE) {
            this.addProductToCategory(context, { categoryKey: 'vehicle', product, url, printUrlKey: 'printVoucherUrlVehicle', addPrintURL: false });
        } else if (product.type === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_FLIGHT_ITINERARY) {
            this.addProductToCategory(context, { categoryKey: 'flightItinerary', product, url, printUrlKey: 'printVoucherUrlItinerary', addPrintURL: true });
        } else if (product.type === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_EXPERIENCE) {
            this.addProductToCategory(context, { categoryKey: 'experience', product, url, printUrlKey: 'printVoucherUrlExperience', addPrintURL: true });
        } else if (product.type === this.MmBAppConstants.IBERIA_HOLIDAYS.MMB_IB_VACIONES_TYPE_PACKAGE_TRANSFER) {
            this.addProductToCategory(context, { categoryKey: 'transfer', product, url, printUrlKey: 'printVoucherUrlTransfer', addPrintURL: true });
        }
    };

    private addProductToCategory(context, categoryConfig) {
        const { InfoManagement, print } = context;
        const { categoryKey, product, url, printUrlKey, addPrintURL } = categoryConfig;
        
        if (!InfoManagement.orderItems[categoryKey]) {
            InfoManagement.orderItems[categoryKey] = [];
            print[printUrlKey] = url;
        }
        
        InfoManagement.orderItems[categoryKey].push(product);
        
        if (addPrintURL) {
            InfoManagement.orderItems[categoryKey][0].printURL = url;
        }
    };
};
