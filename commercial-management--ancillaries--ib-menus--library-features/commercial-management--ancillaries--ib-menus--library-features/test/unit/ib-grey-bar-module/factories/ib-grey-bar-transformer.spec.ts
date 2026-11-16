// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-grey-bar-module - factories', function () {
    const fakeCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy('isIbZero').and.returnValue(true),
        isSoftUser: jasmine.createSpy('isSoftUser')
    };

    beforeEach(function () {
        angular.mock.module('ib-web-menus-module', ($provide) => {
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
        });
    });

    describe('test for ibGreyBarTransformer', function () {
        var ibGreyBarTransformer;
        var $window;
        var NewMainHeaderConstants;
        var $injector;

        beforeEach(function () {
            inject(function (_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key];
                    return clone;
                }, {});
                $window = $injector.get('$window');
                NewMainHeaderConstants = $injector.get('NewMainHeaderConstants');
                ibGreyBarTransformer = $injector.get('ibGreyBarTransformer');
            });
        });

        it('ibGreyBarTransformer should be defined', function () {
            expect(ibGreyBarTransformer).toBeDefined();
        });

        it('test for ibGreyBarTransformer.initGreyBar', function () {
            var model = {
                onLogin: jasmine.createSpy('function1'),
                onError: jasmine.createSpy('function2'),
                afterLogin: jasmine.createSpy('function3'),
                userLogged: false
            };
            var object1 = {
                suffixSymbol: true,
                decimalSeparator: ',',
                code: 'EUR',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '€',
                description: 'Euro',
                symbol: '€',
                recommendedDisplay: 'symbol'
            };
            var ret = ibGreyBarTransformer.initGreyBar(model, object1);

            expect(ibGreyBarTransformer.initGreyBar).toBeDefined();
        });

        it('test for ibGreyBarTransformer.updateLoggedData', function () {
            var customerData = {
                generalInfo: {
                    name: 'IBERIA',
                    surname: 'TEST UNO TEST DOS',
                    ibPlusNumber: '35981927',
                    category: 'CLASICA',
                    avios: 0,
                    pinStatus: '0',
                    lockStatus: 'AC',
                    loginAttempts: 0,
                    hasElectronicId: false,
                    secretQuestionCode: '1',
                    program: 'IBPLUS',
                    aviosTransformed: '0'
                },
                personalInfo: {
                    ibPlusNumber: '35981927',
                    name: 'IBERIA',
                    surname1: 'TEST UNO',
                    surname2: 'TEST DOS',
                    documentType: '04',
                    documentId: '66298903T',
                    nationality: 'ES',
                    gender: '1',
                    genderWebCode: '2',
                    birthDate: '1976-04-01',
                    maritalStatus: '1',
                    contactPhone: '619666666',
                    contactPrefix: '34',
                    contactEmail: 'iacisclo@autentia.com',
                    language: '4',
                    languageWebCode: 'es',
                    communicationLanguage: '4',
                    communicationLanguageWebCode: 'es',
                    communicationPreference: '1',
                    residence: {
                        address: 'C/ALBARRACIN',
                        number: '25',
                        addressExtra: '',
                        numberExtra: 'C-107',
                        postalCode: '28037',
                        town: 'MADRID',
                        region: '',
                        country: 'ES',
                        phone: '912148103',
                        fax: '',
                        state: '28'
                    },
                    alarms: [
                        {
                            number: 5,
                            params: ['TARJETA DE PRUEBAS', '07/11/2006']
                        },
                        {
                            number: 11,
                            params: ['DUMBO', '62', 'DUMBO62']
                        }
                    ],
                    socialNetworks: [],
                    status: {
                        lastModifiedDate: '2020-06-09',
                        creationDate: '2006-10-05',
                        deleted: false
                    },
                    childrensBirthday: [],
                    childrenNumber: 0
                },
                company: {
                    ibPlusNumber: '35981927',
                    profession: '126',
                    professionWebCode: '26',
                    position: '42',
                    positionWebCode: '42',
                    economicActivity: '37',
                    companyId: '1231231',
                    companyName: 'ATOS ORIGIN',
                    location: {
                        address: 'C/ALBARRACIN',
                        number: '25',
                        addressExtra: '',
                        numberExtra: 'A-110',
                        postalCode: '28037',
                        town: 'MADRID',
                        region: '',
                        country: 'ES',
                        phone: '1111111111',
                        fax: '',
                        state: '28'
                    },
                    status: {
                        lastModifiedDate: '2020-06-09'
                    }
                },
                loyaltyCard: {
                    ibPlusNumber: '35981927',
                    category: 'CLASICA',
                    oneWorldCategory: '',
                    plasticType: 'STANDARD',
                    name: 'TEST UNO TEST DOS IBERIA',
                    issuer: '001',
                    creationDate: '2006-10-05',
                    expirationDate: '9999-12-31',
                    lastUseDate: '2010-03-03',
                    ageGroup: '03',
                    ageIndicator: 'ADU',
                    isCompanion: false,
                    isSingular: false,
                    importance: 40,
                    status: {
                        lastModifiedDate: '2020-03-27'
                    }
                },
                points: {
                    ibPlusNumber: '35981927',
                    totals: {
                        balance: 0,
                        expiring: 0,
                        expirationDate: null,
                        expirationPolicy: 'T',
                        numberOfFlights: 0,
                        fromCredits: 200000,
                        fromDebits: 200000,
                        totalElite: 0,
                        historicElite: 0,
                        historicNumberOfFlights: 0,
                        ibHistoricNumberOfFlights: 0
                    },
                    levelUpgrade: {
                        nextCategory: '5',
                        levelKeeping: 0,
                        levelUpgrade: 1100,
                        numberOfFlightsForKeeping: 0,
                        ibNumberOfFlightsForKeeping: 0,
                        numberOfFlightsForUpgrading: 25,
                        ibNumberOfFlightsForUpgrading: 1,
                        platino1Keeping: 0,
                        platino2Keeping: 0,
                        platino10Keeping: 0,
                        numberOfPlatino10Years: 0,
                        levelDate: '2019-04-12',
                        nextLevelDate: '2020-03-31',
                        eliteCountingBeginDate: '2019-04-01',
                        eliteCountingEndDate: '2020-03-31',
                        elite1CountingEndDate: null,
                        platinoYear: 0,
                        elitePlatinoGoal: 0
                    },
                    clientAccount: {
                        balances: [
                            {
                                year: 2010,
                                balance: 0,
                                expirationDate: '9999-12-31'
                            },
                            {
                                year: 2020,
                                balance: 0,
                                expirationDate: '9999-12-31'
                            }
                        ]
                    }
                },
                beneficiaries: {
                    ibPlusNumber: '35981927',
                    beneficiaries: [
                        {
                            name: 'UNO',
                            surname1: 'CUALQUIERA',
                            surname2: 'A',
                            birthDate: '1985-01-01',
                            relationship: '1',
                            relationshipDescription: 'Conyuge',
                            document: {
                                type: '04',
                                typeDescription: 'DNI español (incl.letra)',
                                number: '112312312'
                            },
                            frequentFlyer: {
                                airline: '-1',
                                number: null
                            },
                            title: 0,
                            beneficiaryNumber: 1,
                            relationshipWebCode: '0'
                        }
                    ]
                },
                largeFamilyInfo: {
                    category: null,
                    docNumber: null,
                    zipCode: null
                },
                residentInfo: {
                    area: -1,
                    municipalityCode: null,
                    certificateNumber: null
                },
                completeProfile: true
            };
            var ret = ibGreyBarTransformer.updateLoggedData(customerData);

            expect(ibGreyBarTransformer.updateLoggedData).toBeDefined();
        });

        it('isSoftUser should return false if the service don\'t return nothing', () => {
            fakeCommonsUserUtilsService.isSoftUser.and.returnValue(undefined);
            const result = ibGreyBarTransformer.isSoftUser();

            expect(result).toBe(false);
        });

        it('isSoftUser should return the result that return the service', () => {
            fakeCommonsUserUtilsService.isSoftUser.and.returnValue(true);

            const result = ibGreyBarTransformer.isSoftUser();

            expect(result).toBe(true);
        });


        describe('buildLoginHandlers method tests', function () {
            it('should return handlers with provided functions', function () {
                var onLoginSpy = jasmine.createSpy('onLogin');
                var afterLoginSpy = jasmine.createSpy('afterLogin');
                var onErrorSpy = jasmine.createSpy('onError');

                var model = {
                    onLogin: onLoginSpy,
                    afterLogin: afterLoginSpy,
                    onError: onErrorSpy
                };

                var result = ibGreyBarTransformer.buildLoginHandlers(model);

                expect(result.onLogin).toBe(onLoginSpy);
                expect(result.afterLogin).toBe(afterLoginSpy);
                expect(result.onError).toBe(onErrorSpy);
            });

            it('should use reload as fallback when onLogin is not provided', function () {
                var afterLoginSpy = jasmine.createSpy('afterLogin');
                var onErrorSpy = jasmine.createSpy('onError');

                var model = {
                    afterLogin: afterLoginSpy,
                    onError: onErrorSpy
                };

                var result = ibGreyBarTransformer.buildLoginHandlers(model);

                expect(result.onLogin).toBe($window.location.reload);
            });

            it('should use reload as fallback for all handlers when model is empty', function () {
                var model = {};

                var result = ibGreyBarTransformer.buildLoginHandlers(model);

                expect(result.onLogin).toBe($window.location.reload);
                expect(result.afterLogin).toBe($window.location.reload);
                expect(result.onError).toBe($window.location.reload);
            });
        });

        describe('buildLoggedState method tests', function () {
            it('should return logged out state when loggedData is null', function () {
                var model = {
                    loggedData: null
                };

                var result = ibGreyBarTransformer.buildLoggedState(model, false);

                expect(result.isLogged).toBe(false);
                expect(result.loggedData).toEqual({});
            });

            it('should return logged out state when user is soft user', function () {
                var model = {
                    loggedData: {
                        name: 'Test User'
                    }
                };

                var result = ibGreyBarTransformer.buildLoggedState(model, true);

                expect(result.isLogged).toBe(false);
                expect(result.loggedData).toEqual({});
            });

            it('should return logged in state with updated data when user is not soft user and has loggedData', function () {
                fakeCommonsUserUtilsService.isIbZero.and.returnValue(false);
                fakeCommonsUserUtilsService.isSoftUser.and.returnValue(false);

                var customerData = {
                    personalInfo: {
                        name: 'John',
                        contactEmail: 'john@example.com',
                        surname1: 'Doe'
                    },
                    generalInfo: {
                        avios: 1000,
                        aviosTransformed: '1,000'
                    }
                };

                var model = {
                    loggedData: customerData
                };

                var result = ibGreyBarTransformer.buildLoggedState(model, false);

                expect(result.isLogged).toBe(true);
                expect(result.loggedData).toBeDefined();
                expect(result.loggedData.isLogged).toBe(true);
            });
        });

        describe('isOnbUser method tests', function () {
            it('should return false when user is soft user', function () {
                var userLogged = NewMainHeaderConstants.LOGIN_TYPES.ONB;

                var result = ibGreyBarTransformer.isOnbUser(userLogged, true);

                expect(result).toBe(false);
            });

            it('should return true when user is ONB and not soft user', function () {
                var userLogged = NewMainHeaderConstants.LOGIN_TYPES.ONB;

                var result = ibGreyBarTransformer.isOnbUser(userLogged, false);

                expect(result).toBe(true);
            });

            it('should return false when user is not ONB even if not soft user', function () {
                var userLogged = 'REGULAR_LOGIN';

                var result = ibGreyBarTransformer.isOnbUser(userLogged, false);

                expect(result).toBe(false);
            });

            it('should return false when user is null', function () {
                var result = ibGreyBarTransformer.isOnbUser(null, false);

                expect(result).toBe(false);
            });
        });

        describe('resolveShow method tests', function () {
            it('should return true when show is true', function () {
                var result = ibGreyBarTransformer.resolveShow(true);

                expect(result).toBe(true);
            });

            it('should return false when show is false', function () {
                var result = ibGreyBarTransformer.resolveShow(false);

                expect(result).toBe(false);
            });

            it('should return true as default when show is not boolean', function () {
                var result = ibGreyBarTransformer.resolveShow(undefined);

                expect(result).toBe(true);
            });

            it('should return true as default when show is null', function () {
                var result = ibGreyBarTransformer.resolveShow(null);

                expect(result).toBe(true);
            });

            it('should return true as default when show is string', function () {
                var result = ibGreyBarTransformer.resolveShow('visible');

                expect(result).toBe(true);
            });
        });

        describe('hasAviosValue method tests', function () {
            it('should return true when avios has value', function () {
                var generalInfo = {
                    avios: 1000
                };

                var result = Boolean(ibGreyBarTransformer.hasAviosValue(generalInfo));

                expect(result).toBe(true);
            });

            it('should return true when avios is 0', function () {
                var generalInfo = {
                    avios: 0
                };

                var result = Boolean(ibGreyBarTransformer.hasAviosValue(generalInfo));

                expect(result).toBe(true);
            });

            it('should return false when avios is null', function () {
                var generalInfo = {
                    avios: null
                };

                var result = Boolean(ibGreyBarTransformer.hasAviosValue(generalInfo));

                expect(result).toBe(false);
            });

            it('should return false when avios is undefined', function () {
                var generalInfo = {};

                var result = ibGreyBarTransformer.hasAviosValue(generalInfo);

                expect(result).toBe(false);
            });
        });

        describe('ensureAviosTransformed method tests', function () {
            it('should not transform avios when hasAviosValue returns false', function () {
                var generalInfo = {
                    avios: null
                };

                ibGreyBarTransformer.ensureAviosTransformed(generalInfo);

                expect(generalInfo.aviosTransformed).toBeUndefined();
            });

            it('should not transform avios when already transformed', function () {
                var generalInfo = {
                    avios: 1000,
                    aviosTransformed: '1,000'
                };

                var originalTransformed = generalInfo.aviosTransformed;
                ibGreyBarTransformer.ensureAviosTransformed(generalInfo);

                expect(generalInfo.aviosTransformed).toBe(originalTransformed);
            });

            it('should transform avios when has value and not yet transformed', function () {
                var generalInfo = {
                    avios: 1500
                };

                ibGreyBarTransformer.ensureAviosTransformed(generalInfo);

                expect(generalInfo.aviosTransformed).toBe('1500');
            });

            it('should transform avios 0 when has zero value and not yet transformed', function () {
                var generalInfo = {
                    avios: 0
                };

                ibGreyBarTransformer.ensureAviosTransformed(generalInfo);

                expect(generalInfo.aviosTransformed).toBe('0');
            });
        });

        describe('mapPersonalInfoToLoggedData method tests', function () {
            // Data-driven test cases - Elimina duplicación de estructura
            var personalInfoTestCases = [
                {
                    description: 'should map personal info to logged data correctly',
                    isSoftUser: false,
                    isIbZero: false,
                    input: { name: 'John', contactEmail: 'john@example.com', surname1: 'Doe', avios: '1,500' },
                    expectedName: 'John',
                    expectedSurname: 'Doe',
                    expectedAvios: '1,500'
                },
                {
                    description: 'should use contactEmail when name is not provided',
                    isSoftUser: false,
                    isIbZero: false,
                    input: { name: null, contactEmail: 'john@example.com', surname1: 'Doe', avios: '1,500' },
                    expectedName: 'john@example.com',
                    expectedSurname: 'Doe',
                    expectedAvios: '1,500'
                },
                {
                    description: 'should return null surname when user is soft user',
                    isSoftUser: true,
                    isIbZero: false,
                    input: { name: 'John', contactEmail: 'john@example.com', surname1: 'Doe', avios: '1,500' },
                    expectedName: 'John',
                    expectedSurname: null,
                    expectedAvios: '1,500'
                },
                {
                    description: 'should return null avios when user is IbZero',
                    isSoftUser: false,
                    isIbZero: true,
                    input: { name: 'John', contactEmail: 'john@example.com', surname1: 'Doe', avios: '1,500' },
                    expectedName: 'John',
                    expectedSurname: 'Doe',
                    expectedAvios: null
                }
            ];

            personalInfoTestCases.forEach(function (testCase) {
                it(testCase.description, function () {
                    fakeCommonsUserUtilsService.isSoftUser.and.returnValue(testCase.isSoftUser);
                    fakeCommonsUserUtilsService.isIbZero.and.returnValue(testCase.isIbZero);

                    var customerData = {
                        personalInfo: {
                            name: testCase.input.name,
                            contactEmail: testCase.input.contactEmail,
                            surname1: testCase.input.surname1
                        },
                        generalInfo: {
                            aviosTransformed: testCase.input.avios
                        }
                    };

                    var result = ibGreyBarTransformer.mapPersonalInfoToLoggedData(customerData);

                    expect(result.name).toBe(testCase.expectedName);
                    expect(result.surname).toBe(testCase.expectedSurname);
                    expect(result.avios).toBe(testCase.expectedAvios);
                    expect(result.isLogged).toBe(true);
                });
            });
        });

        describe('mapUserInfoToLoggedData method tests', function () {
            // Data-driven test cases - Elimina duplicación de estructura
            var userInfoTestCases = [
                {
                    description: 'should map user info to logged data correctly',
                    isSoftUser: false,
                    input: { firstName: 'Jane', lastName: 'Smith', points: 2500 },
                    expectedName: 'Jane',
                    expectedSurname: 'Smith',
                    expectedPoints: 2500
                },
                {
                    description: 'should return null surname when user is soft user',
                    isSoftUser: true,
                    input: { firstName: 'Jane', lastName: 'Smith', points: 2500 },
                    expectedName: 'Jane',
                    expectedSurname: null,
                    expectedPoints: 2500
                },
                {
                    description: 'should handle undefined points',
                    isSoftUser: false,
                    input: { firstName: 'Jane', lastName: 'Smith', points: undefined },
                    expectedName: 'Jane',
                    expectedSurname: 'Smith',
                    expectedPoints: undefined
                }
            ];

            userInfoTestCases.forEach(function (testCase) {
                it(testCase.description, function () {
                    fakeCommonsUserUtilsService.isSoftUser.and.returnValue(testCase.isSoftUser);

                    var customerData = {
                        userInfo: {
                            firstName: testCase.input.firstName,
                            lastName: testCase.input.lastName
                        },
                        pointsTransformed: testCase.input.points
                    };

                    var result = ibGreyBarTransformer.mapUserInfoToLoggedData(customerData);

                    expect(result.name).toBe(testCase.expectedName);
                    expect(result.surname).toBe(testCase.expectedSurname);
                    expect(result.points).toBe(testCase.expectedPoints);
                    expect(result.isLogged).toBe(true);
                });
            });
        });
    });
});