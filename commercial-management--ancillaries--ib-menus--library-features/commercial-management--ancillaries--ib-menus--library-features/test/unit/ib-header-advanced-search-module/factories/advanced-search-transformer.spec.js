// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-advanced-search-module - factories', function () {

    beforeEach(function () {
        module('ib-web-menus-module');
    });

    describe('test for advancedSearchTransformer', function () {

        var advancedSearchTransformer;
        var localStorageService;
        var AdvancedSearchConstants;
        var $rootScope;
        var $window;
        var $injector;

        beforeEach(function () {
            inject(function (_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) { 
                    clone[key] = _$injector_[key]; 
                    return clone 
                }, {});
                localStorageService = $injector.get('localStorageService');
                AdvancedSearchConstants = $injector.get('AdvancedSearchConstants');
                $rootScope = $injector.get('$rootScope');
                $window = $injector.get('$window');
                advancedSearchTransformer = $injector.get('advancedSearchTransformer');
            });
        });

        it('advancedSearchTransformer should be defined', function () {

            expect(advancedSearchTransformer).toBeDefined();
        });


        it('test for advancedSearchTransformer.initilizeAdvancedSearchModel', function () {

            var areas = [
                {
                    code: 'ES_COMM_AREA_SPAIN',
                    description: 'España',
                    cities: [
                        {
                            code: 'LCG',
                            description: 'A Coruña',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 43.3,
                            longitude: -8.383333
                        },
                        {
                            code: 'ABC',
                            description: 'Albacete',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.948333,
                            longitude: -1.863333
                        },
                        {
                            code: 'ALC',
                            description: 'Alicante',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.283333,
                            longitude: -0.55
                        },
                        {
                            code: 'LEI',
                            description: 'Almería',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 36.85,
                            longitude: -2.366666
                        },
                        {
                            code: 'OVD',
                            description: 'Asturias-Oviedo',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 43.566666,
                            longitude: -6.033333
                        },
                        {
                            code: 'BJZ',
                            description: 'Badajoz',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.883333,
                            longitude: -6.816666
                        },
                        {
                            code: 'BCN',
                            description: 'Barcelona',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.416666,
                            longitude: 2.166666
                        },
                        {
                            code: 'BIO',
                            description: 'Bilbao',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 43.3,
                            longitude: -2.916666
                        },
                        {
                            code: 'RGS',
                            description: 'Burgos',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.356895,
                            longitude: -3.633299
                        },
                        {
                            code: 'CQM',
                            description: 'Ciudad Real',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.98626,
                            longitude: -3.92907
                        },
                        {
                            code: 'CEJ',
                            description: 'Cuenca',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 40.0681156,
                            longitude: -2.1348241
                        },
                        {
                            code: 'ODB',
                            description: 'Córdoba',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 36.75,
                            longitude: 1
                        },
                        {
                            code: 'FUE',
                            description: 'Fuerteventura',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 28.45,
                            longitude: -13.866666
                        },
                        {
                            code: 'LPA',
                            description: 'Gran Canaria Las Palmas',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 27.933333,
                            longitude: -15.383333
                        },
                        {
                            code: 'GRX',
                            description: 'Granada-Jaén',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 37.183333,
                            longitude: -3.783333
                        },
                        {
                            code: 'IBZ',
                            description: 'Ibiza',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.866666,
                            longitude: 1.366666
                        },
                        {
                            code: 'XRY',
                            description: 'Jerez de la Frontera',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 36.75,
                            longitude: -6.066666
                        },
                        {
                            code: 'ACE',
                            description: 'Lanzarote',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 28.95,
                            longitude: -13.6
                        },
                        {
                            code: 'LEN',
                            description: 'León',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.594444,
                            longitude: -5.658333
                        },
                        {
                            code: 'ILD',
                            description: 'Lleida',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.728504,
                            longitude: 0.535454
                        },
                        {
                            code: 'RJL',
                            description: 'Logroño',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.456944,
                            longitude: -2.323611
                        },
                        {
                            code: 'XJR',
                            description: 'Lorca',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 37.783333,
                            longitude: -2
                        },
                        {
                            code: 'MAD',
                            description: 'Madrid',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 40.466666,
                            longitude: -3.566666
                        },
                        {
                            code: 'MLN',
                            description: 'Melilla',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 35.283333,
                            longitude: -2.95
                        },
                        {
                            code: 'MAH',
                            description: 'Menorca',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 39.866666,
                            longitude: 4.216666
                        },
                        {
                            code: 'MJV',
                            description: 'Murcia',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 37.783333,
                            longitude: -0.816666
                        },
                        {
                            code: 'AGP',
                            description: 'Málaga',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 36.666666,
                            longitude: -4.5
                        },
                        {
                            code: 'PMI',
                            description: 'Palma de Mallorca',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 39.55,
                            longitude: 2.733333
                        },
                        {
                            code: 'PNA',
                            description: 'Pamplona',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.766666,
                            longitude: -1.641666
                        },
                        {
                            code: 'PFE',
                            description: 'Ponferrada',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 37.783333,
                            longitude: 1
                        },
                        {
                            code: 'UER',
                            description: 'Puertollano',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 38.6852161,
                            longitude: -4.1111749
                        },
                        {
                            code: 'SLM',
                            description: 'Salamanca',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 40.966666,
                            longitude: -5.65
                        },
                        {
                            code: 'EAS',
                            description: 'San Sebastian',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 43.35,
                            longitude: -1.8
                        },
                        {
                            code: 'GMZ',
                            description: 'San Sebastián de la Gomera',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 28.0937998,
                            longitude: -17.1098582
                        },
                        {
                            code: 'SPC',
                            description: 'Santa Cruz de La Palma',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 28.683333,
                            longitude: -17.75
                        },
                        {
                            code: 'SDR',
                            description: 'Santander',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 43.433333,
                            longitude: -3.816666
                        },
                        {
                            code: 'SCQ',
                            description: 'Santiago de Compostela',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.9,
                            longitude: -8.416666
                        },
                        {
                            code: 'SVQ',
                            description: 'Sevilla',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 37.433333,
                            longitude: -5.9
                        },
                        {
                            code: 'XJO',
                            description: 'Soria',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.464444,
                            longitude: -2.288333
                        },
                        {
                            code: 'TCI',
                            description: 'Tenerife',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 28.316666,
                            longitude: -16.566666
                        },
                        {
                            code: 'XTJ',
                            description: 'Toledo',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 40.966666,
                            longitude: 1
                        },
                        {
                            code: 'VLC',
                            description: 'Valencia',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 39.490277,
                            longitude: -0.478611
                        },
                        {
                            code: 'VLL',
                            description: 'Valladolid',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.7,
                            longitude: -4.85
                        },
                        {
                            code: 'VDE',
                            description: 'Valverde',
                            timezone: 'Atlantic/Canary',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 27.793241,
                            longitude: -17.9413323
                        },
                        {
                            code: 'VGO',
                            description: 'Vigo',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 42.216666,
                            longitude: -8.616666
                        },
                        {
                            code: 'VIT',
                            description: 'Vitoria',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.666666,
                            longitude: 1
                        },
                        {
                            code: 'ZAZ',
                            description: 'Zaragoza',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'ES',
                                description: 'España'
                            },
                            latitude: 41.666666,
                            longitude: -1.019444
                        }
                    ]
                },
                {
                    code: 'ES_COMM_AREA_EUROPE',
                    description: 'Europa',
                    cities: [
                        {
                            code: 'AAL',
                            description: 'Aalborg',
                            timezone: 'Europe/Copenhagen',
                            country: {
                                code: 'DK',
                                description: 'Dinamarca'
                            },
                            latitude: 57.092788,
                            longitude: 9.849163
                        },
                        {
                            code: 'ABZ',
                            description: 'Aberdeen',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 57.2,
                            longitude: -2.2
                        },
                        {
                            code: 'AHO',
                            description: 'Alguero',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 43.816666,
                            longitude: 11.2
                        },
                        {
                            code: 'AMS',
                            description: 'Amsterdam',
                            timezone: 'Europe/Amsterdam',
                            country: {
                                code: 'NL',
                                description: 'Holanda'
                            },
                            latitude: 52.3,
                            longitude: 4.766666
                        },
                        {
                            code: 'ATH',
                            description: 'Atenas',
                            timezone: 'Europe/Athens',
                            country: {
                                code: 'GR',
                                description: 'Grecia'
                            },
                            latitude: 38,
                            longitude: 23.733333
                        },
                        {
                            code: 'BRI',
                            description: 'Bari',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 41.145828,
                            longitude: 16.816635
                        },
                        {
                            code: 'BIA',
                            description: 'Bastia',
                            timezone: 'Europe/Paris',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            },
                            latitude: 44.833333,
                            longitude: 1
                        },
                        {
                            code: 'BFS',
                            description: 'Belfast',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 54.65,
                            longitude: -6.21
                        },
                        {
                            code: 'BGO',
                            description: 'Bergen',
                            timezone: 'Europe/Oslo',
                            country: {
                                code: 'NO',
                                description: 'Noruega'
                            },
                            latitude: 60.293611,
                            longitude: 5.218055
                        },
                        {
                            code: 'BER',
                            description: 'Berlín',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'DE',
                                description: 'Alemania'
                            },
                            latitude: 52.533333,
                            longitude: 13.416666
                        },
                        {
                            code: 'BHX',
                            description: 'Birmingham',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 52.453889,
                            longitude: -1.748056
                        },
                        {
                            code: 'BLQ',
                            description: 'Bolonia',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 44.533333,
                            longitude: 11.3
                        },
                        {
                            code: 'BES',
                            description: 'Brest',
                            timezone: 'Europe/Paris',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            },
                            latitude: 48.44722,
                            longitude: -4.421666
                        },
                        {
                            code: 'BDS',
                            description: 'Brindisi',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 41.145828,
                            longitude: 16.816635
                        },
                        {
                            code: 'BRU',
                            description: 'Bruselas',
                            timezone: 'Europe/Brussels',
                            country: {
                                code: 'BE',
                                description: 'Bélgica'
                            },
                            latitude: 50.902777,
                            longitude: 4.483333
                        },
                        {
                            code: 'BUH',
                            description: 'Bucarest',
                            timezone: 'Europe/Bucharest',
                            country: {
                                code: 'RO',
                                description: 'Rumania'
                            },
                            latitude: 44.5,
                            longitude: 26.08
                        },
                        {
                            code: 'BUD',
                            description: 'Budapest',
                            timezone: 'Europe/Budapest',
                            country: {
                                code: 'HU',
                                description: 'Hungría'
                            },
                            latitude: 47.43,
                            longitude: 19.23
                        },
                        {
                            code: 'BOD',
                            description: 'Burdeos',
                            timezone: 'Europe/Paris',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            },
                            latitude: 44.833333,
                            longitude: -0.566666
                        },
                        {
                            code: 'CAG',
                            description: 'Cagliari',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 39.25,
                            longitude: 9.05
                        },
                        {
                            code: 'CWL',
                            description: 'Cardiff',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 51.396667,
                            longitude: -3.343333
                        },
                        {
                            code: 'CTA',
                            description: 'Catania',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 37.466666,
                            longitude: 15.066666
                        },
                        {
                            code: 'CPH',
                            description: 'Copenhague',
                            timezone: 'Europe/Copenhagen',
                            country: {
                                code: 'DK',
                                description: 'Dinamarca'
                            },
                            latitude: 55.616666,
                            longitude: 12.65
                        },
                        {
                            code: 'CFU',
                            description: 'Corfú',
                            timezone: 'Europe/Athens',
                            country: {
                                code: 'GR',
                                description: 'Grecia'
                            },
                            latitude: 39.602464,
                            longitude: 19.911668
                        },
                        {
                            code: 'ORK',
                            description: 'Cork',
                            timezone: 'Europe/London',
                            country: {
                                code: 'IE',
                                description: 'Irlanda'
                            },
                            latitude: 51.8412,
                            longitude: -8.4911
                        },
                        {
                            code: 'KGS',
                            description: 'Cos',
                            timezone: 'Europe/Athens',
                            country: {
                                code: 'GR',
                                description: 'Grecia'
                            },
                            latitude: 36.795555,
                            longitude: 27.091666
                        },
                        {
                            code: 'KRK',
                            description: 'Cracovia',
                            timezone: 'Europe/Warsaw',
                            country: {
                                code: 'PL',
                                description: 'Polonia'
                            },
                            latitude: 52.166666,
                            longitude: 20.966666
                        },
                        {
                            code: 'HER',
                            description: 'Creta',
                            timezone: 'Europe/Athens',
                            country: {
                                code: 'GR',
                                description: 'Grecia'
                            },
                            latitude: 35.339722,
                            longitude: 25.180278
                        },
                        {
                            code: 'DUB',
                            description: 'Dublín',
                            timezone: 'Europe/London',
                            country: {
                                code: 'IE',
                                description: 'Irlanda'
                            },
                            latitude: 53.433333,
                            longitude: -6.25
                        },
                        {
                            code: 'DBV',
                            description: 'Dubrovnik',
                            timezone: 'Europe/Ljubljana',
                            country: {
                                code: 'HR',
                                description: 'Croacia'
                            },
                            latitude: 42.561868,
                            longitude: 18.264598
                        },
                        {
                            code: 'DUS',
                            description: 'Dusseldorf',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'DE',
                                description: 'Alemania'
                            },
                            latitude: 51.283333,
                            longitude: 6.75
                        },
                        {
                            code: 'EDI',
                            description: 'Edimburgo',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 55.95,
                            longitude: -3.366666
                        },
                        {
                            code: 'EVN',
                            description: 'Ereván',
                            timezone: 'Europe/Moscow',
                            country: {
                                code: 'AM',
                                description: 'Armenia'
                            },
                            latitude: 40.1472,
                            longitude: 44.3958
                        },
                        {
                            code: 'STO',
                            description: 'Estocolmo',
                            timezone: 'Europe/Stockholm',
                            country: {
                                code: 'SE',
                                description: 'Suecia'
                            },
                            latitude: 59.35,
                            longitude: 17.95
                        },
                        {
                            code: 'SXB',
                            description: 'Estrasburgo',
                            timezone: 'Europe/Paris',
                            country: {
                                code: 'FR',
                                description: 'Francia'
                            },
                            latitude: 48.583333,
                            longitude: 7.75
                        },
                        {
                            code: 'FAO',
                            description: 'Faro',
                            timezone: 'Portugal',
                            country: {
                                code: 'PT',
                                description: 'Portugal'
                            },
                            latitude: 37.016666,
                            longitude: -7.966666
                        },
                        {
                            code: 'FLR',
                            description: 'Florencia',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 43.816666,
                            longitude: 11.2
                        },
                        {
                            code: 'FRA',
                            description: 'Frankfurt',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'DE',
                                description: 'Alemania'
                            },
                            latitude: 50.033333,
                            longitude: 8.566666
                        },
                        {
                            code: 'FNC',
                            description: 'Funchal',
                            timezone: 'Portugal',
                            country: {
                                code: 'PT',
                                description: 'Portugal'
                            },
                            latitude: 32.7,
                            longitude: -16.783333
                        },
                        {
                            code: 'GVA',
                            description: 'Ginebra',
                            timezone: 'Europe/Zurich',
                            country: {
                                code: 'CH',
                                description: 'Suiza'
                            },
                            latitude: 46.233333,
                            longitude: 6.116666
                        },
                        {
                            code: 'GLA',
                            description: 'Glasgow',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 55.883333,
                            longitude: -4.25
                        },
                        {
                            code: 'GOT',
                            description: 'Gotemburgo',
                            timezone: 'Europe/Stockholm',
                            country: {
                                code: 'SE',
                                description: 'Suecia'
                            },
                            latitude: 57.716666,
                            longitude: 11.966666
                        },
                        {
                            code: 'GOA',
                            description: 'Génova',
                            timezone: 'Europe/Rome',
                            country: {
                                code: 'IT',
                                description: 'Italia'
                            },
                            latitude: 44.416666,
                            longitude: 8.833333
                        },
                        {
                            code: 'HAM',
                            description: 'Hamburgo',
                            timezone: 'Europe/Madrid',
                            country: {
                                code: 'DE',
                                description: 'Alemania'
                            },
                            latitude: 53.633333,
                            longitude: 9.983333
                        },
                        {
                            code: 'HAJ',
                            description: 'Hannover',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'DE',
                                description: 'Alemania'
                            },
                            latitude: 52.45,
                            longitude: 9.7
                        },
                        {
                            code: 'HEL',
                            description: 'Helsinki',
                            timezone: 'Europe/Helsinki',
                            country: {
                                code: 'FI',
                                description: 'Finlandia'
                            },
                            latitude: 60.16952,
                            longitude: 24.93545
                        },
                        {
                            code: 'IVL',
                            description: 'Ivalo',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'FI',
                                description: 'Finlandia'
                            },
                            latitude: 68.61259,
                            longitude: 27.41312
                        },
                        {
                            code: 'JER',
                            description: 'Jersey',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 54.65,
                            longitude: 1
                        },
                        {
                            code: 'KZN',
                            description: 'Kazan',
                            timezone: 'Europe/Moscow',
                            country: {
                                code: 'RU',
                                description: 'Rusia'
                            },
                            latitude: 55.612098,
                            longitude: 49.280548
                        },
                        {
                            code: 'KTT',
                            description: 'Kittila',
                            timezone: 'Europe/Berlin',
                            country: {
                                code: 'FI',
                                description: 'Finlandia'
                            },
                            latitude: 67.699741,
                            longitude: 24.847126
                        },
                        {
                            code: 'LBA',
                            description: 'Leeds Bradford',
                            timezone: 'Europe/London',
                            country: {
                                code: 'GB',
                                description: 'Reino Unido'
                            },
                            latitude: 53.79,
                            longitude: -1.54
                        }
                    ]
                },
                {
                    code: 'ES_COMM_AREA_AMERICA',
                    description: 'América',
                    cities: [
                        {
                            code: 'ACA',
                            description: 'Acapulco',
                            timezone: 'America/Mexico_City',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 16.75,
                            longitude: -99.75
                        },
                        {
                            code: 'ALB',
                            description: 'Albany',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 42.748267,
                            longitude: -73.801692
                        },
                        {
                            code: 'ABQ',
                            description: 'Albuquerque',
                            timezone: 'US/Mountain',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 35.047565,
                            longitude: -106.615619
                        },
                        {
                            code: 'ANC',
                            description: 'Anchorage',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 61.213417,
                            longitude: -149.743667
                        },
                        {
                            code: 'ANU',
                            description: 'Antigua',
                            timezone: 'America/Antigua',
                            country: {
                                code: 'AG',
                                description: 'Antigua y Barbuda'
                            },
                            latitude: 17.136666,
                            longitude: -61.792778
                        },
                        {
                            code: 'ANF',
                            description: 'Antofagasta',
                            timezone: 'Chile/Continental',
                            country: {
                                code: 'CL',
                                description: 'Chile'
                            },
                            latitude: -23.439444,
                            longitude: -70.442777
                        },
                        {
                            code: 'AQP',
                            description: 'Arequipa',
                            timezone: 'America/Lima',
                            country: {
                                code: 'PE',
                                description: 'Perú'
                            },
                            latitude: -16.35,
                            longitude: -71.566666
                        },
                        {
                            code: 'AXM',
                            description: 'Armenia',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 6.345298,
                            longitude: -75.541992
                        },
                        {
                            code: 'AUA',
                            description: 'Aruba',
                            timezone: 'America/Puerto_Rico',
                            country: {
                                code: 'AW',
                                description: 'Aruba'
                            },
                            latitude: 12.5013833,
                            longitude: -70.01523
                        },
                        {
                            code: 'ASU',
                            description: 'Asunción',
                            timezone: 'America/Asuncion',
                            country: {
                                code: 'PY',
                                description: 'Paraguay'
                            },
                            latitude: -25.233333,
                            longitude: -57.516666
                        },
                        {
                            code: 'ATL',
                            description: 'Atlanta',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 33.65,
                            longitude: -84.433333
                        },
                        {
                            code: 'AUS',
                            description: 'Austin',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 30.197514,
                            longitude: -97.66983
                        },
                        {
                            code: 'BBA',
                            description: 'Balmaceda',
                            timezone: 'Chile/Continental',
                            country: {
                                code: 'CL',
                                description: 'Chile'
                            },
                            latitude: -45.9094313,
                            longitude: -71.6976199
                        },
                        {
                            code: 'BWI',
                            description: 'Baltimore',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 39.184235,
                            longitude: -76.668434
                        },
                        {
                            code: 'GPS',
                            description: 'Baltra Islas Galápagos',
                            timezone: 'America/Guayaquil',
                            country: {
                                code: 'EC',
                                description: 'Ecuador'
                            },
                            latitude: -0.4477622,
                            longitude: -90.2732293
                        },
                        {
                            code: 'BAQ',
                            description: 'Barranquilla',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 10.883333,
                            longitude: -74.783333
                        },
                        {
                            code: 'BTR',
                            description: 'Baton Rouge',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 30.533167,
                            longitude: -91.149638
                        },
                        {
                            code: 'BHZ',
                            description: 'Belo Horizonte',
                            timezone: 'America/Sao_Paulo',
                            country: {
                                code: 'BR',
                                description: 'Brasil'
                            },
                            latitude: -19.817098,
                            longitude: -43.953552
                        },
                        {
                            code: 'BEL',
                            description: 'Belém',
                            timezone: 'America/Belem',
                            country: {
                                code: 'BR',
                                description: 'Brasil'
                            },
                            latitude: -1.381139,
                            longitude: -48.476743
                        },
                        {
                            code: 'BDA',
                            description: 'Bermuda',
                            timezone: 'Atlantic/Bermuda',
                            country: {
                                code: 'BM',
                                description: 'Bermudas'
                            },
                            latitude: 32.366666,
                            longitude: -64.683333
                        },
                        {
                            code: 'BHM',
                            description: 'Birmingham',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 33.562295,
                            longitude: -86.75355
                        },
                        {
                            code: 'BMI',
                            description: 'Bloomington',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 40.477111,
                            longitude: -88.915917
                        },
                        {
                            code: 'BOG',
                            description: 'Bogotá',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 4.7,
                            longitude: -74.15
                        },
                        {
                            code: 'BOI',
                            description: 'Boise',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 43.5643617,
                            longitude: -116.2228617
                        },
                        {
                            code: 'BOS',
                            description: 'Boston',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 42.366666,
                            longitude: -71
                        },
                        {
                            code: 'BSB',
                            description: 'Brasilia',
                            timezone: 'America/Sao_Paulo',
                            country: {
                                code: 'BR',
                                description: 'Brasil'
                            },
                            latitude: -15.850389,
                            longitude: -47.912063
                        },
                        {
                            code: 'BGI',
                            description: 'Bridgetown',
                            timezone: 'America/Barbados',
                            country: {
                                code: 'BB',
                                description: 'Barbados'
                            },
                            latitude: 13.074633,
                            longitude: -59.492121
                        },
                        {
                            code: 'BGA',
                            description: 'Bucaramanga',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 7.133333,
                            longitude: -73.183333
                        },
                        {
                            code: 'BUE',
                            description: 'Buenos Aires',
                            timezone: 'America/Buenos_Aires',
                            country: {
                                code: 'AR',
                                description: 'Argentina'
                            },
                            latitude: -34.572222,
                            longitude: -58.370277
                        },
                        {
                            code: 'BUF',
                            description: 'Buffalo',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 42.937071,
                            longitude: -78.73043
                        },
                        {
                            code: 'CJA',
                            description: 'Cajamarca',
                            timezone: 'America/Lima',
                            country: {
                                code: 'PE',
                                description: 'Perú'
                            },
                            latitude: -7.1392217,
                            longitude: -78.4895283
                        },
                        {
                            code: 'YYC',
                            description: 'Calgary',
                            timezone: 'Canada/Mountain',
                            country: {
                                code: 'CA',
                                description: 'Canadá'
                            },
                            latitude: 51.124212,
                            longitude: -114.169921
                        },
                        {
                            code: 'CLO',
                            description: 'Cali',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 3.55,
                            longitude: -76.383333
                        },
                        {
                            code: 'CPE',
                            description: 'Campeche',
                            timezone: 'America/Mexico_City',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 16.75,
                            longitude: 1
                        },
                        {
                            code: 'CGR',
                            description: 'Campo Grande',
                            timezone: 'America/Campo_Grande',
                            country: {
                                code: 'BR',
                                description: 'Brasil'
                            },
                            latitude: -20.308569,
                            longitude: -54.662475
                        },
                        {
                            code: 'CUN',
                            description: 'Cancún',
                            timezone: 'America/Cancun',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 21.033333,
                            longitude: -86.883333
                        },
                        {
                            code: 'CCS',
                            description: 'Caracas',
                            timezone: 'America/Caracas',
                            country: {
                                code: 'VE',
                                description: 'Venezuela'
                            },
                            latitude: 10.608333,
                            longitude: -66.983333
                        },
                        {
                            code: 'CTG',
                            description: 'Cartagena de Indias',
                            timezone: 'America/Bogota',
                            country: {
                                code: 'CO',
                                description: 'Colombia'
                            },
                            latitude: 10.45,
                            longitude: -75.516666
                        },
                        {
                            code: 'CID',
                            description: 'Cedar Rapids',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 41.88551,
                            longitude: -91.712289
                        },
                        {
                            code: 'CMI',
                            description: 'Champaign',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 40.038833,
                            longitude: -88.277806
                        },
                        {
                            code: 'CHS',
                            description: 'Charleston',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 32.898646,
                            longitude: -80.040528
                        },
                        {
                            code: 'CLT',
                            description: 'Charlotte',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 35.224447,
                            longitude: -80.943489
                        },
                        {
                            code: 'CHA',
                            description: 'Chattanooga',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 35.03527,
                            longitude: -85.203788
                        },
                        {
                            code: 'CTM',
                            description: 'Chetumal',
                            timezone: 'Mexico/General',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 18.5001889,
                            longitude: -88.296146
                        },
                        {
                            code: 'CHI',
                            description: 'Chicago',
                            timezone: 'US/Central',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 41.874444,
                            longitude: -87.639444
                        },
                        {
                            code: 'CIX',
                            description: 'Chiclayo',
                            timezone: 'America/Lima',
                            country: {
                                code: 'PE',
                                description: 'Perú'
                            },
                            latitude: -6.783333,
                            longitude: -79.833333
                        },
                        {
                            code: 'CUU',
                            description: 'Chihuahua',
                            timezone: 'America/Chihuahua',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 28.7027,
                            longitude: -105.96
                        },
                        {
                            code: 'CVG',
                            description: 'Cincinnati',
                            timezone: 'US/Eastern',
                            country: {
                                code: 'US',
                                description: 'USA'
                            },
                            latitude: 39.108485,
                            longitude: -84.417915
                        },
                        {
                            code: 'CJS',
                            description: 'Ciudad Juárez',
                            timezone: 'America/Ojinaga',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 28.7027,
                            longitude: 1
                        },
                        {
                            code: 'CEN',
                            description: 'Ciudad Obregon',
                            timezone: 'America/Hermosillo',
                            country: {
                                code: 'MX',
                                description: 'México'
                            },
                            latitude: 16.75,
                            longitude: 1
                        }
                    ]
                },
                {
                    code: 'ES_COMM_AREA_AFRICA_M_EAST',
                    description: 'África y Oriente Medio',
                    cities: [
                        {
                            code: 'AUH',
                            description: 'Abu Dhabi',
                            timezone: 'Asia/Dubai',
                            country: {
                                code: 'AE',
                                description: 'Emiratos Arabes Unidos'
                            },
                            latitude: 24.433055,
                            longitude: 54.651111
                        },
                        {
                            code: 'ACC',
                            description: 'Accra',
                            timezone: 'Africa/Accra',
                            country: {
                                code: 'GH',
                                description: 'Ghana'
                            },
                            latitude: 5.596383,
                            longitude: -0.17
                        },
                        {
                            code: 'ADD',
                            description: 'Addis Ababa',
                            timezone: 'Africa/Nairobi',
                            country: {
                                code: 'KE',
                                description: 'Kenia'
                            },
                            latitude: 8.9806034,
                            longitude: 38.7577605
                        },
                        {
                            code: 'AGA',
                            description: 'Agadir',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 30.33,
                            longitude: -9.42
                        },
                        {
                            code: 'AMM',
                            description: 'Ammán',
                            timezone: 'Asia/Amman',
                            country: {
                                code: 'JO',
                                description: 'Jordania'
                            },
                            latitude: 31.966666,
                            longitude: 35.983333
                        },
                        {
                            code: 'ALG',
                            description: 'Argel',
                            timezone: 'Africa/Algiers',
                            country: {
                                code: 'DZ',
                                description: 'Argelia'
                            },
                            latitude: 36.7,
                            longitude: 3.216666
                        },
                        {
                            code: 'BAH',
                            description: 'Bahrain',
                            timezone: 'Asia/Bahrain',
                            country: {
                                code: 'BH',
                                description: 'Bahrain'
                            },
                            latitude: 26.270833,
                            longitude: 50.633611
                        },
                        {
                            code: 'BJL',
                            description: 'Banjul',
                            timezone: 'Africa/Banjul',
                            country: {
                                code: 'GM',
                                description: 'Gambia'
                            },
                            latitude: 13.342521,
                            longitude: -16
                        },
                        {
                            code: 'BEY',
                            description: 'Beirut',
                            timezone: 'Asia/Amman',
                            country: {
                                code: 'LB',
                                description: 'Líbano'
                            },
                            latitude: 33.81905,
                            longitude: 35.49003
                        },
                        {
                            code: 'BFN',
                            description: 'Bloemfontein',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -29.093788,
                            longitude: 26.303963
                        },
                        {
                            code: 'CAS',
                            description: 'Casablanca',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 33.583333,
                            longitude: -7.5
                        },
                        {
                            code: 'CPT',
                            description: 'Ciudad del Cabo',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -33.966666,
                            longitude: 18.6
                        },
                        {
                            code: 'DKR',
                            description: 'Dakar',
                            timezone: 'Africa/Dakar',
                            country: {
                                code: 'SN',
                                description: 'Senegal'
                            },
                            latitude: 14.743833,
                            longitude: -17.479305
                        },
                        {
                            code: 'VIL',
                            description: 'Dakhla',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 33.583333,
                            longitude: 1
                        },
                        {
                            code: 'DAR',
                            description: 'Dar Es Salaam',
                            timezone: 'Africa/Nairobi',
                            country: {
                                code: 'TZ',
                                description: 'Tanzania'
                            },
                            latitude: -6.878111,
                            longitude: 39.202625
                        },
                        {
                            code: 'DOH',
                            description: 'Doha',
                            timezone: 'Asia/Qatar',
                            country: {
                                code: 'QA',
                                description: 'Qatar'
                            },
                            latitude: 25.261125,
                            longitude: 51.565055
                        },
                        {
                            code: 'DXB',
                            description: 'Dubai',
                            timezone: 'Asia/Dubai',
                            country: {
                                code: 'AE',
                                description: 'Emiratos Arabes Unidos'
                            },
                            latitude: 25.25,
                            longitude: 55.35
                        },
                        {
                            code: 'DUR',
                            description: 'Durban',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -29.966666,
                            longitude: 30.95
                        },
                        {
                            code: 'ELS',
                            description: 'East London',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -33.035,
                            longitude: 27.821667
                        },
                        {
                            code: 'CAI',
                            description: 'El Cairo',
                            timezone: 'Africa/Cairo',
                            country: {
                                code: 'EG',
                                description: 'Egipto'
                            },
                            latitude: 30.116666,
                            longitude: 31.4
                        },
                        {
                            code: 'HRE',
                            description: 'Harare',
                            timezone: 'Africa/Harare',
                            country: {
                                code: 'ZW',
                                description: 'Zimbabue'
                            },
                            latitude: -17.933333,
                            longitude: 31.1
                        },
                        {
                            code: 'JED',
                            description: 'Jeddah',
                            timezone: 'Asia/Riyadh',
                            country: {
                                code: 'SA',
                                description: 'Arabia Saudita'
                            },
                            latitude: 21.681136,
                            longitude: 39.155486
                        },
                        {
                            code: 'JNB',
                            description: 'Johannesburgo',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -26.25,
                            longitude: 28.15
                        },
                        {
                            code: 'JRO',
                            description: 'Kilimanjaro',
                            timezone: 'Africa/Nairobi',
                            country: {
                                code: 'TZ',
                                description: 'Tanzania'
                            },
                            latitude: -3.4245248,
                            longitude: 37.0650801
                        },
                        {
                            code: 'KIM',
                            description: 'Kimberley',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -28.80175,
                            longitude: 24.763472
                        },
                        {
                            code: 'KWI',
                            description: 'Kuwait',
                            timezone: 'Asia/Kuwait',
                            country: {
                                code: 'KW',
                                description: 'Kuwait'
                            },
                            latitude: 29.23,
                            longitude: 47.97
                        },
                        {
                            code: 'EUN',
                            description: 'Laayoune',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 27.15,
                            longitude: -13.2
                        },
                        {
                            code: 'RAK',
                            description: 'Marrakech',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 31.616666,
                            longitude: -8.033333
                        },
                        {
                            code: 'MRU',
                            description: 'Mauricio',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'MU',
                                description: 'Islas Mauricio'
                            },
                            latitude: -19.757728,
                            longitude: 63.361263
                        },
                        {
                            code: 'MCT',
                            description: 'Muscat',
                            timezone: 'Asia/Muscat',
                            country: {
                                code: 'OM',
                                description: 'Omán'
                            },
                            latitude: 23.59,
                            longitude: 58.28
                        },
                        {
                            code: 'NDR',
                            description: 'Nador',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 35.2,
                            longitude: -2.916666
                        },
                        {
                            code: 'NBO',
                            description: 'Nairobi',
                            timezone: 'Africa/Nairobi',
                            country: {
                                code: 'KE',
                                description: 'Kenia'
                            },
                            latitude: -1.316666,
                            longitude: 36.933333
                        },
                        {
                            code: 'NKC',
                            description: 'Nuakchot',
                            timezone: 'Africa/Nouakchott',
                            country: {
                                code: 'MR',
                                description: 'Mauritania'
                            },
                            latitude: 18.09555,
                            longitude: -15.95
                        },
                        {
                            code: 'ORN',
                            description: 'Orán',
                            timezone: 'Africa/Algiers',
                            country: {
                                code: 'DZ',
                                description: 'Argelia'
                            },
                            latitude: 35.630372,
                            longitude: -0.610771
                        },
                        {
                            code: 'PLZ',
                            description: 'Port Elizabeth',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -33.983333,
                            longitude: 25.616666
                        },
                        {
                            code: 'RUH',
                            description: 'Riyadh',
                            timezone: 'Asia/Riyadh',
                            country: {
                                code: 'SA',
                                description: 'Arabia Saudita'
                            },
                            latitude: 24.604571,
                            longitude: 46.80038
                        },
                        {
                            code: 'SID',
                            description: 'Sal',
                            timezone: 'Atlantic/Cape_Verde',
                            country: {
                                code: 'SN',
                                description: 'Senegal'
                            },
                            latitude: 16.741945,
                            longitude: -22.9488883
                        },
                        {
                            code: 'TLV',
                            description: 'Tel Aviv',
                            timezone: 'Israel',
                            country: {
                                code: 'IL',
                                description: 'Israel'
                            },
                            latitude: 31.983333,
                            longitude: 34.883333
                        },
                        {
                            code: 'TNG',
                            description: 'Tánger',
                            timezone: 'Africa/Casablanca',
                            country: {
                                code: 'MA',
                                description: 'Marruecos'
                            },
                            latitude: 35.716666,
                            longitude: -5.916666
                        },
                        {
                            code: 'UTN',
                            description: 'Upingtown',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'ZA',
                                description: 'Sudáfrica'
                            },
                            latitude: -28.401022,
                            longitude: 21.259662
                        },
                        {
                            code: 'VFA',
                            description: 'Victoria Falls',
                            timezone: 'Africa/Harare',
                            country: {
                                code: 'ZW',
                                description: 'Zimbabue'
                            },
                            latitude: -18.1,
                            longitude: 25.85
                        },
                        {
                            code: 'WDH',
                            description: 'Windhoek',
                            timezone: 'Africa/Johannesburg',
                            country: {
                                code: 'NA',
                                description: 'Namibia'
                            },
                            latitude: -22.48,
                            longitude: 17.470833
                        },
                        {
                            code: 'ZNZ',
                            description: 'Zanzíbar',
                            timezone: 'Africa/Nairobi',
                            country: {
                                code: 'TZ',
                                description: 'Tanzania'
                            },
                            latitude: -6.2185336,
                            longitude: 39.221379
                        }
                    ]
                },
                {
                    code: 'ES_COMM_AREA_ASIA_OCEANIA',
                    description: 'Asia y Oceanía',
                    cities: [
                        {
                            code: 'ADL',
                            description: 'Adelaida',
                            country: {
                                code: 'AU',
                                description: 'Australia'
                            },
                            latitude: -34.9284989,
                            longitude: 138.6007456
                        },
                        {
                            code: 'AXT',
                            description: 'Akita',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'AOJ',
                            description: 'Aomori',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'AKJ',
                            description: 'Asahikawa',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'AKL',
                            description: 'Auckland',
                            timezone: 'Pacific/Auckland',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -37.008055,
                            longitude: 174.791666
                        },
                        {
                            code: 'DPS',
                            description: 'Bali',
                            timezone: 'Asia/Makassar',
                            country: {
                                code: 'ID',
                                description: 'Indonesia'
                            },
                            latitude: -8.748056,
                            longitude: 115.1675
                        },
                        {
                            code: 'BLR',
                            description: 'Bangalore',
                            timezone: 'Asia/Kolkata',
                            country: {
                                code: 'IN',
                                description: 'India'
                            },
                            latitude: 28.56515,
                            longitude: 77.119388
                        },
                        {
                            code: 'BKK',
                            description: 'Bangkok',
                            timezone: 'Asia/Bangkok',
                            country: {
                                code: 'TH',
                                description: 'Tailandia'
                            },
                            latitude: 13.733333,
                            longitude: 100.5
                        },
                        {
                            code: 'BOM',
                            description: 'Bombai',
                            timezone: 'Asia/Kolkata',
                            country: {
                                code: 'IN',
                                description: 'India'
                            },
                            latitude: 19.088686,
                            longitude: 72.867919
                        },
                        {
                            code: 'CSX',
                            description: 'Changshá',
                            timezone: 'Asia/Shanghai',
                            country: {
                                code: 'CN',
                                description: 'China'
                            },
                            latitude: 28.228209,
                            longitude: 112.938814
                        },
                        {
                            code: 'CTU',
                            description: 'Chengdu',
                            timezone: 'Asia/Shanghai',
                            country: {
                                code: 'CN',
                                description: 'China'
                            },
                            latitude: 30.580764,
                            longitude: 103.9483
                        },
                        {
                            code: 'MAA',
                            description: 'Chennai',
                            timezone: 'Asia/Kolkata',
                            country: {
                                code: 'IN',
                                description: 'India'
                            },
                            latitude: 12.994916,
                            longitude: 80.1755
                        },
                        {
                            code: 'CKG',
                            description: 'Chongqing',
                            timezone: 'Asia/Shanghai',
                            country: {
                                code: 'CN',
                                description: 'China'
                            },
                            latitude: 29.4315861,
                            longitude: 106.912251
                        },
                        {
                            code: 'CHC',
                            description: 'Christchurch',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -43.53333,
                            longitude: 172.63333
                        },
                        {
                            code: 'CMB',
                            description: 'Colombo',
                            timezone: 'Asia/Colombo',
                            country: {
                                code: 'LK',
                                description: 'Sri Lanka'
                            },
                            latitude: 7.180188,
                            longitude: 79.8853
                        },
                        {
                            code: 'DEL',
                            description: 'Delhi',
                            timezone: 'Asia/Calcutta',
                            country: {
                                code: 'IN',
                                description: 'India'
                            },
                            latitude: 28.56515,
                            longitude: 77.119388
                        },
                        {
                            code: 'DUD',
                            description: 'Dunedin',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -45.87416,
                            longitude: 170.50361
                        },
                        {
                            code: 'FUK',
                            description: 'Fukuoka',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'GIS',
                            description: 'Gisborne',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -38.65333,
                            longitude: 178.00417
                        },
                        {
                            code: 'HAK',
                            description: 'Haikou',
                            timezone: 'Asia/Shanghai',
                            country: {
                                code: 'CN',
                                description: 'China'
                            },
                            latitude: 20.044412,
                            longitude: 110.198286
                        },
                        {
                            code: 'HKD',
                            description: 'Hakodate',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'HIJ',
                            description: 'Hiroshima',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'SGN',
                            description: 'Ho Chi Minh City',
                            timezone: 'Asia/Colombo',
                            country: {
                                code: 'VN',
                                description: 'Vietnam'
                            },
                            latitude: 10.8230989,
                            longitude: 106.6296638
                        },
                        {
                            code: 'HKG',
                            description: 'Hong Kong',
                            timezone: 'Hongkong',
                            country: {
                                code: 'CN',
                                description: 'China'
                            },
                            latitude: 22.333333,
                            longitude: 114.2
                        },
                        {
                            code: 'HYD',
                            description: 'Hyderabad',
                            timezone: 'Asia/Kolkata',
                            country: {
                                code: 'IN',
                                description: 'India'
                            },
                            latitude: 17.453111,
                            longitude: 78.458083
                        },
                        {
                            code: 'ISB',
                            description: 'Islamabad',
                            timezone: 'Asia/Calcutta',
                            country: {
                                code: 'PK',
                                description: 'Pakistán'
                            },
                            latitude: 33.6844202,
                            longitude: 73.0478848
                        },
                        {
                            code: 'IZO',
                            description: 'Izumo',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.3670351,
                            longitude: 132.7546815
                        },
                        {
                            code: 'KOJ',
                            description: 'Kagoshima',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 31.5965535,
                            longitude: 130.5571158
                        },
                        {
                            code: 'KHI',
                            description: 'Karachi',
                            timezone: 'Asia/Calcutta',
                            country: {
                                code: 'PK',
                                description: 'Pakistán'
                            },
                            latitude: 25.0700428,
                            longitude: 67.2847875
                        },
                        {
                            code: 'KKJ',
                            description: 'Kitakyushu',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 33.8834093,
                            longitude: 130.8752161
                        },
                        {
                            code: 'KCZ',
                            description: 'Kochi',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 33.5595867,
                            longitude: 133.5292788
                        },
                        {
                            code: 'KMQ',
                            description: 'Komatsu',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 36.4083514,
                            longitude: 136.445571
                        },
                        {
                            code: 'KUL',
                            description: 'Kuala Lumpur',
                            timezone: 'Asia/Bangkok',
                            country: {
                                code: 'MY',
                                description: 'Malasia'
                            },
                            latitude: 2.74,
                            longitude: 101.69
                        },
                        {
                            code: 'KMJ',
                            description: 'Kumamoto',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'KUH',
                            description: 'Kushiro',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 42.9848542,
                            longitude: 144.3813556
                        },
                        {
                            code: 'LHE',
                            description: 'Lahore',
                            timezone: 'Asia/Calcutta',
                            country: {
                                code: 'PK',
                                description: 'Pakistán'
                            },
                            latitude: 31.5203696,
                            longitude: 74.3587473
                        },
                        {
                            code: 'MLE',
                            description: 'Male',
                            timezone: 'Indian/Maldives',
                            country: {
                                code: 'MV',
                                description: 'Islas Maldivas'
                            },
                            latitude: 4.19165,
                            longitude: 73.529145
                        },
                        {
                            code: 'MYJ',
                            description: 'Matsuyama',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'MEL',
                            description: 'Melbourne',
                            country: {
                                code: 'AU',
                                description: 'Australia'
                            },
                            latitude: -37.66969,
                            longitude: 144.9630576
                        },
                        {
                            code: 'MMB',
                            description: 'Memanbetsu',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 43.88142,
                            longitude: 144.158815
                        },
                        {
                            code: 'MSJ',
                            description: 'Misawa',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 40.6831337,
                            longitude: 141.3689761
                        },
                        {
                            code: 'KMI',
                            description: 'Miyazaki',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 31.9076736,
                            longitude: 131.4202411
                        },
                        {
                            code: 'NGS',
                            description: 'Nagasaki',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 32.7502856,
                            longitude: 129.877667
                        },
                        {
                            code: 'NGO',
                            description: 'Nagoya',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'NPE',
                            description: 'Napier',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -39.4908578,
                            longitude: 176.9179114
                        },
                        {
                            code: 'NSN',
                            description: 'Nelson',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -41.27078,
                            longitude: 173.28404
                        },
                        {
                            code: 'NPL',
                            description: 'New Plymouth',
                            country: {
                                code: 'NZ',
                                description: 'Nueva Zelanda'
                            },
                            latitude: -39.06667,
                            longitude: 174.08333
                        },
                        {
                            code: 'NOU',
                            description: 'Numea',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'NC',
                                description: 'Nueva Caledonia'
                            },
                            latitude: 22.16,
                            longitude: 166.27
                        },
                        {
                            code: 'OBO',
                            description: 'Obihiro',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 35.7,
                            longitude: 139.766666
                        },
                        {
                            code: 'OIT',
                            description: 'Oita',
                            timezone: 'Asia/Tokyo',
                            country: {
                                code: 'JP',
                                description: 'Japón'
                            },
                            latitude: 33.2395578,
                            longitude: 131.609272
                        }
                    ]
                }
            ];
            var cabinsModel = [
                {
                    code: 'R',
                    description: 'Más económica',
                    cabinClass: 'ECONOMY'
                },
                {
                    code: 'N',
                    description: 'Turista Premium',
                    cabinClass: 'PREMIUMTOURIST'
                },
                {
                    code: 'B',
                    description: 'Business Class',
                    cabinClass: 'BUSINESS'
                }
            ];
            var ret = advancedSearchTransformer.initilizeAdvancedSearchModel(areas, cabinsModel, 'MAD', 'BIO');

            expect(advancedSearchTransformer.initilizeAdvancedSearchModel).toBeDefined();
        });

        it('test for advancedSearchTransformer.createNewAdvancedSearch', function () {
            var url;
            var advancedSearchData = {
                'dateOptionsOutbound':{
                    'showWeeks':false,
                    'maxMode':'day',
                    'minDate':'2020-10-20T10:47:39.202Z',
                    'maxDate':'2021-02-17T23:00:00.000Z'
                },
                'dateOptionsOutboundReturn':{
                    'showWeeks':false,
                    'maxMode':'day',
                    'minDate':'2021-02-02T23:00:00.000Z',
                    'maxDate':1666262859202
                },
                'payWithAvios':false,
                'payWithPoints':false,
                'tripOptions':[
                    {
                        'description':'HEADER_ADVANCED_SEARCH_ONE_WAY',
                        'code':1,
                        '$$hashKey':'object:280'
                    },
                    {
                        'description':'HEADER_ADVANCED_SEARCH_ROUND_TRIP',
                        'code':2,
                        '$$hashKey':'object:281'
                    }
                ],
                'tripOptionSelected':{
                    'description':'HEADER_ADVANCED_SEARCH_ROUND_TRIP',
                    'code':2,
                    '$$hashKey':'object:281'
                },
                'cityOrigin':{
                    'code':'MAD',
                    'description':'Madrid (MAD)',
                    'country':'ES',
                    'group':'España',
                    'selected':false
                },
                'cityDestiny':{
                    'code':'BIO',
                    'description':'Bilbao (BIO)',
                    'country':'ES',
                    'group':'España',
                    'selected':false
                },
                'passengersSelected':[
                    {
                        'passengerType':'ADULT',
                        'minPassenger':1,
                        'maxPassengers':9,
                        'infoAge':'HEADER_ADVANCED_SEARCH_PASSENGER_ADULT_AGE_TEXT',
                        'count':1,
                        'isActive':true,
                        '$$hashKey':'object:1451'
                    },
                    {
                        'passengerType':'CHILD',
                        'minPassenger':0,
                        'maxPassengers':9,
                        'infoAge':'HEADER_ADVANCED_SEARCH_PASSENGER_CHILD_AGE_TEXT',
                        'count':0,
                        'isActive':true,
                        '$$hashKey':'object:1452'
                    },
                    {
                        'passengerType':'INFANT',
                        'minPassenger':0,
                        'maxPassengers':9,
                        'infoAge':'HEADER_ADVANCED_SEARCH_PASSENGER_INFANT_AGE_TEXT',
                        'count':0,
                        'isActive':true,
                        '$$hashKey':'object:1453'
                    }
                ],
                'passengersConditions':{
                    'passengersCount':1,
                    'maxChilds':2,
                    'totalAdults':1,
                    'passengersWithInfants':1
                },
                'discountResident':{
                    'description':'HEADER_ADVANCED_SEARCH_NO_RESIDENT',
                    'value':'',
                    '$$hashKey':'object:180'
                },
                'discountFamily':{
                    'description':'HEADER_ADVANCED_SEARCH_NO_FAMILY',
                    'value':'',
                    '$$hashKey':'object:188'
                },
                'cities':{
                    'listGroups':[
                        'España',
                        'Europa',
                        'América',
                        'África y Oriente Medio',
                        'Asia y Oceanía'
                    ],
                    'listCities':[
                        {
                            'code':'LCG',
                            'description':'A Coruña (LCG)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ABC',
                            'description':'Albacete (ABC)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ALC',
                            'description':'Alicante (ALC)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'LEI',
                            'description':'Almería (LEI)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'OVD',
                            'description':'Asturias-Oviedo (OVD)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'BJZ',
                            'description':'Badajoz (BJZ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'BCN',
                            'description':'Barcelona (BCN)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'BIO',
                            'description':'Bilbao (BIO)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'RGS',
                            'description':'Burgos (RGS)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ODB',
                            'description':'Córdoba (ODB)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'FUE',
                            'description':'Fuerteventura (FUE)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'LPA',
                            'description':'Gran Canaria Las Palmas (LPA)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'GRX',
                            'description':'Granada-Jaén (GRX)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'IBZ',
                            'description':'Ibiza (IBZ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'XRY',
                            'description':'Jerez de la Frontera (XRY)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ACE',
                            'description':'Lanzarote (ACE)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'LEN',
                            'description':'León (LEN)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ILD',
                            'description':'Lleida (ILD)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'RJL',
                            'description':'Logroño (RJL)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'XJR',
                            'description':'Lorca (XJR)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'MAD',
                            'description':'Madrid (MAD)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'MLN',
                            'description':'Melilla (MLN)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'MAH',
                            'description':'Menorca (MAH)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'MJV',
                            'description':'Murcia (MJV)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'AGP',
                            'description':'Málaga (AGP)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'PCI',
                            'description':'Palencia (PCI)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'PMI',
                            'description':'Palma de Mallorca (PMI)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'PNA',
                            'description':'Pamplona (PNA)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'PFE',
                            'description':'Ponferrada (PFE)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'SLM',
                            'description':'Salamanca (SLM)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'EAS',
                            'description':'San Sebastian (EAS)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'GMZ',
                            'description':'San Sebastián de la Gomera (GMZ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'SPC',
                            'description':'Santa Cruz de La Palma (SPC)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'SDR',
                            'description':'Santander (SDR)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'SCQ',
                            'description':'Santiago de Compostela (SCQ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'XOU',
                            'description':'Segovia (XOU)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'SVQ',
                            'description':'Sevilla (SVQ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'XJO',
                            'description':'Soria (XJO)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'TCI',
                            'description':'Tenerife (TCI)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'XTJ',
                            'description':'Toledo (XTJ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'VLC',
                            'description':'Valencia (VLC)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'VLL',
                            'description':'Valladolid (VLL)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'VDE',
                            'description':'Valverde (VDE)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'VGO',
                            'description':'Vigo (VGO)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'VIT',
                            'description':'Vitoria (VIT)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ZOB',
                            'description':'Zamora (ZOB)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'ZAZ',
                            'description':'Zaragoza (ZAZ)',
                            'country':'ES',
                            'group':'España',
                            'selected':false
                        },
                        {
                            'code':'AAL',
                            'description':'Aalborg (AAL)',
                            'country':'DK',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ABZ',
                            'description':'Aberdeen (ABZ)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'AHO',
                            'description':'Alguero (AHO)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'AMS',
                            'description':'Amsterdam (AMS)',
                            'country':'NL',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ATH',
                            'description':'Atenas (ATH)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BRI',
                            'description':'Bari (BRI)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'EAP',
                            'description':'Basilea (EAP)',
                            'country':'CH',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BSL',
                            'description':'Basilea Euroairport (BSL)',
                            'country':'CH',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BIA',
                            'description':'Bastia (BIA)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BFS',
                            'description':'Belfast (BFS)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BGO',
                            'description':'Bergen (BGO)',
                            'country':'NO',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BER',
                            'description':'Berlín (BER)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BHX',
                            'description':'Birmingham (BHX)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BLQ',
                            'description':'Bolonia (BLQ)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BES',
                            'description':'Brest (BES)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BDS',
                            'description':'Brindisi (BDS)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BRU',
                            'description':'Bruselas (BRU)',
                            'country':'BE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BUH',
                            'description':'Bucarest (BUH)',
                            'country':'RO',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BUD',
                            'description':'Budapest (BUD)',
                            'country':'HU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'BOD',
                            'description':'Burdeos (BOD)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CAG',
                            'description':'Cagliari (CAG)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CWL',
                            'description':'Cardiff (CWL)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CTA',
                            'description':'Catania (CTA)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'EFL',
                            'description':'Cefalonia  (EFL)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CPH',
                            'description':'Copenhague (CPH)',
                            'country':'DK',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CFU',
                            'description':'Corfú (CFU)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ORK',
                            'description':'Cork (ORK)',
                            'country':'IE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'KGS',
                            'description':'Cos (KGS)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'KRK',
                            'description':'Cracovia (KRK)',
                            'country':'PL',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'HER',
                            'description':'Creta (HER)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'DUB',
                            'description':'Dublín (DUB)',
                            'country':'IE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'DBV',
                            'description':'Dubrovnik (DBV)',
                            'country':'HR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'DUS',
                            'description':'Dusseldorf (DUS)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'EDI',
                            'description':'Edimburgo (EDI)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'EVN',
                            'description':'Ereván (EVN)',
                            'country':'AM',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'STO',
                            'description':'Estocolmo (STO)',
                            'country':'SE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'SXB',
                            'description':'Estrasburgo (SXB)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'FAO',
                            'description':'Faro (FAO)',
                            'country':'PT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'FLR',
                            'description':'Florencia (FLR)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'FRA',
                            'description':'Frankfurt (FRA)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'FNC',
                            'description':'Funchal (FNC)',
                            'country':'PT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'GVA',
                            'description':'Ginebra (GVA)',
                            'country':'CH',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'GLA',
                            'description':'Glasgow (GLA)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'GOT',
                            'description':'Gotemburgo (GOT)',
                            'country':'SE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'GOA',
                            'description':'Génova (GOA)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'HAM',
                            'description':'Hamburgo (HAM)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'HAJ',
                            'description':'Hannover (HAJ)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'HEL',
                            'description':'Helsinki (HEL)',
                            'country':'FI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'IVL',
                            'description':'Ivalo (IVL)',
                            'country':'FI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'JER',
                            'description':'Jersey (JER)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'KZN',
                            'description':'Kazan (KZN)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'IEV',
                            'description':'Kiev (IEV)',
                            'country':'UA',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'KTT',
                            'description':'Kittila (KTT)',
                            'country':'FI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LBA',
                            'description':'Leeds Bradford (LBA)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LIL',
                            'description':'Lille (LIL)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LIS',
                            'description':'Lisboa (LIS)',
                            'country':'PT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LJU',
                            'description':'Liubliana (LJU)',
                            'country':'SI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LON',
                            'description':'Londres (LON)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LGW',
                            'description':'Londres Gatwick (LGW)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LHR',
                            'description':'Londres Heathrow  (LHR)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LYS',
                            'description':'Lyón (LYS)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MLA',
                            'description':'Malta (MLA)',
                            'country':'MT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MAN',
                            'description':'Manchester (MAN)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MRS',
                            'description':'Marsella (MRS)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'JMK',
                            'description':'Mikonos (JMK)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MIL',
                            'description':'Milán (MIL)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LIN',
                            'description':'Milán Linate (LIN)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MXP',
                            'description':'Milán Malpens (MXP)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MOW',
                            'description':'Moscú (MOW)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'MUC',
                            'description':'Munich (MUC)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'NTE',
                            'description':'Nantes (NTE)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'NCL',
                            'description':'Newcastle (NCL)',
                            'country':'GB',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'NCE',
                            'description':'Niza (NCE)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'NUE',
                            'description':'Nuremberg (NUE)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'NAP',
                            'description':'Nápoles (NAP)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'OLB',
                            'description':'Olbia (OLB)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'OPO',
                            'description':'Oporto (OPO)',
                            'country':'PT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'OSL',
                            'description':'Oslo (OSL)',
                            'country':'NO',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'OUL',
                            'description':'Oulu (OUL)',
                            'country':'FI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'PMO',
                            'description':'Palermo (PMO)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'PAR',
                            'description':'París (PAR)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'CDG',
                            'description':'París Charles de Gaulle (CDG)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ORY',
                            'description':'París Orly (ORY)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'PEE',
                            'description':'Perm (PEE)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'PSA',
                            'description':'Pisa (PSA)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'PRG',
                            'description':'Praga (PRG)',
                            'country':'CZ',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'XCR',
                            'description':'Region de Chalons Vatry Champagne (XCR)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'REK',
                            'description':'Reikiavik (REK)',
                            'country':'IS',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'RNS',
                            'description':'Rennes (RNS)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'RIX',
                            'description':'Riga (RIX)',
                            'country':'LV',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ROM',
                            'description':'Roma (ROM)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'FCO',
                            'description':'Roma Fiumicino (FCO)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ROV',
                            'description':'Rostov (ROV)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'RVN',
                            'description':'Rovaniemi (RVN)',
                            'country':'FI',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'KUF',
                            'description':'Samara (KUF)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'LED',
                            'description':'San Petersburgo (LED)',
                            'country':'RU',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'JTR',
                            'description':'Santorini (JTR)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'SOF',
                            'description':'Sofia (SOF)',
                            'country':'BG',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'SPU',
                            'description':'Split (SPU)',
                            'country':'HR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'STR',
                            'description':'Stuttgart (STR)',
                            'country':'DE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'TLL',
                            'description':'Tallin (TLL)',
                            'country':'EE',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'TLS',
                            'description':'Toulouse (TLS)',
                            'country':'FR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'TRN',
                            'description':'Turín (TRN)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'VCE',
                            'description':'Venecia (VCE)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'VRN',
                            'description':'Verona (VRN)',
                            'country':'IT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'VIE',
                            'description':'Viena (VIE)',
                            'country':'AT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'VNO',
                            'description':'Vilnius (VNO)',
                            'country':'LT',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ZTH',
                            'description':'Zacinto (ZTH)',
                            'country':'GR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ZAD',
                            'description':'Zadar (ZAD)',
                            'country':'HR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ZAG',
                            'description':'Zagreb (ZAG)',
                            'country':'HR',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ZRH',
                            'description':'Zurich (ZRH)',
                            'country':'CH',
                            'group':'Europa',
                            'selected':false
                        },
                        {
                            'code':'ACA',
                            'description':'Acapulco (ACA)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ALB',
                            'description':'Albany (ALB)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ABQ',
                            'description':'Albuquerque (ABQ)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ANC',
                            'description':'Anchorage (ANC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ANU',
                            'description':'Antigua (ANU)',
                            'country':'AG',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ANF',
                            'description':'Antofagasta (ANF)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AQP',
                            'description':'Arequipa (AQP)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ARI',
                            'description':'Arica (ARI)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AXM',
                            'description':'Armenia (AXM)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AUA',
                            'description':'Aruba (AUA)',
                            'country':'AW',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ASU',
                            'description':'Asunción (ASU)',
                            'country':'PY',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ATL',
                            'description':'Atlanta (ATL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AUS',
                            'description':'Austin (AUS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AYP',
                            'description':'Ayacucho (AYP)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BBA',
                            'description':'Balmaceda (BBA)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BWI',
                            'description':'Baltimore (BWI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GPS',
                            'description':'Baltra Islas Galápagos (GPS)',
                            'country':'EC',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BAQ',
                            'description':'Barranquilla (BAQ)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BTR',
                            'description':'Baton Rouge (BTR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BHZ',
                            'description':'Belo Horizonte (BHZ)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BEL',
                            'description':'Belém (BEL)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BDA',
                            'description':'Bermuda (BDA)',
                            'country':'BM',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BHM',
                            'description':'Birmingham (BHM)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BMI',
                            'description':'Bloomington (BMI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BOG',
                            'description':'Bogotá (BOG)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BOI',
                            'description':'Boise (BOI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BOS',
                            'description':'Boston (BOS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BSB',
                            'description':'Brasilia (BSB)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BGI',
                            'description':'Bridgetown (BGI)',
                            'country':'BB',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BGA',
                            'description':'Bucaramanga (BGA)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BUE',
                            'description':'Buenos Aires (BUE)',
                            'country':'AR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BUF',
                            'description':'Buffalo (BUF)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CJA',
                            'description':'Cajamarca (CJA)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CJC',
                            'description':'Calama (CJC)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'YYC',
                            'description':'Calgary (YYC)',
                            'country':'CA',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CLO',
                            'description':'Cali (CLO)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CPE',
                            'description':'Campeche (CPE)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CGR',
                            'description':'Campo Grande (CGR)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUN',
                            'description':'Cancún (CUN)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CCS',
                            'description':'Caracas (CCS)',
                            'country':'VE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CTG',
                            'description':'Cartagena de Indias (CTG)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CID',
                            'description':'Cedar Rapids (CID)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CMI',
                            'description':'Champaign (CMI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CHS',
                            'description':'Charleston (CHS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CLT',
                            'description':'Charlotte (CLT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CHA',
                            'description':'Chattanooga (CHA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CTM',
                            'description':'Chetumal (CTM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CHI',
                            'description':'Chicago (CHI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CIX',
                            'description':'Chiclayo (CIX)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUU',
                            'description':'Chihuahua (CUU)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CVG',
                            'description':'Cincinnati (CVG)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CJS',
                            'description':'Ciudad Juárez (CJS)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CEN',
                            'description':'Ciudad Obregon (CEN)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CVM',
                            'description':'Ciudad Victoria (CVM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MEX',
                            'description':'Ciudad de México (MEX)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CME',
                            'description':'Ciudad del Carmen (CME)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AGT',
                            'description':'Ciudad del Este (AGT)',
                            'country':'PY',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CLE',
                            'description':'Cleveland (CLE)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CBB',
                            'description':'Cochabamba (CBB)',
                            'country':'BO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CLQ',
                            'description':'Colima (CLQ)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CMH',
                            'description':'Columbus (CMH)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CCP',
                            'description':'Concepción (CCP)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'COR',
                            'description':'Cordoba (COR)',
                            'country':'AR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CRP',
                            'description':'Corpus Christi (CRP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CZM',
                            'description':'Cozumel (CZM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUC',
                            'description':'Cucuta (CUC)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUE',
                            'description':'Cuenca (CUE)',
                            'country':'EC',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CGB',
                            'description':'Cuiaba (CGB)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUL',
                            'description':'Culiacan (CUL)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUR',
                            'description':'Curaçao (CUR)',
                            'country':'AN',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CWB',
                            'description':'Curitiba (CWB)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'CUZ',
                            'description':'Cuzco (CUZ)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DFW',
                            'description':'Dallas (DFW)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DAY',
                            'description':'Dayton (DAY)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DEN',
                            'description':'Denver (DEN)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DSM',
                            'description':'Des Moines (DSM)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DTT',
                            'description':'Detroit (DTT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DBQ',
                            'description':'Dubuque (DBQ)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'DRO',
                            'description':'Durango (DRO)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ELP',
                            'description':'El Paso (ELP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'EUG',
                            'description':'Eugene (EUG)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'EVV',
                            'description':'Evansville (EVV)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FLL',
                            'description':'FT Lauderdale (FLL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FAR',
                            'description':'Fargo (FAR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FYV',
                            'description':'Fayetteville (FYV)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PHX',
                            'description':'Fenix (PHX)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PHL',
                            'description':'Filadelfia (PHL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FNT',
                            'description':'Flint Mi (FNT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FLN',
                            'description':'Florianópolis (FLN)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'VPS',
                            'description':'Fort Walton Beach (VPS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FWA',
                            'description':'Fort Wayne (FWA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FDF',
                            'description':'Fort de France (FDF)',
                            'country':'MQ',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FOR',
                            'description':'Fortaleza (FOR)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IGU',
                            'description':'Foz de Iguazú (IGU)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FPO',
                            'description':'Freeport (FPO)',
                            'country':'BS',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FAT',
                            'description':'Fresno (FAT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GNV',
                            'description':'Gainesville (GNV)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GYN',
                            'description':'Goiania (GYN)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GCM',
                            'description':'Gran Caimán (GCM)',
                            'country':'KY',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GRR',
                            'description':'Grand Rapids (GRR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GRB',
                            'description':'Green Bay (GRB)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GSO',
                            'description':'Greensboro (GSO)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GSP',
                            'description':'Greenville (GSP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GND',
                            'description':'Grenada (GND)',
                            'country':'GD',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GDL',
                            'description':'Guadalajara (GDL)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GUA',
                            'description':'Guatemala (GUA)',
                            'country':'GT',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GYE',
                            'description':'Guayaquil (GYE)',
                            'country':'EC',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HAR',
                            'description':'Harrisburg (HAR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HFD',
                            'description':'Hartford (HFD)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HMO',
                            'description':'Hermosillo (HMO)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HOG',
                            'description':'Holguin (HOG)',
                            'country':'CU',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HNL',
                            'description':'Honolulu (HNL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HOU',
                            'description':'Houston (HOU)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HUX',
                            'description':'Huatulco (HUX)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HSV',
                            'description':'Huntsville (HSV)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IBE',
                            'description':'Ibagué (IBE)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IND',
                            'description':'Indianapolis (IND)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IQQ',
                            'description':'Iquique (IQQ)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IQT',
                            'description':'Iquitos (IQT)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IPC',
                            'description':'Isla de Pascua (IPC)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'IZT',
                            'description':'Ixtepec (IZT)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'JAX',
                            'description':'Jacksonville (JAX)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'JAU',
                            'description':'Jauja (JAU)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'JAE',
                            'description':'Jaén (JAE)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'JUL',
                            'description':'Juliaca (JUL)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AZO',
                            'description':'Kalamazoo (AZO)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MKC',
                            'description':'Kansas City (MKC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'EYW',
                            'description':'Key West (EYW)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'KIN',
                            'description':'Kingston (KIN)',
                            'country':'JM',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TYS',
                            'description':'Knoxville (TYS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LSE',
                            'description':'La Crosse Wi (LSE)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'HAV',
                            'description':'La Habana (HAV)',
                            'country':'CU',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LPB',
                            'description':'La Paz (LPB)',
                            'country':'BO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LSC',
                            'description':'La Serena (LSC)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LFT',
                            'description':'Lafayette (LFT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LCH',
                            'description':'Lake Charles (LCH)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LRD',
                            'description':'Laredo (LRD)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LAS',
                            'description':'Las Vegas (LAS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LEX',
                            'description':'Lexington (LEX)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BJX',
                            'description':'León, Guanajuato (BJX)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LIM',
                            'description':'Lima (LIM)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LIT',
                            'description':'Little Rock (LIT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LDB',
                            'description':'Londrina (LDB)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LAX',
                            'description':'Los Angeles (LAX)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SDF',
                            'description':'Louisville (SDF)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LBB',
                            'description':'Lubbock (LBB)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'LZC',
                            'description':'Lázaro Cárdenas (LZC)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MSN',
                            'description':'Madison (MSN)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MGA',
                            'description':'Managua (MGA)',
                            'country':'NI',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MAO',
                            'description':'Manaus (MAO)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MHK',
                            'description':'Manhattan Kansas (MHK)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MQT',
                            'description':'Marquette (MQT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MAM',
                            'description':'Matamoros (MAM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MZT',
                            'description':'Mazatlan (MZT)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MFE',
                            'description':'Mcallen Mission (MFE)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MDE',
                            'description':'Medellin (MDE)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MEM',
                            'description':'Memphis (MEM)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MDZ',
                            'description':'Mendoza (MDZ)',
                            'country':'AR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MID',
                            'description':'Merida (MID)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MXL',
                            'description':'Mexicali (MXL)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MIA',
                            'description':'Miami (MIA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MKE',
                            'description':'Milwaukee (MKE)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MTT',
                            'description':'Minatitlan (MTT)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MSP',
                            'description':'Minneapolis (MSP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MLI',
                            'description':'Moline (MLI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MBJ',
                            'description':'Montego Bay (MBJ)',
                            'country':'JM',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MTY',
                            'description':'Monterrey (MTY)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MVD',
                            'description':'Montevideo (MVD)',
                            'country':'UY',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'YMQ',
                            'description':'Montreal (YMQ)',
                            'country':'CA',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'BNA',
                            'description':'Nashville (BNA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NAS',
                            'description':'Nassau (NAS)',
                            'country':'BS',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NAT',
                            'description':'Natal (NAT)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NVT',
                            'description':'Navegantes (NVT)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NVA',
                            'description':'Neiva (NVA)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'EWR',
                            'description':'Newark Liberty International (EWR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ORF',
                            'description':'Norfolk (ORF)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'MSY',
                            'description':'Nueva Orleans (MSY)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NYC',
                            'description':'Nueva York (NYC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'JFK',
                            'description':'Nueva York John F Kennedy (JFK)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'NLD',
                            'description':'Nuevo Laredo (NLD)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'OAK',
                            'description':'Oakland San Francisco Bay (OAK)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'OAX',
                            'description':'Oaxaca (OAX)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'OKC',
                            'description':'Oklahoma (OKC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'OMA',
                            'description':'Omaha (OMA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SNA',
                            'description':'Orange County (SNA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ORL',
                            'description':'Orlando (ORL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PQM',
                            'description':'Palenque (PQM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PSP',
                            'description':'Palm Springs Ca (PSP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PTY',
                            'description':'Panamá (PTY)',
                            'country':'PA',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PNS',
                            'description':'Pensacola (PNS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PIA',
                            'description':'Peoria (PIA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PEI',
                            'description':'Pereira (PEI)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PDS',
                            'description':'Piedras Negras (PDS)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PIT',
                            'description':'Pittsburgh (PIT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PIU',
                            'description':'Piura (PIU)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PTP',
                            'description':'Pointe-A-Pitre (PTP)',
                            'country':'GP',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'POS',
                            'description':'Port of Spain (POS)',
                            'country':'TT',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PDX',
                            'description':'Portland (PDX)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'POA',
                            'description':'Porto Alegre (POA)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PAZ',
                            'description':'Poza Rica (PAZ)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PCL',
                            'description':'Pucallpa (PCL)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PXM',
                            'description':'Puerto Escondido (PXM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PEM',
                            'description':'Puerto Maldonado (PEM)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PMC',
                            'description':'Puerto Montt (PMC)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PNT',
                            'description':'Puerto Natales (PNT)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PVR',
                            'description':'Puerto Vallarta (PVR)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PUQ',
                            'description':'Punta Arenas (PUQ)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PUJ',
                            'description':'Punta Cana (PUJ)',
                            'country':'DO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'QRO',
                            'description':'Queretaro (QRO)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'UIO',
                            'description':'Quito (UIO)',
                            'country':'EC',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'RDU',
                            'description':'Raleigh (RDU)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'REC',
                            'description':'Recife (REC)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'RNO',
                            'description':'Reno (RNO)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'REX',
                            'description':'Reynosa (REX)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'RIC',
                            'description':'Richmond (RIC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'RST',
                            'description':'Rochester (RST)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ROC',
                            'description':'Rochester NY (ROC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'RIO',
                            'description':'Río de Janeiro (RIO)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GIG',
                            'description':'Río de Janeiro Galeao A.C Jobim Intl (GIG)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'STX',
                            'description':'ST Croix Island (STX)',
                            'country':'PR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'STT',
                            'description':'ST Thomas (STT)',
                            'country':'PR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAC',
                            'description':'Sacramento (SAC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SLC',
                            'description':'Salt Lake City (SLC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SSA',
                            'description':'Salvador (SSA)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ADZ',
                            'description':'San Andrés (ADZ)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAT',
                            'description':'San Antonio (SAT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAN',
                            'description':'San Diego (SAN)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SFO',
                            'description':'San Francisco (SFO)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SJC',
                            'description':'San Jose (SJC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SJO',
                            'description':'San José de Costa Rica (SJO)',
                            'country':'CR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SJD',
                            'description':'San José del Cabo (SJD)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SJU',
                            'description':'San Juan de Puerto Rico (SJU)',
                            'country':'PR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SBP',
                            'description':'San Luis Obispo (SBP)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SLP',
                            'description':'San Luis Potosi (SLP)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAP',
                            'description':'San Pedro Sula (SAP)',
                            'country':'HN',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAL',
                            'description':'San Salvador (SAL)',
                            'country':'SV',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SBA',
                            'description':'Santa Barbara (SBA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SRZ',
                            'description':'Santa Cruz (SRZ)',
                            'country':'BO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SMR',
                            'description':'Santa Marta (SMR)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SCL',
                            'description':'Santiago de Chile (SCL)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SDQ',
                            'description':'Santo Domingo (SDQ)',
                            'country':'DO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAO',
                            'description':'Sao Paulo (SAO)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'GRU',
                            'description':'Sao Paulo Guarulhos Intl (GRU)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SRQ',
                            'description':'Sarasota (SRQ)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SAV',
                            'description':'Savannah (SAV)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SEA',
                            'description':'Seattle (SEA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'FSD',
                            'description':'Sioux Falls (FSD)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SGF',
                            'description':'Springfield (SGF)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SKB',
                            'description':'St Kitts (SKB)',
                            'country':'KN',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'STL',
                            'description':'St Louis (STL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SLU',
                            'description':'St Lucia (SLU)',
                            'country':'LC',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'SYR',
                            'description':'Syracuse (SYR)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TCQ',
                            'description':'Tacna (TCQ)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TYL',
                            'description':'Talara (TYL)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TLH',
                            'description':'Tallahassee (TLH)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TPA',
                            'description':'Tampa (TPA)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TAM',
                            'description':'Tampico (TAM)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TAP',
                            'description':'Tapachula (TAP)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TPP',
                            'description':'Tarapoto (TPP)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TGU',
                            'description':'Tegucigalpa (TGU)',
                            'country':'HN',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ZCO',
                            'description':'Temuco (ZCO)',
                            'country':'CL',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TPQ',
                            'description':'Tepic  (TPQ)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TIJ',
                            'description':'Tijuana (TIJ)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TAB',
                            'description':'Tobago (TAB)',
                            'country':'TT',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TOL',
                            'description':'Toledo (TOL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'YTO',
                            'description':'Toronto (YTO)',
                            'country':'CA',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TRC',
                            'description':'Torreon (TRC)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TVC',
                            'description':'Traverse City (TVC)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TRU',
                            'description':'Trujillo (TRU)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TUS',
                            'description':'Tucson (TUS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TUL',
                            'description':'Tulsa (TUL)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TBP',
                            'description':'Tumbes (TBP)',
                            'country':'PE',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'TGZ',
                            'description':'Tuxtla Gutiérrez (TGZ)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'UDI',
                            'description':'Uberlandia (UDI)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'YVR',
                            'description':'Vancouver (YVR)',
                            'country':'CA',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'VER',
                            'description':'Veracruz (VER)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'VSA',
                            'description':'Villahermosa (VSA)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'VIX',
                            'description':'Vitoria-Goiabeiras (VIX)',
                            'country':'BR',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'WAS',
                            'description':'Washington DC (WAS)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AUW',
                            'description':'Wausau (AUW)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'PBI',
                            'description':'West Palm Beach (PBI)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ICT',
                            'description':'Wichita (ICT)',
                            'country':'US',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'EYP',
                            'description':'Yopal (EYP)',
                            'country':'CO',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'ZIH',
                            'description':'Zihuatanejo (ZIH)',
                            'country':'MX',
                            'group':'América',
                            'selected':false
                        },
                        {
                            'code':'AUH',
                            'description':'Abu Dhabi (AUH)',
                            'country':'AE',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ACC',
                            'description':'Accra (ACC)',
                            'country':'GH',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ADD',
                            'description':'Addis Ababa (ADD)',
                            'country':'KE',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'AGA',
                            'description':'Agadir (AGA)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'AMM',
                            'description':'Ammán (AMM)',
                            'country':'JO',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ALG',
                            'description':'Argel (ALG)',
                            'country':'DZ',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'BAH',
                            'description':'Bahrain (BAH)',
                            'country':'BH',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'BJL',
                            'description':'Banjul (BJL)',
                            'country':'GM',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'BEY',
                            'description':'Beirut (BEY)',
                            'country':'LB',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'BFN',
                            'description':'Bloemfontein (BFN)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'CAS',
                            'description':'Casablanca (CAS)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'CPT',
                            'description':'Ciudad del Cabo (CPT)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DKR',
                            'description':'Dakar (DKR)',
                            'country':'SN',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DSS',
                            'description':'Dakar Blaise Diagne Intl (DSS)',
                            'country':'SN',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'VIL',
                            'description':'Dakhla (VIL)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DAR',
                            'description':'Dar Es Salaam (DAR)',
                            'country':'TZ',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DOH',
                            'description':'Doha (DOH)',
                            'country':'QA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DXB',
                            'description':'Dubai (DXB)',
                            'country':'AE',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'DUR',
                            'description':'Durban (DUR)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ELS',
                            'description':'East London (ELS)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'CAI',
                            'description':'El Cairo (CAI)',
                            'country':'EG',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ERH',
                            'description':'Errachidia (ERH)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'FEZ',
                            'description':'Fez (FEZ)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'HRE',
                            'description':'Harare (HRE)',
                            'country':'ZW',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'JED',
                            'description':'Jeddah (JED)',
                            'country':'SA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'JNB',
                            'description':'Johannesburgo (JNB)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'JRO',
                            'description':'Kilimanjaro (JRO)',
                            'country':'TZ',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'KIM',
                            'description':'Kimberley (KIM)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'KWI',
                            'description':'Kuwait (KWI)',
                            'country':'KW',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'EUN',
                            'description':'Laayoune (EUN)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'RAK',
                            'description':'Marrakech (RAK)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'MRU',
                            'description':'Mauricio (MRU)',
                            'country':'MU',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'MCT',
                            'description':'Muscat (MCT)',
                            'country':'OM',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'NDR',
                            'description':'Nador (NDR)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'NBO',
                            'description':'Nairobi (NBO)',
                            'country':'KE',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'NKC',
                            'description':'Nuakchot (NKC)',
                            'country':'MR',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ORN',
                            'description':'Orán (ORN)',
                            'country':'DZ',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'OZZ',
                            'description':'Ouarzazate (OZZ)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'OUD',
                            'description':'Oujda (OUD)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'PLZ',
                            'description':'Port Elizabeth (PLZ)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'RBA',
                            'description':'Rabat (RBA)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'RUH',
                            'description':'Riyadh (RUH)',
                            'country':'SA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'SID',
                            'description':'Sal (SID)',
                            'country':'SN',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'TLV',
                            'description':'Tel Aviv (TLV)',
                            'country':'IL',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'TTU',
                            'description':'Tetuán (TTU)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'TNG',
                            'description':'Tánger (TNG)',
                            'country':'MA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'UTN',
                            'description':'Upingtown (UTN)',
                            'country':'ZA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'VFA',
                            'description':'Victoria Falls (VFA)',
                            'country':'ZW',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'WDH',
                            'description':'Windhoek (WDH)',
                            'country':'NA',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ZNZ',
                            'description':'Zanzíbar (ZNZ)',
                            'country':'TZ',
                            'group':'África y Oriente Medio',
                            'selected':false
                        },
                        {
                            'code':'ADL',
                            'description':'Adelaida (ADL)',
                            'country':'AU',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'AXT',
                            'description':'Akita (AXT)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'AOJ',
                            'description':'Aomori (AOJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'AKJ',
                            'description':'Asahikawa (AKJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'AKL',
                            'description':'Auckland (AKL)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'DPS',
                            'description':'Bali (DPS)',
                            'country':'ID',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'BLR',
                            'description':'Bangalore (BLR)',
                            'country':'IN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'BKK',
                            'description':'Bangkok (BKK)',
                            'country':'TH',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'BOM',
                            'description':'Bombai (BOM)',
                            'country':'IN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CGQ',
                            'description':'Changchun (CGQ)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CSX',
                            'description':'Changshá (CSX)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CTU',
                            'description':'Chengdu (CTU)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MAA',
                            'description':'Chennai (MAA)',
                            'country':'IN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CKG',
                            'description':'Chongqing (CKG)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CHC',
                            'description':'Christchurch (CHC)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CMB',
                            'description':'Colombo (CMB)',
                            'country':'LK',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'DLC',
                            'description':'Dalian (DLC)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'DEL',
                            'description':'Delhi (DEL)',
                            'country':'IN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'DUD',
                            'description':'Dunedin (DUD)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'FUK',
                            'description':'Fukuoka (FUK)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'GIS',
                            'description':'Gisborne (GIS)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'CAN',
                            'description':'Guangzhou (CAN)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HAK',
                            'description':'Haikou (HAK)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HKD',
                            'description':'Hakodate (HKD)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HIJ',
                            'description':'Hiroshima (HIJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SGN',
                            'description':'Ho Chi Minh City (SGN)',
                            'country':'VN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HKG',
                            'description':'Hong Kong (HKG)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HYD',
                            'description':'Hyderabad (HYD)',
                            'country':'IN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'ISB',
                            'description':'Islamabad (ISB)',
                            'country':'PK',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'IZO',
                            'description':'Izumo (IZO)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KOJ',
                            'description':'Kagoshima (KOJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KHI',
                            'description':'Karachi (KHI)',
                            'country':'PK',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KKJ',
                            'description':'Kitakyushu (KKJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KCZ',
                            'description':'Kochi (KCZ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KMQ',
                            'description':'Komatsu (KMQ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KUL',
                            'description':'Kuala Lumpur (KUL)',
                            'country':'MY',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KMJ',
                            'description':'Kumamoto (KMJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KUH',
                            'description':'Kushiro (KUH)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'LHE',
                            'description':'Lahore (LHE)',
                            'country':'PK',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MLE',
                            'description':'Male (MLE)',
                            'country':'MV',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MNL',
                            'description':'Manila (MNL)',
                            'country':'PH',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MYJ',
                            'description':'Matsuyama (MYJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MEL',
                            'description':'Melbourne (MEL)',
                            'country':'AU',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MMB',
                            'description':'Memanbetsu (MMB)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'MSJ',
                            'description':'Misawa (MSJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'KMI',
                            'description':'Miyazaki (KMI)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NGS',
                            'description':'Nagasaki (NGS)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NGO',
                            'description':'Nagoya (NGO)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NPE',
                            'description':'Napier (NPE)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NSN',
                            'description':'Nelson (NSN)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NPL',
                            'description':'New Plymouth (NPL)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'NOU',
                            'description':'Numea (NOU)',
                            'country':'NC',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'OBO',
                            'description':'Obihiro (OBO)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'OIT',
                            'description':'Oita (OIT)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'OKJ',
                            'description':'Okayama (OKJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'OKA',
                            'description':'Okinawa (OKA)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'OSA',
                            'description':'Osaka (OSA)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'PMR',
                            'description':'Palmerston Nort (PMR)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'BJS',
                            'description':'Pekín (BJS)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'PER',
                            'description':'Perth (PER)',
                            'country':'AU',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'HKT',
                            'description':'Phuket (HKT)',
                            'country':'TH',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'ZQN',
                            'description':'Queenstown (ZQN)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'ROT',
                            'description':'Rotorua (ROT)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SPK',
                            'description':'Sapporo (SPK)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SEL',
                            'description':'Seúl (SEL)',
                            'country':'KR',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SHA',
                            'description':'Shanghái (SHA)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SHE',
                            'description':'Shenyang  (SHE)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SZX',
                            'description':'Shenzhen (SZX)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SHM',
                            'description':'Shirahama (SHM)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SIN',
                            'description':'Singapur (SIN)',
                            'country':'SG',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SYD',
                            'description':'Sídney (SYD)',
                            'country':'AU',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'TPE',
                            'description':'Taipéi (TPE)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'TAK',
                            'description':'Takamatsu (TAK)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'TRG',
                            'description':'Tauranga (TRG)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'TYO',
                            'description':'Tokio (TYO)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'TKS',
                            'description':'Tokushima (TKS)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'UBJ',
                            'description':'Ube (UBJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'WLG',
                            'description':'Wellington (WLG)',
                            'country':'NZ',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'SIA',
                            'description':'Xi’an (SIA)',
                            'country':'CN',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'JKT',
                            'description':'Yakarta (JKT)',
                            'country':'ID',
                            'group':'Asia y Oceanía',
                            'selected':false
                        },
                        {
                            'code':'GAJ',
                            'description':'Yamagata (GAJ)',
                            'country':'JP',
                            'group':'Asia y Oceanía',
                            'selected':false
                        }
                    ]
                },
                'typeCabins':[
                    {
                        'code':'R',
                        'description':'HEADER_ADVANCED_SEARCH_CABINS_ECONOMY',
                        'cabinClass':'ECONOMY',
                        '$$hashKey':'object:1459'
                    },
                    {
                        'code':'N',
                        'description':'HEADER_ADVANCED_SEARCH_CABINS_PREMIUM',
                        'cabinClass':'PREMIUMTOURIST',
                        '$$hashKey':'object:1460'
                    },
                    {
                        'code':'B',
                        'description':'HEADER_ADVANCED_SEARCH_CABINS_BUSINESS',
                        'cabinClass':'BUSINESS',
                        '$$hashKey':'object:1461'
                    }
                ],
                'cabinSelected':{
                    'code':'R',
                    'description':'HEADER_ADVANCED_SEARCH_CABINS_ECONOMY',
                    'cabinClass':'ECONOMY',
                    '$$hashKey':'object:1459'
                },
                'selectedOutbondDate':'2021-02-02T23:00:00.000Z',
                'selectedReturnDate':'2021-02-17T23:00:00.000Z',
                'passengers':{
                    'numberPassengers':1,
                    'numAdults':1,
                    'numSeniors':0,
                    'numYouth':0,
                    'numTeenager':0,
                    'numChilds':0,
                    'numInfants':0
                }
            };
            var availabilityRequestDataMock = { 'slices': [{ 'origin': 'MAD', 'destination': 'BIO', 'date': '2021-02-03' }, { 'origin': 'BIO', 'destination': 'MAD', 'date': '2021-02-18' }], 'passengers': [{ 'passengerType': 'ADULT', 'count': 1 }], 'marketCode': 'ES', 'preferredCabin': 'ECONOMY' }
            localStorageService.set('availabilityRequestData', availabilityRequestDataMock);
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'es';
            url = advancedSearchTransformer.createNewAdvancedSearch(advancedSearchData);
            expect(url.indexOf('market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=2&BEGIN_CITY_01=MAD&END_CITY_01=BIO&BEGIN_DAY_01=03&BEGIN_MONTH_01=202102&BEGIN_YEAR_01=2021&END_DAY_01=18&END_MONTH_01=202102&END_YEAR_01=2021&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0') > -1).toBe(true);
        });
    });
});