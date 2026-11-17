import retrieveGlobalVariables from '../general/ibe_variables';
import { updateDigitalData } from '../manage/ibe_common';

const { localeg, quadrigam } = retrieveGlobalVariables();

// Variables
let map;
let initialPosition;
const lat = $('[data-latitud]').attr('data-latitud').trim();
const lon = $('[data-longitud]').attr('data-longitud').trim();
const coord = { lat: Number(lat), lng: Number(lon) };
$('#modalStopOverlastName').removeClass('fc_form_group ibe_form__group--error');
$('#modalStopOverlastName .ibe_form__msg-info').addClass('hidden');
$('#modalStopOverbookingNumber').removeClass('fc_form_group ibe_form__group--error');
$('#modalStopOverbookingNumber .ibe_form__msg-info').addClass('hidden');
// Function initialization map
function initMap() {
    // eslint-disable-next-line no-undef
    map = new google.maps.Map(document.getElementById('map'), {
        center: coord,
        zoom: 16,
    });
    // eslint-disable-next-line no-undef
    initialPosition = map.getCenter();
}

// Function center map
function centerMap() {
    map.setCenter(initialPosition);
}

// Comprobador que corre cada medio segundo (500 ms) el valor de la cookie SEE_BENEFITS_COOKIE
setInterval(() => {
    const cookieValue = Cookies.get('SEE_BENEFITS_COOKIE');
    if (cookieValue === 'true') {
        $('.ibe-exp-file--card .ibe-exp-file__header a')[0].click();
        // Borrar la cookie
        Cookies.remove('SEE_BENEFITS_COOKIE');
    }
}, 500);

// Load script API maps google
window.initMap = initMap;
// Función que centraliza el set de la cookie y recupera la reserva desde el buscador de react
function setHolaMadridTrue() {
    Cookies.set('HOLA_MADRID', 'true', {
        path: '/',
        expires: 3650,
        sameSite: 'strict',
    });
    $('#defaultDiscount').addClass('hidden');
    if ($('[data-corte-ingles="true"]').length > 0) {
        $('#serviceCI').removeClass('hidden');
        $('.ibe-exp-file__button').removeClass('hidden');
        $('.ibe-experiencia-logged').removeClass('hidden');
    } else {
        if ($('#generalDiscountOK').length > 0) {
            $('#generalDiscountOK').removeClass('hidden');
            $('.ibe-exp-file__button').removeClass('hidden');
        } else {
            // para fichas que tienen modal en codigo descuento
            $('#modalExperienciaDescuento').removeClass('hidden');
            $('.ibe-exp-file__button').removeClass('hidden');
        }
        // si existe una ficha sin descuento cambiamos el html
        if ($('#noDiscount').length > 0) {
            $('#noDiscount').removeClass('hidden');
            $('#initialDiscount').addClass('hidden');
        }
        $('.ibe-experiencia-logged').removeClass('hidden');
    }
}
function setHolaMadridFalse() {
    Cookies.set('HOLA_MADRID', 'false', {
        path: '/',
        expires: 3650,
        sameSite: 'strict',
    });
    // Mostrar elementos de login / default
    $('#defaultDiscount').removeClass('hidden');
    // Ocultar elementos de usuario logueado según tipo de descuento
    if ($('[data-corte-ingles="true"]').length > 0) {
        $('#serviceCI').addClass('hidden');
        $('.ibe-exp-file__button').addClass('hidden');
        $('.ibe-experiencia-logged').addClass('hidden');
    } else {
        if ($('#generalDiscountOK').length > 0) {
            $('#generalDiscountOK').addClass('hidden');
            $('.ibe-exp-file__button').addClass('hidden');
        } else {
            // Para fichas que tienen modal en código de descuento
            $('#modalExperienciaDescuento').addClass('hidden');
            $('.ibe-exp-file__button').addClass('hidden');
        }
        // Si existe una ficha sin descuento, revertimos cambios en el HTML
        if ($('#noDiscount').length > 0) {
            $('#noDiscount').addClass('hidden');
            $('#initialDiscount').removeClass('hidden');
        }
        // Ocultar contenedor de experiencia logueado
        document.getElementById('lastName').value = '';
        document.getElementById('bookingNumber').value = '';
        $('#allDiscountKO').addClass('hidden');
        if (!$('#container_loading').hasClass('hidden')) {
            $('#modalStopOverbookingNumber').removeClass('hidden');
            $('#modalStopOverlastName').removeClass('hidden');
            $('#pfrecuenteslink').removeClass('hidden');
            $('#container_loading').addClass('hidden');
            $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
            $('#headMStopOver').css('padding', '0 0 1.25rem 0');
            $('#modal_bodySO').css('padding-top', '1.25rem 0 0');
            $('#error').addClass('hidden');
            $('#getStopOver').prop('disabled', false);
        }
    }
}

