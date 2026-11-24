describe('test for ibPmtWineClub', function () {
    let ibPmtWineClub;
    let bindings = {
        model: {
            externalUrl: 'www.clubdelvinoiberia.com'
        }
    };
    
    let fake$Window;
    let fakeDatalayerUtilsService;
    let rootScope;

    beforeEach(function () {
        fake$Window = {
            'open': jasmine.createSpy('open')
        };
        fakeDatalayerUtilsService = {
            'updateDatalayerEvent' : jasmine.createSpy('updateDatalayerEvent')
        };

        angular.mock.module('ib-pmt-wine-club-module', function ($provide) {
            $provide.value('$window', fake$Window);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
        });

        inject(function (_$rootScope_, _$componentController_) {
            rootScope = _$rootScope_;
            rootScope.appLang = 'es';
            ibPmtWineClub = _$componentController_('ibPmtWineClub', {}, bindings);
        });
    });

    describe('ibPmtWineClub is init', function () {
        it('ibPmtWineClub should be defined', function (done) {
            expect(ibPmtWineClub).toBeDefined();
            done();
        });

        it('ibPmtWineClub should call onRedirect and open link', function (done) {
            ibPmtWineClub.model.externalUrl = 'www.clubdelvinoiberia.com';

            ibPmtWineClub.onRedirect();  

            expect(fakeDatalayerUtilsService.updateDatalayerEvent).toHaveBeenCalled();
            expect(fake$Window.open).toHaveBeenCalledWith(bindings.model.externalUrl, '_blank');
            done();
        });

        it('ibPmtWineClub should call onRedirect', function (done) {
            ibPmtWineClub.model.externalUrl = undefined;

            ibPmtWineClub.onRedirect();

            expect(fakeDatalayerUtilsService.updateDatalayerEvent).not.toHaveBeenCalled();
            expect(fake$Window.open).not.toHaveBeenCalled();
            done();
        });

        it('ibPmtWineClub should call setBackgroundImage language', function (done) {
            const image = ibPmtWineClub.setBackgroundImage();
            
            expect(image).toEqual({ backgroundImage: 'url(/iberia-web-content/imagenes/banners/wineclub-bki/bki_confirm_wineclub_christmas_es.jpg)'});
            done();
        });

        it('ibPmtWineClub should call setBackgroundImage default', function (done) {
            rootScope.appLang = 'kr';

            const image = ibPmtWineClub.setBackgroundImage();
            
            expect(image).toEqual({ backgroundImage: 'url(/iberia-web-content/imagenes/banners/wineclub-bki/bki_confirm_wineclub.jpg)'});
            done();
        });
    });
});
