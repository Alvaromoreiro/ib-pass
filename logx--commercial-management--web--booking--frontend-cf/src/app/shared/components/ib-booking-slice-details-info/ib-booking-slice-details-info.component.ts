import { Component, Input, Renderer2 } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-booking-slice-details-info',
    templateUrl: './ib-booking-slice-details-info.component.html',
    styleUrls: ['./ib-booking-slice-details-info.component.scss']
})
export class IbBookingSliceDetailsInfoComponent{
    @Input() public sliceDetailsInfoModel:  AvailabilityTransformerModel.Slice;
    @Input() public opened: boolean = false;

    public openModalClass:string = 'modal-open';
    public openModalModifier:string = 'slidesel-animated-container--open-modal';
    public slicedContainer:string = '.slidesel-animated-container';
    public detailsModalClass:string = '.show-details-info';

    constructor ( private renderer: Renderer2){}

    public toggle () {
        this.opened = !this.opened;
        const modalElement: HTMLElement = document.querySelector(this.detailsModalClass);
        this.opened && modalElement.scroll(0, 0);
        this.updateModalClasses();
    }

    trackByFn = (index:number) => {
        return index; // or item.id
    };

    public isNotSameDay = (departure:string, arrival:string):boolean =>{
        return this.sliceDetailsInfoModel.daysOfTravel > 0 && departure !== arrival;
    };

    private updateModalClasses = () =>{
        const target = document.querySelectorAll(this.slicedContainer)[0];
        if(this.opened){
            target && this.renderer.addClass(target, this.openModalModifier);
            this.renderer.addClass( document.body, this.openModalClass);
        } else{
            setTimeout(()=>{
                target && this.renderer.removeClass(target, this.openModalModifier);
                this.renderer.removeClass( document.body, this.openModalClass );
            }, 200);
        }
    };

    public handleCompanyLogoError = (event) => {
        this.renderer.setStyle(event.target, 'display', 'none');
    };
}

downgradeToAJSComponent(
    'ibBookingSliceDetailsInfo',
    {
        component: IbBookingSliceDetailsInfoComponent,
        inputs: ['sliceDetailsInfoModel', 'opened'],
        outputs: ['closeDetails']
    },
    'ib-booking-availability-module'
);
