export const fakeCheckinAppConstants = {
    INHIBIT_BOARDING_CARD_TYPES: {
        SEE_AGENT_REASON: 'SEE_AGENT_REASON',
        AIRCHECK_REASON: 'AIRCHECK_REASON',
        BOKO_AIRCHECK_REASON: 'BOKO_AIRCHECK_REASON',
        INHIBIT_REASON: 'INHIBIT_REASON',
        UMNR_REASON: 'UMNR_REASON',
        RESI_REASON: 'RESI_REASON',
        AVIH_REASON: 'AVIH_REASON',
        PETC_REASON: 'PETC_REASON',
        COUR_REASON: 'COUR_REASON'
    },
    ITEMS_TYPES: {
        SVAN: 'SVAN',
        RESI: 'RESI',
        UMNR: 'UMNR',
        AVIH: 'AVIH',
        PETC: 'PETC',
        COUR: 'COUR',
        SEE_AGENT: 'SEE_AGENT'
    },
    INHIBIT_ALERTS: {
        SEE_AGENT: {
            IBCOAC: {
                TITLE: 'SEE_AGENT_BANNER_TITLE',
                MESSAGE: 'SEE_AGENT_PASSENGER_MESSAGE',
                ICON: 'icon-resident-discount'
            },
            IBECBP: {
                TITLE: 'SEE_AGENT_BANNER_TITLE',
                SUBTITLE_OK: 'SEE_AGENT_BANNER_SUBTITLE_NOT_HOMOGENEOUS', // Only ES
                SUBTITLE_KO: 'SEE_AGENT_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-resident-discount'
            }
        },
        RESI: {
            IBCOAC: {
                TITLE: 'RESI_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'RESI_PASSENGER_MESSAGE',
                ICON: 'icon-resident-discount'
            },
            IBECBP: {
                TITLE: 'RESI_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'RESI_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'RESI_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-resident-discount'
            }
        },
        AVIH: {
            IBCOAC: {
                TITLE: 'AVIH_PASSENGER_MESSAGE_TITLE',
                MESSAGE: 'AVIH_PASSENGER_MESSAGE',
                ICON: 'icon-mascotas_domesticas'
            },
            IBECBP: {
                TITLE: 'AVIH_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'AVIH_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'AVIH_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-mascotas_domesticas'
            }
        },
        PETC: {
            IBCOAC: {
                TITLE: 'PETC_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'PETC_PASSENGER_MESSAGE',
                ICON: 'icon-mascotas_domesticas'
            },
            IBECBP: {
                TITLE: 'PETC_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'PETC_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'PETC_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-mascotas_domesticas'
            }
        },
        UMNR: {
            IBCOAC: {
                TITLE: 'UMNR_CONFIRMATION_BANNER_TITLE',
                MESSAGE: 'UMNR_PASSENGER_MESSAGE',
                ICON: 'icon-iberia_ninos'
            },
            IBECBP: {
                TITLE: 'UMNR_CONFIRMATION_BANNER_TITLE',
                SUBTITLE_OK: 'UMNR_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'UMNR_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-iberia_ninos'
            }
        },
        COUR: {
            IBCOAC: {
                TITLE: 'COUR_PASSENGER_TITLE',
                MESSAGE: 'COUR_PASSENGER_MESSAGE',
                ICON: 'icon-etiqueta-en-maleta'
            },
            IBECBP: {
                TITLE: 'COUR_BANNER_TITLE',
                SUBTITLE_OK: 'COUR_BANNER_SUBTITLE_NOT_HOMOGENEOUS',
                SUBTITLE_KO: 'COUR_BANNER_SUBTITLE_HOMOGENEOUS',
                ICON: 'icon-etiqueta-en-maleta'
            }
        }
    }
};

export const fakeCommonsUserUtilsService = {
    isSoftUser: jasmine.createSpy('isSoftUser')
};

export const fakeCheckinFlowService = {
    showPriorityAlertInhibit: jasmine.createSpy('showPriorityAlertInhibit'),
    updateApiEsta: jasmine.createSpy('updateApiEsta')
};

export const fakeIbUtilsService = {
    getAppLang: jasmine.createSpy('getAppLang').and.returnValue('es')
};

const filterOptions = {
    NewLinkFilter: (literal,lang) => `${literal}-${lang}`,
    translate: (literal) => literal,
    literalFormatter: (literal, tagsInfo) => `<${tagsInfo.link.tag}>${literal}</${tagsInfo.link.tag}>`
};

export const fakeFilter = (filter) => {
    return filterOptions[filter] ?? (() => {});
};

export const getMockPassengerInfo = (id) => ({
    id,
    inhibitBoardingCard: {
        status: true,
        reason: ['SEE_AGENT']
    },
    frequentFlyer: {
        info: {
            number: "8438798"
        }
    },
    pasStatus: {
        hasSBY: false
    }
});

export const frequentFlyer = [
    undefined,
    {
        info: {
            iataCompanyCode: "",
            number: "",
            topTier: ""
        }
    },
    {
        info: {
            iataCompanyCode: "IB",
            number: "8438798",
            topTier: "EMERALD - Infinita"
        }
    }
];