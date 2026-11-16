export class BookingModalServiceMock {
    //Responses
    showKeepAliveModalResponse = { result: Promise.resolve() };
    //Methods
    showKeepAliveModal = jasmine
        .createSpy("showKeepAliveModal")
        .and.callFake(() => this.showKeepAliveModalResponse);
    showWaitingModal = jasmine.createSpy("showWaitingModal");
    finishWaiting = jasmine.createSpy("finishWaiting").and.callFake(() => {});
    resetSpies = () => {
        this.showKeepAliveModal.calls.reset();
        this.showWaitingModal.calls.reset();
        this.finishWaiting.calls.reset();
    };
}

export class BookingIgnoreOrderServiceMock {
    //Responses
    ignoreOrderResponse = Promise.resolve();
    //Methods
    ignoreOrder = jasmine
        .createSpy("ignoreOrder")
        .and.callFake(() => this.ignoreOrderResponse);
    resetSpies = () => {
        this.ignoreOrder.calls.reset();
    };
}

export class BookingUtilServiceMock {
    //Methods
    getURLFirstParameterByName = jasmine
        .createSpy("getURLFirstParameterByName")
        .and.callFake(() => "");
    checkExistNewAvailabilitySearch = jasmine
        .createSpy("checkExistNewAvailabilitySearch")
        .and.callFake(() => Promise.resolve());
    resetSpies = () => {
        this.getURLFirstParameterByName.calls.reset();
        this.checkExistNewAvailabilitySearch.calls.reset();
    };
}

export class BookingAvailabilityServiceMock {
    checkExistNewAvailabilitySearch = jasmine
        .createSpy("checkExistNewAvailabilitySearch")
        .and.callFake(() => "");
    resetSpies = () => {
        this.checkExistNewAvailabilitySearch.calls.reset();
    };
}

export class KeepAliveServiceMock {
    //Responses
    keepAliveAvmResponse = Promise.resolve();
    keepAliveOrmResponse = Promise.resolve();
    //Methods
    keepAliveAvm = jasmine
        .createSpy("keepAliveAvm")
        .and.callFake(() => this.keepAliveAvmResponse);
    keepAliveOrm = jasmine
        .createSpy("keepAliveOrm")
        .and.callFake(() => this.keepAliveOrmResponse);
    resetSpies = () => {
        this.keepAliveAvm.calls.reset();
        this.keepAliveOrm.calls.reset();
    };
}

export class IbBookingRetrieveOrderServiceMock {
    //Responses
    retrieveOrderResponse = Promise.resolve('')
    //Methods
    retrieveOrder = jasmine
        .createSpy("retrieveOrder")
        .and.callFake(() => this.retrieveOrderResponse);
}

export class BookingRedirectionServiceMock {
    //Responses
    retrieveOrderResponse = Promise.resolve('')
    //Methods
    path = jasmine.createSpy('path')
}

export class MOCKConstants {
    private _commercialData = { sessionTimeLifeInMinutes: 15 };
    private _responseId = "123456789";
    private _createOrderData = { order: { orderId: "123456789" } };

    get commercialData() {
        return JSON.parse(
            JSON.stringify(this._commercialData)
        ) as typeof this._commercialData;
    }
    get responseId() {
        return JSON.parse(
            JSON.stringify(this._responseId)
        ) as typeof this._responseId;
    }
    get createOrderData() {
        return JSON.parse(
            JSON.stringify(this._createOrderData)
        ) as typeof this._createOrderData;
    }
}
