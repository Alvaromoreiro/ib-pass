import { Injectable } from '@angular/core';
import {
    AccountMemberPlusResponse,
    ContactDetailsZeroResponse,
    CustomerDataInfoStorage,
    CustomerDataONBStorage,
    IberiaONBUser,
    IberiaPlusUser,
    IberiaZeroUser, IbOnBusinessMembershipResponse, IbPlusTierLevels,
    MemberPlusResponse,
    PersonalDataZeroResponse, ServerLevelIdentifier
} from 'ib-web-commons/models';
import { CommonsConstants } from 'ib-web-commons/constants';
import { IbCAviosFormatPipe } from 'ib-web-commons/pipes';



@Injectable({
    providedIn: 'root'
})
export class IbCUserStoreTransformerService {

    constructor (private aviosFormatPipe: IbCAviosFormatPipe) {}

    /**
     * @description Transform Iberia Zero Server response into the customer data storage information
     * @param data
     */
    transformIberiaZeroInfoToCustomerData (data: [PersonalDataZeroResponse, ContactDetailsZeroResponse]): CustomerDataInfoStorage {
        const [personalData, contactDetails] = data;

        return {
            generalInfo: {
                hashEID: null
            },
            personalInfo: {
                name: personalData.name,
                surname1: !personalData.lastName || personalData.lastName?.includes('@') ? '' : personalData.lastName,
                gender: personalData.gender,
                contactEmail: contactDetails.email,
                telecomAddresses: {
                    deviceType: 'MOBILE',
                    type: 'PERSONAL',
                    preferenceIndicator: true,
                    number: contactDetails.phone.number,
                    countryDiallingCode: contactDetails.phone.prefix
                },
                alarms: this.getAlarmsInfo()
            },
            largeFamilyInfo: {
                category: null,
                docNumber: null,
                zipCode: null
            },
            residentInfo: {
                area: -1
            },
            acceptedTermsAndConditions: false
        };
    }

    /**
     * @description Transform Iberia Plus Server response into the customer data storage information
     * @param data
     */
    transformIberiaPlusInfoToCustomerData (data: MemberPlusResponse): CustomerDataInfoStorage {
        const { memberPersonalDetails, accounts, partners } = data;
        const recognitionsLevelData = memberPersonalDetails.schemes;

        return {
            generalInfo: {
                category: recognitionsLevelData[0]?.recognitionLevel.recognitionLevelIdentifier ?? 'CLASICA',
                avios: this.getTotalAvios(accounts),
                aviosTransformed: this.getAviosTransformed(this.getTotalAvios(accounts)),
                hashEID: null
            },
            personalInfo: {
                ibPlusNumber: memberPersonalDetails.identifier,
                name: memberPersonalDetails.person.personName.firstName,
                surname1: memberPersonalDetails.person.personName.familyName ?? '',
                surname2: memberPersonalDetails.person.personName.secondFamilyName ?? '',
                gender: memberPersonalDetails.person.gender,
                contactEmail: memberPersonalDetails.person.emailAddress.email,
                telecomAddresses: {},
                alarms: this.getAlarmsInfo()
            },
            beneficiaries: {
                ibPlusNumber: memberPersonalDetails.identifier
            },
            largeFamilyInfo: {
                category: null,
                docNumber: null,
                zipCode: null
            },
            residentInfo: {
                area: -1
            },
            acceptedTermsAndConditions: false,
            otherStatuses: {
                isRedemptionEnabled: memberPersonalDetails.otherStatuses ? memberPersonalDetails.otherStatuses.isRedemptionEnabled : true
            },
            partners
        };
    }

    /**
     * Get the real avios the Iberia Plus user has associated with the account
     * @param accounts Server response with all the account avios information
     */
    getTotalAvios (accounts: AccountMemberPlusResponse[]): number {
        let isReward0 = false;
        let hasOutstandingLoan: boolean | 0 | undefined = false;
        let aviosReward = 0;
        let aviosLoan = 0;
        let totalReward = 0;

        accounts.forEach((account) => {
            switch (account.type) {
                    case CommonsConstants.ACCOUNT_TYPES.REWARD:
                        aviosReward = account.balance.amount;
                        isReward0 = (aviosReward === 0);
                        break;
                    case CommonsConstants.ACCOUNT_TYPES.LOAN:
                        hasOutstandingLoan = account.outstandingLoan?.amount && account.outstandingLoan.amount > 0;
                        aviosLoan = account.outstandingLoan && hasOutstandingLoan ? -account.outstandingLoan.amount : account.balance.amount;
                        break;
                    case CommonsConstants.ACCOUNT_TYPES.TOTAL_REWARD:
                        totalReward = account.balance.amount;
                        break;
                    default:
                        break;
            }
        });
        return isReward0 && hasOutstandingLoan ? aviosLoan : Math.max(aviosReward, totalReward);
    }

