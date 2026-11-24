import { Component, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-biometric-boarding-summary',
    templateUrl: './ib-biometric-boarding-summary.component.html'
})

export class IbBiometricBoardingSummaryComponent implements OnInit {
    public passengersList : CheckinConfirmationModel.Passenger[];
    
    @Input() biometricStatus: CheckinConfirmationModel.BiometricStatus;

    constructor () {}

    ngOnInit () {
        this.passengersList = this.biometricStatus.passengersList;
        this.passengersList.map((passenger : CheckinConfirmationModel.Passenger, index) => this.createBiometricAuxData(passenger, index));
    }

    createBiometricAuxData (passenger: CheckinConfirmationModel.Passenger, i: number) {
        switch (passenger.type) {
                case 'ADULT':
                    this.passengersList[i].iconClass = 'ib-box-selects-biometric__header--adult';
                    break;
                case 'CHILD':
                    this.passengersList[i].iconClass = 'ib-box-selects-biometric__header--kids';
                    break;
                case 'INFANT':
                    this.passengersList[i].iconClass = 'ib-box-selects-biometric__header--baby';
                    break;
                default:
                    this.passengersList[i].iconClass = 'ib-box-selects-biometric__header--adult';
        }

        switch (passenger.biometricBoardingStatus) {
                case 'COMPLETE':
                    this.passengersList[i].statusClass = 'ib-box-selects-biometric__content--active';
                    this.passengersList[i].statusIconClass = 'icon-validar';
                    this.passengersList[i].statusText = 'BIOMETRIC_BOARDING_CARD_ASSOCIATED';
                    break;
                /*According to new requirements, the "available" status does not exist in this module
                case 'AVAILABLE':
                    this.passengersList[i].statusClass = 'ib-box-selects-biometric__content--available';
                    this.passengersList[i].statusIconClass = 'icon-biometria';
                    this.passengersList[i].statusText = 'BIOMETRIC_BOARDING_PASSENGER_STATUS_AVAILABLE';
                    break;
                */
                case 'AVAILABLE':
                case 'AUTOMATIC_FF_AVAILABLE':
                case 'FAILED':
                    this.passengersList[i].statusClass = 'ib-box-selects-biometric__content--not-active';
                    this.passengersList[i].statusIconClass = 'icon-wrong';
                    this.passengersList[i].statusText = 'BIOMETRIC_BOARDING_CARD_NOT_ASSOCIATED';
                    break;
                case 'NOT_AVAILABLE':
                default:
                    this.passengersList[i].statusClass = 'ib-box-selects-biometric__content--not-available';
                    this.passengersList[i].statusIconClass = 'icon-wrong';
                    this.passengersList[i].statusText = 'BIOMETRIC_BOARDING_PASSENGER_STATUS_NOT_AVAILABLE';
                    break;
        }
    }
}

downgradeToAJSComponent('ibBiometricBoardingSummary', { 
    component: IbBiometricBoardingSummaryComponent, 
    inputs: ['biometricStatus']
}, 'ib-check-in-confirmation-module');