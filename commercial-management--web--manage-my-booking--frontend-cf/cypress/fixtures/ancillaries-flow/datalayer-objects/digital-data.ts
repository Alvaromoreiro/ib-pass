
export const searchDigitalData = {
    "Language": "es",
    "Market": "ES",
    "VersionWeb": "angularjs",
    "ModeWeb": "tablet",
    "Quadrigam": "CHKTRP",
    "TrackingCode": "es/ES/CHKTRP",
    "UserStatus": "no_logado"
}

export const dashboardDigitalData = Object.assign(
    JSON.parse(JSON.stringify(searchDigitalData)), {
        "Quadrigam": "IBMMBR",
        "TrackingCode": "es/ES/IBMMBR",
        "Dynamic_pricing_seat": "NO",
        "ChangeType": "voluntario",
        "FlightStatus": "HK",
        "OriginalAdvancePurchase": 47,
        "OriginalDate": "22/04/2024-28/04/2024",
        "OriginalLengthStay": 6,
        "PNRType": "no_flexibilizado",
        "PurchaseDate": "06/03/2024",
        "Slice1OriginalDate": "22/04/2024",
        "Slice2OriginalDate": "28/04/2024",
        "SpecialMeal": "SI",
        "FlightType": "RT",
        "Currency": "EUR",
        "Reference": "KZ8F6",
        "BookingClass": "E",
        "AirportSeg": "MAD-BIO",
        "PaxTotal": 3,
        "PaxAdult": 3,
        "PaxChild": 0,
        "PaxInfant": 0,
        "PaxSenior": 0,
        "PaxYoung": 0,
        "TotalTaxes": "463.38",
        "TotalPriceWithoutTaxes": "369.00",
        // "CashAviosOffer": "NO",
        // "VoucherShown": "SI",
        // "TotalPrice": 13,
        // "Quantity": "0",
        // "pmr": "NO",
        // "PaymentMethod": "VI",
        // "OrderId": "Qm9va2luZ0BJQmVkZmQ5N2Y1NmE3ZTQwODk4ZTg2MGFkYzhhZjAwODZhT1A=",
        // "AviosEarned": 65
});


export const ancillariesPageData = Object.assign(
    JSON.parse(JSON.stringify(dashboardDigitalData)), {
        "Quadrigam": "MOANCI",
        "TrackingCode": "es/ES/MOANCI",
        "Process": "ancillaries",
        "Step": "inicio"
});

export const paymentsDigitalData = Object.assign(
    JSON.parse(JSON.stringify(dashboardDigitalData)), {
        "Quadrigam": "MOPURC",
        "TrackingCode": "es/ES/MOPURC",
        "Process": "ancillaries",
        "Step": "pago",
        "TotalPriceWithoutTaxes": 13,
});


export const confirmationDigitalData =  Object.assign(
    JSON.parse(JSON.stringify( searchDigitalData)), {
        "Quadrigam": "MOBKCF",
        "TrackingCode": "es/ES/MOBKCF",
        "Process": "ancillaries",
        "Step": "confirmacion",
});
