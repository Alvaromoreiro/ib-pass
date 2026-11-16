namespace Fare {

    export interface FareStrategy {
        getFare():FareClass.Service
    }
    namespace FareClass {
        export class FareDefaultStrategy implements FareStrategy {
            getFare ():Service {
                return Service.RESHOP_TYPE;
            }
        }
    
        export class FareUnifiedStrategy implements FareStrategy {
            getFare ():Service {
                return Service.UNIFIED_TYPE;
            }
        }

        export enum Service {
            UNIFIED_TYPE,
            RESHOP_TYPE
        }

    }
    angular.module('ib-MmB-app').constant('FareClass', FareClass);
    export type FareClass = typeof FareClass;
}