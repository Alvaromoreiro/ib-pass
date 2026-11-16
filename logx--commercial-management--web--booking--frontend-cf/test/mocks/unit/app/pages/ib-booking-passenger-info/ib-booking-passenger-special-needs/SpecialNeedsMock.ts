export const emptySpecialNeeds = {
    specialNeeds: {
        availableTypes: [
            'BLND',
            'DEAF',
            'DPNA',
            'SVAN',
            'WCHC',
            'WCHR',
            'WCHS'
        ],
        specialVision: false,
        specialHearing: false,
        specialGuideDog: false,
        specialIntellDisability: false,
        specialWheelchair: false,
        specialWheelchairValue: '',
        specialWheelchairInfo: [
            {
                code: 'WCHC',
                name: 'Silla de ruedas hasta la cabina',
                description: 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
            },
            {
                code: 'WCHR',
                name: 'Silla de ruedas para rampas',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
            },
            {
                code: 'WCHS',
                name: 'Silla de ruedas para escalones',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
            }
        ],
        isEnable: false
    }
};
export const filledSpecialNeeds = {
    specialNeeds: {
        availableTypes: [
            'BLND',
            'DEAF',
            'DPNA',
            'SVAN',
            'WCHC',
            'WCHR',
            'WCHS'
        ],
        specialVision: true,
        specialHearing: true,
        specialGuideDog: true,
        specialIntellDisability: true,
        specialWheelchair: true,
        specialWheelchairValue: '',
        specialWheelchairInfo: [
            {
                code: 'WCHC',
                name: 'Silla de ruedas hasta la cabina',
                description: 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
            },
            {
                code: 'WCHR',
                name: 'Silla de ruedas para rampas',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
            },
            {
                code: 'WCHS',
                name: 'Silla de ruedas para escalones',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
            }
        ],
        isEnable: true
    }
};
export const enableSpecialNeedsCheck = {
    specialNeeds: {
        availableTypes: [
            'BLND',
            'DEAF',
            'DPNA',
            'SVAN',
            'WCHC',
            'WCHR',
            'WCHS'
        ],
        specialVision: false,
        specialHearing: false,
        specialGuideDog: false,
        specialIntellDisability: false,
        specialWheelchair: false,
        specialWheelchairValue: '',
        specialWheelchairInfo: [
            {
                code: 'WCHC',
                name: 'Silla de ruedas hasta la cabina',
                description: 'No puedo caminar y necesito el servicio de asistencia hasta / desde el asiento del avión'
            },
            {
                code: 'WCHR',
                name: 'Silla de ruedas para rampas',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta de embarque. Puedo acceder al avión por escaleras y desplazarme dentro del mismo sin necesidad de asistencia.'
            },
            {
                code: 'WCHS',
                name: 'Silla de ruedas para escalones',
                description: 'Necesito la silla de ruedas para cubrir la distancia hasta / desde la puerta del avión. No puedo subir ni bajar escaleras, pero puedo desplazarme hasta mi asiento sin necesidad de asistencia.'
            }
        ],
        isEnable: true
    }
};
export const phoneList = {
    RESERVAS: {
        prefix: '',
        telephone: '900 111 500 (teléfono gratuito, disponible dentro de territorio español).  +34 913 33 67 01 (teléfono local sin tarificación adicional).',
        text: 'Reservas y Venta:',
        prefixAlt: '(+34) ',
        telephoneAlt: '915 23 65 68   prueba:915 23 65 68',
        textAlt: '',
        timeText: '24h de Lunes a Domingo.  prueba'
    }
};