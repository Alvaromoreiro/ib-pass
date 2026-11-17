@Controller('ib-checkin-biometric-boarding-form-module', ['$rootScope', '$scope', 'CommonsModalService', 'object', 'localStorageService', 'BiometricBoardModel', '$timeout', '$document', 'CheckinAppConstants', '$filter', 'BoardingCardsService'])
class ibChekinBiometricBoardingFormController implements ng.IController {
    public model: any;
    public documentsByCountry: any;
    public countriesList: any = null;
    public biometricData: any = null;
    public infoForm: ng.IFormController;
    public checkInfo: boolean;
    public docNumber: boolean;
    public disabledDocumentType: boolean;
    public disabledDocNum: boolean;
    public showErrorNotActive: boolean;
    public showFormLoading: boolean;
    public showFormActive: boolean;
    public showErrorDocumentDate: boolean;
    public showErrorDocumentMatch: boolean;
    public showErrorNotActiveGeneric: boolean;
    public showErrorGeneral: boolean;
    // public showResumeCKI: boolean;
    public privacyMessage: string;
    public link: string;


    constructor (private $rootScope: CommonsRootScope, private $scope: ng.IScope, private CommonsModalService: any, private object: any, private localStorageService: angular.local.storage.ILocalStorageService, private BiometricBoardModel: any, private $timeout: ng.ITimeoutService, private $document: ng.IDocumentService, private CheckinAppConstants: any,  private $filter: ng.IFilterFunction, private BoardingCardsService) {
        this.checkInfo = false;
        //this.$scope.$on('biometricProfileInitCheck', this.biometricProfileInitCheck);
        this.$scope.$on('biometricProfileCheckError', this.biometricProfileCheckError);
        this.$scope.$on('biometricProfileCheckAssociate', this.biometricProfileCheckAssociate);
    }

    $onInit = (): void => {
        this.setPrivacyLink();
        const dataBuildForm: any = this.localStorageService.get('biometricBoardingForm');
        this.disabledDocumentType = true;
        this.disabledDocNum = true;
        this.model = this.BiometricBoardModel;
        const numPassengers = this.model.segmentsPassengersInfo.passengers.length;
        // this.showResumeCKI = numPassengers === 1;
        this.model.initializeModel();
        angular.extend(this.model, this.object);
        this.countriesList = (dataBuildForm && dataBuildForm.countriesList && dataBuildForm.countriesList.length > 0) ? dataBuildForm.countriesList : [];
        this.documentsByCountry = (dataBuildForm && dataBuildForm.documentsByCountry) ? dataBuildForm.documentsByCountry : [];
        this.btnFormDisabled();
        this.initControlModalsForm();
        this.localStorageService.set('biometricFormInit', true);
    };

    checkBiometricBoarding = (): void => {
        this.infoForm.$submitted = true;
        this.initControlModalsForm();

        if (this.infoForm.$valid) {
            this.model.biometricData.name = this.model.passenger.name;
            this.model.biometricData.surname = this.model.passenger.surname;
            this.model.biometricData.boardingCard = this.model.passenger.biometricDocument;

            this.localStorageService.set('biometricProfileCheck', true);
            this.showFormLoading = true;
            this.$rootScope.$broadcast('biometricBoardingFormComplete', this.model.biometricData);
        }
    };

    updateDocumentsType = (): void => {
        this.disabledDocumentType = !(this.model.biometricData.documentEmissionCountry && this.model.biometricData.documentEmissionCountry !== null);
    };

    updateDocumentNumber = (): void => {
        this.disabledDocNum = !(this.model.biometricData.documentType && this.model.biometricData.documentType !== null);
    };

    existDocument = (doc: any): boolean => {
        return doc.type === this.model.selectedDocument.type;
    };

    changeDocument = (): void => {
        this.docNumber = false;
        if (this.infoForm.document_number.$error && this.infoForm.document_number.$error.new_document) {
            this.infoForm.document_number.$error = {};
            this.infoForm.$invalid = false;
        }
    };

    btnConfirmation = () : void => {
        this.$rootScope.$broadcast('goToConfirmationEvent', this.model.biometricData);
        this.close();
    };

    btnClose = () : void => {
        this.$rootScope.$broadcast('biometricBoardingRefreshPage');
        this.close();
    };

    btnFormDisabled = (isDisabled?: boolean): boolean => {
        const isEnabled: boolean = !(this.checkInfo && this.infoForm.$valid && this.model.biometricData.email && this.model.biometricData.email.length > 0 &&
            this.model.biometricData.documentNumber && this.model.biometricData.documentNumber.length > 0 &&
            this.model.biometricData.documentEmissionCountry && this.model.biometricData.documentEmissionCountry.length > 0 &&
            this.model.biometricData.documentType && this.model.biometricData.documentType.type && this.model.biometricData.documentType.type.length > 0);
        return isDisabled ? isDisabled : isEnabled;
    };

