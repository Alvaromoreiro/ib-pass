// Header-New - Underline navigation menu
const body = $('body');
function headerNavigation() {
  if (body.attr('data-contentid') && quadrigam !== 'IBHMPA') {
    if (body.attr('data-contentid-parent') && body.attr('data-contentid-parent').length > 0) {
      $("[class='ibe-menu-new__list']").children().removeClass('ibe-menu-new__item--underline');
      $(`li[class='ibe-menu-new__item'] > a[data-open-menu-new='${body.attr('data-contentid-parent')}']`).parent().addClass('ibe-menu-new__item--underline');
    } else {
      const pageContentId = body.attr('data-contentid');
      $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl5m/BrowserCache300/GetNavigationParent',
          contentId: pageContentId,
          d: '',
        },
        success(data) {
          if (data.length > 0) {
            $("[class='ibe-menu-new__list']").children().removeClass('ibe-menu-new__item--underline');
            $(`li[class='ibe-menu-new__item'] > a[data-open-menu-new='${data}']`).parent().addClass('ibe-menu-new__item--underline');
          }
        },
      });
    }
  }
}
export default headerNavigation;
