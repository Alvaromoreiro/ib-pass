import angular from 'angular';

export class QuantumService {


    /**
     * 
     * https://community.quantummetric.com/s/article/Quantum-Metric-API
     * 
     */



    constructor (private $window: ng.IWindowService
    ){
        
    }


    private isQMDefined =() => {
        

        return this.$window.QuantumMetricAPI;

    };

    /**
  * 
  * @param eventId  Quantum eventId
  * @param converse Indicate if the parameter must to be converted 
  * @param value    Value of the event
  */
    sendEvent (eventId:string, converse:boolean, value:any){

        if(this.isQMDefined()){
            this.$window.QuantumMetricAPI.sendEvent(eventId, converse, value);
        }

    }

}

QuantumService.$inject =['$window'];
 


try {
    const mod = angular.module('ib-pmt-utils-module');
    mod.service(
        'QuantumService',
        QuantumService
    );
} catch (error) {
    const mod = angular.module('ib-pmt-utils-module', []);
    mod.service(
        'QuantumService',
        QuantumService
    );
}
