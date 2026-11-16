/**
 * Mocks for testing the MmBManageFlightsInfoController
 * Specifically designed for the getFlightIcon function
 */

export class ManageFlightsInfoControllerMock {
    /**
     * Standard airplane flight mock - Outbound flight
     */
    static get mockAirplaneFlightOutbound() {
        return {
            departureCity: {
                code: "MAD",
                city: {
                    description: "Madrid"
                }
            },
            arrivalCity: {
                code: "LHR",
                city: {
                    description: "Londres"
                }
            },
            segments: [{
                flight: {
                    aircraft: {
                        code: "320",
                        description: "Airbus A320"
                    }
                }
            }]
        };
    };

    /**
     * Mock airplane flight - Return flight
     */
    static get mockAirplaneFlightReturn() {
        return {
            departureCity: {
                code: "LHR",
                city: {
                    description: "Londres"
                }
            },
            arrivalCity: {
                code: "MAD",
                city: {
                    description: "Madrid"
                }
            },
            segments: [{
                flight: {
                    aircraft: {
                        code: "320",
                        description: "Airbus A320"
                    }
                }
            }]
        };
    };

    /**
     * Mock train flight
     */
    static get mockTrainFlight() {
        return {
            departureCity: {
                code: "MAD",
                city: {
                    description: "Madrid"
                }
            },
            arrivalCity: {
                code: "BCN",
                city: {
                    description: "Barcelona"
                }
            },
            segments: [{
                flight: {
                    aircraft: {
                        code: "TRN",
                        description: "Train"
                    }
                }
            }]
        };
    }
}