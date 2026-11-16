import { BehaviorSubject } from 'rxjs';

export class BookingTranslateFactoryServiceMock {
    isReady = new BehaviorSubject<boolean>( false );
}
