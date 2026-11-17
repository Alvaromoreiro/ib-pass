import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';

const { quadrigam } = retrieveGlobalVariables();

$(document).ready(() => {
    // Redirección a la pestaña correspondiente a través del ancla
    // Obtener el ancla de la URL
    const url = window.location.href;
    const anclaSO = url.split('#')[1];
    // Si hay un ancla, se ejecuta la función clickPestaña
    if (anclaSO && anclaSO.startsWith('tab-')) {
        // eslint-disable-next-line no-use-before-define
        clickTabSO(anclaSO);
    }

    // Tab faqs + codigo de reserva
    const urlFaqs = new URLSearchParams(window.location.search);
    const codigo = urlFaqs.get('codigo');

    if (codigo) {
        const $reservaClick = $('.reservaClick').first();
        if ($reservaClick.length !== 0) {
            const $padre = $reservaClick.closest('[id]');
            if ($padre.length !== 0) {
                const idPadre = $padre.attr('id');
                const $tabTarget = $(`[data-target="#${idPadre}"]`);
                if ($tabTarget.length > 0) {
                    $tabTarget.first().trigger('click');
                }
            }
        }
    }

    // Pestaña experiencias
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const nameFilter = urlParams.get('cat');

    if (nameFilter != null) {
        $('[data-function=\'filter-stopoverpartner\']').find(':input[data-info], a[data-info]').each(function ech() {
            // eslint-disable-next-line eqeqeq
            if (nameFilter != $(this).attr('name')) {
                $(this).trigger('click');
            }
        });
    }
    /* Contador de cards experiencias */
    function countCardsFilter() {
        const total = $('.ibe-card-container .ibe-card-guides').length;
        $('#all').parent().find('label').text(`${$('#all').parent().find('label').text()} (${total})`);

        // eslint-disable-next-line func-names
        $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
            const category = $(this).attr('data-info');
            if (category !== 'all' && category !== undefined) {
                const cantidad = $('.ibe-card-container').find(`[data-filtertags='${category}']`).length;
                $(this).parent().find('label').text(`${$(this).parent().find('label').text()} (${cantidad})`);
            }
        });
    }

    /* Función iniciador filtros */
    function initFilterTabs() {
        countCardsFilter();
        /* Solo se marca inicialmente el filtro de 'Todos' */
        // eslint-disable-next-line func-names
        $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
            const category = $(this).attr('data-info');
            if (category !== 'all' && category !== undefined) {
                $(this).prop('checked', false);
            }
        });
    }
    /* Funcionalidad filtros experiencias */
    if ($('[data-function="filter-stopoverpartner"]').length > 0) {
        const isMobile = window.innerWidth < 768;
        const cardContainer = $('.ibe-card-container');
        const container = cardContainer.attr('data-show-more');
        const actives = cardContainer.attr('data-show-more-init'); // cantidad inicial que muestra
        const activesMobile = cardContainer.attr('data-show-more-init-mobile'); // cantidad inicial que muestra
        const number = cardContainer.attr('data-show-more-number'); // cantidad de card que se muestra al hacer clik
        const numberMobile = cardContainer.attr('data-show-more-number-mobile'); // cantidad de card que se muestra al hacer clik
        // eslint-disable-next-line radix
        const total = parseInt(isMobile ? activesMobile : actives);
        const hiddenItems = 0;
        let timesAddedMore = 0;
        let firstShowValue = 0;
        let activeFiltersCards = [];
        const showDesiredCards = () => {
            const desiredCards = total + (total * timesAddedMore);
            // Cards we can show initially given the selected filters
            const cardsToShowInitially = activeFiltersCards.slice(0, desiredCards);
            // Cards we will show if the user clicks on the button to load more
            const cardsToShowLater = activeFiltersCards.slice(desiredCards);
            cardsToShowInitially.map((card) => $(card).css('display', 'block')); // <li>
            cardsToShowLater.map((card) => $(card).css('display', 'none'));
            if (cardsToShowLater.length > 0) {
                $('[data-show-more-button="grid-01"]').removeClass('hidden');
            } else {
                $('[data-show-more-button="grid-01"]').addClass('hidden');
            }
        };
        const setActiveFiltersCards = () => {
            // comprobamos sí el filtro de 'Todos' está marcado
            if ($('#all').prop('checked')) {
                // Array de todas las cards de experiencias
                const allCards = Array.from(document.querySelectorAll('.ibe-card-container .ibe-grid__feature')); //  <li>
                // Array de las cards pertenecientes a los filtros activos
                activeFiltersCards = allCards.filter((card) => ((card.childNodes[0].getAttribute('data-filtertags')) !== undefined && (card.childNodes[0].getAttribute('data-filtertags')).length > 0));
            } else {
                // Array de todos los filtros activos
                const activeFiltersElements = Array.from(document.querySelectorAll('.ibe-filter__main-item')).filter((f) => f.childNodes[0].checked);
                const activeFilters = activeFiltersElements.map((e) => e.childNodes[0].getAttribute('data-info'));
                // Array de todas las cards de experiencias
                const allCards = Array.from(document.querySelectorAll('.ibe-card-container .ibe-grid__feature')); //  <li>
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
            // eslint-disable-next-line radix
            firstShowValue = parseInt(total) + (parseInt(total) * timesAddedMore) + hiddenItems;
            timesAddedMore++;
            // eslint-disable-next-line radix, max-len
            const newTotal = firstShowValue + parseInt(isMobile ? numberMobile : number) + hiddenItems;
            // eslint-disable-next-line func-names
            $(`[data-show-more="${container}"] li:nth-child(-n+${newTotal})`).slideDown('slow', function () {
                // Animation complete
                if ($('[data-show-more] li').length <= newTotal) {
                    $(`[data-show-more-button="${container}"]`).hide();
                }
                if ($(this).index() === firstShowValue) {
                // Obtener la altura del elemento ficha
                    const altura = $('.ibe-card-guides').first().outerHeight();
                    // eslint-disable-next-line no-restricted-globals
                    scroll({
                        top: $(this).offset().top - altura,
                        behavior: 'smooth',
                    });
                }
            });
            setActiveFiltersCards();
        };

        // init cards landing
        initFilterTabs();
        setActiveFiltersCards();
        // eslint-disable-next-line func-names
        $('.ibe-stopover-tabs--experiences-filter .ibe-filter__main-item').on('click', function () {
            const filterSelected = $(this).find(':input').attr('value');
            const totalFiltros = $('.ibe-stopover-tabs--experiences-filter .ibe-filter__main-item').length - 1;
            let contador = 0;
            // eslint-disable-next-line max-len
            // Comprobamos que cuando se marque algun filtro distinto de todos desmarquemos el filtro 'todos'
            // eslint-disable-next-line max-len
            // Pero Cuando se marquen todos los filtros que no sean todos, se marca todos y se desmarcan los demas
            if (filterSelected !== 'all' && undefined !== filterSelected) {
                // eslint-disable-next-line func-names
                $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
                    const category = $(this).attr('data-info');
                    if (category !== 'all' && $(this).prop('checked') === true && undefined !== category) {
                        contador++;
                    }
                });

                if (contador === totalFiltros) {
                    $('#all').prop('checked', true);
                    // se desmarcan todos los que no sean 'all'
                    // eslint-disable-next-line func-names
                    $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
                        const category = $(this).attr('data-info');
                        if (category !== 'all' && $(this).prop('checked') === true && undefined !== category) {
                            $(this).prop('checked', false);
                        }
                    });
                } else {
                    $('#all').prop('checked', false);
                }
            }
            // Cuando se marque el filtro todos, se desmarcan el resto
            if (filterSelected === 'all' && undefined !== filterSelected) {
                // se desmarcan todos los que no sean 'all'
                // eslint-disable-next-line func-names
                $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
                    const category = $(this).attr('data-info');
                    if (category !== 'all' && undefined !== category) {
                        $(this).prop('checked', false);
                    }
                });
            }

            setActiveFiltersCards();
        });
        if (container.length > 0) {
            $(`[data-show-more-button="${container}"]`).on('click', loadMoreCards);
        }
        // Boton Categoria específica de experiencias
        // eslint-disable-next-line func-names
        $('[data-categoria]').each(function () {
            const id = $(this).attr('id');
            const elemen = document.getElementById(id);
            // eslint-disable-next-line no-use-before-define
            elemen.addEventListener('click', () => { categoriaSeleccionada(elemen); });
        });

        // eslint-disable-next-line no-inner-declarations
        function categoriaSeleccionada(elemen) {
            const cat = elemen.getAttribute('id').replace('filter-', '').replace('categoria-', '');
            const homeOutSection = document.getElementById('home-out-section');
            const experiencesOutSection = document.getElementById('experiences-out-section');
            const faqsOutSection = document.getElementById('faqs-out-section');
            const planesOutSection = document.getElementById('plans-out-section');
            homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
            homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
            experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-add-section');
            experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-remove-section');
            faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
            faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
            planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
            planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

            $('.ibe-carousel').slick('refresh');
            $('.ibe-wall-carousel').slick('refresh');
            $('#tab-exp > a').trigger('click');
            $(`#filter-${cat}`).trigger('click');
            // se desmarcan todos los filtros que no sean el seleccionado
            // eslint-disable-next-line func-names
            $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
                const category = $(this).attr('data-info');
                if (category !== cat && $(this).prop('checked') === true && undefined !== category) {
                    $(this).prop('checked', false);
                }
            });
            setActiveFiltersCards();

            // GA4 categoria especifica
            let namecategory = 'stopover tab stopover';
            if (elemen && elemen.closest('#home-out-section')) {
                namecategory = 'stopover tab stopover';
            }
            if (elemen && elemen.closest('#experiences-out-section')) {
                namecategory = 'stopover tab experiencias';
            }
            if (elemen && elemen.closest('#plans-out-section')) {
                namecategory = 'stopover tab planes recomendados';
            }
            if (elemen && elemen.closest('#faqs-out-section')) {
                namecategory = 'stopover tab preguntas frecuentes';
            }

            let title = elemen.outerText;
            title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
            const eventData = {
                eventName: 'interaccion',
                eventCategory: namecategory,
                eventAction: 'clic',
                eventLabel: `categoria: ${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
            };
            if (typeof (window.DigitalChange) !== 'undefined') {
                window.DigitalChange('interaction', eventData);
            }
            if (typeof (window.dataLayer) !== 'undefined') {
                window.dataLayer.push(eventData, { event: 'interaction' });
            }
        }
        // Anchor to category filters from MMB
        const hashCategory = window.location.hash.replace('#', '');
        if (hashCategory && hashCategory.startsWith('filter-')) {
            const elemenCategoryUrl = document.getElementById(hashCategory);
            categoriaSeleccionada(elemenCategoryUrl);
        }
    }

    // Inicialización filtro todos planes recomendados
    $('#filter-todos').prop('checked', true);

    // eslint-disable-next-line max-len
    // Detectar tab activo al cargar la pagina para evitar problemas por clics antincipados en stopover
    const $activeTabLi = $('.ibe-tab__menu-item.active');

    if ($activeTabLi.length > 0) {
        const tabKey = $activeTabLi.attr('id');
        // eslint-disable-next-line no-use-before-define
        activateTab(tabKey);
    }
});

function setStopOverCookie(value) {
    const date = new Date();
    const exDate = date.setTime(date.getTime() + 3650);
    Cookies.set('HOLA_MADRID', value, {
        path: '/',
        expires: exDate,
        sameSite: 'strict',
    });
}

function getStoredStopOverData() {
    try {
        const parsed = JSON.parse(localStorage.getItem('stopOverData') || 'null');
        return (parsed && parsed.locator && parsed.surname) ? parsed : null;
    } catch {
        localStorage.removeItem('stopOverData');
        return null;
    }
}

// Login stopover desde flujo MMB
window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    let pnr = params.get('pnr');
    const name = params.get('surname');

    if (pnr && name) {
        pnr = pnr.toUpperCase();
        const storedData = getStoredStopOverData();

        if (storedData && storedData.locator === pnr) {
            // ya tenemos datos, guardamos promesa resuelta
            setStopOverCookie('true');
            window.dispatchEvent(new CustomEvent('stopOverDataChanged', { detail: storedData }));
        } else {
            const parsedData = { locator: pnr, surname: name };
            setStopOverCookie('true');
            localStorage.setItem('stopOverData', JSON.stringify(parsedData));
            window.dispatchEvent(new CustomEvent('stopOverDataChanged', { detail: parsedData }));
        }
    }
});

// eslint-disable-next-line no-shadow
function clickTabSO(anclaSO) {
    const selectorTab = `#${anclaSO} > a`;
    $(selectorTab).trigger('click');
}

