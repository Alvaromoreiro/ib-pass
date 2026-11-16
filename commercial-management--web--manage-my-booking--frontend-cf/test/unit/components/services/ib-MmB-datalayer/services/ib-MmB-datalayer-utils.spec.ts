import angular from 'angular';
import { AncillariesConstantsMock } from './../../../../../mocks/constants/AncillariesConstants-mock';

describe('DatalayerUtilsService Test', () => {
    let DatalayerUtils, localStorageService;

    let fakeDatalayerConstants = {
        DATALAYER_VALUES: {
            PURCHASE_CATEGORY: {
                DIRECT: 'test'
            }
        },
        EVENTS_ECOMMERCE: {
            SELECT_ITEM: 'test',
            ADD_TO_CART: 'test',
            REMOVE_FROM_CART: 'test',
            VIEW_ITEM_LIST:  'test',
        }
    };
    let fakeAncillariesConstants = AncillariesConstantsMock;

    let fakeCommonsUtilService = {
        getIdItem: jasmine.createSpy(),
        getSliceById: jasmine.createSpy(),
        checkIsAddToCart: jasmine.createSpy(),
    };
    let fakeDigitalDataService = {
        addDigitalDataEcommerceEvent: jasmine.createSpy(),
        setAddInfoAddToCart: jasmine.createSpy(),
        setRemoveInfoAddToCart: jasmine.createSpy(),
    };

    let fakeDatalayerUtilsService = {
        getItemCategory2: jasmine.createSpy(),
        getItemCategory3: jasmine.createSpy(),
    };

    let fakeAncillariesInfo = {
        ancillaries: [
            {
                type: 'BAGGAGE',
                slices: [{
                    id: 'test',
                    passengers: [{
                        pieces: [{
                            description: '30Kg',
                            availablePriceRanges: [{
                                amount: 50
                            }]
                        }]
                    }]
                }]
            },
            {
                type: 'SEAT'
            },
            {
                type: 'INSURANCE',
                provider: 'test',
                offers: [{
                    premium: 'test',
                    code: 'ES'
                }]
            },
            {
                type: 'FLEXIBILITY_ON_DEMAND',
                flexibilityAncillaries: [{
                    total: 30,
                    description: 'test'
                }]
            },
            {
                type: 'SPECIAL_EQUIPMENT',
                slices: [{
                    passengers: [{
                        pieces: [{
                            description: 'tal',
                            availablePriceRanges: [{
                                amount: 50
                            }]
                        }]
                    }]
                }]
            },
            {
                type: 'PRIORITY_BOARDING',
                segments: [{
                    passengers: [{
                        amount: 50
                    }]
                }]
            },
        ],
        bundles: [{
            priceItemsDiscount: 50,
            id: 'test'
        }],
        slices: [{
            id: 'testid',
            segmentIds: ['1234']
        }]
    };
    let fakeSelectedTripInfo = [{
        origin: 'test',
        info: {
            segments: [{
                flight: {
                    operationalCarrier: {
                        name: 'test'
                    }
                }
            }]
        }
    },
    {
        origin: 'testdos',
        info: {
            segments: [{
                flight: {
                    operationalCarrier: {
                        name: 'testdos'
                    }
                }
            }]
        }
    }];

    let fakeflightsInfo = [{
        departure: {
            code: 'MAD'
        },
        flight: {
            operationalCarrier: {
                name: 'Iberia'
            }
        }
    },
    {
        departure: {
            code: 'MAD'
        },
        flight: {
            operationalCarrier: {
                name: 'Iberia'
            }
        }
    }];

    let fakeSegmentsInfo = [{
        id: 'test',
        origin: {
            code: 'MAD'
        },
        destination: {
            code: 'BIO'
        }
    }];

    let fakeSeatInfoConfirmation = {
        segments: [{
            id: 'test',
            departure: {
                code: 'MAD'
            },
            arrival: {
                code: 'BIO'
            }
        }]
    };

    let fakeModelPassengers = {
        passengers: [{
            trips: [{
                departure: {
                    code: 'MAD'
                },
                arrival: {
                    code: 'BIO'
                },
                pieces: [{
                    quantySelected: 3,
                    description: '30Kg',
                    availablePriceRanges: [{
                        from: 1,
                        to: 3,
                        amount: 50
                    }]
                }]
            }]
        },
        {
            trips: [{
                departure: {
                    code: 'MAD'
                },
                arrival: {
                    code: 'BIO'
                },
                pieces: [{
                    quantySelected: 3,
                    description: '30Kg',
                    availablePriceRanges: [{
                        from: 1,
                        to: 3,
                        amount: 50
                    }]
                }]
            }]
        }]
    };

    let fakeTrip = {
        id: 'test',
        departure: {
            code: 'MAD'
        },
        arrival: {
            code: 'BIO'
        }
    };

    let fakePiece = {
        description: '30Kg',
        quantySelected: 2,
        availablePriceRanges: [{
            from: 1,
            to: 3,
            amount: 50
        }],
        subtype: 'other'
    };

    let fakeSelectedBundle = {
        priceItemsDiscount: 50,
        id:'test',
        items: [
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_15',
                priceItemDiscount: 30
            },
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_23',
                priceItemDiscount: 30
            },
            {
                type: 'BAGGAGE',
                subtype: 'BAGGAGE_32',
                priceItemDiscount: 30
            },
            {
                type: 'SPECIAL_EQUIPMENT',
                subtype: 'BICYCLE',
                priceItemDiscount: 30
            },
            {
                type: 'SPECIAL_EQUIPMENT',
                subtype: 'GOLF_EQUIPMENT',
                priceItemDiscount: 30
            },
            {
                type: 'SPECIAL_EQUIPMENT',
                subtype: 'SKI_SNOW',
                priceItemDiscount: 30
            },
            {
                type: 'FLEXIBILITY_ON_DEMAND',
                subtype: 'FLEXIBILITY_PACK',
                priceItemDiscount: 30
            },
            {
                type: 'FLEXIBILITY_ON_DEMAND',
                subtype: 'FLIGHT_CHANGE',
                priceItemDiscount: 30
            },
            {
                type: 'FLEXIBILITY_ON_DEMAND',
                subtype: 'VOUCHER_REFUND',
                priceItemDiscount: 30
            },
            {
                type: 'PRIORITY_BOARDING',
                subtype: 'PRIORITY_BOARDING',
                priceItemDiscount: 30
            }
        ]
    };

    let fakeLocalStorageService = {
        storage: {},
        set(key, value) {
            this.storage[key] = value;
        },
        get(key) {
            return this.storage[key];
        },
        remove(key) {
            delete this.storage[key];
        },
        clearAll() {
            this.storage = {};
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-web-ancillaries-module', ($provide) => {
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DigitalDataService', fakeDigitalDataService);
            $provide.value('AncillariesConstants', fakeAncillariesConstants);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('localStorageService', fakeLocalStorageService);
        });
        inject(function(_DatalayerUtils_, _localStorageService_) {
            DatalayerUtils = _DatalayerUtils_;
            localStorageService = _localStorageService_;

            localStorageService.set('ancillariesInfo', fakeAncillariesInfo);
            localStorageService.set('selectedTripInfo', fakeSelectedTripInfo);
            localStorageService.set('flightsInfo', fakeflightsInfo);
            localStorageService.set('confirmationDatalayerInfo', '');
            localStorageService.set('seatMap', {segmentId: 'test',seatPriceInfo:{seatPrices: [{amount: 50, type: '1A'}]}});
            localStorageService.set('flowApp', 'MMB');
            localStorageService.set('ancillariesAvailableSegments', ['1234']);
            localStorageService.set('segmentsSelected', [{id:1234}]);
            localStorageService.set('bobInfo', {slices: [{sliceId: 'testid'}]});
        });
    });

    describe('When getAncillariesDigitalDataEcommerce is called', () => {
        it('and type baggages ', (done) => {
            localStorageService.set('flowApp', 'other');
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.getAncillariesDigitalDataEcommerce('baggages');
            expect(fakeDatalayerUtilsService.getItemCategory3).toHaveBeenCalled();
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type seat and getTripBySeats with segmentsInfo', (done) => {
            localStorageService.set('segmentsInfo', fakeSegmentsInfo);
            localStorageService.set('seatInfoConfirmation', false);
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.getAncillariesDigitalDataEcommerce('seat');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type seat and getTripBySeats with seatInfoConfirmation ', (done) => {
            localStorageService.set('segmentsInfo', false);
            localStorageService.set('seatInfoConfirmation', fakeSeatInfoConfirmation);
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.getAncillariesDigitalDataEcommerce('seat');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type insurance ', (done) => {
            DatalayerUtils.getAncillariesDigitalDataEcommerce('insurance');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type flexibilization ', (done) => {
            DatalayerUtils.getAncillariesDigitalDataEcommerce('flexibilization');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type special baggages ', (done) => {
            DatalayerUtils.getAncillariesDigitalDataEcommerce('special baggages');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type priority boarding', (done) => {
            DatalayerUtils.getAncillariesDigitalDataEcommerce('priority boarding');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and type bundle', (done) => {
            DatalayerUtils.getAncillariesDigitalDataEcommerce('bundle');
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setBaggagesSelectItem is called', () => {
        it('and call addDigitalDataEcommerceEvent ', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let fakeBaggageTypeSelected = {
                description: '30Kg',
                quantySelected: 2,
                availablePriceRanges: [{
                    from: 1,
                    to: 3,
                    amount: 50
                }]
            };
            DatalayerUtils.setBaggagesSelectItem(copyfakeTrip, fakeBaggageTypeSelected);
            expect(fakeDatalayerUtilsService.getItemCategory3).toHaveBeenCalled();
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });
    describe('When setSelectItemAndAddToCartBundle is called', () => {
        it('and call addDigitalDataEcommerceEvent ', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.setSelectItemAndAddToCartBundle(fakeSelectedBundle);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setBaggagesEventCart is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            localStorageService.set('addToCart', {ecommerce: {items: [{item_name : ''}]}});
            let fakeModel = {...fakeModelPassengers};
            DatalayerUtils.setBaggagesEventCart(fakeModel);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setBaggagesRemoveFromCart is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let fakeBaggageTypeSelected = {
                description: '30Kg',
                quantySelected: 2,
                availablePriceRanges: [{
                    from: 1,
                    to: 3,
                    amount: 50
                }]
            };
            DatalayerUtils.setBaggagesRemoveFromCart(copyfakeTrip, fakeBaggageTypeSelected);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setSeatSelectItem is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeModel = {
                seatMapInfo: {
                    segmentInfo: {
                        id: 'test',
                        departure: {
                            code: 'MAD'
                        },
                        arrival: {
                            code: 'BIO'
                        }
                    }
                }
            };
            let fakeSeatSelected = {
                id: 'test',
                price: 30,
                originalType: 'originalType'
            };
            DatalayerUtils.setSeatSelectItem(fakeModel, fakeSeatSelected);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setRemoveSeatSelectedId is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            DatalayerUtils.setRemoveSeatSelectedId();
            expect(DatalayerUtils.seatSelectedId ).toEqual([]);
            done();
        });
    });

    describe('When setSeatAddToCart  is called', () => {
        it('and call addDigitalDataEcommerceEvent with originalType', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeModel = {
                seatInfo: {
                    segments: [{
                        id: 'test',
                        departure: {
                            code: 'MAD'
                        },
                        arrival: {
                            code: 'BIO'
                        },
                        passengers: [{
                            seatPrice: 50,
                            currentSeat: {
                                seatType: '1A'
                            },

                        },
                        {
                            seatPrice: 50,
                            currentSeat: {
                                seatType: '2A'
                            },

                        }]
                    }]
                }
            };
            DatalayerUtils.setSeatAddToCart(fakeModel);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });

        it('and call addDigitalDataEcommerceEvent with seatType', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeModel = {
                seatInfo: {
                    segments: [{
                        id: 'test',
                        departure: {
                            code: 'MAD'
                        },
                        arrival: {
                            code: 'BIO'
                        },
                        passengers: [{
                            seatPrice: 50,
                            currentSeat: {
                                originalType: '1A'
                            },

                        }]
                    }]
                }
            };
            DatalayerUtils.setSeatAddToCart(fakeModel);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setInsuranceEcommerce is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeInsurance = {
                id: 'test',
                provider: 'test',
                originalPrice: 50
            };
            DatalayerUtils.setInsuranceEcommerce(fakeInsurance);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });
    describe('When setPriorityBoardingSelectItem is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeTripInfo = {
                id: 'test',
                amount: 50,
                numPassengers: 2
            };
            DatalayerUtils.setPriorityBoardingSelectItem(fakeTripInfo);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });
    describe('When setPriorityBoardingAddToCart is called', () => {
        it('and one items selectedTripInfo', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeSegments = [{
                id: 'test',
                passengerIds: ['ADULT_01','ADULT_02']
            }];
            let fakeInfo = [{
                trips: [{
                    id: 'test',
                    checkedTrip: true,
                    amount: 50
                }]
            }];
            DatalayerUtils.setPriorityBoardingAddToCart(fakeSegments, fakeInfo);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and remove items selectedTripInfo and two items flightsInfo', (done) => {
            localStorageService.set('selectedTripInfo', '');
            fakeDatalayerUtilsService.getItemCategory2 = jasmine.createSpy().and.returnValue({origin: 'testorigin'});
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeSegments = [{
                id: 'test',
                passengerIds: ['ADULT_01','ADULT_02']
            }];
            let fakeInfo = [{
                trips: [{
                    id: 'test',
                    checkedTrip: true,
                    amount: 50
                }]
            }];
            DatalayerUtils.setPriorityBoardingAddToCart(fakeSegments, fakeInfo);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and one items flightsInfo', (done) => {
            localStorageService.set('selectedTripInfo', '');
            localStorageService.remove('flightsInfo');
            localStorageService.set('flightsInfo', [{
                departure: {
                    code: 'MAD'
                },
                flight: {
                    operationalCarrier: {
                        name: 'Iberia'
                    }
                }
            }]);
            fakeDatalayerUtilsService.getItemCategory2 = jasmine.createSpy().and.returnValue({origin: 'testorigin'});
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeSegments = [{
                id: 'test',
                passengerIds: ['ADULT_01','ADULT_02']
            }];
            let fakeInfo = [{
                trips: [{
                    id: 'test',
                    checkedTrip: true,
                    amount: 50
                }]
            }];
            DatalayerUtils.setPriorityBoardingAddToCart(fakeSegments, fakeInfo);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setFlexibilizationSelectItem is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeFlex = {
                total: 50,
                description: 'test',
            };
            DatalayerUtils.setFlexibilizationSelectItem(fakeFlex);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setSpeqsSelectItem is called', () => {
        it('and call addDigitalDataEcommerceEvent and getSpeqsVariant subtype empty', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let copyfakePiece = {...fakePiece};
            DatalayerUtils.setSpeqsSelectItem(copyfakeTrip, copyfakePiece);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and call addDigitalDataEcommerceEvent and getSpeqsVariant subtype SKI_SNOW', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let copyfakePiece = {...fakePiece};

            copyfakePiece.subtype = 'SKI_SNOW';
            DatalayerUtils.setSpeqsSelectItem(copyfakeTrip, copyfakePiece);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and call addDigitalDataEcommerceEvent and getSpeqsVariant subtype BICYCLE', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let copyfakePiece = {...fakePiece};

            copyfakePiece.subtype = 'BICYCLE';
            DatalayerUtils.setSpeqsSelectItem(copyfakeTrip, copyfakePiece);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
        it('and call addDigitalDataEcommerceEvent and getSpeqsVariant subtype GOLF_EQUIPMENT', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let copyfakeTrip = {...fakeTrip};
            let copyfakePiece = {...fakePiece};

            copyfakePiece.subtype = 'GOLF_EQUIPMENT';
            DatalayerUtils.setSpeqsSelectItem(copyfakeTrip, copyfakePiece);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setFlexibilizationAddToCart  is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeSelectedFlex = {
                total: 50,
                description: 'test',
            };
            DatalayerUtils.setFlexibilizationAddToCart(fakeSelectedFlex);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When setSpeqsEventCart   is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            let fakeModel = {...fakeModelPassengers};
            DatalayerUtils.setSpeqsEventCart(fakeModel);
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When bobEcommerceEventSelected is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.bobEcommerceEventSelected({numBagsTotal: 2, priceTotal: 50});
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When bobEcommerceEventView is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.bobEcommerceEventView();
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });

    describe('When bobEcommerceEventAddToCard is called', () => {
        it('and call addDigitalDataEcommerceEvent', (done) => {
            spyOn(fakeDigitalDataService, 'addDigitalDataEcommerceEvent');
            DatalayerUtils.bobEcommerceEventAddToCard({numBagsTotal: 2, priceTotal: 50});
            expect(fakeDigitalDataService.addDigitalDataEcommerceEvent).toHaveBeenCalled();
            done();
        });
    });
});
