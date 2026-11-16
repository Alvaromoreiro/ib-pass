import * as angular from 'angular';
describe('BookingComponentUtils Test', () => {
    var rootScope, BookingComponentUtils, timeout, fakeWindow;

    beforeEach( () => {
        angular.mock.module('ib-booking-services-module', ($provide) => {
        });
        inject(($rootScope, _BookingComponentUtils_, $timeout, $window) => {
            BookingComponentUtils = _BookingComponentUtils_;
            rootScope = $rootScope;
            timeout = $timeout;
            fakeWindow = $window
        });
    });
    describe('when equalHeight is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const element = document.createElement('div');
            element.innerHTML =' <div data-equal="my-equal-group"> <div style="height: 100px;"></div> <div style="height: 50px;"></div> </div>';
            BookingComponentUtils.equalHeight(element,true);
            const firstChildHeight = element.querySelector('div[data-equal="my-equal-group"] > div:first-child').clientHeight;
            const secondChildHeight = element.querySelector('div[data-equal="my-equal-group"] > div:last-child').clientHeight;
            expect(firstChildHeight).toEqual(secondChildHeight);
        });
    });
    describe('when equalWidth is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const element = document.createElement('div');
            element.innerHTML = `
            <div data-equal-w="my-equal-group-w">
                <div style="width: 100px;"></div>
                <div style="width: 50px;"></div>
            </div>`;
            BookingComponentUtils.equalWidth(element,true);
            const firstChildWidth = element.querySelector('div[data-equal-w="my-equal-group-w"] > div:first-child').clientWidth;
            const secondChildWidth = element.querySelector('div[data-equal-w="my-equal-group-w"] > div:last-child').clientWidth;
            expect(firstChildWidth).toEqual(secondChildWidth);
        });
    });
    describe('when equalWidth is called', () => {
        beforeEach(inject(() => {

        }));
        it('should return `undefined` if no parent element matches the given function', () => {
        const element = document.createElement('div');
        const parent = BookingComponentUtils.get_parents([element], (el) => {
            return el.innerHTML === 'This is the parent element';
        });
        expect(parent).toBeUndefined();
        });
    });
    describe('when fadeIn is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const element = document.createElement('div');
            element.style.opacity='0';
            BookingComponentUtils.fadeIn([element]);
            expect(element.style.opacity).toBeLessThan(1);
          });
    });
    describe('when fadeOut is called', () => {
        beforeEach(inject(() => {

        }));
        it('', () => {
            const element = document.createElement('div');
            element.style.opacity='1';
            BookingComponentUtils.fadeOut([element]);
            expect(element.style.opacity).toBeGreaterThan(0);
          });
    });
    describe('when detectNavigator is called', () => {
        beforeEach(inject(() => {

        }));
        it('should return `true` if the browser is Internet Explorer 7, 8, or 9', () => {
            angular.element('html').addClass('ie7');
            const oldIE = BookingComponentUtils.detectNavigator();
            expect(oldIE).toBe(true);
        });
    });
});
