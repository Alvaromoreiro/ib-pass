import retrieveGlobalVariables from '../general/ibe_variables';
import { loadjsfile } from '../general/ibe_inte-util';

const { localeg, marketg, staticsVersion } = retrieveGlobalVariables();

let retry = 3;
const retrieveSeeker = (selector) => {
    const data = {
        pagename: 'IB_SE/Presentation/Banner/Seeker/SeekerStopOver',
        locale: localeg,
        market: marketg,
        d: '',
        cache: '/CacheControl6h/BrowserCache3600/',
    };
    if (retry > 0) {
        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            data,
        }).then((result) => {
            retry = 0;
            $(selector).html(result);
            loadjsfile(`independent/ibe_searcher-complete.js${staticsVersion}`);
            dFrontJs.ibe_datatable.init();
            dFrontJs.ibe_searcher_choose_city.init();
            dFrontJs.ibe_autocomplete.init();
            dFrontJs.ibe_searcher_people_counter.init();
            dFrontJs.ibe_passenger.init();
            dFrontJs.ibe_overlay.init();
            dFrontJs.ibe_inputs.init();
            dFrontJs.ibe_searcher_accordion.init();
            dFrontJs.ibe_bootstrap_collapse.init();
            dFrontJs.ibe_modal.init();
            window.loadDatePickerLanguage(false, dFrontJs.ibe_searcher_calendar.init());
            dFrontJs.ibe_tooltip.init();
            dFrontJs.ibe_validations_searcher.init();
            dFrontJs.ibe_collapse.init();
            dFrontJs.ibe_dinamic_modal.init();
            dFrontJs.ibe_counter_night.init();
        }).catch(() => {
            --retry;
            retrieveSeeker(selector);
        });
    }
};

// eslint-disable-next-line import/prefer-default-export
export { retrieveSeeker };
