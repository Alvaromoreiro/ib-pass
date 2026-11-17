/**
 * @description Module SSO iberiaplustore page
 */

import { isLogado } from '../manage/ibe_logged-service';

$('a[data-functionalcode=ibplustore]').click(() => {
  const isLogged = isLogado();
  const url = $('[data-ibplustore-url]').data('ibplustore-url');
  if (isLogged.userLogged) {
    const accessCookie = Cookies.get('IBERIACOM_SSO_ACCESS');
    const form = $('<form>', { method: 'POST', action: `${url}auth/ib`, class: 'hidden' });
    form.append($('<input>', { name: 'tokenIB', value: accessCookie }));
    $('a[data-functionalcode=ibplustore]').removeAttr('href');
    $('body').append(form);
    form.submit();
  } else {
    $('a[data-functionalcode=ibplustore]').attr('href', url);
  }
});
