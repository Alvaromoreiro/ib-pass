import getUrlIBHolidays from '../manage/ibe_ibholidays';

const params = new URLSearchParams(window.location.search);
const idLanding = params.get('urlLandingId');

const callBAEntryPoint = (data) => {
    const form = $('<form>', { method: 'POST', action: data.url, class: 'hidden' });
    form.append($('<input>', { name: data.params[0].name, value: data.params[0].value }));
    $('body').append(form);
    form.submit();
};

getUrlIBHolidays(idLanding)
    .done((datas) => {
        if (datas.url.length > 0 && datas.params.length > 0) {
            callBAEntryPoint(datas);
        } else {
            window.location.href = `/${marketg.toLocaleLowerCase()}/${localeg.toLocaleLowerCase()}/notfound/`;
        }
    })
    .fail(() => {
        window.location.href = `/${marketg.toLocaleLowerCase()}/${localeg.toLocaleLowerCase()}/notfound/`;
    });