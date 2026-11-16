import { TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { GeneralItemSource, HeaderDataHeaderModel, ShoppingBasketBaggages, ShoppingBasketBundle, ShoppingBasketBundleInfo, ShoppingBasketBundleInfoItems, ShoppingBasketDiscountObjectType, ShoppingBasketDiscountType, ShoppingBasketDiscountsModel, ShoppingBasketFlexibilization, ShoppingBasketFlexibilizationInfo, ShoppingBasketFlexibilizationInfoConcepts, ShoppingBasketFlexibilizationInfoItems, ShoppingBasketGlobickTransfers, ShoppingBasketGlobickTransfersInfo, ShoppingBasketInsurance, ShoppingBasketInsuranceAllianzFusion, ShoppingBasketOthers, ShoppingBasketOthersItems, ShoppingBasketPetc, ShoppingBasketPetcSegment, ShoppingBasketPriority, ShoppingBasketPriorityInfoTrips, ShoppingBasketSeats, ShoppingBasketSeatsSegments, ShoppingBasketSegmentsTypes, ShoppingBasketSpeqs, ShoppingBasketSpeqsSegment, ShoppingBasketTripBaggagesSegment, ShoppingBasketTripPassenger, ShoppingBasketType, ShoppingBasketAssistCard } from '@src/app/core/models/ib-booking-availability/header-model';
import { Ancillarie, AncillarieSegment, GeneralItem, GenericSummaryItem, PassengerType, Trip } from 'commercial-management--digital--web-components-design--library';
import { Cabin, Destination, Flight, Segment, Slice } from '@src/app/core/models/ib-booking-payments/ib-booking-summary-model';
import { EntriesArrayPipe } from '@src/app/shared/pipes/entries-array.pipe';
dayjs.extend( localizedFormat );

type DescriptionWithPlurals = {
    plural: string;
    singular: string;
};
@Injectable({providedIn: 'root'})
export class IbSummaryTransformerService {

    constructor (
        private TranslateService: TranslateService
    ) { }

    public titleCasePipe = ( input: string ): string => {
        const titleCasePipe = new TitleCasePipe();
        return titleCasePipe.transform( input );
    };

    private discountsArrayPipe = ( dicounts: ShoppingBasketDiscountType ): ShoppingBasketDiscountObjectType[] => {
        const discountsArrayPipe = new EntriesArrayPipe();
        return discountsArrayPipe.transform( dicounts );
    };

    public setTrips = ( slices: Slice[], fareFamilyConditions: AvailabilityTransformerModel.FareFamilyCondition[] ): Trip[] => {
        const getFareFamilyMap = (fareFamilyConditions: AvailabilityTransformerModel.FareFamilyCondition[]) => {
            const map = new Map<string, AvailabilityTransformerModel.FareFamilyCondition>();
            fareFamilyConditions.forEach(condition => {
                map.set(condition.commercialCode, condition);
            });
            return map;
        };
        const setTrip = ( info: Destination, destinationDate: string, cabin?: Cabin ) => {
            const trip = {
                airport: info.name,
                city: info.city.description,
                date: dayjs(destinationDate).format('DD MMM YYYY / HH:mm'),
                terminal: info?.terminal,
                cabin: cabin?.description
            };
            
            return trip;
        };
        const setFlight = ( flight: Flight ) => {
            return {
                airplane: flight.aircraft.description,
                operatedBy: `${ this.TranslateService.instant( 'SUMMARY_SEGMENT_DETAILS_OPERATED' ) } ${ flight.operationalCarrier.name }`,
                title: `${ this.TranslateService.instant( 'SUMMARY_SEGMENT_DETAILS_FLIGHT_NUMBER' ) } ${ flight.marketingFlightNumber }`
            };
        };
        const setFare = ( fareFamilyConditions: AvailabilityTransformerModel.FareFamilyCondition ) => {
            const mappedFamilies = fareFamilyConditions.conditions.map( ( family: AvailabilityTransformerModel.Condition ) => {
                const { code, text, name } = family;
                return {
                    code,
                    text,
                    title: name
                };
            } );
            return {
                items: mappedFamilies,
                title: `${ fareFamilyConditions.cabinDescription } ${ fareFamilyConditions.commercialName }`
            };
        };
        const setDuration = ( duration: number ): string => {
            if ( duration <= 0 ) return '0';
            const hours = Math.floor( duration / 60 );
            const minutes = duration % 60;
            return `${ hours > 0 ? hours + 'h ' : '' }${ minutes > 0 ? minutes + 'min.' : '' }`;
        };

        const getSegmentsInfo = (segments:Segment[]) => {
            return segments.map((segment)=> {
                const {departure, arrival, id, duration, flight, arrivalDateTime, departureDateTime, cabin} = segment;

                return {
                    id,
                    routeCodeFormatted: `${ departure.city.description } (${ departure.city.code }) - ${ arrival.city.description } (${ arrival.city.code })`,
                    routeFormatted: `${ departure.city.description } - ${ arrival.city.description }`,
                    departure: setTrip( departure, departureDateTime, cabin ),
                    arrival: setTrip( arrival, arrivalDateTime),
                    flight: setFlight( flight ),
                    duration: setDuration( duration )
                };
            });
        };

        const fareFamilyMap = getFareFamilyMap(fareFamilyConditions);
        return (slices.map((slice:Slice) =>  {
            const {segments, id, sliceId  }=slice;
            return {
                id: id ? id : sliceId,
                segments: getSegmentsInfo(segments),
                fare: setFare( fareFamilyMap.get(segments[0].cabin.fareFamily) )
            };

        }) as any);

    };

    public setPassengers = ( passengers: ShoppingBasketTripPassenger[] ): PassengerType[] => {
        const passengerList = [];
        passengers.forEach( ( passenger: ShoppingBasketTripPassenger ) => {
            const { type, taxes, perPassengerPrice, namesList } = passenger;
            const names = namesList.map( ( name => this.titleCasePipe( name ) ) );
            const passInfo = {
                avios: null,
                fare: perPassengerPrice,
                names,
                type,
                taxes
            };
            passengerList.push( passInfo );
        } );
        return passengerList;
    };

    public setOtherItemsFromBasket = ( basket: ShoppingBasketType): GenericSummaryItem[] => {
        const others: GenericSummaryItem[] = [];
        const onHold = basket.othersModel.others.filter( ( other ) => other.type === 'ONHOLD' );
        const notOnHold = basket.othersModel.others.filter( ( other ) => other.type !== 'ONHOLD' );
        if ( basket.discountsModel.hasDiscounts ) others.push( this.setDiscountsFromBasket( basket.discountsModel ) );
        if ( basket.othersModel.hasElements && notOnHold.length > 0 ) others.push( this.setOthersFromBasket( basket.othersModel, notOnHold ) );
        if ( basket.othersModel.hasElements && onHold.length > 0) others.push( this.setOnHoldFromBasket( onHold ) );
        return others;
    };

    private setDiscountsFromBasket = ( discountsInfo: ShoppingBasketDiscountsModel): GenericSummaryItem => {
        if ( !discountsInfo.hasDiscounts ) return;
        const discountsItem: GenericSummaryItem = <GenericSummaryItem> {};
        const { discounts, totalFormated } = discountsInfo;
        const discountsArray: ShoppingBasketDiscountObjectType[] = this.discountsArrayPipe( discounts );
        const items: GeneralItem[] = [];
        discountsArray.forEach( ( discount: ShoppingBasketDiscountObjectType ) => {
            const { description, discountFormatted, type } = discount;
            items.push( {
                code: type,
                price: `-${discountFormatted}`,
                description: description
            } );
        } );
        discountsItem.type = 'DISCOUNTS';
        discountsItem.total = totalFormated;
        discountsItem.items = items;
        return discountsItem;
    };

    private setOnHoldFromBasket = ( othersInfo: ShoppingBasketOthersItems[] ): GenericSummaryItem => {
        if ( othersInfo.length === 0 ) return;
        const otherItems: GenericSummaryItem = <GenericSummaryItem> {};
        const onHold = othersInfo.find( ( other ) => other.type === 'ONHOLD' );
        otherItems.type = 'ONHOLD';
        otherItems.price = onHold.totalFormatted;
        otherItems.subtitle = this.TranslateService.instant( onHold.description );
        return otherItems;
    };

    private setOthersFromBasket = ( othersInfo: ShoppingBasketOthers, othersItems: ShoppingBasketOthersItems[] ): GenericSummaryItem => {
        if ( !othersInfo.hasElements && !(othersItems.length > 0) ) return;
        const otherItems: GenericSummaryItem = <GenericSummaryItem>{};
        const { total } = othersInfo;
        const items: GeneralItem[] = [];
        othersItems.forEach( ( other: ShoppingBasketOthersItems ) => {
            const { description, type, totalFormatted } = other;
            items.push( {
                code: type,
                price: totalFormatted,
                description: this.TranslateService.instant( description )
            } );
        } );
        otherItems.type = 'OTHER_CHARGES';
        otherItems.total = total.totalFormatted;
        otherItems.items = items;
        return otherItems;
    };

    public getAncillaries = (headerModel: HeaderDataHeaderModel): Ancillarie[] => {
        const ancillaries: Ancillarie[] = [];
        const basket = headerModel.shoppingBasket;
        this.addBaggageAncillarie(basket, ancillaries);
        this.addBundleAncillarie(basket, ancillaries);
        this.addFlexibilizationAncillarie(basket, ancillaries);
        this.addGlobickTransfersAncillarie(basket, ancillaries);
        this.addInsuranceAncillarie(basket, ancillaries);
        this.addPriorityBoardingAncillarie(basket, ancillaries);
        this.addSeatAncillarie(basket, ancillaries);
        this.addSpeqsAncillarie(basket, ancillaries);
        this.addPetsAncillarie(basket, ancillaries);
        this.addAssistCardAncillarie(basket, ancillaries);
        return ancillaries;
    };

    private addBaggageAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.baggages.hasBaggage) {
            ancillaries.push(this.getBaggageAncillarie(basket.baggages));
        }
    }

    private addBundleAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.bundle.hasBundle) {
            ancillaries.push(this.setBundleAncillarie(basket.bundle));
        }
    }

    private addFlexibilizationAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.flexibilization.hasFlexibilization) {
            ancillaries.push(this.setFlexibilizationAncillarie(basket.flexibilization));
        }
    }

    private addGlobickTransfersAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.globickTransfers.hasTransfersGlobick) {
            ancillaries.push(this.setGlobickTransfersAncillarie(basket.globickTransfers));
        }
    }

    private addInsuranceAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.insurance.hasInsurance) {
            ancillaries.push(this.getInsuranceAncillarie(basket.insurance));
        }
        if (basket.insuranceAllianzFusionInfo.hasInsuranceAllianzFusion) {
            ancillaries.push(this.getInsuranceAncillarie(basket.insuranceAllianzFusionInfo));
        }
    }

    private addPriorityBoardingAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.priorityBoarding.hasPriorityBoarding) {
            ancillaries.push(this.getPriorityBoardingAncillarie(basket.priorityBoarding));
        }
    }

    private addSeatAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.seats.hasSeats) {
            ancillaries.push(this.getSeatAncillarie(basket.seats));
        }
    }

    private addSpeqsAncillarie (basket: ShoppingBasketType, ancillaries: Ancillarie[]): void {
        if (basket.speqs.hasSpeqs) {
            ancillaries.push(this.getSpeqsAncillarie(basket.speqs));
        }
    }

    private setFlexibilizationAncillarie = ( flexibilizationInfo: ShoppingBasketFlexibilization ): Ancillarie => {
        const setFlexibilizationItems = ( flexibilizationItems: ShoppingBasketFlexibilizationInfoItems[] ): GeneralItem[] => {
            const items = [];
            flexibilizationItems.forEach( ( flexItems: ShoppingBasketFlexibilizationInfoItems ) => {
                const { concepts } = flexItems;
                concepts.forEach( ( concept: ShoppingBasketFlexibilizationInfoConcepts ) => {
                    const { description, priceFormatted, quantity } = concept;
                    items.push( {
                        amount: quantity,
                        code: description,
                        price: priceFormatted,
                        description: description
                    } );
                } );
            } );
            return items;
        };
        const setFlexibilizationSegments = (info: ShoppingBasketFlexibilizationInfo ): AncillarieSegment[] => {
            const flexInfo: AncillarieSegment[] = [];
            const { category, items, title } = info;
            flexInfo.push( {
                id: category,
                // title: this.TranslateService.instant( title ),
                title: '',
                items: setFlexibilizationItems( items )
            } );
            return flexInfo;
        };
        const { info } = flexibilizationInfo;
        const flexibilization: Ancillarie = {
            code: 'FLEXIBILITY_ON_DEMAND',
            segments: setFlexibilizationSegments( info ),
            total: info.amount.priceFormatted
        };
        return flexibilization;
    };

    private setGlobickTransfersAncillarie = ( globickTransfers: ShoppingBasketGlobickTransfers ): Ancillarie => {
        const setTransferSegments = (info: ShoppingBasketGlobickTransfersInfo): AncillarieSegment[] => {
            const transfers: AncillarieSegment[] = [];
            const { date, transferCar, totalFormatted, dateReturn, totalFormattedReturn} = info;
            transfers.push( {
                id: `${transferCar}-${date}`,
                title: transferCar,
                items: [{
                    code: '',
                    price: totalFormatted,
                    description: date
                } ]
            } );
            if (dateReturn?.length > 0) {
                transfers.push( {
                    id: `${transferCar}-${dateReturn}`,
                    title: transferCar,
                    items: [{
                        code: '',
                        price: totalFormattedReturn,
                        description: dateReturn
                    } ]
                } );

            }
            return transfers;
        };
        const { info, total } = globickTransfers;
        const transfer: Ancillarie = {
            code: 'TRANSFERS',
            segments: setTransferSegments( info ),
            total: total.totalFormatted
        };
        return transfer;
    };

    private setBundleAncillarie = ( bundles: ShoppingBasketBundle ): Ancillarie => {
        const setBundleItems = ( bundleItems: ShoppingBasketBundleInfoItems[] ): GeneralItem[] => {
            const items = [];
            bundleItems.forEach( ( bundle: ShoppingBasketBundleInfoItems ) => {
                const { subtype, text } = bundle;
                items.push( {
                    amount: 1,
                    code: subtype,
                    description: text
                } );
            } );
            return items;
        };
        const setBundleSegments = (info: ShoppingBasketBundleInfo): AncillarieSegment[] => {
            const bundles: AncillarieSegment[] = [];
            const { id, items } = info;
            bundles.push( {
                id,
                title: this.TranslateService.instant('BUNDLE_SUMMARY_ALL_TRIPS_AND_PASSENGERS'),
                items: setBundleItems( items )
            } );
            return bundles;
        };
        const { info, total } = bundles;
        const bundle: Ancillarie = {
            code: 'BUNDLE',
            segments: setBundleSegments( info ),
            total: total.totalFormatted
        };
        return bundle;
    };

    private getBaggageAncillarie = (baggages: ShoppingBasketBaggages): Ancillarie => {
        const baggage: Ancillarie = {
            code: 'BAGGAGE',
            segments: this.getBaggageSegments(baggages),
            total: baggages.total.totalFormatted
        };
        return baggage;
    };

    private getBaggageSegments = (baggages: ShoppingBasketBaggages): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        baggages?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = this.constructAncillarieSegment<ShoppingBasketTripBaggagesSegment>( segment, index, this.getBaggageItems );
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };

    private getBaggageItems = ( segment: ShoppingBasketTripBaggagesSegment ): GeneralItem[] => {
        const plurals: DescriptionWithPlurals = { singular: 'BAGGAGE_SINGULAR_TEXT', plural: 'BAGGAGE_SINGULAR_TEXT' };
        const items: GeneralItem[] = [];
        segment?.baggages.forEach( ( baggage, index ) => {
            const item: GeneralItem = this.getGeneralItem(baggage as GeneralItemSource, index, plurals);
            items.push(item);
        });
        return items;
    };

    private getSeatAncillarie = (seats: ShoppingBasketSeats): Ancillarie => {
        const baggage: Ancillarie = {
            code: 'SEAT',
            segments: this.getSeatSegments(seats),
            total: seats.total.totalFormatted
        };
        return baggage;
    };

    private getSeatSegments = (seats: ShoppingBasketSeats): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        seats?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = this.constructAncillarieSegment<ShoppingBasketSeatsSegments>( segment, index, this.getSeatItems );
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };

    private getSeatItems = (segment: ShoppingBasketSeatsSegments): GeneralItem[] => {
        const plurals: DescriptionWithPlurals = { singular: 'SEAT_MIN_TEXT', plural: 'SEATS_MIN_TEXT' };
        const items: GeneralItem[] = [];
        segment?.seats.forEach( ( seat, index ) => {
            const item: GeneralItem = this.getGeneralItem(seat as GeneralItemSource, index, plurals);
            items.push(item);
        });
        return items;
    };

    private getPriorityBoardingAncillarie = (priorityBoarding: ShoppingBasketPriority): Ancillarie => {
        const ancillarie: Ancillarie = {
            code: 'PRIORITY_BOARDING',
            segments: this.getPriorityBoardingSegments(priorityBoarding),
            total: priorityBoarding.info.priceFormatted
        };
        return ancillarie;
    };
    
    private getPriorityBoardingSegments = (priorityBoarding: ShoppingBasketPriority): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        priorityBoarding?.info?.trips.forEach((trip: ShoppingBasketPriorityInfoTrips, index) => {
            const ancillarieSegment: AncillarieSegment = this.constructAncillarieSegment<ShoppingBasketPriorityInfoTrips>( trip, index, this.getPiorityBoardingItems );
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };

    private getPiorityBoardingItems = (trip: ShoppingBasketPriorityInfoTrips): GeneralItem[] => {
        const items: GeneralItem[] = [];
        const item: GeneralItem = {
            amount: trip.quantity,
            code: trip.id,
            price: trip.priceFormatted,
            description: this.TranslateService.instant('PRIORITY_BOARDING_TITLE')
        };
        items.push(item);
        return items;
    };

    private getSpeqsAncillarie = (speqs: ShoppingBasketSpeqs): Ancillarie => {
        const speq: Ancillarie = {
            code: 'SPECIAL_EQUIPMENT',
            segments: this.getSpeqsSegments(speqs),
            total: speqs.total.totalFormatted
        };
        return speq;
    };

    private getSpeqsSegments = (speqs: ShoppingBasketSpeqs): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        speqs?.segments.forEach((segment, index) => {
            const ancillarieSegment: AncillarieSegment = this.constructAncillarieSegment<ShoppingBasketSpeqsSegment>( segment, index, this.getSpeqsItems );
            ancillarieSegments.push(ancillarieSegment);
        });
        return ancillarieSegments;
    };
    
    private getSpeqsItems = (segment: ShoppingBasketSpeqsSegment): GeneralItem[] => {
        const items: GeneralItem[] = [];
        segment?.speqs.forEach( ( speq, index ) => {
            const item: GeneralItem = this.getGeneralItem(speq as GeneralItemSource, index, false);
            items.push(item);
        });
        return items;
    };

    private getInsuranceAncillarie = (insurance: ShoppingBasketInsurance|ShoppingBasketInsuranceAllianzFusion): Ancillarie => {
        const ancillarie: Ancillarie = {
            code: 'INSURANCE',
            type: insurance.info.type ?? insurance.info.description,
            total: insurance.total.totalFormatted
        };
        return ancillarie;
    };
    
    private getGeneralItem = <T extends GeneralItemSource> ( item: T, index: number, withPlurals: DescriptionWithPlurals | boolean = false ): GeneralItem => {
        const description = !withPlurals ? item.description : this.constructGeneralDescription( item.quanty, item.description, withPlurals as DescriptionWithPlurals);
        return {
            amount: item.quanty,
            code: `${ item.type }-${ index }`,
            price: item.totalFormatted,
            description: description
        };
    };
    
    private constructGeneralDescription = ( quantity: number, description: string, plurals: DescriptionWithPlurals ): string => {
        if ( !plurals ) return;
        return `${ ( quantity > 1 ? this.TranslateService.instant( plurals.plural ) : this.TranslateService.instant( plurals.singular ) ) } ${description}`;
    };
    
    private constructAncillarieSegment = <T extends ShoppingBasketSegmentsTypes> ( item: T, index: number, callback: ( item: T ) => GeneralItem[] ): AncillarieSegment => {
        const origin = 'origin' in item ? item.origin : item.departure;
        const destination = 'destination' in item ? item.destination : item.arrival;
        return {
            id: `seg${ index}`,
            title: `${ origin.description } (${ origin.code }) - ${ destination.description } (${ destination.code })`,
            items: callback( item )
        };
    };
    
    private addPetsAncillarie ( basket: ShoppingBasketType, ancillaries: Ancillarie[] ): void {
        if ( basket.petc?.hasPetc ) {
            ancillaries.push( this.getPetsAncillarie( basket.petc ) );
        }
    }

    private getPetsAncillarie = ( pets: ShoppingBasketPetc ): Ancillarie => {
        const petc: Ancillarie = {
            code: 'PETC',
            segments: this.getPetsSegments( pets.segments ),
            total: pets.total.totalFormatted
        };
        return petc;
    };
    
    private getPetsSegments = ( petsSegments: ShoppingBasketPetcSegment[] ): AncillarieSegment[] => {
        const ancillarieSegments: AncillarieSegment[] = [];
        petsSegments?.forEach( ( segment, index ) => {
            const ancillarieSegment: AncillarieSegment = this.constructAncillarieSegment<ShoppingBasketPetcSegment>( segment, index, this.getPetsItems );
            ancillarieSegments.push( ancillarieSegment );
        });
        return ancillarieSegments;
    };
    
    private getPetsItems = ( segment: ShoppingBasketPetcSegment ): GeneralItem[] => {
        const items: GeneralItem[] = [];
        // segment.pets.forEach( ( pet, index ) => {
        const item: GeneralItem = {
            amount: segment.quantity,
            code: `pet-${ segment.sliceId }`,
            price: segment.totalFormatted,
            description: this.TranslateService.instant(segment.description)
        };
        items.push( item );
        // });
        return items;
    };


    private addAssistCardAncillarie ( basket: ShoppingBasketType, ancillaries: Ancillarie[] ): void {
        if ( basket.assistCard?.hasAssistCard ) {
            ancillaries.push( this.getAssistCardAncillarie( basket.assistCard ) );
        }
    }



    private getAssistCardAncillarieSegment = (assistCard: ShoppingBasketAssistCard): AncillarieSegment[]  => {
        return [{
            id: 'assist-card-segment',
            title: '',
            items: [{
                code: 'assist-card',
                price: assistCard.total.totalFormatted,
                description: assistCard.name
            }]
        }]; 
    };


    private getAssistCardAncillarie = (assistCard: ShoppingBasketAssistCard): Ancillarie => {
        const ancillarie: Ancillarie = {
            code: 'JOURNEY_ASSISTANCE', 
            segments: this.getAssistCardAncillarieSegment(assistCard),
            total: assistCard.total.totalFormatted

        };
        return ancillarie;  
    };



    
}
