describe('GastroOfferService  Test', () => {
    var GastroOfferService;

    var fakeMmBAppConstants = {
        cloudServiceCustomerExperience: 'customer-experience-cloud'
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject((_GastroOfferService_) => {
            GastroOfferService = _GastroOfferService_;
        });
    });

    describe('when importGastronomicProposalComponent() is called', () => {

        it('should return true when component loads successfully', async () => {
            spyOn<any>(GastroOfferService, 'dynamicImporter').and.returnValue(Promise.resolve());

            const result = await GastroOfferService.importGastronomicProposalComponent();

            expect(result).toBe(true);
            expect(GastroOfferService['dynamicImporter']).toHaveBeenCalledWith(
                'customer-experience-cloud/gastronomic/customer--customer-experience--gastronomic-proposal--frontend/customer-experience-gastronomic-proposal.es.js'
            );
        });

        it('should return false when component fails to load', async () => {
            spyOn<any>(GastroOfferService, 'dynamicImporter').and.returnValue(Promise.reject(new Error('Load failed')));

            const result = await GastroOfferService.importGastronomicProposalComponent();

            expect(result).toBe(false);
        });

        it('should call dynamicImporter with the correct URL', async () => {
            const result = await GastroOfferService.importGastronomicProposalComponent();

            expect(result).toBe(false);
        });
    });
});
