import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { BookingTranslateFactoryService } from '@core/services/ib-booking-translate-factory.service';
import { BookingTranslationReadyGuardFn } from '@core/routing/Guards/ib-translation-ready.guard';



class TestBench {
    public Guard: any;
    public BookingTranslateFactoryService: any;
    constructor () {
        this.BookingTranslateFactoryService = {isReady: new BehaviorSubject<boolean>(false)};
        this.Guard = ()=> TestBed.runInInjectionContext(() => BookingTranslationReadyGuardFn(null, null));
        TestBed.configureTestingModule({
            providers: [
                { provide: BookingTranslateFactoryService, useValue: this.BookingTranslateFactoryService }
            ]
        });
    }
}

describe('BookingTranslationReadyGuardFn', () => {
    let guard: any = BookingTranslationReadyGuardFn;
    let BookingTranslateFactoryService: BookingTranslateFactoryService;
    beforeEach(() => {
        const test = new TestBench();  
        guard = test.Guard;
        BookingTranslateFactoryService = test.BookingTranslateFactoryService;
    });

    it('should return true when isReady is true', (done) => {
        const sub = guard().subscribe(result => {
            expect(result).toBeTrue();
            sub.unsubscribe();
            done();
        });
        BookingTranslateFactoryService.isReady.next(false);
        // Should only emit when true
        BookingTranslateFactoryService.isReady.next(true);
        
    });
});