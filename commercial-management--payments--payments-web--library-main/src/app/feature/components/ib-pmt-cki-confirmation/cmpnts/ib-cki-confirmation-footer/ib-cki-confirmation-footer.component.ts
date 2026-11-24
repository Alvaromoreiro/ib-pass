import { Component, Input, OnInit } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IIBCheckInDisruptionContactApis } from 'src/app/core/models/ib-check-in-disruption-contact.model';

@Component({
    selector: 'ib-cki-confirmation-footer',
    templateUrl: './ib-cki-confirmation-footer.component.html',
    styleUrls: ['./ib-cki-confirmation-footer.component.scss']
})
export class IbCkiConfirmationFooterComponent implements OnInit {
    @Input() props: CheckinConfirmationModel.TFooterProps = {
      isCC: false,
      cabinClassTypeLabel: '',
      segment: null,
      showInhibitPassengers: false,
      isBpSubscriptionMode: false,
      checkCompany: false,
      showBiometricActive: false,
      inhibitStorage: false
    };

    values: {
      [passengerId: string]: CheckinConfirmationModel.IFooterValues;
    } = {};

    constructor(
      private CommonsSessionStorageService: CommonsSessionStorageService,
    ) {}

    ngOnInit() {
      this.getValues();
    }

    checkSeatList() {
      const { seatList } = this.props?.segment ?? { seatList: '' };

      return typeof seatList === 'string' && seatList.length > 0 ? seatList : '';
    }

    showSeatInhibit(
        passenger: CheckinConfirmationModel.TBoardingCardsPassengers,
    ) {
      if (!passenger?.seat) return false;

      return !!(passenger.seat.row && passenger.seat.column);
    }

    private getValues() {
      const disruptionInfo: IIBCheckInDisruptionContactApis[] =
        this.CommonsSessionStorageService.get('disruptionContactApis');

      this.props?.segment.passengers.forEach((p) => {
        this.values[p.id] = {
          passengerName: `${p.name.toLowerCase()} ${p.surname.toLowerCase()}`,
          passengerSeat: `${p.cabinClass?.description ?? ''} ${p.seat?.row ?? ''}${p.seat?.column ?? ''}`,
          mail: disruptionInfo?.find((d) => d.id.toString() === p.id)?.disruptionContact?.email.toLowerCase() ?? ''
        };
      });
    }
}

downgradeToAJSComponent(
    'ibCkiConfirmationFooter',
    {
        component: IbCkiConfirmationFooterComponent
    },
    'ib-check-in-confirmation-footer-module'
);
