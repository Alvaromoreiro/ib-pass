import angular from "angular";
import { MmBUtilsSharedService } from "@src/components/services/Utils/ib-MmB-utils-shared-service";

@Service(
    'ib-MmB-booking-dashboard-module',
    ['localStorageService', 'BookingDashboardConstants', 'MmBUtilsSharedService', 'MmBAppConstants'],
    [])
export class UpdateApisRequestTransformer {

    constructor(
        private localStorageService,
        private BookingDashboardConstants,
        private MmBUtilsSharedService: MmBUtilsSharedService,
        private MmBAppConstants
    ) {}

    generateUpdateApisRequest (passApisData, emergencyContactData, passengers) {
        let index, index2;
        let auxPass;
        let auxObject;
        let apisRequest: any = passApisData?.view?.showInTransitForAll ? [] : {};
        const allPassengers = this.localStorageService.get('bookingInfo').passengers;
        let basicInfoInfant;
        let documents = [], auxDoc = [];

        if (emergencyContactData?.name && emergencyContactData?.phone) {
            apisRequest.emergencyContact = {
                refused: false,
                name: emergencyContactData.name,
                phone: {
                    countryCode: emergencyContactData.countryCode,
                    number: emergencyContactData.phone
                }
            };
        }
        if (passApisData?.infData) {
            for (index2 = 0; index2 < allPassengers.length; index2++) {
                if (allPassengers[index2].passengerType === 'INFANT' && allPassengers[index2].passengerId === passApisData.infData.passengerId) {
                    allPassengers[index2] = passApisData.infData;
                }
            }
            basicInfoInfant = this.generateInf(allPassengers, passApisData.id);
            if (basicInfoInfant !== '') {
                apisRequest.infantPassengerSecurityInformation = angular.copy(basicInfoInfant.basicInfo);
                apisRequest.infantPassengerSecurityInformation.id = basicInfoInfant.passengerId;
                // transform date
                apisRequest.infantPassengerSecurityInformation.birthDate = apisRequest.infantPassengerSecurityInformation.birthDate.year + '-' + apisRequest.infantPassengerSecurityInformation.birthDate.month + '-' + apisRequest.infantPassengerSecurityInformation.birthDate.day;
            }
            if (!passApisData.infData.view.showInTransitForAll) {
                if (passApisData.infData.view.showInTransit) {
                    if (passApisData.infData.basicInfo.nationality !== this.BookingDashboardConstants.APIS_FORM.USA_NATIONALITY) {
                        apisRequest.infantPassengerSecurityInformation.inTransit = passApisData.infData.inTransit.isInTransit;
                        if (!passApisData.infData.inTransit.isInTransit) apisRequest.infantPassengerSecurityInformation.destinationAddress = passApisData.infData.destinationAddress;
                    } else {
                        apisRequest.infantPassengerSecurityInformation.inTransit = false;
                    }
                }

            }
            apisRequest.infantPassengerSecurityInformation.homeAddress = Object.assign(passApisData.infData.homeAddress || {}, {
                zipCode: passApisData?.infData?.homeAddress?.zipCode ?? '',
                address: passApisData?.infData?.homeAddress?.address ?? '',
                state: passApisData?.infData?.homeAddress?.state ?? '',
                city: passApisData?.infData?.homeAddress?.city ?? '',
                country: passApisData?.basicInfo?.homeCountry ?? ''
            });
            delete apisRequest.infantPassengerSecurityInformation.homeCountry;
            if (angular.isDefined(passApisData.infData.mandatoryDocuments) && passApisData.infData.mandatoryDocuments.isMandatory && angular.isDefined(passApisData.infData.mandatoryDocuments.selectedDoc)) {
                auxDoc = this.generateDocumentsRequest(passApisData.infData.mandatoryDocuments.selectedDoc);
                if (auxDoc.length > 0) documents.push(auxDoc[0]);
            }
            if (angular.isDefined(passApisData.infData) && angular.isDefined(passApisData.infData.visaDocument)) {
                auxDoc = this.generateDocumentsRequest(passApisData.infData.visaDocument);
                if (auxDoc.length > 0) documents.push(auxDoc[0]);
            }
            if (angular.isDefined(passApisData.infData) && angular.isDefined(passApisData.infData.optionalDocuments) && angular.isDefined(passApisData.infData.optionalDocuments.selectedDoc)) {
                auxDoc = this.generateDocumentsRequest(passApisData.infData.optionalDocuments.selectedDoc);
                if (auxDoc.length > 0) documents.push(auxDoc[0]);
            }

            if (documents.length > 0) {
                apisRequest.infantPassengerSecurityInformation.documents = documents;
            }
        }

        if (!passApisData.view.showInTransitForAll) {
            if (passApisData.view.showInTransit) {
                apisRequest.inTransit = passApisData.inTransit.isInTransit;
            }
            apisRequest.destinationAddress = passApisData.destinationAddress;
            apisRequest.homeAddress = Object.assign(passApisData.homeAddress || {}, {
                zipCode: passApisData?.homeAddress?.zipCode ?? '',
                address: passApisData?.homeAddress?.address ?? '',
                state: passApisData?.homeAddress?.state ?? '',
                city: passApisData?.homeAddress?.city ?? '',
                country: passApisData?.basicInfo?.homeCountry ?? ''
            });
        }

        if (passengers && passApisData?.view?.showInTransitForAll) {
            auxPass = [];
            this.applyTransitForAll(passApisData, passengers);
            for (index = 0; index < passengers.length; index++) {
                if (passengers[index].additionalRequiredInfo && angular.isDefined(passengers[index].additionalRequiredInfo.id)) {
                    auxPass.push(this.generateCommonPasInfo(passengers[index].additionalRequiredInfo, true));
                } else {
                    auxObject = {
                        id: passengers[index].passengerId,
                        basicInfo: passengers[index].personalInfo,
                        destinationAddress: passengers[index].destinationAddress,
                        birthDate: passengers[index].personalInfo.birthDate
                    };
                    auxPass.push(this.generateCommonPasInfo(auxObject, true));
                }
            }
            angular.extend(apisRequest, auxPass);
        } else {
            angular.extend(apisRequest, this.generateCommonPasInfo(passApisData, false));
        }

        if (passengers && passApisData.view.showInTransitForAll) {
            apisRequest = this.destinationAddressByPassengers(apisRequest, passApisData.destinationAddress);
            apisRequest = this.generateDocumentsAndHomeAdress(apisRequest, passengers);
            return apisRequest;
        }

        if (passApisData?.visaDocument) {
            auxDoc = this.generateDocumentsRequest(passApisData.visaDocument);
            if (auxDoc.length > 0 && angular.isDefined(apisRequest.documents) && angular.isArray(apisRequest.documents)) {
                apisRequest.documents.push(auxDoc[0]);
            }
        }
        if (passApisData?.infData && passApisData?.optionalDocuments && passApisData?.optionalDocuments?.selectedDoc) {
            auxDoc = this.generateDocumentsRequest(passApisData.optionalDocuments.selectedDoc);
            if (auxDoc.length > 0 && angular.isDefined(apisRequest.documents) && angular.isArray(apisRequest.documents)) {
                apisRequest.documents.push(auxDoc[0]);
            }
        }

        if (passApisData?.infData && passApisData?.optionalDocuments?.selectedDoc) {
            auxDoc = this.generateDocumentsRequest(passApisData.optionalDocuments.selectedDoc);
            if (auxDoc.length > 0 && angular.isDefined(apisRequest.documents) && angular.isArray(apisRequest.documents)) {
                apisRequest.documents.push(auxDoc[0]);
            }
        }
        return [apisRequest];
    }

