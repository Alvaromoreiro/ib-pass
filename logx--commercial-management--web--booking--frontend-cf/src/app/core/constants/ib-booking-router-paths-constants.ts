export const RouterPathsConstants = {

    availability: 'availability',
    ibbkerror: 'ibbkerror',
    ibrednm: 'ibrednm',
    caldit: 'caldit',
    ibpbah: 'ibpbah',
    ibairp: 'ibairp',
    ibcmtv: 'ibcmtv',
    ibpurc: 'ibpurc',
    confirmation: 'confirmation',
    ibshuttle: 'ibshuttle',
    ibAviosAlert: 'ibAviosAlert',
    OBERRA: 'OBERRA',
    loading: 'loading',
    ibbker: 'ibbker',
    flightsRecap: 'flightsRecap',
    ohmtdt: 'ohmtdt',
    cnclit: 'cnclit',
    errpetc: 'errpetc'
};
export type AllowedPaths = typeof RouterPathsConstants[ keyof typeof RouterPathsConstants ];
export type RedirectionPath<T extends AllowedPaths = AllowedPaths> = `/${ T }`;
export const getRedirectionPath = <T extends AllowedPaths>( path: T ): RedirectionPath<T> => `/${ path }`;
export type AvailabilityErrorPagePath = RedirectionPath<
    typeof RouterPathsConstants.errpetc | typeof RouterPathsConstants.ibbkerror
>;
export type AllowedPathsStep = keyof typeof RouterPathsConstants;
export type StepPathsAllowed = {
    step: AllowedPathsStep;
    active: boolean;
};