describe('BookingNameService', function () {
    let BookingNameService, MmBModalService, deferred;
    let fakeMmBModalService = {
        'showBookingNameModal': jasmine.createSpy('showBookingNameModal')
    }
    beforeEach(function () {
        angular.mock.module('ib-booking-name',function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
        });

        inject(function (_BookingNameService_, _MmBModalService_, $q) {
            BookingNameService = _BookingNameService_;
            MmBModalService = _MmBModalService_;
            deferred = $q.defer();
        });

        spyOn(MmBModalService, 'showBookingNameModal').and.returnValue({ result: deferred.promise });
    });

    it('should call MmBModalService.showBookingNameModal', function () {
        BookingNameService.checkName('Doe', 1234);
        expect(MmBModalService.showBookingNameModal).toHaveBeenCalledWith({
            surname: 'Doe',
            flowId: 1234
        });

        deferred.resolve(); // Resuelve la promesa para simular el cierre del modal.
    });
});
