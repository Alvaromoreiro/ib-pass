describe('MmBModalService', () => {
    var MmBModalService, uibmodal, uibModalStack, $timeout, $q;
    var MmBAppConstants = { 'templatesRoute': 'web-manage-my-booking/templates/' }
    var fakeModal = {
        result: {
            confirmCallback:({})=>{},
            cancelCallback:({})=>{},
            then: () => {}
        },
        close: function (item) {
            this.result.confirmCallback(item);
        },
        dismiss: function (type) {
            this.result.cancelCallback(type);
        }
    };
    var fakeRoute = {
        'reload' : jasmine.createSpy()
    }


    beforeEach(() => {
        angular.mock.module('ib-MmB-modal-module', 'ui.bootstrap', function ($provide) {
            $provide.value('MmBAppConstants', MmBAppConstants);
            $provide.value('$route', fakeRoute);

        });
        inject(function (_MmBModalService_, $uibModal, $uibModalStack, _$timeout_, _$q_) {
            uibmodal = $uibModal;
            uibModalStack = $uibModalStack;
            MmBModalService = _MmBModalService_;
            $timeout = _$timeout_;
            $q = _$q_;
        });
    });

    describe('when showGenericError is called', () => {

        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        xit('and is not a blocked modal and no template is provided, not blocked modal instance with default template should be returned', (done) => {
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + 'generic-error-modal.html',
                controller: 'MmBGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    errorObject: jasmine.any(Function)
                }
            };
            var returnedInstance = MmBModalService.showGenericError({});
            expect(uibmodal.open).toHaveBeenCalledWith(modalErrorObject);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });

        it('and is a blocked modal and template is provided, blocked modal instance with provided template should be returned', (done) => {
            var template = 'test';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    errorObject: jasmine.any(Function)
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showGenericError({}, true, template);
            expect(uibmodal.open).toHaveBeenCalledWith(modalErrorObject);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showGenericModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('and is a blocked modal and template is provided, blocked modal instance with provided template should be returned', (done) => {
            var template = 'test';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBGenericModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                showCloseButton: true,
                resolve: {
                    object: jasmine.any(Function)
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showGenericModal(true, template, {showCloseButton: true});
            expect(uibmodal.open).toHaveBeenCalledWith(modalErrorObject);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('When showWaitingModal is called', () => {

        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        xit('and waiting Modal Instance does not exist, new waiting modal should be opened', (done) => {
            var waitModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + 'generic-wait-modal.html',
                size: 'loading',
                backdrop: 'static',
                keyboard: false,
                windowClass: 'ib-modals ib-modals--loading',
                controller: 'MmBGenericModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: jasmine.any(Function)
                }
            }
            MmBModalService.waitingModalInstance = {
                'opened': jasmine.createSpy('opened').and.callFake(() => {
                    return {
                        result: $q.when()
                    };
                })
            };
            MmBModalService.showWaitingModal();
            expect(uibmodal.open).toHaveBeenCalledWith(waitModalObject);
            expect(MmBModalService.openningLoading).toEqual(false);
            done();
        });

        it('and waiting Modal Instance exists, existing waiting modal should assigned', (done) => {
            MmBModalService.waitingModalInstance = {close: jasmine.createSpy()}
            MmBModalService.openningLoading = 'test';
            MmBModalService.showWaitingModal();
            // $timeout.flush();
            expect(MmBModalService.openningLoading).toEqual(true);
            done();
        });
    });

    describe('When finishWaiting is called', () => {
        it('and waitingModalInstance exists, waitingModalInstance close and openning is false should be called and waitingModalInstance should be null', (done) => {
            spyOn(fakeModal, 'close');
            MmBModalService.waitingModalInstance = {close: jasmine.createSpy()};
            MmBModalService.openningLoading = false;
            MmBModalService.finishWaiting();
            // expect(fakeModal.close).toHaveBeenCalled();
            expect(MmBModalService.waitingModalInstance).toEqual(null);
            done();
        });

        it('and waitingModalInstance exists, waitingModalInstance close and openning is true should be called and waitingModalInstance should be null', (done) => {
            spyOn(fakeModal, 'close');
            MmBModalService.waitingModalInstance = {close: jasmine.createSpy()};
            MmBModalService.openningLoading = true;
            MmBModalService.finishWaiting();
            $timeout.flush();
            // expect(fakeModal.close).toHaveBeenCalled();
            expect(MmBModalService.waitingModalInstance).toEqual(null);
            done();
        });
    });

    describe('When closeAllCurrentModals is called', () => {
        it('$uibModalStack.dismissAll() should be called', (done) => {
            spyOn(uibModalStack, 'dismissAll');
            MmBModalService.closeAllCurrentModals();
            expect(uibModalStack.dismissAll).toHaveBeenCalled();
            done();
        });
    });

    describe('when showLoginModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('show login modal', (done) => {
            var template = 'ib-modal-user-logued.html';
            var classes = 'ib-modals ib-modals--right ib-modals--logued fade';
            var loginModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmBGenericModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return loginModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showLoginModal(template, loginModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when isError is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));

        it('show error modal', (done) => {
            var template = 'ib-generic-error-modal.html';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBGenericErrorModalController',
                controllerAs: 'modalCtrl',
                size: 'md',
                windowClass: 'ib-modals',
                resolve: {
                    object: () => { return modalErrorObject; }
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.isError({}, true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showModalError is called', () => {
        it('call to showGenericModal', (done) => {
            var data = {
                isModalBlocked: true,
                template: 'ib-modal-error.html',
                modelObject: {},
                windowClass: 'ib-modals ib-modals--md'
            };
            MmBModalService.showModalError({}, data);
            done();
        });
    });

    describe('when showLoginErrorModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an login error modal', (done) => {
            var template = 'ib-generic-error-modal.html';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBGenericErrorModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: () => { return modalErrorObject; }
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showLoginErrorModal({}, true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when tryAgain is called', () => {
        it('shows an alert and reload page', (done) => {
            MmBModalService.tryAgain();
            done();
        });
    });

    describe('when showGenericInfoModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show generic info modal', (done) => {
            var template = 'generic-info-modal.html';
            var classes = 'ib-modals ib-modals--md';
            var genericInfoModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmBGenericModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return genericInfoModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showGenericInfoModal(template, genericInfoModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showFlightReminderModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show a flight reminder modal', (done) => {
            var template = 'generic-complete-modal.html';
            var classes = 'ib-modals ib-modals--md';
            var flightReminderModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmBFlightReminderModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return flightReminderModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showFlightReminderModal(template, flightReminderModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showPassengerModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show a flight reminder modal', (done) => {
            var template = 'generic-complete-modal.html';
            var classes = 'ib-modals ib-modals--md';
            var passengerModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmBPassengerModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return passengerModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showPassengerModal(template, passengerModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showInvoiceRequestModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show invoice request modal', (done) => {
            var template = 'ib-MmB-modal-invoice-request.html';
            var classes = 'ib-modals ib-modals--md';
            var invoiceRequestModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmBModalInvoiceRequestController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return invoiceRequestModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showInvoiceRequestModal(template, invoiceRequestModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showRefundContinueModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show a flight reminder modal', (done) => {
            var template = 'generic-complete-modal.html';
            var classes = 'ib-modals ib-modals--md';
            var refundContinueModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmbRefundContinueModalController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return refundContinueModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showRefundContinueModal(template, refundContinueModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showVoluntaryChangeModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show a flight reminder modal', (done) => {
            var template = 'ib-MmB-voluntary-changes-view.html';
            var classes = 'ib-modals-full';
            var voluntaryChangeModalObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                windowClass: classes,
                controller: 'MmbVoluntaryChangesController',
                controllerAs:'modalCtrl',
                resolve: {
                    object: () => { return voluntaryChangeModalObject; }
                }
            };
            var returnedInstance = MmBModalService.showVoluntaryChangeModal(template, voluntaryChangeModalObject, false, classes);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });


    describe('when showWidgetModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an showWidgetModal', (done) => {
            var template = 'ib-show-widget-modal.html';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBWidgetModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: () => { return modalErrorObject; }
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showWidgetModal({}, true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showBookingNameModal  is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an showBookingNameModal ', (done) => {
            var template = 'ib-chktrp-modal-name.html';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'BookingNameModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: () => { return modalErrorObject; }
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showBookingNameModal({});
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });
    describe('when showTransferWidgetModal  is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an showTransferWidgetModal ', (done) => {
            var template = 'ib-show-transfer-widget-modal.html';
            var modalErrorObject = {
                animation: false,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBTransferWidgetModalController',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: () => { return modalErrorObject; }
                },
                backdrop: 'static',
                keyboard: false
            };
            var returnedInstance = MmBModalService.showTransferWidgetModal({}, true, template);
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when closeModal  is called', () => {
        it('show an closeModal ', (done) => {
            MmBModalService.closeModal();
            done();
        });
    });

    describe('when getErrorCode  is called', () => {
        it('show an getErrorCode ', (done) => {
            MmBModalService.getErrorCode();
            done();
        });
    });

    describe('when setErrorCode  is called', () => {
        it('show an setErrorCode ', (done) => {
            MmBModalService.setErrorCode();
            done();
        });
    });
    describe('when setErrorMessage  is called', () => {
        it('show an setErrorMessage', (done) => {
            MmBModalService.setErrorMessage();
            done();
        });
    });
    describe('when showFullModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an showFullModal ', (done) => {
            var template = 'ib-show-transfer-widget-modal.html';
            var modalErrorObject = {
                animation: true,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'fullModalCtrl',
                controllerAs: 'modalCtrl',
                windowClass: 'ib-modals-full',
                resolve: {
                    object: () => { return modalErrorObject; }
                }
            };
            var returnedInstance = MmBModalService.showFullModal(true, template, {});
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });

    describe('when showEmptyBasketModal is called', () => {
        beforeEach(inject(() => {
            spyOn(uibmodal, 'open').and.returnValue(fakeModal);
        }));
        it('show an showEmptyBasketModal ', (done) => {
            var template = 'ib-modal-empty-basket.html';
            var modalErrorObject = {
                animation: true,
                templateUrl: MmBAppConstants.templatesRoute + template,
                controller: 'MmBDeleteBasketModalController',
                controllerAs: 'MmBDeleteBasketModalCtrl',
                windowClass: 'ib-modals ib-modals--md',
                resolve: {
                    object: () => { return modalErrorObject; }
                }
            };
            var returnedInstance = MmBModalService.showEmptyBasketModal();
            expect(returnedInstance).toEqual(fakeModal);
            done();
        });
    });


});
