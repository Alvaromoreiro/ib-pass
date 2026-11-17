// eslint-disable-next-line import/no-unresolved
//import { retrieveSeeker } from './ibe_seekerStopOVer';
import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';
const { quadrigam } = retrieveGlobalVariables();
// eslint-disable-next-line func-names
$(document).ready(() => {
    //Evento view
    digital_data.Quadrigam = quadrigam;
    updateDigitalData('view');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nameFilter = urlParams.get('cat');
    
    // Add click accordeon FAQs frequest questions
    const childrenReserv = document.querySelector('.reservaClick');

    if(childrenReserv != null){
      const fatherReserv = childrenReserv.parentNode;
      const idFatherReserv = fatherReserv.id;
  
      const codePF = urlParams.get('codigo');
      if (codePF != null) {
        if($('[data-target="#' + idFatherReserv + '"]')[0]!=undefined){
          $('[data-target="#' + idFatherReserv + '"]')[0].click();
        }
      }
    }

    if (nameFilter != null) {
        $(`[data-function='filter-stopoverpartner']`).find(':input[data-info], a[data-info]').each(function ech() {
            // eslint-disable-next-line eqeqeq
            if (nameFilter != $(this).attr('name')) {
                $(this).click();
            }
        });
    }

    /*Contador de cards experiencias*/
    function countCardsFilter(){
        var total = $('.ibe-card-guides').length;
        $('#all').parent().find("label").text($('#all').parent().find("label").text() + ' ('+total+')');

        $(".ibe-filter__check").each(function () {
            var category = $(this).attr("data-info");
            if (category !== "all" && category !== undefined) {
                var cantidad = $("[data-filtertags='" + category + "']").length;
                $(this).parent().find("label").text($(this).parent().find("label").text() + ' ('+cantidad+')');
            }
        });
    }

    /*Función iniciador filtros*/
    function initFilterTabs(){
        countCardsFilter();
        /*Solo se marca inicialmente el filtro de 'Todos'*/
        $(".ibe-filter__check").each(function (){
            var category = $(this).attr("data-info");
            if (category !== "all" && category !== undefined){
             $(this).prop("checked", false);
            }
        });
    }
    
    if ($('[data-function="filter-stopoverpartner"]').length > 0){

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
        let activeFiltersCards = [];
            const showDesiredCards = () => {
                const desiredCards = total + (total * timesAddedMore);
                // Cards we can show initially given the selected filters
                const cardsToShowInitially = activeFiltersCards.slice(0, desiredCards);
                // Cards we will show if the user clicks on the button to load more
                const cardsToShowLater = activeFiltersCards.slice(desiredCards);
                cardsToShowInitially.map((card) => $(card).css('display', 'list-item')); // <li>
                    cardsToShowLater.map((card) => $(card).css('display', 'none'));
                    if (cardsToShowLater.length > 0) {
                        $('[data-show-more-button="grid-01"]').removeClass('hidden');
                    } else {
                        $('[data-show-more-button="grid-01"]').addClass('hidden');
                    }
            };
            const setActiveFiltersCards = () => {
                //comprobamos sí el filtro de 'Todos' está marcado
                if($('#all').prop("checked")){
                      // Array de todas las cards de experiencias
                      const allCards = Array.from(document.querySelectorAll('.ibe-grid__feature ')); //  <li>
                      // Array de las cards pertenecientes a los filtros activos
                      activeFiltersCards = allCards.filter((card) => ((card.childNodes[0].getAttribute('data-filtertags')) !== undefined && (card.childNodes[0].getAttribute('data-filtertags')).length > 0));
                }else{
                    // Array de todos los filtros activos
                    const activeFiltersElements = Array.from(document.querySelectorAll('.ibe-filter__main-item')).filter((f) => f.childNodes[0].checked);
                    const activeFilters = activeFiltersElements.map((e) => e.childNodes[0].value);
                    // Array de todas las cards de experiencias
                    const allCards = Array.from(document.querySelectorAll('.ibe-grid__feature ')); //  <li>
                    // Array de las cards pertenecientes a los filtros activos
                    activeFiltersCards = allCards.filter((card) => activeFilters.includes(card.childNodes[0].getAttribute('data-filtertags')));
                    // Array de las cards pertenecientes a los filtros inactivos
                    const inactiveFiltersCards = allCards.filter((card) => !activeFilters.includes(card.childNodes[0].getAttribute('data-filtertags')));
                    // Hide
                    inactiveFiltersCards.map((card) => $(card).css('display', 'none'));
                }
                // So: activeFiltersCards + inactiveFiltersCards = allCards.
                showDesiredCards();
            };
            const loadMoreCards = () => {
                firstShowValue = parseInt(total) + (parseInt(total) * timesAddedMore) + hiddenItems;
                timesAddedMore++;
                let newTotal = firstShowValue + parseInt(isMobile ? numberMobile : number) + hiddenItems;
                $('[data-show-more="' + container + '"] li:nth-child(-n+' + newTotal + ')').slideDown('slow', function () {
                    // Animation complete
                    if ($('[data-show-more] li').length <= newTotal) {
                    $('[data-show-more-button="' + container + '"]').hide();
                    }
                    if ($(this).index() === firstShowValue) {
                    scroll({
                        top: this.offsetTop,
                        behavior: "smooth"
                    });
                    }
                });
                setActiveFiltersCards();
            }

            //init cards landing
            initFilterTabs();
            setActiveFiltersCards();
            $('.ibe-filter__main-item').click(function () {
                const filterSelected = $(this).find(':input').attr('value');
                let totalFiltros = $('.ibe-filter__main-item').length - 1;
                let contador = 0;
                //Comprobamos que cuando se marque algun filtro distinto de todos desmarquemos el filtro 'todos'
                //Pero Cuando se marquen todos los filtros que no sean todos, se marca todos y se desmarcan los demas
                if('all' !== filterSelected && undefined !== filterSelected){
                    $(".ibe-filter__check").each(function (){
                        var category = $(this).attr("data-info");
                        if (category !== "all" && $(this).prop("checked") === true && undefined !== category){
                            contador ++;
                        }
                    });

                    if(contador === totalFiltros){
                      $('#all').prop("checked", true);
                      //se desmarcan todos los que no sean 'all'
                        $(".ibe-filter__check").each(function (){
                            var category = $(this).attr("data-info");
                            if (category !== "all" && $(this).prop("checked") === true && undefined !== category){
                                $(this).prop("checked", false);
                            }
                        });
                    }else{
                      $('#all').prop("checked", false);
                    }
                }
                //Cuando se marque el filtro todos, se desmarcan el resto
                if('all' === filterSelected && undefined !== filterSelected){
                    //se desmarcan todos los que no sean 'all'
                      $(".ibe-filter__check").each(function (){
                        var category = $(this).attr("data-info");
                        if (category !== "all" && undefined !== category){
                            $(this).prop("checked", false);
                        }
                    });
                }

                setActiveFiltersCards();
            });
            if(container.length > 0) {
                $('[data-show-more-button="' + container + '"]').on('click', loadMoreCards);
            }
        }
});

