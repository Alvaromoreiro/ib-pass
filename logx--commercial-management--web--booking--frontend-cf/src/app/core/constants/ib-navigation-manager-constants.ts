export const NAVIGATION_GUARD_SEMAPHORE_STATES = {
    GO: 'GO',
    WAIT: 'WAIT',
    CANCEL: 'CANCEL'
} as const;
export type NavigationGuardSemaphoreStatesTypes = typeof NAVIGATION_GUARD_SEMAPHORE_STATES[keyof typeof NAVIGATION_GUARD_SEMAPHORE_STATES];
