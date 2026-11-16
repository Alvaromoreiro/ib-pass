(function () {
    'use strict';

    angular
        .module('ib-apis-docs-module')
        .controller('ApisDocsController', ApisDocsController);

    ApisDocsController.$inject = ['BookingDashboardConstants', 'localStorageService', 'MmBAppConstants', '$scope'];
    function ApisDocsController(BookingDashboardConstants, localStorageService, MmBAppConstants, $scope) {
        var vm = this;
        var documents;
        var index = 0, index2 = 0, date, found;
        var isFirstTime, i, counterLogged = [];
        vm.$onInit = activate;
        vm.isDocCountryDisabled = isDocCountryDisabled;
        vm.removeElementFromList = removeElementFromList;
        vm.selectOption = selectOption;
        vm.selectDoc = selectDoc;
        vm.initOthersDocuments = initOthersDocuments;
        vm.isFound = false;
        vm.existsOthersOptionals = false;
        vm.existsOthersInDocuments = false;

        function activate() {
            vm.isInfant = (vm.relatedAdultData) ? true : false;
            if(vm.isInfant && vm.relatedAdultData?.infData) {
                vm.pasDocsData = vm.relatedAdultData.infData?.mandatoryDocuments || vm.pasDocsData;
            }

            selectLoggedDocument();

            documents = vm.pasDocsData.documents;

            if (vm.idDocument === 'REQ') {
                selectSecurityDocuments(documents);
            };

            if (vm.idDocument === 'OPT') {
                vm.pasDocsData.selectedDoc = documents[0];
                if (angular.isUndefined(vm.pasDocsData.optDocuments)) {
                    vm.pasDocsData.optDocuments = [];
                }

                vm.initOthersDocuments();
                vm.removeElementFromList();

                if (angular.isUndefined(vm.pasDocsData.selectedDoc) || angular.isUndefined(vm.pasDocsData.selectedDoc.number)) {
                    if (angular.isDefined(documents[0]) && angular.isDefined(documents[0].type)) {
                        vm.pasDocsData.selectedDoc.type = documents[0].type;
                    }
                }
                for (index = 0; index < documents.length; index++) {
                    if (documents[index].type.code === 'OTHERS') {
                        vm.selectDoc(documents[index], { requiredFields: ['EXPIRY_DOC', 'NUM_DOC', 'CNTRY_DOC'], requiredFieldsOptions: [] });
                    } else {
                        for (index2 = 0; index2 < vm.pasDocsData.optDocuments.length; index2++) {
                            if (documents[index].type.code === vm.pasDocsData.optDocuments[index2].type.code) {
                                vm.isFound = true;
                                vm.selectDoc(documents[index], vm.pasDocsData.optDocuments[index2]);
                            }
                        }

                    }
                }
            };
        };

        const selectSecurityDocuments = (documents) => {
            if (vm.pasDocsData.selectedDoc !== null ) {
                if (documents.length === 1) {
                    vm.pasDocsData.selectedDoc = documents[0];
                } else if (documents.length > 1) {
                    documents.find(doc => {
                        if (doc?.number) {
                            vm.pasDocsData.selectedDoc = doc;
                        }
                    });
                }
            }
        };     /**
         * Select on int document logged if have it and only is one
         */
        function selectLoggedDocument() {
            isFirstTime = localStorageService.get('counterDocs');

            if (!isFirstTime) {
                for (i = 0; i < vm.pasDocsData.documents.length; i++) {
                    if (vm.pasDocsData.documents[i].isSaved) {
                        counterLogged.push(vm.pasDocsData.documents[i]);
                    }
                }

                if (counterLogged.length === 1) {
                    vm.pasDocsData.selectedDoc = counterLogged[0];
                }

                localStorageService.set('counterDocs', true);
            }
        }

        function selectDoc(doc, opt) {

            date = doc.expiryDate;

            vm.pasDocsData.selectedDoc = {
                type: doc.type,
                description: doc.type.description,
                number: doc.number,
                requiredFields: doc.requiredFields,
                expiryDate: {
                    year: angular.isDefined(date) && date !== null ? angular.isString(date) ? date.substring(0, 4) : date.year : '',
                    month: angular.isDefined(date) && date !== null ? angular.isString(date) ? date.substring(5, 7) : date.month : '',
                    day: angular.isDefined(date) && date !== null ? angular.isString(date) ? date.substring(8, 10) : date.day : ''
                },
                isSaved: doc.isSaved,
                requiredFieldsOptions: doc.requiredFieldsOptions || [],
                issuerCountry: doc.issuerCountry
            };
        }

        function initOthersDocuments() {
            for (index2 = 0; index2 < vm.pasDocsData.documents.length; index2++) {
                if (vm.pasDocsData.documents[index2].type.code === 'OTHERS') {
                    vm.existsOthersInDocuments = true;
                    vm.selectDoc(vm.pasDocsData.documents[index2], { requiredFields: ['EXPIRY_DOC', 'NUM_DOC', 'CNTRY_DOC'], requiredFieldsOptions: [] });
                }
            }
            for (index = 0; index < vm.pasDocsData.optDocuments.length; index++) {
                if (vm.pasDocsData.optDocuments[index].type.code === 'OTHERS' && vm.idDocument === 'OPT') {
                    vm.existsOthersOptionals = true;
                }
            }
            if (!vm.existsOthersOptionals && vm.existsOthersInDocuments) {
                vm.pasDocsData.optDocuments.push(
                    { 'type': { 'code': 'OTHERS', 'description': 'Otros documentos' }, 'requiredFields': ['EXPIRY_DOC', 'NUM_DOC', 'CNTRY_DOC'], 'requiredFieldsOptions': [] }
                );
            }
        }

        function removeElementFromList() {
            for (index = 0; index < vm.pasDocsData.optDocuments.length; index++) {
                if (vm.pasDocsData.optDocuments[index].type.code === 'VISA' && vm.idDocument === 'OPT') {
                    vm.pasDocsData.optDocuments.splice(vm.pasDocsData.optDocuments[index], 1);
                }
            }
        }

        function isDocCountryDisabled() {
            return vm.pasDocsData.selectedDoc && angular.isDefined(vm.pasDocsData.selectedDoc.type) && (vm.pasDocsData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.GREENCARD
                || vm.pasDocsData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.REDRESSNUMBER
                || vm.pasDocsData.selectedDoc.type.code === BookingDashboardConstants.APIS_FORM.DOCUMENT_TYPES.KNOWNTRAVELERNUMBER);
        };

        function selectOption(data, opt) {
            const travelDocuments = vm.pasDocsData?.travelDocuments || [];
            if (travelDocuments.length > 0) {
                let document = matchingTravelDocsMandatory(data, travelDocuments);
                let travelDoc = document.travelDoc;
                let infoSelectDoc = {
                    type: {
                        code: data.type.code,
                        description: data.type.description,
                    },
                    number: travelDoc.document_number,
                    expiryDate: travelDoc.expiry_date,
                    requiredFields: data.requiredFields,
                    requiredFieldsOptions: data.requiredFieldsOptions,
                    issuerCountry: travelDoc.country
                };
                vm.selectDoc(infoSelectDoc, opt);
            } else {
                found = false;
                for (index = 0; index < vm.pasDocsData.documents.length; index++) {
                    if (data.type.code === vm.pasDocsData.documents[index].type.code) {
                        vm.selectDoc(vm.pasDocsData.documents[index], data);
                        found = true;
                    }
                }
                if (!found) {
                    vm.pasDocsData.selectedDoc = {
                        type: {
                            code: data.type.code,
                            description: data.type.description,
                        },
                        description: data.type.description,
                        requiredFields: data.requiredFields,
                        requiredFieldsOptions: data.requiredFieldsOptions,
                        issuerCountry: data.issuerCountry
                    };
                }
            }
        }

        const matchingTravelDocsMandatory = (selectedDoc, travelDocuments) => {
            const codeMap = MmBAppConstants.SECURITY_AND_TRAVEL_DOCUMENTS_MANDATORY;
            const matchingCodes = codeMap[selectedDoc.type.code] || [];
            const matchingObject = travelDocuments.find(item => matchingCodes.includes(item.document_type)) || {};
            return {selectedDoc, travelDoc: matchingObject};
        };
    }
})();
