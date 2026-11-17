(function () {
    'use strict';

    angular
        .module('ib-boarding-cards-module')
        .factory('BoardingCardsTransformer', BoardingCardsTransformer);

    BoardingCardsTransformer.$inject = ['CkiDatalayerUtilsService', 'CkiDatalayerConstants', '$filter', 'localStorageService', 'BoardingCardsConstants', 'CheckinAppConstants', 'IbUtilsService', 'IbBoardingCardsPrintTransformer', 'CheckinFlowService'];
    function BoardingCardsTransformer (CkiDatalayerUtilsService, CkiDatalayerConstants, $filter, localStorageService, BoardingCardsConstants, CheckinAppConstants, IbUtilsService, IbBoardingCardsPrintTransformer, CheckinFlowService) {
        const service = {
            transformBoardingCardsView: transformBoardingCardsView,
            createAskForBoardingCardsRequest: createAskForBoardingCardsRequest,
            transformPrintedBoardingCards: transformPrintedBoardingCards,
            getSelectedChannels: getSelectedChannels,
            transformInfoInhibitCards: transformInfoInhibitCards
        };
        return service;

        ////////////////
        function transformBoardingCardsView (boardingInfo, passengersContactData, prefixes) {
            const boardingCardsViewObject = createBoardingCardsViewObject();
            const actualFormats = [], actualPassengers = [], deviceType = IbUtilsService.getDeviceType();
            const { defaultPhoneCode, prefixList } = createPrefixList(prefixes);
            boardingCardsViewObject.prefixList = prefixList;
            boardingCardsViewObject.documents = boardingInfo.documents ?? [];

            for (let i = 0; i < boardingInfo.documents.length; i++) {
                switch (boardingInfo.documents[i].type) {
                        case BoardingCardsConstants.DOCS_TYPES.BOARDING_CARD:
                            boardingCardsViewObject.formatsList = createBoardingCardsInfo({
                                documents: boardingInfo.documents[i],
                                boardingCardsViewObject,
                                actualFormats,
                                actualPassengers,
                                passengersContactData,
                                defaultPhoneCode,
                                deviceType
                            });
                            break;
                }
            }

            // We see if we have to activate biometric flow after calling createBoardingCardsInfo
            updateBiometricFlags(boardingCardsViewObject.passengersStatusBySegment);

            localStorageService.set('showBiometric', boardingCardsViewObject.showBiometric);

            const { channelsList, showEmail, showPhone } = createChannelsInfo(boardingInfo.channels);

            boardingCardsViewObject.channelsList = channelsList;
            boardingCardsViewObject.showEmail = showEmail;
            boardingCardsViewObject.showPhone = showPhone;

            return boardingCardsViewObject;
        }

        function createBoardingCardsInfo ({
            documents,
            boardingCardsViewObject,
            actualFormats,
            actualPassengers,
            passengersContactData,
            defaultPhoneCode,
            deviceType
        }) {
            // let isMonopax = false
            let formatsList = [], formatSelected = false;
            const passengerStatusBySegmentCollection = [];

            for (let j = 0; j < documents.segments.length; j++) {
                if (boardingCardsViewObject.segmentsList.indexOf(documents.segments[j].id) === -1) {
                    boardingCardsViewObject.segmentsList.push(documents.segments[j].id);
                }
                processPassengerStatuses({
                    segment: documents.segments[j],
                    passengerStatusBySegmentCollection,
                    boardingCardsViewObject
                });

                for (let k = 0; k < documents.segments[j].formats.length; k++) {
                    const format = documents.segments[j].formats[k];

                    if (!canAddFormat(
                        format,
                        actualFormats,
                        documents.segments
                    )) {
                        continue;
                    }

                    formatsList.push(createFormatDetails(format));
                }
                addSegmentPassengers({
                    segmentPassengers: documents.segments[j].passengers,
                    actualPassengers,
                    passengersList: boardingCardsViewObject.passengersList,
                    passengersContactData,
                    defaultPhoneCode
                });
            }

            formatsList = $filter('orderBy')(formatsList, 'priority');
            if (!formatSelected && formatsList.length > 0) {
                formatsList[0].isSelected = true;
            }
            boardingCardsViewObject.indexPassengerSelected = 0;

            return formatsList;

            function createFormatDetails (type) {
                const newFormatInfo = {
                    type: type,
                    class: BoardingCardsConstants.FORMATS[type].classes,
                    description: BoardingCardsConstants.FORMATS[type].description,
                    isSelected: deviceType === BoardingCardsConstants.FORMATS[type].deviceType,
                    priority: BoardingCardsConstants.FORMATS[type].priority
                };
                formatSelected = formatSelected || newFormatInfo.isSelected;
                actualFormats.push(type);
                return newFormatInfo;
            }
        }

        function getPassengerInfo (passengers, passengersContactData, index, defaultPhoneCode) {
            const passengerInfo = passengers[index];

            addPassengerContactData(
                passengerInfo,
                passengerInfo.id,
                passengersContactData
            );

            if (!passengerInfo.phone) {
                passengerInfo.phone = {
                    countryCode: defaultPhoneCode
                };
            }
            const infant = findPassengerInfant(passengers, passengers[index].id);

            if (infant) {
                passengerInfo.infant = infant;
            }

            return passengerInfo;
        }

        function addPassengerContactData (
            passengerInfo,
            passengerId,
            passengersContactData
        ) {
            if (!passengersContactData) {
                return;
            }

            for (let contactIndex = 0; contactIndex < passengersContactData.length; contactIndex++) {
                if (passengersContactData[contactIndex].id === passengerId) {
                    if (passengersContactData[contactIndex].email) {
                        passengerInfo.email = passengersContactData[contactIndex].email;
                    }

                    if (passengersContactData[contactIndex].phone) {
                        passengerInfo.phone = passengersContactData[contactIndex].phone;
                    }
                }
            }
        }

        function findPassengerInfant (passengers, passengerId) {
            for (let passengerIndex = 0; passengerIndex < passengers.length; passengerIndex++) {
                if (
                    passengers[passengerIndex].type === CheckinAppConstants.PASSENGERS_TYPES.INFANT &&
                    passengers[passengerIndex].id.split('_')[0] === passengerId
                ) {
                    return passengers[passengerIndex];
                }
            }

            return null;
        }

        function addSegmentPassengers ({
            segmentPassengers,
            actualPassengers,
            passengersList,
            passengersContactData,
            defaultPhoneCode
        }) {
            for (let k = 0; k < segmentPassengers.length; k++) {
                if (actualPassengers.indexOf(segmentPassengers[k].id) === -1) {
                    if (segmentPassengers[k].type !== CheckinAppConstants.PASSENGERS_TYPES.INFANT) {
                        actualPassengers.push(segmentPassengers[k].id);

                        passengersList.push(
                            getPassengerInfo(
                                segmentPassengers,
                                passengersContactData,
                                k,
                                defaultPhoneCode
                            )
                        );
                    }
                }
            }
        }

        function createChannelsInfo (channels) {
            let channelsList = [];
            let channelSelected = false;
            let showEmail = false;
            let showPhone = false;

            for (let i = 0; i < channels.length; i++) {
                channelsList.push({
                    type: channels[i],
                    class: BoardingCardsConstants.CHANNELS[channels[i]].classes,
                    description: BoardingCardsConstants.CHANNELS[channels[i]].description,
                    isSelected: channels[i] === BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD,
                    priority: BoardingCardsConstants.CHANNELS[channels[i]].priority
                });

                if (channels[i] === BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD) {
                    channelSelected = true;
                }
            }

            channelsList = $filter('orderBy')(channelsList, 'priority');

            if (!channelSelected && channelsList.length > 0) {
                channelsList[0].isSelected = true;

                if (channelsList[0].type === BoardingCardsConstants.CHANNELS_NAMES.EMAIL) {
                    showEmail = true;
                } else if (channelsList[0].type === BoardingCardsConstants.CHANNELS_NAMES.SMS) {
                    showPhone = true;
                }
            }

            return {
                channelsList,
                showEmail,
                showPhone
            };
        }

        function createPrefixList (prefixes) {
            let createdPrefixes;
            let defaultPhoneCode;

            if (prefixes !== null) {
                createdPrefixes = prefixes.slice();
            }

            if (createdPrefixes && createdPrefixes.length > 0) {
                defaultPhoneCode = angular.copy(createdPrefixes[0].code);
                createdPrefixes.shift();
            }

            return {
                prefixList: createdPrefixes,
                defaultPhoneCode
            };
        }

        function createAskForBoardingCardsRequest (boardingCardsModel, overrideModel) {
            const dataLayerFormatsList = [];
            let requestBoardingCards = [];
            const boardingCardsModelUpdated = updateBoardingCardModelWithOverride(boardingCardsModel, overrideModel);
            const createSharingListContext = {
                channels: boardingCardsModelUpdated.channelsList,
                passengers: boardingCardsModelUpdated.passengersList,
                segments: boardingCardsModelUpdated.segmentsList,
                selectedTab: boardingCardsModelUpdated.selectedTab,
                selectedPassengerIndex: boardingCardsModelUpdated.indexPassengerSelected
            };
            const sharingsList = createSharingsList(createSharingListContext);
            const formats = getRequestFormats(boardingCardsModel);
            requestBoardingCards  = createCompleteRequest(formats, sharingsList, dataLayerFormatsList);
            const downloadFormat = createDataLayerFormats(dataLayerFormatsList);
            const bpType = createBPType(sharingsList);
            //Set dataLayer object for download formats
            /* INIT DELETE GA4 MIGRATION*/
            const datalayerObject = {};
            datalayerObject[CkiDatalayerConstants.DATALAYER_INFO.DOWNLOAD_FORMAT] = downloadFormat;
            datalayerObject[CkiDatalayerConstants.DIGITAL_DATA_INFO.BP_TYPE] = bpType;
            CkiDatalayerUtilsService.addDataLayerInfo(datalayerObject);
            /* FIN DELETE GA4 MIGRATION*/
            const extendedDigitalDataInfo = {};
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.DOWNLOAD_FORMAT] = downloadFormat;
            extendedDigitalDataInfo[CkiDatalayerConstants.DIGITAL_DATA_INFO.BP_TYPE] = bpType;
            CkiDatalayerUtilsService.addDigitalDataInfo(extendedDigitalDataInfo);

            return requestBoardingCards;
        }

        function getRequestFormats (boardingCardsModel) {
            if (boardingCardsModel.channelsList[0].isSelected) {
                return boardingCardsModel.formatsList;
            }

            return boardingCardsModel.downloadFormatSelected;
        }

        function createBPType (sharingsList) {
            const arrChannel = [];
            if(Array.isArray(sharingsList)) {
                sharingsList.forEach(element => {
                    if(element?.channel) {
                        arrChannel.push(element.channel);
                    }
                });
            }

            return (arrChannel.length > 0) ? arrChannel.join(',').toLowerCase() : '';
        }

        function createCompleteRequest (formatsList, formatedSharings, dataLayerFormatsList) {
            const boardingRequest = [];
            formatsList.push({
                type: BoardingCardsConstants.FORMATS_NAMES.NATIVE,
                isSelected: true
            });
            for (let i = 0; i < formatsList.length; i++) {
                if (formatsList[i].isSelected) {
                    dataLayerFormatsList.push(formatsList[i].type);
                    boardingRequest.push({
                        format: formatsList[i].type,
                        sharings: formatedSharings
                    });
                }
            }
            return boardingRequest;
        }

        function createDataLayerFormats (selectedFormats) {
            const supportedFormats = [
                BoardingCardsConstants.FORMATS_NAMES.PDF,
                BoardingCardsConstants.FORMATS_NAMES.QR,
                BoardingCardsConstants.FORMATS_NAMES.PASSBOOK,
                BoardingCardsConstants.FORMATS_NAMES.GOOGLE_WALLET
            ];

            return supportedFormats
                .filter(format => selectedFormats.indexOf(format) !== -1)
                .map(format => BoardingCardsConstants.FORMATS[format].dataLayer)
                .join('|');
        }

        function transformPrintedBoardingCards (printedBoardingCardsData, printBoardingCards) {
            let returnPrintedBoardingCards = getPrintedBoardingCardsToStore(
                printedBoardingCardsData,
                printBoardingCards
            );

            if (printedBoardingCardsData.printed && returnPrintedBoardingCards.length !== 0) {
                localStorageService.set('printBoardingCards', returnPrintedBoardingCards);
            } else if (returnPrintedBoardingCards.length === 0) {
                returnPrintedBoardingCards = printedBoardingCardsData.printed;
                localStorageService.set('printBoardingCards', returnPrintedBoardingCards);
            }
            if (localStorageService.get('printBoardingCards')) {
                printedBoardingCardsData.printed = localStorageService.get('printBoardingCards');
            }
            const printedBoardingCardsDataMap = IbBoardingCardsPrintTransformer.getPrintedInformation(printedBoardingCardsData);
            localStorageService.set('confirmationInfo', printedBoardingCardsDataMap);
            return returnPrintedBoardingCards;
        }

        function getPrintedBoardingCardsToStore (printedBoardingCardsData, printBoardingCards) {
            let i, j, notPush;
            const printedBoardingCards = [];

            for (i = 0; i < printedBoardingCardsData.printed.length; i++) {
                notPush = false;

                for (j = 0; j < printBoardingCards.length; j++) {
                    if (printedBoardingCardsData.printed[i].format === printBoardingCards[j].format) {
                        notPush = true;
                    }
                }

                if (!notPush) {
                    printedBoardingCards.push(printedBoardingCardsData.printed[i]);
                }
            }

            return printedBoardingCards;
        }

        function getSelectedChannels (channels) {
            const selectedChannels = {
                email: false,
                sms: false,
                download: false
            };
            for (let i = 0; i < channels.length; i++) {
                switch (channels[i].channel) {
                        case BoardingCardsConstants.CHANNELS_NAMES.EMAIL:
                            selectedChannels.email = true;
                            break;
                        case BoardingCardsConstants.CHANNELS_NAMES.SMS:
                            selectedChannels.sms = true;
                            break;
                        case BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD:
                            selectedChannels.download = true;
                            break;
                }
            }
            return selectedChannels;
        }

        function transformInfoInhibitCards (error) {
            const data = BoardingCardsConstants.MODEL_INHIBIT;
            const segmentsSelected = localStorageService.get('segmentsSelected');
            const acceptInfoSegments = localStorageService.get('acceptInfoSegments');
            let passengers = [];
            const seatList = [];
            let passenger = null;
            let existSeeAgent = false;

            for (let i = 0; i < segmentsSelected.length; i++) {
                const segment = segmentsSelected[i];
                updateAirCheckStatus(segment, data);

                passenger = processPassengerInhibitions(segment, data);

                if (hasAcceptedSegments(acceptInfoSegments)) {
                    const acceptedSegmentResult = processAcceptedSegment({
                        segment,
                        acceptedSegments: acceptInfoSegments.acceptedSegments,
                        passengers,
                        seatList,
                        existSeeAgent,
                        passenger
                    });

                    existSeeAgent = acceptedSegmentResult.existSeeAgent;
                    passengers = acceptedSegmentResult.passengers;
                }

                delete segment.passengersStatus;
                checkSeatInfoConfirmation(segment);
                continue;
            }

            updateSeeAgentInhibition(existSeeAgent, error, data);

            checkPriorityInhibit(
                data.inhibitBoardingCard.reason,
                data,
                error,
                segmentsSelected
            );

            return data;
        }

        function createSharingsList ({ channels, passengers, segments, selectedTab, selectedPassengerIndex }) {
            let sharingsIndex = 0, downloadAdded = false;
            const sharings = [], passengersInSegments = angular.copy(passengers);

            passengers = getPassengersToProcess(
                passengers,
                selectedTab,
                selectedPassengerIndex
            );

            const passengersList = getPassengersList(passengersInSegments);

            for (let i = 0; i < passengers.length; i++) {
                for (let j = 0; j < channels.length; j++) {
                    if (!canCreateSharing(channels[j], downloadAdded)) {
                        continue;
                    }

                    if (channels[j].type === BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD) {
                        downloadAdded = true;
                    }
                    sharings[sharingsIndex] = createSharing({
                        channel: channels[j],
                        passenger: passengers[i],
                        passengersCount: passengers.length,
                        passengersList,
                        segments
                    });
                    if (channels[j].type === BoardingCardsConstants.CHANNELS_NAMES.EMAIL && passengers[i].email) {
                        sharings[sharingsIndex].email = passengers[i].email;
                    }
                    if (hasValidSmsData(channels[j], passengers[i])) {
                        sharings[sharingsIndex].phone = {
                            countryCode: passengers[i].phone.countryCode.code,
                            number: passengers[i].phone.number
                        };
                    }
                    sharingsIndex++;
                }
            }

            return sharings;
        }

        function createSharing ({
            channel,
            passenger,
            passengersCount,
            passengersList,
            segments
        }) {
            return {
                channel: channel.type,
                segments: getSegmentsList(
                    passengersCount <= 1 ||
                    channel.type === BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD
                        ? passengersList
                        : getPassengersIds(passenger),
                    segments
                )
            };
        }

        function getPassengersToProcess (passengers, selectedTab, selectedPassengerIndex) {
            if (selectedTab === 0) {
                return [passengers[selectedPassengerIndex]];
            }

            return passengers;
        }

        function getPassengersList (passengers) {
            const passengersList = [];

            for (let j = 0; j < passengers.length; j++) {
                passengersList.push(passengers[j].id);

                if (passengers[j].infant) {
                    passengersList.push(passengers[j].infant.id);
                }
            }

            return passengersList;
        }

        function updateBoardingCardModelWithOverride (boardingCardsModel, overrideModel) {
            if (!overrideModel) return boardingCardsModel;

            const passengerInfo = boardingCardsModel.passengersList.find(pax => pax.id === overrideModel.passengerId);

            return {
                ...boardingCardsModel,
                passengersList: [passengerInfo],
                segmentsList: [overrideModel.segmentId]
            };
        }

        function hasValidSmsData (channel, passenger) {
            return channel.type === BoardingCardsConstants.CHANNELS_NAMES.SMS &&
                passenger.phone &&
                passenger.phone.countryCode &&
                passenger.phone.countryCode.code &&
                passenger.phone.number;
        }

        function canCreateSharing (channel, downloadAdded) {
            const isDownloadChannel = channel.type === BoardingCardsConstants.CHANNELS_NAMES.DOWNLOAD;

            return channel.isSelected &&
                (
                    !isDownloadChannel ||
                    (isDownloadChannel && !downloadAdded)
                );
        }

        function getPassengersIds (actualPassenger) {
            const pasIds = [actualPassenger.id];

            if (!actualPassenger.infant) {
                return pasIds;
            }

            pasIds.push(actualPassenger.infant.id);

            return pasIds;
        }

        function getSegmentsList (pas, seg) {
            const transformedSegmentsList = [];
            for (let k = 0; k < seg.length; k++) {
                transformedSegmentsList.push({
                    id: seg[k],
                    passengers: pas
                });
            }
            return transformedSegmentsList;
        }

        function createBoardingCardsViewObject () {
            return {
                prefixList: [],
                formatsList: [],
                channelsList: [],
                passengersList: [],
                segmentsList: [],
                downloadFormatSelected: [],
                indexPassengerSelected: null,
                showEmail: false,
                showPhone: false,
                showBiometric: true,
                selectedTab: 0,
                documents: []
            };
        }

        function buildLitAndHtml (data) {
            const modalInfo = createModalInfo();

            if (!isAircheckReady(data)) return modalInfo;

            const tagsInfo = createAircheckTagsInfo(data);
            setAircheckTextLiterals(modalInfo, tagsInfo);
            setAircheckItemLiteral(data, modalInfo, tagsInfo);

            return modalInfo;
        }

        function createModalInfo () {
            return {
                TEXT_1: $filter('translate')('MODAL_INHIBIT_BOARDING_CARD_TEXT_1_2'),
                TEXT_2: '',
                TEXT_3: '',
                TEXT_4: '',
                TEXT_5: '',
                TEXT_6: '',
                ITEM: {
                    TITLE: '',
                    TEXT: ''
                }
            };
        }

        function isAircheckReady (data) {
            return data.airCheck.status &&
                data.airCheck.airCheckDocumentationRequired &&
                data.inhibitBoardingCard.status &&
                data.inhibitBoardingCard.isAircheckReason;
        }

        function createAircheckTagsInfo (data) {
            return {
                bold: {
                    tag: 'span',
                    class: 'ib-message-box__text--bold'
                },
                link: {
                    tag: 'a',
                    href: data.airCheck.url || '',
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline ib-link--bold'
                },
                link1: {
                    tag: 'a',
                    href: '',
                    target: '_blank',
                    title: '',
                    class: 'ib-link ib-link--inline'
                }
            };
        }

        function setAircheckTextLiterals (modalInfo, tagsInfo) {
            modalInfo.TEXT_1 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_2', tagsInfo);
            modalInfo.TEXT_4 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_TITLE', tagsInfo);
            modalInfo.TEXT_5 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_3', tagsInfo);
            modalInfo.TEXT_6 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_AIRCHECK_INFO_BODY', tagsInfo);

            tagsInfo.link.class = 'ib-link';
            modalInfo.TEXT_2 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_TEXT_2', tagsInfo);
            modalInfo.TEXT_3 = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_TEXT_3', tagsInfo);
        }

        function setAircheckItemLiteral (data, modalInfo, tagsInfo) {
            const priority = data.inhibitBoardingCard.priority;

            if (priority === CheckinAppConstants.ITEMS_TYPES.UMNR) {
                setUmnrAircheckLiteral(modalInfo, tagsInfo);
            } else if (
                priority === CheckinAppConstants.ITEMS_TYPES.AVIH ||
                priority === CheckinAppConstants.ITEMS_TYPES.PETC
            ) {
                setPetAircheckLiteral(modalInfo, tagsInfo);
            }
        }

        function setUmnrAircheckLiteral (modalInfo, tagsInfo) {
            tagsInfo.link.href = $filter('NewLinksFilter')('INFO_INHIBITION_UMNR', IbUtilsService.getAppLang());
            modalInfo.ITEM.TITLE = 'UMNR_CONFIRMATION_BANNER_TITLE';
            modalInfo.ITEM.TEXT = formatTranslatedLiteral('UMNR_CONFIRMATION_BANNER_SUBTITLE', tagsInfo);
        }

        function setPetAircheckLiteral (modalInfo, tagsInfo) {
            tagsInfo.link.href = $filter('LinksFilter')('FLY_WITH_IB_PETS', IbUtilsService.getAppLang());
            modalInfo.ITEM.TITLE = 'MODAL_INHIBIT_BOARDING_CARD_AVIH_1';
            modalInfo.ITEM.TEXT = formatTranslatedLiteral('MODAL_INHIBIT_BOARDING_CARD_AVIH_2', tagsInfo);
        }

        function formatTranslatedLiteral (literal, tagsInfo) {
            return $filter('literalFormatter')($filter('translate')(literal), tagsInfo);
        }

        function checkPriorityInhibit (
            reasons,
            data,
            error,
            segmentsSelected
        ) {
            const otherCasesInhibition = [
                CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_OTHER_CASE,
                CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_SEE_AGENT
            ];
            if (reasons.length > 0) {
                const { inhibitBoardingCard, modal } = data;
                const inhibitReason = CheckinFlowService.checkInhibitReason(reasons);
                const priorityReason = CheckinFlowService.priorityInhibit(reasons);

                if (priorityReason) {
                    inhibitBoardingCard.priority = priorityReason;
                    inhibitBoardingCard.isHomogeneous = otherCasesInhibition.includes(
                        error?.internalErrorCode,
                    );
                    inhibitBoardingCard.isInhibitReason = inhibitReason.INHIBIT;
                    inhibitBoardingCard.isAircheckReason = inhibitReason.AIRCHECK;
                    inhibitBoardingCard.status = true;
                    modal.title.message = 'MODAL_INHIBIT_BOARDING_CARD_TITLE';
                    modal.title.subtitle = {
                        status: true,
                        message: 'MODAL_INHIBIT_MIX_BOARDING_CARD_SUBTITLE',
                        needsTranslate: true
                    };

                    if (inhibitReason.INHIBIT)
                        modal.message = 'MODAL_INHIBIT_MIX_BOARDING_CARD_BODY_PREVENT';
                    else if (inhibitReason.AIRCHECK)
                        modal.message = 'MODAL_INHIBIT_MIX_BOARDING_CARD_AIRCHECK_BODY';

                    data.segments = segmentsSelected;
                    data.LITERALS = buildLitAndHtml(data);
                }
            }
        }

        function checkTypeCabinClass (type) {
            let nameCabinClass = 'CKIANCPURC_CABINA_TURISTICA';
            if (type === CheckinAppConstants.CABIN_CLASS_NAME.BUSINESS) {
                nameCabinClass = 'CKIANCPURC_CABINA_BUSINESS';
            } else if (type === CheckinAppConstants.CABIN_CLASS_NAME.PREMIUMTOURIST) {
                nameCabinClass = `${$filter('translate')('CABINA_GENERAL')} ${$filter('translate')('CABINA_PREMIUM_TURIST')}`;
            }

            return nameCabinClass;
        }

        function getToSetGender (passenger) {
            const bookingInfo = localStorageService.get('bookingInfo');
            for (let i = 0; i < bookingInfo.passengers.length; i++) {
                const passenger2 = bookingInfo.passengers[i];
                if (passenger.id === passenger2.id) {
                    passenger.gender = passenger2.gender;
                }
            }
        }

        function checkSeatInfoConfirmation (originSegment) {
            const seatInfoConfirmation = localStorageService.get('seatInfoConfirmation');
            let arrSeatsSegment = [];

            if (hasValidSeatInfoConfirmation(seatInfoConfirmation, originSegment)) {
                for (let i = 0; i < seatInfoConfirmation.segments.length; i++) {
                    const segment = seatInfoConfirmation.segments[i];

                    if (segment.id === originSegment.id) {
                        originSegment.cabinClass.allSeats = '';
                        arrSeatsSegment = [];

                        syncPassengerSeats(
                            segment.passengers,
                            originSegment.passengers,
                            arrSeatsSegment
                        );

                        originSegment.cabinClass.allSeats = arrSeatsSegment.join();
                    }
                }
            }
        }

        function hasValidSeatInfoConfirmation (
            seatInfoConfirmation,
            originSegment
        ) {
            return angular.isObject(seatInfoConfirmation) &&
                angular.isObject(originSegment) &&
                angular.isArray(seatInfoConfirmation.segments) &&
                angular.isArray(originSegment.passengers);
        }

        function syncPassengerSeats (
            segmentPassengers,
            originPassengers,
            arrSeatsSegment
        ) {
            for (let j = 0; j < segmentPassengers.length; j++) {
                const passenger = segmentPassengers[j];

                for (let k = 0; k < originPassengers.length; k++) {
                    const passengerOrigin = originPassengers[k];

                    if (hasValidPassengerSeat(passenger, passengerOrigin)) {
                        passengerOrigin.accepted.seat = {
                            row: passenger.currentSeat.row,
                            column: passenger.currentSeat.column
                        };

                        arrSeatsSegment.push(
                            passenger.currentSeat.row + passenger.currentSeat.column
                        );
                    }
                }
            }
        }

        function processPassengerInhibitions (segment, data) {
            let passenger;

            for (let j = 0; j < segment.passengersStatus.length; j++) {
                passenger = segment.passengersStatus[j];

                const existReasonInhibit =
                Array.isArray(passenger.inhibitBoardingCard?.reason) &&
                passenger.inhibitBoardingCard.reason.length > 0 &&
                passenger.isSelected;

                if (existReasonInhibit) {
                    if (passenger.airCheckDocumentationRequired) {
                        data.airCheck.airCheckDocumentationRequired =
                        passenger.airCheckDocumentationRequired;
                        data.airCheck.url = segment.airCheck.url;
                    }

                    data.inhibitBoardingCard.reason = [
                        ...new Set([
                            ...data.inhibitBoardingCard.reason,
                            ...passenger.inhibitBoardingCard.reason
                        ])
                    ];

                    if (!data.inhibitBoardingCard.segment.includes(segment.id)) {
                        data.inhibitBoardingCard.segment.push(segment.id);
                    }
                }
            }

            return passenger;
        }

        function hasAcceptedSegments (acceptInfoSegments) {
            return Array.isArray(acceptInfoSegments?.acceptedSegments) &&
                acceptInfoSegments.acceptedSegments.length > 0;
        }

        function processAcceptedPassengers ({
            segmentPassengersStatus,
            acceptedPassengers,
            passengers,
            seatList,
            existSeeAgent,
            passenger
        }) {
            for (let l = 0; l < segmentPassengersStatus.length; l++) {
                const passengerS = segmentPassengersStatus[l];

                for (let m = 0; m < acceptedPassengers.length; m++) {
                    const passengerA = acceptedPassengers[m];

                    if (
                        passengerS.id !== passengerA.id ||
                        passengers.length === acceptedPassengers.length
                    ) {
                        continue;
                    }

                    existSeeAgent = processAcceptedPassengerMatch({
                        passengerS,
                        passengerA,
                        passengers,
                        seatList,
                        existSeeAgent,
                        passenger
                    });
                }
            }

            return existSeeAgent;
        }

        function processAcceptedPassengerMatch ({
            passengerS,
            passengerA,
            passengers,
            seatList,
            existSeeAgent,
            passenger
        }) {
            existSeeAgent =
                !existSeeAgent &&
                passengerA.messageStatus === 'SEE_AGENT_FOR_BP';

            passengers.push({
                id: passengerS.id,
                status: passengerS,
                accepted: passengerA
            });

            if (angular.isObject(passenger)) {
                getToSetGender(passenger);
            }

            seatList.push(buildSeatString(passengerA));

            return existSeeAgent;
        }

        function buildSeatString (passengerA) {
            let stringSeat = '';

            if (hasSeat(passengerA)) {
                stringSeat += `${passengerA.seat.row}${passengerA.seat.column}`;
            }

            if (hasExtraSeat(passengerA)) {
                stringSeat += `-${passengerA.extraSeat.row}${passengerA.extraSeat.column}`;
            }

            return stringSeat;
        }

        function processAcceptedSegment ({
            segment,
            acceptedSegments,
            passengers,
            seatList,
            existSeeAgent,
            passenger
        }) {
            for (let k = 0; k < acceptedSegments.length; k++) {
                const segmentAccepted = acceptedSegments[k];

                if (segmentAccepted.id !== segment.id) {
                    continue;
                }

                existSeeAgent = processAcceptedPassengers({
                    segmentPassengersStatus: segment.passengersStatus,
                    acceptedPassengers: segmentAccepted.passengers,
                    passengers,
                    seatList,
                    existSeeAgent,
                    passenger
                });

                segment.passengers = passengers;
                segment.cabinClass = segmentAccepted.cabinClass;

                if (seatList.length > 0) {
                    segment.cabinClass.allSeats = seatList.join(',');
                }

                segment.cabinClass.literal = checkTypeCabinClass(
                    segment.cabinClass.type
                );

                passengers = [];
            }

            return {
                existSeeAgent,
                passengers
            };
        }

        function canAddFormat (format, actualFormats, segments) {
            return actualFormats.indexOf(format) === -1 &&
                BoardingCardsConstants.FORMATS_LIST.indexOf(format) !== -1 &&
                checkInAllSegments(format, segments);
        }

        function checkInAllSegments (format, segments) {
            let isValid = true;
            angular.forEach(segments, (segment) => {
                if (segment.formats.indexOf(format) === -1) {
                    isValid = false;
                }
            });

            return isValid;
        }

        function processPassengerStatuses ({
            segment,
            passengerStatusBySegmentCollection,
            boardingCardsViewObject
        }) {
            for (let i = 0; i < segment.passengers.length; i++) {
                // isMonopax = !(segment.passengers[i].length > 0);
                if (segment.passengers[i].biometricBoardingStatus) {
                    passengerStatusBySegmentCollection.push({
                        segment: segment.id,
                        status: segment.passengers[i].biometricBoardingStatus,
                        id: segment.passengers[i].id,
                        type: segment.passengers[i].type
                    });
                    boardingCardsViewObject.passengersStatusBySegment = passengerStatusBySegmentCollection;
                }
            }
        }

        function updateSeeAgentInhibition (
            existSeeAgent,
            error,
            data
        ) {
            if (
                existSeeAgent ||
                error?.internalErrorCode ===
                    CheckinAppConstants.ERROR_CODE.BOARDING_DOCUMENT.INHIBIT_SEE_AGENT
            ) {
                data.inhibitBoardingCard.reason.push(
                    CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.SEE_AGENT_REASON
                );

                data.inhibitBoardingCard.status = true;
            }
        }

        function updateAirCheckStatus (segment, data) {
            if (!data.airCheck.status && segment?.airCheck?.status) {
                data.airCheck.status = true;
            }
        }

        function updateBiometricFlags (passengersStatusBySegment) {
            const statuses = passengersStatusBySegment?.map(
                passStatus => passStatus.status
            );

            if (hasBiometricAssociationStatus(statuses)) {
                localStorageService.set(
                    'biometricBoardingAssociation',
                    true
                );
            }

            if (hasCompleteBiometricStatus(statuses)) {
                localStorageService.set(
                    'biometricSomeComplete',
                    true
                );
            }
        }

        function hasBiometricAssociationStatus (statuses) {
            return statuses?.some(status => status === 'AVAILABLE') ||
                statuses?.some(status => status === 'AUTOMATIC_FF_AVAILABLE') ||
                statuses?.some(status => status === 'COMPLETE') ||
                statuses?.some(status => status === 'FAILED');
        }

        function hasCompleteBiometricStatus (statuses) {
            return statuses?.some(status => status === 'COMPLETE');
        }

        function hasValidPassengerSeat (
            passenger,
            passengerOrigin
        ) {
            return passenger.id === passengerOrigin.id &&
                angular.isObject(passenger.currentSeat) &&
                angular.isString(passenger.currentSeat.row) &&
                angular.isString(passenger.currentSeat.column);
        }

        function hasSeat (passenger) {
            return passenger.seat?.row &&
                passenger.seat?.column;
        }

        function hasExtraSeat (passenger) {
            return passenger.extraSeat?.row &&
                passenger.extraSeat?.column;
        }
    }
})();
