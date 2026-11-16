describe('DisruptionFlightNodeController', () =>  {
    let $controller;
  
    beforeEach(() =>  {
        angular.mock.module('ib-disruption-flight-node-module');

      
    });
  
    beforeEach(inject((_$controller_) => {
      $controller = _$controller_;
    }));
  
    it('should be defined', () =>  {
      let controller = $controller('DisruptionFlightNodeController');
      controller.$onInit();
      expect(controller).toBeDefined();
    });

  });
  