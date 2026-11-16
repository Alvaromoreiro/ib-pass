import { ibCCalculatePointsService } from 'ib-web-commons/app/core/http-services/prlm-pc/ib-calculate-points-service';
@Service(
    'ib-MmB-services-module',
    [
        'CommonsGenericProxy',
        'MmBAppConstants',
        'CommonsNewHttpUtilsErrorService',
        'ibCCalculatePointsService',
        'localStorageService',
        '$rootScope'
    ],
    []
)
export class SimulatorFareReshopService {
    constructor(
        private CommonsGenericProxy: CommonsGenericProxy,
        private MmBAppConstants: MmBAppConstants,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private ibCCalculatePointsService: ibCCalculatePointsService,
        private localStorageService: angular.local.storage.ILocalStorageService,
        private $rootScope: CommonsRootScope
    ) { }

    getFareReshop = (request) => {
        return new Promise((resolve, reject) => {
            const getFareReshopSuccess = (data) => {
                const flightAviosInfo = this.localStorageService.get('flightAviosInfo');
                if (flightAviosInfo) {
                    this.getAviosForChangeFlight(flightAviosInfo, data.data?.compensationInfo?.fareChanges[0].totalCost, data);
                }
                resolve(data.data);
            };
            const getFareReshopError = (error) => {
                this.CommonsNewHttpUtilsErrorService.controlError(error, reject);
            };
            this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.simulatorFareReshopURI, request).then(
                getFareReshopSuccess,
                getFareReshopError
            );
        });
    };

    private getAviosForChangeFlight(flightaviosinfo, totalCost, reshopFare) {
        const changeFare = (flightAviosInfo, totalCost) => {
            return {
                ...flightAviosInfo,
                flight: {
                    yq: 0,
                    discounts: [],
                    slices: reshopFare.data.offers[0].slices.map((slice, index) => {
                        return {
                            id: slice.sliceId,
                            segments: slice.segments.map((segment) => {
                                return {
                                    id: segment.id,
                                    fareProduct: reshopFare.data.fareFamilyConditions[index]?.commercialNameES || reshopFare.data.fareFamilyConditions[0]?.commercialNameES,
                                    bookingCabin: { code: segment.cabin.bookingClass },
                                    bookingClass: { code: segment.cabin.rbd },
                                    commercialCode: this.MmBAppConstants.AVAILABLE_COMMERCIAL_CODES.includes(segment.cabin?.fareFamily) ? segment.cabin?.fareFamily : null,
                                    marketingCarrier: { code: segment.flight.marketingCarrier.code },
                                    operatingCarrier: { code: segment.flight.operationalCarrier.code },
                                    schedule: {
                                        arrivalAirportCode: segment.arrival.code,
                                        departureAirportCode: segment.departure.code,
                                        departureDate: segment.departureDateTime.split(' ')[0]
                                    }
                                }
                            })
                        }
                    })
                },
                passengers: reshopFare.data.passengers.map((passenger) => {
                    return {
                        id: passenger.passengerId,
                        memberIdentifier: flightAviosInfo?.passengers?.find( flightAviosInfoPassenger => flightAviosInfoPassenger.id === passenger.passengerId)?.memberIdentifier,
                        ancillaries: [],
                        bookingSummary: null,
                        flight: {
                            slices: reshopFare.data.offers[0].slices.map((slice) => {
                                return {
                                    id: slice.sliceId,
                                    fare: totalCost ? totalCost / reshopFare.data.offers[0].slices.length : reshopFare.data.offers[0].slices.length,
                                    totalFare: totalCost ? totalCost / reshopFare.data.offers[0].slices.length : reshopFare.data.offers[0].slices.length
                                };
                            })
                        }
                    };
                })
            };
        };

        const changeFlight = changeFare(flightaviosinfo, totalCost);

        this.ibCCalculatePointsService
            .getCalculateAviosSummary(changeFlight)
            .then((resp: any) => {
                this.localStorageService.set('flightAviosInfo', changeFlight);
                this.localStorageService.set('changeFlightAvios', {
                    avios: resp.totalMonetaryAmount?.find((item) => item.currency.code === 'AVIOS')?.amount || 0,
                    elite: resp.totalMonetaryAmount?.find((item) => item.currency.code === 'TIER_POINTS')?.amount || 0
                });
                this.$rootScope.$broadcast('changeFlight');
            });
    }
}
