/** ***************************************************************************
 *    Proyecto: IBERIA COM
 *    Desripcion: Fichero con las funciones JavaScript custom del proyecto para Formularios
 ***************************************************************************** */
import { initDateFormated, loadjsfile } from './ibe-modules/general/ibe_inte-util';
import checkifcitiesneeded from './ibe-modules/independent/searcher-modules/ibe_check-if-needed';
import retrieveGlobalVariables from './ibe-modules/general/ibe_variables';

const { staticsVersion } = retrieveGlobalVariables();
// Inizialitation page functions
$(document).ready(() => {
  $('.inte-divContinue').each(function ech() {
    if ($(this).length === 0) {
      ($(this).parent('body')).find('.inte-elementshowhide').removeClass('hidden');
    }
  });
  // Init Dates
  initDateFormated();
  // Load origins and destinations if needed.
  checkifcitiesneeded()
    .then((citiesJSON) => {
      if (!window.citiesJSON) {
        window.citiesJSON = {};
      }
      window.citiesJSON.origin3tabsJSON = citiesJSON.origin3tabsJSONAux;
    })
    .catch(() => {
      // eslint-disable-next-line no-console
      console.error("Couldn't retrive cities data");
      window.citiesJSON = {};
      window.citiesJSON.origin3tabsJSON = {};
    });
  // Children Traveling Alone page form
  if ($('#serviceUnaccompainedMinor').length > 0) {
    loadjsfile(`forms/ibe_minors.js${staticsVersion}`);
  }
  // Best Price Guarantee Page Form
  if ($('#servicePNRValidate').length > 0) {
    loadjsfile(`forms/ibe_best-price.js${staticsVersion}`);
  }
});


// launch lazy modules
// Newsletters
if ($('#subscription').length > 0) {
  loadjsfile(`forms/ibe_newsletters.js${staticsVersion}`);
}
// Claims, Proof Request, Iberiacare, GDPR
if ($('.ibe-claim').length > 0 && $('#serviceUnaccompainedMinor').length !== 1) {
  loadjsfile(`forms/ibe_claims.js${staticsVersion}`);
}
// Invoices
if ($('#invoiceRequest').length > 0) {
  loadjsfile(`forms/ibe_invoice.js${staticsVersion}`);
}

// Form Avios
if ($('#aviosDonation-intro').length > 0) {
  loadjsfile(`forms/ibe_donations.js${staticsVersion}`);
}


// Form voucher
if ($('#voucherManageForms').length > 0) {
  loadjsfile(`forms/ibe_vouchermanager.js${staticsVersion}`);
}
