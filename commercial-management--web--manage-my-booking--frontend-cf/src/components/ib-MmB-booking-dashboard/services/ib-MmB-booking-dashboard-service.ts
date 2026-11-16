import angular from 'angular';
import dayjs from 'dayjs';
import { MmBModalService } from '@src/components/ib-reusable-components/ib-MmB-modal/services/ib-MmB-modal-service';
import { BookingSearchService } from '@src/components/services/ib-booking-search-service';
import { CallApisFormService } from '@src/components/services/ib-call-apis-form-service';
import { ChangeOrderContactInfoService } from '@src/components/services/ib-change-order-contact-info-service';
import { ChangeOrderPersonalInfoService } from '@src/components/services/ib-change-order-personal-info-service';
import { ChangePassengerSpecialNeedsService } from '@src/components/services/ib-change-special-needs-service';
import { CountriesListService } from '@src/components/services/ib-countries-service';
import { FrequentFlyersCompaniesService } from '@src/components/services/ib-frequent-flyers-companies-service';
import { StatesListService } from '@src/components/services/ib-states-service';
import { MmBUtilService } from '@src/components/services/Utils/ib-MmB-utils';
import { UpdateSpecialNeedsTransformer } from '../transformer/ib-MmB-update-special-needs-transformer';
import { UpdateApisRequestTransformer } from '../transformer/ib-MmB-update-apis-request-transformer';
import { UpdateDataContactDataTransformer } from '../transformer/ib-MmB-update-data-contact-data-transformer';
import { ApisFormTransformer } from '../transformer/ib-MmB-apis-form-transformer';
import { ModalServiceAncillaries } from 'ib-web-ancillaries/dist/app/features/components/ib-modal/services/ib-modal-ancillaries-service';

@Service(
    'ib-MmB-booking-dashboard-module',
    ['$rootScope', 'BookingDashboardTransformer', 'localStorageService', 'ChangeOrderContactInfoService','ChangeOrderPersonalInfoService', 'CallApisFormService', 'FrequentFlyersCompaniesService', 'CountriesListService', 'StatesListService', 'ChangePassengerSpecialNeedsService', 'BookingSearchService', 'MmBModalService', 'AncillariesTransformer', 'MmBUtilService', 'CommonsAncillariesService', 'IBCContactDataService', 'IBCTravelPreferencesService', 'IBCTripDocumentsService', 'UpdateMemberService', 'IBCPersonalDataService', 'IBCContactDetailsService', 'MmBAppConstants', '$location', 'ModalServiceAncillaries', 'UpdateSpecialNeedsTransformer', 'UpdateApisRequestTransformer', 'UpdateDataContactDataTransformer', 'ApisFormTransformer'],
    [])
export class BookingDashboardService {
    constructor (
        private $rootScope: any,
        private BookingDashboardTransformer,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private ChangeOrderContactInfoService: ChangeOrderContactInfoService,
        private ChangeOrderPersonalInfoService: ChangeOrderPersonalInfoService,
        private CallApisFormService: CallApisFormService,
        private FrequentFlyersCompaniesService: FrequentFlyersCompaniesService,
        private CountriesListService: CountriesListService,
        private StatesListService: StatesListService,
        private ChangePassengerSpecialNeedsService: ChangePassengerSpecialNeedsService,
        private BookingSearchService: BookingSearchService,
        private MmBModalService: MmBModalService,
        private AncillariesTransformer,
        private MmBUtilService: MmBUtilService,
        private CommonsAncillariesService: CommonsAncillariesService,
        private IBCContactDataService: IBCContactDataService,
        private IBCTravelPreferencesService: IBCTravelPreferencesService,
        private IBCTripDocumentsService: IBCTripDocumentsService,
        private UpdateMemberService: UpdateMemberService,
        private IBCPersonalDataService: IBCPersonalDataService,
        private IBCContactDetailsService: IBCContactDetailsService,
        private MmBAppConstants,
        private $location: angular.ILocationService,
        private ModalServiceAncillaries: ModalServiceAncillaries,
        private UpdateSpecialNeedsTransformer: UpdateSpecialNeedsTransformer,
        private UpdateApisRequestTransformer: UpdateApisRequestTransformer,
        private UpdateDataContactDataTransformer: UpdateDataContactDataTransformer,
        private ApisFormTransformer: ApisFormTransformer) {}

