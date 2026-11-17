import retrieveGlobalVariables from '../../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();
const init = () => {
    if ($('.ibe-table__tbody-tr-nivel-vida').length > 0) {
        // destiny
        // eslint-disable-next-line no-const-assign
        const iataD = $('[data-iata-destination]').data('iata-destination');
        let currencyExchange = 0;
        let precio = 0;
        let moneda = '';
        const data = {
            pagename: 'IB_SE/CacheControl12h/BrowserCache3600/ConversionCurrencies',
            locale: localeg,
            market: marketg,
            // eslint-disable-next-line no-undef
            IATA: iataD,
        };
        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            data,
        // eslint-disable-next-line no-shadow
        }).then((data) => {
            // eslint-disable-next-line eqeqeq
            if (data != null && data != '') {
                currencyExchange = data;
                if (currencyExchange.includes(',')) {
                    // eslint-disable-next-line prefer-destructuring
                    moneda = currencyExchange.split(',')[1];
                    // eslint-disable-next-line prefer-destructuring
                    currencyExchange = currencyExchange.split(',')[0];
                }
                // eslint-disable-next-line func-names
                $('.td-nivel-vida-currency').each(function () {
                    precio = $(this).text();
                    precio = parseFloat((precio.substring(0, precio.indexOf(',') + 3)).replace(',', '.'));
                    $(this).text(`${$(this).text()}   (${(precio * currencyExchange).toFixed(2)} ${moneda})`);
                });
            }
        }).catch(() => {
        });
    }
};
export { init };