describe('AvailabilityTransformerFilter test', () => {

    let AvailabilityTransformerFilter;

    let fakeData1 = {
        filter: {
            cabin: {
                name: 'test'
            },
            scale: [
                {
                    numScale: [
                        {

                        }
                    ],
                    segments: [
                        {

                        }
                    ],
                    remove: true
                }
            ],
            company: 'test',
            rangeHoursArrival: {
                active: true,
                min: 15,
                max: 17
            },
            rangeHoursDeparture: {
                active: true,
                min: 15,
                max: 17
            },
            rangePrice: {
                active: true,
                min: 15,
                max: 19
            }
        }
    };

    let fakeCopy1 = [
        {
            cabins: [
                {
                    title: 'test',
                    disabled: true,
                    priceNumber: 18
                }
            ],
            segments: [
                {

                }
            ],
            remove: true,
            info: {
                arrivalTime: '18:00'
            }
        }
    ];

    let fakeData2 = {
        filter: {
            cabin: {
                name: 'test'
            },
            scale: [
                {
                    numScale: [0],
                    segments: [
                        {
                            test: 'test'
                        }
                    ],
                    remove: false
                }
            ],
            company: 'test',
            rangeHoursArrival: {
                active: true,
                min: 15,
                max: 17
            },
            rangeHoursDeparture: {
                active: true,
                min: 15,
                max: 17
            },
            rangePrice: {
                active: true,
                min: 15,
                max: 19
            }
        }
    };

    let fakeCopy2 = [
        {
            cabins: [
                {
                    title: 'test',
                    disabled: false,
                    priceNumber: 18
                }
            ],
            segments: [
                {

                }
            ],
            remove: false,
            info: {
                departureTime: '12:00',
                arrivalTime: '18:00'
            }
        },
        {
            cabins: [
                {
                    title: 'test',
                    disabled: false,
                    priceNumber: 18
                }
            ],
            segments: [
                {

                }
            ],
            remove: false,
            info: {
                departureTime: '12:00',
                arrivalTime: '18:00'
            }
        },
        {
            cabins: [
                {
                    title: 'test',
                    disabled: false,
                    priceNumber: 18
                }
            ],
            segments: [
                {

                }
            ],
            remove: false,
            info: {
                departureTime: '12:00',
                arrivalTime: '18:00'
            }
        }
    ];

    beforeEach(() => {
        angular.mock.module('ib-MmB-booking-availability-module', () => {});
        inject((_AvailabilityTransformerFilter_) => {
            AvailabilityTransformerFilter = _AvailabilityTransformerFilter_;
        });
    });

    describe('when applyFilter()', () => {

        it('With params data and copy', () => {
            let fakeData = angular.copy(fakeData1);
            let fakeCopy = angular.copy(fakeCopy1);
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
        it('With params data and copy2', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
        it('With params data and copy 3', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
        it('With params data and copy 4', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
        it('With params data and copy 5', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            fakeData.filter.rangeHoursArrival = null;
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
        it('With params data and copy 6', () => {
            let fakeData = angular.copy(fakeData2);
            let fakeCopy = angular.copy(fakeCopy2);
            fakeData.filter.cabin = null;
            fakeData.filter.scale = [];
            fakeData.filter.company = null;
            fakeData.filter.rangeHoursArrival = null;
            fakeData.filter.rangeHoursDeparture = null;
            AvailabilityTransformerFilter.applyFilter(fakeData, fakeCopy);
        });
    });
});