    private generateDocumentsAndHomeAdress = (apisRequest, passengers) => {
        let documents, optionalDocuments;

        for (let index = 0; index < passengers.length; index++) {
            apisRequest[index].documents = [];
            documents = passengers[index].additionalRequiredInfo.mandatoryDocuments;
            if (angular.isDefined(documents)) {
                documents = passengers[index].additionalRequiredInfo.mandatoryDocuments.documents;
                if (angular.isDefined(documents)) {
                    optionalDocuments = passengers[index].additionalRequiredInfo.optionalDocuments.documents;
                    // optionalDocuments
                    for (let index2 = 0; index2 < optionalDocuments.length; index2++) {
                        if (angular.isDefined(optionalDocuments[index2]) && optionalDocuments[index2].type.code !== 'CKI_COMBO_BLANK') {
                            apisRequest[index].documents.push(this.generateDocumentsRequest(angular.isDefined(passengers[index].additionalRequiredInfo.optionalDocuments) && angular.isDefined(optionalDocuments) ? optionalDocuments[index2] : {})[0]);
                        }
                    }
                }
            }
            // visaDocuments
            if (angular.isDefined(passengers[index].additionalRequiredInfo.visaDocument)) {
                apisRequest[index].documents.push(this.generateDocumentsRequest(passengers[index].additionalRequiredInfo.visaDocument)[0]);
            }
            // homeAddress
            apisRequest[index].homeAddress = angular.isUndefined(passengers[index].additionalRequiredInfo.homeAddress) ? passengers[index].additionalRequiredInfo.homeAddress : {};
        }
        return apisRequest;
    }