    /**
     * Transforms the avios to a string to be used in views, based on internationalization
     * @param avios Total amount of avios to transform
     * @private
     */
    private getAviosTransformed (avios: number): string {
        return this.aviosFormatPipe.transform(avios);
    }

    /**
     * Transforms the Iberia Plus server response to use in the internal user store
     * @param data
     */
    transformIbPlusMembers (data: MemberPlusResponse, softUser = false): IberiaPlusUser {
        return {
            appUserInfo: {
                logged: true,
                userType: 'IB_PLUS',
                avios: this.getTotalAvios(data.accounts),
                permanentUser: softUser,
                frequentFlyer: data.memberPersonalDetails.identifier,
                tierLevel: this.getAppTierLevel(data.memberPersonalDetails.schemes[0].recognitionLevel.recognitionLevelIdentifier)
            },
            personalInfo: {
                name: data.memberPersonalDetails.person.personName.firstName,
                surname: data.memberPersonalDetails.person.personName.familyName ?? '',
                secondSurname: data.memberPersonalDetails.person.personName.secondFamilyName ?? '',
                gender: data.memberPersonalDetails.person.gender,
                email: data.memberPersonalDetails.person.emailAddress.email
            },
            serviceResponse: data
        };
    }

    /**
     * Transforms the Iberia Zero server response to use in the internal user store
     * @param data
     */
    transformIbZeroPersonalData (data: [PersonalDataZeroResponse, ContactDetailsZeroResponse], softUser = false): IberiaZeroUser {
        const [personalData, contactDetails] = data;
        return {
            appUserInfo: {
                logged: true,
                userType: 'IB_ZERO',
                permanentUser: softUser
            },
            personalInfo: {
                name: personalData.name,
                surname: !personalData.lastName || personalData.lastName?.includes('@') ? '' : personalData.lastName,
                gender: personalData.gender,
                email: contactDetails.email,
                phone: {
                    prefix: contactDetails.phone.prefix ?? '',
                    number: contactDetails.phone.number ?? ''
                }
            },
            serviceResponse: data
        };
    }

    /**
     * Transforms the cached ONB data in the storage to the user store information
     * @param data
     */
    transformONBCustomerDataToStore (data: CustomerDataONBStorage): IberiaONBUser {
        return {
            appUserInfo: {
                logged: true,
                userType: 'ONB',
                points: data.puntos
            },
            personalInfo: {
                name: data.name,
                surname: data.surname,
                gender: 'Male',
                email: data.email
            }
        };
    }

    /**
     * Transforms the cached or not ONB membership response to the user store information
     * @param data
     */
    transformONBMembershipToStore (data: IbOnBusinessMembershipResponse): IberiaONBUser {
        return {
            appUserInfo: {
                logged: true,
                userType: 'ONB',
                points: data.memberBalance
            },
            personalInfo: {
                name: data.userInfo.firstName,
                surname: data.userInfo.lastName,
                secondSurname: data.userInfo.secondLastName,
                gender: data.userInfo.title === 'MR' ? 'Male' : 'Female',
                email: data.userInfo.email
            }
        };
    }

    /**
     * @description Converts server tier level response into the app tier level
     * @param tierLevel
     * @private
     */
    private getAppTierLevel (tierLevel: ServerLevelIdentifier): IbPlusTierLevels {
        return tierLevel;
    }

    /**
     * @description Old state angularjs, the utility and the use case of this has to been investigated
     * @private
     */
    private getAlarmsInfo () {
        return [
            {
                number: 1,
                params: ['25']
            },
            {
                number: 5,
                params: ['DEVOLUCIONES DE CORREO', '20/02/2020']
            },
            {
                number: 7,
                params: []
            }
        ];
    }

    /**
     * @description Generate hashEID from email to use inside app
     * @param email
     */
    async generateHashEID (email: string): Promise<string> {

        const hex = (buffer: ArrayBuffer) => {
            const hexCodes = [];
            const view = new DataView(buffer);
            for (let i = 0; i < view.byteLength; i += 4) {
                // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
                const value = view.getUint32(i);
                // toString(16) will give the hex representation of the number without padding
                const stringValue = value.toString(16);
                // We use concatenation and slice for padding
                const padding = '00000000';
                const paddedValue = (padding + stringValue).slice(-padding.length);
                hexCodes.push(paddedValue);
            }
            // Join all the hex strings into one
            return hexCodes.join('');
        };

        // We transform the string into an arraybuffer.
        const buffer = new TextEncoder().encode(email);
        return crypto.subtle.digest('SHA-256', buffer).then((hash) => {
            return hex(hash);
        });
    }
}



