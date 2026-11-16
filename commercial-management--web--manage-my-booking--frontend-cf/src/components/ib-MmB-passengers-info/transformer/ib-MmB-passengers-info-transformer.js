(function () {
    'use strict';

    angular
        .module('ib-MmB-passengers-info-module')
        .factory('PassengersInfoTransformer', PassengersInfoTransformer);

    PassengersInfoTransformer.$inject = ['PassengersInfoConstants', 'localStorageService', 'MmBAppConstants'];
    function PassengersInfoTransformer(PassengersInfoConstants, localStorageService, MmBAppConstants) {

        return {
            transformPassengerInfoData: transformPassengerInfoData,
            transformUpdateDataContactData: transformUpdateDataContactData,
            transformUpdatePassengerInfoData: transformUpdatePassengerInfoData,
            updatePassengerData: updatePassengerData
        };


        /**
         * Transform de information of formData for send to service request
         * @param {Object} Array with list of passengers with contact information 
         */
        function transformUpdatePassengerInfoData(passengerformData) {
            var transformedDataContactInfo = {
                'passengersContactInfo': []
            };
            transformedDataContactInfo.passengersContactInfo.push({
                'passengerId': passengerformData.passengerId,
                'ffInfo': angular.copy(passengerformData.frequentFlyerInfo)
            });
            return transformedDataContactInfo;
        }

        /**
         * Transform information of passengers of the localstorage
         * @return {Object} passengerFormData Object with information of passengers 
         */
        function transformPassengerInfoData() {
            var i, j, bookingInfo = localStorageService.get('bookingInfo');
            var transformedInfo = {
                passengersContactInfo: [],
                optionalInformation: false,
                passengerContactData: false,
                indexTab: 0,
                companies: localStorageService.get('frequentFlyersCompanies'),
                primaryContactInfo: bookingInfo.order.primaryContactInfo
            };
            var passengersDataLocal = localStorageService.get('passengers');
            var selectedPassengerId = localStorageService.get('selectedPassengerId') || 0;

            for (i = 0; i < passengersDataLocal.length; i++) {
                if (passengersDataLocal[i].passengerType !== MmBAppConstants.PASSENGER_TYPES.infant) {
                    for (j = 0; j < bookingInfo.order.orderItems.length; j++) {
                        if (passengersDataLocal[i].passengerId === bookingInfo.order.orderItems[j].passengerId && bookingInfo.order.orderItems[j].type === PassengersInfoConstants.TYPE.SPECIAL_NEED) {
                            if (!passengersDataLocal[i].specialNeed) {
                                passengersDataLocal[i]['specialNeed'] = { 'description': bookingInfo.order.orderItems[j].description };
                            } else {
                                passengersDataLocal[i].specialNeed.description = passengersDataLocal[i].specialNeed.description + ',' + bookingInfo.order.orderItems[j].description;
                            }
                        }
                    }
                }
            }

            transformedInfo.optionalInformation = localStorageService.get('optionalInformation');
            transformedInfo.passengerContactData = passengerContactData(passengersDataLocal);
            transformedInfo.companies.unshift({ 'airlineName': { 'needsTranslate': true, 'description': PassengersInfoConstants.DEFAULT_COMPANY_CODE }, 'iataCompanyCode': PassengersInfoConstants.DEFAULT_COMPANY_CODE });
            transformedInfo.indexTab = selectedPassengerId.passengerId === PassengersInfoConstants.DATA_CONTACT_TAB ? transformedInfo.indexTab = passengersDataLocal.length : transformedInfo.indexTab = selectedPassengerId;

            for (i = 0; i < passengersDataLocal.length; i++) {
                if (passengersDataLocal[i].passengerType === PassengersInfoConstants.PASSENGER_INFANT) {
                    angular.extend(passengersDataLocal[i], { 'parent_info': getParentInfo(passengersDataLocal, passengersDataLocal[i].relatedPassengerId) });
                }
                if (!passengersDataLocal[i].frequentFlyerInfo) {
                    passengersDataLocal[i].frequentFlyerInfo = {
                        'company': transformedInfo.companies[0].iataCompanyCode
                    };
                }
                angular.extend(passengersDataLocal[i], { 'tickets': getPassengerTickets(passengersDataLocal[i].passengerId) });
                transformedInfo.indexTab = passengersDataLocal[i].passengerId === selectedPassengerId ? i : transformedInfo.indexTab;
                transformedInfo.passengersContactInfo.push(passengersDataLocal[i]);
            }
            if (transformedInfo.primaryContactInfo) {
                angular.extend(transformedInfo.primaryContactInfo, { 'status': localStorageService.get('savedDataContactSuccess') });
            }
            return transformedInfo;

            function getPassengerTickets(pasId) {
                var tickets = localStorageService.get('bookingInfo').tickets || [];
                var ticketList = null, pIndex = 0, pFound = false, tIndex;
                while (!pFound && pIndex < tickets.length) {
                    if (pasId === tickets[pIndex].passengerId) {
                        pFound = true;
                        ticketList = '';
                        for (tIndex = 0; tIndex < tickets[pIndex].ticketNumbers.length; tIndex++) {
                            ticketList += (ticketList.length === 0 ? '' : ',') + tickets[pIndex].ticketNumbers[tIndex];
                        }
                    }
                    pIndex++;
                }
                return ticketList && ticketList.length === 0 ? null : ticketList;
            }

            function passengerContactData(passengers) {
                var i, haveContact = false;

                for (i = 0; i < passengers.length; i++) {
                    if (passengers[i].optionalInformation.contactData) {
                        haveContact = true;
                    }
                }
                return haveContact;
            }
        }


        /**
         * Transform de information of data contact for send to service request
         * @param {Object} Array with information of data contact for passengers
         */
        function transformUpdateDataContactData(passengerformData, originalInfo) {
            var contactInfo, i, transformedDataContactInfo = {};
            if (!angular.equals(passengerformData.primaryContactInfo, originalInfo.primaryContactInfo)) {
                contactInfo = generateContactInfo(passengerformData.primaryContactInfo);
                if (contactInfo) {
                    angular.extend(transformedDataContactInfo, { 'primaryContactInfo': contactInfo });
                }
            }

            angular.extend(transformedDataContactInfo, { 'passengersContactInfo': [] });
            for (i = 0; i < passengerformData.passengersContactInfo.length; i++) {
                if (passengerformData.passengersContactInfo[i].passengerType !== PassengersInfoConstants.PASSENGER_INFANT) {
                    if (!angular.equals(passengerformData.passengersContactInfo[i].contactInfo, originalInfo.passengersContactInfo[i].contactInfo)) {
                        contactInfo = generateContactInfo(passengerformData.passengersContactInfo[i].contactInfo);
                        if (contactInfo) {
                            transformedDataContactInfo.passengersContactInfo.push({
                                'passengerId': passengerformData.passengersContactInfo[i].passengerId,
                                'contactInfo': contactInfo
                            });
                        }
                    }
                }
            }
            if (transformedDataContactInfo.passengersContactInfo.length === 0) {
                delete transformedDataContactInfo.passengersContactInfo;
            }
            return transformedDataContactInfo;
        }


        /**
         * Extend object with the contactInfo data
         * @param {Object} contactData Primar conctact info of passengers
         */
        function generateContactInfo(contactData) {
            var contactInfo = {};
            contactData = contactData || {};
            if (contactData.phone && contactData.phone !== '') {
                angular.extend(contactInfo, {
                    'phone': contactData.phone,
                    'phoneDetails': {
                        countryCode: contactData?.phoneDetails?.countryCode,
                        number: contactData?.phoneDetails?.number
                    },
                    'phoneType': PassengersInfoConstants.PHONE_TYPE
                });
            }
            if (contactData.email && contactData.email !== '') {
                angular.extend(contactInfo, { 'email': contactData.email });
            }

            return Object.keys(contactInfo).length > 0 ? contactInfo : null;
        };


        /**
         * Get parent name and parent tickets of INFANT and set in this
         * @param {Objects} passengerInfo List of total passsengers
         * @param {String} relatedInfantId Id related parent of the infant
         */
        function getParentInfo(passengerInfo, relatedInfantId) {
            var i = 0, parentInfo = {}, isFound = false;

            if (relatedInfantId) {
                while (!isFound && i < passengerInfo.length) {
                    if (passengerInfo[i].passengerId === relatedInfantId) {
                        angular.extend(parentInfo, {
                            'name': passengerInfo[i].personalInfo.name + ' ' + passengerInfo[i].personalInfo.surname,
                            'tickets': passengerInfo[i].tickets
                        });
                        isFound = true;
                    }
                    i++;
                }
            }
            return Object.keys(parentInfo).length > 0 ? parentInfo : null;
        };


        /**
         * Upadate info of the passenger with contact info frequentFlyerInfo and status
         * @param {Object} passengerformData Passenger for update
         */
        function updatePassengerData(passengerformData) {
            var bookingInfo = localStorageService.get('bookingInfo'), contactInfo, i, j, pasFound;
            contactInfo = generateContactInfo(passengerformData.primaryContactInfo);
            if (contactInfo) {
                angular.extend(bookingInfo.order, { 'primaryContactInfo': angular.copy(contactInfo) });
            }
            for (i = 0; i < passengerformData.passengersContactInfo.length; i++) {
                contactInfo = generateContactInfo(passengerformData.passengersContactInfo[i].contactInfo);
                if (passengerformData.passengersContactInfo[i].passengerType !== PassengersInfoConstants.PASSENGER_INFANT) {
                    j = 0, pasFound = false;
                    while (!pasFound && j < bookingInfo.passengers.length) {
                        if (bookingInfo.passengers[j].passengerId === passengerformData.passengersContactInfo[i].passengerId) {
                            pasFound = true;
                            if (contactInfo) {
                                bookingInfo.passengers[j].contactInfo = angular.copy(contactInfo);
                            }
                            bookingInfo.passengers[j].frequentFlyerInfo = angular.copy(passengerformData.passengersContactInfo[i].frequentFlyerInfo);
                            bookingInfo.passengers[j].status = passengerformData.passengersContactInfo[i].status;
                        }
                        j++;
                    }
                }
            }
            localStorageService.set('bookingInfo', bookingInfo);
        }
    }
})();