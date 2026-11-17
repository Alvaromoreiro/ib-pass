(function () {
    'use strict';

    angular
        .module('ib-check-in-upgrade-module')
        .factory('UpgradeTransformer', UpgradeTransformer);

    UpgradeTransformer.$inject = ['CurrencyService', '$filter', 'CheckinAppConstants', 'UpgradeConstants'];
    function UpgradeTransformer(CurrencyService, $filter, CheckinAppConstants, UpgradeConstants) {
        var service = {
            generateUpgradeModel: generateUpgradeModel,
            modifiedCachedInfo: modifiedCachedInfo
        };

        return service;

        ////////////////
        function generateUpgradeModel(upgradeInfo, cachedInfo) {

            var upgradeViewObject = {
                currency: CurrencyService.getCurrencyObject(upgradeInfo.currency),
                totalPriceCombined: 0,
                posOfferPrice: 0,
                posOfferPriceFormatted: null,
                segments: [],
                selectedOffer: [],
                combinedOffersSegments: [],
                posOfferbox: null,
                offers: upgradeInfo.offers,
                slices: [],
                haveCombinedOffers: false
            };

            var idOfferSegments = [], idSegments = [], segmentOffers = [], i = 0, j = 0, k = 0, posOffer = 0, offerSegments = [], data;


            for (i = 0; i < upgradeInfo.offers.length; i++) {
                if (upgradeInfo.offers[i].offerSegmentClasses.length === 1) {
                    upgradeViewObject.totalPriceCombined += upgradeInfo.offers[i].totalAmount;
                    upgradeInfo.offers[i]['totalAmountFormmated'] = CurrencyService.formatPrice(upgradeViewObject.currency, upgradeInfo.offers[i].totalAmount, false);
                    upgradeInfo.offers[i]['amountPerPassengerFormmated'] = CurrencyService.formatPrice(upgradeViewObject.currency, upgradeInfo.offers[i].amountPerPassenger, false);
                    for (j = 0; j < upgradeInfo.offers[i].offerSegmentClasses.length; j++) {
                        if (idOfferSegments.indexOf(upgradeInfo.offers[i].offerSegmentClasses[j].segment) === -1) {
                            idOfferSegments.push(upgradeInfo.offers[i].offerSegmentClasses[j].segment);
                        }
                    }
                } else {
                    upgradeViewObject.posOfferPrice = upgradeInfo.offers[i].totalAmount;
                    upgradeViewObject.posOfferPriceFormatted = CurrencyService.formatPrice(upgradeViewObject.currency, upgradeViewObject.posOfferPrice, true);
                    upgradeViewObject.haveCombinedOffers = true;
                }
            }
            for (i = 0; i < cachedInfo.outwardSegments.length; i++) {
                if (idSegments.indexOf(cachedInfo.outwardSegments[i].id) === -1) {
                    idSegments.push(cachedInfo.outwardSegments[i])
                }
            }
            for (i = 0; i < cachedInfo.returnSegments.length; i++) {
                if (idSegments.indexOf(cachedInfo.returnSegments[i].id) === -1) {
                    idSegments.push(cachedInfo.returnSegments[i])
                }
            }
            for (i = 0; i < idSegments.length; i++) {
                if (idOfferSegments.indexOf(idSegments[i].id) !== -1) {
                    segmentOffers.push(idSegments[i])
                }
            }
            upgradeViewObject.segments = generateSegments(upgradeInfo.offers);

            function generateSegments(offers) {
                var i, j, k, segments = [], data, offer = null;
                for (k = 0; k < segmentOffers.length; k++) {
                    data = {
                        'id': segmentOffers[k].id,
                        'departure': segmentOffers[k].departure,
                        'arrival': segmentOffers[k].arrival,
                        'date': $filter('DateFormatFilter')(segmentOffers[k].departure.date),
                        'time': segmentOffers[k].departure.date,
                        'actualClass': {
                            'type': segmentOffers[k].cabinClass.type,
                            'description': segmentOffers[k].cabinClass.description
                        },
                        'offers': [],
                        'offerSelected': false
                    }
                    segments.push(data)
                }

                for (i = 0; i < offers.length; i++) {
                    if (offers[i].offerSegmentClasses.length === 1) {
                        for (j = 0; j < offers[i].offerSegmentClasses.length; j++) {
                            for (k = 0; k < segments.length; k++) {
                                if (offers[i].offerSegmentClasses[j].segment === segments[k].id) {
                                    offers[i].isSelected = false;
                                    offer = setOfferConditions(offers[i], upgradeInfo.conditionsByCabinClass || []);
                                    offer['images'] = getImagesByCabin(offer.cabinLayout);
                                    segments[k].offers.push(offer);
                                }
                            }
                        }
                    }
                }
                for (k = 0; k < segments.length; k++) {
                    upgradeViewObject.selectedOffer[k] = segments[k].actualClass;
                }

                // Check for the first position of a segment with offer to show the offer box only in this position
                for (i = 0; i < offers.length; i++) {
                    if (offers[i].offerSegmentClasses.length > 1) {
                        offerSegments = []; offer = { 'id': offers[i].id, 'segments': [] };
                        for (k = 0; k < offers[i].offerSegmentClasses.length; k++) {
                            offer.segments.push({ 'segmentId': offers[i].offerSegmentClasses[k].segment, 'cabinClassCode': offers[i].offerSegmentClasses[k].cabinClass.code });

                            //  offerSegments[k] = offers[i].offerSegmentClasses[k].segment;
                        }
                        upgradeViewObject.combinedOffersSegments.push(offer);
                        //upgradeViewObject.combinedOffersSegments[posOffer] = offerSegments;
                        // posOffer++;
                    }
                }
                // if (upgradeViewObject.combinedOffersSegments.length !== 0) {
                //     upgradeViewObject.posOfferbox = upgradeViewObject.offers.length - 1;
                // }

                return segments;
            }

            function getConditionsOffer(cabinClass) {
                var i = 0, isFound = false, conditions = { 'onLand': [], 'onBoard': [] };

                while (!isFound && i < UpgradeConstants.UPGRADE_TYPES.length) {
                    if (cabinClass === UpgradeConstants.UPGRADE_TYPES[i].type) {
                        isFound = true;
                        conditions.onLand = UpgradeConstants.UPGRADE_TYPES[i].onLand;
                        conditions.onBoard = UpgradeConstants.UPGRADE_TYPES[i].onBoard;
                    }
                    i++;
                }
                return conditions;

            }

            checkScales(upgradeViewObject.slices, upgradeViewObject.segments);

            return upgradeViewObject;

            function setOfferConditions(currentOffer, conditions) {
                var returnedOffer = currentOffer, cIndex = 0, cFounded = false;
                if (returnedOffer.offerSegmentClasses.length === 1) {
                    while (!cFounded && cIndex < conditions.length) {
                        if (conditions[cIndex].code === returnedOffer.offerSegmentClasses[0].cabinClass.code) {
                            cFounded = true;
                            returnedOffer['conditions'] = getConditionsOffer(returnedOffer.cabinLayout);
                        }
                        cIndex++;
                    }
                }
                return returnedOffer;
            }

            function getImagesByCabin(cabinType) {
                var listImages = [];

                switch (cabinType) {
                    case 'PREMIUMTOURIST':
                    case 'PREMIUM_ECONOMY': listImages = [
                        CheckinAppConstants.imagesRoute + '/upgrade/info_turista-premium/Carrusel_01.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_turista-premium/Carrusel_02.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_turista-premium/Carrusel_03.png'];
                        break;
                    case 'BUSINESS_PLUS': listImages = [
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-plus/Carrusel_01.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-plus/Carrusel_02.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-plus/Carrusel_03.png'];
                        break;
                    case 'BUSINESS_CLUB': listImages = [
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_01.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_02.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_03.png'
                    ]; break;
                    case 'BUSINESS_CLASS': listImages = [
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_01.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_02.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_03.png'
                    ]; break;
                    case 'BUSINESS_AIR_NOSTRUM': listImages = [
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_01.png',
                        CheckinAppConstants.imagesRoute + '/upgrade/info_business-class/Carrusel_02.png'
                    ]; break;

                }

                return listImages;
            }
        }


        /**
         * Check if the segments are scales of slice and return array of slices
         * @param {Array} slicesView Slices model to show in view
         * @param {Array} segments List of segments with upgrading offer
         * @returns {Array} Slice with segments scales
         */
        function checkScales(slicesView, segments) {
            var slice = { 'departure': null, 'arrival': null, 'date': null, 'quantyScales': null, 'segments': [] }, i, j, k, segmentsCopy = angular.copy(segments)
            if (segmentsCopy.length > 1) {
                for (i = 0; i < segments.length; i++) {
                    k = i + 1;
                    if (k < segments.length) {
                        if (segments[i].arrival.airport.code === segments[k].departure.airport.code) {
                            j = k - 1;
                            slice.segments = segmentsCopy.splice(j, k + 1);
                        }
                    }
                }
            } else {
                slice.segments.push(segmentsCopy.pop());
            }

            slice.actualClass = slice.segments[0].actualClass;
            slice.departure = slice.segments[0].departure;
            slice.date = slice.segments[0].date;
            slice.time = slice.segments[0].time;
            slice.quantyScales = slice.segments.length - 1;
            slice.arrival = slice.segments[slice.segments.length - 1].arrival;
            slicesView.push(slice);

        }


        function modifiedCachedInfo(upgradeResponse, cabinLayout, cachedInfo) {
            var cachedResponse = cachedInfo;
            var i, segmentFound = false, j;
            if (cachedResponse != null) {
                cachedResponse.outwardSegments = cachedResponse.outwardSegments || [];
                cachedResponse.returnSegments = cachedResponse.returnSegments || [];
                upgradeResponse.acceptedSegments = upgradeResponse.acceptedSegments || [];
                for (i = 0; i < upgradeResponse.acceptedSegments.length; i++) {
                    segmentFound = false, j = 0;
                    while (!segmentFound && j < cachedResponse.outwardSegments.length) {
                        if (upgradeResponse.acceptedSegments[i].id === cachedResponse.outwardSegments[j].id) {
                            segmentFound = true;
                            cachedResponse.outwardSegments[j].passengers = updatePassengerInfo(upgradeResponse.acceptedSegments[i].passengers,
                                cachedResponse.outwardSegments[j].passengers);
                            cachedResponse.outwardSegments[j].cabinClass = updateSegmentLayout(upgradeResponse.acceptedSegments[i].id, cabinLayout,
                                cachedResponse.outwardSegments[j].cabinClass);
                        }
                        j++;
                    }
                    j = 0;
                    while (!segmentFound && j < cachedResponse.returnSegments.length) {
                        if (upgradeResponse.acceptedSegments[i].id === cachedResponse.returnSegments[j].id) {
                            segmentFound = true;
                            cachedResponse.returnSegments[j].passengers = updatePassengerInfo(upgradeResponse.acceptedSegments[i].passengers,
                                cachedResponse.returnSegments[j].passengers);
                            cachedResponse.returnSegments[j].cabinClass = updateSegmentLayout(upgradeResponse.acceptedSegments[i].id, cabinLayout,
                                cachedResponse.returnSegments[j].cabinClass);
                        }
                        j++;
                    }
                }
            }

            return cachedResponse;

            function updatePassengerInfo(upgradePasInfo, segmentInfo) {
                var pasFound = false, pasIndex = 0, segmentPasIndex = 0;
                upgradePasInfo = upgradePasInfo || [];
                segmentInfo = segmentInfo || [];
                for (pasIndex = 0; pasIndex < upgradePasInfo.length; pasIndex++) {
                    pasFound = false; segmentPasIndex = 0;
                    while (!pasFound && segmentPasIndex < segmentInfo.length) {
                        if (upgradePasInfo[pasIndex].id === segmentInfo[segmentPasIndex].id) {
                            pasFound = true;
                            if (upgradePasInfo[pasIndex].seat) {
                                segmentInfo[segmentPasIndex].seat = {
                                    'row': upgradePasInfo[pasIndex].seat.row,
                                    'column': upgradePasInfo[pasIndex].seat.column
                                };
                            }
                        }
                        segmentPasIndex++;
                    }
                }
                return segmentInfo;
            }

            function updateSegmentLayout(segmentId, offerCabinsLayout, actualCabinClass) {
                var found = false, segmentIndex = 0;
                offerCabinsLayout = offerCabinsLayout || [];
                while (!found && segmentIndex < offerCabinsLayout.length) {
                    if (segmentId === offerCabinsLayout[segmentIndex].segment) {
                        found = true;
                        angular.copy(offerCabinsLayout[segmentIndex].cabinClass, actualCabinClass);
                    }
                    segmentIndex++;
                }
                return actualCabinClass;
            }
        }
    }
})();
