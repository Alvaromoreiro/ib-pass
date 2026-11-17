import retrieveGlobalVariables from '../../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

const init = () => {
    if ($('.ibe-chart__weather-container').length > 0) {
        const iata = $('body').attr('data-iata-destination');

        $.ajax({
            encoding: 'UTF-8',
            method: 'GET',
            url: '/cs/Satellite',
            data: {
                pagename: 'IB_SE/CheapFlights/WeatherSection',
                market: marketg,
                locale: localeg,
                codeDest: iata,
            },
            success(data) {
                if (data.length === 0) {
                    $('.ibe-chart').remove();
                } else {
                    const initData = $.parseJSON(data);
                    dFrontJs.ibe_chart.createChart('#chartTemp', initData);
                }
            },
            error() {
                $('.ibe-chart').remove();
            },
        });
    }
};

export { init };