$('#doStopOver').on('click', () => {
    if ($('#searchStopOver').is(':hidden')) {
        $('.ibe-search-compact__searcher-stopOver').addClass('hidden');
        $('#searchStopOver').show('slow', () => {
        });
        $('#searchStopOver').addClass('showSearch');
    }
});

$(document).on('click', (event) => {
    let clickedElement; let clickedParent;
    // eslint-disable-next-line prefer-const
    clickedElement = event.target;
    // eslint-disable-next-line prefer-const
    clickedParent = clickedElement.closest('.fc-searcher-detector');

    if (clickedParent === null) {
        if ($('#searchStopOver').hasClass('showSearch')) {
            $('#searchStopOver').removeClass('showSearch');
            $('#searchStopOver').hide('slow', () => {
                $('.ibe-search-compact__searcher-stopOver').removeClass('hidden');
            });
        }
    }
});


//anchor to email HMFAQS
if('HMFAQS' === quadrigam){
   if(window.location.hash){
        var anchor = window.location.hash;
        var accordion_selector = $(anchor);
        accordion_selector.click();
   }
}
// retrieveSeeker('#searchStopOver'); // Compact Sear

//Metrica botones landing experiencias
//Carrusel -> enlace ver ficha
$('.experience-file').click(function () {
    var title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias',
        eventAction: 'clic',
        eventLabel: 'ver ficha: ' + title,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });
  //Carrusel -> enlace imagen
  $('.experience-image').click(function () {
    var title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias',
        eventAction: 'clic',
        eventLabel: 'imagen ficha: ' + title,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });
  //Carrusel -> enlace titulo
  $('.experience-title').click(function () {
    var title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias',
        eventAction: 'clic',
        eventLabel: 'titulo ficha: ' + title,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });

  //Filtrar -> TODOS
  $('.ibe-one-option__list-item a[title="TODOS"]').click(function () {
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias"',
        eventAction: 'clic',
        eventLabel: 'filtrar: todos',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });
  //Filtrar -> FILTRAR
    $('.ibe-one-option__list-item a[title="FILTRAR"]').click(function () {
        const eventData = {
            eventName: 'interaccion',
            eventCategory: 'hm landing experiencias"',
            eventAction: 'clic',
            eventLabel: 'filtrar: filtrar',
        };
        if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventData);
        }
        if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventData, { event: 'interaction' });
        }
      });
  //Filtrar -> Click input filtro
  $('.ibe-filter__check').click(function () {
    var title = $(this).val();
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias',
        eventAction: 'clic',
        eventLabel: 'filtro: ' + title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });
  
  //Seccion -> ¿Necesitas recomendación para tus planes?
  $('.experience-reco-dudas').click(function (){
    var title = $(this).html();
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hm landing experiencias',
        eventAction: 'clic',
        eventLabel: title.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
  });
  
  //Fin metrica landing experiencias
 