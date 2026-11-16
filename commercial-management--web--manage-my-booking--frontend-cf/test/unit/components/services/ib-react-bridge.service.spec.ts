import { ReactBridgeService } from './../../../../src/components/services/ib-react-bridge.service';
import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';

xdescribe('ReactBridgeService', () => {

  let service: ReactBridgeService;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactBridgeService]
    });

    service = TestBed.inject(ReactBridgeService);
    ngZone = TestBed.inject(NgZone);
  });

  it('should emit event when react-event is dispatched', (done) => {

    const mockDetail:any = {
      detail: {
        type: 'RETRIEVE_BOOKING',
        payload: { pnr: 'ASDF5', surname: 'test' }
      }
      
    };

    service.event$.subscribe(event => {
      expect(event).toEqual(mockDetail);
      done();
    });

    ngZone.run(() => {
      window.dispatchEvent(
        new CustomEvent('react-event', {
          detail: mockDetail
        })
      );
    });

  });

  it('should call ngZone.run when event is received', () => {

    const runSpy = spyOn(ngZone, 'run').and.callThrough();

    window.dispatchEvent(
      new CustomEvent('react-event', {
        detail: { type: 'RETRIEVE_BOOKING' }
      })
    );

    expect(runSpy).toHaveBeenCalled();
  });

});