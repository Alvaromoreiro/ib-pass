import angular from 'angular';

describe('MmBDeinvoicingUtilsService Test', () => {
    let MmBDeinvoicingUtils, localStorageService;
    let fakeChangeFlightsCV = [{
        originalSliceId: 'MADBIO20230615114500'
    }];
    let fakeFlightsInfo = [{
        sliceId: 'MADBIO20230615114500',
        flight: {
            operationalCarrier: {
                code: 'test'
            },
            operationalFlightNumber: 'test',
    },
        arrivalCity: {
            terminal: 'test'
        },
        departureCity: {
            terminal: 'test'
        },
        departureDateParsed: {
            dateTime: 'test',
            day: '20',
            month: '02',
            year: '2026'
        },
        arrivalDateParsed: {
            dateTime: 'test',
            day: '23',
            month: '03',
            year: '2027'
        }
    }];

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', () => {
            // $provide.value('IbCAuthTokenService', fakeMmBTokenService);
        });
        inject((_MmBDeinvoicingUtils_,_localStorageService_) => {
            MmBDeinvoicingUtils = _MmBDeinvoicingUtils_;
            localStorageService = _localStorageService_;
        });
    });
    describe('when call checkSpecificWarningCheckOut (voluntary) with SLICE_WITH_CHECKED_SEGMENT', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'SLICE_WITH_CHECKED_SEGMENT',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'}
                        ]}, {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: [{code: 'SLICE_WITH_CHECKED_SEGMENT'}]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it(' and checkGeneralWarningCheckOut (voluntary) return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });
    describe('when call checkSpecificWarningCheckOut (involuntary) with SLICE_WITH_CHECKED_SEGMENT', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'SLICE_WITH_CHECKED_SEGMENT',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: [{code: 'SLICE_WITH_CHECKED_SEGMENT'}]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it(' and checkGeneralWarningCheckOut (involuntary) return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });

    describe('when call checkSpecificWarningCheckOut (voluntary) with ORDER_WITH_EARLY_CHECKING_DONE', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []
                    }, {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: [{code: 'ORDER_WITH_EARLY_CHECKING_DONE'}]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it(' and checkGeneralWarningCheckOut (voluntary) return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });
    describe('when call checkSpecificWarningCheckOut (involuntary) with ORDER_WITH_EARLY_CHECKING_DONE', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: [{code: 'ORDER_WITH_EARLY_CHECKING_DONE'}]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it(' and checkGeneralWarningCheckOut (involuntary) return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });

    describe('when call checkSpecificWarningCheckOut', () => {
        beforeEach(inject(() => {
            localStorageService.set('reshopConditions', null);
        }));
        it('and reshopConditions undefined return false', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(false);
        });
    });

    describe('when call getDataModalDeinvoicing', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'SLICE_WITH_CHECKED_SEGMENT',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'}
                        ]}, {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: [{code: 'SLICE_WITH_CHECKED_SEGMENT'}]
                }
            };
            localStorageService.set('changeFlightsCV', fakeChangeFlightsCV);
            localStorageService.set('flightsInfo', fakeFlightsInfo);
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('getDataModalDeinvoicing should return fakeResponse array', () => {
            const fakeResponse = [{
                'sliceID': 'MADBIO20230615114500',
                'operatedBy': 'test',
                'flightNumber': 'test',
                'arrivalTerminal': 'test',
                'departureTerminal': 'test',
                'departureDateTime': 'test',
                'departureDateDay': '20',
                'departureDateMonth': '02',
                'departureDateYear': '2026',
                'arrivalDateTime': 'test',
                'arrivalDateDay': '23',
                'arrivalDateMonth': '03',
                'arrivalDateYear': '2027'
            }]
            let result = MmBDeinvoicingUtils.getDataModalDeinvoicing();
            expect(result).toEqual(fakeResponse);
        });
    });

    
    describe('when call checkSpecificWarningCheckOut (voluntary) and ', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []
                },
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{code: 'SLICE_WITH_CHECKED_SEGMENT'}]}, 
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []}
                    ],
                    warnings: []
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('Should checkWarningCheckOutBySliceId return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });

    describe('when call checkSpecificWarningCheckOut (involuntary) and ', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{code: 'ORDER_WITH_EARLY_CHECKING_DONE'}]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('checkWarningCheckOutBySliceId return true', () => {
            let result = MmBDeinvoicingUtils.checkSpecificWarningCheckOut('MADBIO20230615114500');
            expect(result).toBe(true);
        });
    });
   
    describe('when checkWarningCheckOut (voluntary)', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                            enabled: true,
                            failedConditions: [],
                            sliceId: 'MADBIO20230615114500',
                            warnings: []
                        },
                        {
                            enabled: true,
                            failedConditions: [],
                            sliceId: 'BIOMAD20230727174500',
                            warnings: []
                        }
                    ],
                    warnings: [{
                        code: 'SLICE_WITH_CHECKED_SEGMENT',
                        description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                    }]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('checkGeneralWarningCheckOut return true', () => {
            let result = MmBDeinvoicingUtils.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when checkWarningCheckOut (involuntary)', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: []
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: [{
                        code: 'SLICE_WITH_CHECKED_SEGMENT',
                        description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                    }]
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('checkWarningCheckOut and checkGeneralWarningCheckOut return true', () => {
            let result = MmBDeinvoicingUtils.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });

    describe('when checkWarningCheckOut', () => {
        beforeEach(inject(() => {
            localStorageService.set('reshopConditions', null);
        }));
        it('and reshopConditions undefined return false', () => {
            let result = MmBDeinvoicingUtils.checkWarningCheckOut();
            expect(result).toBe(false);
        });
    });
    
    describe('when checkWarningCheckOut (voluntary) ', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                involuntaryChanges: {
                    enabled: false,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                voluntaryChanges: {
                    enabled: true,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('and checkWarningCheckOutBySlice return true', () => {
            let result = MmBDeinvoicingUtils.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
    describe('when ecki booking have one checkin flight (involuntary)', () => {
        beforeEach(inject(() => {
            const fakeReshopConditions = {
                voluntaryChanges: {
                    enabled: false,
                    flowType: 'VOLUNTARY_CHANGE',
                    reservationFailedConditions: [],
                    slices: [],
                    warnings: []},
                involuntaryChanges: {
                    enabled: true,
                    flowType: 'INVOLUNTARY',
                    reservationFailedConditions: [],
                    slices: [{
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'MADBIO20230615114500',
                        warnings: [{
                            code: 'ORDER_WITH_EARLY_CHECKING_DONE',
                            description: 'Importante: si cambias este vuelo, deberás realizar el Check-in del nuevo.'
                        }]
                    },
                    {
                        enabled: true,
                        failedConditions: [],
                        sliceId: 'BIOMAD20230727174500',
                        warnings: []
                    }
                    ],
                    warnings: []
                }
            };
            localStorageService.set('reshopConditions', fakeReshopConditions);
        }));
        it('checkWarningCheckOut should return true', () => {
            let result = MmBDeinvoicingUtils.checkWarningCheckOut();
            expect(result).toBe(true);
        });
    });
});
