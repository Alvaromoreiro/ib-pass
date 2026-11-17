import retrieveGlobalVariables from '../general/ibe_variables';
import { redirectByQuadrigam } from '../general/ibe_inte-util';

const { localeg, marketg } = retrieveGlobalVariables();
/**
 * @description Get Partner detail from Ajax Call
 * @returns Dom modification through ajax.
 */
function eventCard(e) {
  e.preventDefault();
  const idPartner = $(this).attr('href').split('#')[1];
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Partner/Detail',
      cid: idPartner,
      c: 'Partner_C',
      market: marketg,
      locale: localeg,
      d: '',
    },
    beforeSend() {
      $('.inte-partner-box').blur();
      dFrontJs.ibe_scrollTop.scrollId('#title-results');
      dFrontJs.ibe_loading.open('#partners-cards');
    },
    success(data) {
      $('#more-partners').remove();
      $('#title-results').remove();
      dFrontJs.ibe_loading.close();
      $('#partners-cards').replaceWith(data);
      dFrontJs.ibe_bootstrap_collapse.init();
      dFrontJs.modalFunction.init();
      dFrontJs.ibe_modal.init();
      dFrontJs.ibe_dateFormat.init();
    },
  });
}
const loadMorePartners = () => {
  let $counter = $('#counterpartners');
  let current = $counter.attr('data-current');
  const quadrigam = $counter.attr('data-quadrigam');
  const country = $counter.attr('data-country');
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache1800/Partner/Results',
      current,
      country,
      category: quadrigam,
      locale: localeg,
      market: marketg,
      d: '',
    },
    beforeSend() {
      $('#button-partners').blur();
      dFrontJs.ibe_loading.open('#more-partners');
    },
    success(data) {
      $counter.remove();
      $('.inte-partner-box').off('click', eventCard);
      dFrontJs.ibe_loading.close('#more-partners');
      $('#partners-cards').append(data);
      $counter = $('#counterpartners');
      $('.inte-partner-box').on('click', eventCard);
      let max = $counter.attr('data-max');
      current = $counter.attr('data-current');
      max = max != null ? parseInt(max, 10) : 0;
      current = current != null ? parseInt(current, 10) : 0;
      if (max <= current) {
        $('#more-partners').remove();
      }
      dFrontJs.ibe_box_ellipsis.init();
      dFrontJs.ibe_loading.close();
    },
  });
};

function submittypesubtype(e) {
  e.preventDefault();
  // if( $("[data-valid-cl] [required]")){
  const $this = $(this);
  const inputs = $this.find('[required]');
  inputs.each(function loop() {
    const $in = $(this);
    if (!$in.val()) {
      $in.closest('.ibe_form__group').addClass('ibe_form__group--error');
      $in.closest('.ibe_form__group').find('[data-validate-text]').each(function errorLoop() {
        $(this).removeClass('hidden');
        $(this).html($(this).data('validate-text'));
      });
    } else {
      $in.closest('.ibe_form__group').has('[data-validate-text]:visible').removeClass('ibe_form__group--error');
      if ($in.closest('.ibe_form__group').find('[data-validate-text]').length) {
        $in.addClass('hidden');
      }
    }
  });
  if ($('.inte-typesubtypeForm').find('.ibe_form__group--error').length <= 0) {
    $('.inte-typesubtypeForm').off('submit', submittypesubtype);
    $this.submit();
  }
}


// Partners Results
if ($('#counterpartners').attr('data-max') > 8) {
  $('#more-partners').removeClass('hidden');
}
$('.inte-partner-box').on('click', eventCard);
$('#button-partners').click(loadMorePartners);

// Submit form partner validation-form
$('.inte-typesubtypeForm').on('submit', submittypesubtype);

// enlace -a- data-logadoZero=hazteIberiaPlusIBZeroButton  -- redirect to upgrade
if ($('[data-logadoZero=hazteIberiaPlusIBZeroButton]').length > 0) {
  $('[data-logadoZero=hazteIberiaPlusIBZeroButton]').click(() => {
    redirectByQuadrigam(marketg, localeg, 'IRUPG');
  });
}
