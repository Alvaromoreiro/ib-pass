import { responsive } from '../general/ibe_inte-util';
import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

/** loadOfficeResults
 * This functions call CSElement to load the HTML associated with
 * offices page
 */
function loadOfficeResults(city, country, visitorP) {
  const vp = Object.keys(visitorP).length ? JSON.stringify(visitorP) : undefined;
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Contact/Results',
      market: marketg,
      locale: localeg,
      cityIATA: city,
      countryIATA: country,
      visitorParams: vp,
      d: '',
    },
    beforeSend() {
      dFrontJs.ibe_loading.open('.inte-loadingOffice');
    },
    complete() {
      dFrontJs.ibe_loading.close('.inte-loadingOffice');
    },
    success(data) {
      $('.office_results').remove();
      $('.ibe-box-landing__terciary--office').append(data);
      if (responsive() !== 'desktop') {
        dFrontJs.ibe_scrollTop.scrollId('#resultsoffice-foco');
      }
    },
  });
}
export default loadOfficeResults;