import { ActivatedRouteSnapshot, CanDeactivateFn, RouterStateSnapshot } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { NavigationManagerService } from '../../services/navigation/ib-booking-navigation-manager.service';
import { NAVIGATION_GUARD_SEMAPHORE_STATES } from '../../constants/ib-navigation-manager-constants';

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>;
}
export const BookingStepsControlFn: CanDeactivateFn<ComponentCanDeactivate> = ( component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot ) : Observable<boolean> => {
    const NavigationManager: NavigationManagerService = inject( NavigationManagerService );
    return NavigationManager.navigationGuardSemaphore$.pipe(
        filter( state => state !== NAVIGATION_GUARD_SEMAPHORE_STATES.WAIT),
        map((state) => state === NAVIGATION_GUARD_SEMAPHORE_STATES.GO)
    );
};
