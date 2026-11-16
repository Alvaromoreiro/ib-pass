import { Injectable, Inject } from '@angular/core';
import {  CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { IbCNormalizePipe } from 'ib-web-commons/pipes';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSGetDestinationsService, AJSGetDestinationsServiceType } from '@shared/http-services/rdu-loc/ib-booking-areas-cities-list-bridge.service';

interface ContentModel  {
    fareExtrasToShow;
    imgToshow: string;
    mark1: string;
    mark2: string
    mark3?: string;
}
@Injectable(
    {providedIn: 'root'}
)
export class IbBookingUpsellingUtilsService {
    private forbiddenUpsellingMap = {
        'optima-Flex': ['confort'],
        'business-optima': ['business-flexible']
    };
    private operatorsMap = BookingAppConstants.OPERATIONAL_CARRIER_CODES;
    private zonesMap = ['ES', 'EU', 'LATAM'];
    private haul: string;

    constructor (
        private IbCNormalizePipe: IbCNormalizePipe,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        @Inject(AJSGetDestinationsService) private GetDestinationsService: AJSGetDestinationsServiceType

    ) {


    }

    private normalizeFareName = (fareName: string) => {
        return fareName = this.IbCNormalizePipe.transform(fareName.toLowerCase()).replace(/(\s)/g, '-');
    };


    public isForbiddenUpsell = (currentFare: string = '', upsellFare: string = '') => {
        const cFare = this.normalizeFareName(currentFare.toLowerCase());
        const upFare = this.normalizeFareName(upsellFare.toLowerCase());
        return (this.forbiddenUpsellingMap[cFare] ?? []).includes(upFare);
    };
    public isAnyValidOperator = (operators: string[] = []) => {
        return operators.some((operator: string) => (this.operatorsMap.find((validOperator: string) => validOperator === operator) ?? false));
    };

    private getZonesFromAreasList = (trip: AvailabilityTransformerModel.SelectedSlice) => {
        const tripZone = {
            originZone: '',
            destinationZone: ''
        };
        let originControl = false, destinationControl = false, j = 0, stopCondition = false;
        const destinationAreasCitiesList: any[] = this.CommonsSessionStorageService.get('destinationAreasCitiesList')??[];

        for (let i = 0; i < destinationAreasCitiesList.length && !stopCondition; i++) {
            j = 0;
            while ( !stopCondition && j < destinationAreasCitiesList[i].cities.length) {
                if (!originControl && trip.originCountry === destinationAreasCitiesList[i].cities[j].country.code) {
                    tripZone.originZone = this.zonesMap[i];
                    originControl = true;
                }
                if (!destinationControl && trip.destinationCountry === destinationAreasCitiesList[i].cities[j].country.code) {
                    tripZone.destinationZone = this.zonesMap[i];
                    destinationControl = true;
                }

                stopCondition = originControl && destinationControl;
                j++;

            }
        }
        return tripZone;
    };



    public  getAncillariesZones = async (trip: AvailabilityTransformerModel.SelectedSlice) => {
        await this.GetDestinationsService.getDestinationAreasCitiesList();
        // ERROR HEREDADO considera el mercado local como España
        const tripZone = this.getZonesFromAreasList(trip);
        if (['IL', 'SN', 'MA', 'DZ'].includes(trip.destinationCountry)) {
            tripZone.destinationZone = 'EU';
        }else if (['MX', 'PR'].includes(trip.destinationCountry)) {
            tripZone.destinationZone = '';
        }else if (['MX', 'PR'].includes(trip.originCountry)) {
            tripZone.originZone = '';
        }
        return tripZone;
    };

