import * as angular from 'angular';

export class ibGreyBarTransformer {
    constructor (
        private $window: ng.IWindowService,
        private NewMainHeaderConstants: ibPlusConstantNamespace.NewMainHeaderConstants,
        private CommonsUserUtilsService: CommonsUserUtilsService
    ) { }

    initGreyBar (model) {
        if (!model) return undefined;

        const isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        const loggedState = this.buildLoggedState(model, isSoftUser);

        return {
            login: this.buildLoginHandlers(model),
            loggedData: loggedState.loggedData,
            userLogged: isSoftUser ? null : model.userLogged,
            isONB: this.isOnbUser(model.userLogged, isSoftUser),
            isLogged: loggedState.isLogged,
            show: this.resolveShow(model.show)
        };
    }

    transformAvios (avios) {
        return avios.toString();
    }

    updateLoggedData (customerData) {
        if (customerData.personalInfo) {
            this.ensureAviosTransformed(customerData.generalInfo);
            return this.mapPersonalInfoToLoggedData(customerData);
        }
        return this.mapUserInfoToLoggedData(customerData);
    }

    isSoftUser = () => {
        return this.CommonsUserUtilsService.isSoftUser() || false;
    };

    private buildLoginHandlers (model) {
        const fallback = this.$window.location.reload;
        return {
            onLogin: model.onLogin || fallback,
            afterLogin: model.afterLogin || fallback,
            onError: model.onError || fallback
        };
    }

    private buildLoggedState (model, isSoftUser: boolean) {
        if (!model.loggedData || isSoftUser) {
            return { isLogged: false, loggedData: {} };
        }
        return {
            isLogged: true,
            loggedData: this.updateLoggedData(model.loggedData)
        };
    }

    private isOnbUser (userLogged, isSoftUser: boolean): boolean {
        if (isSoftUser) return false;
        return userLogged === this.NewMainHeaderConstants.LOGIN_TYPES.ONB;
    }

    private resolveShow (show): boolean {
        if (show === true || show === false) return show;
        return true;
    }

    private hasAviosValue (generalInfo): boolean {
        return generalInfo.avios || generalInfo.avios === 0;
    }

    private ensureAviosTransformed (generalInfo): void {
        if (!this.hasAviosValue(generalInfo)) return;
        if (generalInfo.aviosTransformed) return;
        generalInfo.aviosTransformed = this.transformAvios(generalInfo.avios);
    }

    private mapPersonalInfoToLoggedData (customerData) {
        const isIbZero = this.CommonsUserUtilsService.isIbZero();
        const isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        return {
            name: customerData.personalInfo.name || customerData.personalInfo.contactEmail,
            surname: !isSoftUser ? customerData.personalInfo.surname1 : null,
            avios: !isIbZero ? customerData.generalInfo.aviosTransformed : null,
            isLogged: true
        };
    }

    private mapUserInfoToLoggedData (customerData) {
        const isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        return {
            name: customerData.userInfo.firstName,
            surname: !isSoftUser ? customerData.userInfo.lastName : null,
            points: customerData.pointsTransformed,
            isLogged: true
        };
    }
}
ibGreyBarTransformer.$inject = ['$window', 'NewMainHeaderConstants', 'CommonsUserUtilsService'];

try {
    const mod = angular.module('ib-grey-bar-module');
    mod.service(
        'ibGreyBarTransformer',
        ibGreyBarTransformer
    );
} catch (error) {
    const mod = angular.module('ib-grey-bar-module');
    mod.service(
        'ibGreyBarTransformer',
        ibGreyBarTransformer
    );
}