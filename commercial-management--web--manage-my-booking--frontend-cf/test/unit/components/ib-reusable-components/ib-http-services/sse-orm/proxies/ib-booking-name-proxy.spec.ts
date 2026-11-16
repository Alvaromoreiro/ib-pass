describe('BookingNameProxy', function() {
    var BookingNameProxy, $httpBackend;

    beforeEach(function() {
        angular.mock.module('ib-http-services-module');

        inject(function($injector) {
            BookingNameProxy = $injector.get('BookingNameProxy');
            $httpBackend = $injector.get('$httpBackend');
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a POST request to the provided URL', function() {
        var url = 'http://example.com';
        var name = 'John';
        var surname = 'Doe';

        $httpBackend.expectPOST(url, { name: name, surname: surname }).respond(200, {});

        BookingNameProxy.getBooking(url, name, surname).then(function(response) {
            expect(response.code).toEqual(200);
        });

        $httpBackend.flush();
    });
});
