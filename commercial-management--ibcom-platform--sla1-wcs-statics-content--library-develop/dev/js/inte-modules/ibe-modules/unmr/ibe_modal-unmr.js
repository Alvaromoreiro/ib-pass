import retrieveGlobalVariables from '../general/ibe_variables';

const { localeg, marketg } = retrieveGlobalVariables();

/**
 * @description Carga por AJAX el contenido de la modal UMNR (IB_SE/Modal_UMNRS) y lo inyecta
 * en el placeholder [data-umnr-modal]. Se llama una vez al cargar la página.
 */
function loadUmnrModal() {
  $.ajax({
    method: 'GET',
    url: '/cs/Satellite',
    data: {
      pagename: 'IB_SE/Modal_UMNRS',
      market: marketg,
      locale: localeg,
      d: '',
    },
    success(data) {
      const $placeholder = $('[data-umnr-modal]');
      $placeholder.html(data);
      // Las capas de las modales (position: fixed) se llevan al <body> para que ningún
      // contenedor del buscador (oculto, con overflow o transform) les afecte.
      $placeholder.find('.ibe-dialog-umnr').appendTo(document.body);
    },
  });
}

/**
 * @description Índice del formulario del buscador activo (1, o 6 en redemption).
 */
function getSearcherIndex() {
  const isRedemption = $('#tabContainer').find('.isRedemption').length > 0;
  return isRedemption ? 6 : 1;
}

/**
 * @description Parsea una fecha del buscador (dd/mm/yyyy o mm/dd/yyyy según data-format
 * del propio input) a un objeto Date. Devuelve null si no hay valor o no es válida.
 */
