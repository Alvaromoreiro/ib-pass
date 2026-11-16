import { RouterPathsConstants, AllowedPathsStep } from '../constants/ib-booking-router-paths-constants';
export const AllowedPopStateTransitions : Partial<Record<AllowedPathsStep, Set<AllowedPathsStep>>> = {
    [RouterPathsConstants.ibairp]: new Set([RouterPathsConstants.availability, RouterPathsConstants.ibpbah, RouterPathsConstants.ibshuttle, RouterPathsConstants.flightsRecap]),
    [RouterPathsConstants.flightsRecap]: new Set([RouterPathsConstants.availability]),
    [RouterPathsConstants.ibpbah]: new Set([RouterPathsConstants.availability, RouterPathsConstants.flightsRecap, RouterPathsConstants.ibshuttle]),
    [RouterPathsConstants.ibcmtv]: new Set([RouterPathsConstants.availability, RouterPathsConstants.ibpbah, RouterPathsConstants.ibshuttle, RouterPathsConstants.flightsRecap, RouterPathsConstants.ibairp]),
    [RouterPathsConstants.ibpurc]: new Set([RouterPathsConstants.availability, RouterPathsConstants.ibpbah, RouterPathsConstants.ibshuttle, RouterPathsConstants.flightsRecap, RouterPathsConstants.ibairp, RouterPathsConstants.ibcmtv])
} as const;

