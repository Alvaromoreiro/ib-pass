export class KeepAliveUtilsServiceMock {
    constructor() {}
        
     public keepAliveModel = {
            sessionStartTime: 0,
            countdownShowed: false,
            failedKeepAliveService: false,
            sessionMaxTime: 0,
            sessionTimeBeforeCountdown: 0
        };

    public keepAliveInit = jasmine.createSpy('keepAliveInit');

}
