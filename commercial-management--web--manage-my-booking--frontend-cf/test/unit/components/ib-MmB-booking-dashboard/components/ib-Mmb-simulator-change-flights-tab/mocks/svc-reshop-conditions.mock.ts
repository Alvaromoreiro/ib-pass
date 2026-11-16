export const fakeReshopConditions = {
    "simulatedChanges": {
        "flowType": "SIMULATED_CHANGE",
        "enabled": true,
        "slices": [{
            'sliceId': 'MADFCO20210315090500',
            "enabled": true,
        },{
            'sliceId': 'FCOMAD20210322121500',
            "enabled": true,
        }],
        "reservationFailedConditions": [
            {
                "code": "REDEMPTION_RESERVE_AVIOS",
                "reason": "Lo sentimos: las reservas pagadas con Avios no permiten realizar ningún cambio online. Si necesitas más información, contacta con nuestro Centro de Atención al Cliente llamando al 901 11 15 00."
            }
        ],
        "warnings": []
    },
    "voluntaryChanges": {
        "flowType": "VOLUNTARY_CHANGE",
        "enabled": false,
        "slices": [],
        "reservationFailedConditions": [
            {
                "code": "REDEMPTION_RESERVE_AVIOS",
                "reason": "Lo sentimos: las reservas pagadas con Avios no permiten realizar ningún cambio online. Si necesitas más información, contacta con nuestro Centro de Atención al Cliente llamando al 901 11 15 00."
            }
        ],
        "warnings": []
    },
    "involuntaryChanges": {
        "flowType": "INVOLUNTARY",
        "enabled": false,
        "slices": [],
        "reservationFailedConditions": [],
        "warnings": []
    },
    "callcenterInfo": {
        "flowType": "CALL_CENTER",
        "enabled": true,
        "slices": [],
        "reservationFailedConditions": [],
        "warnings": []
    }
}
