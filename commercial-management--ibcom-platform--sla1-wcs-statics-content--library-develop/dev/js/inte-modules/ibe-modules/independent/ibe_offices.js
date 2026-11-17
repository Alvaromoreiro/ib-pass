import getVisitorData from '../general/ibe_visitor-data';
import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();
/**
 * @description Gets from WCS the information about offices and shows them in a modal.
 * @returns ajax call and DOM edition.
 */
$('.inte-buttonOffi').click(() => {
  const $mdlOff = $('.inte-modal-office');
  if (dFrontJs.ibe_validate.validateForm('.form-search-office')) {
    const city = $('#clase_mercado option:selected').val() ? $('#clase_mercado option:selected').val() : undefined;
    const country = $('#clase_catego option:selected').val() ? $('#clase_catego option:selected').val() : undefined;
    let vParams = getVisitorData();
    vParams = Object.keys(vParams).length ? JSON.stringify(vParams) : undefined;
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Contact/Modal',
        market: marketg,
        locale: localeg,
        cityIATA: city,
        countryIATA: country,
        visitorParams: vParams,
        d: '',
      },
      beforeSend() {
        dFrontJs.ibe_loading.open('body');
      },
      complete() {
        dFrontJs.ibe_loading.close('body');
      },
      success(data) {
        const $modalHtml = $($.parseHTML(data));
        const $h2 = $modalHtml.find('h2');
        const $table = $modalHtml.find('tbody');
        const $div = $modalHtml.find('div.hideAccessible');
        $mdlOff.find('h2').replaceWith($h2);
        $mdlOff.find('tbody').replaceWith($table);
        $mdlOff.find('div.hideAccessible').replaceWith($div);
        dFrontJs.ibe_modal.showModal('.inte-modal-office');
      },
    });
  }
});
