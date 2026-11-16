import { Component, Inject, OnInit } from '@angular/core';
import { CommonsSessionStorageService, AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { IbBookingAvailabilityPageServiceType, AJSIbBookingAvailabilityPageService } from './services/ib-booking-availability-page-utils-bridge.service';
import { BookingPageUtilsService } from '@shared/services/ib-utils/ib-booking-page-utils.service';
import { AJSDatalayerUtilsService, AJSDatalayerUtilsServiceType } from '@shared/services/ib-datalayer/services/ib-datalayer-utils-service-bridge.service';
import { BookingCommercialSellingDataUtilsService } from '@shared/services/ib-booking-availability/ib-booking-commercial-selling-data-utils.service';
import { BookingRedirectionService } from '../../shared/services/ib-utils/ib-booking-redirection.service';
import { BkiStorageConstants } from '@src/app/core/constants/ib-booking-storage-constants';
import { AvailabilityTypes } from '@src/app/core/models/ib-booking-availability/slice-by-slice-availability.models';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';


@Component({
    selector: 'ib-booking-availability-page',
    templateUrl: './ib-booking-availability-page.component.html',
    styleUrls: ['./styles/legacy-styles.scss']
})
export class IbBookingAvailabilityPageComponent implements OnInit {
    private PAGE_TITLE: string = 'BKI_TITLE_PAGE_AVAILABILITY';
    private confirmationDatalayerInfo;
    private confirmationDigitalInfo;
    public availabilityTypesEnum = AvailabilityTypes;
    public componentType : AvailabilityTypes = this.availabilityTypesEnum.LOADING;
    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSIbBookingAvailabilityPageService) private IbBookingAvailabilityPageUtilsService: IbBookingAvailabilityPageServiceType,
        @Inject(AJSDatalayerUtilsService) private DatalayerUtilsService: AJSDatalayerUtilsServiceType,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private BookingPageUtilsService: BookingPageUtilsService,
        private BookingCommercialSellingDataUtilsService: BookingCommercialSellingDataUtilsService,
        private BookingRedirectionService: BookingRedirectionService
    ) {

    }
    ngOnInit (): void {
        this.BookingPageUtilsService.setPageTitle(this.PAGE_TITLE);
        this.IbBookingAvailabilityPageUtilsService.initLocalStorage();
        this.$rootScope.isAvailability = true;
        const lang = this.IbBookingAvailabilityPageUtilsService.initializeLang();
        const market = this.IbBookingAvailabilityPageUtilsService.initializeMarket();
        this.confirmationDatalayerInfo = this.CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DATALAYER_INFO ) || {};
        this.confirmationDigitalInfo = this.CommonsSessionStorageService.get( BkiStorageConstants.CONFIRM_DIGITALDATA_INFO ) || {};
        this.DatalayerUtilsService.removeDatalayerObjects(Object.keys(this.confirmationDatalayerInfo));
        this.DatalayerUtilsService.removeDigitalDataObjects(Object.keys(this.confirmationDigitalInfo));
        this.DatalayerUtilsService.setDatalayerAvailabilityInitialParams(lang, market, this.BookingPageUtilsService.getDeviceType());
        this.initializeFlow();
    }



    private initializeView = (): void => {
        
        if ( this.IbBookingAvailabilityPageUtilsService.checkLoadLegacy() ) {
            this.componentType = this.availabilityTypesEnum.REGULAR;
        } else {
            const forcedType =  this.CommonsSessionStorageService.get<AvailabilityTypes>( 'availabilityTypeForced' );
            const commercialDataViewType: AvailabilityTypes = this.BookingCommercialSellingDataUtilsService.getCommercialAvailbilityType();
            // Has a temporal storage value to force availability type
            this.componentType = forcedType ?? commercialDataViewType ?? this.availabilityTypesEnum.SLICE_BY_SLICE;
        }
        this.CommonsSessionStorageService.set( BkiStorageConstants.AVAILABILITY_TYPE, this.componentType );
    };


    private initializeFlow = (): void => {
        this.IbBookingAvailabilityPageUtilsService.initBookingFlow().then( this.initializeView, () => this.BookingRedirectionService.path( '/ibbkerror' ) );
    };

    public redirectToViewType = (viewType: AvailabilityTypes): void => {
        this.BookingModalService.showWaitingModal('ib-modal-loading-plane', 'ib-modals ib-modals--transparent ib-modals--loading-page', true);
        this.componentType = viewType;
        
    };
}
