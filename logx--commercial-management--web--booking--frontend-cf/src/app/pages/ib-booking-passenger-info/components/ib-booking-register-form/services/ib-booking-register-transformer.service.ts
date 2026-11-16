import { downgradeToAJSService } from 'ib-web-commons/utils';
import { Injectable } from '@angular/core';
import { IbBookingRegisterFormDataService } from './ib-booking-register-form-data.service';
import { EnrolMemberRequestV02 } from '@src/app/core/models/ib-booking-passenger-info/components/ib-booking-register-form-model';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

@Injectable({
    providedIn: 'root'
})
export class IbBookingRegisterTransformerService {

    constructor (
        private IbBookingRegisterFormDataService: IbBookingRegisterFormDataService
    ) { }

    transformFormRegister = (): EnrolMemberRequestV02 => {
        return {
            invitationIdentifier: null,
            person: {
                personName: {
                    firstName: this.IbBookingRegisterFormDataService.getName(),
                    familyName: this.IbBookingRegisterFormDataService.getLastName(),
                    secondFamilyName: ''
                },
                countryOfResidence: this.resolveCountryOfResidence(),
                prefLanguage: this.resolvePrefLanguage(),
                email: this.IbBookingRegisterFormDataService.getEmail(),
                enrolmentType: 'NORMAL_ENROL'
            },
            marketingPermissions: this.IbBookingRegisterFormDataService.getMarketingCheck(),
            termsAndConditions: {
                version: '2',
                acceptedDate: this.getTodayIso()
            },
            securityProfile: {
                username: this.IbBookingRegisterFormDataService.getEmail(),
                password: this.IbBookingRegisterFormDataService.getPassword()
            }
        };
    };

    private resolveCountryOfResidence = (): string => {
        return (BookingAppConstants.market ?? BookingAppConstants.defaultMarket).toUpperCase();
    };

    private resolvePrefLanguage = (): string => {
        return BookingAppConstants.lang ?? BookingAppConstants.defaultLang;
    };

    private getTodayIso = (): string => {
        return new Date().toISOString().slice(0, 10);
    };
}

downgradeToAJSService('IbBookingRegisterTransformerService', IbBookingRegisterTransformerService, 'ib-booking-passenger-info-module');