function parseSearcherDate($dateInput) {
  const value = $dateInput.val();
  if (!value) {
    return null;
  }
  const parts = value.split('/');
  if (parts.length !== 3) {
    return null;
  }
  let day = parseInt(parts[0], 10);
  let month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  if ($dateInput.attr('data-format') === 'MM/DD/YYYY') {
    day = parseInt(parts[1], 10);
    month = parseInt(parts[0], 10);
  }
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

/**
 * @description Formato de la fecha de nacimiento de la modal UMNR por defecto (si el input no
 * trae data-format), igual que su placeholder: MM/DD/YYYY en inglés salvo Reino Unido (GB) e
 * Irlanda (IE), y DD/MM/YYYY en esos dos mercados y en el resto de idiomas.
 */
const UMNR_DATE_DAY_FIRST_EN_MARKETS = ['GB', 'IE'];
const UMNR_BIRTHDATE_FORMAT = String(localeg || '').toLowerCase().indexOf('en') === 0
  && UMNR_DATE_DAY_FIRST_EN_MARKETS.indexOf(String(marketg || '').toUpperCase()) === -1
  ? 'MM/DD/YYYY'
  : 'DD/MM/YYYY';

/**
 * @description Parsea la fecha de nacimiento del input de la modal UMNR según su formato: el
 * data-format que pinta el JSP (misma regla que el placeholder) o, si no viene,
 * UMNR_BIRTHDATE_FORMAT. Devuelve null si el formato no es válido o la fecha no existe.
 */
function parseUmnrBirthDate(value, format = UMNR_BIRTHDATE_FORMAT) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((value || '').trim());
  if (!match) {
    return null;
  }
  const isMonthFirst = (format || UMNR_BIRTHDATE_FORMAT) === 'MM/DD/YYYY';
  const day = parseInt(isMonthFirst ? match[2] : match[1], 10);
  const month = parseInt(isMonthFirst ? match[1] : match[2], 10);
  const year = parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

/* ==========================================================================
   Máscara de escritura dd/mm/aaaa (mm/dd/aaaa en inglés) en los inputs de fecha de nacimiento (UMNR)
   ========================================================================== */

/**
 * @description Longitud máxima, en dígitos, de cada segmento dd/mm/aaaa o mm/dd/aaaa (en
 * ambos formatos los dos primeros segmentos son de 2 dígitos, así que la máscara es la misma).
 */
const UMNR_DATE_SEGMENT_LENGTHS = [2, 2, 4];

/**
 * @description Trocea el valor actual del input en sus 3 segmentos (día/mes/año o mes/día/año), cada uno
 * solo con dígitos y recortado a su longitud máxima. Es la única fuente de verdad del estado:
 * no se guarda nada aparte, así que un undo/redo del navegador o un reset externo (val(''))
 * se autocorrige en la siguiente pulsación.
 */
function parseUmnrDateSegments(value) {
  const parts = (value || '').split('/');
  return UMNR_DATE_SEGMENT_LENGTHS.map((maxLen, i) => (parts[i] || '').replace(/\D/g, '').slice(0, maxLen));
}

/**
 * @description ¿Hay algún dígito en segments[fromIndex] o en algún segmento posterior?
 */
function umnrSegmentsHaveContentFrom(segments, fromIndex) {
  return segments.slice(fromIndex).some((segment) => segment.length > 0);
}

/**
 * @description Reconstruye el texto formateado (con sus '/') a partir de los 3 segmentos.
 * El '/' tras un segmento no final aparece en cuanto ese segmento se completa (auto-slash) o, 
 * si aún no está completo, en cuanto hay contenido más adelante
 */
function formatUmnrDateSegments(segments) {
  let value = '';
  segments.forEach((segment, i) => {
    value += segment;
    const isLast = i === segments.length - 1;
    const segmentClosed = segment.length === UMNR_DATE_SEGMENT_LENGTHS[i]
      || umnrSegmentsHaveContentFrom(segments, i + 1);
    if (!isLast && segmentClosed) {
      value += '/';
    }
  });
  return value;
}

/**
 * @description Posición (en el texto formateado) del primer carácter de segments[segIndex].
 */
function umnrDateSegmentStartIndex(segments, segIndex) {
  return formatUmnrDateSegments(segments.map((segment, i) => (i < segIndex ? segment : ''))).length;
}

/**
 * @description Dado un índice de cursor sobre el texto formateado, devuelve a qué segmento
 * pertenece y el desplazamiento dentro de él. Un índice que cae exactamente sobre un '/' se
 * resuelve, sin caso especial, como "final del segmento anterior" o "inicio del siguiente"
 * según de qué lado venga: es lo que hace que escribir o borrar justo junto a un slash
 * automático "salte" al segmento adyacente en vez de quedarse bloqueado.
 */
function umnrDateLocateCaret(segments, pos) {
  let idx = 0;
  for (let i = 0; i < segments.length; i += 1) {
    const segLen = segments[i].length;
    if (pos <= idx + segLen) {
      return { seg: i, segPos: pos - idx };
    }
    idx += segLen;
    const isLast = i === segments.length - 1;
    const segmentClosed = segLen === UMNR_DATE_SEGMENT_LENGTHS[i]
      || umnrSegmentsHaveContentFrom(segments, i + 1);
    if (!isLast && segmentClosed) {
      idx += 1;
    }
  }
  const lastSeg = segments.length - 1;
  return { seg: lastSeg, segPos: segments[lastSeg].length };
}

/**
 * @description Inserta un dígito en la posición de cursor indicada y devuelve la nueva
 * posición de cursor (en el texto ya reformateado). Si el cursor cae dentro de un segmento ya
 * completo, la tecla se ignora (requisito 2: nunca más dígitos de los permitidos); si cae justo
 * al final de un segmento completo, se continúa automáticamente en el siguiente con hueco.
 * Muta `segments` in place.
 */
function insertUmnrDateDigit(segments, pos, digit) {
  const located = umnrDateLocateCaret(segments, pos);
  let { seg, segPos } = located;
  const segmentFull = segments[seg].length >= UMNR_DATE_SEGMENT_LENGTHS[seg];
  if (segmentFull && segPos < segments[seg].length) {
    return pos;
  }
  if (segmentFull) {
    const nextSeg = segments.findIndex((segment, i) => i > seg && segment.length < UMNR_DATE_SEGMENT_LENGTHS[i]);
    if (nextSeg === -1) {
      return pos;
    }
    seg = nextSeg;
    segPos = segments[seg].length;
  }
  segments[seg] = segments[seg].slice(0, segPos) + digit + segments[seg].slice(segPos);
  let newSeg = seg;
  let newSegPos = segPos + 1;
  if (segments[seg].length === UMNR_DATE_SEGMENT_LENGTHS[seg] && seg < segments.length - 1) {
    newSeg += 1;
    newSegPos = segments[newSeg].length;
  }
  return umnrDateSegmentStartIndex(segments, newSeg) + newSegPos;
}

/**
 * @description Borra, sin desplazar el contenido de ningún otro segmento, los dígitos del
 * texto formateado comprendidos en [from, to). Es el corazón del requisito 3: cada segmento se
 * recorta de forma independiente, así que borrar en uno nunca arrastra dígitos de los demás.
 * Muta `segments` in place.
 */
function removeUmnrDateRange(segments, from, to) {
  if (from >= to) {
    return;
  }
  const start = umnrDateLocateCaret(segments, from);
  const end = umnrDateLocateCaret(segments, to);
  for (let i = start.seg; i <= end.seg; i += 1) {
    const rangeStart = i === start.seg ? start.segPos : 0;
    const rangeEnd = i === end.seg ? end.segPos : segments[i].length;
    if (rangeEnd > rangeStart) {
      segments[i] = segments[i].slice(0, rangeStart) + segments[i].slice(rangeEnd);
    }
  }
}

/**
 * @description Índice a borrar con Backspace sin selección: si el carácter justo antes del
 * cursor es un '/' automático, se salta para borrar el dígito real anterior (si no, Backspace
 * justo tras un slash no haría nada, lo cual sería confuso). Devuelve null si no hay nada que
 * borrar (cursor al principio del todo).
 */
function umnrDateBackspaceFrom(segments, pos) {
  if (pos <= 0) {
    return null;
  }
  const value = formatUmnrDateSegments(segments);
  const from = value[pos - 1] === '/' ? pos - 2 : pos - 1;
  return from < 0 ? null : from;
}

/**
 * @description Índice a borrar con Delete (adelante) sin selección: simétrico a
 * umnrDateBackspaceFrom, salta el '/' si el cursor lo tiene justo delante. Devuelve null si no
 * hay nada que borrar (cursor al final del todo).
 */
function umnrDateDeleteForwardFrom(segments, pos) {
  const value = formatUmnrDateSegments(segments);
  if (pos >= value.length) {
    return null;
  }
  return value[pos] === '/' ? pos + 1 : pos;
}

/**
 * @description Aplica los segmentos al input (valor + posición de cursor).
 */
function applyUmnrDateSegments(input, segments, caretPos) {
  const value = formatUmnrDateSegments(segments);
  input.value = value;
  const pos = Math.max(0, Math.min(caretPos, value.length));
  input.setSelectionRange(pos, pos);
}

/**
 * @description Handler de "beforeinput" de los campos de fecha de nacimiento UMNR: intercepta
 * cada tecleo, borrado y pegado antes de que el navegador toque el DOM y aplica él mismo el
 * resultado ya formateado (slashes automáticos, tope de dígitos por segmento y borrado sin
 * arrastre entre segmentos). Si el navegador no soporta
 * "beforeinput" el campo sigue funcionando como texto libre (sin máscara), igual que hasta
 * ahora: no es una regresión.
 */
function handleUmnrDateBeforeInput(e) {
  // Fallback por si algún día se dispara de forma sintética (p.ej. un test con
  // $(...).trigger('beforeinput') sin pasar por el navegador) y no trae originalEvent.
  const { inputType, data } = e.originalEvent || e;
  const input = e.target;
  const segments = parseUmnrDateSegments(input.value);
  const { selectionStart, selectionEnd } = input;
  let caret = selectionStart;

  // 'deleteByCut' (Ctrl+X / cortar): mismo tratamiento que borrar una selección. No hace
  // falta distinguirlo del resto de deleteContent*: al cortar siempre hay selección, así que
  // cae directo en la rama "selectionStart !== selectionEnd" de abajo. Sin este caso, el
  // corte no se interceptaba y el valor quedaba sin reformatear hasta la siguiente tecla.
  if (inputType === 'deleteContentBackward' || inputType === 'deleteContentForward'
    || inputType === 'deleteByCut') {
    e.preventDefault();
    if (selectionStart !== selectionEnd) {
      removeUmnrDateRange(segments, selectionStart, selectionEnd);
    } else if (inputType === 'deleteContentBackward') {
      const from = umnrDateBackspaceFrom(segments, selectionStart);
      if (from === null) {
        return;
      }
      removeUmnrDateRange(segments, from, from + 1);
      caret = from;
    } else {
      const from = umnrDateDeleteForwardFrom(segments, selectionStart);
      if (from === null) {
        return;
      }
      removeUmnrDateRange(segments, from, from + 1);
    }
    applyUmnrDateSegments(input, segments, caret);
    return;
  }

  if (inputType === 'insertText' || inputType === 'insertFromPaste' || inputType === 'insertFromDrop') {
    const digits = (data || '').replace(/\D/g, '');
    e.preventDefault();
    if (!digits) {
      return;
    }
    if (selectionStart !== selectionEnd) {
      removeUmnrDateRange(segments, selectionStart, selectionEnd);
      caret = selectionStart;
    }
    digits.split('').forEach((digit) => {
      caret = insertUmnrDateDigit(segments, caret, digit);
    });
    applyUmnrDateSegments(input, segments, caret);
  }
}

/**
 * @description Edad cumplida de birthDate en refDate.
 */
function calculateAge(birthDate, refDate) {
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * @description Valida el input de fecha de nacimiento de un menor en la modal UMNR y muestra
 * el mensaje de error que corresponda. Solo se llama al pulsar "Continuar"
 * (canContinueUmnrFlow), nunca al perder el foco.
 */
function validateUmnrBirthdateInput(inputEl) {
  const $input = $(inputEl);
  const $group = $input.closest('.ibe-modal-unmr__date-group');
  const $errorEmpty = $group.find('[data-validate="empty"]');
  const $errorDateFormat = $group.find('[data-validate="date-format"]');
  const $errorFormat = $group.find('[data-validate="format"]');
  const $errorAge24 = $group.find('[data-validate="age-2-4"]');
  const $errorAge12 = $group.find('[data-validate="age-12-return"]');

  $errorEmpty.addClass('hidden');
  $errorDateFormat.addClass('hidden');
  $errorFormat.addClass('hidden');
  $errorAge24.addClass('hidden');
  $errorAge12.addClass('hidden');
  $group.removeClass('has-error');

  const rawValue = $input.val().trim();
  if (!rawValue) {
    $errorEmpty.removeClass('hidden');
    $group.addClass('has-error');
    return;
  }

  const birthDate = parseUmnrBirthDate(rawValue, $input.attr('data-format'));
  if (!birthDate) {
    $errorDateFormat.removeClass('hidden');
    $group.addClass('has-error');
    return;
  }

  const i = getSearcherIndex();
  const outboundDate = parseSearcherDate($(`#flight_round_date${i}`)) || new Date();
  const ageAtOutbound = calculateAge(birthDate, outboundDate);

  if (ageAtOutbound < 2 || ageAtOutbound >= 12) {
    $errorFormat.removeClass('hidden');
    $group.addClass('has-error');
    return;
  }

  if (ageAtOutbound >= 2 && ageAtOutbound <= 4) {
    $errorAge24.removeClass('hidden');
    $group.addClass('has-error');
    return;
  }

  const returnDate = parseSearcherDate($(`#flight_return_date${i}`));
  if (ageAtOutbound === 11 && returnDate && calculateAge(birthDate, returnDate) >= 12) {
    // Cumple 12 años en la vuelta: error que bloquea, como los demás.
    $errorAge12.removeClass('hidden');
    $group.addClass('has-error');
  }
}

/* ==========================================================================
   Modales UMNR — <div role="dialog" aria-modal="true"> (patrón "Dialog (Modal)" de WAI-ARIA APG)
   Markup (JSP): <div class="ibe-dialog-umnr ..." role="dialog" aria-modal="true" hidden> con
   aria-labelledby/aria-describedby.
   Al no ser <dialog> nativo, este JS hace lo que haría showModal():
   - mostrar/ocultar con el atributo hidden;
   - poner inert todo lo que queda fuera de la modal de arriba (incluida la modal UMNR de
     debajo cuando se apilan), así que el lector solo ve sus encabezados y controles;
   - mantener el Tab dentro de la modal de arriba (focus trap);
   - foco inicial: el input de fecha del menor 1 en la principal y el primer enfocable en
     las demás;
   - cerrar con Escape (solo la de arriba) y devolver el foco al elemento que lo tenía al abrir.
   ========================================================================== */

const UMNR_FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), '
  + 'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * @description Modales UMNR abiertas, de abajo arriba: { dialog, returnFocus }.
 */
const umnrOpenDialogs = [];

/**
 * @description Elementos a los que este JS ha puesto inert (para quitárselo luego solo a ellos).
 */
let umnrInertElements = [];

/**
 * @description Capa de la modal UMNR indicada por su clase (p.ej. '.fc-dialog-unmr').
 */
function getUmnrDialog(selector) {
  return document.querySelector(`.ibe-dialog-umnr${selector}`);
}

/**
 * @description Elementos enfocables y visibles de una modal UMNR (los date-item ocultos con
 * .hidden no cuentan).
 */
function getUmnrFocusables(dialog) {
  return Array.from(dialog.querySelectorAll(UMNR_FOCUSABLE))
    .filter((el) => el.getClientRects().length > 0);
}

/**
 * @description Pone inert todos los hijos del <body> salvo la modal UMNR de arriba (y se lo
 * quita a los que se lo puso antes). Si no queda ninguna abierta, solo lo quita.
 */
function updateUmnrInert() {
  umnrInertElements.forEach((el) => {
    el.inert = false;
  });
  umnrInertElements = [];
  const top = umnrOpenDialogs[umnrOpenDialogs.length - 1];
  if (!top) {
    return;
  }
  Array.from(document.body.children).forEach((el) => {
    if (el !== top.dialog && !el.inert) {
      el.inert = true;
      umnrInertElements.push(el);
    }
  });
}

/**
 * @description Abre la modal UMNR indicada (si existe y no está ya abierta).
 * @param {string} selector clase de la modal ('.fc-dialog-unmr', '.fc-dialog-unmr-terms'...)
 */
function openUmnrDialog(selector) {
  const dialog = getUmnrDialog(selector);
  if (!dialog || !dialog.hidden) {
    return;
  }
  // Se registra como abierta: sin esto la X, el clic en el fondo, Escape y el focus trap no
  // la encuentran (closeUmnrDialogElement y handleUmnrDialogKeydown leen umnrOpenDialogs).
  umnrOpenDialogs.push({ dialog, returnFocus: document.activeElement });
  dialog.removeAttribute('hidden');
  updateUmnrInert();

  // Foco inicial (uno solo, para que NVDA no lea el título dos veces): en la principal, el
  // input de fecha del menor 1 (siempre visible); en el resto, el propio contenedor.
  const firstInput = dialog.classList.contains('fc-dialog-unmr')
    ? dialog.querySelector('#unmr-birthdate-fc-dialog-unmr-1')
    : null;
  (firstInput || dialog).focus();
}

/**
 * @description Cierra la capa de modal UMNR indicada: la oculta, recoloca el inert, devuelve
 * el foco (si era la de arriba) y, si es la modal principal, la resetea.
 */
function closeUmnrDialogElement(dialog) {
  const index = umnrOpenDialogs.findIndex((entry) => entry.dialog === dialog);
  if (index === -1) {
    return;
  }
  const wasTop = index === umnrOpenDialogs.length - 1;
  const { returnFocus } = umnrOpenDialogs.splice(index, 1)[0];
  dialog.hidden = true;
  updateUmnrInert();
  if (wasTop && returnFocus && document.contains(returnFocus)) {
    returnFocus.focus();
  }
  if (dialog.classList.contains('fc-dialog-unmr')) {
    // eslint-disable-next-line no-use-before-define
    resetUmnrModal();
  }
}

/**
 * @description Cierra la modal UMNR indicada por su clase, si está abierta.
 */
function closeUmnrDialog(selector) {
  const dialog = getUmnrDialog(selector);
  if (dialog) {
    closeUmnrDialogElement(dialog);
  }
}

/**
 * @description Teclado de la modal UMNR de arriba: Escape la cierra y Tab / Shift+Tab dan la
 * vuelta dentro de ella (del último enfocable al primero y al revés).
 */
function handleUmnrDialogKeydown(e) {
  const top = umnrOpenDialogs[umnrOpenDialogs.length - 1];
  if (!top) {
    return;
  }
  if (e.key === 'Escape' || e.key === 'Esc') {
    e.preventDefault();
    closeUmnrDialogElement(top.dialog);
    return;
  }
  if (e.key !== 'Tab') {
    return;
  }
  const focusables = getUmnrFocusables(top.dialog);
  if (!focusables.length) {
    e.preventDefault();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement;
  if (e.shiftKey && (active === first || !top.dialog.contains(active))) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !top.dialog.contains(active))) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * @description Abre la modal UMNR de edad de menores. Foco inicial: el campo de fecha del
 * menor 1 (siempre está visible), con .focus() en openUmnrDialog.
 * GA4 (ATQ-34925) - evento 1: impresión de la modal.
 */
function openUmnrModal() {
  openUmnrDialog('.fc-dialog-unmr');
  // eslint-disable-next-line no-use-before-define
  sendUmnrInteraction('impresion', 'modal edad menores');
}

/**
 * @description Abre la modal de términos y condiciones (por encima de la UMNR). Foco inicial:
 * su primer enfocable, el bloque de texto con scroll (tabindex="0").
 */
function openUmnrTermsModal() {
  // eslint-disable-next-line no-use-before-define
  enhanceUmnrTermsTables($('.fc-dialog-unmr-terms'));
  openUmnrDialog('.fc-dialog-unmr-terms');
}

/**
 * @description ¿Está marcado el checkbox de términos y condiciones de la modal UMNR?
 */
function isUmnrTermsChecked() {
  return $('.fc-dialog-unmr .ibe-modal-unmr__terms input[type="checkbox"]').is(':checked');
}

/**
 * @description Deja la modal UMNR como recién abierta: vacía las fechas de nacimiento, oculta
 * todos los mensajes de error y quita el estado has-error, y desmarca el checkbox de
 * términos. Se llama al cerrar la modal (X, clic fuera, ESC o "Continuar") para que, si el
 * usuario la vuelve a abrir, no queden ni fechas ni errores de la vez anterior.
 */
function resetUmnrModal() {
  const $dialog = $('.fc-dialog-unmr');
  $dialog.find('.ibe-modal-unmr__date-input').val('');
  $dialog.find('.ibe-modal-unmr__date-group').removeClass('has-error');
  $dialog.find('.ibe-modal-unmr__error-msg').addClass('hidden');
  $dialog.find('.ibe-modal-unmr__terms').removeClass('has-error');
  $dialog.find('.ibe-modal-unmr__terms input[type="checkbox"]').prop('checked', false);
}


/**
 * @description Crea, a partir de una tabla del CMS de la modal de términos, su versión mobile
 * como lista de descripción (WCAG 1.3.1 / 4.1.2): un grupo <div> por fila con
 * <dt> = primera celda (el término) y un <dd> por cada celda restante (su definición). Cada
 * <dt>/<dd> lleva delante, como texto real, la cabecera de su columna ("Término",
 * "Definición propuesta"...), que sale del propio CMS en cualquier idioma.
 * El contenido de las celdas se clona tal cual (negritas, enlaces...).
 */
function buildUmnrTermsGlossary($table) {
  const headers = $table.find('thead th').map(function getHeaderText() {
    return $(this).text().trim();
  }).get();
  const $glossary = $('<dl class="ibe-modal-unmr__glossary"></dl>');

  $table.find('tbody tr').each(function buildGroup() {
    const $cells = $(this).children('th, td');
    if (!$cells.length) {
      return;
    }
    const $group = $('<div class="ibe-modal-unmr__glossary-item"></div>');
    $cells.each(function buildEntry(index) {
      const $entry = $(index === 0 ? '<dt></dt>' : '<dd></dd>');
      if (headers[index]) {
        $('<span class="ibe-modal-unmr__glossary-label"></span>').text(headers[index]).appendTo($entry);
      }
      $('<span class="ibe-modal-unmr__glossary-value"></span>').append($(this).contents().clone()).appendTo($entry);
      $group.append($entry);
    });
    $glossary.append($group);
  });

  return $glossary;
}

/**
 * @description Prepara las tablas del CMS de la modal de términos para mobile: el diseño apila
 * cada fila en bloques "Etiqueta / valor", y si eso se hace solo con CSS sobre la tabla, el
 * lector de pantalla sigue anunciando "tabla con N filas" (incidencia ATQ-36351). Por eso se
 * añade tras cada tabla su versión <dl> (buildUmnrTermsGlossary) y el SCSS muestra una u otra
 * según el breakpoint con display:none, que la saca también del árbol de accesibilidad: en
 * desktop solo existe la tabla y en mobile solo la lista.
 * Es idempotente: al reabrir la modal no duplica la lista.
 */
function enhanceUmnrTermsTables($dialog) {
  $dialog.find('.ibe-modal-unmr__body--terms table').each(function enhanceTable() {
    const $table = $(this);
    if ($table.next('.ibe-modal-unmr__glossary').length) {
      return;
    }
    $table.after(buildUmnrTermsGlossary($table));
  });
}

/**
 * @description Engancha la validación del checkbox de términos de la modal UMNR, su cierre
 * (X y clic en el fondo) y el reseteo al cerrarla — incluidos los elementos inyectados por AJAX más tarde.
 * Los errores de fecha de nacimiento NO se muestran al perder el foco: solo al pulsar
 * "Continuar" (canContinueUmnrFlow).
 */
function initUmnrBirthdateValidation() {
  $(document).on('beforeinput', '.ibe-modal-unmr__date-input', handleUmnrDateBeforeInput);
  $(document).on('change', '.ibe-modal-unmr__terms input[type="checkbox"]', function onTermsChange() {
    if ($(this).is(':checked')) {
      $(this).closest('.ibe-modal-unmr__terms')
        .removeClass('has-error')
        .siblings('.ibe-modal-unmr__error-msg--checkbox').addClass('hidden');
    }
  });
  // Cierre con la X de cada modal.
  $(document).on('click', '[data-umnr-close]', function onUmnrCloseClick() {
    closeUmnrDialogElement(this.closest('.ibe-dialog-umnr'));
  });
  // Clic en el fondo: la capa ocupa toda la pantalla, así que un clic fuera de la caja
  // (.modal-dialog) llega con target = la propia capa.
  $(document).on('click', '.ibe-dialog-umnr', function onUmnrBackdropClick(e) {
    if (e.target === this) {
      closeUmnrDialogElement(this);
    }
  });
  // Enlace "términos y condiciones" de la modal UMNR.
  $(document).on('click', '[data-umnr-open-terms]', (e) => {
    e.preventDefault();
    openUmnrTermsModal();
  });
  // Escape y focus trap de la modal UMNR de arriba.
  document.addEventListener('keydown', handleUmnrDialogKeydown);
}

/**
 * @description Valida todos los campos de fecha de nacimiento visibles (los que corresponden
 * al número real de menores, el resto sigue oculto) y el checkbox de términos al pulsar
 * "Continuar" (el botón se activa solo con las fechas; el checkbox se comprueba aquí, y si no
 * está marcado se marca en rojo y no se avanza). Todos los errores bloquean. Devuelve
 * true si se puede continuar.
 */
function canContinueUmnrFlow() {
  let hasBlockingError = false;
  $('.fc-dialog-unmr .ibe-modal-unmr__date-item:not(.hidden) .ibe-modal-unmr__date-input').each(function validateEach() {
    validateUmnrBirthdateInput(this);
    if ($(this).closest('.ibe-modal-unmr__date-group').hasClass('has-error')) {
      hasBlockingError = true;
    }
  });
  const termsChecked = isUmnrTermsChecked();
  $('.fc-dialog-unmr .ibe-modal-unmr__terms').toggleClass('has-error', !termsChecked);
  $('.fc-dialog-unmr .ibe-modal-unmr__error-msg--checkbox').toggleClass('hidden', termsChecked);
  return !hasBlockingError && termsChecked;
}

/**
 * @description Fechas de nacimiento de los menores (solo los campos visibles, los que
 * corresponden al número real de menores), en formato yyyy-mm-dd separadas por comas, para
 * pasarlas a MMB al lanzar la búsqueda (parámetro "birthDates"). El formato enviado a MMB es
 * siempre yyyy-mm-dd, independiente del idioma: la fecha se parsea antes con el formato del
 * placeholder (dd/mm/yyyy, o mm/dd/yyyy en inglés).
 * Ejemplo: "2015-05-12,2018-08-23,2020-01-15"
 */
function getUmnrBirthdatesParam() {
  const dates = [];
  $('.fc-dialog-unmr .ibe-modal-unmr__date-item:not(.hidden) .ibe-modal-unmr__date-input').each(function collectDate() {
    const birthDate = parseUmnrBirthDate($(this).val(), $(this).attr('data-format'));
    if (birthDate) {
      const day = String(birthDate.getDate()).padStart(2, '0');
      const month = String(birthDate.getMonth() + 1).padStart(2, '0');
      dates.push(`${birthDate.getFullYear()}-${month}-${day}`);
    }
  });
  return dates.join(',');
}

/* ==========================================================================
   ATQ-34925 — Eventos GA4 del flujo de la modal de menores viajando solos (UMNR)
   ========================================================================== */

/**
 * @description Envía un evento GA4 de interacción con el doble push habitual
 * (window.DigitalChange + window.dataLayer). La categoría es fija: "umnr".
 * @param {string} eventAction impresion | clic | validacion | aterrizaje
 * @param {string} eventLabel  etiqueta del evento (ver especificación ATQ-34925)
 */
function sendUmnrInteraction(eventAction, eventLabel) {
  const eventData = {
    eventName: 'interaccion',
    eventCategory: 'umnr',
    eventAction,
    eventLabel,
  };
  if (typeof window.DigitalChange !== 'undefined') {
    window.DigitalChange('interaction', eventData);
  }
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push(eventData, { event: 'interaction' });
  }
}

