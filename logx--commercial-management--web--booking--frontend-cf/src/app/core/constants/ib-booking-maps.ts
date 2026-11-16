import { BookingAppConstants } from './ib-booking-constants';

const AdaptativeMobileFlows = {
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.AVAILABILITY]: {
        'availability': true,
        'ibairp': true,
        'flightsRecap': true,
        'ibcmtv': true,
        'ibpurc': true
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.MULTITRIP]: {
        'availability': false,
        'ibairp': false,
        'ibcmtv': false,
        'ibpurc': false
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.METASEARCH]: {
        'availability': false,
        'ibairp': false,
        'ibcmtv': false,
        'ibpurc': false
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTION]: {
        'availability': false,
        'ibairp': false,
        'ibcmtv': false,
        'ibpurc': false
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.REDEMPTIONOB]: {
        'availability': false,
        'ibairp': false,
        'ibcmtv': false,
        'ibpurc': false
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.PAOPEN]: {
        'ibshuttle': false,
        'ibairp': false,
        'ibcmtv': false,
        'ibpurc': false
    },
    [BookingAppConstants.SEARCH_FLIGHT_TYPE.ONHOLD_CONF]: {
        'ohmtdt': true,
        'ibpurc': true
    }
};

export { AdaptativeMobileFlows };
