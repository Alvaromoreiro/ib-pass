import * as angular from 'angular';

export class BkiModalServiceAncillaries {
    public waitingModalInstance;
    public errorMessage;
    public errorCode;
    public errorPassengerSeatsMap;
    public error;
    public errorGetOut = false;
    constructor (
        private $rootScope: CommonsRootScope,
        private $uibModal: ng.ui.bootstrap.IModalService,
        private $uibModalStack: ng.ui.bootstrap.IModalStackService,
        private $document: any,
        private BookingAncillariesConstant: BookingAncillariesConstant
    ) {}

    /**
     * @function
     * @name isNotWaiting
     * @desc Sets the variable wait to false and the variable error to fals
     */
    isNotWaiting = (): void => {
        this.$uibModalStack.dismissAll();
        this.waitingModalInstance = null;
    };

    /**
     * @function
     * @name closeLoadingModal
     * @desc Close the waiting modal instance
     */
    closeWaitingModal = () : void => {
        this.$uibModalStack.dismiss(this.waitingModalInstance);
        this.waitingModalInstance = null;
    };

    ////////////////
    /**
     * Opens a generic error modal returning its instance
     * @param {Object} errorObject - the error object to show in the template. It is passed to the controller.
     * @param {boolean} isModalBlocked - if the error modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @returns {Object} -the error modal instance opened
     */
    showGenericError = (errorObject: any, isModalBlocked: any, template: any): any => {
        const modalErrorObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + (template ? template : 'anc-generic-error-modal.html'),
            controller: 'GenericErrorModalAncillariesController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                ErrorModel: function () {
                    return errorObject;
                }
            }
        };

        if (isModalBlocked) {
            modalErrorObject.backdrop = 'static';
            modalErrorObject.keyboard = false;
        }
        return this.$uibModal.open(modalErrorObject);
    };

    ////////////////
    /**
     * Opens a generic  modal returning its instance
     * @param {boolean} isModalBlocked - if the  modal must be blocked on outside user click.
     * @param {string} template - the name of a custom template to be shown in the modal
     * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
     * modalCtrl.model object in the generic controller
     * @returns {Object} -the  modal instance opened
     */
    showGenericModal = (modelObject: any, isModalBlocked: any, template: any): any => {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + (template ? template + '.html' : 'generic-info-modal.html'),
            controller: 'GenericModalAncillariesController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject.backdrop = 'static';
            modalObject.keyboard = false;
        }

        return this.$uibModal.open(modalObject);
    };

    /**
     * Opens the waiting modal, saving its instance in the service as attribute
     */
    showWaitingModal = (template: any, classTpl: any, background: any, modelObject: any): void => {
        const tpl = template ? template : 'generic-wait-modal';
        const clss = classTpl || '';
        const waitModalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + tpl + '.html',
            size: 'loading',
            backdrop: 'static',
            controller: 'GenericModalController',
            controllerAs: 'modalCtrl',
            keyboard: false,
            windowClass: clss ? clss : 'ib-modals ib-modals--loading',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        if (background) {
            waitModalObject.windowTemplateUrl = this.$rootScope.routes.templates + 'ib-modal-background.html';
        }
        this.waitingModalInstance = this.waitingModalInstance || this.$uibModal.open(waitModalObject);
    };
    /**
     * @function
     * @name isWaiting
     * @desc Sets the variable wait to true and opens the modal
     */
    isWaiting = (): void => {
        this.$uibModal.open({
            animation: false,
            windowClass: 'ib-modals ib-modals--md',
            templateUrl: this.$rootScope.routes.templates + 'anc-modal-mensaje-wait.html',
            size: 'loading',
            backdrop: 'static',
            keyboard: false
        });
    };

    /**
     * @function
     * @name setErrorMessage
     * @desc Sets the param object, the object that contains the message error.
     */
    setErrorMessage = (object: any): void => {
        this.errorMessage = object;
    };

    /**
     * @function
     * @name setErrorMessage
     * @desc Sets the param object, the object that contains the message error.
     */
    setErrorCode = (object): void => {
        this.errorCode = object;
    };

    /**
     * @function
     * @name setErrorGetOut
     * @desc Set it conditional value to get out of the iberia flow. This function is uses when flow is early checking.
     */
    setErrorGetOut = (boolean): void => {
        this.errorGetOut = boolean;
    };

    /**
     * @function
     * @name isError
     * @desc Sets the variable error to true and opens the modal
     */
    isError = (modelObject, template, staticModal): any => {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + (template ? template : 'ib-modal-mensaje-error.html'),
            controller: 'GenericErrorModalAncillariesController',
            controllerAs: 'modalCtrl',
            size: 'md',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                ErrorModel: function () {
                    return modelObject || {};
                }
            }
        };
        if (staticModal || this.getErrorCode() === 'IB_00002') {
            modalObject.backdrop = 'static';
            modalObject.keyboard = false;
        }
        this.error = true;
        return this.$uibModal.open(modalObject);
    };

    /**
     * @function
     * @name getErrorCode
     * @desc Returns the variable errorCode
     */
    getErrorCode = (): any => {
        return this.errorCode;
    };

    /**
     * @function
     * @name getErrorMessage
     * @desc Returns the variable errorMessage..
     */
    getErrorMessage = (): void => {
        return this.errorMessage;
    };

    /**
     * @function
     * @name setErrorGetOut
     * @desc Set it conditional value to get out of the iberia flow. This function is uses when flow is early checking.
     */
    getErrorGetOut = (): any => {
        return this.errorGetOut;
    };

    /**
     * @function
     * @name setErrorPassengerSeatsMap
     * @desc Sets the param object, the object that contains the message error passenger.
     */
    setErrorPassengerSeatsMap = (object: any): void => {
        this.errorPassengerSeatsMap = object;
    };

    /**
     * Opens a generic  modal returning its instance
     * @param {Object} modelObject - An object to be used in the view. This object will be associated to the
     * @param {string} template - the name of a custom template to be shown in the modal
     * modalCtrl.model object in the generic controller
     * @returns {Object} -the  modal instance opened
     */
    openInsuranceModal = (modelObject: any, template: any): any => {
        const modalObject = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + template,
            controller: 'InsuranceAncModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--no-padding ib-modals--full-mobile fade',
            backdrop: 'static',
            keyboard: false,
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open seat map modal view
     * @param {Object} modelObject Model for load and save data
     */
    openSeatNewMapModal  = (modelObject): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-seat-map.html',
            controller: 'SeatsMapController',
            controllerAs: 'seatMapCtrl',
            windowClass: 'ib-modals-full fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open seat map legend modal view
     * @param {Object} modelObject Model for load and save data
     */
    openSeatNewMapLegendModal  = (modelObject): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-new-seats-map-legend.html',
            controller: 'GenericModalController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--sm fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };


    /**
     * @function
     * @name seatsMapError
     * @desc Sets the variable error to true and opens the modal
     */
    openSeatMapErrorUpdateModal = (modelObject: any, size: any, template: any, anim: any): any => {
        this.$uibModal.open({
            animation: anim,
            templateUrl: this.$rootScope.routes.templates + template + '.html',
            controller: 'GenericErrorModalController',
            controllerAs: 'modalCtrl',
            size: size,
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                ErrorModel: function () {
                    return modelObject || {};
                }
            }
        });
    };

    /**
     * Open modal feature of seat map seat
     * @param {*} templateName
     * @param {*} modalBlocked
     * @param {*} message
     * @param {*} classModal
     */
    openFeatureModal = (templateName: any, modalBlocked: any, message: any, classModal: any): any => {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + templateName,
            controller: 'SeatMapModalController',
            controllerAs: 'modalCtrl',
            windowClass: classModal,
            resolve: {
                modalMessage: function () {
                    return message;
                }
            }
        };
        if (modalBlocked) {
            modalObject.backdrop = 'static';
            modalObject.keyboard = false;
        }

        return this.$uibModal.open(modalObject);
    };

    /**
     * Open baggages modal view
     */
    openBaggagesModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-baggage-modal-view.html',
            controller: 'BaggagesController',
            controllerAs: 'bagCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile ib-modals--no-padding fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open flexibilization modal view
     */
    openFlexibilizationModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + modelObject.model.modal.template,
            controller: 'FlexibilizationController',
            controllerAs: 'flexCtrl',
            windowClass: modelObject.model.modal.classes,
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open speq modal view
     */
    openSpeqsModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-speqs-modal-view.html',
            controller: 'SpeqsController',
            controllerAs: 'speqsCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile ib-modals--no-padding fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open specialmeals modal view
     */
    openSpecialMealsModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-special-meals-modal-view.html',
            controller: 'SpecialMealsController',
            controllerAs: 'specialMealCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open baggages modal view
     */
    openBobModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-bob-modal-view.html',
            controller: 'IbBobModalController',
            controllerAs: 'bobModalCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open speq know more modal
     * @param�{object} modelObject Subtype of speq selected
     */
    openSpeqInformation = (modelObject: any): any => {
        let view = '';

        switch (modelObject.subtype) {
                case this.BookingAncillariesConstant.SPEQ_TYPE.GOLF_EQUIPMENT:
                    view = 'ib-modal-golf-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.SKI_SNOW:
                    view = 'ib-modal-ski-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.SURFBOARD:
                    view = 'ib-modal-ski-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.BICYCLE:
                    view = 'ib-modal-bike-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.FISHING_EQUIPMENT:
                    view = 'ib-modal-ski-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.SCUBA_DIVING:
                    view = 'ib-modal-ski-know-more.html';
                    break;
                case this.BookingAncillariesConstant.SPEQ_TYPE.SPORTING_FIREARMS:
                    view = 'ib-modal-ski-know-more.html';
                    break;
        }

        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + view,
            controller: 'SpeqKnowMoreModalController',
            controllerAs: 'speqKnowCtrl',
            windowClass: 'ib-modals ib-modals--lg ib-modals--inside ib-modals--inside-scroll',
            appendTo: angular.element(document).find('.modal-content').eq(0),
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        angular.element(document).find('.modal').eq(0).addClass('ib-modals--outside');
        this.$uibModal.open(modalObject);
    };

    /**
     * Closes all the opened modals
     */
    closeAllCurrentModals = (): void => {
        this.$uibModalStack.dismissAll();
    };

    /**
     * Open bids modal view
     *  @param {Object} modelObject Model for load and save data
     */
    openBidsModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-bids-modal-view.html',
            controller: 'BidsController',
            controllerAs: 'bidsCtrl',
            windowClass: 'ib-modals-full fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open payment bids modal view
     *  @param {Object} modelObject Model for load and save data
     */
    openPaymentsBid = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-bids-payment-modal-view.html',
            controller: 'BidsPaymentController',
            controllerAs: 'bidsPaymentCtrl',
            windowClass: 'ib-modals-full',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open upgrading modal view for kwon more about the upgrading offers
     * @param {Object} modelObject Model for load and save data
     */

    openUpgradingKnowMore = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            controller: 'UpgradeKnowMoreController',
            controllerAs: 'modalCtrl',
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-bids-upgrading-know-more.html',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open payment bids modal view
     *  @param {Object} modelObject Model for load and save data
     */
    goToUpgradingBidsConfirmation = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-bids-pmt-con-upg-view.html',
            controller: 'BidsPmtConfirmUpgController',
            controllerAs: 'BidsPmtConfirmUpgCtrl',
            windowClass: 'ib-modals-full',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open modal to exit of upgrading bids flow
     * @param {Object} modelObject Model for load and save data
     */
    openCancelOfferUpgradingBids = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            controller: 'ModalBundelingMoreInfoController',
            controllerAs: 'bundleMoreInfoCtrl',
            templateUrl: this.$rootScope.routes.templates + 'ib-upg-bids-cancel-offer-modal.html',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open flexibility know more modal
     * @param {object} modelObject Subtype of speq selected
     */
    openFlexInformation = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + modelObject.template + '.html',
            controller: 'FlexibilityKnowMoreModalController',
            controllerAs: 'flexibilityCtrl',
            windowClass: 'ib-modals ib-modals--lg ib-modals--inside ib-modals--inside-scroll',
            appendTo: angular.element(document).find('.modal-content').eq(0),
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        angular.element(document).find('.modal').eq(0).addClass('ib-modals--outside');
        this.$uibModal.open(modalObject);
    };

    /**
     * Open insurance info modal
     * Open flexibilization modal view
     */
    openPriorityBoardingModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + modelObject.model.modal.template,
            controller: 'PriorityBoardingController',
            controllerAs: 'priorityCtrl',
            windowClass: modelObject.model.modal.classes,
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    /**
     * Open flexibility know more modal
     * @param {object} modelObject Subtype of speq selected
     */
    openModalPriorityKnowMoreInformation = (modelObject: any): any => {
        const modalObject:any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-priority-boarding-know-more' + '.html',
            controller: 'PriorityKnowMoreModalController',
            controllerAs: 'priorityKnowMoreCtrl',
            windowClass: 'ib-modals ib-modals--lg ib-modals--inside ib-modals--inside-scroll',
            appendTo: angular.element(document).find('.modal-content').eq(0),
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        angular.element(document).find('.modal').eq(0).addClass('ib-modals--outside');
        this.$uibModal.open(modalObject);
    };

    openInsuranceInfoModal = (modelObject: void): any => {
        const modalObject: any = {
            animation: true,
            controller: 'InsuranceAncModalController',
            controllerAs: 'modalCtrl',
            templateUrl: this.$rootScope.routes.templates + 'ib-insurance-info-modal.html',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    openInsuranceInfoCubaModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            controller: 'InsuranceCubaModalController',
            controllerAs: 'modalCtrl',
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-insurance-cuba.html',
            windowClass: 'ib-modals ib-modals--sm',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    openWarningChildInfoModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-priority-boarding-children' + '.html',
            controller: 'PriorityWarningChildController',
            controllerAs: 'priorityWarningChildCtrl',
            windowClass: 'ib-modals ib-modals--lg ib-modals--inside ib-modals--inside-scroll',
            appendTo: angular.element(document).find('.modal-content').eq(0),
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        angular.element(document).find('.modal').eq(0).addClass('ib-modals--outside');
        this.$uibModal.open(modalObject);
    };

    /*
     ** open modal avios summary
     */
    openAviosAccumulatedModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-avios-accumulated.html',
            controller: 'AviosAccumulatedController',
            controllerAs: 'summaryCtrl',
            windowClass: 'ib-modals ib-modals--md ib-modals--avios-inside',
            resolve: {
                object: function () {
                    return {modelObject};
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    openCarbonFootprintModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-carbon-footprint-modal-view.html',
            controller: 'CarbonFootprintController',
            controllerAs: 'carbonFootprintCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile ib-modals--no-padding fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };
    /*
     ** open modal ancillaries error
     */
    openAncillariesErrorModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-ancillaries-error-modal.html',
            controller: 'AncillariesErrorModalController',
            controllerAs: 'ancillariesErrorModalController',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return {modelObject};
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };
    /*
     ** open modal ancillaries error
     */
    openBundelingMoreInfoModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: true,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-bundle-more-info.html',
            controller: 'GenericModalAncillariesController',
            controllerAs: 'GenericModalAncillariesCtrl',
            windowClass: 'ib-modal ib-modals ib-modals--right ib-modals--full-mobile',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    showWaitingListInfoModal = (modelObject: any, isModalBlocked: any, template: any): any => {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + (template ? template + '.html' : 'ib-waiting-list-info-modal.html'),
            controller: 'WaitingListModalAncillariesController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };
        if (isModalBlocked) {
            modalObject.backdrop = 'static';
            modalObject.keyboard = false;
        }

        return this.$uibModal.open(modalObject);
    };

    showMoreInfoPerBundleModal = (modelObject: any): any => {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-bundle-more-info.html',
            controller: 'ModalBundelingMoreInfoController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--right ib-modals--full-mobile fade',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    };

    openUpgradingBidHowItWorksModal (modelObject: any): any {
        const modalObject: any = {
            animation: false,
            templateUrl: this.$rootScope.routes.templates + 'ib-modal-bid-how-it-works.html',
            controller: 'ModalBidHowItWorksController',
            controllerAs: 'modalCtrl',
            windowClass: 'ib-modals ib-modals--md',
            resolve: {
                object: function () {
                    return modelObject;
                }
            }
        };

        modalObject.backdrop = 'static';
        modalObject.keyboard = false;
        return this.$uibModal.open(modalObject);
    }
}

BkiModalServiceAncillaries.$inject = ['$rootScope', '$uibModal', '$uibModalStack', '$document', 'BookingAncillariesConstant'];
try {
    const mod = angular.module('ib-booking-ancillaries-module');
    mod.service(
        'BkiModalServiceAncillaries',
        BkiModalServiceAncillaries
    );
} catch (error) {
    const mod = angular.module('ib-booking-ancillaries-module', []);
    mod.service(
        'BkiModalServiceAncillaries',
        BkiModalServiceAncillaries
    );
}
