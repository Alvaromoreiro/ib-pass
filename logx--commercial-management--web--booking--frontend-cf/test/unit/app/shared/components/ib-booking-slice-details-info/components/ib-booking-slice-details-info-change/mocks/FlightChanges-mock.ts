export const trueAirportChange: AvailabilityTransformerModel.AirportInfoWarningMessage = {
        isImportant: true,
        code: "SSE_AVM_20001",
        message: "Cambio de aeropuerto: Llegada a London Heathrow (LHR) - Salida de London Gatwick (LGW)",
        show: true,
        arrival: "London Heathrow (LHR)",
        departure: "London Gatwick (LGW)"
}

export const trueTerminalChange: AvailabilityTransformerModel.TerminalInfoWarningMessage = {
    isImportant: true,
    code: "SSE_AVM_20002",
    message: "Cambio de terminal: Llegada B Boston (BOS) - Salida E Boston (BOS)",
    show: true,
    arrival: "B",
    departure: "E",
    hasTerminal: "true"
}