/**
 * @description Etiqueta corta de cada mensaje de validación de la modal UMNR, indexada por su
 * atributo data-validate. 
 */
const UMNR_VALIDATION_SHORT_TEXTS = {
  empty: 'sin fecha',
  'date-format': 'error formato',
  format: 'fuera de rango',
  'age-2-4': '2-4 años',
  'age-12-return': '12 en vuelta',
  terms: 'sin términos',
};

/**
 * @description Recoge, en orden de aparición, la etiqueta corta (UMNR_VALIDATION_SHORT_TEXTS)
 * de los mensajes de validación visibles en la modal UMNR (fechas de nacimiento y checkbox de
 * términos). Una misma etiqueta aparece tantas veces como menores la disparen. Se ignoran los campos de menores ocultos
 * (número de niños inferior al máximo del template) y los mensajes sin etiqueta corta mapeada.
 */
function getUmnrVisibleValidationLabels() {
  const labels = [];
  $('.fc-dialog-unmr .ibe-modal-unmr__error-msg:not(.hidden)').each(function collect() {
    const shortText = UMNR_VALIDATION_SHORT_TEXTS[$(this).attr('data-validate')];
    if (!shortText || $(this).closest('.ibe-modal-unmr__date-item.hidden').length > 0) {
      return;
    }
    labels.push(shortText);
  });
  return labels;
}

