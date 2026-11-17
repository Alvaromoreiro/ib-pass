import dayjs from 'dayjs';

(function () {

    'use strict'
    angular.module('ib-checkin-biometric-boarding-module')
        .factory('BiometricTransformer', BiometricTransformer);

    BiometricTransformer.$inject = ['localStorageService', 'ContentPreprocessorService', 'CheckinAppConstants']

    function BiometricTransformer(localStorageService, ContentPreprocessorService, CheckinAppConstants) {
        var self = {
            transformInitServiceResponse: transformInitServiceResponse,
            transformFlightInfoPassengerResponse: transformFlightInfoPassengerResponse,
            transformFlightInfoPassengerRequest: transformFlightInfoPassengerRequest,
            transformBiometricDataResponse: transformBiometricDataResponse,
            transformBiometricBoardingInfoRequest: transformBiometricBoardingInfoRequest,
            transformAssociateBoardingCardRequest: transformAssociateBoardingCardRequest,
            transformDataForGetBiometricalData: transformDataForGetBiometricalData
        };

        return self;

        function transformInitServiceResponse(documentsResponse, gdprData) {
            var transformedModel = { 'documentsByCountry': {}, 'countriesList': [], 'gdprInfo': {}, 'email': '' }, customerData = localStorageService.get('customerData');
            if (documentsResponse.data && documentsResponse.data.documents && documentsResponse.data.documents.length > 0) {
                const documents = documentsResponse.data.documents;
                angular.forEach(documents, (doc) => {
                    for (let i = 0; i < doc.countries.length; ++i) {
                        if (!transformedModel.documentsByCountry[doc.countries[i].code]) {
                            transformedModel.documentsByCountry[doc.countries[i].code] = [];
                            transformedModel.countriesList.push({ 'description': doc.countries[i].description, 'code': doc.countries[i].code });
                        }
                        transformedModel.documentsByCountry[doc.countries[i].code].push({ 'type': doc.type.type, 'description': doc.type.description });
                    }
                });
            }

            if (gdprData) {
                transformedModel['gdprInfo'] = angular.copy(gdprData);
                transformedModel.gdprInfo.text = ContentPreprocessorService.processContent(transformedModel.gdprInfo.text, 'gdprInfo');
            }
            if (customerData)
                transformedModel.email = customerData.personalInfo.contactEmail;

            return transformedModel;
        }

        /**
         *  Transforms raw data to a service ready structure Object
         * @param {Object} data
         * @param {Object} model
         */
        function transformFlightInfoPassengerRequest(data, model) {
            var requestReady = { 'name': undefined, 'surname': undefined, 'expirationDate': undefined, 'boardingCard': undefined },
                boardingCardPassengers = localStorageService.get('confirmationInfo'),
                biometricBoardingPassenger = localStorageService.get('biometricBoardingPassenger');
            requestReady.name = data.name;
            requestReady.surname = data.surname;
            requestReady.expirationDate = data.expirationDate;
            if (model) {
                try {
                    requestReady.boardingCard = model.boardingCard.barcodeContent
                } catch (error) {
                    requestReady.boardingCard = ''
                }
            } else {
                try {
                    boardingCardPassengers.boardingCards[0].passengers.forEach(passenger => {
                        if (passenger.id === biometricBoardingPassenger.id) {
                            requestReady.boardingCard = passenger.barcodeContent;
                            biometricBoardingPassenger = Object.assign(biometricBoardingPassenger, {
                                'barcodeContent': passenger.barcodeContent,
                                'ticketNumber': passenger.ticketNumber
                            })
                            localStorageService.set('biometricBoardingPassenger', biometricBoardingPassenger);
                        }
                    });
                } catch (error) {
                    requestReady.boardingCard = ''
                }
            }
            return requestReady;
        }

        /**
         * Transforms response data
         * @param {*} data
         */
        function transformFlightInfoPassengerResponse(data) {
            var parsedResponse = { 'flightTime': undefined, 'flightNumber': undefined, 'flightCompany': undefined, 'flightOrigin': undefined, 'flightDestination': undefined };
            parsedResponse.flightTime = data.flightTime;
            parsedResponse.flightNumber = data.flightNumber;
            parsedResponse.flightCompany = data.flightCompany;
            parsedResponse.flightOrigin = data.flightOrigin;
            parsedResponse.flightDestination = data.flightDestination;
            return parsedResponse;
        }

        function transformBiometricDataResponse(response) {
            var parsedResponse = { 'name': undefined, 'surname': undefined, 'expirationDate': undefined };
            parsedResponse.name = (response.data && response.data.name) ? response.data.name : (response.name) ? response.name : '';
            parsedResponse.surname = (response.data && response.data.surname) ? response.data.surname : (response.surname) ? response.surname : '';
            parsedResponse.expirationDate = (response.data && response.data.expirationDate) ? response.data.expirationDate : (response.expirationDate) ? response.expirationDate : '';
            return parsedResponse;
        }

        function transformBiometricBoardingInfoRequest(data) {
            var documentType = (data.documentType && data.documentType.type && data.documentType.type.length > 0) ? data.documentType.type : (data.documentType && data.documentType.length > 0) ? data.documentType : '';
            const auxBoardingCards = data?.boardingCard?.map(e=> e.barcodeContent);
            return {
                'associateBoardingCards': [
                    {
                    'documentNumber': data.documentNumber,
                    'documentType': documentType.hasOwnProperty('type') ? documentType.type : documentType,
                    'documentEmissionCountry': (data.documentEmissionCountry && data.documentEmissionCountry.length > 0) ? data.documentEmissionCountry : '',
                    'email': data.email,
                    'boardingCards': auxBoardingCards
                    }
                ]
            };
        }

        function transformAssociateBoardingCardRequest(requestData) {
            var parsedResponse = {
                'name': undefined, 'surname': undefined, 'expirationDate': undefined,
                'boardingCard': undefined, 'documentNumber': undefined, 'documentType': undefined,
                'documentEmissionCountry': undefined, 'flightCompany': undefined, 'flightNumber': undefined,
                'flightOrigin': undefined, 'flightDestination': undefined, 'flightTime': undefined,
                'email': undefined, 'ticketNumber': undefined, 'coupon': undefined
            },
            bookingInfo = localStorageService.get('bookingInfo') || null,
            biometricModel = localStorageService.get('biometricModel') || null,
            biometricBoardingPassenger = localStorageService.get('biometricBoardingPassenger') || null;

            parsedResponse.documentNumber = (requestData.documentNumber) ? requestData.documentNumber : '';
            parsedResponse.documentType = (requestData.documentType) ? requestData.documentType.hasOwnProperty('type') ? requestData.documentType.type : requestData.documentType : '';
            parsedResponse.documentEmissionCountry = (requestData.documentEmissionCountry) ? requestData.documentEmissionCountry : '';
            parsedResponse.expirationDate = requestData.expirationDate;
            parsedResponse.email = requestData.email || biometricBoardingPassenger.biometricDocument.email
            parsedResponse.name = requestData.name || biometricBoardingPassenger.name;
            parsedResponse.surname = requestData.surname || biometricBoardingPassenger.surname;

            parsedResponse.boardingCard = requestData.boardingCard || biometricBoardingPassenger.barcodeContent;

            if (bookingInfo !== null && bookingInfo.outwardSegments.length > 0) {
                parsedResponse.flightCompany = bookingInfo.outwardSegments[0].operatingFlightNumber.company.code;
                parsedResponse.flightNumber = bookingInfo.outwardSegments[0].operatingFlightNumber.number;
                parsedResponse.flightOrigin = bookingInfo.outwardSegments[0].departure.airport.code;
                parsedResponse.flightDestination = bookingInfo.outwardSegments[0].arrival.airport.code;
                parsedResponse.flightTime = dayjs(bookingInfo.outwardSegments[0].departure.date).format('DD/MM/YYYY HH:mm');

                for (var j = 0; j < bookingInfo.outwardSegments.length; j++) {
                    const segment = bookingInfo.outwardSegments[j];
                    for (var k = 0; k < segment.passengers.length; k++) {
                        const passenger = segment.passengers[k];
                        parsedResponse.ticketNumber = searchTicketNumberPassengerPrint(parsedResponse);
                        if (passenger.ticket?.number === parsedResponse.ticketNumber) {
                            parsedResponse.coupon = passenger.ticket.coupon;
                        }
                    }
                }
            }

            return parsedResponse;
        }

        function transformDataForGetBiometricalData() {
            var customerData = localStorageService.get('customerData'), transformedData = { 'documentType': '', 'documentEmissionCountry': '', 'documentNumber': ''
            };
            var biometricPassenger = getBiometricDoc(localStorageService.get('biometricStatusPassengers').passengersList)

            if (customerData !== null && customerData.personalInfo !== undefined && customerData.personalInfo !== null)  {
                transformedData = {
                    'documentType': bindDocumentType(biometricPassenger.type.id),
                    'documentEmissionCountry': 'ESP', // Ver de dónde lo cogemos?
                    'documentNumber': biometricPassenger.number
                };
            }
            return transformedData;
        }
        function getBiometricDoc(passengers) {
            return passengers.find(pas => pas.biometricDocument).biometricDocument || {'type': '', 'number': ''}
        }

        function bindDocumentType(documentType) {
            var documentTypeBinded = '';
            switch (documentType) {
                case '04':
                    documentTypeBinded = CheckinAppConstants.DOCUMENT_TYPES.DNI;
                    break;
                case '03':
                    documentTypeBinded = CheckinAppConstants.DOCUMENT_TYPES.PASSPORT;
                    break;
            }
            return documentTypeBinded;
        }

        function searchTicketNumberPassengerPrint(data){
            var confirmationInfo = localStorageService.get('confirmationInfo');
            var ticketNumber = null;
            if(angular.isObject(confirmationInfo) && angular.isArray(confirmationInfo.boardingCards) && confirmationInfo.boardingCards.length > 0) {
                for (let i = 0; i < confirmationInfo.boardingCards.length; i++) {
                    const segment = confirmationInfo.boardingCards[i];
                    if(angular.isArray(segment.passengers) && segment.passengers.length > 0) {
                        for (let j = 0; j < segment.passengers.length; j++) {
                            const passenger = segment.passengers[j];
                            if (data.boardingCard === passenger.barcodeContent) {
                                ticketNumber = passenger.ticketNumber;
                            }
                        }
                    }
                }
            }
            return ticketNumber;
        }
    }

})();
