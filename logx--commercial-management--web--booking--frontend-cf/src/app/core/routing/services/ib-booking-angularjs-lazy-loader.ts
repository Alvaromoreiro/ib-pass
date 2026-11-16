import angular from 'angular';

class IbBookingLazyLoaderAJS {
    constructor () {}

    private loader;

    set $ocLazyLoad (loader){
        this.loader = loader;
    }

    public load (moduleNames:string[] = []){
        return this.loader?.load(moduleNames.map(name => angular.module(name)));
    }
}

export const IbBookingLazyLoaderAJSsingleton = new IbBookingLazyLoaderAJS();