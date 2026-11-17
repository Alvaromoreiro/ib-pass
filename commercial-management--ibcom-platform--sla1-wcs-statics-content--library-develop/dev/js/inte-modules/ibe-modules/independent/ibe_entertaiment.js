import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

// radiobuttonsTabs in Entertaiment.
function radioButtonsTabs(selector) {
  // const elements = $(selector);
  $(selector).each(function () {
    const $thisElem = $(this);
    const buttonsFilter = $thisElem.find('[data-show-hide]');
    const checkbox = $thisElem.find("input[type='checkbox']");
    const input = $thisElem.find("input[type='radio']");
    const inputChecked = $thisElem.find("input[type='radio']:checked");
    const datafromSpain = $thisElem.find("input[type='radio']").eq(0).data('info');
    const datatoSpain = $thisElem.find("input[type='radio']").eq(1).data('info');
    const fromSpain = $thisElem.find(`[data-id='${datafromSpain}']`);
    const toSpain = $thisElem.find(`[data-id='${datatoSpain}']`);
    let content = '';
    let active = '';
    if (inputChecked.length <= 0) {
      input.first().attr('checked', 'checked');
    }
    buttonsFilter.each(function ech() {
      $(this).click(() => {
        if ($('.GI_TW_Current').length > 0) {
          $('.GI_TW_Current').click();
        }
      });
    });
    checkbox.each(function eah() {
      $(this).click(() => {
        if ($('.GI_TW_Current').length > 0) {
          $('.GI_TW_Current').click();
        }
      });
    });
    input.each(function eac() {
      if ($(this).is(':checked')) {
        fromSpain.hide();
        toSpain.hide();
        active = $(this).attr('data-info');
        content = $thisElem.find(`[data-id='${active}']`);
        content.show();
      }
      $(this).click(function clk() {
        $('.GI_TW_Current').click();
        fromSpain.hide();
        toSpain.hide();
        active = $(this).attr('data-info');
        content = $thisElem.find(`[data-id='${active}']`);
        content.show();
      });
    });
  });
}
if ($("[data-function^='filter-tab']").length) {
  radioButtonsTabs("[data-function^='filter-tab']");
}
/**
 * @description Gets from WCS the tab chosen for the user and shows a loading in the meantime.
 * @returns ajax call and DOM edition.
 */
$('.ent-tab').on('click tabsactivate', function entab() {
  const $this = $(this);
  const idTab = $this.attr('href');
  if ($(idTab).children('form').length <= 0) {
    const tabId = idTab.replace('#', '');
    const category = $this.attr('data-category');
    $.ajax({
      method: 'GET',
      url: '/cs/Satellite',
      data: {
        pagename: 'IB_SE/CacheControl6h/BrowserCache3600/TabEntertaiment',
        market: marketg,
        locale: localeg,
        tabId,
        category: encodeURI(category),
        d: '',
      },
      beforeSend() {
        dFrontJs.ibe_loading.open(idTab);
      },
      success(data) {
        $(`[href='${idTab}']`).removeClass('ent-tab');
        $(idTab).html(data);
        initFilterTabs(tabId);
        filterTriggerTabs(tabId);
        dFrontJs.ibe_show_hide_element.init();
        dFrontJs.ibe_gallery.init(`[data-function='google-gallery-${tabId}']`);
      },
    });
  }
  $this.off('click tabsactivate', entab);
});
