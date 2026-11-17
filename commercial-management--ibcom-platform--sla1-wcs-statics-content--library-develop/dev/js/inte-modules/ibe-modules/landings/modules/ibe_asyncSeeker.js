import retrieveGlobalVariables from '../../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

function updateOriginDestiny() {
    // origin
    if ($('body[data-iata-origin]').length > 0 && $('body[data-city-origin]').length > 0) {
        const iataO = $('body[data-iata-origin]').data('iata-origin');
        const cityO = $('body[data-city-origin]').data('city-origin');
        const origin = `${cityO} (${iataO})`;
        // agregar datos en el value del input en los 3 tabs
        $('#flight_origin1').val(origin);
    }

    if ($('body[data-iata-destination]').length > 0 && $('body[data-city-destination]').length > 0) {
        // destiny
        const iataD = $('body[data-iata-destination]').data('iata-destination');
        const cityD = $('body[data-city-destination]').data('city-destination');
        const destination = `${cityD} (${iataD})`;
        // agregar datos en el value del input en los 3 tabs
        $('#flight_destiny1').val(destination);
    }
}

let retry = 3;
const retrieveSeeker = (selector) => {
    const data = {
        pagename: 'IB_SE/Presentation/Banner/Seeker/Seeker',
        locale: localeg,
        market: marketg,
        d: '',
        seekerLanding: true,
        cache: '/CacheControl6h/BrowserCache3600/',
    };
    if (retry > 0) {
        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            data,
        }).then((result)=> {
            retry = 0;
            $(selector).html(result);
            dFrontJs.ibe_searcher_people_counter.init();
            dFrontJs.ibe_passenger.init();
            dFrontJs.ibe_overlay.init();
            dFrontJs.ibe_inputs.init();
            dFrontJs.ibe_bootstrap_collapse.init();
            window.loadDatePickerLanguage(false, dFrontJs.ibe_searcher_calendar.init());
            dFrontJs.ibe_tooltip.init();
            dFrontJs.ibe_validations_searcher.init();
            $(document).trigger('redirectPre');
            if ($('body[data-landing-template=T3-Landing]').length > 0 || $('body[data-landing-template=T2-Destination]').length > 0 || $('body[data-landing-template=T2-Origin]').length > 0) {
                updateOriginDestiny();
            }
        }).catch(() => {
            --retry;
            retrieveSeeker(selector);
        });
    }
};

export { retrieveSeeker, updateOriginDestiny };
