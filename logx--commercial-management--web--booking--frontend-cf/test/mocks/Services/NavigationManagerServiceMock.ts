import { NAVIGATION_GUARD_SEMAPHORE_STATES, NavigationGuardSemaphoreStatesTypes } from "@src/app/core/constants/ib-navigation-manager-constants";
import { defer, of } from "rxjs";

export class NavigationManagerServiceMock {
    public mockState: NavigationGuardSemaphoreStatesTypes = NAVIGATION_GUARD_SEMAPHORE_STATES.GO;
    ignoreOrderBeforeRedirect = jasmine.createSpy('ignoreOrderBeforeRedirect');
    get navigationGuardSemaphore$ (){  
        return defer(() => of(this.mockState));
    }
    init = jasmine.createSpy('init');
}