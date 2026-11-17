import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

/**
 * @description Gets from WCS more news to show after the user clicks in the plus icon.
 * @returns ajax call and DOM edition.
 */
$('#button-news').click(() => {
  let current = $('#more-news').attr('data-current');
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/CacheControl6h/BrowserCache1800/getNews',
      market: marketg,
      locale: localeg,
      current,
      d: '',
    },
    beforeSend() {
      $('#button-news').blur();
      dFrontJs.ibe_loading.open('#divMore');
    },
    success(data) {
      const $morenews = $('#more-news');
      $morenews.append(data);
      let max = $morenews.attr('data-max');
      let numNews = 8;
      max = parseInt(max);
      current = parseInt(current);
      if (max - current < numNews) {
        numNews = max - current;
      }
      current += numNews;
      $morenews.attr('data-current', current);
      if (max <= current) {
        $('#divMore').remove();
      }
      if ($('img[data-src]', data).length > 0) {
        dFrontJs.app.inviewFunction();
      }
      dFrontJs.ibe_box_ellipsis.init();
      dFrontJs.ibe_loading.close('#divMore');
    },
  });
});
