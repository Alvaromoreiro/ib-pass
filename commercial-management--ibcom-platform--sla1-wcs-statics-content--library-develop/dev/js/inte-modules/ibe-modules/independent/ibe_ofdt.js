import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

if ($('#SearcherContent').data('url-quadrigam') === 'IBOFDT') {
  const $btnTabMosaic = $('[href="#tab-mosaic"]');
  const $btnTabList = $('[href="#tab-list"]');
  const btnshowMore = $('.inte-mosaicMore');
  const $table = $('.inte-tabOFDTContainer');
  const $mosaic = $('.inte-mosaicContainer');

  $('#country').change(() => {
    const IATASelected = $('#country option:selected').attr('data-city-select');
    mosaicShowMore(IATASelected);
    listOFDTShow(IATASelected);
  });
  if ($mosaic.length > 0) {
    $btnTabMosaic.on('click', (e) => {
      e.preventDefault();
      const IATASelected = $('#country option:selected').attr('data-city-select');
      if ($(`.ibe_mosaic__piece[data-ofdtcity=${IATASelected}].hidden`).length > 0) {
        btnshowMore.removeClass('hidden');
      }
      dFrontJs.ibe_tab.reloadAnimation();
    });
    $btnTabList.on('click', (e) => {
      e.preventDefault();
      btnshowMore.addClass('hidden');
    });
    btnshowMore.on('click', (e) => {
      e.preventDefault();
      mosaicShowMore($('#country option:selected').attr('data-city-select'));
    });
    mosaicShowMore($('#country option:selected').attr('data-city-select'));
  }
  if ($table.length > 0) {
    $btnTabList.on('click', () => {
      if (!$table.hasClass('loaded')) {
        $.ajax({
          encoding: 'UTF-8',
          method: 'GET',
          url: '/cs/Satellite',
          data: {
            pagename: 'IB_SE/CacheControl6h/BrowserCache3600/renderOFDTOffers',
            market: marketg,
            locale: localeg,
            infoOFDT: encodeURI($('[data-infoOFDT]').attr('data-infoOFDT')),
            view: 'table',
            d: 'Desktop',
          },
          complete() {
            dFrontJs.ibe_loading.close('.inte-tabOFDTContainer');
          },
          beforeSend() {
            dFrontJs.ibe_loading.open('.inte-tabOFDTContainer');
          },
          success(data) {
            let datatable;
            $('.inte-tabOFDTContainer').append(data);
            dFrontJs.ibe_datatable.init();
            datatable = $('table', $table);
            listOFDTShow($('#country option:selected').attr('data-city-select'));
            $table.addClass('loaded');
            $('#tab-list table').on('row-reordered', refreshTableColor);
            new $.fn.dataTable.ColReorder(datatable);
            // Change classes of visible cities
            datatable.on('draw.dt', refreshTableColor);
          },
        });
      }
    });
  }
}

function listOFDTShow(cityIATA) {
  const selector = cityIATA ? `.inte-ofdtListEl[data-ofdtcity=${cityIATA}]:hidden` : '.inte-ofdtListEl:hidden';
  const selectorActive = `.inte-ofdtListEl[data-ofdtcity!=${cityIATA}]`;
  let evenclass;
  if ($(selectorActive).length > 0) {
    $(selectorActive).addClass('hidden');
  }
  refreshTableColor(selector);
  $(selector).removeClass('hidden');
}