    private destinationAddressByPassengers = (resultApi, generalApi) => {
        for (let index = 0; index < resultApi.length; index++) {
            resultApi[index].destinationAddress = {};
            resultApi[index].destinationAddress = generalApi;
        }
        return resultApi;
    }

    private generateCommonPasInfo = (pasInfo, multiplePassengers) => {
        let returnedPasInfo: any = {};
        if (!multiplePassengers) {
            returnedPasInfo = {
                id: pasInfo?.id ? pasInfo.id : pasInfo?.passengerId ? pasInfo.passengerId : '',
                name: pasInfo.basicInfo.name,
                surname: pasInfo.basicInfo.surname,
                gender: pasInfo.basicInfo.gender,
                birthDate: pasInfo?.basicInfo?.birthDate ? pasInfo.basicInfo.birthDate.year + '-' + pasInfo.basicInfo.birthDate.month + '-' + pasInfo.basicInfo.birthDate.day : '',
                nationality: pasInfo.basicInfo.nationality
            };
            if (pasInfo?.title) returnedPasInfo.title = pasInfo.title;
            returnedPasInfo.documents = this.generateDocumentsRequest(pasInfo.mandatoryDocuments.selectedDoc)
                .concat(this.generateDocumentsRequest(pasInfo.visaDocument)
                    .concat(this.generateDocumentsRequest(pasInfo.optionalDocuments.selectedDoc)));

        } else {
            returnedPasInfo = {
                id: pasInfo.id || '',
                name: pasInfo?.basicInfo?.name ? pasInfo.basicInfo.name : '',
                surname: pasInfo?.basicInfo?.surname ? pasInfo.basicInfo.surname : '',
                gender: pasInfo?.basicInfo?.gender ? pasInfo.basicInfo.gender : '',
                birthDate: angular.isDefined(pasInfo.basicInfo) && angular.isDefined(pasInfo.basicInfo.birthDate) && pasInfo.basicInfo.birthDate !== null && angular.isDefined(pasInfo.basicInfo.birthDate.day) ? pasInfo.basicInfo.birthDate.year + '-' + pasInfo.basicInfo.birthDate.month + '-' + pasInfo.basicInfo.birthDate.day : angular.isDefined(pasInfo.basicInfo.birthDate) && pasInfo.basicInfo.birthDate !== null && pasInfo.basicInfo.birthDate.length > 0 ? this.transformDate(pasInfo.basicInfo.birthDate) : '',
                nationality: pasInfo?.basicInfo?.nationality ? pasInfo.basicInfo.nationality : '',
                inTransit: pasInfo?.inTransit ? pasInfo.inTransit.isInTransit : false,
                title: pasInfo?.title ? pasInfo.title : ''
            };
        }
        returnedPasInfo.documents = this.MmBUtilsSharedService.getUniqueElementByProperty(returnedPasInfo.documents, 'type');
        returnedPasInfo.documents = returnedPasInfo?.documents?.length > 0 ? [returnedPasInfo.documents[0]] : [];
        return returnedPasInfo;
    }