// Comprobador que corre cada medio segundo (500 ms) el valor de la cookie HM
setInterval(() => {
    const cookieValue = Cookies.get('HOLA_MADRID');
    if (cookieValue === 'true') {
        $('.ibe-steps-stopover').addClass('hidden');
    } else {
        $('.ibe-steps-stopover').removeClass('hidden');
        $('.ibe-carousel').slick('refresh');
    }
}, 500);

// Comprobador que corre cada medio segundo (500 ms) el valor de la cookie SEE_BENEFITS_COOKIE
setInterval(() => {
    const cookieValue = Cookies.get('SEE_BENEFITS_COOKIE');
    if (cookieValue === 'true') {
        $('.tab2fromCarrusel').trigger('click');
        // Borrar la cookie
        Cookies.remove('SEE_BENEFITS_COOKIE');
    }
}, 500);

// Función para activar pestaña visual y funcionalmente tabs stopover
function activateTab(tabKey) {
    switch (tabKey) {
            case 'tab-home':
                if ($('#home-out-section').css('display') === 'none') {
                    // eslint-disable-next-line no-use-before-define
                    handleTabHome();
                }
                break;
            case 'tab-exp':
                if ($('#experiences-out-section').css('display') === 'none') {
                    // eslint-disable-next-line no-use-before-define
                    handleTabExperiences();
                }
                break;
            case 'tab-plans':
                if ($('#plans-out-section').css('display') === 'none') {
                    // eslint-disable-next-line no-use-before-define
                    handleTabPlans();
                }
                break;
            case 'tab-asks':
                if ($('#faqs-out-section').css('display') === 'none') {
                    // eslint-disable-next-line no-use-before-define
                    handleTabAsks();
                }
                break;
            // eslint-disable-next-line no-fallthrough
            default:
                break;
    }
}