// Detectar cambios en otras pestañas
window.addEventListener('storage', (event) => {
    if (event.key === 'ib-MmB-app.myStopoverData') {
        if (event.newValue) {
            setHolaMadridTrue();
        }
        if (event.newValue === null) {
            setHolaMadridFalse();
        }
    }
});

// Interceptar setItem en la pestaña actual de forma segura, cambios en la misma pestaña
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function (key, value) {
    // Intentamos llamar al original de forma explícita y segura
    try {
        originalSetItem.call(this, String(key), String(value));
    } catch (err) {
    // console.error('Error calling original localStorage.setItem:', err);
    }

    // Lógica propia: si es la clave que nos interesa, actualizamos la cookie
    if (key === 'ib-MmB-app.myStopoverData') {
        try {
            setHolaMadridTrue();
        } catch (err) {
        // console.error('setHolaMadridTrue failed:', err);
        }
    }
};

// eslint-disable-next-line func-names
$(document).ready(() => {
    // Evento view
    // eslint-disable-next-line no-undef
    digital_data.Quadrigam = quadrigam;
    updateDigitalData('view');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCfCVcHbH3p5kL0KYWd2bMFW0qHGl6DADk&language=${localeg}&callback=initMap`;
    script.defer = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // React event listener for closing booking
    window.addEventListener('stopOverDataChanged', () => {
        // Si la cookie ya no existe, revertimos el estado de usuario logueado
        const isLoggedIn = Cookies.get('HOLA_MADRID') === 'true';
        if (!isLoggedIn) {
            setHolaMadridFalse();
        }
    });
});

// Cambio de funcionamiento botones planes y faqs en experiencias
$('.experience-reco-dudas').each(function eah() {
    if ($(this).attr('data-url').length) {
        $(this).attr('href', $(this).attr('data-url'));
    }
    $(this).removeAttr('data-url');
});

// Function reload center map
document.getElementById('centerMap').addEventListener('click', () => {
    centerMap();
});
// METRICA BOTON COMPRA/RESERVA
$('.ibe-exp-file__button  a').on('click', () => {
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
        eventAction: 'clic',
        eventLabel: 'reservar',
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// METRICA BOTON INICIAR SESION
$('#iniSesionSO').on('click', () => {
    let text = $('#iniSesionSO').html();
    text = text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
        eventAction: 'clic',
        eventLabel: text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    };
    if (typeof (window.DigitalChange) !== 'undefined') {
        window.DigitalChange('interaction', eventData);
    }
    if (typeof (window.dataLayer) !== 'undefined') {
        window.dataLayer.push(eventData, { event: 'interaction' });
    }
});
// METRICA CARRUSEL RECOMENDACIONES
// Carrusel -> enlace ver ficha
// eslint-disable-next-line func-names
$('.experience-file').click(function () {
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
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
$('.experience-image').click(function () {
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
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
$('.experience-title').click(function () {
    const title = $(this).attr('data-name');
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
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

// Seccion -> ¿Necesitas recomendación para tus planes?
// eslint-disable-next-line func-names
$('.experience-reco-dudas').click(function () {
    let title = $(this).html();
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
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

// Seccion -> Experiencia tarjeta transporte publico o como aplico mi codigo de descuento
// eslint-disable-next-line func-names
$('.ibe-exp-file__info-transport--text').click(function () {
    let title = $(this).html();
    title = title.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/]/gi, '').toLowerCase();
    const eventData = {
        eventName: 'interaccion',
        eventCategory: `hm ${quadrigam} experiencia`,
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

// Ficha experiencia tras introducir pnr en vigencia
if (Cookies.get('HOLA_MADRID') === 'true') {
    setHolaMadridTrue();
    // Function Copy to clipboard
    document.getElementById('copy').addEventListener('click', () => {
        const text = document.getElementById('offset').textContent;
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    });
} else {
    // eslint-disable-next-line func-names
    document.getElementById('lastName').addEventListener('keyup', () => {
        // eslint-disable-next-line eqeqeq
        if (document.getElementById('lastName').value.length != 0) {
            $('#modalStopOverlastName').removeClass('fc_form_group ibe_form__group--error');
            $('#modalStopOverlastName .ibe_form__msg-info').addClass('hidden');
        }
    });
    document.getElementById('bookingNumber').addEventListener('keyup', () => {
        // eslint-disable-next-line eqeqeq
        if (document.getElementById('bookingNumber').value.length != 0) {
            $('#modalStopOverbookingNumber').removeClass('fc_form_group ibe_form__group--error');
            $('#modalStopOverbookingNumber .ibe_form__msg-info').addClass('hidden');
        }
    });
}
document.getElementById('getStopOver').addEventListener('click', () => {
    const lastName = document.getElementById('lastName').value;
    const bookingNumber = document.getElementById('bookingNumber').value;

    // eslint-disable-next-line eqeqeq
    if (lastName != '' && bookingNumber != '') {
        // METRICA BOTON INICIAR SESION
        // eslint-disable-next-line camelcase
        const eventData = {
            eventName: 'interaccion',
            eventCategory: 'Iniciar sesion',
            eventAction: 'clic',
            eventLabel: 'Iniciar sesion',
        };
        if (typeof (window.DigitalChange) !== 'undefined') {
            window.DigitalChange('interaction', eventData);
        }
        if (typeof (window.dataLayer) !== 'undefined') {
            window.dataLayer.push(eventData, { event: 'interaction' });
        }

        $('#getStopOver').prop('disabled', true);
        $('#modalStopOverlastName').removeClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverlastName .ibe_form__msg-info').addClass('hidden');
        $('#modalStopOverbookingNumber').removeClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverbookingNumber .ibe_form__msg-info').addClass('hidden');
        $('.ibe-modal_body [data-loading]').css({ position: 'relative', 'min-height': '124px' });
        $('.ibe-modal_body [data-loading]').removeClass('hidden');
        $('#modalStopOverbookingNumber').addClass('hidden');
        $('#modalStopOverlastName').addClass('hidden');
        $('#pfrecuenteslink').addClass('hidden');
        $('#container_loading').removeClass('hidden');
        $('#headMStopOver').css('border-bottom', '0');
        $('#headMStopOver').css('padding', '0 0 0 0');
        $('#modal_bodySO').css('padding-top', '0');

        const data = {
            pagename: 'IB_SE/callImportStopOver',
            lastName,
            bookingNumber,
        };

        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            data,
        // eslint-disable-next-line no-shadow
        }).then((data) => {
            let parsedData = data;
            const date = new Date();
            const exDate = date.setTime(date.getTime() + 3650);

            if (typeof parsedData === 'string') parsedData = JSON.parse(parsedData);

            const hasValidData = parsedData && typeof parsedData === 'object' && parsedData.locator && parsedData.surname;

            // eslint-disable-next-line eqeqeq
            if (parsedData != null && parsedData != '') {
                // eslint-disable-next-line eqeqeq
                if (hasValidData) {
                    Cookies.set('HOLA_MADRID', 'true', {
                        path: '/',
                        expires: exDate,
                        sameSite: 'strict',
                    });

                    $('#closeModalSO').click();
                    setHolaMadridTrue();
                    localStorage.setItem('stopOverData', JSON.stringify(parsedData));
                    window.dispatchEvent(new CustomEvent('stopOverDataChanged', { detail: parsedData }));
                    // Function Copy to clipboard
                    const copyBtn = document.getElementById('copy');
                    if (copyBtn) {
                        // remove previous listeners by cloning node
                        copyBtn.replaceWith(copyBtn.cloneNode(true));
                        // reattach desired listener
                        document.getElementById('copy').addEventListener('click', () => {
                            const text = document.getElementById('offset').textContent;
                            const temp = document.createElement('textarea');
                            temp.value = text;
                            document.body.appendChild(temp);
                            temp.select();
                            document.execCommand('copy');
                            document.body.removeChild(temp);
                        });
                    }
                } else if (data === 'error500') {
                    Cookies.set('HOLA_MADRID', 'false', {
                        path: '/',
                        expires: exDate,
                        sameSite: 'strict',
                    });
                    $('#error').removeClass('hidden');

                    document.getElementById('iniSesionSO').addEventListener('click', () => {
                        document.getElementById('lastName').value = '';
                        document.getElementById('bookingNumber').value = '';
                        if (!$('#container_loading').hasClass('hidden')) {
                            $('#modalStopOverbookingNumber').removeClass('hidden');
                            $('#modalStopOverlastName').removeClass('hidden');
                            $('#pfrecuenteslink').removeClass('hidden');
                            $('#container_loading').addClass('hidden');
                            $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
                            $('#headMStopOver').css('padding', '0 0 1.25rem 0');
                            $('#modal_bodySO').css('padding-top', '1.25rem 0 0');
                            $('#error').addClass('hidden');
                            $('#getStopOver').prop('disabled', false);
                        }
                    });
                } else {
                    Cookies.set('HOLA_MADRID', 'false', {
                        path: '/',
                        expires: exDate,
                        sameSite: 'strict',
                    });

                    $('#allDiscountKO').removeClass('hidden');
                    $('#modalStopOverbookingNumber').removeClass('hidden');
                    $('#modalStopOverlastName').removeClass('hidden');
                    $('#pfrecuenteslink').removeClass('hidden');
                    $('#container_loading').addClass('hidden');
                    $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
                    $('#headMStopOver').css('padding', '0 0 1.25rem 0');
                    $('#modal_bodySO').css('padding-top', '1.25rem');
                    $('#error').addClass('hidden');
                    $('#getStopOver').prop('disabled', false);

                    document.getElementById('iniSesionSO').addEventListener('click', () => {
                        document.getElementById('lastName').value = '';
                        document.getElementById('bookingNumber').value = '';
                        $('#allDiscountKO').addClass('hidden');
                        if (!$('#container_loading').hasClass('hidden')) {
                            $('#modalStopOverbookingNumber').removeClass('hidden');
                            $('#modalStopOverlastName').removeClass('hidden');
                            $('#pfrecuenteslink').removeClass('hidden');
                            $('#container_loading').addClass('hidden');
                            $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
                            $('#headMStopOver').css('padding', '0 0 1.25rem 0');
                            $('#modal_bodySO').css('padding-top', '1.25rem 0 0');
                            $('#error').addClass('hidden');
                            $('#getStopOver').prop('disabled', false);
                        }
                    });
                }
            } else {
                Cookies.set('HOLA_MADRID', 'false', {
                    path: '/',
                    expires: exDate,
                    sameSite: 'strict',
                });

                document.getElementById('iniSesionSO').addEventListener('click', () => {
                    document.getElementById('lastName').value = '';
                    document.getElementById('bookingNumber').value = '';
                    if (!$('#container_loading').hasClass('hidden')) {
                        $('#modalStopOverbookingNumber').removeClass('hidden');
                        $('#modalStopOverlastName').removeClass('hidden');
                        $('#pfrecuenteslink').removeClass('hidden');
                        $('#container_loading').addClass('hidden');
                        $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
                        $('#headMStopOver').css('padding', '0 0 1.25rem 0');
                        $('#modal_bodySO').css('padding-top', '1.25rem 0 0');
                        $('#error').addClass('hidden');
                        $('#getStopOver').prop('disabled', false);
                    }
                });
            }
        }).catch(() => {
            $('#error').removeClass('hidden');
            document.getElementById('iniSesionSO').addEventListener('click', () => {
                document.getElementById('lastName').value = '';
                document.getElementById('bookingNumber').value = '';
                if (!$('#container_loading').hasClass('hidden')) {
                    $('#modalStopOverbookingNumber').removeClass('hidden');
                    $('#modalStopOverlastName').removeClass('hidden');
                    $('#pfrecuenteslink').removeClass('hidden');
                    $('#container_loading').addClass('hidden');
                    $('#headMStopOver').css('border-bottom', '1px solid #e5e5e5');
                    $('#headMStopOver').css('padding', '0 0 1.25rem 0');
                    $('#modal_bodySO').css('padding-top', '1.25rem 0 0');
                    $('#error').addClass('hidden');
                    $('#getStopOver').prop('disabled', false);
                }
            });
        });
    }

    // Validaciones simples de campos
    // eslint-disable-next-line eqeqeq
    if (lastName != '') {
        $('#modalStopOverlastName').removeClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverlastName .ibe_form__msg-info').addClass('hidden');
    }
    // eslint-disable-next-line eqeqeq
    if (bookingNumber != '') {
        $('#modalStopOverbookingNumber').removeClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverbookingNumber .ibe_form__msg-info').addClass('hidden');
    }
    // eslint-disable-next-line eqeqeq
    if (lastName == '') {
        // SE MUESTRA MEJASE FALTA RELLENAR CAMPO
        $('#modalStopOverlastName').addClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverlastName .ibe_form__msg-info').removeClass('hidden');
    }
    // eslint-disable-next-line eqeqeq
    if (bookingNumber == '') {
        // SE MUESTRA MEJASE FALTA RELLENAR CAMPO
        $('#modalStopOverbookingNumber').addClass('fc_form_group ibe_form__group--error');
        $('#modalStopOverbookingNumber .ibe_form__msg-info').removeClass('hidden');
    }
    // eslint-disable-next-line eqeqeq
    if (bookingNumber == '' || lastName == '') {
        $('[data-modal-view=".fc-dialog-login-stopover-simple"]').click();
    }
});
