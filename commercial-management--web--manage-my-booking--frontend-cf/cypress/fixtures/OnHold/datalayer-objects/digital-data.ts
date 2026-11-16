

export const dashboardDigitalData = {
    "Language": "es",
    "Market": "ES",
    "VersionWeb": "angularjs",
    "ModeWeb": "tablet",
    "Quadrigam": "OHMTDT",
    "TrackingCode": "es/ES/OHMTDT",
    "UserStatus": "no_logado",
    "ChangeType": "involuntario",
    "FlightStatus": "ON_HOLD_CONFIRMABLE",
    "FlightHaul": "Corto Radio",
    "OriginalDate": "17/02/2025-20/02/2025",
    "SpecialMeal": "NO",
    "FlightType": "RT",
    "Currency": "EUR",
    "Reference": "L5L0T",
    "AirportSeg": "MAD-BCN",
    "PaxTotal": 1,
    "PaxAdult": 1,
    "PaxChild": 0,
    "PaxInfant": 0,
    "PaxSenior": 0,
    "PaxYoung": 0,
    "Process": "confirmacion onhold",
    "ProcessStart": "es/ES/CHKTRP",
    "Step": "recuperacion",
    "Slice1OriginalDate": "17/02/2025",
    "Slice1Flights": "IB0413",
    "Slice1Operator": "IB",
    "Slice1Cabin": "ECONOMY",
    "Slice1FareFamily": "Básica",
    "Slice1Routing": "MAD-BCN",
    "Slice2OriginalDate": "20/02/2025",
    "Slice2Flights": "IB0428",
    "Slice2Operator": "IB",
    "Slice2Cabin": "ECONOMY",
    "Slice2FareFamily": "Turista Puente Aéreo",
    "Slice2Routing": "BCN-MAD",
    "OrderId": "Qm9va2luZ0BJQmFiMzRiNGYzMDI4YjQzM2Q5NzhiZjI0MjgzNTc5YTc1T1A="
}

export const paymentsDigitalData =  Object.assign(
        JSON.parse(JSON.stringify( dashboardDigitalData)), {
        "Quadrigam": "OHINFO",
        "TrackingCode": "es/ES/OHINFO",
        "Process": "confirmacion onhold",
        "Step": "pago",
        "TotalPrice": 223.27,
        "TotalPriceWithoutTaxes": 223.27,
        "Quantity": "0",
        "pmr": "NO"
    });



    export const confirmationDigitalData =  Object.assign(
        JSON.parse(JSON.stringify( paymentsDigitalData)), {
            "TrackingCode": "es/ES/RTBKCF",
            "Quadrigam": "RTBKCF",
            "Process": "confirmacion onhold",
            "Step": "confirmacion",
            "PaymentMethod": "VI",
            "CashAviosUsed": "no",
            "VoucherUsed": "no"
    });