    private transformDate = (date) => {
        date = date.split('-');
        return date[2] + '-' + date[1] + '-' + date[0];
    }

    private applyTransitForAll = (passApisData, passengers): void => {
        if (passengers && passApisData.view.intransitforallansitForAll) {
            for (let index = 0; index < passengers.length; index++) {
                passengers[index].destinationAddress = {
                    address: passApisData.destinationAddress.address,
                    city: passApisData.destinationAddress.city,
                    state: passApisData.destinationAddress.state,
                    zipCode: passApisData.destinationAddress.zipCode,
                    country: angular.isDefined(passApisData.destinationAddress.country) ? passApisData.destinationAddress.country : ''
                };
            }
        }

    }

    private generateDocumentsRequest = (doc) => {
        const returnedDocuments = [];

        if (doc && doc.type && doc.type.code !== 'CKI_COMBO_BLANK') {
            if (doc.type.code && doc.type.code.length > 0 && doc.number && doc.number.length > 0) {
                returnedDocuments.push({
                    type: doc.type.code,
                    number: doc.number,
                    expiryDate: doc.expiryDate === null && angular.isUndefined(doc.expiryDate) ? '' : angular.isObject(doc.expiryDate) && angular.isDefined(doc.expiryDate.year) && angular.isDefined(doc.expiryDate.day) && angular.isDefined(doc.expiryDate.month) && doc.expiryDate.year !== '' && doc.expiryDate.day !== '' && doc.expiryDate.month !== '' ? doc.expiryDate.year + '-' + doc.expiryDate.month + '-' + doc.expiryDate.day : '',
                    issuerCountry: this.transformCountry(doc)
                });
            }
        }
        return returnedDocuments;
    }

    private transformCountry = (doc) => {
        if (doc.issuerCountry !== null) {
            if (angular.isDefined(doc.issuerCountry)) {
                if (angular.isDefined(doc.issuerCountry.code)) {
                    doc.issuerCountry = doc.issuerCountry.code;
                } else {
                    doc.issuerCountry = doc.issuerCountry;
                }
            } else {
                doc.issuerCountry = doc.issuerCountry;
            }
        } else {
            doc.issuerCountry = '';
        }
        return doc.issuerCountry;
    }

    private generateInf = (passengers, id) => {
        let index;
        let data: any = '';
        let aux;
        for (index = 0; index < passengers.length; index++) {
            if (passengers[index].passengerType === this.MmBAppConstants.PASSENGER_TYPES.infant && id === passengers[index].relatedPassengerId) {

                data = {
                    passengerType: passengers[index].passengerType,
                    passengerId: passengers[index].passengerId,
                    relatedPassengerId: passengers[index].relatedPassengerId,
                    optionalInformation: passengers[index].optionalInformation,
                    basicInfo: passengers[index].personalInfo || passengers[index].basicInfo
                };

                if (data.basicInfo.birthDate && !angular.isObject(data.basicInfo.birthDate)) {
                    aux = data.basicInfo.birthDate.split('-');
                    data.basicInfo.birthDate = {
                        day: aux[2],
                        month: aux[1],
                        year: aux[0]
                    };
                }
            }
        }
        return data;
    }
}
