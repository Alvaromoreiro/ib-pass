describe('ibDisruptionFlightNodeComponent', function () {
  let $componentController;
  
    beforeEach(
        angular.mock.module('ib-disruption-flight-node-module'));
  
        beforeEach(inject(function (_$componentController_,) {
            $componentController = _$componentController_;
          
        }));
  
    it('should call templatesRoute with the correct parameters', function () {
      
        var bindings = {
            data: { flightNumber: 'IB1234' },
            channelFlag: 'web'
        };
        var nodeCtrl = $componentController('ibDisruptionFlightNodeComponent', null, bindings);
        expect(nodeCtrl.data).toEqual({ flightNumber: 'IB1234' });
        expect(nodeCtrl.channelFlag).toEqual('web');

        
    });
  
  });
  