$(document).ready(() => {
  if ($('[data-debug]').length > 0) {
    

    if ($('[data-journey="parent"]').length > 0) {
      dFrontJs.ibe_journey.init();
    }

    if ($('[data-autocomplete="airports"]').length > 0) {
      var getJson = $.ajax({
        dataType: 'json',
        url: 'js/dev/response.json',
        success: function (data) {
          dFrontJs.ibe_autocomplete.init('[data-autocomplete="airports"]', data.airports);
        },
      });
    }
  
    // // Load more news
		// var show = '[data-show-more]';
		// var $show = $(show);
		// if ($show.length > 0) {
		// 	var container = $show.data('show-more');
		// 	var actives = $show.data('show-more-init');
		// 	var number = $show.data('show-more-number');
		// 	var total = actives;
		// 	$('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '), [data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
		// 		// Animation complete.
		// 	});
		// 	$('[data-show-more-button="' + container + '"]').on('click', function () {
		// 		firstShowValue = total;
		// 		total = total + number;
		// 		$('[data-show-more="' + container + '"] li:nth-child(-n+' + total + '),[data-show-more="' + container + '"]>div:nth-child(-n+' + total + ')').slideDown('slow', function () {
		// 			// Animation complete.
		// 			if ($(this).index() === firstShowValue) {
		// 				scroll({
		// 					top: this.offsetTop,
		// 					behavior: "smooth"
		// 				});
		// 			}
		// 		});
		// 	});
		// }
    // IGNORE THIS JUST SIMULATES THE FILTERS
    $('.ibe-filter__main-item').on('click', ()=>{
      $('.ibe-grid__feature:nth-child(2) > div').attr("style", "display: none !important");
      $('.ibe-grid__feature:nth-child(13) > div').attr("style", "display: none !important");
    })
    // IGNORE THIS JUST SIMULATES THE FILTERS


    const isMobile = window.innerWidth < 768;
    const cardContainer = $(".ibe-card-container");
    const container = cardContainer.attr("data-show-more");
		const actives = cardContainer.attr("data-show-more-init"); //cantidad inicial que muestra
		const activesMobile = cardContainer.attr("data-show-more-init-mobile"); //cantidad inicial que muestra
		const number = cardContainer.attr("data-show-more-number"); //cantidad de card que se muestra al hacer clik
		const numberMobile = cardContainer.attr("data-show-more-number-mobile"); //cantidad de card que se muestra al hacer clik
    const total = parseInt(isMobile ? activesMobile : actives);
    let hiddenItems = 0; 
    let timesAddedMore = 0;
    let firstShowValue = 0;
    const showDesiredCards = () => {
      let hiddenItems = checkForHiddenItems();
      let desiredCards = parseInt(total) + (parseInt(total) * timesAddedMore) + hiddenItems
      let showableCards = document.querySelectorAll("[data-show-more] li:nth-child(-n+" + desiredCards + ")")
      let unshowableCards = $("[data-show-more] li:nth-child(n+" + (desiredCards+1) + ")")
      showableCards.forEach((card, i) => {
        let div = card.querySelector("div")

        const computedStyle = window.getComputedStyle(div);
          
        if (computedStyle.display !== 'none') {
          $(card).css(
          "display",
          "list-item"
        );
        } else{
          $(card).css(
            "display",
            "none"
          );
        }
      });
      unshowableCards.css("display", "none");
     
    };

    const checkForHiddenItems = () => {
      let hiddenItemCount = 0;
        let desiredCards = parseInt(total) + (parseInt(total) * timesAddedMore)
      const cardElements = document.querySelectorAll('.ibe-grid__feature:nth-child(-n+' + desiredCards + ')');
      cardElements.forEach(cardElement => {
          if (checkForHiddenItem(cardElement)) {
              hiddenItemCount++;
          }
      });
      
      const extraHiddenCards = $(cardElements).last().nextAll("*:lt("+hiddenItemCount+")")
      if(extraHiddenCards.length > 0) {
        extraHiddenCards.toArray().forEach(cardElement => {
            if (checkForHiddenItem(cardElement)) {
                hiddenItemCount++;
            }
        });
      }
      hiddenItems = hiddenItemCount;
      return hiddenItemCount;
    };
    const checkForHiddenItem = (cardElement) =>{
        const itemElement = cardElement.querySelector('div');
        const computedStyle = window.getComputedStyle(itemElement);
        return (computedStyle.display === 'none')
        
    }
    if(container.length > 0) {
      showDesiredCards();
      $('.ibe-filter__main-item').on('click', showDesiredCards)
      $('.ibe-one-option__list-item').on('click', showDesiredCards)
			$('[data-show-more-button="' + container + '"]').on('click', function () {
				firstShowValue = parseInt(total) + (parseInt(total) * timesAddedMore) + hiddenItems;
        timesAddedMore++;
				let newTotal = firstShowValue + parseInt(isMobile ? numberMobile : number) + hiddenItems;
        $('[data-show-more="' + container + '"] li:nth-child(-n+' + newTotal + ')').slideDown('slow', function () {
          // Animation complete
          if($('[data-show-more] li').length <= newTotal){
            $('[data-show-more-button="' + container + '"]').hide();
          }
          if ($(this).index() === firstShowValue) {
            scroll({
              top: this.offsetTop,
              behavior: "smooth"
            });
          }

        });
        showDesiredCards();
			});
    }
    // locationsMap = [
    // 	{
    // 		"id": "1476391160540",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'>	<img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MERCADILLOSYPOPUPS.JPG'	 alt='Mercadillos y pop ups'></figure><div class='ibe-card-guides__body 	 fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'>	 <span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras test	 </span><a href='javascript:void(0)' title='Mercadillos test' data-modal='button' data-modal-view='#activity_modal_1476391160540' class='ibe-card-guides__title--link'>	 <span class='title title__h3 ibe-card-guides__title--icon'>Mercadillos y pop test</span>	 </a></div></div><div class='ibe-card-guides__footer'> <a href='#' id='TAB2_activity_del_1476391160540' title='Eliminar plan 1'  class='link link__regular link__regular--important ibe-card-guides__link-delete activity_action'>Eliminar plan</a>  <a href='#' id='TAB2_activity_add_1476391160540' onClick=addActivityMap('TAB2_activity_add_1476391160540_map') title='Agregar plan' class='link link__regular link__regular--important ibe-card-guides__link-add activity_action'>Agregar plan 1</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercadillos y pop ups 2",
    // 		"long": "-3.69844",
    // 		"locate": 83,
    // 		"modal": "#activity_modal_1476391160540",
    // 		"lat": "40.42414"
    // 	},
    // 	{
    // 		"id": "1476391160699",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MERCADOECOLOGICOHOYODEMANZANARES.JPG' alt='Mercado Ecológico y Artesano de Hoyo del Manzanares'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Mercado Ecológico y Artesano de Hoyo del Manzanares 2' data-modal='button' data-modal-view='#activity_modal_1476391160699' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercado Ecológico y Artesano de Hoyo del Manzanares 2</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160699' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160699' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercado Ecológico y Artesano de Hoyo del Manzanares 2",
    // 		"long": "-3.90707",
    // 		"locate": 84,
    // 		"modal": "#activity_modal_1476391160699",
    // 		"lat": "40.62250"
    // 	},
    // 	{
    // 		"id": "1476391160827",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_RASTRODEANTIGUEDADES.JPG' alt='Rastro de Antigüedades de Navacerrada'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Rastro de Antigüedades de Navacerrada 2' data-modal='button' data-modal-view='#activity_modal_1476391160827' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rastro de Antigüedades de Navacerrada 2</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160827' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160827' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rastro de Antigüedades de Navacerrada 2",
    // 		"long": "-4.01622",
    // 		"locate": 85,
    // 		"modal": "#activity_modal_1476391160827",
    // 		"lat": "40.72867"
    // 	},
    // 	{
    // 		"id": "1476391160955",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_LASROZASVILLAGE.JPG' alt='Las Rozas Village'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Las Rozas Village 2' data-modal='button' data-modal-view='#activity_modal_1476391160955' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Las Rozas Village 2</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160955' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160955' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Las Rozas Village",
    // 		"long": "-3.90181",
    // 		"locate": 86,
    // 		"modal": "#activity_modal_1476391160955",
    // 		"lat": "40.52087"
    // 	},
    // 	{
    // 		"id": "1476391161101",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONACENTRO.JPG' alt='Zona centro: artesanía popular'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona centro: artesanía popular 2' data-modal='button' data-modal-view='#activity_modal_1476391161101' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona centro: artesanía popular 2</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161101' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161101' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona centro: artesanía popular ",
    // 		"long": "-3.70728",
    // 		"locate": 87,
    // 		"modal": "#activity_modal_1476391161101",
    // 		"lat": "40.40700"
    // 	},
    // 	{
    // 		"id": "1476391161101",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONACENTRO.JPG' alt='Zona centro: artesanía popular'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona centro: artesanía popular 2' data-modal='button' data-modal-view='#activity_modal_1476391161101' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona centro: artesanía popular 2</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161101' title='Eliminar plan' class='link link__regular link__regular--important ibe-card-guides__link-delete activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161101' title='Agregar plan' class='link link__regular link__regular--important ibe-card-guides__link-add activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona centro: artesanía popular",
    // 		"long": "-3.70411",
    // 		"locate": 88,
    // 		"modal": "#activity_modal_1476391161101",
    // 		"lat": "40.42671"
    // 	}
    // ];

    // locationsMap1 = [
    // 	{
    // 		"id": "1476391160540",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MERCADILLOSYPOPUPS.JPG' alt='Mercadillos y pop ups'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Mercadillos y pop ups 2' data-modal='button' data-modal-view='#activity_modal_1476391160540' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercadillos y pop ups</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160540' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160540' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercadillos y pop ups 2",
    // 		"long": "-3.69844",
    // 		"locate": 83,
    // 		"modal": "#activity_modal_1476391160540",
    // 		"lat": "40.42414"
    // 	},
    // 	{
    // 		"id": "1476391160699",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MERCADOECOLOGICOHOYODEMANZANARES.JPG' alt='Mercado Ecológico y Artesano de Hoyo del Manzanares'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Mercado Ecológico y Artesano de Hoyo del Manzanares2' data-modal='button' data-modal-view='#activity_modal_1476391160699' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercado Ecológico y Artesano de Hoyo del Manzanares</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160699' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160699' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercado Ecológico y Artesano de Hoyo del Manzanares 2",
    // 		"long": "-3.90707",
    // 		"locate": 84,
    // 		"modal": "#activity_modal_1476391160699",
    // 		"lat": "40.62250"
    // 	},
    // 	{
    // 		"id": "1476391160827",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_RASTRODEANTIGUEDADES.JPG' alt='Rastro de Antigüedades de Navacerrada'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Rastro de Antigüedades de Navacerrada 2' data-modal='button' data-modal-view='#activity_modal_1476391160827' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rastro de Antigüedades de Navacerrada</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160827' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160827' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rastro de Antigüedades de Navacerrada 2",
    // 		"long": "-4.01622",
    // 		"locate": 85,
    // 		"modal": "#activity_modal_1476391160827",
    // 		"lat": "40.72867"
    // 	},
    // 	{
    // 		"id": "1476391160955",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_LASROZASVILLAGE.JPG' alt='Las Rozas Village'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Las Rozas Village 2' data-modal='button' data-modal-view='#activity_modal_1476391160955' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Las Rozas Village</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391160955' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391160955' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Las Rozas Village 2",
    // 		"long": "-3.90181",
    // 		"locate": 86,
    // 		"modal": "#activity_modal_1476391160955",
    // 		"lat": "40.52087"
    // 	},
    // 	{
    // 		"id": "1476391161101",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONACENTRO.JPG' alt='Zona centro: artesanía popular'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona centro: artesanía popular' data-modal='button' data-modal-view='#activity_modal_1476391161101' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona centro: artesanía popular</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161101' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161101' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona centro: artesanía popular",
    // 		"long": "-3.70728",
    // 		"locate": 87,
    // 		"modal": "#activity_modal_1476391161101",
    // 		"lat": "40.40700"
    // 	},
    // 	{
    // 		"id": "1476391161101",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONACENTRO.JPG' alt='Zona centro: artesanía popular'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona centro: artesanía popular' data-modal='button' data-modal-view='#activity_modal_1476391161101' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona centro: artesanía popular</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161101' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161101' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona centro: artesanía popular",
    // 		"long": "-3.70411",
    // 		"locate": 88,
    // 		"modal": "#activity_modal_1476391161101",
    // 		"lat": "40.42671"
    // 	},
    // 	{
    // 		"id": "1476391161101",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONACENTRO.JPG' alt='Zona centro: artesanía popular'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona centro: artesanía popular' data-modal='button' data-modal-view='#activity_modal_1476391161101' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona centro: artesanía popular</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161101' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161101' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona centro: artesanía popular",
    // 		"long": "-3.54891",
    // 		"locate": 89,
    // 		"modal": "#activity_modal_1476391161101",
    // 		"lat": "40.40404"
    // 	},
    // 	{
    // 		"id": "1476391161279",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_ZONATRIBALL.JPG' alt='Zona Triball'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Zona Triball' data-modal='button' data-modal-view='#activity_modal_1476391161279' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Zona Triball</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161279' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161279' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Zona Triball",
    // 		"long": "-3.70379",
    // 		"locate": 90,
    // 		"modal": "#activity_modal_1476391161279",
    // 		"lat": "40.41677"
    // 	},
    // 	{
    // 		"id": "1476391161403",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MILLADEORO.JPG' alt='Milla de Oro'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Milla de Oro' data-modal='button' data-modal-view='#activity_modal_1476391161403' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Milla de Oro</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161403' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161403' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Milla de Oro",
    // 		"long": "-3.68721",
    // 		"locate": 91,
    // 		"modal": "#activity_modal_1476391161403",
    // 		"lat": "40.42519"
    // 	},
    // 	{
    // 		"id": "1476391161403",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_COMPRAS_MILLADEORO.JPG' alt='Milla de Oro'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--yellow'>Compras</span><a href='javascript:void(0)' title='Milla de Oro' data-modal='button' data-modal-view='#activity_modal_1476391161403' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Milla de Oro</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161403' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161403' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "yellow",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Milla de Oro",
    // 		"long": "-3.68696",
    // 		"locate": 92,
    // 		"modal": "#activity_modal_1476391161403",
    // 		"lat": "40.43221"
    // 	},
    // 	{
    // 		"id": "1476391161539",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_ESQUIENMADRID.JPG' alt='Esquí en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Esquí en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391161539' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Esquí en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161539' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161539' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Esquí en Madrid",
    // 		"long": "-3.92155",
    // 		"locate": 93,
    // 		"modal": "#activity_modal_1476391161539",
    // 		"lat": "40.27833"
    // 	},
    // 	{
    // 		"id": "1476391161539",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_ESQUIENMADRID.JPG' alt='Esquí en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Esquí en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391161539' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Esquí en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161539' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161539' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Esquí en Madrid",
    // 		"long": "-4.01354",
    // 		"locate": 94,
    // 		"modal": "#activity_modal_1476391161539",
    // 		"lat": "40.76099"
    // 	},
    // 	{
    // 		"id": "1476391161539",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_ESQUIENMADRID.JPG' alt='Esquí en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Esquí en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391161539' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Esquí en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161539' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161539' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Esquí en Madrid",
    // 		"long": "-3.77262",
    // 		"locate": 95,
    // 		"modal": "#activity_modal_1476391161539",
    // 		"lat": "40.46561"
    // 	},
    // 	{
    // 		"id": "1476391161687",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_SIERRAOESTE.JPG' alt='Sierra Oeste: avistamiento de aves'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Sierra Oeste: avistamiento de aves' data-modal='button' data-modal-view='#activity_modal_1476391161687' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Sierra Oeste: avistamiento de aves</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161687' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161687' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Sierra Oeste: avistamiento de aves",
    // 		"long": "-3.69528",
    // 		"locate": 96,
    // 		"modal": "#activity_modal_1476391161687",
    // 		"lat": "40.78600"
    // 	},
    // 	{
    // 		"id": "1476391161687",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_SIERRAOESTE.JPG' alt='Sierra Oeste: avistamiento de aves'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Sierra Oeste: avistamiento de aves' data-modal='button' data-modal-view='#activity_modal_1476391161687' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Sierra Oeste: avistamiento de aves</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161687' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161687' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Sierra Oeste: avistamiento de aves",
    // 		"long": "-3.95",
    // 		"locate": 97,
    // 		"modal": "#activity_modal_1476391161687",
    // 		"lat": "40.85"
    // 	},
    // 	{
    // 		"id": "1476391161687",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_SIERRAOESTE.JPG' alt='Sierra Oeste: avistamiento de aves'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Sierra Oeste: avistamiento de aves' data-modal='button' data-modal-view='#activity_modal_1476391161687' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Sierra Oeste: avistamiento de aves</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161687' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161687' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Sierra Oeste: avistamiento de aves",
    // 		"long": "-4.27436",
    // 		"locate": 98,
    // 		"modal": "#activity_modal_1476391161687",
    // 		"lat": "40.35249"
    // 	},
    // 	{
    // 		"id": "1476391161835",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_PAINTBALLYBARBACOAENVALDEMORILLO.JPG' alt='Paintball y barbacoa en Valdemorillo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Paintball y barbacoa en Valdemorillo' data-modal='button' data-modal-view='#activity_modal_1476391161835' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Paintball y barbacoa en Valdemorillo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161835' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161835' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Paintball y barbacoa en Valdemorillo",
    // 		"long": "-4.06346",
    // 		"locate": 99,
    // 		"modal": "#activity_modal_1476391161835",
    // 		"lat": "40.50707"
    // 	},
    // 	{
    // 		"id": "1476391161959",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_RASCAFRIA.JPG' alt='Rascafría'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Rascafría' data-modal='button' data-modal-view='#activity_modal_1476391161959' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rascafría</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161959' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161959' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rascafría",
    // 		"long": "-3.96701",
    // 		"locate": 100,
    // 		"modal": "#activity_modal_1476391161959",
    // 		"lat": "40.81905"
    // 	},
    // 	{
    // 		"id": "1476391161959",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_RASCAFRIA.JPG' alt='Rascafría'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Rascafría' data-modal='button' data-modal-view='#activity_modal_1476391161959' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rascafría</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391161959' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391161959' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rascafría",
    // 		"long": "-3.85606",
    // 		"locate": 101,
    // 		"modal": "#activity_modal_1476391161959",
    // 		"lat": "40.91615"
    // 	},
    // 	{
    // 		"id": "1476391162095",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_EMBALSEDELATAZAR.JPG' alt='Embalse de El Atazar'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Embalse de El Atazar' data-modal='button' data-modal-view='#activity_modal_1476391162095' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Embalse de El Atazar</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162095' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162095' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Embalse de El Atazar",
    // 		"long": "-3.47305",
    // 		"locate": 102,
    // 		"modal": "#activity_modal_1476391162095",
    // 		"lat": "40.91"
    // 	},
    // 	{
    // 		"id": "1476391162219",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_LAPEDRIZA.JPG' alt='La Pedriza del Manzanares - Reserva de la Biosfera'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='La Pedriza del Manzanares - Reserva de la Biosfera' data-modal='button' data-modal-view='#activity_modal_1476391162219' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>La Pedriza del Manzanares - Reserva de la Biosfera</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162219' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162219' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "La Pedriza del Manzanares - Reserva de la Biosfera",
    // 		"long": "-3.86504",
    // 		"locate": 103,
    // 		"modal": "#activity_modal_1476391162219",
    // 		"lat": "40.69110"
    // 	},
    // 	{
    // 		"id": "1476391162343",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_PIRAGUISMOENELEMBALSEDELOZOYA.JPG' alt='Piragüismo en el Embalse de Lozoya'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Piragüismo en el Embalse de Lozoya' data-modal='button' data-modal-view='#activity_modal_1476391162343' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Piragüismo en el Embalse de Lozoya</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162343' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162343' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Piragüismo en el Embalse de Lozoya",
    // 		"long": "-3.79685",
    // 		"locate": 104,
    // 		"modal": "#activity_modal_1476391162343",
    // 		"lat": "40.93925"
    // 	},
    // 	{
    // 		"id": "1476391162473",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_RUTAACABALLO.JPG' alt='Ruta a caballo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Ruta a caballo' data-modal='button' data-modal-view='#activity_modal_1476391162473' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Ruta a caballo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162473' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162473' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Ruta a caballo",
    // 		"long": "-3.88378",
    // 		"locate": 105,
    // 		"modal": "#activity_modal_1476391162473",
    // 		"lat": "40.86989"
    // 	},
    // 	{
    // 		"id": "1476391162710",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_PUERTODESOMOSIERRA.JPG' alt='Puerto de Somosierra'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Puerto de Somosierra' data-modal='button' data-modal-view='#activity_modal_1476391162710' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Puerto de Somosierra</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162710' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162710' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Puerto de Somosierra",
    // 		"long": "-3.6",
    // 		"locate": 106,
    // 		"modal": "#activity_modal_1476391162710",
    // 		"lat": "41.15"
    // 	},
    // 	{
    // 		"id": "1476391162834",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_AIRELIBRE_VIASVERDESDELTAJUNA.JPG' alt='Vías Verdes del Tajuña'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Vías Verdes del Tajuña' data-modal='button' data-modal-view='#activity_modal_1476391162834' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Vías Verdes del Tajuña</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162834' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162834' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "blue",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Vías Verdes del Tajuña",
    // 		"long": "-3.34950",
    // 		"locate": 107,
    // 		"modal": "#activity_modal_1476391162834",
    // 		"lat": "40.22633"
    // 	},
    // 	{
    // 		"id": "1476391162970",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESPARAIRCONNINOS.JPG' alt='Restaurantes para ir con niños'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes para ir con niños' data-modal='button' data-modal-view='#activity_modal_1476391162970' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes para ir con niños</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162970' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162970' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes para ir con niños",
    // 		"long": "-3.68869",
    // 		"locate": 108,
    // 		"modal": "#activity_modal_1476391162970",
    // 		"lat": "40.48822"
    // 	},
    // 	{
    // 		"id": "1476391162970",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESPARAIRCONNINOS.JPG' alt='Restaurantes para ir con niños'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes para ir con niños' data-modal='button' data-modal-view='#activity_modal_1476391162970' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes para ir con niños</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162970' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162970' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes para ir con niños",
    // 		"long": "-3.88150",
    // 		"locate": 109,
    // 		"modal": "#activity_modal_1476391162970",
    // 		"lat": "40.44498"
    // 	},
    // 	{
    // 		"id": "1476391162970",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESPARAIRCONNINOS.JPG' alt='Restaurantes para ir con niños'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes para ir con niños' data-modal='button' data-modal-view='#activity_modal_1476391162970' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes para ir con niños</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391162970' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391162970' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes para ir con niños",
    // 		"long": "-3.89655",
    // 		"locate": 110,
    // 		"modal": "#activity_modal_1476391162970",
    // 		"lat": "40.40290"
    // 	},
    // 	{
    // 		"id": "1476391163255",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_VINOSDEMADRID.JPG' alt='Vinos de Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Vinos de Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163255' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Vinos de Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163255' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163255' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Vinos de Madrid",
    // 		"long": "-3.56298",
    // 		"locate": 111,
    // 		"modal": "#activity_modal_1476391163255",
    // 		"lat": "40.05491"
    // 	},
    // 	{
    // 		"id": "1476391163379",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_BRUNCHENMADRID.JPG' alt='Brunch en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Brunch en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163379' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Brunch en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163379' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163379' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Brunch en Madrid",
    // 		"long": "-3.70733",
    // 		"locate": 112,
    // 		"modal": "#activity_modal_1476391163379",
    // 		"lat": "40.42610"
    // 	},
    // 	{
    // 		"id": "1476391163379",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_BRUNCHENMADRID.JPG' alt='Brunch en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Brunch en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163379' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Brunch en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163379' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163379' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Brunch en Madrid",
    // 		"long": "-3.6954",
    // 		"locate": 113,
    // 		"modal": "#activity_modal_1476391163379",
    // 		"lat": "40.41541"
    // 	},
    // 	{
    // 		"id": "1476391163379",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_BRUNCHENMADRID.JPG' alt='Brunch en Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Brunch en Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163379' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Brunch en Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163379' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163379' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Brunch en Madrid",
    // 		"long": "-3.69889",
    // 		"locate": 114,
    // 		"modal": "#activity_modal_1476391163379",
    // 		"lat": "40.41547"
    // 	},
    // 	{
    // 		"id": "1476391163527",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RUTADETAPAS.JPG' alt='Rutas de Tapas'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Rutas de Tapas' data-modal='button' data-modal-view='#activity_modal_1476391163527' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rutas de Tapas</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163527' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163527' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rutas de Tapas",
    // 		"long": "-3.70739",
    // 		"locate": 115,
    // 		"modal": "#activity_modal_1476391163527",
    // 		"lat": "40.41536"
    // 	},
    // 	{
    // 		"id": "1476391163527",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RUTADETAPAS.JPG' alt='Rutas de Tapas'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Rutas de Tapas' data-modal='button' data-modal-view='#activity_modal_1476391163527' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rutas de Tapas</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163527' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163527' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rutas de Tapas",
    // 		"long": "-3.70876",
    // 		"locate": 116,
    // 		"modal": "#activity_modal_1476391163527",
    // 		"lat": "40.41128"
    // 	},
    // 	{
    // 		"id": "1476391163527",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RUTADETAPAS.JPG' alt='Rutas de Tapas'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Rutas de Tapas' data-modal='button' data-modal-view='#activity_modal_1476391163527' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Rutas de Tapas</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163527' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163527' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Rutas de Tapas",
    // 		"long": "-3.71317",
    // 		"locate": 117,
    // 		"modal": "#activity_modal_1476391163527",
    // 		"lat": "40.43442"
    // 	},
    // 	{
    // 		"id": "1476391163676",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCENTENARIOS.JPG' alt='Restaurantes Centenarios'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes Centenarios' data-modal='button' data-modal-view='#activity_modal_1476391163676' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes Centenarios</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163676' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163676' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes Centenarios",
    // 		"long": "-3.69228",
    // 		"locate": 118,
    // 		"modal": "#activity_modal_1476391163676",
    // 		"lat": "40.42237"
    // 	},
    // 	{
    // 		"id": "1476391163676",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCENTENARIOS.JPG' alt='Restaurantes Centenarios'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes Centenarios' data-modal='button' data-modal-view='#activity_modal_1476391163676' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes Centenarios</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163676' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163676' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes Centenarios",
    // 		"long": "-3.70182",
    // 		"locate": 119,
    // 		"modal": "#activity_modal_1476391163676",
    // 		"lat": "40.42378"
    // 	},
    // 	{
    // 		"id": "1476391163676",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCENTENARIOS.JPG' alt='Restaurantes Centenarios'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes Centenarios' data-modal='button' data-modal-view='#activity_modal_1476391163676' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes Centenarios</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163676' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163676' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes Centenarios",
    // 		"long": "-3.71238",
    // 		"locate": 120,
    // 		"modal": "#activity_modal_1476391163676",
    // 		"lat": "40.41528"
    // 	},
    // 	{
    // 		"id": "1476391163826",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_MERCADOSDEMADRID.JPG' alt='Mercados de Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Mercados de Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163826' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercados de Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163826' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163826' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercados de Madrid",
    // 		"long": "-3.68565",
    // 		"locate": 121,
    // 		"modal": "#activity_modal_1476391163826",
    // 		"lat": "40.42775"
    // 	},
    // 	{
    // 		"id": "1476391163826",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_MERCADOSDEMADRID.JPG' alt='Mercados de Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Mercados de Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163826' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercados de Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163826' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163826' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercados de Madrid",
    // 		"long": "-3.70923",
    // 		"locate": 122,
    // 		"modal": "#activity_modal_1476391163826",
    // 		"lat": "40.41553"
    // 	},
    // 	{
    // 		"id": "1476391163826",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_MERCADOSDEMADRID.JPG' alt='Mercados de Madrid'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Mercados de Madrid' data-modal='button' data-modal-view='#activity_modal_1476391163826' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Mercados de Madrid</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391163826' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391163826' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Mercados de Madrid",
    // 		"long": "-3.69766",
    // 		"locate": 123,
    // 		"modal": "#activity_modal_1476391163826",
    // 		"lat": "40.42208"
    // 	},
    // 	{
    // 		"id": "1476391164000",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCONESTRELLAMICHELIN.JPG' alt='Restaurantes con estrella Michelín'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes con estrella Michelín' data-modal='button' data-modal-view='#activity_modal_1476391164000' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes con estrella Michelín</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164000' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164000' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes con estrella Michelín",
    // 		"long": "-3.68578",
    // 		"locate": 124,
    // 		"modal": "#activity_modal_1476391164000",
    // 		"lat": "40.45819"
    // 	},
    // 	{
    // 		"id": "1476391164000",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCONESTRELLAMICHELIN.JPG' alt='Restaurantes con estrella Michelín'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes con estrella Michelín' data-modal='button' data-modal-view='#activity_modal_1476391164000' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes con estrella Michelín</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164000' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164000' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes con estrella Michelín",
    // 		"long": "-3.72573",
    // 		"locate": 125,
    // 		"modal": "#activity_modal_1476391164000",
    // 		"lat": "40.42996"
    // 	},
    // 	{
    // 		"id": "1476391164000",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_RESTAURANTESCONESTRELLAMICHELIN.JPG' alt='Restaurantes con estrella Michelín'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Restaurantes con estrella Michelín' data-modal='button' data-modal-view='#activity_modal_1476391164000' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Restaurantes con estrella Michelín</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164000' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164000' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Restaurantes con estrella Michelín",
    // 		"long": "-3.69641",
    // 		"locate": 126,
    // 		"modal": "#activity_modal_1476391164000",
    // 		"lat": "40.42463"
    // 	},
    // 	{
    // 		"id": "1476391164148",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_PLATEA.JPG' alt='Platea'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='Platea' data-modal='button' data-modal-view='#activity_modal_1476391164148' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Platea</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164148' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164148' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Platea",
    // 		"long": "-3.68894",
    // 		"locate": 127,
    // 		"modal": "#activity_modal_1476391164148",
    // 		"lat": "40.42574"
    // 	},
    // 	{
    // 		"id": "1476391164272",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_GASTRONOMIA_LACUPULA.JPG' alt='La Cúpula (Alcalá de Henares). '></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--green'>Gastronomía</span><a href='javascript:void(0)' title='La Cúpula (Alcalá de Henares). ' data-modal='button' data-modal-view='#activity_modal_1476391164272' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>La Cúpula (Alcalá de Henares). </span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164272' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164272' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "green",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "La Cúpula (Alcalá de Henares). ",
    // 		"long": "-3.36707",
    // 		"locate": 128,
    // 		"modal": "#activity_modal_1476391164272",
    // 		"lat": "40.48313"
    // 	},
    // 	{
    // 		"id": "1476391164396",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_TELEFERICO.JPG' alt='Teleférico de la Casa de Campo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Teleférico de la Casa de Campo' data-modal='button' data-modal-view='#activity_modal_1476391164396' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Teleférico de la Casa de Campo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164396' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164396' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Teleférico de la Casa de Campo",
    // 		"long": "-3.72168",
    // 		"locate": 129,
    // 		"modal": "#activity_modal_1476391164396",
    // 		"lat": "40.42884"
    // 	},
    // 	{
    // 		"id": "1476391164396",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_TELEFERICO.JPG' alt='Teleférico de la Casa de Campo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Teleférico de la Casa de Campo' data-modal='button' data-modal-view='#activity_modal_1476391164396' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Teleférico de la Casa de Campo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164396' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164396' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Teleférico de la Casa de Campo",
    // 		"long": "-3.66850",
    // 		"locate": 130,
    // 		"modal": "#activity_modal_1476391164396",
    // 		"lat": "40.39667"
    // 	},
    // 	{
    // 		"id": "1476391164532",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_PARQUEWARNER.JPG' alt='Parque Warner, Parque de Atracciones, Zoo y Faunia'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Parque Warner, Parque de Atracciones, Zoo y Faunia' data-modal='button' data-modal-view='#activity_modal_1476391164532' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Parque Warner, Parque de Atracciones, Zoo y Faunia</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164532' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164532' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Parque Warner, Parque de Atracciones, Zoo y Faunia",
    // 		"long": "-3.59337",
    // 		"locate": 131,
    // 		"modal": "#activity_modal_1476391164532",
    // 		"lat": "40.23029"
    // 	},
    // 	{
    // 		"id": "1476391164532",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_PARQUEWARNER.JPG' alt='Parque Warner, Parque de Atracciones, Zoo y Faunia'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Parque Warner, Parque de Atracciones, Zoo y Faunia' data-modal='button' data-modal-view='#activity_modal_1476391164532' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Parque Warner, Parque de Atracciones, Zoo y Faunia</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164532' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164532' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Parque Warner, Parque de Atracciones, Zoo y Faunia",
    // 		"long": "-3.61153",
    // 		"locate": 132,
    // 		"modal": "#activity_modal_1476391164532",
    // 		"lat": "40.39292"
    // 	},
    // 	{
    // 		"id": "1476391164532",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_PARQUEWARNER.JPG' alt='Parque Warner, Parque de Atracciones, Zoo y Faunia'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Parque Warner, Parque de Atracciones, Zoo y Faunia' data-modal='button' data-modal-view='#activity_modal_1476391164532' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Parque Warner, Parque de Atracciones, Zoo y Faunia</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164532' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164532' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Parque Warner, Parque de Atracciones, Zoo y Faunia",
    // 		"long": "-3.76101",
    // 		"locate": 133,
    // 		"modal": "#activity_modal_1476391164532",
    // 		"lat": "40.40324"
    // 	},
    // 	{
    // 		"id": "1476391164680",
    // 		"content": "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/CMADRID/CMADRID_OCIO_TRADICIONFUTBOLERA.JPG' alt='Tradición futbolera. Museo del Real Madrid,  Atlético de Madrid y otros equipos.'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--orange'>Ocio</span><a href='javascript:void(0)' title='Tradición futbolera. Museo del Real Madrid,  Atlético de Madrid y otros equipos.' data-modal='button' data-modal-view='#activity_modal_1476391164680' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Tradición futbolera. Museo del Real Madrid,  Atlético de Madrid y otros equipos.</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476391164680' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476391164680' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
    // 		"icon": "orange",
    // 		"categoria": "[Que ver, Que hacer]",
    // 		"title": "Tradición futbolera. Museo del Real Madrid,  Atlético de Madrid y otros equipos.",
    // 		"long": "-3.70379",
    // 		"locate": 134,
    // 		"modal": "#activity_modal_1476391164680",
    // 		"lat": "40.41677"
    // 	}
    // ]

    // positionMap = {
    // 	lat: 40.41677,
	 	// 	long: -3.70379
    // }

    // positionMap1 = {
    // 	lat: 40.41500,
	 	// 	long: -3.72155
    // }

    // let size = "big"; //small - medium -big
    // let size1 = "medium"; //small - medium -big
  
    // if($('[data-google-map]').length > 0) {
    // 	// dFrontJs.ibe_google_map.init("dvMap2",locationsMap1, 12, positionMap, size);
    // 	dFrontJs.ibe_google_map.init("dvMap",locationsMap, 12, positionMap, size);
    // }

    // // let timeout;
    // // timeout = setTimeout(alertFunc, 3000);

    // function alertFunc() {
    // 	console.log('Se ejecutara el update de mapa');
    // 	dFrontJs.ibe_google_map.update("dvMap",locationsMap1, 10, positionMap1, size1);
    // }
		
    // // Cambiar data marker
    // let newArrayData = [];
    // $('[data-card-guides] .ibe-card-guides__footer a').on('click', function(){
    // 	var cardItem=$(this).closest('[data-card-guides]');
    // 	var cardItemId= cardItem.attr('id');
    // 	if(cardItemId && cardItemId != ""){
    // 	newArrayData =  dFrontJs.ibe_google_map.changeDataMaker('dvMap',locationsMap, 10, positionMap1, size1, cardItemId, 'add');
    // 	console.log('newArrayData1', newArrayData);
    // 	}
    // });
    //   let timeoute;
    //   timeoute = setTimeout(
    //   	changeOptionCard('1476391160540'), 10000);

    // function changeOptionCard(cardItemId) {
    // 	newArrayData = dFrontJs.ibe_google_map.changeDataMaker('dvMap',locationsMap, 10, positionMap1, size1, cardItemId, 'delete')
    // 	console.log('newArrayData2', newArrayData);
    // }
		

    cities_default3 = [
      {
        'code': 'ES_COMM_AREA_SPAIN',
        'description': 'España',
        'cities': [
          {
            'code': 'LCG',
            'description': 'A Coruña',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ABC',
            'description': 'Albacete',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
        ],
      },
    ];

    cities_default2 = [{
      'code': 'MA',
      'description': 'Marruecos',
      'cities': [{
        'code': 'CAS',
        'description': 'Casablanca (CAS), Marruecos',
        'country': {'code': 'MA', 'description': 'Marruecos'},
        'locationId': 'STA_MA_Casabla',
      }, {
        'code': 'RAK',
        'description': 'Marrakech (RAK), Marruecos',
        'country': {'code': 'MA', 'description': 'Marruecos'},
        'locationId': 'STA_MA_Marrake',
      }, {
        'code': 'TNG',
        'description': 'Tánger (TNG), Marruecos',
        'country': {'code': 'MA', 'description': 'Marruecos'},
        'locationId': 'CITY_TNG_MA',
      }],
    }, {
      'code': 'ES_COMM_AREA_SPAIN',
      'description': 'España',
      'cities': [{
        'code': 'ALC',
        'description': 'Alicante - Benidorm (ALC), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Benidor',
      }, {
        'code': 'ALC',
        'description': 'Alicante - Provincia de Alicante (ALC), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'RegEsAlicant367',
      }, {
        'code': 'LEI',
        'description': 'Almería (LEI), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_LEI_ES',
      }, {
        'code': 'LEI',
        'description': 'Almería (LEI), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsAnCosta436',
      }, {
        'code': 'BCN',
        'description': 'Baqueira Beret (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsBaqueir378',
      }, {
        'code': 'BCN',
        'description': 'Barcelona (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_BCN_ES',
      }, {
        'code': 'BCN',
        'description': 'Barcelona - Costa de Barcelona (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsBarcelo041',
      }, {
        'code': 'AGP',
        'description': 'Benalmádena (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Benalma',
      }, {
        'code': 'BIO',
        'description': 'Bilbao (BIO), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_BIO_ES',
      }, {
        'code': 'BCN',
        'description': 'Costa Brava (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsCaGiron448',
      }, {
        'code': 'BCN',
        'description': 'Costa Dorada (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsTarrago495',
      }, {
        'code': 'ACE',
        'description': 'Costa Teguise (ACE), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'NBH_ES_CostaTe',
      }, {
        'code': 'XRY',
        'description': 'Cádiz - Provincia de Cádiz (XRY), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_XRY_ES',
      }, {
        'code': 'SVQ',
        'description': 'Córdoba (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_ODB_ES',
      }, {
        'code': 'AGP',
        'description': 'Estepona (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Estepon',
      }, {
        'code': 'FUE',
        'description': 'Fuerteventura (FUE), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_FUE_ES',
      }, {
        'code': 'LPA',
        'description': 'Gran Canaria (LPA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_GranCan',
      }, {
        'code': 'GRX',
        'description': 'Granada (GRX), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsGranada727',
      }, {
        'code': 'GRX',
        'description': 'Granada - Provinicia de Granada (GRX), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_GRX_ES',
      }, {
        'code': 'GRX',
        'description': 'Granada - Sierra Nevada (GRX), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'REG_ES_SierraN',
      }, {
        'code': 'IBZ',
        'description': 'Ibiza (IBZ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_IBZ_ES',
      }, {
        'code': 'SVQ',
        'description': 'Isla Canela (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsIslaCan605',
      }, {
        'code': 'SVQ',
        'description': 'Isla Cristina (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsIslaCri854',
      }, {
        'code': 'SVQ',
        'description': 'Islantilla (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Islanti',
      }, {
        'code': 'LCG',
        'description': 'La Coruña (LCG), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_LCG_ES',
      }, {
        'code': 'SPC',
        'description': 'La Palma (SPC), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsAnLaPal662',
      }, {
        'code': 'ACE',
        'description': 'Lanzarote (ACE), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_ACE_ES',
      }, {
        'code': 'LPA',
        'description': 'Las Palmas (LPA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_LPA_ES',
      }, {
        'code': 'LEN',
        'description': 'León (LEN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_LEN_ES',
      }, {
        'code': 'ILD',
        'description': 'Lérida (ILD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsLerida161',
      }, {
        'code': 'MAD',
        'description': 'Madrid (MAD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'STA_ES_Madrid',
      }, {
        'code': 'MAD',
        'description': 'Madrid - Aeropuerto (MAD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsMadridA962',
      }, {
        'code': 'MAD',
        'description': 'Madrid Capital (MAD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsMadridC634',
      }, {
        'code': 'PMI',
        'description': 'Mallorca (PMI), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsMallorc379',
      }, {
        'code': 'LPA',
        'description': 'Maspalomas (LPA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'NBH_ES_Maspalo',
      }, {
        'code': 'MAH',
        'description': 'Menorca (MAH), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_MAH_ES',
      }, {
        'code': 'AGP',
        'description': 'Málaga (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_AGP_ES',
      }, {
        'code': 'AGP',
        'description': 'Málaga - Marbella (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Marbell',
      }, {
        'code': 'AGP',
        'description': 'Málaga - Provincia de Málaga (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'REG_ES_CostaDe',
      }, {
        'code': 'AGP',
        'description': 'Málaga - Torremolinos (AGP), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_UTL_ES',
      }, {
        'code': 'SVQ',
        'description': 'Novo Sancti Petri (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsNovoSan240',
      }, {
        'code': 'OVD',
        'description': 'Oviedo (OVD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CIT_ES_Oviedo',
      }, {
        'code': 'PNA',
        'description': 'Pamplona (PNA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_PNA_ES',
      }, {
        'code': 'ACE',
        'description': 'Playa Blanca (ACE), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'NBH_ES_PlayaBl',
      }, {
        'code': 'IBZ',
        'description': 'Playa d en Bossa (IBZ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsSpPlaya568',
      }, {
        'code': 'IBZ',
        'description': "Playa d'en Bossa (IBZ), España",
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsSpPlaya568',
      }, {
        'code': 'LPA',
        'description': 'Playa del Ingles (LPA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsPlayade094',
      }, {
        'code': 'LPA',
        'description': 'Playa del Inglés (LPA), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsPlayade094',
      }, {
        'code': 'VGO',
        'description': 'Pontevedra (VGO), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsPonteve616',
      }, {
        'code': 'BCN',
        'description': 'PortAventura (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsPortAve859',
      }, {
        'code': 'ACE',
        'description': 'Puerto del Carmen (ACE), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'NBH_ES_Puertod',
      }, {
        'code': 'BCN',
        'description': 'Pyrenees - Catalunya (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsPyrenee482',
      }, {
        'code': 'SLM',
        'description': 'Salamanca (SLM), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_SLM_ES',
      }, {
        'code': 'EAS',
        'description': 'San Sebastián (EAS), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'REG_ES_SanSeba',
      }, {
        'code': 'SDR',
        'description': 'Santander (SDR), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_SDR_ES',
      }, {
        'code': 'SCQ',
        'description': 'Santiago de Compostela (SCQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsSantiag734',
      }, {
        'code': 'SVQ',
        'description': 'Sevilla (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_SVQ_ES',
      }, {
        'code': 'SVQ',
        'description': 'Sevilla - Provincia de Sevilla (SVQ), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsAnSevil658',
      }, {
        'code': 'BCN',
        'description': 'Sitges (BCN), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsSitges191',
      }, {
        'code': 'PMI',
        'description': 'Sóller (PMI), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsSoller193',
      }, {
        'code': 'TCI',
        'description': 'Tenerife (TCI), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_TCI_ES',
      }, {
        'code': 'MAD',
        'description': 'Toledo (MAD), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CitEsToledo183',
      }, {
        'code': 'VLC',
        'description': 'Valencia (VLC), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_VLC_ES',
      }, {
        'code': 'VLC',
        'description': 'Valencia - Provincia de Valencia (VLC), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'StaEsCoCosta108',
      }, {
        'code': 'VGO',
        'description': 'Vigo City (VGO), España',
        'country': {'code': 'ES', 'description': 'España'},
        'locationId': 'CITY_VGO_ES',
      }],
    }, {
      'code': 'ES_COMM_AREA_EUROPE',
      'description': 'Europa',
      'cities': [{
        'code': 'ABZ',
        'description': 'Aberdeen (ABZ), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_ABZ_GB',
      }, {
        'code': 'FAO',
        'description': 'Albufeira (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtAlbufei487',
      }, {
        'code': 'FAO',
        'description': 'Algarve (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'REG_PT_Algarve',
      }, {
        'code': 'GVA',
        'description': 'Alpes Franceses (GVA), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'REG_FR_FrenchA',
      }, {
        'code': 'FAO',
        'description': 'Alvor (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtAlvor096',
      }, {
        'code': 'NAP',
        'description': 'Amalfi (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CIT_IT_Amalfi',
      }, {
        'code': 'TLS',
        'description': 'Arinsal (TLS), Andorra',
        'country': {'code': 'AD', 'description': 'Andorra'},
        'locationId': 'CitAdArinsal263',
      }, {
        'code': 'LON',
        'description': 'Ascot (LON), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CitGbAscot059',
      }, {
        'code': 'ATH',
        'description': 'Atenas (ATH), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_ATH_GR',
      }, {
        'code': 'ATH',
        'description': 'Atenas - Costa de Atenas (ATH), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'StaGrGrAthen377',
      }, {
        'code': 'STR',
        'description': 'Baden Baden (STR), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'REG_DE_BadenBa',
      }, {
        'code': 'BRI',
        'description': 'Bari (BRI), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_Apulia',
      }, {
        'code': 'EAP',
        'description': 'Basilea (EAP), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'REG_CH_Basel',
      }, {
        'code': 'BIA',
        'description': 'Bastia (BIA), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_BIA_FR',
      }, {
        'code': 'BRS',
        'description': 'Bath (BRS), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CIT_GB_Bath',
      }, {
        'code': 'BFS',
        'description': 'Belfast (BFS), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'STA_GB_Belfast',
      }, {
        'code': 'SZG',
        'description': 'Berchtesgaden (SZG), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'poiDeBerchte888',
      }, {
        'code': 'BGO',
        'description': 'Bergen (BGO), Noruega',
        'country': {'code': 'NO', 'description': 'Noruega'},
        'locationId': 'CitNoBergen168',
      }, {
        'code': 'BER',
        'description': 'Berlín (BER), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'STA_DE_Berlin',
      }, {
        'code': 'BIQ',
        'description': 'Biarritz (BIQ), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_BIQ_FR',
      }, {
        'code': 'BHX',
        'description': 'Birmingham (BHX), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_BHX_GB',
      }, {
        'code': 'BLQ',
        'description': 'Bologna City (BLQ), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItBologna752',
      }, {
        'code': 'BLQ',
        'description': 'Bolonia (BLQ), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_BLQ_IT',
      }, {
        'code': 'CGN',
        'description': 'Bonn (CGN), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CitDeBonn950',
      }, {
        'code': 'LYS',
        'description': 'Borgoña (LYS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'REG_FR_Burgund',
      }, {
        'code': 'PAR',
        'description': 'Bretaña y Normandía (PAR), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'REG_FR_Brittan',
      }, {
        'code': 'BDS',
        'description': 'Brindisi (BDS), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_BDS_IT',
      }, {
        'code': 'BRS',
        'description': 'Bristol (BRS), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_BRS_GB',
      }, {
        'code': 'BRU',
        'description': 'Bruselas (BRU), Bélgica',
        'country': {'code': 'BE', 'description': 'Bélgica'},
        'locationId': 'CITY_BRU_BE',
      }, {
        'code': 'BUH',
        'description': 'Bucarest (BUH), Rumania',
        'country': {'code': 'RO', 'description': 'Rumania'},
        'locationId': 'CITY_BUH_RO',
      }, {
        'code': 'BUD',
        'description': 'Budapest (BUD), Hungría',
        'country': {'code': 'HU', 'description': 'Hungría'},
        'locationId': 'STA_HU_Budapest',
      }, {
        'code': 'BOD',
        'description': 'Burdeos (BOD), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_BOD_FR',
      }, {
        'code': 'CAG',
        'description': 'Cagliari (CAG), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_CAG_IT',
      }, {
        'code': 'TLS',
        'description': 'Canillo (TLS), Andorra',
        'country': {'code': 'AD', 'description': 'Andorra'},
        'locationId': 'CitAdCanillo255',
      }, {
        'code': 'NCE',
        'description': 'Cannes (NCE), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_CEQ_FR',
      }, {
        'code': 'CCF',
        'description': 'Carcassonne (CCF), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_CCF_FR',
      }, {
        'code': 'CWL',
        'description': 'Cardiff (CWL), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_CWL_GB',
      }, {
        'code': 'FAO',
        'description': 'Carvoeiro (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtCarvoei518',
      }, {
        'code': 'LCA',
        'description': 'Chipre (LCA), Chipre',
        'country': {'code': 'CY', 'description': 'Chipre'},
        'locationId': 'COUNTRY_CY',
      }, {
        'code': 'CGN',
        'description': 'Colonia (CGN), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CITY_CGN_DE',
      }, {
        'code': 'CPH',
        'description': 'Copenhague (CPH), Dinamarca',
        'country': {'code': 'DK', 'description': 'Dinamarca'},
        'locationId': 'CITY_CPH_DK',
      }, {
        'code': 'CFU',
        'description': 'Corfú (CFU), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'REG_GR_Corfu',
      }, {
        'code': 'ORK',
        'description': 'Cork (ORK), Irlanda',
        'country': {'code': 'IE', 'description': 'Irlanda'},
        'locationId': 'CITY_ORK_IE',
      }, {
        'code': 'KGS',
        'description': 'Cos (KGS), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_KGS_GR',
      }, {
        'code': 'NCE',
        'description': "Cote d'Azur (NCE), Francia",
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'StaFrFrFrenc583',
      }, {
        'code': 'KRK',
        'description': 'Cracovia (KRK), Polonia',
        'country': {'code': 'PL', 'description': 'Polonia'},
        'locationId': 'STA_PL_Krakow',
      }, {
        'code': 'GVA',
        'description': 'Crans Montana (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CitChCransMo840',
      }, {
        'code': 'HER',
        'description': 'Creta (HER), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'REG_GR_Crete',
      }, {
        'code': 'BOD',
        'description': 'Dordogne (BOD), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CitFrDordogn386',
      }, {
        'code': 'DRS',
        'description': 'Dresde (DRS), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CITY_DRS_DE',
      }, {
        'code': 'DUB',
        'description': 'Dublín (DUB), Irlanda',
        'country': {'code': 'IE', 'description': 'Irlanda'},
        'locationId': 'STA_IE_Dublin',
      }, {
        'code': 'DBV',
        'description': 'Dubrovnik (DBV), Croacia',
        'country': {'code': 'HR', 'description': 'Croacia'},
        'locationId': 'CITY_DBV_HR',
      }, {
        'code': 'DUS',
        'description': 'Dusseldorf (DUS), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'REG_DE_Dusseld',
      }, {
        'code': 'ATH',
        'description': 'Eastern Peloponnese (ATH), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CitGrPelopon190',
      }, {
        'code': 'EDI',
        'description': 'Edimburgo (EDI), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'STA_GB_Edinbur',
      }, {
        'code': 'SVX',
        'description': 'Ekaterimburgo (SVX), Rusia',
        'country': {'code': 'RU', 'description': 'Rusia'},
        'locationId': 'CITY_SVX_RU',
      }, {
        'code': 'DUB',
        'description': 'Enniskerry (DUB), Irlanda',
        'country': {'code': 'IE', 'description': 'Irlanda'},
        'locationId': 'PlcIeEnniske623',
      }, {
        'code': 'STO',
        'description': 'Estocolmo (STO), Suecia',
        'country': {'code': 'SE', 'description': 'Suecia'},
        'locationId': 'CITY_STO_SE',
      }, {
        'code': 'FAO',
        'description': 'Faro (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtFaro972',
      }, {
        'code': 'FLR',
        'description': 'Florencia (FLR), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_FLR_IT',
      }, {
        'code': 'FRA',
        'description': 'Frankfurt (FRA), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CITY_FRA_DE',
      }, {
        'code': 'GVA',
        'description': 'Geneva (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CitChGeneva153',
      }, {
        'code': 'GOA',
        'description': 'Genoa (GOA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItGenoa063',
      }, {
        'code': 'GIB',
        'description': 'Gibraltar (GIB), Gibraltar (Reino Unido)',
        'country': {'code': 'GI', 'description': 'Gibraltar (Reino Unido)'},
        'locationId': 'CITY_GIB_GI',
      }, {
        'code': 'GVA',
        'description': 'Ginebra (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CITY_GVA_CH',
      }, {
        'code': 'GLA',
        'description': 'Glasgow (GLA), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_GLA_GB',
      }, {
        'code': 'GOT',
        'description': 'Gotemburgo (GOT), Suecia',
        'country': {'code': 'SE', 'description': 'Suecia'},
        'locationId': 'REG_SE_Gothenb',
      }, {
        'code': 'GVA',
        'description': 'Gstaad (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CitChGstaad151',
      }, {
        'code': 'SKG',
        'description': 'Halkidiki (SKG), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CIT_GR_Halkidi',
      }, {
        'code': 'HAM',
        'description': 'Hamburgo (HAM), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'STA_DE_Hamburg',
      }, {
        'code': 'HAJ',
        'description': 'Hanóver (HAJ), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'REG_DE_Hanover',
      }, {
        'code': 'HEL',
        'description': 'Helsinki (HEL), Finlandia',
        'country': {'code': 'FI', 'description': 'Finlandia'},
        'locationId': 'CITY_HEL_FI',
      }, {
        'code': 'HER',
        'description': 'Heraclión (HER), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_HER_GR',
      }, {
        'code': 'NAP',
        'description': 'Isla de Ischia (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_ISH_IT',
      }, {
        'code': 'JER',
        'description': 'Jersey (JER), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_JER_GB',
      }, {
        'code': 'KLX',
        'description': 'Kalamata (KLX), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_KLX_GR',
      }, {
        'code': 'KGD',
        'description': 'Kaliningrad (KGD), Rusia',
        'country': {'code': 'RU', 'description': 'Rusia'},
        'locationId': 'CITY_KGD_RU',
      }, {
        'code': 'KZN',
        'description': 'Kazán (KZN), Rusia',
        'country': {'code': 'RU', 'description': 'Rusia'},
        'locationId': 'CITY_KZN_RU',
      }, {
        'code': 'EFL',
        'description': 'Kefalonia (EFL), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_EFL_GR',
      }, {
        'code': 'IEV',
        'description': 'Kiev (IEV), Ucrania',
        'country': {'code': 'UA', 'description': 'Ucrania'},
        'locationId': 'CITY_IEV_UA',
      }, {
        'code': 'ORK',
        'description': 'Kinsale (ORK), Irlanda',
        'country': {'code': 'IE', 'description': 'Irlanda'},
        'locationId': 'CitIeKinsale269',
      }, {
        'code': 'KGS',
        'description': 'Kos (KGS), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_KGS_GR',
      }, {
        'code': 'MIL',
        'description': 'Lago Maggiore (MIL), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_LakeMag',
      }, {
        'code': 'BUD',
        'description': 'Lago de Balatón (BUD), Hungría',
        'country': {'code': 'HU', 'description': 'Hungría'},
        'locationId': 'CitHuLakeBal723',
      }, {
        'code': 'MIL',
        'description': 'Lago de Como (MIL), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_LakeCom',
      }, {
        'code': 'VRN',
        'description': 'Lago de Garda (VRN), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_LakeGar',
      }, {
        'code': 'FAO',
        'description': 'Lagos (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtLagos082',
      }, {
        'code': 'LCA',
        'description': 'Larnaca (LCA), Chipre',
        'country': {'code': 'CY', 'description': 'Chipre'},
        'locationId': 'STA_CY_Larnaca',
      }, {
        'code': 'LBA',
        'description': 'Leeds (LBA), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'StaGbEnLeeds783',
      }, {
        'code': 'LIL',
        'description': 'Lille (LIL), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_LIL_FR',
      }, {
        'code': 'LCA',
        'description': 'Limassol (LCA), Chipre',
        'country': {'code': 'CY', 'description': 'Chipre'},
        'locationId': 'STA_CY_Limassol',
      }, {
        'code': 'LIS',
        'description': 'Lisboa (LIS), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CITY_LIS_PT',
      }, {
        'code': 'LIS',
        'description': 'Lisboa - Costa de Lisboa (LIS), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtLisbonA636',
      }, {
        'code': 'LON',
        'description': 'Londres (LON), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_LON_GB',
      }, {
        'code': 'LON',
        'description': 'Londres - Centro de Londres (LON), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'RegGbCentral946',
      }, {
        'code': 'BRU',
        'description': 'Lovaina (BRU), Bélgica',
        'country': {'code': 'BE', 'description': 'Bélgica'},
        'locationId': 'CIT_BE_Leuven',
      }, {
        'code': 'LUX',
        'description': 'Luxemburgo (LUX), Luxemburgo',
        'country': {'code': 'LU', 'description': 'Luxemburgo'},
        'locationId': 'COUNTRY_LU',
      }, {
        'code': 'LYS',
        'description': 'Lyon (LYS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_LYS_FR',
      }, {
        'code': 'FNC',
        'description': 'Madeira (FNC), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'STA_PT_Madeira',
      }, {
        'code': 'FNC',
        'description': 'Madeira - Funchal (FNC), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CITY_FNC_PT',
      }, {
        'code': 'VRN',
        'description': 'Madonna di Campiglio (VRN), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItMadonna493',
      }, {
        'code': 'CPH',
        'description': 'Malmö (CPH), Suecia',
        'country': {'code': 'SE', 'description': 'Suecia'},
        'locationId': 'CitSeMalmo070',
      }, {
        'code': 'MLA',
        'description': 'Malta (MLA), Malta',
        'country': {'code': 'MT', 'description': 'Malta'},
        'locationId': 'COUNTRY_MT',
      }, {
        'code': 'MAN',
        'description': 'Manchester (MAN), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'STA_GB_Greater',
      }, {
        'code': 'MAM',
        'description': 'Mancagua (MAM), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'STA_GB_Greater',
      }, {
        'code': 'MRS',
        'description': 'Marsella (MRS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_MRS_FR',
      }, {
        'code': 'MIL',
        'description': 'Milán (MIL), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_MIL_IT',
      }, {
        'code': 'DBV',
        'description': 'Montenegro (DBV), Croacia',
        'country': {'code': 'HR', 'description': 'Croacia'},
        'locationId': 'CitHrMontene624',
      }, {
        'code': 'MOW',
        'description': 'Moscú (MOW), Rusia',
        'country': {'code': 'RU', 'description': 'Rusia'},
        'locationId': 'CITY_MOW_RU',
      }, {
        'code': 'MUC',
        'description': 'Múnich (MUC), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'REG_DE_Munich',
      }, {
        'code': 'NTE',
        'description': 'Nantes (NTE), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_NTE_FR',
      }, {
        'code': 'NCL',
        'description': 'Newcastle (NCL), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'StaGbEnNewca186',
      }, {
        'code': 'NCE',
        'description': 'Niza (NCE), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_NCE_FR',
      }, {
        'code': 'NAP',
        'description': 'Nápoles (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_NAP_IT',
      }, {
        'code': 'NAP',
        'description': 'Nápoles - Costa Nápoles (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_AmalfiC',
      }, {
        'code': 'NAP',
        'description': 'Nápoles - Península de Sorrento (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_RRO_IT',
      }, {
        'code': 'NUE',
        'description': 'Núremberg (NUE), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CITY_NUE_DE',
      }, {
        'code': 'OLB',
        'description': 'Olbia (OLB), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_OLB_IT',
      }, {
        'code': 'OPO',
        'description': 'Oporto (OPO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtPortoAr553',
      }, {
        'code': 'OSL',
        'description': 'Oslo (OSL), Noruega',
        'country': {'code': 'NO', 'description': 'Noruega'},
        'locationId': 'STA_NO_Oslo',
      }, {
        'code': 'LON',
        'description': 'PORTSMOUTH (LON), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_PME_GB',
      }, {
        'code': 'PAR',
        'description': 'París (PAR), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_PAR_FR',
      }, {
        'code': 'PAR',
        'description': 'París - Disneyland París (PAR), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'NbhFrDisneyl298',
      }, {
        'code': 'TLS',
        'description': 'Pas de la Casa (TLS), Andorra',
        'country': {'code': 'AD', 'description': 'Andorra'},
        'locationId': 'CitAdPasdela751',
      }, {
        'code': 'KLX',
        'description': 'Peloponeso (KLX), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'StaGrPelopon627',
      }, {
        'code': 'TLS',
        'description': 'Pirineos (TLS), Andorra',
        'country': {'code': 'AD', 'description': 'Andorra'},
        'locationId': 'REG_AD_Pyrenee',
      }, {
        'code': 'PSA',
        'description': 'Pisa (PSA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CIT_IT_Pisa',
      }, {
        'code': 'GOA',
        'description': 'Portofino (GOA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'PlcItPortofi532',
      }, {
        'code': 'NAP',
        'description': 'Positano (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'resItPositan428',
      }, {
        'code': 'PRG',
        'description': 'Praga (PRG), República Checa',
        'country': {'code': 'CZ', 'description': 'República Checa'},
        'locationId': 'CITY_PRG_CZ',
      }, {
        'code': 'PVK',
        'description': 'Preveza (PVK), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'STA_GR_Preveza',
      }, {
        'code': 'LCA',
        'description': 'Protaras (LCA), Chipre',
        'country': {'code': 'CY', 'description': 'Chipre'},
        'locationId': 'StaCyCyProta102',
      }, {
        'code': 'MRS',
        'description': 'Provenza (MRS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'REG_FR_Provenc',
      }, {
        'code': 'PUY',
        'description': 'Pula (PUY), Croacia',
        'country': {'code': 'HR', 'description': 'Croacia'},
        'locationId': 'CITY_PUY_HR',
      }, {
        'code': 'FAO',
        'description': 'Quarteira (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtQuartei522',
      }, {
        'code': 'FAO',
        'description': 'Quinta do Lago (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtQuintad900',
      }, {
        'code': 'NAP',
        'description': 'Ravello (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItRavello298',
      }, {
        'code': 'REK',
        'description': 'Reikiavik (REK), Islandia',
        'country': {'code': 'IS', 'description': 'Islandia'},
        'locationId': 'STA_IS_Reykjav',
      }, {
        'code': 'RIX',
        'description': 'Riga (RIX), Letonia',
        'country': {'code': 'LV', 'description': 'Letonia'},
        'locationId': 'STA_LV_Riga',
      }, {
        'code': 'RHO',
        'description': 'Rodas (RHO), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_RHO_GR',
      }, {
        'code': 'ROM',
        'description': 'Roma (ROM), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_ROM_IT',
      }, {
        'code': 'RVN',
        'description': 'Rovaniemi (RVN), Finlandia',
        'country': {'code': 'FI', 'description': 'Finlandia'},
        'locationId': 'CitFiRovanie497',
      }, {
        'code': 'RTM',
        'description': 'Róterdam (RTM), Holanda',
        'country': {'code': 'NL', 'description': 'Holanda'},
        'locationId': 'CITY_RTM_NL',
      }, {
        'code': 'FAO',
        'description': 'Sagres (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtSagres193',
      }, {
        'code': 'SZG',
        'description': 'Salzburg (SZG), Austria',
        'country': {'code': 'AT', 'description': 'Austria'},
        'locationId': 'CitAtSalzbur407',
      }, {
        'code': 'SZG',
        'description': 'Salzburg City (SZG), Austria',
        'country': {'code': 'AT', 'description': 'Austria'},
        'locationId': 'STA_AT_Salzburg',
      }, {
        'code': 'LED',
        'description': 'San Petersburgo (LED), Rusia',
        'country': {'code': 'RU', 'description': 'Rusia'},
        'locationId': 'REG_RU_StPeter',
      }, {
        'code': 'SKG',
        'description': 'Sani (SKG), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CitGrSani964',
      }, {
        'code': 'JTR',
        'description': 'Santorini (JTR), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_JTR_GR',
      }, {
        'code': 'CTA',
        'description': 'Sicilia (CTA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'REG_IT_Sicily',
      }, {
        'code': 'CTA',
        'description': 'Sicilia - Catania (CTA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_CTA_IT',
      }, {
        'code': 'PMO',
        'description': 'Sicilia - Palermo (PMO), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_PMO_IT',
      }, {
        'code': 'CTA',
        'description': 'Sicilia - Taormina (CTA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CIT_IT_Taormin',
      }, {
        'code': 'TLS',
        'description': 'Soldeu (TLS), Andorra',
        'country': {'code': 'AD', 'description': 'Andorra'},
        'locationId': 'CitAdSoldeau266',
      }, {
        'code': 'NAP',
        'description': 'Sorrento (NAP), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItSorrent921',
      }, {
        'code': 'SOU',
        'description': 'Southampton (SOU), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CITY_SOU_GB',
      }, {
        'code': 'SPU',
        'description': 'Split (SPU), Croacia',
        'country': {'code': 'HR', 'description': 'Croacia'},
        'locationId': 'CITY_SPU_HR',
      }, {
        'code': 'SVG',
        'description': 'Stavanger (SVG), Noruega',
        'country': {'code': 'NO', 'description': 'Noruega'},
        'locationId': 'CITY_SVG_NO',
      }, {
        'code': 'BHX',
        'description': 'Stratford Upon Avon (BHX), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'StaGbEnStrat193',
      }, {
        'code': 'STR',
        'description': 'Stuttgart (STR), Alemania',
        'country': {'code': 'DE', 'description': 'Alemania'},
        'locationId': 'CITY_STR_DE',
      }, {
        'code': 'TLL',
        'description': 'Tallinn (TLL), Estonia',
        'country': {'code': 'EE', 'description': 'Estonia'},
        'locationId': 'STA_EE_Tallinn',
      }, {
        'code': 'SKG',
        'description': 'Tesalónica (SKG), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_SKG_GR',
      }, {
        'code': 'PSA',
        'description': 'Toscana y Umbría (PSA), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CitItTuscany327',
      }, {
        'code': 'TLS',
        'description': 'Toulouse (TLS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_TLS_FR',
      }, {
        'code': 'TLS',
        'description': 'Toulouse City (TLS), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CitFrToulous905',
      }, {
        'code': 'TRN',
        'description': 'Turín (TRN), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_TRN_IT',
      }, {
        'code': 'WAW',
        'description': 'Varsovia (WAW), Polonia',
        'country': {'code': 'PL', 'description': 'Polonia'},
        'locationId': 'CITY_WAW_PL',
      }, {
        'code': 'VCE',
        'description': 'Venecia (VCE), Italia',
        'country': {'code': 'IT', 'description': 'Italia'},
        'locationId': 'CITY_VCE_IT',
      }, {
        'code': 'GVA',
        'description': 'Verbier (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CitChVerbier274',
      }, {
        'code': 'VIE',
        'description': 'Viena (VIE), Austria',
        'country': {'code': 'AT', 'description': 'Austria'},
        'locationId': 'REG_AT_Vienna',
      }, {
        'code': 'FAO',
        'description': 'Vilamoura (FAO), Portugal',
        'country': {'code': 'PT', 'description': 'Portugal'},
        'locationId': 'CitPtVilamou524',
      }, {
        'code': 'ZRH',
        'description': 'Wengen & Murren (ZRH), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'REG_CH_Wengen',
      }, {
        'code': 'LON',
        'description': 'Windsor (LON), Reino Unido',
        'country': {'code': 'GB', 'description': 'Reino Unido'},
        'locationId': 'CIT_GB_Windsor',
      }, {
        'code': 'ZAG',
        'description': 'Zagreb (ZAG), Croacia',
        'country': {'code': 'HR', 'description': 'Croacia'},
        'locationId': 'CITY_ZAG_HR',
      }, {
        'code': 'ZTH',
        'description': 'Zakynthos (ZTH), Grecia',
        'country': {'code': 'GR', 'description': 'Grecia'},
        'locationId': 'CITY_ZTH_GR',
      }, {
        'code': 'GVA',
        'description': 'Zermatt (GVA), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'REG_CH_Zermatt',
      }, {
        'code': 'ZRH',
        'description': 'Zurich (ZRH), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'STA_CH_Zurich',
      }, {
        'code': 'ZRH',
        'description': 'Zurich (ZRH), Suiza',
        'country': {'code': 'CH', 'description': 'Suiza'},
        'locationId': 'CitChZurich184',
      }, {
        'code': 'AMS',
        'description': 'Ámsterdam (AMS), Holanda',
        'country': {'code': 'NL', 'description': 'Holanda'},
        'locationId': 'CITY_AMS_NL',
      }, {
        'code': 'NCE',
        'description': 'Área de Saint Tropez (NCE), Francia',
        'country': {'code': 'FR', 'description': 'Francia'},
        'locationId': 'CITY_LTT_FR',
      }],
    }, {
      'code': 'ES_COMM_AREA_AMERICA',
      'description': 'América',
      'cities': [{
        'code': 'BDA',
        'description': 'Aeropuerto de Bermuda (BDA), Bermudas',
        'country': {'code': 'BM', 'description': 'Bermudas'},
        'locationId': 'AIR_BDA_BM',
      }, {
        'code': 'LAX',
        'description': 'Anaheim y Disneyland (LAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsCaAnahe640',
      }, {
        'code': 'ANC',
        'description': 'Anchorage (ANC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_ANC_AK_US',
      }, {
        'code': 'TPA',
        'description': 'Anna Maria Island (TPA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsAnnaMar187',
      }, {
        'code': 'ANU',
        'description': 'Antigua (ANU), Antigua y Barbuda',
        'country': {'code': 'AG', 'description': 'Antigua y Barbuda'},
        'locationId': 'COUNTRY_AG',
      }, {
        'code': 'SJO',
        'description': 'Arenal (SJO), Costa Rica',
        'country': {'code': 'CR', 'description': 'Costa Rica'},
        'locationId': 'CitCrLaFortu800',
      }, {
        'code': 'WAS',
        'description': 'Arlington/Alexandria (WAS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsArlingt622',
      }, {
        'code': 'ATL',
        'description': 'Atlanta (ATL), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_ATL_GA_US',
      }, {
        'code': 'AUS',
        'description': 'Austin (AUS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_AUS_TX_US',
      }, {
        'code': 'DEN',
        'description': 'Avon (DEN), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsCoAvon198',
      }, {
        'code': 'BWI',
        'description': 'Baltimore (BWI), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_BWI_MD_US',
      }, {
        'code': 'BGI',
        'description': 'Barbados (BGI), Barbados',
        'country': {'code': 'BB', 'description': 'Barbados'},
        'locationId': 'COUNTRY_BB',
      }, {
        'code': 'BTR',
        'description': 'Baton Rouge (BTR), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_BTR_LA_US',
      }, {
        'code': 'BDA',
        'description': 'Bermuda (BDA), Bermudas',
        'country': {'code': 'BM', 'description': 'Bermudas'},
        'locationId': 'COUNTRY_BM',
      }, {
        'code': 'LAX',
        'description': 'Beverly Hills (LAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'NBH_US_CA_Beve',
      }, {
        'code': 'BHM',
        'description': 'Birmingham (BHM), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_BHM_AL_US',
      }, {
        'code': 'BOS',
        'description': 'Boston (BOS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_BOS_MA_US',
      }, {
        'code': 'BUE',
        'description': 'Buenos Aires (BUE), Argentina',
        'country': {'code': 'AR', 'description': 'Argentina'},
        'locationId': 'STA_AR_BuenosA',
      }, {
        'code': 'YYC',
        'description': 'Calgary (YYC), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YYC_AB_CA',
      }, {
        'code': 'CLO',
        'description': 'Cali (CLO), Colombia',
        'country': {'code': 'CO', 'description': 'Colombia'},
        'locationId': 'CITY_CLO_CO',
      }, {
        'code': 'CUN',
        'description': 'Cancún (CUN), México',
        'country': {'code': 'MX', 'description': 'México'},
        'locationId': 'CITY_CUN_MX',
      }, {
        'code': 'SJC',
        'description': 'Carmel (SJC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_MRY_CA_US',
      }, {
        'code': 'CHS',
        'description': 'Charleston (CHS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CHS_SC_US',
      }, {
        'code': 'CLT',
        'description': 'Charlotte (CLT), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CLT_NC_US',
      }, {
        'code': 'CHA',
        'description': 'Chattanoogaa (CHA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CHA_TN_US',
      }, {
        'code': 'CHI',
        'description': 'Chicago (CHI), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CHI_IL_US',
      }, {
        'code': 'CVG',
        'description': 'Cincinnati (CVG), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CVG_OH_US',
      }, {
        'code': 'MEX',
        'description': 'Ciudad de México (MEX), México',
        'country': {'code': 'MX', 'description': 'México'},
        'locationId': 'CITY_MEX_MX',
      }, {
        'code': 'CLE',
        'description': 'Cleveland (CLE), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CLE_OH_US',
      }, {
        'code': 'CMH',
        'description': 'Columbus (CMH), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_CMH_OH_US',
      }, {
        'code': 'SJO',
        'description': 'Costa Rica Beaches (SJO), Costa Rica',
        'country': {'code': 'CR', 'description': 'Costa Rica'},
        'locationId': 'CitCrPacific417',
      }, {
        'code': 'SJC',
        'description': 'Costa del Pacífico (SJC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'RegUsPacific839',
      }, {
        'code': 'HAV',
        'description': 'Cuba (HAV), Cuba',
        'country': {'code': 'CU', 'description': 'Cuba'},
        'locationId': 'COUNTRY_CU',
      }, {
        'code': 'DEN',
        'description': 'Denver (DEN), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_DEN_CO_US',
      }, {
        'code': 'DEN',
        'description': 'Denver City (DEN), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsDenverC669',
      }, {
        'code': 'DTT',
        'description': 'Detroit (DTT), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_DTT_MI_US',
      }, {
        'code': 'PHL',
        'description': 'Filadelfia (PHL), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_PHL_PA_US',
      }, {
        'code': 'MIA',
        'description': 'Florida Keys (MIA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsFlFlori975',
      }, {
        'code': 'FMY',
        'description': 'Fort Myers et Sanibel (FMY), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_FMY_FL_US',
      }, {
        'code': 'GCM',
        'description': 'Gran Caimán (GCM), Islas Caimán',
        'country': {'code': 'KY', 'description': 'Islas Caimán'},
        'locationId': 'CITY_GCM_KY',
      }, {
        'code': 'GND',
        'description': 'Grenada (GND), Grenada',
        'country': {'code': 'GD', 'description': 'Grenada'},
        'locationId': 'COUNTRY_GD',
      }, {
        'code': 'BGI',
        'description': 'Grenadines (BGI), Barbados',
        'country': {'code': 'BB', 'description': 'Barbados'},
        'locationId': 'CitBbGrenadi572',
      }, {
        'code': 'GYE',
        'description': 'Guayaquil (GYE), Ecuador',
        'country': {'code': 'EC', 'description': 'Ecuador'},
        'locationId': 'CITY_GYE_EC',
      }, {
        'code': 'YHZ',
        'description': 'Halifax (YHZ), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YHZ_NS_CA',
      }, {
        'code': 'LAX',
        'description': 'Hollywood Area (LAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsHollywo986',
      }, {
        'code': 'HNL',
        'description': 'Honolulu (HNL), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_HNL_HI_US',
      }, {
        'code': 'HOU',
        'description': 'Houston (HOU), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_HOU_TX_US',
      }, {
        'code': 'IND',
        'description': 'Indianapolis (IND), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_IND_IN_US',
      }, {
        'code': 'JAX',
        'description': 'Jacksonville (JAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_JAX_FL_US',
      }, {
        'code': 'KIN',
        'description': 'Jamaica (KIN), Jamaica',
        'country': {'code': 'JM', 'description': 'Jamaica'},
        'locationId': 'COUNTRY_JM',
      }, {
        'code': 'KIN',
        'description': 'Kingston (KIN), Jamaica',
        'country': {'code': 'JM', 'description': 'Jamaica'},
        'locationId': 'STA_JM_Kingston',
      }, {
        'code': 'NYC',
        'description': 'LONG ISLAND (NYC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsNyLongI882',
      }, {
        'code': 'LFT',
        'description': 'Lafayette (LFT), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_LFT_LA_US',
      }, {
        'code': 'YYC',
        'description': 'Lago Louise (YYC), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CIT_CA_AB_Lake',
      }, {
        'code': 'LCH',
        'description': 'Lake Charles (LCH), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_LCH_LA_US',
      }, {
        'code': 'LAS',
        'description': 'Las Vegas (LAS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_LAS_NV_US',
      }, {
        'code': 'LIM',
        'description': 'Lima (LIM), Perú',
        'country': {'code': 'PE', 'description': 'Perú'},
        'locationId': 'STA_PE_Lima',
      }, {
        'code': 'LAX',
        'description': 'Los Ángeles (LAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_LAX_CA_US',
      }, {
        'code': 'SFO',
        'description': 'Mammouth Mountain (SFO), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_CA_Mamm',
      }, {
        'code': 'MDE',
        'description': 'Medellin (MDE), Colombia',
        'country': {'code': 'CO', 'description': 'Colombia'},
        'locationId': 'CITY_MDE_CO',
      }, {
        'code': 'MEM',
        'description': 'Memphis (MEM), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_MEM_TN_US',
      }, {
        'code': 'MIA',
        'description': 'Miami (MIA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_MIA_FL_US',
      }, {
        'code': 'PBI',
        'description': 'Miami - West Palm Beach (PBI), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_FL_Palm',
      }, {
        'code': 'MSP',
        'description': 'Minneapolis (MSP), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_MN_Minn',
      }, {
        'code': 'MBJ',
        'description': 'Montego Bay (MBJ), Jamaica',
        'country': {'code': 'JM', 'description': 'Jamaica'},
        'locationId': 'CITY_MBJ_JM',
      }, {
        'code': 'MVD',
        'description': 'Montevideo (MVD), Uruguay',
        'country': {'code': 'UY', 'description': 'Uruguay'},
        'locationId': 'CITY_MVD_UY',
      }, {
        'code': 'YMQ',
        'description': 'Montreal (YMQ), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YMQ_PQ_CA',
      }, {
        'code': 'MYR',
        'description': 'Myrtle Beach (MYR), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_MYR_SC_US',
      }, {
        'code': 'NYC',
        'description': 'NYC (NYC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_NY_NewY',
      }, {
        'code': 'SFO',
        'description': 'Napa & Sonoma (SFO), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'RegUsNapaand990',
      }, {
        'code': 'BNA',
        'description': 'Nashville (BNA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_BNA_TN_US',
      }, {
        'code': 'MSY',
        'description': 'Nueva Orleans (MSY), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_MSY_LA_US',
      }, {
        'code': 'NYC',
        'description': 'Nueva York (NYC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_NY_NewY',
      }, {
        'code': 'HNL',
        'description': 'Oahu (HNL), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsHiOahu190',
      }, {
        'code': 'OAK',
        'description': 'Oakland (OAK), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'DisUsSanFran697',
      }, {
        'code': 'SEA',
        'description': 'Olympic Peninsual National Park (SEA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsOlympic672',
      }, {
        'code': 'ORL',
        'description': 'Orlando (ORL), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_ORL_FL_US',
      }, {
        'code': 'YOW',
        'description': 'Ottawa (YOW), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YOW_ON_CA',
      }, {
        'code': 'PSP',
        'description': 'Palm Springs (PSP), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_PSP_CA_US',
      }, {
        'code': 'PHX',
        'description': 'Phoenix (PHX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsAzPhoen100',
      }, {
        'code': 'PIT',
        'description': 'Pittsburgh (PIT), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_PIT_PA_US',
      }, {
        'code': 'LAX',
        'description': 'Playas de Los Ángeles (LAX), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'resUsLosAnge410',
      }, {
        'code': 'MIA',
        'description': 'Port St. Lucie (MIA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsJensenb726',
      }, {
        'code': 'PLS',
        'description': 'Providenciales (PLS), Islas Turks y Caicos',
        'country': {'code': 'TC', 'description': 'Islas Turks y Caicos'},
        'locationId': 'CITY_PLS_TC',
      }, {
        'code': 'PUJ',
        'description': 'Punta Cana (PUJ), República Dominicana',
        'country': {'code': 'DO', 'description': 'República Dominicana'},
        'locationId': 'CITY_PUJ_DO',
      }, {
        'code': 'UIO',
        'description': 'Quito (UIO), Ecuador',
        'country': {'code': 'EC', 'description': 'Ecuador'},
        'locationId': 'CITY_UIO_EC',
      }, {
        'code': 'RDU',
        'description': 'Raleigh (RDU), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsNcRalei166',
      }, {
        'code': 'RIO',
        'description': 'Río de Janeiro (RIO), Brasil',
        'country': {'code': 'BR', 'description': 'Brasil'},
        'locationId': 'STA_BR_RiodeJa',
      }, {
        'code': 'SMF',
        'description': 'Sacramento (SMF), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_CA_Sacr',
      }, {
        'code': 'SAT',
        'description': 'San Antonio (SAT), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_SAT_TX_US',
      }, {
        'code': 'SAN',
        'description': 'San Diego (SAN), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_SAN_CA_US',
      }, {
        'code': 'SFO',
        'description': 'San Francisco (SFO), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_SFO_CA_US',
      }, {
        'code': 'SJC',
        'description': 'San José (SJC), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_SJC_CA_US',
      }, {
        'code': 'SJO',
        'description': 'San José de Costa Rica (SJO), Costa Rica',
        'country': {'code': 'CR', 'description': 'Costa Rica'},
        'locationId': 'STA_CR_SanJose',
      }, {
        'code': 'SJU',
        'description': 'San Juan de Puerto Rico (SJU), Puerto Rico',
        'country': {'code': 'PR', 'description': 'Puerto Rico'},
        'locationId': 'CITY_SJU_PR',
      }, {
        'code': 'SLU',
        'description': 'Santa Lucía (SLU), Santa Lucía',
        'country': {'code': 'LC', 'description': 'Santa Lucía'},
        'locationId': 'COUNTRY_LC',
      }, {
        'code': 'SCL',
        'description': 'Santiago de Chile (SCL), Chile',
        'country': {'code': 'CL', 'description': 'Chile'},
        'locationId': 'REG_CL_Santiag',
      }, {
        'code': 'SDQ',
        'description': 'Santo Domingo (SDQ), República Dominicana',
        'country': {'code': 'DO', 'description': 'República Dominicana'},
        'locationId': 'CITY_SDQ_DO',
      }, {
        'code': 'SRQ',
        'description': 'Sarasota (SRQ), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_FL_Long',
      }, {
        'code': 'SAV',
        'description': 'Savannah (SAV), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_SAV_GA_US',
      }, {
        'code': 'SEA',
        'description': 'Seattle (SEA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsSeattle306',
      }, {
        'code': 'STX',
        'description': 'St Croix (STX), Islas Vírgenes (EEUU)',
        'country': {'code': 'VI', 'description': 'Islas Vírgenes (EEUU)'},
        'locationId': 'CitViStCroix355',
      }, {
        'code': 'SKB',
        'description': 'St Kitts y Nevis (SKB), St. Kitts Y Nevis',
        'country': {'code': 'KN', 'description': 'St. Kitts Y Nevis'},
        'locationId': 'CouKnStKitts286',
      }, {
        'code': 'STT',
        'description': 'St Thomas (STT), Islas Vírgenes (EEUU)',
        'country': {'code': 'VI', 'description': 'Islas Vírgenes (EEUU)'},
        'locationId': 'CitViStThoma458',
      }, {
        'code': 'SAO',
        'description': 'São Paulo (SAO), Brasil',
        'country': {'code': 'BR', 'description': 'Brasil'},
        'locationId': 'STA_BR_SaoPaulo',
      }, {
        'code': 'TPA',
        'description': 'Tampa (TPA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsTampa083',
      }, {
        'code': 'TAB',
        'description': 'Tobago (TAB), Trinidad y Tobago',
        'country': {'code': 'TT', 'description': 'Trinidad y Tobago'},
        'locationId': 'STA_TT_Tobago',
      }, {
        'code': 'YTO',
        'description': 'Toronto (YTO), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YTO_ON_CA',
      }, {
        'code': 'POS',
        'description': 'Trinidad (POS), Trinidad y Tobago',
        'country': {'code': 'TT', 'description': 'Trinidad y Tobago'},
        'locationId': 'REG_TT_Trinida',
      }, {
        'code': 'TUS',
        'description': 'Tucson (TUS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CITY_TUS_AZ_US',
      }, {
        'code': 'EGE',
        'description': 'Vail (EGE), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsCoVail190',
      }, {
        'code': 'YVR',
        'description': 'Vancouver (YVR), Canadá',
        'country': {'code': 'CA', 'description': 'Canadá'},
        'locationId': 'CITY_YVR_BC_CA',
      }, {
        'code': 'SEA',
        'description': 'Walla Walla (SEA), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsWallaWa642',
      }, {
        'code': 'WAS',
        'description': 'Washington DC (WAS), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsDcWashi072',
      }, {
        'code': 'DEN',
        'description': 'Yellowstone (DEN), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CIT_US_WY_Yell',
      }, {
        'code': 'DFW',
        'description': 'Zona de Dallas (DFW), USA',
        'country': {'code': 'US', 'description': 'USA'},
        'locationId': 'CitUsDallasF248',
      }],
    }, {
      'code': 'ES_COMM_AREA_AFRICA_M_EAST',
      'description': 'África y Oriente Medio',
      'cities': [{
        'code': 'AUH',
        'description': 'Abu Dhabi (AUH), Emiratos Arabes Unidos',
        'country': {'code': 'AE', 'description': 'Emiratos Arabes Unidos'},
        'locationId': 'CITY_AUH_AE',
      }, {
        'code': 'ACC',
        'description': 'Accra (ACC), Ghana',
        'country': {'code': 'GH', 'description': 'Ghana'},
        'locationId': 'CITY_ACC_GH',
      }, {
        'code': 'LOS',
        'description': 'Aeropuerto de Lagos (LOS), Nigeria',
        'country': {'code': 'NG', 'description': 'Nigeria'},
        'locationId': 'AIR_LOS_NG',
      }, {
        'code': 'DXB',
        'description': 'Ajman (DXB), Emiratos Arabes Unidos',
        'country': {'code': 'AE', 'description': 'Emiratos Arabes Unidos'},
        'locationId': 'CitAeAjman037',
      }, {
        'code': 'AMM',
        'description': 'Ammán (AMM), Jordania',
        'country': {'code': 'JO', 'description': 'Jordania'},
        'locationId': 'CITY_AMM_JO',
      }, {
        'code': 'ALG',
        'description': 'Argel (ALG), Argelia',
        'country': {'code': 'DZ', 'description': 'Argelia'},
        'locationId': 'CITY_ALG_DZ',
      }, {
        'code': 'CPT',
        'description': 'Cape Town City (CPT), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CitZaCapeTow909',
      }, {
        'code': 'CPT',
        'description': 'Ciudad del Cabo (CPT), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CITY_CPT_ZA',
      }, {
        'code': 'DAR',
        'description': 'Dar Es Salaam (DAR), Tanzania',
        'country': {'code': 'TZ', 'description': 'Tanzania'},
        'locationId': 'STA_TZ_DaresSa',
      }, {
        'code': 'DOH',
        'description': 'Doha (DOH), Qatar',
        'country': {'code': 'QA', 'description': 'Qatar'},
        'locationId': 'CITY_DOH_QA',
      }, {
        'code': 'DXB',
        'description': 'Dubai (DXB), Emiratos Arabes Unidos',
        'country': {'code': 'AE', 'description': 'Emiratos Arabes Unidos'},
        'locationId': 'CITY_DXB_AE',
      }, {
        'code': 'DUR',
        'description': 'Durban City Centre (DUR), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CitZaDurbanC321',
      }, {
        'code': 'CAI',
        'description': 'El Cairo (CAI), Egipto',
        'country': {'code': 'EG', 'description': 'Egipto'},
        'locationId': 'CITY_CAI_EG',
      }, {
        'code': 'DXB',
        'description': 'Fujairah (DXB), Emiratos Arabes Unidos',
        'country': {'code': 'AE', 'description': 'Emiratos Arabes Unidos'},
        'locationId': 'REG_AE_Fujaira',
      }, {
        'code': 'HRE',
        'description': 'Harare (HRE), Zimbabue',
        'country': {'code': 'ZW', 'description': 'Zimbabue'},
        'locationId': 'STA_ZW_Harare',
      }, {
        'code': 'JNB',
        'description': 'Johannesburg City (JNB), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CitZaJohanne298',
      }, {
        'code': 'JNB',
        'description': 'Johannesburgo (JNB), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CITY_JNB_ZA',
      }, {
        'code': 'AMM',
        'description': 'Jordania (AMM), Jordania',
        'country': {'code': 'JO', 'description': 'Jordania'},
        'locationId': 'COUNTRY_JO',
      }, {
        'code': 'CPT',
        'description': 'Knysna (CPT), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CIT_ZA_Knysna',
      }, {
        'code': 'KWI',
        'description': 'Kuwait (KWI), Kuwait',
        'country': {'code': 'KW', 'description': 'Kuwait'},
        'locationId': 'COUNTRY_KW',
      }, {
        'code': 'DUR',
        'description': 'Kwazulu-Natal (DUR), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'STA_ZA_KwaZulu',
      }, {
        'code': 'LAD',
        'description': 'Luanda (LAD), Angola',
        'country': {'code': 'AO', 'description': 'Angola'},
        'locationId': 'STA_AO_Luanda',
      }, {
        'code': 'LUN',
        'description': 'Lusaka (LUN), Zambia',
        'country': {'code': 'ZM', 'description': 'Zambia'},
        'locationId': 'STA_ZM_Lusaka',
      }, {
        'code': 'BAH',
        'description': 'Manama (BAH), Bahrain',
        'country': {'code': 'BH', 'description': 'Bahrain'},
        'locationId': 'REG_BH_Manama',
      }, {
        'code': 'AMM',
        'description': 'Mar Muerto (AMM), Jordania',
        'country': {'code': 'JO', 'description': 'Jordania'},
        'locationId': 'CitJoDeadSea280',
      }, {
        'code': 'TLV',
        'description': 'Mar Muerto (TLV), Israel',
        'country': {'code': 'IL', 'description': 'Israel'},
        'locationId': 'CitIlDeadSea276',
      }, {
        'code': 'MRU',
        'description': 'Mauricio (MRU), Islas Mauricio',
        'country': {'code': 'MU', 'description': 'Islas Mauricio'},
        'locationId': 'COUNTRY_MU',
      }, {
        'code': 'MCT',
        'description': 'Muscat (MCT), Omán',
        'country': {'code': 'OM', 'description': 'Omán'},
        'locationId': 'CITY_MCT_OM',
      }, {
        'code': 'JNB',
        'description': 'Parque Nacional Kruger (JNB), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'StaZaSoKruge760',
      }, {
        'code': 'AMM',
        'description': 'Petra (AMM), Jordania',
        'country': {'code': 'JO', 'description': 'Jordania'},
        'locationId': 'CitJoPetra077',
      }, {
        'code': 'PLZ',
        'description': 'Port Elizabeth (PLZ), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CitZaPortEli976',
      }, {
        'code': 'PLZ',
        'description': 'Port Elizabeth (PLZ), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CITY_PLZ_ZA',
      }, {
        'code': 'JNB',
        'description': 'Sabi Sand (JNB), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CIT_ZA_SabiSan',
      }, {
        'code': 'SSH',
        'description': 'Sharm El Sheikh (SSH), Egipto',
        'country': {'code': 'EG', 'description': 'Egipto'},
        'locationId': 'CITY_SSH_EG',
      }, {
        'code': 'TLV',
        'description': 'Tel Aviv (TLV), Israel',
        'country': {'code': 'IL', 'description': 'Israel'},
        'locationId': 'STA_IL_TelAviv',
      }, {
        'code': 'VFA',
        'description': 'Victoria Falls (VFA), Zimbabue',
        'country': {'code': 'ZW', 'description': 'Zimbabue'},
        'locationId': 'CITY_VFA_ZW',
      }, {
        'code': 'WDH',
        'description': 'Windhoek (WDH), Namibia',
        'country': {'code': 'NA', 'description': 'Namibia'},
        'locationId': 'STA_NA_Windhoek',
      }, {
        'code': 'CPT',
        'description': 'Winelands (CPT), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'CIT_ZA_Winelan',
      }, {
        'code': 'ZNZ',
        'description': 'Zanzíbar (ZNZ), Tanzania',
        'country': {'code': 'TZ', 'description': 'Tanzania'},
        'locationId': 'REG_TZ_Zanziba',
      }, {
        'code': 'DUR',
        'description': 'Zona de Durban (DUR), Sudáfrica',
        'country': {'code': 'ZA', 'description': 'Sudáfrica'},
        'locationId': 'StaZaSoDurba833',
      }],
    }, {
      'code': 'ES_COMM_AREA_ASIA_OCEANIA',
      'description': 'Asia y Oceanía',
      'cities': [{
        'code': 'ADL',
        'description': 'Adelaida (ADL), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_ADL_SA_AU',
      }, {
        'code': 'AKL',
        'description': 'Auckland (AKL), Nueva Zelanda',
        'country': {'code': 'NZ', 'description': 'Nueva Zelanda'},
        'locationId': 'CITY_AKL_NZ',
      }, {
        'code': 'BLR',
        'description': 'Bangalore (BLR), India',
        'country': {'code': 'IN', 'description': 'India'},
        'locationId': 'CITY_BLR_IN',
      }, {
        'code': 'BKK',
        'description': 'Bangkok (BKK), Tailandia',
        'country': {'code': 'TH', 'description': 'Tailandia'},
        'locationId': 'CITY_BKK_TH',
      }, {
        'code': 'BNE',
        'description': 'Brisbane (BNE), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_BNE_QL_AU',
      }, {
        'code': 'CNS',
        'description': 'Cairns (CNS), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_CNS_QL_AU',
      }, {
        'code': 'CBR',
        'description': 'Canberra (CBR), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_CBR_AC_AU',
      }, {
        'code': 'CSX',
        'description': 'Changsha (CSX), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_CSX_CN',
      }, {
        'code': 'CTU',
        'description': 'Chengdu (CTU), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_CTU_CN',
      }, {
        'code': 'MAA',
        'description': 'Chennai (MAA), India',
        'country': {'code': 'IN', 'description': 'India'},
        'locationId': 'CITY_MAA_IN',
      }, {
        'code': 'CKG',
        'description': 'Chongqing (CKG), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_CKG_CN',
      }, {
        'code': 'BKK',
        'description': 'Costa de Bangkok (BKK), Tailandia',
        'country': {'code': 'TH', 'description': 'Tailandia'},
        'locationId': 'CitThBangkok843',
      }, {
        'code': 'CNS',
        'description': 'Great Barrier Reef (CNS), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CitAuGreatBa290',
      }, {
        'code': 'HAN',
        'description': 'Hanoi (HAN), Vietnam',
        'country': {'code': 'VN', 'description': 'Vietnam'},
        'locationId': 'CITY_HAN_VN',
      }, {
        'code': 'SGN',
        'description': 'Ho Chi Minh (SGN), Vietnam',
        'country': {'code': 'VN', 'description': 'Vietnam'},
        'locationId': 'REG_VN_HoChiMi',
      }, {
        'code': 'SGN',
        'description': 'Hoi An (SGN), Vietnam',
        'country': {'code': 'VN', 'description': 'Vietnam'},
        'locationId': 'REG_VN_HoiAn',
      }, {
        'code': 'HKG',
        'description': 'Hong Kong (HKG), Hong Kong',
        'country': {'code': 'HK', 'description': 'Hong Kong'},
        'locationId': 'REG_CN_HongKon',
      }, {
        'code': 'HYD',
        'description': 'Hyderabad (HYD), India',
        'country': {'code': 'IN', 'description': 'India'},
        'locationId': 'CITY_HYD_IN',
      }, {
        'code': 'AKL',
        'description': 'Isla Norte (AKL), Nueva Zelanda',
        'country': {'code': 'NZ', 'description': 'Nueva Zelanda'},
        'locationId': 'REG_NZ_NorthIs',
      }, {
        'code': 'HKG',
        'description': 'Isla de Hong Kong (HKG), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CIT_CN_HongKon',
      }, {
        'code': 'HKG',
        'description': 'Kowloon (HKG), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CIT_CN_Kowloon',
      }, {
        'code': 'KUL',
        'description': 'Kuala Lumpur (KUL), Malasia',
        'country': {'code': 'MY', 'description': 'Malasia'},
        'locationId': 'CITY_KUL_MY',
      }, {
        'code': 'LGK',
        'description': 'Langkawi (LGK), Malasia',
        'country': {'code': 'MY', 'description': 'Malasia'},
        'locationId': 'desMyLangkaw392',
      }, {
        'code': 'KUL',
        'description': 'Malaysian Beaches (KUL), Malasia',
        'country': {'code': 'MY', 'description': 'Malasia'},
        'locationId': 'CitMyMalaysi256',
      }, {
        'code': 'MEL',
        'description': 'Melbourne (MEL), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_MEL_VI_AU',
      }, {
        'code': 'MEL',
        'description': 'Melbourne (MEL), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_MEL_VI_AU',
      }, {
        'code': 'BOM',
        'description': 'Mumbai (BOM), India',
        'country': {'code': 'IN', 'description': 'India'},
        'locationId': 'StaInMaMumba342',
      }, {
        'code': 'NGO',
        'description': 'Nagoya (NGO), Japón',
        'country': {'code': 'JP', 'description': 'Japón'},
        'locationId': 'CITY_NGO_JP',
      }, {
        'code': 'DEL',
        'description': 'New Delhi (DEL), India',
        'country': {'code': 'IN', 'description': 'India'},
        'locationId': 'CITY_DEL_IN',
      }, {
        'code': 'OKA',
        'description': 'Okinawa (OKA), Japón',
        'country': {'code': 'JP', 'description': 'Japón'},
        'locationId': 'CITY_OKA_JP',
      }, {
        'code': 'OSA',
        'description': 'Osaka (OSA), Japón',
        'country': {'code': 'JP', 'description': 'Japón'},
        'locationId': 'STA_JP_Osaka',
      }, {
        'code': 'BJS',
        'description': 'Pekín (BJS), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'STA_CN_Beijing',
      }, {
        'code': 'PER',
        'description': 'Perth (PER), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CITY_PER_WA_AU',
      }, {
        'code': 'PNH',
        'description': 'Phnom Penh (PNH), Camboya',
        'country': {'code': 'KH', 'description': 'Camboya'},
        'locationId': 'CitKhPhnomPe536',
      }, {
        'code': 'HKT',
        'description': 'Phuket (HKT), Tailandia',
        'country': {'code': 'TH', 'description': 'Tailandia'},
        'locationId': 'CITY_HKT_TH',
      }, {
        'code': 'SEL',
        'description': 'Seúl (SEL), Corea Del Sur',
        'country': {'code': 'KR', 'description': 'Corea Del Sur'},
        'locationId': 'CITY_SEL_KR',
      }, {
        'code': 'HKG',
        'description': 'Sha Tin (HKG), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CitHkShaTin210',
      }, {
        'code': 'SHA',
        'description': 'Shanghai (SHA), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'STA_CN_Shanghai',
      }, {
        'code': 'SZX',
        'description': 'Shenzhen (SZX), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_SZX_CN',
      }, {
        'code': 'SYD',
        'description': 'Sidney (SYD), Australia',
        'country': {'code': 'AU', 'description': 'Australia'},
        'locationId': 'CIT_AU_NS_Sydn',
      }, {
        'code': 'SIN',
        'description': 'Singapur (SIN), Singapur',
        'country': {'code': 'SG', 'description': 'Singapur'},
        'locationId': 'COUNTRY_SG',
      }, {
        'code': 'CMB',
        'description': 'Sri Lanka (CMB), Sri Lanka',
        'country': {'code': 'LK', 'description': 'Sri Lanka'},
        'locationId': 'COUNTRY_LK',
      }, {
        'code': 'TYO',
        'description': 'Tokio (TYO), Japón',
        'country': {'code': 'JP', 'description': 'Japón'},
        'locationId': 'STA_JP_Tokyo',
      }, {
        'code': 'WNZ',
        'description': 'Wenzhou (WNZ), China',
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_WNZ_CN',
      }, {
        'code': 'SIA',
        'description': "Xi'an (SIA), China",
        'country': {'code': 'CN', 'description': 'China'},
        'locationId': 'CITY_SIA_CN',
      }],
    }];

    cities_default = [
      {
        'code': 'ES_COMM_AREA_SPAIN',
        'description': 'España',
        'cities': [
          {
            'code': 'LCG',
            'description': 'A Coruña',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ABC',
            'description': 'Albacete',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ALC',
            'description': 'Alicante',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'LEI',
            'description': 'Almería',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'OVD',
            'description': 'Asturias-Oviedo',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'BJZ',
            'description': 'Badajoz',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'BCN',
            'description': 'Barcelona',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'BIO',
            'description': 'Bilbao',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'RGS',
            'description': 'Burgos',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ODB',
            'description': 'Córdoba',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'FUE',
            'description': 'Fuerteventura',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'LPA',
            'description': 'Gran Canaria Las Palmas',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'GRX',
            'description': 'Granada-Jaén',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'IBZ',
            'description': 'Ibiza',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'XRY',
            'description': 'Jerez de la Frontera',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ACE',
            'description': 'Lanzarote',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'LEN',
            'description': 'León',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'ILD',
            'description': 'Lleida',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'RJL',
            'description': 'Logroño',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'MAD',
            'description': 'Madrid',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'MLN',
            'description': 'Melilla',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'MAH',
            'description': 'Menorca',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'MJV',
            'description': 'Murcia',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'AGP',
            'description': 'Málaga',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'PMI',
            'description': 'Palma de Mallorca',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'PNA',
            'description': 'Pamplona',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'SLM',
            'description': 'Salamanca',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'EAS',
            'description': 'San Sebastian',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'GMZ',
            'description': 'San Sebastián de la Gomera',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'SPC',
            'description': 'Santa Cruz de La Palma',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'SDR',
            'description': 'Santander',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'SCQ',
            'description': 'Santiago de Compostela',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'SVQ',
            'description': 'Sevilla',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'TCI',
            'description': 'Tenerife',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'VLC',
            'description': 'Valencia',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'VLL',
            'description': 'Valladolid',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'VDE',
            'description': 'Valverde',
            'timezone': 'Atlantic/Canary',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
          {
            'code': 'VGO',
            'description': 'Vigo',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'ES',
              'description': 'España',
            },
          },
        ],
      },
      {
        'code': 'ES_COMM_AREA_EUROPE',
        'description': 'Europa',
        'cities': [
          {
            'code': 'AAL',
            'description': 'Aalborg',
            'timezone': 'Europe/Copenhagen',
            'country': {
              'code': 'DK',
              'description': 'Dinamarca',
            },
          },
          {
            'code': 'AHO',
            'description': 'Alguero',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'AMS',
            'description': 'Amsterdam',
            'timezone': 'Europe/Amsterdam',
            'country': {
              'code': 'NL',
              'description': 'Holanda',
            },
          },
          {
            'code': 'ATH',
            'description': 'Atenas',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'BRI',
            'description': 'Bari',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'EAP',
            'description': 'Basilea',
            'timezone': 'Europe/Zurich',
            'country': {
              'code': 'CH',
              'description': 'Suiza',
            },
          },
          {
            'code': 'BIA',
            'description': 'Bastia',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'BGO',
            'description': 'Bergen',
            'timezone': 'Europe/Bergen',
            'country': {
              'code': 'NO',
              'description': 'Noruega',
            },
          },
          {
            'code': 'BER',
            'description': 'Berlín',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'BHX',
            'description': 'Birmingham',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'BLQ',
            'description': 'Bolonia',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'BES',
            'description': 'Brest',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'BDS',
            'description': 'Brindisi',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'BRU',
            'description': 'Bruselas',
            'timezone': 'Europe/Brussels',
            'country': {
              'code': 'BE',
              'description': 'Bélgica',
            },
          },
          {
            'code': 'BUH',
            'description': 'Bucarest',
            'timezone': 'Europe/Bucharest',
            'country': {
              'code': 'RO',
              'description': 'Rumania',
            },
          },
          {
            'code': 'BOD',
            'description': 'Burdeos',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'CAG',
            'description': 'Cagliari',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'CWL',
            'description': 'Cardiff',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'CTA',
            'description': 'Catania',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'CPH',
            'description': 'Copenhague',
            'timezone': 'Europe/Copenhagen',
            'country': {
              'code': 'DK',
              'description': 'Dinamarca',
            },
          },
          {
            'code': 'CFU',
            'description': 'Corfú',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'ORK',
            'description': 'Cork',
            'timezone': 'Europe/London',
            'country': {
              'code': 'IE',
              'description': 'Irlanda',
            },
          },
          {
            'code': 'KRK',
            'description': 'Cracovia',
            'timezone': 'Europe/Warsaw',
            'country': {
              'code': 'PL',
              'description': 'Polonia',
            },
          },
          {
            'code': 'HER',
            'description': 'Creta',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'DUB',
            'description': 'Dublín',
            'timezone': 'Europe/London',
            'country': {
              'code': 'IE',
              'description': 'Irlanda',
            },
          },
          {
            'code': 'DBV',
            'description': 'Dubrovnik',
            'timezone': 'Europe/Ljubljana',
            'country': {
              'code': 'HR',
              'description': 'Croacia',
            },
          },
          {
            'code': 'DUS',
            'description': 'Dusseldorf',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'EDI',
            'description': 'Edimburgo',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'IST',
            'description': 'Estambul',
            'timezone': 'Asia/Istanbul',
            'country': {
              'code': 'TR',
              'description': 'Turquía',
            },
          },
          {
            'code': 'STO',
            'description': 'Estocolmo',
            'timezone': 'Europe/Stockholm',
            'country': {
              'code': 'SE',
              'description': 'Suecia',
            },
          },
          {
            'code': 'SXB',
            'description': 'Estrasburgo',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'FLR',
            'description': 'Florencia',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'FRA',
            'description': 'Frankfurt',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'FNC',
            'description': 'Funchal',
            'timezone': 'Portugal',
            'country': {
              'code': 'PT',
              'description': 'Portugal',
            },
          },
          {
            'code': 'GVA',
            'description': 'Ginebra',
            'timezone': 'Europe/Zurich',
            'country': {
              'code': 'CH',
              'description': 'Suiza',
            },
          },
          {
            'code': 'GLA',
            'description': 'Glasgow',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'GOA',
            'description': 'Génova',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'HAM',
            'description': 'Hamburgo',
            'timezone': 'Europe/Madrid',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'HAJ',
            'description': 'Hannover',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'LBA',
            'description': 'Leeds Bradford',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'LIL',
            'description': 'Lille',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'LIS',
            'description': 'Lisboa',
            'timezone': 'Portugal',
            'country': {
              'code': 'PT',
              'description': 'Portugal',
            },
          },
          {
            'code': 'LON',
            'description': 'Londres',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'LYS',
            'description': 'Lyón',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'MLA',
            'description': 'Malta',
            'timezone': 'Europe/Malta',
            'country': {
              'code': 'MT',
              'description': 'Malta',
            },
          },
          {
            'code': 'MAN',
            'description': 'Manchester',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'MAM',
            'description': 'Mancagua',
            'timezone': 'Europe/London',
            'country': {
              'code': 'GB',
              'description': 'Reino Unido',
            },
          },
          {
            'code': 'MRS',
            'description': 'Marsella',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'JMK',
            'description': 'Mikonos',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'MIL',
            'description': 'Milán',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'MOW',
            'description': 'Moscú',
            'timezone': 'Europe/Moscow',
            'country': {
              'code': 'RU',
              'description': 'Rusia',
            },
          },
          {
            'code': 'MUC',
            'description': 'Munich',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'NTE',
            'description': 'Nantes',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'NCE',
            'description': 'Niza',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'NUE',
            'description': 'Nuremberg',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'NAP',
            'description': 'Nápoles',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'OLB',
            'description': 'Olbia',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'OPO',
            'description': 'Oporto',
            'timezone': 'Portugal',
            'country': {
              'code': 'PT',
              'description': 'Portugal',
            },
          },
          {
            'code': 'OSL',
            'description': 'Oslo',
            'timezone': 'Europe/Oslo',
            'country': {
              'code': 'NO',
              'description': 'Noruega',
            },
          },
          {
            'code': 'PMO',
            'description': 'Palermo',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'PAR',
            'description': 'París',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'PSA',
            'description': 'Pisa',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'PRG',
            'description': 'Praga',
            'timezone': 'Europe/Prague',
            'country': {
              'code': 'CZ',
              'description': 'República Checa',
            },
          },
          {
            'code': 'XCR',
            'description': 'Region de Chalons Vatry Champagne',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'REK',
            'description': 'Reikiavik',
            'timezone': 'Europe/Copenhagen',
            'country': {
              'code': 'IS',
              'description': 'Islandia',
            },
          },
          {
            'code': 'RNS',
            'description': 'Rennes',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'RIX',
            'description': 'Riga',
            'timezone': 'Europe/Riga',
            'country': {
              'code': 'LV',
              'description': 'Letonia',
            },
          },
          {
            'code': 'ROM',
            'description': 'Roma',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'LED',
            'description': 'San Petersburgo',
            'timezone': 'Europe/Moscow',
            'country': {
              'code': 'RU',
              'description': 'Rusia',
            },
          },
          {
            'code': 'JTR',
            'description': 'Santorini',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'SOF',
            'description': 'Sofia',
            'timezone': 'Europe/Sofia',
            'country': {
              'code': 'BG',
              'description': 'Bulgaria',
            },
          },
          {
            'code': 'SPU',
            'description': 'Split',
            'timezone': 'Europe/Zagreb',
            'country': {
              'code': 'HR',
              'description': 'Croacia',
            },
          },
          {
            'code': 'STR',
            'description': 'Stuttgart',
            'timezone': 'Europe/Berlin',
            'country': {
              'code': 'DE',
              'description': 'Alemania',
            },
          },
          {
            'code': 'TLS',
            'description': 'Toulouse',
            'timezone': 'Europe/Paris',
            'country': {
              'code': 'FR',
              'description': 'Francia',
            },
          },
          {
            'code': 'TRN',
            'description': 'Turín',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'VCE',
            'description': 'Venecia',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'VRN',
            'description': 'Verona',
            'timezone': 'Europe/Rome',
            'country': {
              'code': 'IT',
              'description': 'Italia',
            },
          },
          {
            'code': 'VIE',
            'description': 'Viena',
            'timezone': 'Europe/Vienna',
            'country': {
              'code': 'AT',
              'description': 'Austria',
            },
          },
          {
            'code': 'VNO',
            'description': 'Vilnius',
            'timezone': 'Europe/Vilnius',
            'country': {
              'code': 'LT',
              'description': 'Lituania',
            },
          },
          {
            'code': 'ZTH',
            'description': 'Zacinto',
            'timezone': 'Europe/Athens',
            'country': {
              'code': 'GR',
              'description': 'Grecia',
            },
          },
          {
            'code': 'ZAD',
            'description': 'Zadar',
            'timezone': 'Europe/Zagreb',
            'country': {
              'code': 'HR',
              'description': 'Croacia',
            },
          },
          {
            'code': 'ZAG',
            'description': 'Zagreb',
            'timezone': 'Europe/Zagreb',
            'country': {
              'code': 'HR',
              'description': 'Croacia',
            },
          },
          {
            'code': 'ZRH',
            'description': 'Zurich',
            'timezone': 'Europe/Zurich',
            'country': {
              'code': 'CH',
              'description': 'Suiza',
            },
          },
        ],
      },
      {
        'code': 'ES_COMM_AREA_AMERICA',
        'description': 'América',
        'cities': [
          {
            'code': 'LAX',
            'description': 'Anaheim & Disneyland',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'ALB',
            'description': 'Albany',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'BBA',
            'description': 'Balmaceda',
            'timezone': 'Chile/Continental',
            'country': {
              'code': 'CL',
              'description': 'Chile',
            },
          },
          {
            'code': 'GPS',
            'description': 'Baltra Islas Galápagos',
            'timezone': 'America/Guayaquil',
            'country': {
              'code': 'EC',
              'description': 'Ecuador',
            },
          },
          {
            'code': 'BOG',
            'description': 'Bogotá',
            'timezone': 'America/Bogota',
            'country': {
              'code': 'CO',
              'description': 'Colombia',
            },
          },
          {
            'code': 'BOS',
            'description': 'Boston',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'BUE',
            'description': 'Buenos Aires',
            'timezone': 'America/Buenos_Aires',
            'country': {
              'code': 'AR',
              'description': 'Argentina',
            },
          },
          {
            'code': 'COR',
            'description': 'Cordoba',
            'timezone': 'America/Buenos_Aires',
            'country': {
              'code': 'AR',
              'description': 'Argentina',
            },
          },
          {
            'code': 'CLO',
            'description': 'Cali',
            'timezone': 'America/Bogota',
            'country': {
              'code': 'CO',
              'description': 'Colombia',
            },
          },
          {
            'code': 'CCS',
            'description': 'Caracas',
            'timezone': 'America/Caracas',
            'country': {
              'code': 'VE',
              'description': 'Venezuela',
            },
          },
          {
            'code': 'CTM',
            'description': 'Chetumal',
            'timezone': 'Mexico/General',
            'country': {
              'code': 'MX',
              'description': 'México',
            },
          },
          {
            'code': 'CHI',
            'description': 'Chicago',
            'timezone': 'US/Central',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'MEX',
            'description': 'Ciudad de México',
            'timezone': 'Mexico/General',
            'country': {
              'code': 'MX',
              'description': 'México',
            },
          },
          {
            'code': 'CUE',
            'description': 'Cuenca',
            'timezone': 'America/Guayaquil',
            'country': {
              'code': 'EC',
              'description': 'Ecuador',
            },
          },
          {
            'code': 'CUR',
            'description': 'Curaçao',
            'timezone': 'America/Curaçao',
            'country': {
              'code': 'VE',
              'description': 'Venezuela',
            },
          },
          {
            'code': 'VPS',
            'description': 'Fort Walton Beach',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'GUA',
            'description': 'Guatemala',
            'timezone': 'America/Guatemala',
            'country': {
              'code': 'GT',
              'description': 'Guatemala',
            },
          },
          {
            'code': 'GYE',
            'description': 'Guayaquil',
            'timezone': 'America/Guayaquil',
            'country': {
              'code': 'EC',
              'description': 'Ecuador',
            },
          },
          {
            'code': 'HAV',
            'description': 'La Habana',
            'timezone': 'Cuba',
            'country': {
              'code': 'CU',
              'description': 'Cuba',
            },
          },
          {
            'code': 'LIM',
            'description': 'Lima',
            'timezone': 'America/Lima',
            'country': {
              'code': 'PE',
              'description': 'Perú',
            },
          },
          {
            'code': 'LAX',
            'description': 'Los Angeles',
            'timezone': 'US/Pacific',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'MDE',
            'description': 'Medellin',
            'timezone': 'America/Bogota',
            'country': {
              'code': 'CO',
              'description': 'Colombia',
            },
          },
          {
            'code': 'MIA',
            'description': 'Miami',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'MVD',
            'description': 'Montevideo',
            'timezone': 'America/Sao_Paulo',
            'country': {
              'code': 'UY',
              'description': 'Uruguay',
            },
          },
          {
            'code': 'NYC',
            'description': 'Nueva York',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'PTY',
            'description': 'Panamá',
            'timezone': 'America/Panama',
            'country': {
              'code': 'PA',
              'description': 'Panamá',
            },
          },
          {
            'code': 'UIO',
            'description': 'Quito',
            'timezone': 'America/Guayaquil',
            'country': {
              'code': 'EC',
              'description': 'Ecuador',
            },
          },
          {
            'code': 'RIO',
            'description': 'Río de Janeiro',
            'timezone': 'America/Sao_Paulo',
            'country': {
              'code': 'BR',
              'description': 'Brasil',
            },
          },
          {
            'code': 'STX',
            'description': 'ST Croix Island',
            'timezone': 'America/Puerto_Rico',
            'country': {
              'code': 'PR',
              'description': 'Puerto Rico',
            },
          },
          {
            'code': 'STT',
            'description': 'ST Thomas',
            'timezone': 'America/Puerto_Rico',
            'country': {
              'code': 'PR',
              'description': 'Puerto Rico',
            },
          },
          {
            'code': 'SJO',
            'description': 'San José de Costa Rica',
            'timezone': 'America/Costa_Rica',
            'country': {
              'code': 'CR',
              'description': 'Costa Rica',
            },
          },
          {
            'code': 'SJU',
            'description': 'San Juan de Puerto Rico',
            'timezone': 'America/Puerto_Rico',
            'country': {
              'code': 'PR',
              'description': 'Puerto Rico',
            },
          },
          {
            'code': 'SBP',
            'description': 'San Luis Obispo',
            'timezone': 'US/Pacific',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
          {
            'code': 'SAL',
            'description': 'San Salvador',
            'timezone': 'America/El_Salvador',
            'country': {
              'code': 'SV',
              'description': 'El Salvador',
            },
          },
          {
            'code': 'SCL',
            'description': 'Santiago de Chile',
            'timezone': 'Chile/Continental',
            'country': {
              'code': 'CL',
              'description': 'Chile',
            },
          },
          {
            'code': 'SDQ',
            'description': 'Santo Domingo',
            'timezone': 'America/Santo_Domingo',
            'country': {
              'code': 'DO',
              'description': 'República Dominicana',
            },
          },
          {
            'code': 'SAO',
            'description': 'Sao Paulo',
            'timezone': 'America/Sao_Paulo',
            'country': {
              'code': 'BR',
              'description': 'Brasil',
            },
          },
          {
            'code': 'TBP',
            'description': 'Tumbes',
            'timezone': 'America/Lima',
            'country': {
              'code': 'PE',
              'description': 'Perú',
            },
          },
          {
            'code': 'WAS',
            'description': 'Washington DC',
            'timezone': 'US/Eastern',
            'country': {
              'code': 'US',
              'description': 'USA',
            },
          },
        ],
      },
      {
        'code': 'ES_COMM_AREA_AFRICA_M_EAST',
        'description': 'África y Oriente Medio',
        'cities': [
          {
            'code': 'ACC',
            'description': 'Accra',
            'timezone': 'Africa/Accra',
            'country': {
              'code': 'GH',
              'description': 'Ghana',
            },
          },
          {
            'code': 'ALG',
            'description': 'Argel',
            'timezone': 'Africa/Algiers',
            'country': {
              'code': 'DZ',
              'description': 'Argelia',
            },
          },
          {
            'code': 'BJL',
            'description': 'Banjul',
            'timezone': 'Africa/Banjul',
            'country': {
              'code': 'GM',
              'description': 'Gambia',
            },
          },
          {
            'code': 'CAS',
            'description': 'Casablanca',
            'timezone': 'Africa/Casablanca',
            'country': {
              'code': 'MA',
              'description': 'Marruecos',
            },
          },
          {
            'code': 'DKR',
            'description': 'Dakar',
            'timezone': 'Africa/Dakar',
            'country': {
              'code': 'SN',
              'description': 'Senegal',
            },
          },
          {
            'code': 'VIL',
            'description': 'Dakhla',
            'timezone': 'Africa/Casablanca',
            'country': {
              'code': 'MA',
              'description': 'Marruecos',
            },
          },
          {
            'code': 'CAI',
            'description': 'El Cairo',
            'timezone': 'Africa/Cairo',
            'country': {
              'code': 'EG',
              'description': 'Egipto',
            },
          },
          {
            'code': 'JNB',
            'description': 'Johannesburgo',
            'timezone': 'Africa/Johannesburg',
            'country': {
              'code': 'ZA',
              'description': 'Sudáfrica',
            },
          },
          {
            'code': 'RAK',
            'description': 'Marrakech',
            'timezone': 'Africa/Casablanca',
            'country': {
              'code': 'MA',
              'description': 'Marruecos',
            },
          },
          {
            'code': 'NKC',
            'description': 'Nuakchot',
            'timezone': 'Africa/Nuakchot',
            'country': {
              'code': 'MR',
              'description': 'Mauritania',
            },
          },
          {
            'code': 'ORN',
            'description': 'Orán',
            'timezone': 'Africa/Algiers',
            'country': {
              'code': 'DZ',
              'description': 'Argelia',
            },
          },
          {
            'code': 'SID',
            'description': 'Sal',
            'timezone': 'Africa/SAL ISLAND',
            'country': {
              'code': 'SN',
              'description': 'Senegal',
            },
          },
          {
            'code': 'TLV',
            'description': 'Tel Aviv',
            'timezone': 'Israel',
            'country': {
              'code': 'IL',
              'description': 'Israel',
            },
          },
          {
            'code': 'TNG',
            'description': 'Tánger',
            'timezone': 'Africa/Casablanca',
            'country': {
              'code': 'MA',
              'description': 'Marruecos',
            },
          },
        ],
      },
      {
        'code': 'ES_COMM_AREA_ASIA_OCEANIA',
        'description': 'Asia y Oceanía',
        'cities': [
          {
            'code': 'CSX',
            'description': 'Changshá',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'code': 'CKG',
            'description': 'Chongqing',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'code': 'HAK',
            'description': 'Haikou',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'code': 'SHA',
            'description': 'Shanghái',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'code': 'SZX',
            'description': 'Shenzhen',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'code': 'SIA',
            'description': 'Xi’an',
            'timezone': 'Asia/Shanghai',
            'country': {
              'code': 'CN',
              'description': 'China',
            },
          },
          {
            'id': '1476390690642',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_MUSEOS_MUSEODELPREADO.JPG' alt='Museo del Prado'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--red'>Museos</span><a href='javascript:void(0)' title='Museo del Prado' data-modal='button' data-modal-view='#activity_modal_1476390690642' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Museo del Prado</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390690642' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390690642' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'red',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Museo del Prado',
            'long': '-3.69224',
            'locate': 0,
            'modal': '#activity_modal_1476390690642',
            'lat': '40.41376',
          },
          {
            'id': '1476390690766',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_AIRELIBRE_PLAZADELAPAJA.JPG' alt='Plaza de la Paja'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Plaza de la Paja' data-modal='button' data-modal-view='#activity_modal_1476390690766' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Plaza de la Paja</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390690766' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390690766' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'blue',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Plaza de la Paja',
            'long': '-3.71148',
            'locate': 1,
            'modal': '#activity_modal_1476390690766',
            'lat': '40.41286',
          },
          {
            'id': '1476390690890',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_AIRELIBRE_CASADECAMPO.JPG' alt='Casa de Campo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Casa de Campo' data-modal='button' data-modal-view='#activity_modal_1476390690890' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Casa de Campo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390690890' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390690890' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'blue',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Casa de Campo',
            'long': '-3.72783126276852',
            'locate': 2,
            'modal': '#activity_modal_1476390690890',
            'lat': '40.4231635551382',
          },
          {
            'id': '1476390690890',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_AIRELIBRE_CASADECAMPO.JPG' alt='Casa de Campo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Casa de Campo' data-modal='button' data-modal-view='#activity_modal_1476390690890' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Casa de Campo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390690890' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390690890' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'blue',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Casa de Campo',
            'long': '-3.76289399999996',
            'locate': 3,
            'modal': '#activity_modal_1476390690890',
            'lat': '40.409443',
          },
          {
            'id': '1476390690890',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_AIRELIBRE_CASADECAMPO.JPG' alt='Casa de Campo'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Casa de Campo' data-modal='button' data-modal-view='#activity_modal_1476390690890' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Casa de Campo</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390690890' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390690890' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'blue',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Casa de Campo',
            'long': '-3.75287000000003',
            'locate': 4,
            'modal': '#activity_modal_1476390690890',
            'lat': '40.411078',
          },
          {
            'id': '1476390691044',
            'content': "<div data-card-guides='group-0' data-type='body' class='ibe-card-guides undefined'><figure class='ibe-card-guides__image'><img src='/wcs/imagenes/guias/MADRID/MADRID_AIRELIBRE_PLAZAMAYOR.JPG' alt='Plaza Mayor'></figure><div class='ibe-card-guides__body fc-calculated' style='width: 232px;'><div class='ibe-card-guides__header'><span class='ibe-card-guides__theme ibe-legend-map__marker--blue'>Aire libre</span><a href='javascript:void(0)' title='Plaza Mayor' data-modal='button' data-modal-view='#activity_modal_1476390691044' class='ibe-card-guides__title--link'><span class='title title__h3 ibe-card-guides__title--icon'>Plaza Mayor</span></a></div></div><div class='ibe-card-guides__footer'><a href='#' id='TAB2_activity_del_1476390691044' title='Eliminar plan' class='link link__regular link__regular--important activity_action'>Eliminar plan</a><a href='#' id='TAB2_activity_add_1476390691044' title='Agregar plan' class='link link__regular link__regular--important activity_action'>Agregar plan</a></div></div>",
            'icon': 'blue',
            'categoria': '[Que ver, Que hacer]',
            'title': 'Plaza Mayor',
            'long': '3.7074',
            'locate': 5,
            'modal': '#activity_modal_1476390691044',
            'lat': '40.41536',
          },
        ],
      },
    ];

    exampleChart = {
      list: [
        {"month" : "Enero","media" : "5","max" : "10","min" : "1","form" : "°","icon" : "snow"},
        {"month" : "Febrero","media" : "6","max" : "11","min" : "1","form" : "°","icon" : "rain"},
        {"month" : "Marzo","media" : "9","max" : "15","min" : "4","form" : "°","icon" : "rain"},
        {"month" : "Abril","media" : "12","max" : "18","min" : "6","form" : "°","icon" : "cloud"},
        {"month" : "Mayo","media" : "17","max" : "23","min" : "10","form" : "°","icon" : "sun"},
        {"month" : "Junio","media" : "23","max" : "29","min" : "16","form" : "°","icon" : "sun"},
        {"month" : "Julio","media" : "26","max" : "32","min" : "19","form" : "°","icon" : "sun"},
        {"month" : "Agosto","media" : "26","max" : "32","min" : "19","form" : "°","icon" : "sun"},
        {"month" : "Septiembre","media" : "21","max" : "27","min" : "15","form" : "°","icon" : "rain"},
        {"month" : "Octubre","media" : "15","max" : "20","min" : "10","form" : "°","icon" : "cloud"},
        {"month" : "Noviembre","media" : "9","max" : "13","min" : "5","form" : "°","icon" : "rain"},
        {"month" : "Diciembre","media" : "6","max" : "10","min" : "2","form" : "°","icon" : "snow"}
      ]
    };

    // NO copy paste in imputs text
    $('[data-no-paste]').on('paste', function (e) {
      e.preventDefault();
      //-alert('Esta acción está prohibida');
    });

    $('[data-no-copy]').on('copy', function (e) {
      e.preventDefault();
      //-alert('Esta acción está prohibida');
    });

    dFrontJs.ibe_datatable.loadJson(cities_default, cities_default);

    if ($('[data-autocomplete="cities"]').length > 0) {
      // dFrontJs.ibe_autocomplete.init(selector, json);  //Inicializar jquery ui autocomplete

      dFrontJs.ibe_autocomplete.init('[data-autocomplete="cities"]', cities_default);


    //   dFrontJs.ibe_autocomplete.init('[data-autocomplete="airports"]', getJson.airports);
      dFrontJs.ibe_autocomplete.init('#flight_origin', cities_default);
      dFrontJs.ibe_autocomplete.init('#flight_destiny', cities_default2);
    }
    if ($('.ibe-choose-city').length > 0) {
    //   dFrontJs.ibe_searcher_choose_city.init(selector, json);  //Inicializar city list Constructor
      dFrontJs.ibe_searcher_choose_city.init($('[data-autocomplete="cities"]'), cities_default);
      dFrontJs.ibe_searcher_choose_city.init('#flight_origin', cities_default);
      dFrontJs.ibe_searcher_choose_city.init('#flight_destiny', cities_default3);

      dFrontJs.ibe_searcher_choose_city.init('#flight_hotel_origin', cities_default3);
      dFrontJs.ibe_searcher_choose_city.init('#flight_hotel_destiny', cities_default2);

      dFrontJs.ibe_searcher_choose_city.init('#flight_car_origin', cities_default3);
      dFrontJs.ibe_searcher_choose_city.init('#flight_car_destiny', cities_default2);


      //Start in stopover cities

      dFrontJs.ibe_searcher_choose_city.init('#flight_origin_stop', cities_default);
      dFrontJs.ibe_searcher_choose_city.init('#flight_destiny_stop', cities_default3);

      //START IN TRAVEL GUIDE
			
      dFrontJs.ibe_searcher_choose_city.init('[data-modal-view=".fc-dialog-all-destinations"]', cities_default);
    }

    if ($('[data-chart="simple"]').length > 0) {
      dFrontJs.ibe_chart.createChart('#example1', exampleChart);
    }

    if ($('[data-chart="simple"]').length > 0) {
      dFrontJs.ibe_chart.createAdvancedChart('#chartTemp', exampleChart);
    }

    if (mobile) {
      dFrontJs.ibe_searcher_accordion_mobile.init();
      dFrontJs.ibe_bootstrap_collapse.hideCollapse('[data-collapse="hide-resize"]');
      dFrontJs.ibe_inputs.init();
    }

    //Mover check avios en el buscador de puente aereo
    // Relanzar el calendar cuando pulsemos en los tabs (por ejemplo el caso de buscador avanzado cuando no estamos en la primera tab de inicio
    if ($('.ibe-advanced-searcher').length > 0) {
      var event = new Event('tabClick');
      $("[data-tab='bootstrap-tabdrop']")[0].addEventListener('tabClick', function () {
        requestAnimFrame(function () {
          dFrontJs.ibe_searcher_calendar.init();
        })
      }, false);

      $("[data-tab='bootstrap-tabdrop']").on('click', function () {
        var $this = $(this);
        $this[0].dispatchEvent(event);
      });
    }

    //Mover check avios en el buscador de puente aereo
    if ($('.ibe-advanced-searcher__puente').length > 0) {
      dFrontJs.ibe_searcher_calendar.moveCheckAviosPuente()
    }

    if ($('[data-isotipo]').length > 0) {
      dFrontJs.app.isotipoLoadinInput();
    }
  }


  // CONTROLER IBE-COMPONENTS

  var loadController = function () {
    var cssLoadEvent = new CustomEvent('cssLoadEvent');

    var loadjscssController = function (filename, filetype, elemt, onload) {
      var fileref;
      if (filetype === 'css') { //if filename is an external CSS file
        fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', filename);
        fileref.onload = function () {
          onload(elemt)
        };
      } else if (filetype === 'js') { //if filename is a external JavaScript file
        fileref = document.createElement('script');
        fileref.setAttribute('type', 'text/javascript');
        fileref.setAttribute('src', filename);
        fileref.onload = function () {
          onload(elemt)
        };
      }
      if (typeof fileref != 'undefined')
        document.getElementsByTagName('head')[0].appendChild(fileref);
    };
    var animat = function (elemt) {
      var pos = 1;
      if (elemt && elemt.style.opacity === '0') {
        var toview = function () {
          //console.log("pos:"+pos);
          if (pos < 10) {
            elemt.style.opacity = '0.' + pos;
            //console.log("animdoing");
            pos += 3;
          } else {
            //console.log("animinterval");
            elemt.style.removeProperty('opacity');
            clearInterval(interv);
          }
        };
        var interv = setInterval(toview, 30);
        /*elemt.style.opacity ='0';
				elemt.style.transition= 'opacity .25s ease-in-out';
				elemt.style.MozTransition = 'opacity .25s ease-in-out';
				elemt.style.WebkitTransition = 'opacity .25s ease-in-out';*/
      }
    };
    var doload = true;
    var getOffsetTop = function(element) {
      var offsetTop = 0;
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      return offsetTop;
    };
    var checkScroll = function () {
      doload = true;
      //console.log("interval");
    };
    var refreshDoLoad = setInterval(checkScroll, 500);

    var loadCssJs = function () {
      if (doload) {
        //console.log("doload");
        doload = false;
        var list = document.querySelectorAll('[data-css]');
        var currentScrollPosition = document.documentElement.scrollTop;
        //need for any IE work solution
        NodeList.prototype.forEach = Array.prototype.forEach;
        if (list.length > 0) {
          list.forEach(function (elemt) {
            // console.log(elemt.dataset)
            //get current scroll postion absolute.
            var elemAbsolutePosition = getOffsetTop(elemt);
            if (elemAbsolutePosition <= (currentScrollPosition + 1000) || elemAbsolutePosition < 2000) {
              if (elemt.dataset.css) {
                elemt.dataset.css.split(',').forEach(function (toLoad) {
                  if (null === document.querySelector('link[href*="' + toLoad + '"]')) {
                    // console.log('css: ',toLoad)
                    loadjscssController(toLoad + '.css', 'css', elemt, animat);
                    // Disparar event.
                    elemt.dispatchEvent(cssLoadEvent);
                  }
                });
              }
              // elemt.addEventListener('cssLoadEvent', function () {
              // console.log('entra cssLoadEvent')
              if (elemt.dataset.js && null === document.querySelector('script[src*="' + elemt.dataset.js + '"]')) {
                // console.log(elemt.dataset.js)
                loadjscssController(elemt.dataset.js + '.js', 'js', elemt, animat);
              }
              elemt.removeAttribute('data-css');//This has to be outside of the condition, cos it can be already loaded.
              elemt.removeAttribute('data-js');
              // });
            }
          });
        } else {
          window.removeEventListener('scroll', loadCssJs);
          clearInterval(refreshDoLoad);
        }
      }
    };
    loadCssJs();
    if (document.querySelector('[data-css]')) { //If still there are some not already loaded.
      window.addEventListener('scroll', loadCssJs);
    } else {
      clearInterval(refreshDoLoad);
    }
  };

  loadController();


  // END CONTROLER IBE-COMPONENTS

  if ($('[data-read-more="button"]').length > 0){
    dFrontJs.ibe_read_more.open('#prueba3');
  }
});
