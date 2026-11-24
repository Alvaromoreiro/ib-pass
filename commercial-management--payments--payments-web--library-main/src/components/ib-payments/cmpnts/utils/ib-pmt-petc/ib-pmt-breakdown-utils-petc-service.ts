import { Inject, Injectable } from '@angular/core';
import { AJSCurrencyService, downgradeToAJSService } from 'ib-web-commons/utils';

export interface Pet {
    amount: number;
    type: string;
    breeds: string[];
    units: number;
}

export interface Passenger {
    id: string;
    pets: Pet[];
}

export interface Slice {
    id: string;
    passengers: Passenger[];
}

export interface PetcSegment {
    sliceId: string;
    pets: BasketPet[];
    origin: any;
    destination: any;
    total: number;
    totalFormatted: string;
}

export interface BasketPet {
    amount: number;
    amountFormatted: string;
    breeds: string[];
    passengers: string[];
    type: {
        id: string;
        description: string;
    };
    units: number;
}

export interface PetcBreakdownContext {
    basket: any,
    pendingSlices: Slice[];
    segmentsInfo: any[];
    getTotalFormatted: (slices: any[]) => string;
    getOriginAndDestinationSegment: (segments: PetcSegment[], segmentsInfo: any[]) => void;
}

@Injectable({providedIn: 'root'})
export class IbPmtBreakdownUtilsPetsService {

    constructor (
        @Inject(AJSCurrencyService) private CurrencyService: CurrencyService
    ) {
    }
    private context: PetcBreakdownContext;

    public generatePetcInfo (context: PetcBreakdownContext): PetcSegment[] {
        this.context = context;
        if (this.context.basket.petc.segments.length > 0) {
            return this.updateExistingPetcSegments();
        }
        return this.createNewPetcSegments();
    }

    private updateExistingPetcSegments (): PetcSegment[] {
        this.context.basket.petc.segments.forEach(basketSlice => {
            const pendingSlice = this.findPendingSliceById(basketSlice.sliceId);
            if (pendingSlice) {
                this.addPetsToSegment(pendingSlice, basketSlice);
            }
        });
        this.context.basket.petc.total = {totalFormatted: this.context.getTotalFormatted(this.context.basket.petc.segments)};
        return this.context.basket.petc.segments;
    }

    private createNewPetcSegments (): PetcSegment[] {
        this.context.basket.petc.hasPetc = true;
        const petSlices = this.context.pendingSlices
            .map(slice => this.createPetcSegmentFromSlice(slice))
            .filter(segment => segment.pets.length > 0);

        this.context.getOriginAndDestinationSegment(petSlices, this.context.segmentsInfo);
        this.context.basket.petc.total = {totalFormatted: this.context.getTotalFormatted(petSlices)};
        return petSlices;
    }

    private createPetcSegmentFromSlice (slice: Slice): PetcSegment {
        const segment: PetcSegment = {
            sliceId: slice.id,
            pets: [],
            origin: null,
            destination: null,
            total: 0,
            totalFormatted: '0'
        };
        this.addPetsToSegment(slice, segment);
        return segment;
    }

    private addPetsToSegment (sourceSlice: Slice, targetSegment: PetcSegment): void {
        sourceSlice.passengers.forEach(passenger => {
            passenger.pets.forEach(pet => {
                const basketPet = this.createBasketPet(pet, passenger.id);
                targetSegment.pets.push(basketPet);
                targetSegment.total += pet.amount;
            });
        });
        targetSegment.totalFormatted = this.context.getTotalFormatted([targetSegment]);
    }

    private createBasketPet (pet: Pet, passengerId: string): BasketPet {
        return {
            amount: pet.amount,
            amountFormatted: this.CurrencyService.formatPrice(this.context.basket.currency, pet.amount, true),
            breeds: pet.breeds,
            passengers: [passengerId],
            type: { 
                id: pet.type, 
                description: 'PETC_PET_TYPE_' + pet.type 
            },
            units: pet.units
        };
    }

    private findPendingSliceById (sliceId: string): Slice | undefined {
        return this.context.pendingSlices.find(slice => slice.id === sliceId);
    }
}

downgradeToAJSService('IbPmtBreakdownUtilsPetsService', IbPmtBreakdownUtilsPetsService, 'ib-pmt-utils-module');