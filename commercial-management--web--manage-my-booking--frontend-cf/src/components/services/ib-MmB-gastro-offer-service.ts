@Service("ib-MmB-services-module", ["MmBAppConstants"], [])

export class GastroOfferService {
  private readonly GASTRONOMIC_PROPOSAL_URL = `${this.MmBAppConstants.cloudServiceCustomerExperience}/gastronomic/customer--customer-experience--gastronomic-proposal--frontend/customer-experience-gastronomic-proposal.es.js`;

  constructor(private MmBAppConstants: MmBAppConstants) {}

  importGastronomicProposalComponent = async () => {
    try {
      await this.dynamicImporter(this.GASTRONOMIC_PROPOSAL_URL);
      return true;
    } catch (error) {
      return false;
    }
  };

  /*
   * Dynamic Import webComponent.
   * Added  webpackIgnore: true to avoid launch webpack error.
   */
  private dynamicImporter = (url: string) =>
    import(/* webpackIgnore: true */ url);
}