/**
 * @description Agrupa las etiquetas de getUmnrVisibleValidationLabels() en el detalle del
 * eventLabel: cada etiqueta una sola vez, en orden de primera aparición, con el número de
 * menores que la disparan entre paréntesis cuando es más de uno ("sin fecha (3)"). Así el
 * detalle no crece con el número de menores (hasta 8) y no se pasa del límite de 100
 * caracteres de GA4. Ejemplo: "fuera de rango (8),sin términos".
 */
function formatUmnrValidationDetail(labels) {
  const order = [];
  const counts = {};
  labels.forEach((label) => {
    if (counts[label] === undefined) {
      counts[label] = 0;
      order.push(label);
    }
    counts[label] += 1;
  });
  return order
    .map((label) => (counts[label] > 1 ? `${label} (${counts[label]})` : label))
    .join(',');
}

/**
 * @description Evento "validacion" (índice 3), que se lanza al pulsar "Continuar":
 * - "modal edad menores:ok" / "modal edad menores:ko" según canContinueUmnrFlow().
 * - Si hay mensajes de validación visibles se añade ":<et1>,<et2>,..." con sus etiquetas
 *   cortas y, entre paréntesis, cuántos menores disparan cada una si es más de uno.
 * @param {boolean} isValid resultado de canContinueUmnrFlow()
 */
