import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { downgradeToAJSService } from 'ib-web-commons/utils'

@Injectable({
    providedIn: "root",
})
export class LoadingSpinnerService {
    private loadingSubject = new BehaviorSubject<boolean>(false)
    public loading$: Observable<boolean> = this.loadingSubject.asObservable()

    show(): void {
        this.loadingSubject.next(true)
    }

    hide(): void {
        this.loadingSubject.next(false)
    }

    isLoading(): boolean {
        return this.loadingSubject.value
    }
}

downgradeToAJSService('LoadingSpinnerService', LoadingSpinnerService, 'ib-shared-components-module')
