describe('PassengersContactDataController', function () {
    var $controller, $rootScope, $scope, localStorageService, controller;

    var fakeFlightsPassengersUtils = {
        initModelApisUsTracing: jasmine.createSpy('initModelApisUsTracing').and.callFake(function () {
            return {
                show: false,
                CHECK_US_PRIVACY_ACT_STATEMENT: 'CHECK_US_PRIVACY_ACT_STATEMENT',
                checkPrivacyText: ''
            };
        }),
        checkExistAPIsUsTracing: jasmine.createSpy('checkExistAPIsUsTracing').and.callFake(function () {
            return {
                show: false,
                CHECK_US_PRIVACY_ACT_STATEMENT: 'CHECK_US_PRIVACY_ACT_STATEMENT',
                checkPrivacyText: ''
            };
        })
    };

    var fakeCheckinAppConstants = {};

    var passengers = {
        "id": null,
        "infantInfo": null,
        "showContactData": true,
        "view": {
            "showOptions": false,
            "showInTransit": false,
            "showInTransitForAll": false,
            "errorList": []
        },
        "travelInfo": false,
        "basicInfo": {
            "showName": "BEBE",
            "name": "BEBE",
            "showSurname": "MARINO",
            "surname": "MARINO",
            "gender": "MALE",
            "birthDate": {
                "day": "01",
                "month": "01",
                "year": "2020"
            },
            "type": "INFANT",
            "nationality": "ES",
            "isInfant": true
        },
        "boardingCard": true,
        "status": {
            "code": "",
            "reason": null
        },
        "formStatus": "WARNING",
        "requiredFields": [
            "SURNAME",
            "NAME",
            "GENDER",
            "BIRTH_DATE",
            "NATIONALITY",
            "HOME_COUNTRY",
            "DESTINATION_ADDRESS",
            "DESTINATION_CITY",
            "DESTINATION_STATE",
            "DESTINATION_ZIP",
            "DESTINATION_COUNTRY"
        ],
        "mandatoryDocuments": {
            "nationality": "ES",
            "isMandatory": true,
            "documents": [
                {
                    "type": {
                        "code": "PSPT",
                        "description": "Pasaporte"
                    },
                    "requiredFields": [
                        "NUM_DOC",
                        "EXPIRY_DOC",
                        "CNTRY_DOC"
                    ],
                    "requiredFieldsOptions": [],
                    "isSaved": false,
                    "$$hashKey": "object:5864"
                }
            ],
            "selectedDoc": {
                "type": {
                    "code": "PSPT",
                    "description": "Pasaporte"
                },
                "requiredFields": [
                    "NUM_DOC",
                    "EXPIRY_DOC",
                    "CNTRY_DOC"
                ],
                "requiredFieldsOptions": [],
                "isSaved": false,
                "$$hashKey": "object:5864"
            }
        },
        "optionalDocuments": {
            "nationality": "ES",
            "isMandatory": false,
            "documents": [
                {
                    "type": {
                        "description": "Selecciona una opción",
                        "code": "CKI_COMBO_BLANK"
                    },
                    "$$hashKey": "object:6646"
                },
                {
                    "type": {
                        "code": "GREENCARD",
                        "description": "Cartilla verde americana"
                    },
                    "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC",
                        "EXPIRY_DOC"
                    ],
                    "requiredFieldsOptions": [],
                    "issuerCountry": "US",
                    "isSaved": false,
                    "$$hashKey": "object:6647"
                },
                {
                    "type": {
                        "code": "REDRESSNUMBER",
                        "description": "Passenger Redress Number"
                    },
                    "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC"
                    ],
                    "requiredFieldsOptions": [
                        {
                            "field": "CNTRY_DOC",
                            "values": [
                                "US"
                            ]
                        }
                    ],
                    "issuerCountry": "US",
                    "isSaved": false,
                    "$$hashKey": "object:6648"
                },
                {
                    "type": {
                        "code": "OTHERS",
                        "description": "Otros documentos"
                    },
                    "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC",
                        "EXPIRY_DOC"
                    ],
                    "requiredFieldsOptions": [],
                    "isSaved": false,
                    "$$hashKey": "object:6649"
                },
                {
                    "type": {
                        "code": "KNOWNTRAVELERNUMBER",
                        "description": "Known traveller ID"
                    },
                    "requiredFields": [
                        "NUM_DOC",
                        "CNTRY_DOC"
                    ],
                    "requiredFieldsOptions": [
                        {
                            "field": "CNTRY_DOC",
                            "values": [
                                "US"
                            ]
                        }
                    ],
                    "issuerCountry": "US",
                    "isSaved": false,
                    "$$hashKey": "object:6650"
                }
            ]
        },
        "visaDocument": {
            "isMandatory": false,
            "type": {
                "code": "VISA",
                "description": "Visado"
            },
            "requiredFields": [
                "EXPIRY_DOC",
                "NUM_DOC",
                "CNTRY_DOC"
            ],
            "requiredFieldsOptions": [],
            "isSaved": false
        },
        "relatedParentId": "2",
        "$$hashKey": "object:148"
    };

    const fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy('isUserLogged')
    };

    beforeEach(function() {
        angular.mock.module('ib-passengers-contact-data-module', 'LocalStorageModule', function($provide) {
            $provide.value('FlightsPassengersUtils', fakeFlightsPassengersUtils);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });

        inject(function (_$controller_, _$rootScope_, _localStorageService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $controller('PassengersContactDataController', {
                $scope: $scope,
                $rootScope: $rootScope
            });

            controller.passengers = passengers;
        });
    });

    describe('when activate() is called', function() {
        it('call', function() {
            fakeIbSessionConfigService.isUserLogged.and.returnValue(true);

            controller.$onInit();

            expect(controller.isUserLogged).toBe(true);
            expect(fakeFlightsPassengersUtils.initModelApisUsTracing).toHaveBeenCalled();
            expect(fakeFlightsPassengersUtils.checkExistAPIsUsTracing).toHaveBeenCalledWith(jasmine.any(Object), false);
        });
    });
});