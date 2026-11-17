import getVisitorData from './ibe_visitor-data';
import loadOfficeResults from '../manage/ibe_offices';
import retrieveGlobalVariables from './ibe_variables';
import {isLogado} from '../manage/ibe_logged-service';

const { localeg, marketg } = retrieveGlobalVariables();

/**
 * @description SEGMENTATION BY MARKET, LOCALE, LOGGED, ON BUSINESS.
 * @returns Dom modification through Ajax call.
 */
function dosegmentation() {
/**
 * @description Reload offices module when user is logged
 */
  function officesSegmentation() {
    if ($('#resultsoffice-foco').length > 0) {
      const city = $('.inte-select-spain option:selected').val() ? $('.inte-select-spain option:selected').val() : undefined;
      const country = $('.inte-select-countries option:selected').val() ? $('.inte-select-countries option:selected').val() : undefined;
      const vParams = getVisitorData();
      loadOfficeResults(city, country, vParams);
    }
  }
  if ($('[data-idforreco]').length) {
    const vParams = getVisitorData();
    const quadrigamExcpts = ["OBPOSTLOG"];
    if (Object.keys(vParams).length || quadrigamExcpts.indexOf(quadrigam) != -1) {
      const idReco = { info: [] };
      let obj = {};
      let inforeco;

      //Parametro de segmentación para criterio de usuario logado/anónimo
      vParams["logado"] = isLogado().userLogged.toString();

      $('[data-idforreco]').each(function loop() {
        inforeco = $(this).attr('data-info-reco');
        obj = (inforeco) ? JSON.parse(inforeco) : {};
        obj.id = $(this).attr('data-idforreco');
        obj.pageId = $('body').attr('data-contentid');
        idReco.info.push(obj);
      });
      $.ajax({
        encoding: 'UTF-8',
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl6h/BrowserCache3600/GetRecommendationsById',
          visitorParams: JSON.stringify(vParams),
          infoRecos: JSON.stringify(idReco),
          market: marketg,
          locale: localeg,
          d: '',
        },
        beforeSend() {
          $('[data-idforreco]').addClass('inte-loadingReco')
            .prepend(
              '<div data-loading="" class="ibe-loading__overlay inte-loadingReco">'
                        + '<div class="ibe-loading__spinner">'
                         + '<div class="ibe-loading__icon">'
                          + '<div class="circle"></div>'
                           + '<div class="circle"></div>'
                          + '</div>'
                          + '<div class="ibe-loading__text"></div>'
                        + '</div>'
                      + '</div>',
            );

          dFrontJs.ibe_loading.open('.inte-loadingReco');
        },
        error() {
          dFrontJs.ibe_loading.close('.inte-loadingReco');
        },
        success(data) {
          dFrontJs.ibe_loading.close('.inte-loadingReco');
          const $recoHTML = $.parseHTML(data);
          let auxid;
          let auxHTML;
          $recoHTML.forEach((el) => {
            auxid = $(el).attr('data-idforreco');
            $(`[data-idforreco=${auxid}]`).each(function loop() {
              auxHTML = el.innerHTML;
              if (auxHTML.length) {
                if ($(this).data('info-reco')) {
                  if ($(this).data('info-reco').render === 'CSE') {
                    $(this).html(auxHTML).attr('class', $(this).attr('class'));
                    if ($(this).hasClass('slick-initialized')) {
                      $(this).removeClass('slick-initialized');
                      dFrontJs.ibe_carousel.init();
                      dFrontJs.ibe_carousel.calculateHeightTitle();
                    }
                    window.requestAnimFrame(() => {
                      dFrontJs.ibe_carousel.calculateHeightTitle();
                    });
                  }
                } else {
                  $(this).replaceWith(auxHTML);
                  if ($(this).find('[class^="ibe-tab"]').length) {
                    dFrontJs.ibe_tab.init();
                    $('[data-tab="bootstrap-tabdrop"]').trigger('resize');
                    const $fcHeight = $(this).find('[data-fc-height]');
                    if ($fcHeight.length) {
                      $fcHeight.each(function loopHeight() {
                        dFrontJs.app.calculateHeightComponents($(this)[0], false);
                      });
                    }
                  }
                  if ($("[data-slick='carrousel-gift-cards']", data).length > 0) {
                    dFrontJs.ibe_slick_gift_cards.init();
                  }
                }
              }
            });
          });
          $('[data-idforreco]').each(function loop() {
            $(this).removeAttr('data-idforreco')
              .removeAttr('data-info-reco')
              .removeClass('inte-loadingReco');
          });
          if ($('img[data-src]', data).length > 0 || $('source[data-src]', data).length > 0) {
            dFrontJs.app.inviewFunction();
          }
          // Init Accordion dada has any
          if ($('.ibe-accordion', data).length > 0) {
            dFrontJs.ibe_accordion.init();
            dFrontJs.ibe_bootstrap_collapse.init();
          }
          // Init Accordion dada has any
          if ($('.modal-link', data).length > 0) {
            dFrontJs.modalFunction.init();
          }
          // dispatch an event on document's body
          $(document.body).trigger('segmentationLoaded');
        },
      });
    }
  }
  if (isLogado().userLogged === true) {
    officesSegmentation();
  }
}
export default dosegmentation;
