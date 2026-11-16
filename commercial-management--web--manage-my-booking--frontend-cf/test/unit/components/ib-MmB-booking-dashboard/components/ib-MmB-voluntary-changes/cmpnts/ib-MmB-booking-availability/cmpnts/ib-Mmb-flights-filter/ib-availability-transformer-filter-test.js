describe('AvailabilityTransformerFilter test', function () {

    var AvailabilityTransformerFilter;

    var fakeMmBUtilService = {}

    var dataFake = {
        filter: {
            cabin: {
                name: 'Turista'
            },
            changes: true,
            company: true,
            fare: [],
            fareSelected: [],
            rangeHoursArrival: {
                active: true,
                max: 22,
                min: 14
            },
            rangeHoursDeparture: {
                active: true,
                max: 19,
                min: 11
            },
            rangePrice: {
                active: true,
                max: 463,
                maxCurrency: '€463,00 ',
                min: 84,
                minCurrency: '€84,00 '
            },
            scale: [{
                checked: true,
                numScale: 0
            }, {
                checked: true,
                numScale: 1
            }],

        }
    };

    var dataFake2 = {
        filter: {
            cabin: {
                name: 'Turista'
            },
            changes: true,
            company: true,
            fare: [],
            fareSelected: [],
            rangeHoursArrival: {
                active: true,
                max: 22,
                min: 14
            },
            rangeHoursDeparture: {
                active: true,
                max: 19,
                min: 11
            },
            rangePrice: {
                active: true,
                max: 463,
                maxCurrency: '€463,00 ',
                min: 84,
                minCurrency: '€84,00 '
            },
            scale: [{
                checked: true,
                numScale: 2
            }],

        }
    };

    var dataFake3 = {
        filter: {
            cabin: {
                name: 'Turista'
            },
            changes: true,
            company: true,
            fare: [],
            fareSelected: [],
            rangeHoursArrival: {
                active: true,
                max: 22,
                min: 14
            },
            rangeHoursDeparture: {
                active: true,
                max: 19,
                min: 11
            },
            rangePrice: {
                active: true,
                max: 463,
                maxCurrency: '€463,00 ',
                min: 84,
                minCurrency: '€84,00 '
            },
            scale: [{
                checked: true,
                numScale: 2
            },{
                checked: true,
                numScale: 1
            }],

        }
    };

    var copy = [
        {
            cabins: [{
                title: 'Turista',
                disabled: true
            }, {
                title: 'Business',
                disabled: false
            }],
            destination: 'BRU',
            info: {
                arrivalDate: '2019-09-20',
                arrivalTime: '11:15',
                cashAvios: null,
                date: '20190920',
                departureDate: '2019-09-20',
                departureTime: '08:55',
                destination: 'BRU',
                iconCompany: {
                    companyURL: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    companyDisabledURL: '/iberia-web-content/iconos/aerolineas/undefined'
                },
                numberOpereds: '',
                origin: 'MAD',
                passedMinutes: 140,
                passedTime: '2h 20min',
                scale: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                stopsNumber: ''
            },
            opereds: '',
            origin: 'MAD',
            segments: [{
                airplane: 'Airbus A319',
                arrivalDate: '2019-09-20',
                arrivalPlace: 'Bruselas ( BRU )',
                arrivalTime: '11:15',
                dateDeparture: '2019-09-20',
                departureDate: '2019-09-20',
                departurePlace: 'Madrid ( MAD )',
                departureTime: '08:55',
                line: 'IB3206',
                opered: 'Iberia',
                passedTime: 140,
            }],
            slideId: '1',
            visibility: true
        },
        {
            cabins: [{
                title: 'Turista',
                disabled: true
            }, {
                title: 'Business',
                disabled: false
            }],
            destination: 'BR',
            info: {
                arrivalDate: '2019-09-20',
                arrivalTime: '11:15',
                cashAvios: null,
                date: '20190920',
                departureDate: '2019-09-20',
                departureTime: '08:55',
                destination: 'BRU',
                iconCompany: {
                    companyURL: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    companyDisabledURL: '/iberia-web-content/iconos/aerolineas/undefined'
                },
                numberOpereds: '',
                origin: 'MAD',
                passedMinutes: 140,
                passedTime: '2h 20min',
                scale: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                stopsNumber: ''
            },
            opereds: '',
            origin: 'MAD',
            segments: [{
                airplane: 'Airbus A319',
                arrivalDate: '2019-09-20',
                arrivalPlace: 'Bruselas ( BRU )',
                arrivalTime: '11:15',
                dateDeparture: '2019-09-20',
                departureDate: '2019-09-20',
                departurePlace: 'Madrid ( MAD )',
                departureTime: '08:55',
                line: 'IB3206',
                opered: 'Iberia',
                passedTime: 140,
            }],
            slideId: '1',
            visibility: true
        },
        {
            cabins: [{
                title: 'other',
                disabled: true
            }, {
                title: 'Business',
                disabled: false
            }],
            destination: 'BRU',
            info: {
                arrivalDate: '2019-09-20',
                arrivalTime: '11:15',
                cashAvios: null,
                date: '20190920',
                departureDate: '2019-09-20',
                departureTime: '08:55',
                destination: 'BRU',
                iconCompany: {
                    companyURL: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    companyDisabledURL: '/iberia-web-content/iconos/aerolineas/undefined'
                },
                numberOpereds: '',
                origin: 'MAD',
                passedMinutes: 140,
                passedTime: '2h 20min',
                scale: 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                stopsNumber: ''
            },
            opereds: '',
            origin: 'MAD',
            segments: [{
                airplane: 'Airbus A319',
                arrivalDate: '2019-09-20',
                arrivalPlace: 'Bruselas ( BRU )',
                arrivalTime: '11:15',
                dateDeparture: '2019-09-20',
                departureDate: '2019-09-20',
                departurePlace: 'Madrid ( MAD )',
                departureTime: '08:55',
                line: 'IB3206',
                opered: 'Iberia',
                passedTime: 140,
            }],
            slideId: '1',
            visibility: true
        }
    ]

    var emptyfilter = {
        filter: {
            cabine: null,
            scale: []
        }
    }

    var expectEmptyFilter = [
        {
            'cabins': [
                {
                    'title': 'Turista',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BRU',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        },
        {
            'cabins': [
                {
                    'title': 'Turista',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BR',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        },
        {
            'cabins': [
                {
                    'title': 'other',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BRU',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        }
    ]

    var expectRangePriceCase2 = [
        {
            'cabins': [
                {
                    'title': 'Turista',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BRU',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        },
        {
            'cabins': [
                {
                    'title': 'Turista',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BR',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        },
        {
            'cabins': [
                {
                    'title': 'other',
                    'disabled': true
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BRU',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        }
    ]
    var expectRangePriceCase4 = [
        {
            'cabins': [
                {
                    'title': 'Turista',
                    'disabled': true,
                    'priceNumber': 100
                },
                {
                    'title': 'Business',
                    'disabled': false
                }
            ],
            'destination': 'BRU',
            'info': {
                'arrivalDate': '2019-09-20',
                'arrivalTime': '11:15',
                'cashAvios': null,
                'date': '20190920',
                'departureDate': '2019-09-20',
                'departureTime': '08:55',
                'destination': 'BRU',
                'iconCompany': {
                    'companyURL': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                    'companyDisabledURL': '/iberia-web-content/iconos/aerolineas/undefined'
                },
                'numberOpereds': '',
                'origin': 'MAD',
                'passedMinutes': 140,
                'passedTime': '2h 20min',
                'scale': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
                'stopsNumber': ''
            },
            'opereds': '',
            'origin': 'MAD',
            'segments': [
                {
                    'airplane': 'Airbus A319',
                    'arrivalDate': '2019-09-20',
                    'arrivalPlace': 'Bruselas ( BRU )',
                    'arrivalTime': '11:15',
                    'dateDeparture': '2019-09-20',
                    'departureDate': '2019-09-20',
                    'departurePlace': 'Madrid ( MAD )',
                    'departureTime': '08:55',
                    'line': 'IB3206',
                    'opered': 'Iberia',
                    'passedTime': 140
                }
            ],
            'slideId': '1',
            'visibility': true
        }
    ]

    beforeEach(function () {
        module('ib-MmB-booking-availability-module', function ($provide) {
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$translate', {});
        });
        inject(function (_AvailabilityTransformerFilter_) {
            AvailabilityTransformerFilter = _AvailabilityTransformerFilter_;
        });

    });

    describe('when applyFilter() is called, if there are conditions model.', function () {
        
        it('when not exits filter should not apply filter to data', function () {
            var result;
            result = AvailabilityTransformerFilter.applyFilter(emptyfilter, angular.copy(copy));
            expect(angular.toJson(result)).toEqual(angular.toJson(expectEmptyFilter));
        });

        it('when exits filter should apply filter to data (scale case 1)', function () {
            var result;
            result = AvailabilityTransformerFilter.applyFilter(angular.copy(dataFake), angular.copy(copy));
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (scale case 2)', function () {
            var result;
            result = AvailabilityTransformerFilter.applyFilter(dataFake2, angular.copy(copy));
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (scale case 3)', function () {
            var result;
            result = AvailabilityTransformerFilter.applyFilter(dataFake3, angular.copy(copy));
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (company case 1)', function () {
            var result;
            var data = angular.copy(dataFake);
            var copy1 = angular.copy(copy);
            data.filter.company = null;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (company case 2)', function () {
            var result;
            var data = angular.copy(dataFake);
            var copy1 = angular.copy(copy);
            copy1[0].info.cashAvios = true;
            copy1[1].info.cashAvios = true;
            copy1[2].info.cashAvios = true;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (company case 3)', function () {
            var result;
            var data = angular.copy(dataFake);
            var copy1 = angular.copy(copy);
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursArrival case 1)', function () {
            var result;
            var data = angular.copy(dataFake);
            var copy1 = angular.copy(copy);
            data.filter.rangeHoursArrival.active = false;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursArrival case 2)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.min = 10;
            data.filter.rangeHoursArrival.max = 10;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursArrival case 3)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.min = 9;
            data.filter.rangeHoursArrival.max = 12;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursDeparture case 1)', function () {
            var result;
            var data = angular.copy(dataFake);
            var copy1 = angular.copy(copy);
            data.filter.rangeHoursDeparture.active = false;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursDeparture case 2)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.max = 5;
            data.filter.rangeHoursDeparture.min = 10;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangeHoursDeparture case 3)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.max = 10;
            data.filter.rangeHoursDeparture.min = 7;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangePrice case 1)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.active = false;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });

        it('when exits filter should apply filter to data (rangePrice case 2)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.active = false;
            data.filter.rangePrice.active = false;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectRangePriceCase2));
        });

        it('when exits filter should apply filter to data (rangePrice case 3)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.active = false;
            copy1[0].cabins[0].priceNumber=null;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(result).toEqual([]);
        });
        
        it('when exits filter should apply filter to data (rangePrice case 4)', function () {
            var result;
            var copy1 = angular.copy(copy);
            var data = angular.copy(dataFake);
            data.filter.cabin = null;
            data.filter.scale = [];
            data.filter.company = null;
            data.filter.rangeHoursArrival.active = false;
            data.filter.rangeHoursDeparture.active = false;
            copy1[0].cabins[0].priceNumber=100;
            result = AvailabilityTransformerFilter.applyFilter(data, copy1);
            expect(angular.toJson(result)).toEqual(angular.toJson(expectRangePriceCase4));
        });

    });

});