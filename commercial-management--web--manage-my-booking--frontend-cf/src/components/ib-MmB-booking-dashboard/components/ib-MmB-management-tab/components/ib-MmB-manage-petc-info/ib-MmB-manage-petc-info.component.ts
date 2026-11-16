import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AJSRootScope, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { PetcFlightInfo, PetcOrderItem, PetcPassenger, PetcFlight } from './models/petc-info.model';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmbManagePetcInfoModalComponent } from './components/ib-MmB-manage-petc-info-modal/ib-MmB-manage-petc-info-modal.component';
import { IbMmbManagePetcInfoTransformerService } from './transformer/ib-MmB-manage-petc-info-transformer.service';
import { MmBAppConstants } from '@src/ib-MmB-constants';
import { TranslateService } from '@ngx-translate/core';
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { AJSMmBDatalayerUtilsService, AJSMmBDatalayerUtilsServiceType } from '@src/components/services/ib-MmB-datalayer/services/ib-MmB-datalayer-utils-service-bridge.service';
import { MMBDatalayerConstants } from '@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants';


@Component({
    selector: 'ib-MmB-manage-petc-info',
    templateUrl: './ib-MmB-manage-petc-info-view.component.html'
})
export class IbMmbManagePetcInfoComponent implements OnInit, OnChanges {

    @Input() public model: PetcOrderItem[];
    @Input() public passengers: PetcPassenger[];
    @Input() public flights: PetcFlight[];


    public petcItems: PetcFlightInfo[] = [];
    

    constructor(
        private readonly modalService: IbCModalService,
        private readonly petcTransformer: IbMmbManagePetcInfoTransformerService,
        private TranslateService: TranslateService,
        private LiteralFormatterPipe: LiteralFormatterPipe,
        private IbCLinkPipe: IbCLinkPipe,
        @Inject(AJSRootScope) private $rootScope: any,
        @Inject(AJSMmBDatalayerUtilsService) private MmBDatalayerUtilsService: AJSMmBDatalayerUtilsServiceType
    ) { }

    ngOnInit(): void {
        this.initializePetcData();
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (this.hasRelevantChanges(changes)) {
            this.initializePetcData();
        }
    }

    private hasRelevantChanges(changes: SimpleChanges): boolean {
        const relevantInputs = ['model', 'flights', 'passengers'];
        return relevantInputs.some(input => input in changes);
    }


    private initializePetcData(): void {
        this.petcItems = this.petcTransformer.transformPetcData(
            this.model,
            this.flights,
            this.passengers
        );
    }

    hasPendingPayment(): boolean {
        return this.petcItems.some(flight =>
            flight.pets.some(pet => pet.isPendingPayment)
        );
    }


    isActiveLink(flight: PetcFlightInfo): boolean {
        return !!(flight?.pets?.length);
    }

    openModalConditions(): void {
        const modalRef = this.modalService.showGenericComponentModal(
            IbMmbManagePetcInfoModalComponent,
            {
                windowClass: 'ib-modals ib-modals--md ib-modals--petc',
                modalBlocked: false
            }
        );

        if (modalRef?.componentInstance) {
            modalRef.componentInstance.model = { petcInfo: this.petcItems, messagePets: this.getMessage() };
        };
        this.MmBDatalayerUtilsService.updateDatalayerInfo(
            MMBDatalayerConstants.DIGITAL_DATA_PROCESS.MOPETC,
            MMBDatalayerConstants.DIGITAL_DATA_STEP.MOPETC,
            MmBAppConstants.QUADRIGAM.MODAL_INFO_PETC
        );
    };


    getPetsCount(flight: PetcFlightInfo): number {
        return flight?.pets?.length ?? 0;
    }


    hasMultiplePets(flight: PetcFlightInfo): boolean {
        return this.getPetsCount(flight) > 1;
    };

    hasSingularOrPlural(flight:PetcFlightInfo): string {
        let result = this.TranslateService.instant('MMB_PETC_PET');
        if(this.hasMultiplePets(flight)){
            result = this.TranslateService.instant('MMB_PETC_PETS');
        }
        return result;
    }


    trackBySliceId(index: number, flight: PetcFlightInfo): string {
        return flight.sliceId;
    };

    private getMessage = ():string => {
        let petsInfoMessage:string;
        const tagsInfo = {
            link: {
                tag: 'a',
                href: '#',
                target: '_blank',
                title: '',
                class: 'ib-link ib-link--inline ib-link--underline ib-link--important'
            }
        };
        tagsInfo.link.href = this.IbCLinkPipe.transform('PETS_LINK');
        tagsInfo.link.title = this.TranslateService.instant('WARNING_PETS_LINK');
        petsInfoMessage = this.LiteralFormatterPipe.transform(this.TranslateService.instant('MMB_PETC_PETS_INFO'), tagsInfo);
        
        return petsInfoMessage;
    };
};

downgradeToAJSComponent('ibMmbManagePetcInfo', {
    component: IbMmbManagePetcInfoComponent,
    inputs: ['model', 'passengers', 'flights']
}, 'ib-MmB-manage-petc-info-module');