    close = (): void => {
        this.CommonsModalService.closeAllCurrentModals();
    };

    biometricProfileCheckError = (event: ng.IAngularEvent, error: any): void => {
        const idHtmlModal: any = document.getElementById('biometric-form-profile');
        this.showFormLoading = false;
        if (error && error.internalErrorCode && error.errorCode === 412) {
            switch (error.internalErrorCode) {
                    case 'CUST_BIO_0001':
                    case 'BIO_AENA_0008':
                        this.showErrorNotActive = true; //this adds the class 'ib-biometric-form-modal--not-active' to the form
                        this.showErrorDocumentMatch = true;
                        break;
                    case 'CUST_BIO_0003':
                    case 'BIO_AENA_0004':
                        this.showErrorNotActive = true;
                        this.showErrorDocumentDate = true;
                        break;
                    case 'ERROR_204':
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = false;
                        this.showFormLoading = false;
                        this.model.passenger.status = this.CheckinAppConstants.BIOMETRIC.STATUS.NOT_ACTIVE;
                        break;
                    default:
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = true;
                        break;
            }
        } else {
            switch(error.errorCode) {
                    //404 => BIO_AENA_0001 => BIOMETRIC_DATA_NOT_FOUND => Aena no tiene la info del documento que se le manda
                    case 404:
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = false;
                        break;
                    case 400: //400 => Bad request => Invalid boardingCard format
                    case 409: //409 => Conflict	=> PNR info not found
                    case 500: //500 => BIO_AENA_0002 => CONNECTIVITY_PROBLEMS => Problemas de conectividad con Aena
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = true;
                        break;
                    default:
                        idHtmlModal.className += ' ib-biometric-form-modal--not-active';
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = true;
                        break;
            }
        }
    };

    biometricProfileCheckAssociate = (evenr: ng.IAngularEvent, model: any): void => {
        
        if(model?.code === 200) {
            this.showFormActive = true;
            this.localStorageService.set('showBiometricSummaryModule', 'summary');
            this.BoardingCardsService.searchBoardingCardsInformation(false).then((data) => {
                this.localStorageService.set('biometricStatusPassengers', data);
                this.showFormLoading = false;
            }, (error) => {
                this.showFormLoading = false;
            });
        } else if (model?.code === 206) {
            // Find the first boarding card that was not associated correctly and get the error description
            const errorReason = model.data.validatedAssociatedStatus[0].associatedStatus.find(bc => bc.status === 'FAILED').description;
            /*
            206 => CUST_BIO_0003 => DOCUMENT_EXPIRES_BEFORE_FLIGHT => Documento expirado antes de la salida del vuelo
            206 => CUST_BIO_0005 => FLIGHT_INFO_NOT_FOUND => Información del vuelo no encontrada
            206 => CUST_BIO_0001 => INVALID_PASSENGER => El nombre, el apellido, el pasajero o el ticket number es invalido.
            206 => BIO_AENA_0002 => CONNECTIVITY_PROBLEMS => Se realizó la asociación, pero no se pudo enviar la tarjeta de embarque al cliente por correo.
            */
            switch(errorReason){
                    case 'CONNECTIVITY_PROBLEMS':
                    case 'FLIGHT_INFO_NOT_FOUND':
                    case 'INVALID_PASSENGER':
                    default:
                        this.showErrorNotActive = true;
                        this.showErrorNotActiveGeneric = true;
                        break;
                    case 'DOCUMENT_EXPIRES_BEFORE_FLIGHT':
                        this.showErrorNotActive = true;
                        this.showErrorDocumentDate = true;
                        break;
            }
        }  
    };

    closeModalForTime = (): void => {
        if(this.showErrorNotActive || this.showFormActive || this.showFormLoading) {
            this.$timeout(() => {
                this.close();
                //this.initControlModalsForm();
                this.localStorageService.remove('biometricProfileCheck');
            }, 6000);
        }
    };

    goBackToForm = () : void => {
        this.initControlModalsForm();
    };

    initControlModalsForm = (): void => {
        this.showErrorNotActive = false;
        this.showFormLoading = false;
        this.showFormActive = false;
        this.showErrorDocumentDate = false;
        this.showErrorDocumentMatch = false;
        this.showErrorNotActiveGeneric = false;
    };

    setPrivacyLink = (): void => {
        this.link = this.$filter('LinksFilter')('DATA_PROTECTION_POLICY_LINK', this.$rootScope.appLang);
        this.privacyMessage = this.$filter('translate')('BIOMETRIC_BOARDING_PRIVACY', {privacyLink : this.link});
    };
}
