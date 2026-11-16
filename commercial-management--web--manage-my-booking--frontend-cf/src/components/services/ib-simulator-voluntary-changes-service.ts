import angular from "angular";

@Service(
    "ib-MmB-services-module",
    [
        "localStorageService",
        "MmBModalService",
        "MmBAppConstants",
        "CommonsNewHttpUtilsErrorService",
        "CommonsGenericProxy",
    ],
    []
)
export class SimulatorVoluntaryChangesService {
    requestAvailability: any = {};
    updateAvailability: any;

    constructor(
        private localStorageService: angular.local.storage.ILocalStorageService,
        private MmBModalService: any,
        private MmBAppConstants: any,
        private CommonsNewHttpUtilsErrorService: CommonsNewHttpUtilsErrorService,
        private CommonsGenericProxy: CommonsGenericProxy
    ) {}

    getAvailability = (data: any, update: any) => {
        return new Promise((resolve, reject) => {
            this.requestAvailability = data || this.requestAvailability;
            this.updateAvailability = update;

            if (!update) {
                this.MmBModalService.showWaitingModal();
            }

            const getAvailabilitySuccess = (data: any) => {
                const dataStorage = angular.copy(data.data);

                if (data.data && data.data.fareFamilyConditions.length !== 0) {
                    if (
                        dataStorage.offers &&
                        dataStorage.offers.length > 1000
                    ) {
                        dataStorage.offers = dataStorage.offers.slice(0, 1000);
                    }
                    const vcAvailability = {
                        responseId: dataStorage.responseId,
                        contextMetadata: dataStorage.contextMetadata,
                        originDestinations: dataStorage.originDestinations,
                    };
                    this.localStorageService.set(
                        "vcAvailability",
                        vcAvailability
                    );
                    resolve(data.data);
                    //this.deferred = null;
                } else {
                    getAvailabilityError({
                        data: {
                            errors: [
                                {
                                    code: "noFares",
                                },
                            ],
                        },
                    });
                }
            };

            const getAvailabilityError = (error: any) => {
                this.CommonsNewHttpUtilsErrorService.controlError(
                    error,
                    reject
                );

                this.MmBModalService.finishWaiting();
            };

            this.CommonsGenericProxy.postGeneric(
                this.MmBAppConstants.simulatorReshopAvailabilityURI,
                this.requestAvailability
            ).then(getAvailabilitySuccess, getAvailabilityError);
        });
    };

    /**
     * Generate all information and model to launch search of availability flights for voluntary change
     * @param data is all information about slice and segments of booking.
     * @param slicesId is a array with slicesId of all slices of flights.
     * @param numberFlights indicate the number slices have the flight.
     * @returns Type of Model flight to search availability.
     *  */
    getModelFlighVC(data, slicesId, numberFlights) {
        var i,
            modeFlight = null,
            keys = [],
            slices = [];
        for (i in data.flights) {
            slices.push(data.flights[i]);
            keys.push(i);
        }
        if (!data.flights[keys[0]].changeNewDate) {
            data.flights[keys[0]].changeNewDate = new Date(
                data.flights[keys[0]].departureDateParsed.originalDate
            );
            data.flights[slicesId[0]].parseNewDate = transformerDate(
                data.flights[slicesId[0]].changeNewDate
            );
        }
        if (slices[0].checked) {
            modeFlight = "outbound";
        }
        if (numberFlights > 1) {
            if (!data.flights[keys[1]].changeNewDate) {
                data.flights[keys[1]].changeNewDate = new Date(
                    data.flights[keys[1]].departureDateParsed.originalDate
                );
                data.flights[slicesId[1]].parseNewDate = transformerDate(
                    data.flights[slicesId[1]].changeNewDate
                );
            }
            if (slices[0].checked && slices[1].checked) {
                modeFlight = "twice";
            } else if (!slices[0].checked && slices[1].checked) {
                modeFlight = "return";
            }
        }
        return modeFlight;

        function transformerDate(date) {
            var parseDate = {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                weekDay: date.getDay(),
            };
            return parseDate;
        }
    }
}