    ////////////////

    /**
     * Makes the call to the airlines rest services and transform the booking info in the object nedded for the view
     * @returns {Object<Promise>} a promise that when it is resolve returns the page view object transformed. In case of error rejects
     *  with the error object to show in the view.
     */
    initializeDashboard = () => {
        return new Promise((resolve, reject) => {
            let ancillariesInfo, bookingInfo = this.localStorageService.get('bookingInfo'), bookingInfoTransformed, breakdownInfo;
            this.$rootScope.timeSession.startTime = dayjs();

            if (bookingInfo != null) {
                ancillariesInfo = this.localStorageService.get('ancillariesInfo');
                breakdownInfo = this.localStorageService.get('breakdownInfo');
                bookingInfoTransformed = this.BookingDashboardTransformer.transformBookingDashBoardInfo(bookingInfo, ancillariesInfo, breakdownInfo);
                resolve(bookingInfoTransformed);

            } else {
                const surname: string = this.localStorageService.get('checkinSurname') || this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.SURNAME);
                const pnr: string = this.localStorageService.get('PNR') || this.MmBUtilService.getURLFirstParameterByName(this.MmBAppConstants.URL_PARAMETERS.LOCATOR);
                if (!pnr || !surname) {
                    this.$location.path(this.MmBAppConstants.PAGES_URL.SEARCH);
                } else if(!this.localStorageService.get('bookingInfoLight')) {
                    this.BookingSearchService.searchFlightsPassengers(surname, pnr).then((bookingData) => {
                        this.localStorageService.set('bookingInfo', bookingData);
                        bookingInfo = bookingData;
                        resolve(this.BookingDashboardTransformer.transformBookingDashBoardInfo(bookingInfo));
                    }, (error) => {
                        reject(error);
                    });
                }
            }
        });
    };

    /**
     * Restore data after the user went to login for permanent user
     */
    recoverDashboardDataAfterLogin = () => {
        const bookingInfo = this.localStorageService.get('bookingInfo');
        const ancillariesInfo = this.localStorageService.get('ancillariesInfo');
        const breakdownInfo = this.localStorageService.get('breakdownInfo');
        const haveInsurance = this.localStorageService.get('selectInsurance');
        const insuranceSelected = this.localStorageService.get('insuranceSelected');
        const bookingInfoTransformed = this.BookingDashboardTransformer.transformBookingDashBoardInfo(bookingInfo, ancillariesInfo, breakdownInfo);

        if (haveInsurance) {
            bookingInfoTransformed.insurance = insuranceSelected;
            bookingInfoTransformed.selectedInsurance = insuranceSelected;
        }
        return bookingInfoTransformed;
    };


    updateDataContactInfo = (flowId, contactInfo, type) => {
        return new Promise((resolve, reject) => {
            var dataContactInfo = this.UpdateDataContactDataTransformer.transformUpdateDataContactData(contactInfo, type);
            this.ChangeOrderContactInfoService.changeOrderContactInfo(dataContactInfo, flowId).then((data) => resolve(data), (error) => reject(error));
        });
    };

    updateDataPersonalInfo = (flowId, personalInfo, type) => {
        return new Promise((resolve, reject) => {
            var dataPersonalInfo = this.transformUpdateDataPersonalData(personalInfo, type);
            this.ChangeOrderPersonalInfoService.changeOrderPersonalInfo(dataPersonalInfo, flowId).then((data) => resolve(data), (error) => reject(error));
        });
    };

    private transformUpdateDataPersonalData = (passengerPersonalInfo, type) => {
        let orderPersonalInfo;
        if (type === 'personalInfo') {
            orderPersonalInfo = {
                passengerId: '',
                personalInfo: {}
            };
            orderPersonalInfo.passengerId = passengerPersonalInfo.passengerId;
            orderPersonalInfo.personalInfo = passengerPersonalInfo.personalInfo;
        }
        return orderPersonalInfo;
    }

    updatePassengerSpecialNeeds = (flowId, passenger) => {
        return new Promise((resolve, reject) => {
            const updatePassengerSpecialNeedsSuccess = (data) => {
                this.localStorageService.set('specialNeedsPassengers', dataSpecialNeeds.specialNeeds);
                this.localStorageService.set('specialNeedsPassengersEdit', passenger.passengerId);
                resolve(data);
            };
            const updatePassengerSpecialNeedsError = (error) => {
                reject(error);
            };

            var dataSpecialNeeds = this.UpdateSpecialNeedsTransformer.transformUpdateSpecialNeeds(passenger);
            this.ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(dataSpecialNeeds, flowId).then(updatePassengerSpecialNeedsSuccess, updatePassengerSpecialNeedsError);
        });
    };

    /**
     * Given a passengerId and a flowId, calls http service to get APIs form data
     * @param {*} flowId flow identificator
     * @param {*} passId passenger identificator
     * @returns promise object
     */
    callApisService = (flowId, passId) => {
        return new Promise((resolve, reject) => {
            const getApisSuccess = (data) => {
                apisFormInfo = data;
                this.FrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised().then(getCompaniesSuccess, serviceError);
            };

            const getCompaniesSuccess = (data) => {
                companiesList = data;
                this.CountriesListService.getCountriesList().then(getCountriesSuccess, serviceError);
            };

            const getCountriesSuccess = (data) => {
                countriesList = data;
                this.StatesListService.getStatesList('US').then(getStatesSuccess, serviceError);
            };

            const getStatesSuccess = (data) => {
                statesList = data;
                resolve(this.ApisFormTransformer.transformApisForm(apisFormInfo, companiesList, countriesList, statesList));
            };

            const serviceError = (error) => {
                reject(error);
            };

            let apisFormInfo = {}, companiesList, countriesList = [], statesList = [];
            this.CallApisFormService.getApisInfo(flowId, passId).then(getApisSuccess, serviceError);
        });
    };

    /**
     * Call http service to update APIs data of the selected passenger
     * @param {*string} flowId flow identificator
     * @param {*object} passApisInfo APIs information introduced by the user
     * @param {*string} passId passenger Identificator
     * @param {*object} emergencyContactInfo Emergency contact information saved by the user
     * @returns {*object} promise object
     */
    updateApisInfo = (flowId, passApisInfo, emergencyContactInfo, passengers) => {
        return new Promise((resolve, reject) => {
            this.CallApisFormService.updateApisInfo(flowId, this.UpdateApisRequestTransformer.generateUpdateApisRequest(passApisInfo, emergencyContactInfo, passengers)).then(function () {
                resolve(null);
            }, (error) => {
                reject(error);
            });
        });
    };


    /**
     * Create request with ancillaries selected and call service
     * @param {Array} passengerBaggages
     * @param {Array} passengerSpeqs
     * @param {Object} insuranceInfo
     */
    updateAncillariesInfo = (passengerBaggages, passengerSpeqs, insuranceInfo) => {
        return new Promise((resolve, reject) => {
            let params = { passengerBaggages, passengerSpeqs, insuranceInfo, resolve, reject};
            if (!insuranceInfo && this.localStorageService.get('hasSelectedInsurance')) {
                this.localStorageService.set('hasSelectedInsurance', false);
            } else {
                this.cancelInsuranceSuccess(params);
            }

        });
    };

    private cancelInsuranceSuccess = (params) => {
        let { passengerBaggages, passengerSpeqs, insuranceInfo, resolve, reject } = params;
        const allianzFusion: any = this.localStorageService.get('insuranceAllianzFusionPassengerInfo');
        let infoTransformed;
        if (allianzFusion && allianzFusion.type) {
            insuranceInfo = allianzFusion;
        }
        if (this.isBaggSpeqsOrInsurance(passengerBaggages, passengerSpeqs, insuranceInfo)) {
            infoTransformed = this.AncillariesTransformer.buildAncillariesRequest(passengerBaggages, passengerSpeqs, insuranceInfo);
            if (infoTransformed.length > 0) {
                this.CommonsAncillariesService.updateAncillaries(infoTransformed).then((data) => this.updateAncillariesSuccess(data, resolve, reject), (error) => this.updateAncillariesError(error, reject));
            } else {
                this.updateAncillariesSuccess(null, resolve, reject);
            }
        } else {
            this.updateAncillariesSuccess(null, resolve, reject);
        };
    };

    private updateAncillariesSuccess = (selectedCountry, resolve, reject) => {
        const locator = this.localStorageService.get('PNR');
        const getCountriesSuccess = (countriesList) => {
            selectedCountry = selectedCountry || countriesList[0];
            this.StatesListService.getStatesList(selectedCountry && selectedCountry.code ? selectedCountry.code : countriesList && countriesList[0] ? countriesList[0].code : null).then(getStatesSuccess, getStatesSuccess);
        };
        const getStatesSuccess = () => {
            this.CommonsAncillariesService.getAncillarieSummary(undefined, null, locator).then(getSummarySuccess, (error) => this.showServiceError(error, reject));
        };

        const getSummarySuccess = (breakDownInfo) => {
            this.localStorageService.set('breakdownInfo', breakDownInfo);
            resolve({});
        };
        this.CountriesListService.getCountriesList().then(getCountriesSuccess, () => {
            getCountriesSuccess([]);
        });
    };

    private showServiceError = (error, reject) => {
        this.MmBModalService.showGenericError(error, false, false);
        reject(error);
    };

    private updateAncillariesError = (error: any, reject: any) => {
        this.ModalServiceAncillaries.openAncillariesErrorModal(
            {
                title: 'ERROR_ANCILLARIES_MMB_TO_PAYMENT_TITLE',
                message: 'ERROR_ANCILLARIES_MMB_TO_PAYMENT_BODY',
                flowApp: this.MmBAppConstants.flowName
            });
            reject(error);
    };


    private isBaggSpeqsOrInsurance = (passengerBaggages, passengerSpeqs, insuranceInfo) => {
        return (passengerBaggages.length > 0 || passengerSpeqs.length > 0 || insuranceInfo);
    };


    /**
    * This function call at ancillariesSummary service. Its neccesary call after  each delete ancillaries to update
    * the breakdownInfo data.
    */
    updateAncillarieSummary = () => {
        return new Promise((resolve, reject) => {
            const getSummarySuccess = (breakDownInfo) => {
                this.localStorageService.set('breakdownInfo', breakDownInfo);
                resolve({});
            };

            const showServiceError = (error) => {
                reject(error);
            };
            const locator = this.localStorageService.get('PNR');
            this.CommonsAncillariesService.getAncillarieSummary(undefined, null, locator).then(getSummarySuccess, showServiceError);
        });
    };

    updateContactDetails = (reqContactData) => {
        return new Promise((resolve, reject) => {
            const updateContactDetailsSuccess = (res) => {
                resolve(res);
            };
            const updateContactDetailsFailed = (err) => {
                reject(err);
            };

            var reqContact = this.generateUpdataContactDetails(reqContactData);
            this.IBCContactDataService.updateContactData(reqContact).then(updateContactDetailsSuccess, updateContactDetailsFailed);
        });
    };

    private generateUpdataContactDetails = (formvalue) => {
        const userData: any = this.localStorageService.get('contactDataInfo');
        const contact = {
            email: formvalue.email,
            countryCode: userData.countryCode,
            city: userData.city,
            postalCode: userData.postalCode,
            province: userData.province
        };

        return contact;
    };

    /**
     * Función genérica para manejar promesas de servicios y reducir duplicación.
     * @param serviceMethod función que retorna una promesa (servicio)
     * @param onSuccess función opcional para procesar el resultado antes de resolver
     * @param onError función opcional para procesar el error antes de rechazar
     */
    private handleServicePromise = (serviceMethod, onSuccess?, onError?) => {
        return new Promise((resolve, reject) => {
            serviceMethod().then(
                (res) => {
                    if (onSuccess) {
                        onSuccess(res, resolve);
                    } else {
                        resolve(res);
                    }
                },
                (err) => {
                    if (onError) {
                        onError(err, reject);
                    } else {
                        reject(err);
                    }
                }
            );
        });
    };

    getContactData = () => {
        return this.handleServicePromise(
            () => this.IBCContactDataService.getContactData(),
            (res, resolve) => resolve(res.data)
        );
    };

    getTravelPreferences = () => {
        return this.handleServicePromise(
            () => this.IBCTravelPreferencesService.getTravelPreferences()
        );
    };

    updateTravelPreferences = (travelPreferencesData, data) => {
        return new Promise((resolve, reject) => {
            const updateTravelPreferencesSuccess = (res) => {
                resolve(res);
            };
            const updateTravelPreferencesFailed = (err) => {
                reject(err);
            };

            let travelPreferences = this.generteTravelPreferences(travelPreferencesData, data);
            this.IBCTravelPreferencesService.updateTravelPreferences(travelPreferences).then(updateTravelPreferencesSuccess, updateTravelPreferencesFailed);
        });
    };

    private generteTravelPreferences = (travelPreferencesData, data) => {

        let ironSide = '00';

        if (travelPreferencesData.check_chair.$modelValue === true) {
            ironSide = this.getIronSide(travelPreferencesData.accessible_wheelchair.$modelValue);
        }

        const travelPreferences = {
            airportCode: data.airportCode || '',
            seatPreference: data.seatPreference || '03',
            dietPreference: data.dietPreference || '00',
            blind: travelPreferencesData.check_vision.$modelValue !== undefined ? travelPreferencesData.check_vision.$modelValue : false,
            deaf: travelPreferencesData.check_hearing.$modelValue !== undefined ? travelPreferencesData.check_hearing.$modelValue : false,
            svan: travelPreferencesData.check_dog.$modelValue !== undefined ? travelPreferencesData.check_dog.$modelValue : false,
            wheelChair: ironSide
        };

        return travelPreferences;
    }

    private getIronSide = (data): string => {
        let ironSide = '00';
        switch (data) {
            case 'WCHR':
                ironSide = '01';
                break;
            case 'WCHS':
                ironSide = '02';
                break;
            case 'WCHC':
                ironSide = '03';
                break;
            default:
                break;
        }
        return ironSide;
    }

    getTripDocuments = () => {
        return this.handleServicePromise(
            () => this.IBCTripDocumentsService.getTripDocuments()
        );
    };

    addTripDocument = (data) => {
        return this.handleServicePromise(
            () => this.IBCTripDocumentsService.addTripDocument(data)
        );
    };

    modifyTripDocument = (data) => {
        return this.handleServicePromise(
            () => this.IBCTripDocumentsService.modifyTripDocument(data, data.id)
        );
    };

    deleteTripDocument = (data) => {
        return this.handleServicePromise(
            () => this.IBCTripDocumentsService.deleteTripDocument(data)
        );
    };


    updateMember = (data) => {
        return this.handleServicePromise(
            () => this.UpdateMemberService.updateMember(this.generteMemberDate(data))
        );
    };

    private generteMemberDate = (data) => {

        const memberDetails = this.localStorageService.get('memeberDetails');

        const memberData = {
            termsAndConditions: {
                version: memberDetails[0].data.termsAndConditions.version,
                acceptedDate: memberDetails[0].data.termsAndConditions.acceptedDate
            },
            person: {
                dateOfBirth: data.basicInfo.birthDate.year + '-' + data.basicInfo.birthDate.month + '-' + data.basicInfo.birthDate.day,
                gender: data.basicInfo.gender,
                nationality: data.basicInfo.nationality,
                countryOfResidence: data.basicInfo.homeCountry,
                email: {
                    type: 'PERSONAL',
                    email: memberDetails[0].data.person.emailAddress.email
                }

            }
        };

        return memberData;
    }

    getPersonalData = () => {
        return this.handleServicePromise(
            () => this.IBCPersonalDataService.getPersonalData(),
            (res, resolve) => resolve(res.data)
        );
    };

    updatePersonalData = (data, gender) => {
        return this.handleServicePromise(
            () => this.IBCPersonalDataService.updatePersonalData(this.genReqPersonData(data, gender))
        );
    };

    private genReqPersonData = (data, gender) => {
        data.gender = gender;
        return data;
    }

    getContactDetailsData = () => {
        return this.handleServicePromise(
            () => this.IBCContactDetailsService.getContactDetailsData()
        );
    };

    updateContactDetailsData = (data) => {
        return this.handleServicePromise(
            () => this.IBCContactDetailsService.updateContactDetailsData(data)
        );
    };

    deleteAllInsurance = (model) => {
        model.ancillariesInfo.insurance = null;
        model.ancillariesInfo.selectedInsurance = null;
        this.localStorageService.remove('selectInsurance');
    };

    /**
     * Elimina todos los elementos de un tipo ancillary (baggages o speqs) de forma genérica.
     * @param model Modelo principal
     * @param tripsKey Clave de los trips (ej: 'passengerBaggagesTrips' o 'passengerSpeqsTrips')
     * @param quantyKey Clave de la cantidad total (ej: 'baggagesQuanty' o 'speqsQuanty')
     * @param tripChoosedKey Clave de la cantidad elegida en el trip (ej: 'piecesChoosed' o 'speqsChoosed')
     */
    private resetAncillaryItems = (model, tripsKey, quantyKey, tripChoosedKey) => {
        angular.forEach(model.ancillariesInfo[tripsKey], (passenger) => {
            angular.forEach(passenger.trips, (trip) => {
                angular.forEach(trip.pieces, (piece) => {
                    trip[tripChoosedKey] = 0;
                    piece.quantySelected = 0;
                });
            });
        });
        model.ancillariesInfo[quantyKey] = 0;
        this.localStorageService.set(tripsKey, model.ancillariesInfo[tripsKey]);
    };

    /**
     * Delete ALL BAGGAGES
     */
    deleteAllBaggages = (model) => {
        this.resetAncillaryItems(model, 'passengerBaggagesTrips', 'baggagesQuanty', 'piecesChoosed');
    };

    /**
     * Delete ALL SPEQS
     */
    deleteAllSpeqs = (model) => {
        this.resetAncillaryItems(model, 'passengerSpeqsTrips', 'speqsQuanty', 'speqsChoosed');
    };

    deleteAllPriorityBoarding = (model) => {
        if (model?.ancillariesInfo?.priorityBoardingInfo) {
            this.localStorageService.set('selectedPriorityBoarding', null);
            this.localStorageService.set('totalPricePriorityBoarding', 0);
            model.ancillariesInfo.priorityBoardingInfo.confirmed = false;
            model.ancillariesInfo.priorityBoardingInfo?.info.map(item =>{
                item.trips.map(trip =>{
                    if (trip.checkedTrip === true) {
                        trip.checkedTrip = false;
                    }
                });
            });
        }
    }

    deleteAllSeats = () => {
        const headerModel:any = this.localStorageService.get('headerModel');
        const breakdownInfo:any = this.localStorageService.get('breakdownInfo');
        let seatsSelectedInfoData:any = this.localStorageService.get('seatsSelectedInfoData');
        let pendingSeats = [], freeSeats = [], issuedSeats = [];
        if (!seatsSelectedInfoData) {
            let paramsSeatsSelectedInfoData = {}; 
            this.handlePendingSeats(breakdownInfo, pendingSeats);
            this.handleFreeSeats(breakdownInfo, freeSeats);
            this.handleIssuedSeats(breakdownInfo, issuedSeats);
            paramsSeatsSelectedInfoData = { headerModel, breakdownInfo, pendingSeats, freeSeats, issuedSeats, seatsSelectedInfoData };
            this.setSeatsSelectedInfoData(paramsSeatsSelectedInfoData);
        }
        if (headerModel?.headerModel?.shoppingBasket?.seats?.hasSeats) {
            headerModel.headerModel.shoppingBasket.seats?.segments.map(segment => {
                segment.seats.map(seat => {
                    seat.passengers.map(passenger => {
                        this.deleteSeatPassenger(passenger, segment);
                    });
                });
            });
        };
    };

    private setSeatsSelectedInfoData = (paramsSeatsSelectedInfoData) => {
        let { headerModel, breakdownInfo, pendingSeats, freeSeats, issuedSeats, seatsSelectedInfoData } = paramsSeatsSelectedInfoData;

        headerModel?.headerModel?.shoppingBasket?.seats?.segments.map(segment => {
            let paramsMapBreakDownInfo = { segment, breakdownInfo, pendingSeats, freeSeats, issuedSeats, seatsSelectedInfoData };
            this.mapBreakDownInfo(paramsMapBreakDownInfo);
        });
    };

    private mapBreakDownInfo = (paramsMapBreakDownInfo) => {
        let { segment, breakdownInfo, pendingSeats, freeSeats, issuedSeats, seatsSelectedInfoData } = paramsMapBreakDownInfo;
        breakdownInfo?.context?.passengers.map(passengerContext => {
            let row = '', column = '';
            let paramsFilter = { segment, passengerContext, row, column };
            this.handleFilter(pendingSeats, paramsFilter);
            // let freerow = '', freecolumn = '';
            this.handleFilter(freeSeats, paramsFilter);
            this.handleFilter(issuedSeats, paramsFilter);

            let objectPassengersInfo = {
                "id": passengerContext.id,
                "name": passengerContext.name + ' ' + passengerContext.surname,
                "type": passengerContext.passengerType,
                "infant": null,
                "initialSeat": {
                    "row": '',
                    "column": '',
                    "cabinIndex": 1,
                    "rowIndex": 0,
                    "columnIndex": 0,
                    "seatTypeDescription": '',
                    "seatType": '',
                    "selected": ''
                },
                "currentSeat": {
                    "row": row,
                    "column": column,
                    "cabinIndex": 1,
                    "rowIndex": 0,
                    "columnIndex": 0,
                    "seatTypeDescription": '',
                    "seatType": '',
                    "selected": '',
                    "originalType": ''
                },
                'seatPrice': 5,
                'isInitialSeat': true,
                'seatPriceFormatted': "5,00€",
            };

            let objectSeat = {
                "segmentId": segment.segmentId,
                "passengers": [],
                "passengersInfo": [],
                "id": segment.segmentId
            };

            if (!seatsSelectedInfoData){
                seatsSelectedInfoData = {};
                seatsSelectedInfoData[segment.segmentId] = objectSeat;
            } else if (!seatsSelectedInfoData[segment.segmentId]) {
                seatsSelectedInfoData[segment.segmentId] = objectSeat;
            }

            seatsSelectedInfoData[segment.segmentId].passengersInfo.push(objectPassengersInfo);
            this.localStorageService.set('seatsSelectedInfoData', seatsSelectedInfoData);
        })
    };

    private handleFilter = (array, paramsFilter) => {
        array.filter((item) => {
            let params = { item, segment: paramsFilter.segment, passengerContext: paramsFilter.passengerContext, row: paramsFilter.row, column: paramsFilter.column };
            this.setRowColumn(params);
        });
    };

    private handlePendingSeats = (breakdownInfo, pendingSeats) => {
        breakdownInfo?.pendingPaymentItems.map(item => {
            item.segments?.map(segment => {
                segment.passengers?.map(passenger => {
                    pendingSeats.push({segmentId: segment.id, id: passenger.id, seat: passenger.seat});
                });
            });
        });
    };

    private handleFreeSeats = (breakdownInfo, freeSeats) => {
        breakdownInfo?.freeItems?.map(freeitems => {
            freeitems.segments?.map(segment => {
                segment.passengers.map(passenger => {
                    freeSeats.push({segmentId: segment.id, id: passenger.id, seat: passenger.seat});
                });
            });
        });
    };

    private handleIssuedSeats = (breakdownInfo, issuedSeats) => {
        breakdownInfo?.issuedItems?.map(issueditems => {
            issueditems.segments?.map(segment => {
                segment.passengers.map(passenger => {
                    issuedSeats.push({segmentId: segment.id, id: passenger.id, seat: passenger.seat});
                });
            });
        });
    };

    private setRowColumn = (params) => {
        if (params.item.segmentId === params.segment.segmentId && params.item.id === params.passengerContext.id) {
            params.row = params.item.seat.row;
            params.column = params.item.seat.column;
        };
    };

    private deleteSeatPassenger = (passenger, segment) => {
        if (passenger.amount > 0 || passenger.amount === undefined){
            this.$rootScope.$broadcast('deleteSeats', {
                amount: 1,
                seats: [
                    {
                        'segments': [
                            {
                                'id': segment.segmentId,
                                'passengers': [
                                    {
                                        'id': passenger.id,
                                        'seat': null
                                    }
                                ]
                            }
                        ],
                        'type': 'SEAT'
                    }
                ],
                deleteAll: true
            });
        };
    };

};
