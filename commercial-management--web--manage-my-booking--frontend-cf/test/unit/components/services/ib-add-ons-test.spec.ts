describe('AddOnService Test', () =>  {

    let rootScope, AddOnService, window;
    const fakeConstants = {
        lang: 'es'
    };

    let pubadsMock;
    let googletagMock;
    let slotRenderCallback;

    let originalPubads;

    beforeEach(() =>  {
        angular.mock.module('ib-MmB-services-module', 'ngCookies', ($provide) => {
            $provide.value('MmBAppConstants', fakeConstants);
        });

        pubadsMock = {
            refresh: jasmine.createSpy('refresh'),
            clear: jasmine.createSpy('clear'),
            setTargeting: jasmine.createSpy('setTargeting'),
            enableSingleRequest: jasmine.createSpy('enableSingleRequest'),
            collapseEmptyDivs: jasmine.createSpy('collapseEmptyDivs'),
            addEventListener: jasmine.createSpy('addEventListener').and.callFake((_, cb) => {
                slotRenderCallback = cb;
            })
        };

        originalPubads = jasmine.createSpy('pubads').and.returnValue(pubadsMock);

        googletagMock = {
            cmd: {
                push: jasmine.createSpy('push').and.callFake((fn) => fn())
            },
            defineSlot: jasmine.createSpy('defineSlot').and.callFake(() => ({
                addService: jasmine.createSpy('addService')
            })),
            pubads: originalPubads,
            enableServices: jasmine.createSpy('enableServices'),
            display: jasmine.createSpy('display')
        };

        inject(($rootScope, _$window_) => {
            rootScope = $rootScope;
            window = _$window_;
            window.googletag = googletagMock;
        });

        rootScope.GOOGLE_ADS_URIS = {
            TYPE_0: 'URI_0',
            TYPE_1: 'URI_1',
            TYPE_2: 'URI_2',
            TYPE_3: 'URI_3'
        };

        rootScope.BANNER_IDS = {
            TYPE_0: 'BANNER_0',
            TYPE_1: 'BANNER_1',
            TYPE_2: 'BANNER_2',
            TYPE_3: 'BANNER_3'
        };

        inject((_AddOnService_) => {
            AddOnService = _AddOnService_;
        });
    });

    afterEach(() => {
        // Restore pubads as FUNCTION to avoid Jasmine lifecycle errors
        if (window && window.googletag) {
            window.googletag.pubads = originalPubads;
        }
    });

    describe('initAddOn', () =>  {
        it('should initialize googletag slots and listeners', () =>  {
            spyOn(rootScope, '$emit');

            AddOnService.initAddOn();

            expect(window.googletag.defineSlot).toHaveBeenCalledTimes(4);
            expect(pubadsMock.setTargeting).toHaveBeenCalledWith('ib-lang', '"es"');
            expect(pubadsMock.enableSingleRequest).toHaveBeenCalled();
            expect(pubadsMock.collapseEmptyDivs).toHaveBeenCalled();
            expect(window.googletag.enableServices).toHaveBeenCalled();
            expect(pubadsMock.addEventListener).toHaveBeenCalled();

            // initAddOn only initializes slots and listeners
            // rendering is triggered later by GPT, not here
        });
    });

    describe('displayAddOn', () =>  {
        it('should refresh and display the add-on', () =>  {
            AddOnService.displayAddOn('BANNER_2');

            expect(pubadsMock.refresh).toHaveBeenCalled();
            expect(window.googletag.display).toHaveBeenCalledWith('BANNER_2');
        });
    });

    describe('slotRenderEnded listener', () => {
        it('should emit bannerRenderedEvent when rendered slot matches idAddOn', () => {
            spyOn(rootScope, '$emit');

            AddOnService.initAddOn();
            AddOnService.displayAddOn('BANNER_2');

            const fakeEvent = {
                isEmpty: false,
                slot: {
                    getSlotElementId: jasmine.createSpy('getSlotElementId').and.returnValue('BANNER_2')
                }
            };

            // Ejecutamos manualmente el callback registrado en addEventListener
            slotRenderCallback(fakeEvent);

            expect(rootScope.$emit).toHaveBeenCalledWith('bannerRenderedEvent', true);
        });
    });

    describe('clearAddOns', () =>  {
        it('should clear all add-ons', () =>  {
            AddOnService.clearAddOns();

            expect(googletagMock.pubads).toHaveBeenCalled();
            expect(pubadsMock.clear).toHaveBeenCalled();
        });
    });

    describe('googletag fallback initialization', () => {
        it('should create googletag and cmd array when window.googletag is undefined', () => {
            // Eliminamos googletag antes de crear una nueva instancia real
            window.googletag = undefined;

            let freshService;
            inject(($injector) => {
                // Fuerza ejecución REAL del constructor
                freshService = $injector.instantiate(AddOnService.constructor);
            });

            expect(window.googletag).toBeDefined();
            expect(window.googletag.cmd).toBeDefined();
            expect(Array.isArray(window.googletag.cmd)).toBeTrue();

            // No debe lanzar error al inicializar
            expect(() => freshService.initAddOn()).not.toThrow();
        });
    });

});
