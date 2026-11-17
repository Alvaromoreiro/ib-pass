const parent = $('.offer-parent');
const cards = parent.find('.offer-card');

const clickHandler = (event) => {
    event.stopPropagation();
    const current = $(event.currentTarget);
    const startDate = current.attr('offer-start-date').split('/');
    const endDate = current.attr('offer-end-date').split('/');
    const offer = {
        iataOrigen: current.attr('offer-iata-ori'),
        iataDestino: current.attr('offer-iata-des'),
        nombreOrigen: current.attr('offer-name-ori'),
        nombreDestino: current.attr('offer-name-des'),
        fechaIda: { day: startDate[0], month: startDate[1], year: startDate[2] },
        fechaVuelta: { day: endDate[0], month: endDate[1], year: endDate[2] },
        adultos: 1,
        tarifa: 'R',
    };
    const $tabAffecting = $("[id*='tab-flights'] > form,[id*=m-tab-searcher-1]:has(input)");
    $(document.body).trigger('setOfferSeekerWCS', [$tabAffecting, offer]);
    $('html').animate({
        scrollTop: $('body').offset().top,
    }, 500, () => {});
};
const init = () => {
    cards.off('click', clickHandler);
    cards.on('click', clickHandler);
};

export { init }