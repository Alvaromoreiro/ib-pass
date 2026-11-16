@Service(
    'ib-MmB-booking-dashboard-module',
    [],
    [])
export class UpdateDataContactDataTransformer {

    constructor() {}

    transformUpdateDataContactData = (passengerContactInfo, type) => {
        let orderContact: any = {};
        let contactInfo: any = {};

        switch (type) {
            case 'frequentFlyer':
                orderContact = {
                    passengersContactInfo: []
                };
                contactInfo.passengerId = passengerContactInfo.passengerId;
                contactInfo.ffInfo = passengerContactInfo.frequentFlyerInfo;
                contactInfo.additionalFFInfo = passengerContactInfo.additionalFFInfo;
                orderContact.passengersContactInfo.push(contactInfo);
                break;
            case 'primaryContact':
                orderContact = {
                    primaryContactInfo: passengerContactInfo.contactData.primaryContactInfo
                };
                break;
            case 'emergencyContact':
                orderContact = {
                    passengersContactInfo: []
                };
                for (let i = 0; i < passengerContactInfo.passengers.length; i++) {
                    if (passengerContactInfo.passengers[i].passengerType !== 'INFANT'){ //&& passengerContactInfo.passengers[i].flags.EMERGENCY_CONTACT_MODIFICATION) {
                        orderContact.passengersContactInfo[i] = {
                            passengerId: passengerContactInfo.passengers[i].passengerId,
                            emergencyContactInfo: this.transformEmergencyContactInfo(passengerContactInfo.passengers[i].emergencyContactInfo)
                        };
                    }
                }
                break;
            case 'contactInfo':
                orderContact = {
                    passengersContactInfo: []
                };
                contactInfo.passengerId = passengerContactInfo.passengerId;
                contactInfo.contactInfo = passengerContactInfo.contactInfo;
                orderContact.passengersContactInfo.push(contactInfo);
                break;
            case 'personalInfo':
                orderContact = {
                    passengersContactInfo: []
                };
                contactInfo.passengerId = passengerContactInfo.passengerId;
                contactInfo.personalInfo = passengerContactInfo.personalInfo;
                orderContact.passengersContactInfo.push(contactInfo);
                break;
        }
        return orderContact;
    }

    private transformEmergencyContactInfo = (emergencyContactInfo) => {
        const returnEmergencyContactInfo = {
            name: '',
            phone: '',
            countryCode: '',
            phoneDetails: {
                number: '',
                countryCode: ''
            }
        };

        if(emergencyContactInfo?.name) {
            returnEmergencyContactInfo.name = emergencyContactInfo.name;
        }
        if(emergencyContactInfo?.phone) {
            returnEmergencyContactInfo.phone = emergencyContactInfo.phone;
        }
        if(emergencyContactInfo?.code) {
            returnEmergencyContactInfo.countryCode = emergencyContactInfo.code;
        }
        if(emergencyContactInfo?.phoneDetails) {
            returnEmergencyContactInfo.phoneDetails.number = emergencyContactInfo.phone;
            returnEmergencyContactInfo.phoneDetails.countryCode = emergencyContactInfo.code;
        }

        return returnEmergencyContactInfo;
    }
}
