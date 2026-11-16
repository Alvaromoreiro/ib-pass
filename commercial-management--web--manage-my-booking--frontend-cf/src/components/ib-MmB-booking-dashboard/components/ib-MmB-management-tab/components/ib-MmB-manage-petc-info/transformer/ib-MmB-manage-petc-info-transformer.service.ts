import { Injectable } from '@angular/core';
import { PetcFlightInfo, PetcOrderItem, PetcPassenger, PetcFlight, PetcPet } from '../models/petc-info.model';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class IbMmbManagePetcInfoTransformerService {


    private readonly ANIMAL_TYPE_TRANSLATIONS: Record<string, string> = {
        'DOG': 'MMB_PETC_DOG',
        'CAT': 'MMB_PETC_CAT',
        'TURTLE': 'MMB_PETC_TORTOISE',
        'BIRD': 'MMB_PETC_BIRD',
        'PETC': 'MMB_PETC_PET' 
    };

    constructor(private TranslateService: TranslateService) {}

    transformPetcData(petcItems: PetcOrderItem[], flights: PetcFlight[], passengers: PetcPassenger[]): PetcFlightInfo[] {
        if (!this.isValidInput(petcItems, flights)) {
            return [];
        }

        const flightInfoList: PetcFlightInfo[] = [];

        flights.forEach(flight => {
            if (!flight.segments || flight.segments.length === 0) {
                return;
            }

            const allMatchedPets: PetcOrderItem[] = [];

            flight.segments.forEach(segment => {
                const matchedPets = this.findPetsForSegment(petcItems, segment);
                matchedPets.forEach(pet => {
                    if (!allMatchedPets.some(p => p.orderItemId === pet.orderItemId)) {
                        allMatchedPets.push(pet);
                    }
                });
            });

            if (allMatchedPets.length > 0) {
                const firstSegment = flight.segments[0];
                const lastSegment = flight.segments[flight.segments.length - 1];
                flightInfoList.push(
                    this.buildFlightInfo(firstSegment, lastSegment, allMatchedPets, passengers)
                );
            }
        });

        return flightInfoList;
    };

    private isValidInput(petcItems: PetcOrderItem[], flights: PetcFlight[]): boolean {
        return !!(petcItems?.length && flights?.length);
    };

    private findPetsForSegment(petcItems: PetcOrderItem[], segment: any): PetcOrderItem[] {
        const routeKey = `${segment.departure.code}${segment.arrival.code}`;

        return petcItems.filter(pet => 
            this.matchesBySliceId(pet, segment) ||
            this.matchesBySegmentId(pet, segment) ||
            this.matchesByRoute(pet, routeKey)
        );
    };

    private matchesBySliceId(pet: PetcOrderItem, segment: any): boolean {
        return pet.sliceId === segment.sliceId;
    };


    private matchesBySegmentId(pet: PetcOrderItem, segment: any): boolean {
        return !!(pet.segmentIds?.length && pet.segmentIds.includes(segment.segmentId));
    };

    private matchesByRoute(pet: PetcOrderItem, routeKey: string): boolean {
        return !!(pet.sliceId && pet.sliceId.includes(routeKey));
    };

    private buildFlightInfo(firstSegment: any, lastSegment: any, matchedPets: PetcOrderItem[], passengers: PetcPassenger[]): PetcFlightInfo {
        return {
            sliceId: firstSegment.sliceId,
            departure: {
                code: firstSegment.departure.code,
                name: firstSegment.departure.city.description
            },
            arrival: {
                code: lastSegment.arrival.code,
                name: lastSegment.arrival.city.description
            },
            pets: matchedPets.map(pet => this.transformPetToView(pet, passengers))
        };
    };

    private transformPetToView(pet: PetcOrderItem, passengers: PetcPassenger[]): PetcPet {
        const passenger = passengers?.find(p => p.passengerId === pet.passengerId);
        
        return {
            passengerName: this.getPassengerName(passenger, pet.passengerId),
            passengerId: pet.passengerId,
            animalType: this.translateAnimalType(pet.subtype),
            subtype: pet.subtype,
            emd: pet.emd,
            isPendingPayment: pet.emd === MmBAppConstants.PETS_STATUS.PENDING_PAYMENT,
            orderItemId: pet.orderItemId
        };
    };

    private getPassengerName(passenger: PetcPassenger | undefined, passengerId: string): string {
        if (!passenger?.personalInfo) {
            return passengerId;
        }

        const { name, surname } = passenger.personalInfo;
        return `${name} ${surname}`.trim() || passengerId;
    }

    private translateAnimalType(subtype: string): string {
        const translationKey = this.ANIMAL_TYPE_TRANSLATIONS[subtype];
        return translationKey 
            ? this.TranslateService.instant(translationKey) 
            : subtype;
    }
}