// Funciones por cada pestaña
function handleTabHome() {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab stopover',
        eventAction: 'clic',
        eventLabel: 'tab: stopover',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
}

function handleTabExperiences() {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-add-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-remove-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab experiencias',
        eventAction: 'clic',
        eventLabel: 'tab: experiencias',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
}

function handleTabPlans() {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-remove-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-add-section');

    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');

    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'tab: planes recomendados',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
}

function handleTabAsks() {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-remove-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-add-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab preguntas frecuentes',
        eventAction: 'clic',
        eventLabel: 'tab: preguntas frecuentes',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
}

// Clicks pestañas
$('#tab-home').on('click', () => {
    // Evita volver a activar la misma pestaña
    if (!$(this).hasClass('active')) {
        handleTabHome();
    }
});

$('#tab-exp').on('click', () => {
    // Evita volver a activar la misma pestaña
    if (!$(this).hasClass('active')) {
        handleTabExperiences();
    }
});

$('#tab-plans').on('click', () => {
    // Evita volver a activar la misma pestaña
    if (!$(this).hasClass('active')) {
        handleTabPlans();
    }
});

$('#tab-asks').on('click', () => {
    // Evita volver a activar la misma pestaña
    if (!$(this).hasClass('active')) {
        handleTabAsks();
    }
});

