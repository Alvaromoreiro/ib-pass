function Component(
    moduleName: string,
    selector: string,
    options: ng.IComponentOptions,
    inject: string[] = [],
    require: string[],
) {
    return (controller: Function) => {
        try {
            const mod = angular.module(moduleName);
            controller.$inject = inject;
            mod.component(
                selector,
                angular.extend(options, { controller: controller })
            );
        } catch (error) {
            const mod = angular.module(moduleName, require);
            controller.$inject = inject;
            mod.component(
                selector,
                angular.extend(options, { controller: controller })
            );
        }
    };
}

function Service(
    moduleOrName: string,
    inject: string[] = [],
    require: string[] = []
) {
    //@ts-ignore
    return (service: FunctionDecorator) => {
        try{
            const isProvider = service.hasOwnProperty('$get');
            service.$inject = inject;
            angular.module(moduleOrName)[isProvider ? 'provider' : 'service'](service.name ?? service.constructor.name, <Function> service);
        }catch(error){
            const mod = angular.module(moduleOrName, require);
            service.$inject = inject;
            mod.service(service.name ?? service.constructor.name,  <Function> service);
        }
    };
}

function Factory(
    moduleOrName: string,
    inject: string[] = [],
    require: [] = []
) {
    //@ts-ignore
    return (service: FunctionDecorator) => {
        try{
            angular.module(moduleOrName).factory(service.name ?? service.constructor.name, <Function>service);
            service.$inject = inject;
        }catch(error){
            const mod = angular.module(moduleOrName, require);
            mod.factory(service.name ?? service.constructor.name, <Function>service);
            service.$inject = inject;
        }
    };
}

function Config(
    moduleOrName: string,
    require: [] = []
) {
    //@ts-ignore
    return (config: FunctionDecorator) => {
        try {
            angular.module(moduleOrName).config(config);
        } catch (error) {
            const mod = angular.module(moduleOrName, require);
            mod.config(config);
        }
    };
}

function Filters(
    moduleOrName: string,
    inject: string[] = [],
    require: string[] = [],
    module,
    name: string
) {
    return () => {
        try {
            angular.module(moduleOrName).filter(name, module);
            module.$inject = inject;
        } catch (error) {
            const mod = angular.module(moduleOrName, require);
            mod.filter(name, module);
            module.$inject = inject;

        }
        return null;
    };
}

function Directives(
    moduleOrName: string,
    inject: string[] = [],
    require: string[] = []
) {
    return (directive: any) => {
        const factory = (...args: any[]) => {
            const options = {
                controller: () => { },
            };
            return angular.extend(new directive(...args), options);
        };
        try {
            angular.module(moduleOrName).directive(directive.name, factory);
            factory.$inject = inject;
        } catch (error) {
            const mod = angular.module(moduleOrName, require);
            mod.directive(directive.name, factory);
            factory.$inject = inject;
        }
    };
}

function Controller(
    moduleOrName: string,
    inject: string[] = [],
    require: string[] = []
) {
    return (controller: any) => {
        try {
            controller.$inject = inject;
            angular.module(moduleOrName).controller(controller.name, controller);

        } catch (error) {
            const mod = angular.module(moduleOrName, require);
            controller.$inject = inject;
            mod.controller(controller.name, controller);
        }
    };
}


function Constants(
    moduleOrName: string,
    name: string,
    constans: Object
) {
    return angular.module(moduleOrName).constant(name, constans);
}
