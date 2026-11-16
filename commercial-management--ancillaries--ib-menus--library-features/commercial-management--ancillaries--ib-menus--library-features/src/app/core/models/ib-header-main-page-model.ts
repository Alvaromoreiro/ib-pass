namespace ibHeaderMainPage {
    export type MainInfo = {
        customerData: customerData,
        languages: Array<lenguageList>,
        markets: Array<marketList>,
        selectedLanguage: lenguageList,
        selectedMarket: marketList,
        marketLabel: string,
        logged: boolean,
        login?: loginMethods
    };
    export type loggedInfo = {
        customerData: customerData,
        isLogged: boolean
    };
    export type customerData = {
        name: string;
        avios: string;
    };
    export type lenguageList = {
        code: string;
        description: string;
    };
    export type marketList = {
        code: string;
        description: string;
    };
    export type loginMethods = {
        onLogin: (...args: any[]) => any,
        onError: (...args: any[]) => any
    };
    export type ChangeLanguage = {
        languages: Array<lenguageList>;
        markets: Array<marketList>;
        selectedLanguage: lenguageList;
        selectedMarket: marketList;
        marketLabel: string;
    };
}