// Planes recomendados clicks
$('#filter-todos').on('click', () => {
    const todos = document.getElementById('filter-todos');
    const days1 = document.getElementById('days1');
    const days2 = document.getElementById('days2');
    const days3 = document.getElementById('days3');

    if (todos.checked) {
        days1.checked = false;
        days2.checked = false;
        days3.checked = false;
        const ruta1day = document.getElementById('plans-1day');
        const ruta2day = document.getElementById('plans-2day');
        const ruta3day = document.getElementById('plans-3day');
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day');
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day-hidden');
        // eslint-disable-next-line no-use-before-define
        addSeparator(2);
    } else {
        todos.checked = true;
    }
    const event = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'filtrar: todos',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', event);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(event, { event: 'interaction' });
    }
});

$('#days1').on('click', () => {
    // eslint-disable-next-line no-use-before-define
    clickDayFilter(1);
    const event = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'filtrar: tab 1 dia',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', event);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(event, { event: 'interaction' });
    }
});
$('#days2').on('click', () => {
    // eslint-disable-next-line no-use-before-define
    clickDayFilter(2);
    const event = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'filtrar: tab 2 dias',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', event);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(event, { event: 'interaction' });
    }
});
$('#days3').on('click', () => {
    // eslint-disable-next-line no-use-before-define
    clickDayFilter(3);
    const event = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'filtrar: tab 3 dias',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', event);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(event, { event: 'interaction' });
    }
});

