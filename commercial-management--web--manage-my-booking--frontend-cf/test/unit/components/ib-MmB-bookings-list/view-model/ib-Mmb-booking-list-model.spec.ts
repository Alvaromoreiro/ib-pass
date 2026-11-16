'use strict';
jasmine.getEnv().allowRespy(true);
describe('BookingsListModel test', () => {
    var BookingsListModel;
    var $injector;
    beforeEach(() => {
        angular.mock.module('ib-MmB-bookings-list-module', () => {});
        inject((_$injector_) => {
            $injector = Object.keys(_$injector_).reduce((clone, key) => {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            BookingsListModel = $injector.get('BookingsListModel');
        });
    });

    it('initializeModel should be defined', () => {
        expect(BookingsListModel).toBeDefined();
    });

    it('test for BookingsListModel.initializeModel', () => {
        BookingsListModel.initializeModel();
        expect(BookingsListModel.initializeModel).toBeDefined();
    });
});
