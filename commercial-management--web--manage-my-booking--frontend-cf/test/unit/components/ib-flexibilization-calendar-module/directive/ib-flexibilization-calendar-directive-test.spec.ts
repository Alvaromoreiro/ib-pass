describe('ibCalendarCarousel directive', function() {
    var $compile, $rootScope, $timeout, $window;
  
    beforeEach(angular.mock.module('ib-flexibilization-calendar-module'));
  
    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, _$window_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
      $window = _$window_;
    }));
  
    it('should swipe to the next day when swiped left', function() {
        var scope = $rootScope.$new();
    scope.ibFlexCalendarCtrl = { changeDay: jasmine.createSpy('changeDay') };
    var element = $compile('<div ib-calendar-carousel><div</div></div>')(scope);

    scope.$digest();
        var touchStartEvent:any = new Event('touchstart');
        touchStartEvent.touches = [{    screenX: 100,    screenY: 0  }];
        element[0].dispatchEvent(touchStartEvent);
      
        var touchMoveEvent:any = new Event('touchmove');
        touchMoveEvent.touches = [{    screenX: 50,    screenY: 0  }];
        element[0].dispatchEvent(touchMoveEvent);
      
        var touchEndEvent:any = new Event('touchend');
        touchEndEvent.touches = [{   screenX: 0,    screenY: 0  }];
        element[0].dispatchEvent(touchEndEvent);
      
        try {
          $timeout.flush();
        } catch (e) {
          // Manejar excepciones aquí
        }
 
        expect(scope.ibFlexCalendarCtrl.changeDay).toHaveBeenCalledWith(true);
      });
      
      
  });
  