function clickDayFilter(day) {
    const todos = document.getElementById('filter-todos');
    const days1 = document.getElementById('days1');
    const days2 = document.getElementById('days2');
    const days3 = document.getElementById('days3');
    const ruta1day = document.getElementById('plans-1day');
    const ruta2day = document.getElementById('plans-2day');
    const ruta3day = document.getElementById('plans-3day');
    if (!days1.checked && !days2.checked && !days3.checked && !todos.checked) {
        if (day === 1) {
            days1.checked = true;
        } else if (day === 2) {
            days2.checked = true;
        } else {
            days3.checked = true;
        }
    }
    if (days1.checked && days2.checked && days3.checked) {
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day');
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day-hidden');
        // eslint-disable-next-line no-use-before-define
        addSeparator(2);
        // eslint-disable-next-line no-use-before-define
        disableAll();
    }
    if (days1.checked && days2.checked && !days3.checked) {
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(1);
        todos.checked = false;
    }
    if (days1.checked && !days2.checked && days3.checked) {
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(1);
        todos.checked = false;
    }
    if (days1.checked && !days2.checked && !days3.checked) {
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(0);
        todos.checked = false;
    }
    if (!days1.checked && days2.checked && days3.checked) {
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(3);
        todos.checked = false;
    }
    if (!days1.checked && !days2.checked && days3.checked) {
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(0);
        todos.checked = false;
    }
    if (!days1.checked && days2.checked && !days3.checked) {
        ruta1day.classList.remove('ibe-stopover-tabs--plans-1day');
        ruta1day.classList.add('ibe-stopover-tabs--plans-1day-hidden');
        ruta2day.classList.add('ibe-stopover-tabs--plans-2day');
        ruta2day.classList.remove('ibe-stopover-tabs--plans-2day-hidden');
        ruta3day.classList.add('ibe-stopover-tabs--plans-3day-hidden');
        ruta3day.classList.remove('ibe-stopover-tabs--plans-3day');
        // eslint-disable-next-line no-use-before-define
        addSeparator(0);
        todos.checked = false;
    }
    if (!days1.checked && !days2.checked && !days3.checked) {
        // eslint-disable-next-line no-use-before-define
        addSeparator(2);
        todos.checked = true;
    }
}
function addSeparator(line) {
    const line1 = document.getElementById('plansline1');
    const line2 = document.getElementById('plansline2');
    if (line === 1) {
        line1.classList.add('ibe-stopover-tabs--plans-line1');
        line2.classList.add('ibe-stopover-tabs--plans-line2-hidden');
        line1.classList.remove('ibe-stopover-tabs--plans-line1-hidden');
        line2.classList.remove('ibe-stopover-tabs--plans-line2');
    } else if (line === 2) {
        line1.classList.remove('ibe-stopover-tabs--plans-line1-hidden');
        line2.classList.remove('ibe-stopover-tabs--plans-line2-hidden');
        line1.classList.add('ibe-stopover-tabs--plans-line1');
        line2.classList.add('ibe-stopover-tabs--plans-line2');
    } else if (line === 3) {
        line1.classList.add('ibe-stopover-tabs--plans-line1-hidden');
        line2.classList.remove('ibe-stopover-tabs--plans-line2-hidden');
        line1.classList.remove('ibe-stopover-tabs--plans-line1');
        line2.classList.add('ibe-stopover-tabs--plans-line2');
    } else {
        line1.classList.add('ibe-stopover-tabs--plans-line1-hidden');
        line2.classList.add('ibe-stopover-tabs--plans-line2-hidden');
        line1.classList.remove('ibe-stopover-tabs--plans-line1');
        line2.classList.remove('ibe-stopover-tabs--plans-line2');
    }
}
function disableAll() {
    const todos = document.getElementById('filter-todos');
    const days1 = document.getElementById('days1');
    const days2 = document.getElementById('days2');
    const days3 = document.getElementById('days3');
    todos.checked = true;
    days1.checked = false;
    days2.checked = false;
    days3.checked = false;
}

