
describe('test for module ib-flexibilization-slices-module - controllers', () => {

    let fake$scope = {
        '$emit': jasmine.createSpy(),
    };

    beforeEach(() => {
        angular.mock.module('ib-flexibilization-slices-module', 'LocalStorageModule', function ($provide) {
            $provide.value('$scope', fake$scope);
        });
    });

    describe('test for IbFlexSlicesController', () => {

        let IbFlexSlicesController;
        let $controller;
        let $rootScope;
        let $scope;
        let $injector;

        beforeEach(() => {
            inject((_$controller_, _$injector_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                IbFlexSlicesController = $controller('IbFlexSlicesController', { $scope: $scope });
            });
        });

        it('IbFlexSlicesController should be defined', () => {
            expect(IbFlexSlicesController).toBeDefined();
        });
        let object1 = {
            offers: [
                {
                    offerId: 'IB7c6dedecfa2f4a90b3e163d63a3cf833OP',
                    offerItems: {
                        offerItemId: 'IB7c6dedecfa2f4a90b3e163d63a3cf833OP_01',
                        passengerIds: [
                            'ADULT_01'
                        ],
                        privateFareInformation: null
                    },
                    providerOfferId: 'WepjJB3Sa10MENGTnN8e9D002',
                    privateFare: false,
                    offerType: ''
                }
            ],
            sliceId: '2',
            arrivalDate: '2020-06-17',
            arrivalTime: '10:35',
            arrivalDiffDay: 0,
            departureDate: '2020-06-17',
            departureTime: '09:25',
            durationMinutes: 70,
            durationParsed: '1h 10min.',
            overnight: false,
            stopsNumber: '',
            scale: 'MMB_VC_YOUR_FLIGHTS_DIRECT_TEXT',
            segments: [
                {
                    segmentId: 'IB042320200617',
                    arrivalDate: '2020-06-17',
                    arrivalTime: '10:35',
                    departureDate: '2020-06-17',
                    departureTime: '09:25',
                    durationMinutes: 70,
                    durationParsed: '1h 10min.',
                    departurePlace: 'Bilbao (BIO)',
                    arrivalPlace: 'Madrid Adolfo Suarez-Barajas (MAD)',
                    line: 'Iberia423',
                    airplane: 'Airbus Industrie A320 (Sharklets)',
                    opered: 'Iberia',
                    iconCompany: {
                        companyURL: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                        companyDisabledURL: '/iberia-web-content/iconos/aerolineas/undefined'
                    },
                    stop: {
                        isStop: null,
                        place: '',
                        time: ''
                    },
                    waitingTime: '',
                    warnings: {
                        nightFlight: {
                            isOverNight: false,
                            message: 'MMB_NIGHT_FLIGHT',
                            needstranslate: true
                        }
                    },
                    $$hashKey: 'object:311'
                }
            ],
            iconCompany: {
                companyURL: '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg',
                companyDisabledURL: '/iberia-web-content/iconos/aerolineas/undefined'
            },
            companyName: 'Iberia',
            origin: {
                code: 'BIO',
                description: 'Bilbao'
            },
            destination: {
                code: 'MAD',
                description: 'Madrid'
            },
            cashAvios: null,
            numberOpereds: 1,
            tripSliceId: 'BIOMAD20200514175000',
            responseId: 'Qm9va2luZ0BHVy0xNTg4NjU3MjI5NTkwLThEak5KMjM2NGViMTFmMDkxNDAyOGFhYThiNzFiNmRkZjg2Yzk%3D',
            $$hashKey: 'object:295'
        };

        it('test for IbFlexSlicesController.optionSelected', () => {
            IbFlexSlicesController.$onInit();
            IbFlexSlicesController.optionSelected(object1);
            expect(IbFlexSlicesController.optionSelected).toBeDefined();
        });

        describe('when $onInit() is called', () => {
            it('The $onInit should be defined', () => {
                IbFlexSlicesController.$onInit();
                expect(IbFlexSlicesController.$onInit).toBeDefined();
            });
        });
    });
});