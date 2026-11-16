export  const BookingModalServiceMock = {
    showGenericModal: jasmine.createSpy().and.returnValue({
      result: Promise.resolve()
    })
  };

export const DatalayerUtilsServiceMock = {
    removeDatalayerObjects: jasmine.createSpy()
  };

export const MonetateUtilsServiceMock = {
    addTrackProductDetail: jasmine.createSpy()
  };

export  const rootScopeMock = {
    isLogged: null,
    isPointsOBFlow: null,
    $broadcast: jasmine.createSpy()
  };

export  const sessionStorageMock = {
    get: jasmine.createSpy(),
    set: jasmine.createSpy()
  };

export  const windowMock = {
    location: {
      href: 'http://localhost'
    }
  };