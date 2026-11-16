
describe('ComponentsUtils Test', () => {

    let componentsUtils, testWindow, timeout, $rootScope;

    let fakeWindow = {
        'location': jasmine.createSpy(),
        'requestAnimationFrame': jasmine.createSpy(),
        'Date': jasmine.createSpy(),
    };

    let fakeAddOnService = {
        displayAddOn: jasmine.createSpy()
    };

    let html = '<div class="equal-height"> <div data-equal="2">test</div><div data-equal="2">test</div></div>';

    beforeEach(() => {
       angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('$window', fakeWindow);
            $provide.value('AddOnService', fakeAddOnService);
        });
        inject((_$rootScope_, _ComponentsUtils_, $window, _$timeout_) => {
            componentsUtils = _ComponentsUtils_;
            testWindow = $window;
            timeout = _$timeout_;
            $rootScope = _$rootScope_;
        });
        $rootScope.BANNER_IDS = {
            TYPE_0: 'test',
            TYPE_1: 'test',
            TYPE_2: 'test',
            TYPE_3: 'test',
        }
        document.body.insertAdjacentHTML(
            'afterbegin',
            html);
    });

    describe('equalHeight is called ', () => {
        it('equalHeight', (done) => {
            componentsUtils.equalHeight('.equal-height');
            timeout.flush();
            done();
        })
    });

    describe('get_parents is called ', () => {
        it('get_parents with return function', (done) => {
            componentsUtils.get_parents(['test'], ()=>{return {parentNode: 'test'}});
            expect(componentsUtils.get_parents(['test'], ()=>{return {parentNode: 'test'}})).toEqual('test');
            done();
        });
        it('get_parents without funct', (done) => {
            componentsUtils.get_parents([{parentNode: 'test'}], ()=>{});

            done();
        });
    });

    describe('fadeIn is called ', () => {
        it('fadeIn', (done) => {
            componentsUtils.fadeIn([{style: {opacity: 1}}]);
            done();
        });
    });

    xdescribe('fadeOut is called ', () => {
        it('fadeOut', (done) => {
            componentsUtils.fadeOut([{style: {opacity: 1}}]);
            done();
        });
    });
    describe('detectNavigator is called ', () => {
        it('detectNavigator', (done) => {
            componentsUtils.detectNavigator();
            expect(componentsUtils.detectNavigator()).toBeFalse();
            done();
        });
    });
    describe('initAddOn is called ', () => {
        it('initAddOn', (done) => {
            testWindow.innerWidth = 1280;
            componentsUtils.initAddOn();
            expect(fakeAddOnService.displayAddOn).toHaveBeenCalledWith('test');
            done();
        });
        it('initAddOn', (done) => {
            testWindow.innerWidth = 1024;
            componentsUtils.initAddOn();
            expect(fakeAddOnService.displayAddOn).toHaveBeenCalledWith('test');
            done();
        });
        it('initAddOn', (done) => {
            testWindow.innerWidth = 768;
            componentsUtils.initAddOn();
            expect(fakeAddOnService.displayAddOn).toHaveBeenCalledWith('test');
            done();
        });
        it('initAddOn', (done) => {
            testWindow.innerWidth = 480;
            componentsUtils.initAddOn();
            expect(fakeAddOnService.displayAddOn).toHaveBeenCalledWith('test');
            done();
        });
    });
});