function mosaicShowMore(cityIATA) {
  const selector = cityIATA ? `.ibe_mosaic__piece[data-ofdtcity=${cityIATA}]:hidden` : '.ibe_mosaic__piece:hidden';
  const selectorActive = `.ibe_mosaic__piece[data-ofdtcity!=${cityIATA}].active`;
  if ($(selectorActive).length > 0) {
    $(selectorActive).addClass('hidden');
  }
  if (mosaicShowMore.designs == undefined) {
    mosaicShowMore.designs = initDesigns();
  }
  const { designs } = mosaicShowMore;
  const mosaicElements = $(selector);
  const list = mosaicElements.slice(0, 15);
  let e;
  for (let i = 0; i < list.length && i < 15; i++) {
    e = $(list[i]);
    e.removeClass('hidden');
    e.addClass(designs[list.length][i]);
    loadImage(e);
  }
  if (mosaicElements.length <= 15 || ($('[href="#tab-list"]').attr('aria-expanded') === 'true')) {
    $('.inte-mosaicMore').addClass('hidden');
  } else {
    $('.inte-mosaicMore').removeClass('hidden');
  }
  // Reload Animation
  setTimeout(() => {
    list.addClass('active');
  });

  function initDesigns() {
    const cls = {
      SINGLE: 'ibe_mosaic__piece--w-100 ibe_mosaic__piece--h-large',
      LARGE: 'ibe_mosaic__piece--w-50 ibe_mosaic__piece--h-large',
      MEDIUM: 'ibe_mosaic__piece--w-50 ibe_mosaic__piece--h-normal',
      SMALL: 'ibe_mosaic__piece--w-33 ibe_mosaic__piece--h-medium',
      XSMALL: 'XSMALL: ibe_mosaic__piece--w-25 ibe_mosaic__piece--h-small',
    };
    const mosaicDesigns = {
      1: [cls.SINGLE],
      2: [cls.LARGE, cls.LARGE],
      3: [cls.LARGE, cls.MEDIUM, cls.MEDIUM],
      4: [cls.LARGE, cls.LARGE, cls.MEDIUM,
        cls.MEDIUM],
      5: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM],
      6: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.SMALL, cls.SMALL, cls.SMALL],
      7: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM],
      8: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.SMALL,
        cls.SMALL, cls.SMALL],
      9: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.SMALL, cls.SMALL, cls.SMALL,
        cls.SMALL, cls.SMALL, cls.SMALL],
      10: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.SMALL, cls.SMALL,
        cls.SMALL],
      11: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.XSMALL, cls.XSMALL,
        cls.XSMALL, cls.XSMALL],
      12: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.SMALL,
        cls.SMALL, cls.SMALL, cls.XSMALL,
        cls.XSMALL, cls.XSMALL, cls.XSMALL],
      13: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.SMALL, cls.SMALL, cls.SMALL,
        cls.SMALL, cls.SMALL, cls.SMALL,
        cls.XSMALL, cls.XSMALL, cls.XSMALL,
        cls.XSMALL],
      14: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.SMALL, cls.SMALL,
        cls.SMALL, cls.XSMALL, cls.XSMALL,
        cls.XSMALL, cls.XSMALL],
      15: [cls.LARGE, cls.MEDIUM, cls.MEDIUM,
        cls.MEDIUM, cls.MEDIUM, cls.SMALL,
        cls.SMALL, cls.SMALL, cls.SMALL,
        cls.SMALL, cls.SMALL, cls.XSMALL,
        cls.XSMALL, cls.XSMALL, cls.XSMALL],
    };
    return mosaicDesigns;
  }

  function loadImage(el) {
    const resolution = window.screen.width;
    const divImg = el.find('[data-mosaicImg]');
    let src = divImg.attr('data-mosaicImg');
    if (divImg.parent().find("[inte-data-image='true']").length > 0) {
      if (resolution > 1023) {
        src = `${src}_2000_834.jpg`;
      } else if (resolution > 767) {
        src = `${src}_1023_400.jpg`;
      } else if (resolution > 479) {
        src = `${src}_958_332.jpg`;
      } else {
        src = `${src}_479_166.jpg`;
      }
    }

    divImg.attr('style', `background-image: url("${src}")`);
    divImg.removeAttr('data-mosaicImg');
    divImg.removeClass('hidden');
  }
}

function refreshTableColor(selector) {
  let elements; let
    evenclass;
  elements = (typeof selector === 'string') ? $(selector) : $('.inte-ofdtListEl:visible');
  if (elements.length > 0) {
    elements.removeClass('ibe-table__tbody-tr--even ibe-table__tbody-tr--odd');
    elements.each(function (index) {
      if (!$(this).hasClass('ibe-table__tbody-tr--odd') && !$(this).hasClass('ibe-table__tbody-tr--even')) {
        evenclass = ((index + 1) % 2 == 0) ? 'ibe-table__tbody-tr--even' : 'ibe-table__tbody-tr--odd';
        $(this).addClass(evenclass);
        $(this).attr('index', index);
      }
    });
  }
}