// Boton 'Quiero hacer Stopover'
$('.doStopOver').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');
    $('#tab-home > a').trigger('click');

    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');
    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);

    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }

    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'quiero hacer stopover',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Boton Carrusel experiencias
$('.tab2fromCarrusel').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-add-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-remove-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('#tab-exp > a').trigger('click');
    /* Solo se marca inicialmente el filtro de 'Todos' */
    if (!$('#all').prop('checked')) {
        $('#all').trigger('click');
    }
    $('.ibe-carousel').slick('refresh');
    $('.ibe-wall-carousel').slick('refresh');
    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);

    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }

    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'ver todas las experiencias',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Boton Categorias experiencias
$('.tab2fromCategories').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-add-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-remove-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('#tab-exp > a').trigger('click');
    /* Solo se marca inicialmente el filtro de 'Todos' */
    if (!$('#all').prop('checked')) {
        $('#all').trigger('click');
    }
    // eslint-disable-next-line func-names
    $('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').each(function () {
        const category = $(this).attr('data-info');
        if (category !== 'all' && category !== undefined) {
            $(this).prop('checked', false);
        }
    });

    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }

    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'ver todas las categorias',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Boton Planes Recomenados
$('.planesRecomendadosSO').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-add-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-remove-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-remove-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-add-section');

    $('#tab-plans > a').trigger('click');
    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }
    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'ver planes recomendados',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Boton Preguntas Frecuentes
$('.faqsSO').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-remove-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-add-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('#tab-asks > a').trigger('click');
    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);

    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }

    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'ver preguntas frecuentes',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Boton Preguntas Frecuentes pestaña Planes Recomendados
$('#botonPreguntasFromPlanes').on('click', () => {
    const homeOutSection = document.getElementById('home-out-section');
    const experiencesOutSection = document.getElementById('experiences-out-section');
    const faqsOutSection = document.getElementById('faqs-out-section');
    const planesOutSection = document.getElementById('plans-out-section');
    homeOutSection.classList.remove('ibe-stopover-tabs--home-add-section');
    homeOutSection.classList.add('ibe-stopover-tabs--home-remove-section');
    experiencesOutSection.classList.add('ibe-stopover-tabs--experiences-remove-section');
    experiencesOutSection.classList.remove('ibe-stopover-tabs--experiences-add-section');
    faqsOutSection.classList.remove('ibe-stopover-tabs--faqs-remove-section');
    faqsOutSection.classList.add('ibe-stopover-tabs--faqs-add-section');
    planesOutSection.classList.remove('ibe-stopover-tabs--plans-add-section');
    planesOutSection.classList.add('ibe-stopover-tabs--plans-remove-section');

    $('#tab-asks > a').trigger('click');
    // eslint-disable-next-line no-undef
    $('html, body').stop().animate({ scrollTop: jQuery('#bannerStopOver').offset().top }, 2000);

    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }

    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: 'ver preguntas frecuentes',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});

// Planes Recomendados Zoom Mapas

const plansSaveURL = document.querySelectorAll('.saveImagePlansStopOver');
plansSaveURL.forEach((button) => {
    // eslint-disable-next-line func-names
    button.addEventListener('click', function () {
        // eslint-disable-next-line no-use-before-define
        saveImage(this);
    });
});

const buttonzoomOut = document.getElementById('buttonZoomOut');
const buttonzoomIn = document.getElementById('buttonZoomIn');
const zoomPlans = document.getElementById('zoomRouteOneDay');
const idSelector = document.getElementById('idSelector');

