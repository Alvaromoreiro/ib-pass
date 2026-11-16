import { Inject, Injectable } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { AJSCabinTypesServiceToken, CabinTypesServiceType } from '../../../services/upgraded/ib-cabing-types-bridge.service';
import { AJSGetDestinationsService, AJSGetDestinationsServiceType } from '@shared/http-services/rdu-loc/ib-booking-areas-cities-list-bridge.service';
import { IbBookingHeaderSeekerTransformerService } from './ib-booking-header-seeker-transformer.service';
import { AJSGetSpecialPassengerOriginDestinationListServiceToken, GetSpecialPassengerOriginDestinationListServiceType } from '../../../services/upgraded/ib-get-special-passenger-origin-destination-list-bridge.service';
import { SeekerAreasModel, SeekerCabinModel } from '@src/app/core/models/ib-booking-availability/header-seeker-model';

@Injectable({
    providedIn: 'root'
})
export class IbBookingHeaderSeekerService {
    constructor (
        @Inject( AJSCabinTypesServiceToken ) private CabinTypesService: CabinTypesServiceType,
        @Inject( AJSGetDestinationsService ) private getDestinationsService: AJSGetDestinationsServiceType,
        @Inject( AJSGetSpecialPassengerOriginDestinationListServiceToken ) private getSpecialPassengerOriginDestinationListService: GetSpecialPassengerOriginDestinationListServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbBookingHeaderSeekerTransformerService: IbBookingHeaderSeekerTransformerService
    ) { }


    getCabinTypes = (): Promise<SeekerCabinModel[]> => {
        return new Promise( ( resolve, reject ) => {
            this.CabinTypesService.getCabinTypes().then( ( cabinsData: any ) => {
                resolve( this.IbBookingHeaderSeekerTransformerService.initializeCabinsModel( cabinsData ) );
            }, reject );
        });
    };

    getDestinationAreas = ( originCode: string, destinyCode: string ): Promise<SeekerAreasModel> => {
        return new Promise( ( resolve, reject ) => {
            this.getDestinationsService.getDestinationAreasCitiesList().then( ( destinations: any ) => {
                resolve(
                    this.IbBookingHeaderSeekerTransformerService.initializeAreasModel( destinations, originCode, destinyCode )
                );
            }, reject );
        });
    };

    createRequestNewAdvancedSearch = ( advancedSearchData: any ) =>
        this.IbBookingHeaderSeekerTransformerService.createNewAdvancedSearch( advancedSearchData );

    createRequestNewAdvancedSearchHMad = ( advancedSearchData: any ) =>
        this.IbBookingHeaderSeekerTransformerService.createNewAdvancedSearchHMad( advancedSearchData );


    getSpecialPassengerOriginDestination = ( market: string ) => {
        const promiseOne = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList( 'SENIOR' ),
            promiseTwo = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList( 'YOUNG' ),
            promiseThree = this.getSpecialPassengerOriginDestinationListService.getSpecialPassengerOriginDestinationList( 'TEENAGER' );
        let localSpecialPassengerList: any = {};
        const specialPassengersByMarketList = {
            SENIOR: [],
            YOUNG: [],
            TEENAGER: [],
            specialPassengerMarket: market
        };
        return new Promise( ( resolve, reject ) => {
            localSpecialPassengerList = this.CommonsSessionStorageService.get( 'specialPassengersByMarketList' );
            if ( localSpecialPassengerList?.specialPassengerMarket === market ) {
                resolve( localSpecialPassengerList );
            } else {
                Promise.all( [ promiseOne, promiseTwo, promiseThree ] ).then( ( specialPassengerListResponse: any ) => {
                    if ( specialPassengerListResponse && specialPassengerListResponse.length > 0 ) {
                        specialPassengersByMarketList.SENIOR = specialPassengerListResponse[ 0 ];
                        specialPassengersByMarketList.YOUNG = specialPassengerListResponse[ 1 ];
                        specialPassengersByMarketList.TEENAGER = specialPassengerListResponse[ 2 ];
                        specialPassengersByMarketList.specialPassengerMarket = market;
                        this.CommonsSessionStorageService.set( 'specialPassengersByMarketList', specialPassengersByMarketList );
                        resolve( specialPassengersByMarketList );
                    }
                }, ( error: any ) => {
                    reject( error );
                });
            }
        });

    };
}

downgradeToAJSService('IbBookingHeaderSeekerService', IbBookingHeaderSeekerService, 'ib-header-seeker-module', ['ib-commons-modal-service-module', 'ib-commons-http-service-module', 'ib-booking-city-selector-module']);
