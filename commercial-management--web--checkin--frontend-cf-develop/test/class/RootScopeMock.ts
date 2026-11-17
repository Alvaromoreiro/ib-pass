import dayjs from 'dayjs';

export class RootScopeMock {
    newFare = false;
    showHeaders = false;
    appMarket = 'ES';
    appLang = 'es';
    timeSession = {
        startTime: dayjs(),
        openedModal: false,
        failedKeepAliveService: false,
        timerActivate: true
    };
    public isMobile = {
        general: false,
        header: false
    };
    public $on = jasmine.createSpy('$on');
    public $broadcast = jasmine.createSpy('$broadcast');
    routes = {
        icons: 'https://icons'
    };
}
