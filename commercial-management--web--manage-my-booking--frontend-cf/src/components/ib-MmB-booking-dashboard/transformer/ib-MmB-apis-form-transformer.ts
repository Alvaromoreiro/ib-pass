import angular from "angular";
import { ReturnedDocuments } from "../view-model/ib-MmB-apis-form-transformer-model";

@Service(
    'ib-MmB-booking-dashboard-module',
    ['localStorageService', 'BookingDashboardConstants', '$filter', 'MmBAppConstants'],
    [])
export class ApisFormTransformer {

    constructor(
        private localStorageService,
        private BookingDashboardConstants,
        private $filter,
        private MmBAppConstants
    ) {}

    transformApisForm = (apisInfo, companiesList, countriesList, statesList) => {
        //apisInfo
        let passengerApisInfo = {};
        const additionalInfo = {
            companiesList: companiesList.slice(),
            countriesList: countriesList.slice(),
            statesList: statesList.slice()
        };

        if (additionalInfo.countriesList && additionalInfo.countriesList.length > 0) {
            additionalInfo.countriesList.shift();
        }
        passengerApisInfo = this.generatePassengerApisInfo(apisInfo.passengersSecurityInformation[0], statesList);

        return {
            passengerApisInfo: passengerApisInfo,
            additionalInfo: additionalInfo
        };
    }

    private generatePassengerApisInfo = (pasApisInfo, statesList) => {
        let isInfant = false;
        let passengers, i, pasApisInfoTransformed, documents, viewValues, documentsInf, infData: any, infViewValues;
        if (pasApisInfo.id.indexOf('INFANT') >= 0) {
            isInfant = true;
            passengers = this.localStorageService.get('bookingInfo').passengers;
            for (i = 0; i < passengers.length; i++) {
                if (passengers[i].passengerType === 'INFANT') {
                    if (!pasApisInfo.infantPassengerSecurityInformation) {
                        pasApisInfo.infantPassengerSecurityInformation = this.generateInf(passengers, passengers[i].relatedPassengerId);
                    }
                    pasApisInfo.infantPassengerSecurityInformation = passengers[i].relatedPassengerId;
                }
            }
        }
        pasApisInfoTransformed = {
            id: pasApisInfo.id.indexOf('INFANT') >= 0 ? pasApisInfo.infantPassengerSecurityInformation.relatedPassengerId : pasApisInfo.id,
            title: pasApisInfo.title,
            showContactData: true,
            view: {
                showOptions: false,
                showInTransit: false,
                showInTransitForAll: false,
                errorList: []
            },
            travelInfo: false,
            existInfant: false
        };
        pasApisInfoTransformed.basicInfo = this.generateBasicInfo(pasApisInfo);
        pasApisInfoTransformed.requiredFields = pasApisInfo.requiredFields || [];
        documents = this.generateDocumentsInfo(pasApisInfo);
        pasApisInfoTransformed.mandatoryDocuments = documents.mandatoryDocuments;
        pasApisInfoTransformed.optionalDocuments = documents.optionalDocuments;
        pasApisInfoTransformed.visaDocument = documents.visaDocument;

        viewValues = this.generateDestination(pasApisInfo);
        pasApisInfoTransformed.view.showInTransit = viewValues.showInTransit;
        pasApisInfoTransformed.view.showInTransitForAll = viewValues.showInTransitForAll;
        pasApisInfoTransformed.view.showOptions = viewValues.showOptions;
        pasApisInfoTransformed.inTransit = {
            isInTransit: pasApisInfo.inTransit
        };
        if(pasApisInfoTransformed.requiredFields.includes('DESTINATION_ADDRESS')) {
            pasApisInfoTransformed.destinationAddress = pasApisInfo.destinationAddress || {
                country: this.BookingDashboardConstants.APIS_FORM.USA_NATIONALITY
            };
        }
        if (pasApisInfo?.homeAddress) {
            pasApisInfoTransformed.homeAddress = pasApisInfo.homeAddress;
            pasApisInfoTransformed.homeAddress.country = pasApisInfoTransformed.homeAddress.country && pasApisInfoTransformed.homeAddress.country.code ? pasApisInfoTransformed.homeAddress.country.code : '';
        }
        if (pasApisInfo.destinationAddress !== undefined && pasApisInfo.destinationAddress !== null) {
            pasApisInfoTransformed.destinationAddress.address = pasApisInfo.destinationAddress.address;
            pasApisInfoTransformed.destinationAddress.city = pasApisInfo.destinationAddress.city;
            pasApisInfoTransformed.destinationAddress.state = this.getStateCode(pasApisInfo.destinationAddress.state, statesList);
            pasApisInfoTransformed.destinationAddress.zipCode = pasApisInfo.destinationAddress.zipCode;
            pasApisInfoTransformed.destinationAddress.country = (pasApisInfoTransformed.destinationAddress.country && pasApisInfoTransformed.destinationAddress.country.code) || this.BookingDashboardConstants.APIS_FORM.USA_NATIONALITY;
        }

        if ((pasApisInfo.infantPassengerSecurityInformation !== undefined && pasApisInfo.infantPassengerSecurityInformation !== null)) {
            infViewValues = this.generateDestination(pasApisInfo.infantPassengerSecurityInformation);
            infData = this.generateInf(this.localStorageService.get('bookingInfo').passengers, pasApisInfo.id);
            pasApisInfoTransformed.infData = (infData === '') ? pasApisInfo.infantPassengerSecurityInformation : infData;
            if (pasApisInfoTransformed.infData !== '' && pasApisInfoTransformed.infData !== null && pasApisInfoTransformed.infData !== undefined) {
                pasApisInfoTransformed.infData.basicInfo = this.generateBasicInfo(pasApisInfo.infantPassengerSecurityInformation);
                pasApisInfoTransformed.infData.gender = pasApisInfoTransformed.infData?.basicInfo?.gender ?? '';
                pasApisInfoTransformed.infData.nationality = pasApisInfo?.infantPassengerSecurityInformation?.nationality?.code?.length > 0 ? pasApisInfo.infantPassengerSecurityInformation.nationality.code : '';
                documentsInf = this.generateDocumentsInfo(pasApisInfo.infantPassengerSecurityInformation);
                pasApisInfoTransformed.infData.mandatoryDocuments = documentsInf.mandatoryDocuments || [];
                pasApisInfoTransformed.infData.visaDocument = documentsInf.visaDocument || null;
                pasApisInfoTransformed.infData.optionalDocuments = documentsInf.optionalDocuments || [];
                pasApisInfoTransformed.infData.requiredFields = pasApisInfo.infantPassengerSecurityInformation.requiredFields || [];
                pasApisInfoTransformed.infData.view = {
                    showInTransit: infViewValues.showInTransit || false,
                    showInTransitForAll: infViewValues.showInTransitForAll || false,
                    showOptions: infViewValues.showOptions || false
                };
                pasApisInfoTransformed.infData.inTransit = {
                    isInTransit: pasApisInfo.inTransit
                };
                pasApisInfoTransformed.infData.destinationAddress = pasApisInfo.infantPassengerSecurityInformation.destinationAddress || {
                    country: this.BookingDashboardConstants.APIS_FORM.USA_NATIONALITY
                };
                pasApisInfoTransformed.existInfant = true;
            }
        } else {
            pasApisInfoTransformed.infantInfoFilled = false;
        }

        return pasApisInfoTransformed;
    }