function sendUmnrValidationEvent(isValid) {
  const base = isValid ? 'modal edad menores:ok' : 'modal edad menores:ko';
  const detail = formatUmnrValidationDetail(getUmnrVisibleValidationLabels());
  sendUmnrInteraction('validacion', detail ? `${base}:${detail}` : base);
}

/**
 * @description Engancha los eventos GA4 que no dependen del botón "Continuar":
 * 1. Impresión de la modal de edad de menores (al abrirse).
 * 4. Clic en "cerrar" de la modal de edad de menores.
 * 5. Clic en "ver términos y condiciones".
 * 6. Clic en "cerrar" de la modal de términos y condiciones.
 * (Los eventos 2 "clic:continuar", 3 "validacion" y "aterrizaje" se lanzan desde el
 * handler del propio botón "Continuar", en ibe_tab-flight.js.)
 */
let umnrGa4EventsBound = false;

function initUmnrGa4Events() {
  if (umnrGa4EventsBound) {
    return;
  }
  umnrGa4EventsBound = true;
  // El evento 1 (impresión) se lanza en openUmnrModal.
  $(document).on('click', '.fc-dialog-unmr [data-umnr-open-terms]', () => {
    sendUmnrInteraction('clic', 'modal edad menores:ver terminos y condiciones');
  });
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-umnr-close]');
    if (!closeBtn) {
      return;
    }
    if (closeBtn.closest('.fc-dialog-unmr-terms')) {
      sendUmnrInteraction('clic', 'modal edad menores:cerrar terminos y condiciones');
    } else if (closeBtn.closest('.fc-dialog-unmr')) {
      sendUmnrInteraction('clic', 'modal edad menores:cerrar');
    }
  }, true);
}

export {
  loadUmnrModal,
  initUmnrBirthdateValidation,
  canContinueUmnrFlow,
  openUmnrModal,
  closeUmnrDialog,
  getUmnrBirthdatesParam,
  sendUmnrInteraction,
  sendUmnrValidationEvent,
  initUmnrGa4Events,
};