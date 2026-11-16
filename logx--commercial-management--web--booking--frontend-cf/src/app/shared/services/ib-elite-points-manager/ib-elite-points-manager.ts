import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
@Injectable({ providedIn: 'root' })
export class IbElitePointsManager {
    constructor () { }
    public eliteQualificationMapper (fare, comercialNameES, flightRatio): number {

        const valuesElitePoints = {
            'Corto Radio': {
                Básica: 0,
                Óptima: 75,
                Confort: 125,
                Flexible: 150,
                'Business Óptima': 175,
                'Business Confort': 250,
                'Business Flexible': 275,
                'Puente Aéreo Confort': 150,
                'Puente Aéreo Flexible': 200,
                'Business Puente Aéreo': 300,
                'Business Puente Aéreo Flexible': 300,
                'Confort Baleares': 125,
                'Flexible Baleares': 150,
                'Business Confort Baleares': 250,
                'Business Flexible Baleares': 275,
                'Confort Canarias': 125,
                'Flexible Canarias': 150,
                'Business Confort Canarias': 250,
                'Business Flexible Canarias': 275
            },
            'Medio Radio': {
                Básica: 0,
                Óptima: 75,
                Confort: 125,
                Flexible: 150,
                'Business Óptima': 175,
                'Business Confort': 250,
                'Business Flexible': 275
            },
            'Largo Radio': {
                Básica: 0,
                'Óptima Flex': 150,
                Óptima: 150,
                Confort: 225,
                Flexible: 250,
                'Turista Premium Óptima': 275,
                'Turista Premium Confort': 300,
                'Turista Premium Flexible': 325,
                'Business Óptima': 350,
                'Business Confort': 450,
                'Business Flexible': 500
            }
        };

        if (!fare) return 0;

        const selectedFlightRatio = flightRatio;

        const validFlightRatio = valuesElitePoints[flightRatio]
            ? selectedFlightRatio
            : 'Corto Radio';

        const validComercialName = comercialNameES || 'Básica';

        if (!(validComercialName in valuesElitePoints[validFlightRatio])) {
            return fare;
        }

        return Math.round(
            fare + valuesElitePoints[validFlightRatio][validComercialName]
        );

    }


}
downgradeToAJSService('IbElitePointsManager', IbElitePointsManager, 'ib-booking-services-module');