    private getStateCode = (state, statesList) => {
        let stateCode = null,
            sIndex = 0,
            sFound = false;
        const auxState = state || '';
        while (!sFound && sIndex < statesList.length) {
            if (auxState.toUpperCase() === statesList[sIndex].code.toUpperCase()) {
                sFound = true;
                stateCode = statesList[sIndex].code;
            }
            sIndex++;
        }
        return stateCode;
    }

    private getPasDate = (date) => {
        let returnedDate: any = {},
            splitedDate = [];
        if (date) {
            splitedDate = date.split('-');
            returnedDate.day = splitedDate[2];
            returnedDate.month = splitedDate[1];
            returnedDate.year = splitedDate[0];
        }
        return returnedDate;
    }

    private generateDestination = (passengerInfo) => {
        const view = {
            showOptions: false,
            showInTransit: false,
            showInTransitForAll: false
        };
        if (passengerInfo?.requiredFields){
            view.showOptions = passengerInfo.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.FIELDS.DESTINATION_ADDRESS) !== -1 ||
                passengerInfo.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.FIELDS.DESTINATION_CITY) !== -1 ||
                passengerInfo.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.FIELDS.DESTINATION_STATE) !== -1 ||
                passengerInfo.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.FIELDS.DESTINATION_ZIP) !== -1 ||
                passengerInfo.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.FIELDS.DESTINATION_COUNTRY) !== -1;
        }
        return view;
    }

    private generateBasicInfo = (passengerInfo) => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const dataPassBookingInfo = Array.isArray(bookingInfo?.passengers) ? bookingInfo.passengers.find(pass => pass.passengerId === passengerInfo.id) : null;
        const basicInfo = {
            name: passengerInfo?.name ?? dataPassBookingInfo?.externalPersonalInfo?.name ?? dataPassBookingInfo?.personalInfo?.name,
            surname: passengerInfo?.surname ?? dataPassBookingInfo?.externalPersonalInfo?.firstSurname ?? dataPassBookingInfo?.personalInfo?.surname,
            gender: passengerInfo.gender,
            birthDate: this.getPasDate(passengerInfo.birthDate),
            nationality: passengerInfo.nationality ? passengerInfo.nationality.code : null,
            homeCountry: (passengerInfo.homeAddress && passengerInfo.homeAddress.country) ? passengerInfo.homeAddress.country.code : null,
            homeAddress: {}
        };
        return basicInfo;
    }

    private generateDocumentsInfo = (passengerInfo) => {
        const auxDocuments = {};
        let k;
        const returnedDocuments:ReturnedDocuments = {
            mandatoryDocuments: {
                nationality: passengerInfo.nationality ? passengerInfo.nationality.code : '',
                isMandatory: true,
                documents: [],
                selectedDoc: passengerInfo.documents.length > 0 ? passengerInfo.documents[0] : null,
            },
            optionalDocuments: {
                nationality: passengerInfo.nationality ? passengerInfo.nationality.code : '',
                isMandatory: false,
                documents: [],
                optDocuments: [],
                selectedDoc: null
            },
            visaDocument: null
        };

        for (let i = 0; i < passengerInfo?.mandatoryDocuments.length; i++) {
            for (k = 0; k < passengerInfo.mandatoryDocuments[i]?.documents.length; k++) {
                if (passengerInfo.mandatoryDocuments[i].documents[k].type.code !== this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.VISA) {
                    if (!auxDocuments[passengerInfo.mandatoryDocuments[i].documents[k].type.code]) {
                        this.checkDocumentIssuerCountry(passengerInfo.mandatoryDocuments[i].documents[k], returnedDocuments.mandatoryDocuments.nationality);
                        auxDocuments[passengerInfo.mandatoryDocuments[i].documents[k].type.code] = passengerInfo.mandatoryDocuments[i].documents[k];
                        this.getDocumentValues(passengerInfo.mandatoryDocuments[i].documents[k], passengerInfo);
                        returnedDocuments.mandatoryDocuments.documents.push(passengerInfo.mandatoryDocuments[i].documents[k]);
                    }
                } else {
                    returnedDocuments.visaDocument = {
                        isMandatory: true
                    };
                    angular.extend(returnedDocuments.visaDocument, passengerInfo.mandatoryDocuments[i].documents[k]);
                    this.getDocumentValues(returnedDocuments.visaDocument, passengerInfo);
                }
            }
        }

        for (let i = 0; i < passengerInfo.optionalDocuments.length; i++) {
            if (passengerInfo.optionalDocuments[i].type.code !== this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.VISA) {
                this.checkDocumentIssuerCountry(passengerInfo.optionalDocuments[i], returnedDocuments.optionalDocuments.nationality);
                this.getDocumentValues(passengerInfo.optionalDocuments[i], passengerInfo);

            } else {
                returnedDocuments.visaDocument = returnedDocuments.visaDocument || {
                    isMandatory: false
                };
                angular.extend(returnedDocuments.visaDocument, passengerInfo.optionalDocuments[i]);
                if (!returnedDocuments.visaDocument.isMandatory) this.getDocumentValues(returnedDocuments.visaDocument, passengerInfo);
            }

        }
        for (let i = 0; i < passengerInfo.documents.length; i++) {
            returnedDocuments.optionalDocuments.documents.push(passengerInfo.documents[i]);
        }

        returnedDocuments.optionalDocuments.optDocuments = passengerInfo.optionalDocuments;



        if (returnedDocuments.optionalDocuments.documents.length > 0) {
            returnedDocuments.optionalDocuments.documents.unshift({
                type: {
                    description: this.$filter('translate')('CKI_COMBO_BLANK'),
                    code: 'CKI_COMBO_BLANK'
                }
            });
        }
        return returnedDocuments;
    }

    private getDocumentValues = (currentDocument, passengerInfo): void => {
        let i = 0, docFound = false;
        let isDocSelected;
        while (!docFound && i < passengerInfo.documents.length) {
            if (passengerInfo.documents[i].type) {
                if (currentDocument.type.code === passengerInfo.documents[i].type.code) {
                    docFound = true;
                    currentDocument.number = passengerInfo.documents[i].number || '';
                    currentDocument.issuedDate = passengerInfo.documents[i].issuedDate || null;
                    currentDocument.expiryDate = this.getPasDate(passengerInfo.documents[i].expiryDate);
                    currentDocument.issuerCountry = passengerInfo.documents[i].issuerCountry ? passengerInfo.documents[i].issuerCountry.code : (currentDocument.issuerCountry || '');
                    currentDocument.saveDocument = false;
                    if (!isDocSelected) {
                        if (currentDocument?.optionalDocuments) currentDocument.optionalDocuments.selectedDoc = currentDocument;
                        isDocSelected = true;
                    }
                }
            }
            i++;
        }
        currentDocument.isSaved = false;
    }

    private checkDocumentIssuerCountry = (currentDocument, nationality): void => {
        if (currentDocument.type.code === this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.DNI &&
            currentDocument.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.DOCUMENT_FIELDS.CNTRY_DOC) !== -1) {
            currentDocument.issuerCountry = nationality;
        } else if ((currentDocument.type.code === this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.GREENCARD || currentDocument.type.code === this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.REDRESSNUMBER ||
            currentDocument.type.code === this.BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.KNOWNTRAVELERNUMBER) && currentDocument.requiredFields.indexOf(this.BookingDashboardConstants.APIS_FORM.DOCUMENT_FIELDS.CNTRY_DOC) !== -1) {
            currentDocument.issuerCountry = this.BookingDashboardConstants.APIS_FORM.USA_NATIONALITY;
        }
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
