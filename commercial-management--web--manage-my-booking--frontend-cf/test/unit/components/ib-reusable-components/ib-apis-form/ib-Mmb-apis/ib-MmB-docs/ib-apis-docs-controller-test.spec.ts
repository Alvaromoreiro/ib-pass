describe('ApisDocsController test', () => {

    var controller, $scope, $rootScope, localStorage;

    var fakeBookingDashboardConstants = {
        APIS_FORM: {
            DOCUMENT_TYPES: {
                DNI: 'DNI',
                GREENCARD: 'GREENCARD',
                REDRESSNUMBER: 'REDRESSNUMBER',
                KNOWNTRAVELERNUMBER: 'KNOWNTRAVELERNUMBER',
                OTHERS: 'OTHERS',
                PSPT: 'PSPT',
                TITLE: 'TITLE',
                VISA: 'VISA',
                CREWCERT: 'CREWCERT',
                RESCARD: 'RESCARD',
                MILITARYCARD: 'MILITARYCARD'
            }
        }
    };

    let fakeMmBAppConstants = {
        SECURITY_AND_TRAVEL_DOCUMENTS_MANDATORY: {
            DNI: ['DNI'],
            PSPT: ['PASSPORT']
        }
    }

    beforeEach(() => {
        angular.mock.module('ib-apis-docs-module', 'LocalStorageModule', function ($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_$rootScope_, $controller, _localStorageService_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            controller = $controller('ApisDocsController', {
                $scope: $scope
            });
        });
    });

    describe('init component', () => {
        it('its create correctly', (done) => {
            expect(controller.$onInit).toBeDefined();
            done();
        });
    });

    describe('when activate function is called with OPT documents', () => {
        it('its create correctly opt documents', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.optDocuments = [
                { isSaved: true, type: { code: 'OTHERS'} },
                { isSaved: false, type: { code: 'VISA'}  }
            ]
            controller.pasDocsData.documents = [
                { isSaved: true, type: { code: 'OTHERS'} },
                { isSaved: false, type: { code: 'VISA'}  }
            ];
            controller.idDocument = 'OPT';
            controller.$onInit();
            expect(controller.existsOthersInDocuments).toBe(true);
            done();
        });

         it('should opt documents generic', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.documents = [
                { isSaved: true, type: { code: 'OTHERS'} },
                { isSaved: false, type: { code: 'VISA'}  }
            ];
            controller.idDocument = 'OPT';
            controller.$onInit();
            expect(controller.existsOthersInDocuments).toBe(true);
            done();
        });

        it('if data type code is the same as in documents, found is true', (done) => {
            controller.pasDocsData = {
                optDocuments: [],
                documents: [
                    {  isSaved: false, type: { code: 'DNI'}, number: '243234E'},
                    {  isSaved: false, type: { code: 'PSPT'} }
                ],
                expiryDate: '2024-10-10',
                selectedDoc: {
                    type: {
                        code: 'DNI',
                        description: 'Documento Nacional de identidad'
                    },
                    number: '243234E',
                    requiredFields: ['NUM_CODE'],
                    expiryDate: '2024-10-10',
                    issuerCountry: ''
                },
                travelDocuments: [{
                    document_type: 'DNI'
                }]
            };
            controller.idDocument = 'REQ';
            controller.$onInit();
            done();
        });

        it('if data type code is the same as in documents, found is true and one document', (done) => {
            controller.pasDocsData = {
                optDocuments: [],
                documents: [
                    {  isSaved: false, type: { code: 'DNI'}, number: '243234E'}
                ],
                expiryDate: '2024-10-10',
                selectedDoc: {
                    type: {
                        code: 'DNI',
                        description: 'Documento Nacional de identidad'
                    },
                    number: '243234E',
                    requiredFields: ['NUM_CODE'],
                    expiryDate: '2024-10-10',
                    issuerCountry: ''
                },
                travelDocuments: [{
                    document_type: 'DNI'
                }]
            };
            controller.idDocument = 'REQ';
            controller.$onInit();
            done();
        });

        it('its infant passenger', (done) => {
            localStorage.set('counterDocs', true);
            controller.relatedAdultData = {
                infData: {
                    mandatoryDocuments: [
                        {
                            documents: [
                                {  isSaved: false, type: { code: 'DNI'} },
                                {  isSaved: false, type: { code: 'PSPT'} }
                            ],
                            selectedDoc: {
                                type: {
                                    code: 'DNI',
                                    description: 'Documento Nacional de identidad'
                                },
                                number: '243234E',
                                requiredFields: ['NUM_CODE'],
                                expiryDate: '2024-10-10',
                                issuerCountry: ''
                            },
                            optDocuments: []
                        }
                    ],

                }
            };
            controller.$onInit();
            expect(controller.isInfant).toBe(true);
            done();
        });
    });

    describe('when selectLoggedDocument function is called', () => {
        it('if pasDocsData.documents have documents and are saved, should push to counterLogged', (done) => {
            localStorage.set('counterDocs', false);
            controller.pasDocsData = {};
            controller.pasDocsData.documents = [
                { title: 'doc1', isSaved: true, type: { code: 'OTHERS'} },
                { title: 'doc2', isSaved: false, type: { code: 'VISA'}  }
            ];
            controller.$onInit();
            expect(localStorage.get('counterDocs')).toBe(true);
            done();
        });
    });

    describe('when isDocCountryDisabled function is called', () => {
        it('if pasDocsData.selectedDoc matches GREENCARD type must return true', (done) => {
            localStorage.set('counterDocs', true);
            controller.pasDocsData = {};
            controller.pasDocsData.selectedDoc = { title: 'doc1', isSaved: true, type: { code: 'GREENCARD'} };
            expect(controller.isDocCountryDisabled()).toBe(true);
            done();
        });
    });
    describe('when isDocCountryDisabled function is called', () => {
        it('if pasDocsData.selectedDoc matches REDRESSNUMBER type must return true', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.selectedDoc = { title: 'doc1', isSaved: true, type: { code: 'REDRESSNUMBER'} };
            expect(controller.isDocCountryDisabled()).toBe(true);
            done();
        });
    });
    describe('when isDocCountryDisabled function is called', () => {
        it('if pasDocsData.selectedDoc matches REDRESSNUMBER type must return true', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.selectedDoc = { title: 'doc1', isSaved: true, type: { code: 'KNOWNTRAVELERNUMBER'} };
            expect(controller.isDocCountryDisabled()).toBe(true);
            done();
        });
    });

    describe('when selectOption function is called', () => {
        it('if data type code is the same as in documents, found is true', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.documents = [{ title: 'doc1', isSaved: true, type: { code: 'GREENCARD'} }];
            controller.selectOption({ title: 'doc1', isSaved: true, type: { code: 'GREENCARD'} });
            expect(controller.pasDocsData.selectedDoc.type.code).toEqual('GREENCARD');
            done();
        });

        it('if data type code is different as in documents, found is false', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.documents = [{ title: 'doc1', isSaved: true, type: { code: 'VISA'} }];
            controller.selectOption({ title: 'doc1', isSaved: true, type: { code: 'GREENCARD'} });
            expect(controller.pasDocsData.selectedDoc.type.code).toEqual('GREENCARD')
            done();
        });

        it('selectOption with expiryDate', (done) => {
            controller.pasDocsData = {};
            controller.pasDocsData.documents = [{ title: 'doc1', isSaved: true, type: { code: 'VISA', description: ''},number:'234', requiredFields: [], requiredFieldsOptions: [], issuerCountry: 'ES', expiryDate: {year:'2030',month:'12', day: '12'} }];
            controller.selectOption(controller.pasDocsData.documents[0]);
            expect(controller.pasDocsData.selectedDoc.expiryDate).toEqual({year: '2030', month: '12', day: '12'});
            done();
        });

        it('if travelDOcuments is defined', (done) => {
            controller.pasDocsData = {
                documents: [
                    {  isSaved: false, type: { code: 'DNI'} },
                    {  isSaved: false, type: { code: 'PSPT'} }
                ],
                selectedDoc: {
                    type: {
                        code: 'DNI',
                        description: 'Documento Nacional de identidad'
                    },
                    number: '243234E',
                    requiredFields: ['NUM_CODE'],
                    expiryDate: '2030-5-5',
                    issuerCountry: ''
                },
                travelDocuments: [{
                    document_type: 'DNI',
                    expiry_date: '2050-10-10',
                }]
            };
            controller.selectOption(controller.pasDocsData.selectedDoc);
            expect(controller.pasDocsData.selectedDoc.expiryDate).toEqual({year: '2050', month: '10', day: '10'})
            done();
        });
    });

});
