'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-disruption-flight-change-date-module - factories', function () {
    var fakeMmBUtilService = {
        getCompanyURL: function(){
            return 'airLogoRouteURI';
        },
        getDateFormatted: function (day, month, year) {
            var parsedDay = day < 10 ? '0' + day : day;
            var parsedMonth = month < 10 ? '0' + month : month;
            return year + '-' + parsedMonth + '-' + parsedDay;
        }
    }

    let fakeDisruptionUtilService  = {
        checkDates: function (initDate) {
            const diff = 100 - initDate;

            if (diff < 2) {
                return true;
            }
            return false;
        }
    }

    var fakeService = {
        initializeModel: function(){
            return {};
        }
    }
    var fakeMmBAppConstants = {
        WARNING_MESSAGES: {
            OVERNIGHT_WARNING: 'SSE_AVM_20003',
            TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
            AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
            LONG_WAITING_WARNING: 'SSE_AVM_20004',
            MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014'
        },
        FLIGHTS_TYPES: {
            'DIRECT': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
            'INDIRECT': 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
        },
        CALENDAR_POSITION: {
            'LEFT': 'bottom-left',
            'RIGHT': 'bottom-right'
        }
    }

    var flowId = {
        'availabilityFlexRequest' : {
            'flowId': ' '
        }
    }

    var fakeLocalStorageService = {
        'get' : jasmine.createSpy('get').and.callFake(function(){
            return flowId;
        }),
    };
    var fakeStrategy = {
        initializeDateOptions : function (){
            return {}; 
        }
    }
    describe('test for DisruptionFlightChangeDateTransformer', function () {

        var DisruptionFlightChangeDateTransformer;
        var MmBUtilService;
        var MmBAppConstants;
        var localStorageService;
        var service;

        beforeEach(function () {
            angular.mock.module('ib-disruption-flight-change-date-module', function ($provide) {
                $provide.value('MmBUtilService', fakeMmBUtilService);
                $provide.value('MmBAppConstants', fakeMmBAppConstants);
                $provide.value('localStorageService', fakeLocalStorageService);
                $provide.value('service', fakeService);
                $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            });
            inject(function (_DisruptionFlightChangeDateTransformer_) {
                DisruptionFlightChangeDateTransformer = _DisruptionFlightChangeDateTransformer_;
            });

        });

        it('DisruptionFlightChangeDateTransformer should be defined', function () {

            expect(DisruptionFlightChangeDateTransformer).toBeDefined();
        });
     
        it('test for initializeBaseModel()', () =>  {
            const flightsModel = {'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':{'MADMRU20210703165000':{'disrupted':true,'originalOD':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'departureCity':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'},'arrivalCity':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrivalDateParsed':{'dateTime':'11:20','weekDay':'WEEKDAY_SUNDAY','day':4,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-04T11:20:00+02:00','formatedDate':'04/07/2021'},'type':'REGULAR','duration':1110,'stopsNumber':1,'overnight':true,'departureCountry':'ES','arrivalCountry':'GB','index':0,'position':0,'calendarPosition':'bottom-left','newDateSelected':null,'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}}},'flightsNumber':1,'optional':0,'slices':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0}],'quadrigam':'IBICHC','searchAvailable':false,'routeDatepicker':'web-manage-my-booking/templates/ib-mmb-datepicker.html','numberFlights':2,'slicesId':['MADMRU20210703165000'],'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}};
            const maxDate = '2022-05-31T11:27:27.003Z'

            DisruptionFlightChangeDateTransformer.initializeBaseModel(flightsModel, maxDate);

            expect(flightsModel.searchAvailable).toBe(false);
            expect(flightsModel.numberFlights).toBe(0);
        });

        it('test for getCalendarPosition()', () =>  {
            const pos = DisruptionFlightChangeDateTransformer.getCalendarPosition(0);

            expect(pos).toBe('bottom-left');
        });

        it('test for adjustReturnFlightDates()', () =>  {
            const flightsModel = {'slicesId':[0, 1], 'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':[{'calendarPosition': 'bottom-left', 'newDateSelected': null, 'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}, 'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'}}, {'calendarPosition': 'bottom-left', 'newDateSelected': null, 'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}, 'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'}}]};
            
            DisruptionFlightChangeDateTransformer.adjustReturnFlightDates(flightsModel, 1, true);

            expect(flightsModel.flowId).toBe('TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D');
            expect(flightsModel.flights[0].calendarPosition).toBe('bottom-left');
            expect(flightsModel.flights[0].newDateSelected).toBe(null);
        });
   
        it('test 1 for DisruptionFlightChangeDateTransformer.initializeModel', function () {

            var object1 = {'model':{'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':{'MADMRU20210703165000':{'disrupted':true,'originalOD':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'departureCity':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'},'arrivalCity':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrivalDateParsed':{'dateTime':'11:20','weekDay':'WEEKDAY_SUNDAY','day':4,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-04T11:20:00+02:00','formatedDate':'04/07/2021'},'type':'REGULAR','duration':1110,'stopsNumber':1,'overnight':true,'departureCountry':'ES','arrivalCountry':'GB','index':0}},'flightsNumber':1,'optional':0,'slices':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0}],'quadrigam':'IBICHC'},'quadrigam':'IBICHC','dateSelectorNumber':1,'blackOutPeriodsData':{'blackOutPeriods':[],'maxDate':'2022-05-31T11:27:27.003Z','allowedPeriods':[]},'blackOutPeriodsText':'','allowedPeriods':'','sisterCitiesData':{'hasSisterCitiesPossibility':false,'sisterCitiesModel':{},'sisterCitiesOptionChecked':false},'genericDisruption':{'id':1,'flightDateRange':'10','dateLimitBookingSearch':'29/07/2021'},'rawSlicesInfo':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0},{'sliceId':'MRUMAD20210713212500','type':'REGULAR','departureDateTime':'2021-07-13 21:25','arrivalDateTime':'2021-07-14 16:35','duration':1150,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrival':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7603','operationalFlightNumber':'2062','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760320210713','duration':605,'waitingTime':0,'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-13 21:25','departureUtcDateTime':'2021-07-13T19:25:00.000','arrivalDateTime':'2021-07-14 06:30','arrivalUtcDateTime':'2021-07-14T05:30:00.000','status':{'code':'HK','description':'Confirmado'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7462','operationalFlightNumber':'0460','operationalDisclosure':'BA','aircraft':{'code':'320','description':'Airbus A320'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB746220210714','duration':150,'waitingTime':395,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 6 h 35 m en Londres, HEATHROW, (LHR)'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a GATWICK (LGW) - Salida de HEATHROW (LHR)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-14 13:05','departureUtcDateTime':'2021-07-14T12:05:00.000','arrivalDateTime':'2021-07-14 16:35','arrivalUtcDateTime':'2021-07-14T14:35:00.000','status':{'code':'HK','description':'Confirmado'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':true},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},{'type':'CONTACT_DATA_MODIFICATION','enabled':true},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},{'type':'PASSENGER_NAME_CORRECTION','enabled':true},{'type':'ANCILLARIES','enabled':true},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'numSlicesTotal':2,'indexTotal':1}]}
            var flightsModel = {'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':{'MADMRU20210703165000':{'disrupted':true,'originalOD':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'departureCity':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'},'arrivalCity':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrivalDateParsed':{'dateTime':'11:20','weekDay':'WEEKDAY_SUNDAY','day':4,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-04T11:20:00+02:00','formatedDate':'04/07/2021'},'type':'REGULAR','duration':1110,'stopsNumber':1,'overnight':true,'departureCountry':'ES','arrivalCountry':'GB','index':0,'position':0,'calendarPosition':'bottom-left','newDateSelected':null,'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}}},'flightsNumber':1,'optional':0,'slices':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0}],'quadrigam':'IBICHC','searchAvailable':false,'routeDatepicker':'web-manage-my-booking/templates/ib-mmb-datepicker.html','numberFlights':2,'slicesId':['MADMRU20210703165000'],'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}};
            var maxDate = '2022-05-31T11:27:27.003Z'
            var ret = DisruptionFlightChangeDateTransformer.initializeModel(object1, flightsModel, maxDate, false, fakeStrategy);

            expect(ret.flowId).toBe('TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D');
            expect(ret.flights.MADMRU20210703165000.disrupted).toBe(true);
            expect(ret.flights.MADMRU20210703165000.type).toBe('REGULAR');
            expect(ret.flights.MADMRU20210703165000.duration).toBe(1110);
            expect(ret.flights.MADMRU20210703165000.stopsNumber).toBe(1);
            expect(ret.flights.MADMRU20210703165000.overnight).toBe(true);
            expect(ret.flights.MADMRU20210703165000.index).toBe(0);
            expect(ret.flights.MADMRU20210703165000.position).toBe(0);
            expect(ret.flights.MADMRU20210703165000.calendarPosition).toBe('bottom-left');
            expect(ret.flights.MADMRU20210703165000.newDateSelected).toBe(null);
            expect(ret.flightsNumber).toBe(1);
        });

        it('test 2 for DisruptionFlightChangeDateTransformer.initializeModel', function () {

            var object1 = {'model':{'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':{'MADMRU20210703165000':{'disrupted':true,'originalOD':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'departureCity':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'},'arrivalCity':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrivalDateParsed':{'dateTime':'11:20','weekDay':'WEEKDAY_SUNDAY','day':4,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-04T11:20:00+02:00','formatedDate':'04/07/2021'},'type':'REGULAR','duration':1110,'stopsNumber':1,'overnight':true,'departureCountry':'ES','arrivalCountry':'GB','index':0}},'flightsNumber':1,'optional':'MADMRU20210703165000','slices':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0}],'quadrigam':'IBICHC'},'quadrigam':'IBICHC','dateSelectorNumber':1,'blackOutPeriodsData':{'blackOutPeriods':[],'maxDate':'2022-05-31T11:27:27.003Z','allowedPeriods':[]},'blackOutPeriodsText':'','allowedPeriods':'','sisterCitiesData':{'hasSisterCitiesPossibility':false,'sisterCitiesModel':{},'sisterCitiesOptionChecked':false},'genericDisruption':{'id':1,'flightDateRange':'10','dateLimitBookingSearch':'29/07/2021'},'rawSlicesInfo':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0},{'sliceId':'MRUMAD20210713212500','type':'REGULAR','departureDateTime':'2021-07-13 21:25','arrivalDateTime':'2021-07-14 16:35','duration':1150,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrival':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7603','operationalFlightNumber':'2062','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760320210713','duration':605,'waitingTime':0,'warnings':[{'code':'SSE_ORM_20003','description':'Vuelo nocturno'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-13 21:25','departureUtcDateTime':'2021-07-13T19:25:00.000','arrivalDateTime':'2021-07-14 06:30','arrivalUtcDateTime':'2021-07-14T05:30:00.000','status':{'code':'HK','description':'Confirmado'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7462','operationalFlightNumber':'0460','operationalDisclosure':'BA','aircraft':{'code':'320','description':'Airbus A320'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB746220210714','duration':150,'waitingTime':395,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 6 h 35 m en Londres, HEATHROW, (LHR)'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a GATWICK (LGW) - Salida de HEATHROW (LHR)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-14 13:05','departureUtcDateTime':'2021-07-14T12:05:00.000','arrivalDateTime':'2021-07-14 16:35','arrivalUtcDateTime':'2021-07-14T14:35:00.000','status':{'code':'HK','description':'Confirmado'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':true},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':true},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':true},{'type':'CONTACT_DATA_MODIFICATION','enabled':true},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':true},{'type':'PASSENGER_NAME_CORRECTION','enabled':true},{'type':'ANCILLARIES','enabled':true},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':false},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'numSlicesTotal':2,'indexTotal':1}]}
            var flightsModel = {'flowId':'TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D','flights':{'MADMRU20210703165000':{'optionalEnabled': true, 'disrupted':true,'originalOD':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'departureCity':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'departureDateParsed':{'dateTime':'16:50','weekDay':'WEEKDAY_SATURDAY','day':3,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-03T16:50:00+02:00','formatedDate':'03/07/2021'},'arrivalCity':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'arrivalDateParsed':{'dateTime':'11:20','weekDay':'WEEKDAY_SUNDAY','day':4,'monthNumber':7,'month':'MONTH_JULY','year':2021,'originalDate':'2021-07-04T11:20:00+02:00','formatedDate':'04/07/2021'},'type':'REGULAR','duration':1110,'stopsNumber':1,'overnight':true,'departureCountry':'ES','arrivalCountry':'GB','index':0,'position':0,'calendarPosition':'bottom-left','newDateSelected':null,'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}}},'flightsNumber':1,'optional':'MADMRU20210703165000','slices':[{'sliceId':'MADMRU20210703165000','type':'REGULAR','departureDateTime':'2021-07-03 16:50','arrivalDateTime':'2021-07-04 11:20','duration':1110,'stopsNumber':1,'segments':[{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'MAD','name':'BARAJAS','terminal':'4S','city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'LHR','name':'HEATHROW','terminal':'5','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'departureCity':{'code':'MAD','description':'Madrid','countryCode':'ES','timeZone':'Europe/Madrid'},'arrivalCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'IB','name':'Iberia'},'marketingFlightNumber':'3166','operationalFlightNumber':'3166','operationalDisclosure':'IB','aircraft':{'code':'359','description':'Airbus A350-900'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':false,'id':'IB316620210703','duration':145,'waitingTime':0,'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 16:50','departureUtcDateTime':'2021-07-03T14:50:00.000','arrivalDateTime':'2021-07-03 18:15','arrivalUtcDateTime':'2021-07-03T17:15:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}},{'type':'CONFIRMED','mmbAllowed':true,'ckiStatus':{'code':'CHECKABLE','message':null},'noShow':false,'flyNow':false,'flown':false,'departure':{'code':'LGW','name':'GATWICK','terminal':'S','city':{'code':'LON','description':'Londres','countryCode':'GB','country':{'code':'GB','description':'Reino Unido'}}},'arrival':{'code':'MRU','name':'SIR S. RAMGOOLAM INTL','terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureCity':{'code':'LON','description':'Londres','countryCode':'GB','timeZone':'Europe/London'},'arrivalCity':{'code':'MRU','description':'Mauricio','countryCode':'MU','timeZone':'Africa/Johannesburg'},'flight':{'marketingCarrier':{'code':'IB','name':'Iberia'},'operationalCarrier':{'code':'BA','name':'British Airways'},'marketingFlightNumber':'7604','operationalFlightNumber':'2063','operationalDisclosure':'BA','aircraft':{'code':'777','description':'Boeing 777 Passenger'}},'cabin':{'rbd':'B','description':'','remainingSeats':0,'fareFamily':'TFLESEU','code':'R','type':'ECONOMY','bookingClass':'ECONOMY'},'overnight':true,'id':'IB760420210703','duration':830,'waitingTime':135,'warnings':[{'code':'SSE_ORM_20004','description':'Espera 2 h 15 m en Londres, GATWICK, (LGW)'},{'code':'SSE_ORM_20003','description':'Vuelo nocturno'},{'code':'SSE_ORM_20001','description':'Cambio de aeropuerto: Llegada a HEATHROW (LHR) - Salida de GATWICK (LGW)'}],'operatorLocator':null,'stop':null,'departureDateTime':'2021-07-03 20:30','departureUtcDateTime':'2021-07-03T19:30:00.000','arrivalDateTime':'2021-07-04 11:20','arrivalUtcDateTime':'2021-07-04T09:20:00.000','status':{'code':'TK','description':'Confirmado con un nuevo horario'}}],'overnight':true,'passengerFlags':[{'passengerId':'ADULT_01','flags':[{'type':'FLIGHT_MODIFICATION','enabled':false},{'type':'FLIGHT_REFUND','enabled':false},{'type':'FREQUENT_FLYER_MODIFICATION','enabled':false},{'type':'SPECIAL_NEEDS_MODIFICATION','enabled':false},{'type':'CONTACT_DATA_MODIFICATION','enabled':false},{'type':'EMERGENCY_CONTACT_MODIFICATION','enabled':false},{'type':'PASSENGER_NAME_CORRECTION','enabled':false},{'type':'ANCILLARIES','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH_FLEXIBLE','enabled':false},{'type':'FLIGHT_MODIFICATION_FLEXIBLE','enabled':false},{'type':'FLIGHT_DISRUPTION_SEARCH','enabled':true},{'type':'FLIGHT_MODIFICATION_ON_DEMAND','enabled':false}]}],'originalDisruptionSliceInformation':{'departure':{'code':'MAD','name':null,'terminal':null,'city':{'code':'MAD','description':'Madrid','countryCode':'ES','country':{'code':'ES','description':'España'}}},'arrival':{'code':'MRU','name':null,'terminal':null,'city':{'code':'MRU','description':'Mauricio','countryCode':'MU','country':{'code':'MU','description':'Islas Mauricio'}}},'departureDateTime':'2021-07-03 14:50','arrivalDateTime':'2021-07-04 09:20'},'numSlicesTotal':2,'indexTotal':0}],'quadrigam':'IBICHC','searchAvailable':false,'routeDatepicker':'web-manage-my-booking/templates/ib-mmb-datepicker.html','numberFlights':2,'slicesId':['MADMRU20210703165000'],'dateOptions':{'showWeeks':false,'maxMode':'day','minDate':'2021-05-31T10:48:17.087Z','maxDate':'2022-05-31T10:43:07.315Z'}};
            var maxDate = '2022-05-31T11:27:27.003Z'
            var ret = DisruptionFlightChangeDateTransformer.initializeModel(object1, flightsModel, maxDate, false, fakeStrategy);

            expect(ret.flowId).toBe('TWFuYWdlTXlCb29raW5nQElCYjkyOWYwYTBmZGFjNGNkOWE4ODczMzdlY2YzZTc2MWY%3D');
            expect(ret.flights.MADMRU20210703165000.disrupted).toBe(true);
            expect(ret.flights.MADMRU20210703165000.type).toBe('REGULAR');
            expect(ret.flights.MADMRU20210703165000.duration).toBe(1110);
            expect(ret.flights.MADMRU20210703165000.stopsNumber).toBe(1);
            expect(ret.flights.MADMRU20210703165000.overnight).toBe(true);
            expect(ret.flights.MADMRU20210703165000.index).toBe(0);
            expect(ret.flights.MADMRU20210703165000.position).toBe(0);
            expect(ret.flights.MADMRU20210703165000.calendarPosition).toBe('bottom-left');
            expect(ret.flights.MADMRU20210703165000.newDateSelected).toBe(null);
            expect(ret.flightsNumber).toBe(1);
        });

        it('test for DisruptionFlightChangeDateTransformer.transformerDateSelected', function () {
            var ret = DisruptionFlightChangeDateTransformer.transformerDateSelected(new Date('2020-06-02T22:00:00.000Z'));
            expect(ret.month).toEqual(6);
            expect(ret.year).toEqual(2020);
        });

        it('test for DisruptionFlightChangeDateTransformer.generateRequestFlexibilization', function () {

            var sisterCitiesModel = {
                origin: {
                    originSisterCities: [{
                        code:'Madrid',
                        isSelected: true
                    }]
                },
                destination: {
                    destinationSisterCities: [{
                        code:'Bilbao',
                        isSelected: true
                    }]
                }
            }
            var object1 = {
                MADBIO20200618074000: {
                    disrupted: true,
                    departureCity: {
                        code: 'MAD',
                        name: 'Madrid',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    departureDateParsed: {
                        dateTime: '07:40',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 18,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2020,
                        originalDate: '2020-06-18T07:40:00+02:00',
                        formatedDate: '18/06/2020'
                    },
                    arrivalCity: {
                        code: 'BIO',
                        name: 'Bilbao',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrivalDateParsed: {
                        dateTime: '08:40',
                        weekDay: 'WEEKDAY_THURSDAY',
                        day: 18,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2020,
                        originalDate: '2020-06-18T08:40:00+02:00',
                        formatedDate: '18/06/2020'
                    },
                    type: 'REGULAR',
                    duration: 60,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    overnight: false,
                    index: 0,
                    position: 0,
                    calendarPosition: 'bottom-left',
                    newDateSelected: '2020-06-02T22:00:00.000Z',
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    },
                    parseNewDateSelected: {
                        day: 3,
                        month: 6,
                        year: 2020,
                        weekDay: 3
                    }
                },
                BIOMAD20200619175000: {
                    disrupted: false,
                    optionalEnabled: true,
                    departureCity: {
                        code: 'BIO',
                        name: 'Bilbao',
                        terminal: null,
                        city: {
                            code: 'BIO',
                            description: 'Bilbao',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    departureDateParsed: {
                        dateTime: '17:50',
                        weekDay: 'WEEKDAY_FRYDAY',
                        day: 19,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2020,
                        originalDate: '2020-06-19T17:50:00+02:00',
                        formatedDate: '19/06/2020'
                    },
                    arrivalCity: {
                        code: 'MAD',
                        name: 'Madrid',
                        terminal: '4',
                        city: {
                            code: 'MAD',
                            description: 'Madrid',
                            countryCode: 'ES',
                            country: {
                                code: 'ES',
                                description: 'España'
                            }
                        }
                    },
                    arrivalDateParsed: {
                        dateTime: '19:00',
                        weekDay: 'WEEKDAY_FRYDAY',
                        day: 19,
                        monthNumber: 6,
                        month: 'MONTH_JUNE',
                        year: 2020,
                        originalDate: '2020-06-19T19:00:00+02:00',
                        formatedDate: '19/06/2020'
                    },
                    type: 'REGULAR',
                    duration: 70,
                    stopsNumber: 0,
                    price: {
                        fare: 192.05,
                        currency: 'EUR'
                    },
                    overnight: false,
                    index: 1,
                    position: 1,
                    calendarPosition: 'bottom-right',
                    newDateSelected: '2020-06-16T22:00:00.000Z',
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: '2020-06-02T22:00:00.000Z',
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        },
                        initDate: '2020-06-02T22:00:00.000Z'
                    },
                    parseNewDateSelected: {
                        day: 17,
                        month: 6,
                        year: 2020,
                        weekDay: 3
                    }
                }
            }
            var ret;
            var spy1 = spyOn(fakeMmBUtilService, 'getDateFormatted');
            spy1.withArgs(3, 6, 2020).and.returnValue('2020-06-03');
            spy1.withArgs(17, 6, 2020).and.returnValue('2020-06-17');

            ret = DisruptionFlightChangeDateTransformer.generateRequestFlexibilization(object1, 'TWFuYWdlTXlCb29raW5nQElCOTk5Nzc5ZWVjNTk3NGI2N2E0ZWQyZGIyOTBjOGRjNzM%3D', sisterCitiesModel);

            function resultMatcher1() {
                return {
                    asymmetricMatch: function (result) {
                        var equals = true;
                        equals = equals && result.flowId === 'TWFuYWdlTXlCb29raW5nQElCOTk5Nzc5ZWVjNTk3NGI2N2E0ZWQyZGIyOTBjOGRjNzM%3D';
                        equals = equals && result.slices[0].sliceId === 'MADBIO20200618074000';
                        equals = equals && result.slices[0].date === '2020-06-03';
                        equals = equals && result.slices[1].sliceId === 'BIOMAD20200619175000';
                        equals = equals && result.slices[1].date === '2020-06-17';
                        return equals;
                    }
                }
            };
            expect(ret).toEqual(resultMatcher1());
        });
    });
});