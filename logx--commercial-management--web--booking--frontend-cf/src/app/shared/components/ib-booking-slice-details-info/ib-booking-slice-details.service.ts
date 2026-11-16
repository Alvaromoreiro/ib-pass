import { ComponentRef, Injectable, ViewContainerRef, createNgModule  } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IbBookingSliceDetailsInfoComponent } from './ib-booking-slice-details-info.component';
import { IbBookingAppContainerRefService } from '@src/app/core/services/ib-booking-app-containerRef.service';
import { IbBookingSliceDetailsInfoModule } from './ib-booking-slice-details-info.module';

@Injectable({ providedIn: 'root'})
export class IbSliceDetailsComponentService {
    private currentRef: ComponentRef<IbBookingSliceDetailsInfoComponent>;
    private appContainerRef: ViewContainerRef;
    private module;
    constructor (
        private IbBookingAppContainerRefService: IbBookingAppContainerRefService
    ) {
        this.appContainerRef = this.IbBookingAppContainerRefService.appContainerRef;
        this.module = createNgModule(IbBookingSliceDetailsInfoModule, this.appContainerRef.injector);
    }

    show = ( model: AvailabilityTransformerModel.Slice ) => {
        
        if(!this.currentRef ){
            this.currentRef = this.appContainerRef.createComponent(IbBookingSliceDetailsInfoComponent, {ngModuleRef: this.module, injector: this.module.injector});
        }
        this.currentRef.instance.sliceDetailsInfoModel =  model;
        setTimeout(()=> {
            this.currentRef.instance.toggle();
        });
    };
    destroy = () => {
        this.currentRef?.destroy();
        this.currentRef = null;
    };
}
downgradeToAJSService('IbSliceDetailsComponentService', IbSliceDetailsComponentService, 'ib-booking-availability-module');