function saveImage(button) {
    window.zoomValue = 1;
    window.mouseOverButton = false;
    buttonzoomIn.disabled = false;
    buttonzoomIn.style.color = 'white';
    buttonzoomOut.disabled = true;
    buttonzoomOut.style.color = 'lightgrey';
    const etFigure = button.closest('figure');
    const tagIMG = etFigure.querySelector('img');
    const imgSave = document.getElementById('zoomRouteOneDay');
    const imgURL = tagIMG.getAttribute('src');
    const img = new Image();
    window.imageSrc = imgURL;
    img.src = imgURL;
    img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        window.ratioValue = ratio;
        Object.assign(imgSave.style, {
            backgroundImage: `url(${imgURL})`,
            aspectRatio: ratio,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        });
    };
}

function initialZoom() {
    const container = document.getElementById('zoomRouteOneDay');
    let imgsrc = container.currentStyle || window.getComputedStyle(container, false);
    imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, '');
    // eslint-disable-next-line no-restricted-globals, no-global-assign
    const img = new Image();

    img.src = imgsrc;
    img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        Object.assign(container.style, {
            backgroundImage: `url(${window.imageSrc})`,
            aspectRatio: ratio,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
        });
    };
}

zoomPlans.onmousemove = function zoomMoveAction() {
    if (window.zoomValue !== 1 && !window.mouseOverButton) {
        const container = document.getElementById('zoomRouteOneDay');
        let imgsrc = container.currentStyle || window.getComputedStyle(container, false);
        imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, '');
        const parent = document.getElementsByClassName('modal-dialog--route');
        const img = new Image();
        img.src = imgsrc;
        img.onload = () => {
            const ratio = img.naturalWidth / img.naturalHeight;
            Object.assign(container.style, {
                aspectRatio: img.naturalWidth / img.naturalHeight,
            });
            container.onmousemove = (e) => {
                if (window.zoomValue !== 1 && !window.mouseOverButton) {
                    const rect = e.target.getBoundingClientRect();
                    const xPos = e.clientX - rect.left;
                    const yPos = e.clientY - rect.top;
                    const xPercent = `${xPos / (container.clientWidth / 100)}%`;
                    const yPercent = `${yPos / ((container.clientWidth * ratio) / 100)}%`;
                    // cambiando el backgroundSize ampliamos el zoom
                    Object.assign(container.style, {
                        backgroundPosition: `${xPercent} ${yPercent}`,
                        backgroundSize: `${parent[0].getBoundingClientRect().width * window
                            .zoomValue}px`,
                    });
                }
            };
            container.onmouseleave = () => {
                if (window.zoomValue !== 1) {
                    Object.assign(container.style, {
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                    });
                }
            };
        };
    }
};
idSelector.onmousemove = function zoomMoveBtn() {
    window.mouseOverButton = true;
};
idSelector.onmouseleave = function zoomLeaveBtn() {
    window.mouseOverButton = false;
};

buttonzoomIn.addEventListener('click', () => {
    window.zoomValue += 0.1;
    window.zoomValue = Math.round(window.zoomValue * 10) / 10;

    // code to disable and change button color
    const buttonIn = document.getElementById('buttonZoomIn');
    const buttonOut = document.getElementById('buttonZoomOut');
    buttonOut.disabled = false;
    buttonOut.style.color = 'white';
    if (window.zoomValue === 1.5) {
        buttonIn.disabled = true;
        buttonIn.style.color = 'lightgrey';
    }
    // eslint-disable-next-line no-use-before-define
    applyZoom();
});

buttonzoomOut.addEventListener('click', () => {
    window.zoomValue -= 0.1;
    window.zoomValue = Math.round(window.zoomValue * 10) / 10;
    // code to disable and change button color
    const buttonOut = document.getElementById('buttonZoomOut');
    const buttonIn = document.getElementById('buttonZoomIn');
    buttonIn.disabled = false;
    buttonIn.style.color = 'white';
    if (window.zoomValue === 1) {
        buttonOut.disabled = true;
        buttonOut.style.color = 'lightgrey';
        initialZoom();
    } else {
        // eslint-disable-next-line no-use-before-define
        applyZoom();
    }
});

