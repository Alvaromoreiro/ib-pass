import { CommonsHttpServicesConstants, CommonsConstants } from 'ib-web-commons/constants';

export function getSalesforceUrl () {
    if (CommonsHttpServicesConstants.production) {
        return CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRO;
    }
    const host = window.location.host;

    const mapUrl = {
        [CommonsConstants.ENV_DOMAIN.INT_AWS]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.INT_AWS,
        [CommonsConstants.ENV_DOMAIN.PRE_AWS]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRE_AWS,
        [CommonsConstants.ENV_DOMAIN.PRO_AWS]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRO,
        [CommonsConstants.ENV_DOMAIN.PREE]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREE,
        [CommonsConstants.ENV_DOMAIN.PREF]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREF,
        [CommonsConstants.ENV_DOMAIN.PREB]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREB,
        [CommonsConstants.ENV_DOMAIN.PREC]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREB,
        [CommonsConstants.ENV_DOMAIN.PREW]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREB,
        [CommonsConstants.ENV_DOMAIN.PRED]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRED,
        [CommonsConstants.ENV_DOMAIN.PRO]: CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PRO
    };
    return mapUrl[host] || CommonsHttpServicesConstants.SALESFORCE_ENVIRONMENTS.PREE;
}

export function getSFClientId () {
    if (CommonsHttpServicesConstants.production) {
        return CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRO;
    }

    const host = window.location.host;

    const mapUrl = {
        [CommonsConstants.ENV_DOMAIN.INT_AWS]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_INT_AWS,
        [CommonsConstants.ENV_DOMAIN.PRE_AWS]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE_AWS,
        [CommonsConstants.ENV_DOMAIN.PRO_AWS]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRO,
        [CommonsConstants.ENV_DOMAIN.PREE]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE,
        [CommonsConstants.ENV_DOMAIN.PREF]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE,
        [CommonsConstants.ENV_DOMAIN.PREB]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE_B,
        [CommonsConstants.ENV_DOMAIN.PREC]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE_B,
        [CommonsConstants.ENV_DOMAIN.PRED]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE_B,
        [CommonsConstants.ENV_DOMAIN.PRO]: CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRO
    };
    return mapUrl[host] || CommonsHttpServicesConstants.SALESFORCE_TOKEN.client_id_PRE;
}