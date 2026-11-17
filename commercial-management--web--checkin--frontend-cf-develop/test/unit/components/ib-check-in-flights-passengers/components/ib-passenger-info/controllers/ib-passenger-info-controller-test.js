// @ts-nocheck
'use strict';

import { fakeCheckinAppConstants, fakeCommonsUserUtilsService, fakeFilter, fakeCheckinFlowService, fakeIbUtilsService, getMockPassengerInfo, frequentFlyer } from './ib-passenger-info-controller-mock';

jasmine.getEnv().allowRespy(true);
describe("test for module ib-passenger-info-module - controllers", () => {
    beforeEach(() => {
        angular.mock.module('ib-passenger-info-module', ($provide) => {
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('$filter', fakeFilter);
        });
    });

    describe('test for PassengerInfoController', () => {
        let PassengerInfoController;
        let $controller;
        let $rootScope;
        let $scope;
        let $injector;

        beforeEach(() => {
            inject((_$controller_, _$injector_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone;
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                PassengerInfoController = $controller(
                    'PassengerInfoController',
                    {
                        $scope: $scope,
                        CommonsUserUtilsService: fakeCommonsUserUtilsService,
                        CheckinAppConstants: fakeCheckinAppConstants,
                        CheckinFlowService: fakeCheckinFlowService,
                        IbUtilsService: fakeIbUtilsService
                    },
                    {
                        passengerInfo: getMockPassengerInfo()
                    }
                );
            });

            spyOn($scope, '$emit').and.callThrough();
        });

        beforeEach(() => {
            fakeCommonsUserUtilsService.isSoftUser.calls.reset();
            fakeCheckinFlowService.showPriorityAlertInhibit.calls.reset();
            fakeCheckinFlowService.updateApiEsta.calls.reset();
        });

        it('should be defined', () => {
            expect(PassengerInfoController).toBeDefined();
        });

        const inhibitStatusCases = [
            { result: true, reason: [fakeCheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON] },
            { result: false, reason: [fakeCheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AVIH_REASON] },
            { result: false, reason: [], status: false }
        ];

        describe('setShowInhibitBC', () => {
            fakeCommonsUserUtilsService.isSoftUser.and.returnValue(false);
            fakeCheckinFlowService.showPriorityAlertInhibit.and.returnValue(false);

            inhibitStatusCases.forEach(({ reason, result, status = true }) => {
                it(`set inhibit status to ${result} if is not a excluded reason`, () => {
                    PassengerInfoController.passengerInfo.inhibitBoardingCard = {
                        reason: reason,
                        status: status
                    }

                    PassengerInfoController.$onInit();

                    expect(PassengerInfoController.showInhibitBC).toBe(result);
                });
            });
        });

        describe('checkApisEsta', () => {
            fakeCommonsUserUtilsService.isSoftUser.and.returnValue(false);
            fakeCheckinFlowService.showPriorityAlertInhibit.and.returnValue(false);

            it('should call the updateApisEsta with the correct key', () => {
                PassengerInfoController.$onInit();

                expect(fakeCheckinFlowService.updateApiEsta).toHaveBeenCalledWith(
                    { text: 'APIS_CONFIRMATION_ALERT_BODY_1DE2\n<a>APIS_CONFIRMATION_ALERT_BODY_2DE2</a>' }
                );
            });
        });

        describe('customEvents', () => {
            const cases = [
                { functionName: 'openGenericModal', args: 'test', eventName: 'openModalNotAvailablePassengerEvent' },
                { functionName: 'checkSelectedPassengers', args: 0, eventName: 'checkSelectedPassengersEvent' }
            ];

            cases.forEach(({ args, eventName, functionName }) => {
                it(`${functionName} - should emit the custom event when call the method`, () => {
                    PassengerInfoController[functionName](args);

                    expect($scope.$emit).toHaveBeenCalledOnceWith(eventName, args);
                });
            });
        });

        describe('managePermanentLogin', () => {
            const cases = [
                { title: 'should not modify anything for non-user types', number: undefined, result: undefined, isUser: false },
                { title: 'should return unobfuscated number for user type when number not exists', number: '', result: '', isUser: true },
                { title: 'should obfuscate number for user type', number: '8438798', result: '8****98', isUser: true }
            ];

            cases.forEach(({ number, result, title, isUser }, index) => {
                it(title, () => {
                    PassengerInfoController.passengerInfo.frequentFlyer = frequentFlyer[index];
                    fakeCommonsUserUtilsService.isSoftUser.and.returnValue(isUser);

                    PassengerInfoController.managePermanentLogin(number);

                    expect(PassengerInfoController.ofuscatedNumber).toBe(result);
                });
            });
        });

        describe('inputBlurFF', () => {
            beforeEach(() => {
                spyOn($scope, '$emit');
            });

            it('should not trigger any event when event is undefined', () => {
                const fakeEvent = { 
                    target: {
                            id: '',
                            value: ''
                        }
                };

                PassengerInfoController.inputBlurFF(fakeEvent, 0,true);

                expect($scope.$emit).not.toHaveBeenCalled();
            });

            const cases = [
                { 
                    title: 'should trigger event with valid data when data passes validation', 
                    passengerNumber: 0, 
                    eventId: 'card_number_passenger_0',
                    shouldEmit: true
                },
                { 
                    title: 'should not trigger event when validation fails', 
                    passengerNumber: null, 
                    eventId: '',
                    shouldEmit: false
                }
            ];

            cases.forEach(({ title, passengerNumber, eventId, shouldEmit }) => {
                it(title, () => {
                    const fakeEvent = {
                        target: {
                            value: '12345',
                            id: eventId
                        }
                    };

                    let expectedData = null;

                    if (shouldEmit) {
                        const mockPassengerInfo = getMockPassengerInfo(1);
                        PassengerInfoController.passengerInfo = mockPassengerInfo;

                        expectedData = {
                            index: passengerNumber,
                            id: mockPassengerInfo.id,
                            idTag: eventId
                        };

                        PassengerInfoController.inputBlurFF(fakeEvent, passengerNumber, true);
                        expect($scope.$emit).toHaveBeenCalledWith('inputBlurFFEvent', expectedData);
                    } else {
                        PassengerInfoController.inputBlurFF(fakeEvent, passengerNumber, false);
                        expect($scope.$emit).not.toHaveBeenCalled();
                    }
                });
            });

        });

        describe('handleModalSBY', () => {
            it('should set the openModal true if the function is called', () => {
                const eventMock = {
                    preventDefault: jasmine.createSpy('preventDefault')
                };

                expect(PassengerInfoController.showAlertSBY.openModal).toBe(false);

                PassengerInfoController.handleModalSBY(eventMock);

                expect(eventMock.preventDefault).toHaveBeenCalled();
                expect(PassengerInfoController.showAlertSBY.openModal).toBe(true);
            });
        });

        describe('checkSBY', () => {
            it('should set the status to true if the passenger has SBY status', () => {
                PassengerInfoController.passengerInfo.inhibitBoardingCard.status = false;
                PassengerInfoController.passengerInfo.pasStatus.hasSBY = true;

                PassengerInfoController.$onInit();

                expect(PassengerInfoController.showAlertSBY.status).toBe(true);
            });

            it('should don\'t set the sby status true if the passenger had inhibitBoardingCard', () => {
                PassengerInfoController.passengerInfo.pasStatus.hasSBY = true;

                PassengerInfoController.$onInit();

                expect(PassengerInfoController.showAlertSBY.status).toBe(false);
            });

            it('should don\'t set the sby status true if the passenger not had sby status', () => {
                PassengerInfoController.passengerInfo.inhibitBoardingCard.status = false;
                PassengerInfoController.passengerInfo.pasStatus.hasSBY = false;

                PassengerInfoController.$onInit();

                expect(PassengerInfoController.showAlertSBY.status).toBe(false);
            });
        });

        describe('clearCodeNumber', () => {
            it('should update previousCompanySelection if ofusCase is false', () => {
                PassengerInfoController.passengerInfo = {
                    frequentFlyer: {
                        info: {
                            iataCompanyCode: 'IB'
                        }
                    }
                };

                const initialValue = PassengerInfoController.previousCompanySelection;

                PassengerInfoController.clearCodeNumber();

                expect(initialValue).toBe(null);
                expect(PassengerInfoController.previousCompanySelection).toBe('IB');
            });

            it('should set ofuscatedNumber and number to null if is ofusCase', () => {
                PassengerInfoController.passengerInfo = {
                    frequentFlyer: {
                        info: {
                            number: '12345'
                        }
                    }
                };

                PassengerInfoController.clearCodeNumber(true);

                expect(PassengerInfoController.ofuscatedNumber).toBe(null);
                expect(PassengerInfoController.passengerInfo.frequentFlyer.info.number).toBe(null);
            });
        });


        describe('checkErrorsInput', () => {
            const fieldName = 'card_number_passenger_0';

            function createForm({ submitted = false, invalid = false, duplicate = false } = {}) {
                return {
                    $submitted: submitted,
                    [fieldName]: {
                        $invalid: invalid,
                        $error: {
                            duplicateCompanyAndNumber: duplicate
                        }
                    }
                };
            }

            it('should return false when the field does not exist', () => {
                PassengerInfoController.pasForm = {
                    $submitted: false
                };

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(false);
            });

            it('should return false when form is not submitted and field is valid', () => {
                PassengerInfoController.pasForm = createForm({
                    submitted: false,
                    invalid: false,
                    duplicate: false
                });

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(false);
            });

            it('should return false when form is not submitted and error is not duplicateCompanyAndNumber', () => {
                PassengerInfoController.pasForm = createForm({
                    submitted: false,
                    invalid: true,
                    duplicate: false
                });

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(false);
            });

            it('should return true reactively when duplicateCompanyAndNumber error exists', () => {
                PassengerInfoController.pasForm = createForm({
                    submitted: false,
                    invalid: true,
                    duplicate: true
                });

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(true);
            });

            it('should return true when form was submitted and field is invalid', () => {
                PassengerInfoController.pasForm = createForm({
                    submitted: true,
                    invalid: true,
                    duplicate: false
                });

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(true);
            });

            it('should return false when form was submitted but field is valid', () => {
                PassengerInfoController.pasForm = createForm({
                    submitted: true,
                    invalid: false,
                    duplicate: false
                });

                const result = PassengerInfoController.checkErrorsInput(0);

                expect(result).toBe(false);
            });
        });

    });
});