function applyZoom() {
    const container = document.getElementById('zoomRouteOneDay');
    let imgsrc = container.currentStyle || window.getComputedStyle(container, false);
    imgsrc = imgsrc.backgroundImage.slice(4, -1).replace(/"/g, '');
    // eslint-disable-next-line no-restricted-globals, no-global-assign
    parent = document.getElementsByClassName('modal-dialog--route');
    const img = new Image();
    img.src = imgsrc;

    img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        Object.assign(container.style, {
            backgroundImage: `url(${window.imageSrc})`,
            aspectRatio: ratio,
            backgroundPosition: 'center',
            // eslint-disable-next-line no-restricted-globals
            backgroundSize: `${parent[0].getBoundingClientRect().width * window.zoomValue}px`,
        });
    };
}
// Fin zoom mapas planes recomendados

// anchor to email HMFAQS
if ((window.location.hash).includes('accordion')) {
    const anchor = window.location.hash;
    // eslint-disable-next-line camelcase
    const accordion_selector = $(anchor);
    accordion_selector.trigger('click');
}

// Metricas GA4
// Metrica botones pestaña experiencias
// Filtrar -> TODOS
$('.ibe-one-option__list-item a[title="TODOS"]').on('click', () => {
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab experiencias',
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
// Filtrar -> FILTRAR
$('.ibe-one-option__list-item a[title="FILTRAR"]').on('click', () => {
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab experiencias',
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
// Filtrar -> Click input filtro
// eslint-disable-next-line func-names
$('.ibe-stopover-tabs--experiences-filter .ibe-filter__check').on('click', function () {
    let title = $(this).val();
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\\\/]/gi, '').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab experiencias',
        eventAction: 'clic',
        eventLabel: `filtro: ${title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// Metrica botones planes recomendados
document.querySelector('.ruta1ID').addEventListener('click', () => {
    const eventDescarga1 = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'dia1 descargar guia',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventDescarga1);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventDescarga1, { event: 'interaction' });
    }
});
document.querySelector('.ruta2ID').addEventListener('click', () => {
    const eventDescarga2 = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'dia2 descargar guia',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventDescarga2);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventDescarga2, { event: 'interaction' });
    }
});
document.querySelector('.ruta3ID').addEventListener('click', () => {
    const eventDescarga3 = {
        eventName: 'interaccion',
        eventCategory: 'stopover tab planes recomendados',
        eventAction: 'clic',
        eventLabel: 'dia3 descargar guia',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventDescarga3);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventDescarga3, { event: 'interaction' });
    }
});

// Metrica botones comun a todas las Tabs
// Carrusel -> enlace ver ficha
// eslint-disable-next-line func-names
$('.experience-file').on('click', function () {
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: `ver ficha: ${title}`,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// Carrusel -> enlace imagen
// eslint-disable-next-line func-names
$('.experience-image').on('click', function () {
    // eslint-disable-next-line no-unused-vars
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'hola madrid',
        eventAction: 'clic',
        eventLabel: `imagen ficha: ${title}`,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// Carrusel -> enlace titulo
// eslint-disable-next-line func-names
$('.experience-title').on('click', function () {
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
        eventAction: 'clic',
        eventLabel: `titulo ficha: ${title}`,
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// Carrusel -> Ver todas las experiencias
// eslint-disable-next-line func-names
$('.experience-carousel-all').on('click', function () {
    let title = $(this).html();
    let namecategory = 'stopover tab stopover';
    if (($(this).closest('#home-out-section'))) {
        namecategory = 'stopover tab stopover';
    }
    if (($(this).closest('#experiences-out-section'))) {
        namecategory = 'stopover tab experiencias';
    }
    if (($(this).closest('#plans-out-section'))) {
        namecategory = 'stopover tab planes recomendados';
    }
    if (($(this).closest('#faqs-out-section'))) {
        namecategory = 'stopover tab preguntas frecuentes';
    }
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}\\[\]\\/]/gi, '').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: namecategory,
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

// Banner cta video
$('.ibe-stopover-tabs-banner-video-button').on('click', () => {
    const eventData = {
        eventName: 'interaccion',
        eventCategory: 'stopover ',
        eventAction: 'clic',
        eventLabel: 'banner: video stopover',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
