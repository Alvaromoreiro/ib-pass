import { IbPmtConfirmationCarbonFootprintModel, IbPmtConfirmationCarbonFootprintFlight } from './ib-pmt-confirmation-carbon-footprint-model';
import { Component, Input } from '@angular/core';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { PmtConstants } from '../../../../../../app/core/ib-pmt-constants';
import { IbCLinkPipe } from 'ib-web-commons/pipes';

@Component({
    selector:'ib-pmt-confirmation-carbon-footprint',
    templateUrl:'./ib-pmt-confirmation-carbon-footprint-view.component.html',
    styleUrls: ['./ib-pmt-confirmation-carbon-footprint.scss']
})
export class IbPmtConfirmationCarbonFootprintComponent {

    public kilosCo2eFormatted: string;
    public priceFormatted: string;
    public choooseUrl: string;
    public capitalizedName: string;

    baseImagePath = PmtConstants.ROUTES.images;
    baseIconPath = PmtConstants.ROUTES.icons;

    constructor (private linkPipe: IbCLinkPipe, private CommonsSessionStorageService: CommonsSessionStorageService) {}

    @Input() set model (model: IbPmtConfirmationCarbonFootprintModel) {
        this.kilosCo2eFormatted = model.kilosCo2eFormatted;
        this.priceFormatted = model.priceFormatted;
        this.choooseUrl = this.generateChoooseURL(model.flight);
        this.capitalizedName = this.capitalizeNameIfAllUppercase(model.name);
    }



    generateChoooseURL (flight: IbPmtConfirmationCarbonFootprintFlight) {
        let chooose_url = `${this.linkPipe.transform('FOOTPRINT_CONFIRMATION_LINK')}?page=blendedPage`;

        flight?.segments?.forEach((segment, index) => {
            chooose_url += `&items[${index}][type]=flights.fromTo&items[${index}][from]=${segment.from}`;
            chooose_url += `&items[${index}][to]=${segment.to}&items[${index}][passengers]=${flight.numPax}`;
            chooose_url += `&items[${index}][roundTrip]=${segment.roundTrip ? 'True' : 'False'}`;

            if (segment.stops) {
                segment.stops.forEach((stop, stopIndex) => {
                    chooose_url += `&items[${index}][stops][${stopIndex}]=${stop}`;
                });
            }
        });

        const pnr = this.CommonsSessionStorageService.get('PNR');
        chooose_url += `&orderId=${pnr}`;

        return chooose_url;
    }



    capitalizeNameIfAllUppercase (name: string) {
        if (!name || name !== name.toUpperCase()) {
            return name;
        }

        return name.split(' ')
            .map(namePart => {
                if (!namePart) {
                    return '';
                }

                if (namePart.length <= 1) {
                    return namePart.toUpperCase();
                }

                return namePart.charAt(0).toUpperCase() + namePart.substring(1).toLowerCase();
            })
            .join(' ');
    }
}

downgradeToAJSComponent('ibPmtConfirmationCarbonFootprint', {
    component: IbPmtConfirmationCarbonFootprintComponent,
    inputs: ['name', 'kilosCo2eFormatted', 'price', 'flight']
}, 'ib-pmt-confirmation-carbon-footprint-module');