    private upsellBasicToOptima = async (): Promise<ContentModel> => {
        return {
            fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA,
            mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
            mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
            mark3 : null,
            imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
        };
    };
    private upsellBasicToOptimaLevel = async (): Promise<ContentModel> => {
        return {
            fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.OPTIMA_LEVEL,
            mark1: 'UPSELLING_FARE_MARK_FLY_MORE',
            mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
            mark3 : null,
            imgToshow: `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
        };
    };
    private upsellOptimaToConfort = async (): Promise<ContentModel> => {
        if(this.haul === 'LH' || this.haul === 'Largo Radio') {
            return {
                fareExtrasToShow : BookingAppConstants.UPSELLING.FARE.LH_CONFORT,
                mark1 : 'UPSELLING_FARE_MARK_FLY_MORE',
                mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
                mark3 : null,
                imgToshow : `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
            };
        }
        return {
            fareExtrasToShow : BookingAppConstants.UPSELLING.FARE.CONFORT,
            mark1 : 'UPSELLING_FARE_MARK_FLY_MORE',
            mark2: 'UPSELLING_FARE_MARK_FLY_MORE_2',
            mark3 : null,
            imgToshow : `${BookingAppConstants.imagesRoute}/banners/upselling/economy_flexible.png`
        };
    };
    private upsellToEconomyFlex = async (trip: AvailabilityTransformerModel.SelectedSlice): Promise<ContentModel> => {
        const avoidCountries= ['US', 'PR', 'MX', 'JP', 'CN'];
        if (!avoidCountries.includes(trip.destinationCountry) && !avoidCountries.includes(trip.originCountry)) {
            return {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.ECONOMY_FLEXIBLE,
                mark1 : 'UPSELLING_FARE_TITLE_1',
                mark2 : 'UPSELLING_FARE_TITLE_2',
                mark3 : 'UPSELLING_FARE_TITLE_3',
                imgToshow : BookingAppConstants.imagesRoute + '/banners/upselling/economy_flexible.png'};
        }
        return null;
    };

    private upsellFromTuristaPremiumOptima = async (trip: AvailabilityTransformerModel.SelectedSlice) : Promise<ContentModel> => {
        const zoneControl = await this.getAncillariesZones(trip);
        const result = {
            fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.ECONOMY_OPTIMA_FLEX_ES,
            mark1 : 'UPSELLING_FARE_MARK_FLY_MORE',
            mark2 : 'UPSELLING_FARE_MARK_FLY_MORE_2',
            mark3 : null,
            imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/premium_economy_optima_flex.png'
        };
        if (!(zoneControl.originZone === 'ES' && zoneControl.destinationZone === 'LATAM')) {
            result.fareExtrasToShow = BookingAppConstants.UPSELLING.FARE.ECONOMY_OPTIMA_FLEX;
        }
        return result;

    };
    private upsellFromTuristaPremiumOptFlex = async (trip: AvailabilityTransformerModel.SelectedSlice) : Promise<ContentModel> => {
        const zoneControl = await this.getAncillariesZones(trip);
        const availableZones = ['ES', 'LATAM'];
        if (availableZones.includes(zoneControl.originZone) && availableZones.includes(zoneControl.destinationZone)) {
            return {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.ECONOMY_FLEXIBLE,
                mark1 : 'UPSELLING_FARE_MARK_CHOOSE',
                mark2 : 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3 : null,
                imgToshow : BookingAppConstants.imagesRoute + '/banners/upselling/premium_economy_flexible.png'};
        }
        return null;
    };
    private upsellFromBusinessOptima = async (trip: AvailabilityTransformerModel.SelectedSlice): Promise<ContentModel> => {
        const zoneControl = await this.getAncillariesZones(trip);
        const result = {
            fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.BU_CONFORT,
            mark1: 'UPSELLING_FARE_MARK_CHOOSE_3',
            mark2: 'UPSELLING_FARE_MARK_CHOOSE_2',
            mark3: null,
            imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/business_confort.png'
        };
        if (zoneControl.originZone === 'ES' && zoneControl.destinationZone !== '') { return result; }
        if (zoneControl.originZone === 'EU' && (zoneControl.destinationZone === 'EU' || zoneControl.destinationZone === 'ES')) { return result; }
        if ((zoneControl.originZone === 'EU' || zoneControl.originZone === 'LATAM') && zoneControl.destinationZone === 'LATAM') {
            result.fareExtrasToShow = BookingAppConstants.UPSELLING.FARE.BU_CONFORT_LATAM;
            return result;
        }
        if (zoneControl.originZone === 'LATAM' && (zoneControl.destinationZone === 'EU' || zoneControl.destinationZone === 'ES')) {
            result.fareExtrasToShow = BookingAppConstants.UPSELLING.FARE.BU_CONFORT_LATAM;
            return result;
        }
        return null;
    };

    private upsellFromBusinessConfort = async (trip: AvailabilityTransformerModel.SelectedSlice): Promise<ContentModel> => {
        const zoneControl = await this.getAncillariesZones(trip);
        const availableZones = ['ES', 'LATAM'];
        if (availableZones.includes(zoneControl.originZone) && availableZones.includes(zoneControl.destinationZone)) {
            return {
                fareExtrasToShow: BookingAppConstants.UPSELLING.FARE.BU_FLEX,
                mark1: 'UPSELLING_FARE_MARK_CHOOSE',
                mark2: 'UPSELLING_FARE_MARK_CHOOSE_2',
                mark3: null,
                imgToshow: BookingAppConstants.imagesRoute + '/banners/upselling/business_flexible.png'
            };
        }
        return null;
    };
    public checkUpsellingAvailableFares = (commercialNameES: string = '') => {
        return BookingAppConstants.UPSELLING.AVAILABLE_FARES.includes(this.normalizeFareName(commercialNameES));
    };


    private contentSetupFunctionsMap = {
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.BASICA]: this.upsellBasicToOptima,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.BASICA_LEVEL]: this.upsellBasicToOptimaLevel, //Level
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.OPTIMA]: this.upsellOptimaToConfort,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.CONFORT]: this.upsellToEconomyFlex,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.OPTIMA_FLEXIBLE]: this.upsellToEconomyFlex,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.TURISTA_PREMIUM_OPTIMA]: this.upsellFromTuristaPremiumOptima,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.TURISTA_PREMIUM_OPTIMA_FLEX]: this.upsellFromTuristaPremiumOptFlex,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.BUSINESS_OPTIMA]: this.upsellFromBusinessOptima,
        [BookingAppConstants.FARE_COMERCIAL_NAME_ES.BUSINESS_CONFORT]: this.upsellFromBusinessConfort


    };

    public getInfoToShow = async (trip: AvailabilityTransformerModel.SelectedSlice) => {
        const fareName: string = this.normalizeFareName(trip?.info?.selectedFareFamily?.commercialNameES ?? '');
        const sessionInfo: any = this.CommonsSessionStorageService.get('confirmationDigitalInfo');
        this.haul = sessionInfo?.FlightHaul;
        const action = this.contentSetupFunctionsMap[fareName]?.bind(this) ?? (() => null);
        return await action(trip);
    };




}
downgradeToAJSService('IbBookingUpsellingUtilsService', IbBookingUpsellingUtilsService, 'ib-booking-upselling-fare-module');
