import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { BookingTranslateFactoryService } from '@core/services/ib-booking-translate-factory.service';
import { filter, Observable, takeWhile } from 'rxjs';


export const BookingTranslationReadyGuardFn: CanActivateFn = (): Observable<boolean> => {
    return inject(BookingTranslateFactoryService).isReady.pipe(filter((isReady) => isReady), takeWhile((value) => !value, true ));
};
