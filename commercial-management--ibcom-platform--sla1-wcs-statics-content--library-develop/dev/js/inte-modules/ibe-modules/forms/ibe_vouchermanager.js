/* eslint-disable no-undef */
import { showErrorModal, getDateByFormat, replaceAll } from '../general/ibe_inte-util';
import retrieveGlobalVariables from '../general/ibe_variables';
import callVoucherService from '../manage/ibe_vouchermanager';
import { updateDatalayer, updateDigitalData } from '../manage/ibe_common';

const { marketg, localeg } = retrieveGlobalVariables();

function voucherManageForm() {
    const tabContent = $('#voucherLookup-content');
    const form = $('#voucherLookupForm', tabContent);
    const submitForm = $('#submitVoucherLookup', form);
    const resultSectionCheck = $('#voucherLookup-result', tabContent);
    const resultTableCheck = $('#voucherLookup-resultTable', resultSectionCheck);

    const tabVoucherJoin = '#tab-voucherJoin';
    const linkTabVoucherCheck = $('a[href="#tab-voucherLookup"]');
    const linkTabVoucherJoin = $('a[href="#tab-voucherJoin"]');
    let tab2Content; let firstStepJoin; let formJoin;
    let formConfirmJoin; let submitJoinForm; let submitConfirmJoin;
    let resultJoin; let resultJoinBonus; let resultJoinTable;
    let paramsVoucherService; let joinsuccess;
    let jointTabLoaded = false;
    let currentCheckDigitalData = {
        Quadrigam: 'GEBOCC',
        TrackingCode: `${marketg.toLowerCase()}/${localeg.toLowerCase()}/GEBOCC`,
        VoucherCode: undefined,
        VoucherAmount: undefined,
        HashEID: undefined,
        // VoucherCodeMerged: undefined,
        // VoucherCodeToUnify: undefined,
        VoucherBonusBalance: undefined,
        VersionWeb: 'angularjs',
    };
    let currentJoinDigitalData = {
        Quadrigam: 'GEBOUE',
        TrackingCode: `${marketg.toLowerCase()}/${localeg.toLowerCase()}/GEBOUE`,
        VoucherCode: undefined,
        VoucherAmount: undefined,
        HashEID: undefined,
        // VoucherCodeMerged: undefined,
        // VoucherCodeToUnify: undefined,
        VoucherBonusBalance: undefined,
        VersionWeb: 'angularjs',
    };
    let currentCheckDatalayer = {
        quadrigam: 'GEBOCC',
        codigoSeguimiento: `${marketg.toLowerCase()}/${localeg.toLowerCase()}/GEBOCC`,
        codigoBono: undefined,
        importeBono: undefined,
        hashEID: undefined,
        // codigoBonoFusionado: undefined,
        // codigoBonosUnificar: undefined,
        MergedBonusBalance: undefined,
        versionWeb: 'angularjs',
    };
    let currentJoinDatalayer = {
        quadrigam: 'GEBOUE',
        codigoSeguimiento: `${marketg.toLowerCase()}/${localeg.toLowerCase()}/GEBOUE`,
        codigoBono: undefined,
        importeBono: undefined,
        hashEID: undefined,
        // codigoBonoFusionado: undefined,
        // codigoBonosUnificar: undefined,
        MergedBonusBalance: undefined,
        versionWeb: 'angularjs',
    };

    function setAmountByCurrencyObject(amount, currencyObj) {
        let inte = 0;
        let dec = 0;
        inte = `${inte}`;
        const decSeparator = (currencyObj && currencyObj.decimalSeparator) ? currencyObj.decimalSeparator : ',';
        const decLength = (currencyObj && currencyObj.decimals) ? currencyObj.decimals : 2;
        const milSeparator = (currencyObj && currencyObj.groupingSeparator) ? currencyObj.groupingSeparator : '.';
        let currency = '';
        if (currencyObj && currencyObj.symbol) {
            currency = currencyObj.symbol;
        } else if (currencyObj && currencyObj.code) {
            currency = currencyObj.code;
        }
        inte = amount.toFixed(decLength);
        inte = parseInt(inte, 10);
        dec = amount - inte;
        inte = `${inte}`;
        dec = dec.toFixed(decLength);
        dec = `${dec}`;
        dec = dec.replace('.', decSeparator);
        dec = dec.substring(dec.indexOf(decSeparator));
        const num = (inte.split('')).reverse();
        let numFormat = '';
        let i = 0;
        for (i = num.length; i > 0; i--) {
            if (i % 3 === 0 && i !== num.length) {
                numFormat = numFormat + milSeparator + num[i - 1];
            } else {
                numFormat += num[i - 1];
            }
        }
        if (decLength > 0) {
            numFormat += dec;
        }
        if (currencyObj && currencyObj.alignment === 'L' && currency.length > 0) {
            numFormat = `${currency}&nbsp;${numFormat}`;
        } else if (currency.length > 0) {
            numFormat = `${numFormat}&nbsp;${currency}`;
        }
        return numFormat;
    }

    function showInfoVoucherTable(data, resultTable) {
        if (data) {
            let date;
            // Recover data
            let code = '-';
            if (data.commercialCode) {
                code = data.commercialCode;
            } else if (data.campaign.commercialCode) {
                code = data.campaign.commercialCode;
            }
            const remaining = (data.remaining !== undefined) ? setAmountByCurrencyObject(data.remaining, data.currency) : '-';
            // eslint-disable-next-line max-len
            let bonusExpiryDate = (data.expiryDate && data.expiryDate.to) ? data.expiryDate.to : undefined;
            // eslint-disable-next-line max-len
            let campaignExpiryDate = (data.campaign.expiryDate && data.campaign.expiryDate.to) ? data.campaign.expiryDate.to : undefined;
            let expiryDate;
            if (bonusExpiryDate !== undefined && campaignExpiryDate === undefined) {
                date = getDateByFormat(bonusExpiryDate, 'YYYY-MM-DD hh:mm:ss');
            } else if (bonusExpiryDate === undefined && campaignExpiryDate !== undefined) {
                date = getDateByFormat(campaignExpiryDate, 'YYYY-MM-DD hh:mm:ss');
            } else if (bonusExpiryDate !== undefined && campaignExpiryDate !== undefined) {
                bonusExpiryDate = getDateByFormat(bonusExpiryDate, 'YYYY-MM-DD hh:mm:ss');
                campaignExpiryDate = getDateByFormat(campaignExpiryDate, 'YYYY-MM-DD hh:mm:ss');
                if (bonusExpiryDate.getTime() > campaignExpiryDate.getTime()) {
                    date = campaignExpiryDate;
                } else {
                    date = bonusExpiryDate;
                }
            }
            if (date !== null && date !== undefined) {
                expiryDate = $('[data-voucherexpiredate]', resultTable).data('dateformat');
                expiryDate = expiryDate.replace('DD', date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`);
                expiryDate = expiryDate.replace('MM', date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`);
                expiryDate = expiryDate.replace('YYYY', date.getFullYear());
            } else {
                expiryDate = $('[data-voucherexpiredate]', resultTable).data('voucher-noexpire');
            }
            let companiesString = $('[data-voucher-nocompanies]', resultTable).data('voucher-nocompanies');
            let allowedDate = $('[data-voucheallowedreturn]', resultTable).data('voucher-noexpire');
            // Nuevo marina detalle bono
            let routesString = $('[data-voucher-all-trayectos]', resultTable).data('voucher-all-trayectos');
            let originsString = $('[data-voucher-all-origenes-destinos]', resultTable).data('voucher-all-origenes-destinos');
            let destinationsString = $('[data-voucher-all-origenes-destinos]', resultTable).data('voucher-all-origenes-destinos');
            let cabinsString = $('[data-voucher-all-cabinas]', resultTable).data('voucher-all-cabinas');
            let fareFamiliesString = $('[data-voucher-all-fare-families]', resultTable).data('voucher-all-fare-families');
            let conceptsString = $('[data-voucher-all-conceptos]', resultTable).data('voucher-all-conceptos');
            let excludesFeesFinalString = '';
            const anyExcludesFeesString = $('[data-voucher-any-tasas]', resultTable).data('voucher-any-tasas');
            const noExcludesFeesString = $('[data-voucher-no-tasas]', resultTable).data('voucher-no-tasas');
            const excludesFeesString = $('[data-voucher-yes-tasas]', resultTable).data('voucher-yes-tasas');
            const origenesString = $('[data-voucher-literal-origenes]', resultTable).data('voucher-literal-origenes');
            const destinosString = $('[data-voucher-literal-destinos]', resultTable).data('voucher-literal-destinos');
            if (data.journey) {
                if (data.journey.companies && data.journey.companies.length > 0) {
                    companiesString = [];
                    data.journey.companies.forEach((el) => {
                    // Special Case Iberia Level
                        if (el.code === 'LV') {
                            // eslint-disable-next-line no-param-reassign
                            el.description = 'LEVEL';
                        }
                        if (companiesString.indexOf(el.description) === -1) {
                            companiesString.push(el.description);
                        }
                    });
                    companiesString = companiesString.join(', ');
                    // Permitidas conexiones o no
                    if (data.journey.allowedOperatorsNotSelected) {
                        if (companiesString.length > 0) {
                            companiesString += '. ';
                        }
                        companiesString += $('[data-vouchercompanies]', resultTable).data('voucherallowedconnections');
                    }
                }

                if (data.journey.arrival) {
                    if (data.journey.arrival.allowed && data.journey.arrival.allowed.to) {
                        allowedDate = data.journey.arrival.allowed.to;
                        date = getDateByFormat(allowedDate, 'YYYY-MM-DD hh:mm:ss');
                        allowedDate = $('[data-voucheallowedreturn]', resultTable).data('dateformat');
                        allowedDate = allowedDate.replace('DD', date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`);
                        allowedDate = allowedDate.replace('MM', date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`);
                        allowedDate = allowedDate.replace('YYYY', date.getFullYear());
                    }
                }

                // Trayectos permitidos
                if (data.journey.allowedRoutes && data.journey.allowedRoutes.length > 0) {
                    routesString = [];
                    routesString = data.journey.allowedRoutes.map((r) => `${r.origin?.description || ''} - ${r.destination?.description || ''}`).join(', ');
                }
                // Origenes y Destinos
                if (data.journey.origins && data.journey.origins.length > 0) {
                    originsString = [];
                    originsString = [...new Set(data.journey.origins.map((o) => o.description))].join(', ');
                }
                if (data.journey.destinations && data.journey.destinations.length > 0) {
                    destinationsString = [];
                    destinationsString = [...new Set(data.journey.destinations.map((d) => d.description))].join(', ');
                }

                // Cabinas
                if (data.journey.cabinCode) {
                    cabinsString = data.journey.cabinCode;
                }
                // Fare Families
                if (data.journey.fareFamilies && data.journey.fareFamilies.length > 0) {
                    fareFamiliesString = data.journey.fareFamilies.join(', ');
                }
                // Conceptos permitidos
                if (data.expenses && data.expenses.length > 0) {
                    conceptsString = data.expenses.join(', ');
                }
                // Tasas
                if (!data.excludedFees || data.excludedFees.length === 0) {
                    // Caso: Sí aplica (vacío)
                    excludesFeesFinalString = excludesFeesString;
                } else if (data.excludedFees.length === 1) {
                    // Caso: Aplica alguna
                    excludesFeesFinalString = anyExcludesFeesString;
                } else if (data.excludedFees.length > 1) {
                    // Caso: No aplica
                    excludesFeesFinalString = noExcludesFeesString;
                }
            }

            // recorrido booking reference
            let bookingString = '<span>-</span>';
            let span;
            if (data.bookingReferences && data.bookingReferences.length > 0) {
                bookingString = '';
                data.bookingReferences.sort((a, b) => getDateByFormat(a.date, 'YYYY-MM-DD hh:mm:ss').getTime() - getDateByFormat(b.date, 'YYYY-MM-DD hh:mm:ss').getTime());
                data.bookingReferences.forEach((elem) => {
                    const el = elem;
                    span = $('<span>');
                    span.append(el.reference);
                    if (el.date) {
                        date = getDateByFormat(el.date, 'YYYY-MM-DD hh:mm:ss');
                        el.date = $('[data-voucherhistory]', resultTable).data('dateformat');
                        el.date = el.date.replace('DD', date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`);
                        el.date = el.date.replace('MM', date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`);
                        el.date = el.date.replace('YYYY', date.getFullYear());
                        span.append(`, ${el.date}`);
                    }
                    if (el.amount && data.type !== 'PERCENTAGE') {
                        span.append(`, ${setAmountByCurrencyObject(el.amount, data.currency)}`);
                    }
                    bookingString += span[0].outerHTML;
                });
            }

            let usageLimit = '-';
            if (data.maxUsages !== 0 && (data.type === 'GIFT_CARD' || data.type === 'RECHARGEABLE')) { // tarjeta de regalo ilimitadas
                usageLimit = $('[data-voucherremaininguses]', resultTable).data('voucher-limitlessuses');
            } else if (data.maxUsages > 1) { // si tenemos booking reference hacemos la resta
                usageLimit = data.maxUsages;
            } else if (data.maxUsages === 1) {
                usageLimit = $('[data-voucherremaininguses]', resultTable).data('voucher-oneuse');
            } else {
                usageLimit = $('[data-voucherremaininguses]', resultTable).data('voucher-used');
            }

            // ok codigo en condiciones.
            $('[data-vouchercode]', resultTable).html(code);
            // saldo restante ok
            $('[data-voucherbalance]', resultTable).html(remaining);
            // Fecha de expiracion
            $('[data-voucherexpiredate]', resultTable).html(expiryDate);
            // Compañías
            $('[data-vouchercompanies]', resultTable).html(companiesString);
            // Trayectos permitidos
            if (data.journey.allowedRoutes && data.journey.allowedRoutes.length > 0) {
                $('[data-vouchertrayectos]', resultTable).html(routesString);
            } else if (localeg !== 'pt' && (data.journey?.allowedRoutes?.length ?? 0) === 0) {
                $('[data-vouchertrayectos]', resultTable).html(routesString);
            } else if (localeg.toLowerCase() === 'pt' && (data.journey?.allowedRoutes?.length ?? 0) === 0) {
                $('[data-vouchertrayectos]', resultTable).html($('[data-voucher-all-fare-families]', resultTable).data('voucher-all-fare-families'));
            }
            // Origenes y destinos
            // eslint-disable-next-line max-len
            if (localeg.toLowerCase() !== 'fr' && (data.journey?.origins?.length ?? 0) === 0 && (data.journey?.destinations?.length ?? 0) === 0) {
                $('[data-voucherorigenesdestinos]', resultTable).html($('[data-voucher-all-origenes-destinos]', resultTable).data('voucher-all-origenes-destinos'));
            } else if (localeg.toLowerCase() === 'fr' && (data.journey?.origins?.length ?? 0) === 0 && (data.journey?.destinations?.length ?? 0) === 0) {
                $('[data-voucherorigenesdestinos]', resultTable).html($('[data-voucher-all-fare-families]', resultTable).data('voucher-all-fare-families'));
            } else {
                const htmlOriDest = `<p class="paragraph paragraph__regular">${origenesString}: ${originsString}</p> <p class="paragraph paragraph__regular">${destinosString}: ${destinationsString}</p>`;
                $('[data-voucherorigenesdestinos]', resultTable).html(htmlOriDest);
            }
            // Cabinas
            $('[data-vouchercabinas]', resultTable).html(cabinsString);
            // Fare Families
            $('[data-voucherfarefamilies]', resultTable).html(fareFamiliesString);
            // Conceptos
            $('[data-voucherconceptos]', resultTable).html(conceptsString);
            // Tasas
            $('[data-vouchertasasbilletes]', resultTable).html(excludesFeesFinalString);
            // Máximo número de usos
            $('[data-voucherremaininguses]', resultTable).html(usageLimit);
            // fechas permitidas para volar mirar metodo de fecha
            $('[data-voucheallowedreturn]', resultTable).html(allowedDate);
            $('[data-voucherhistory]', resultTable).html(bookingString);
        }
    }
    submitForm.on('click submit', (e) => {
        e.preventDefault();
        if (dFrontJs.ibe_validate.validateForm('#voucherLookupForm')) {
            const email = $.trim($('#voucher-mail', form).val());
            const voucherId = $.trim($('#voucherCode', form).val());
            const params = { email, voucherId };

            dFrontJs.ibe_loading.open('#tab-voucherLookup');
            submitForm.prop('disabled', true);
            datalayer_general.quadrigam = 'GEBOCC';
            datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
            datalayer_general.codigoBono = undefined;
            datalayer_general.importeBono = undefined;
            datalayer_general.hashEID = undefined;
            //  datalayer_general.codigoBonoFusionado = undefined;
            //  datalayer_general.codigoBonosUnificar = undefined;
            datalayer_general.MergedBonusBalance = undefined;
            datalayer_general.versionWeb = 'angularjs';
            Object.assign(currentCheckDatalayer, datalayer_general);
            // update digital_data
            digital_data.Quadrigam = 'GEBOCC';
            digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
            digital_data.VoucherCode = undefined;
            digital_data.VoucherAmount = undefined;
            digital_data.HashEID = undefined;
            // digital_data.VoucherCodeMerged = undefined;
            // digital_data.VoucherCodeToUnify = undefined;
            digital_data.VoucherBonusBalance = undefined;
            digital_data.VersionWeb = 'angularjs';
            Object.assign(currentCheckDigitalData, digital_data);
            updateDatalayer('view');
            updateDigitalData('view');
            callVoucherService('CONDITION', params)
                .done((data) => {
                    submitForm.prop('disabled', false);
                    if (data && data.type === 'PERCENTAGE' && data.maxUsages !== 1) {
                        showErrorModal(form.data('disabled-voucher'));
                        resultSectionCheck.addClass('hidden');
                        dFrontJs.ibe_loading.close('#tab-voucherLookup');
                    } else if (data && data.type === 'PERCENTAGE' && data.maxUsages === 1) {
                        showInfoVoucherTable(data, resultTableCheck);
                        dFrontJs.ibe_loading.close('#tab-voucherLookup');
                        resultSectionCheck.removeClass('hidden');
                        datalayer_general.quadrigam = 'GEBODP';
                        datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
                        datalayer_general.codigoBono = data.commercialCode;
                        datalayer_general.importeBono = setAmountByCurrencyObject(data.remaining, data.currency).replace('&nbsp;', ' ');
                        datalayer_general.hashEID = data.hashedEmail;
                        datalayer_general.MergedBonusBalance = undefined;
                        Object.assign(currentCheckDatalayer, datalayer_general);
                        // update digital_data
                        digital_data.Quadrigam = 'GEBODP';
                        digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
                        digital_data.VoucherCode = data.commercialCode;
                        digital_data.VoucherAmount = setAmountByCurrencyObject(data.remaining, data.currency).replace('&nbsp;', ' ');
                        digital_data.HashEID = data.hashedEmail;
                        digital_data.VoucherBonusBalance = undefined;
                        Object.assign(currentCheckDigitalData, digital_data);
                        updateDatalayer('view');
                        updateDigitalData('view');
                    } else if (data && data.status === 'CREATED') {
                        showInfoVoucherTable(data, resultTableCheck);
                        dFrontJs.ibe_loading.close('#tab-voucherLookup');
                        resultSectionCheck.removeClass('hidden');
                        datalayer_general.quadrigam = 'GEBODC';
                        datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
                        datalayer_general.codigoBono = data.commercialCode;
                        datalayer_general.importeBono = setAmountByCurrencyObject(data.remaining, data.currency).replace('&nbsp;', ' ');
                        datalayer_general.hashEID = data.hashedEmail;
                        // datalayer_general.codigoBonoFusionado = undefined;
                        // datalayer_general.codigoBonosUnificar = undefined;
                        datalayer_general.MergedBonusBalance = undefined;
                        Object.assign(currentCheckDatalayer, datalayer_general);
                        // update digital_data
                        digital_data.Quadrigam = 'GEBODC';
                        digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
                        digital_data.VoucherCode = data.commercialCode;
                        digital_data.VoucherAmount = setAmountByCurrencyObject(data.remaining, data.currency).replace('&nbsp;', ' ');
                        digital_data.HashEID = data.hashedEmail;
                        // digital_data.VoucherCodeMerged = undefined;
                        // digital_data.VoucherCodeToUnify = undefined;
                        digital_data.VoucherBonusBalance = undefined;
                        Object.assign(currentCheckDigitalData, digital_data);
                        updateDatalayer('view');
                        updateDigitalData('view');
                    } else if (data) {
                        if (data.status === 'FRAUD') {
                            showErrorModal(form.data('invalidvoucher-fraud'));
                        } else if (data.status === 'REFUND') {
                            showErrorModal(form.data('invalidvoucher-refund'));
                        } else if (data.status === 'CHANGE') {
                            showErrorModal(form.data('invalidvoucher-change'));
                        } else if (data.status === 'DUPLICATE') {
                            showErrorModal(form.data('invalidvoucher-duplicate'));
                        } else if (data.status === 'MERGE') {
                            showErrorModal(form.data('invalidvoucher-vouchergroup'));
                        } else if (data.status === 'EMD') {
                            showErrorModal(form.data('invalidvoucher-emd'));
                        } else {
                            showErrorModal(form.data('invalidvoucher-revenueaccounting'));
                        }
                        datalayer_general.quadrigam = 'GEBOER';
                        datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
                        datalayer_general.codigoBono = undefined;
                        datalayer_general.importeBono = undefined;
                        datalayer_general.hashEID = undefined;
                        // datalayer_general.codigoBonoFusionado = undefined;
                        // datalayer_general.codigoBonosUnificar = undefined;
                        datalayer_general.MergedBonusBalance = undefined;
                        Object.assign(currentCheckDatalayer, datalayer_general);
                        // update digital_data
                        digital_data.Quadrigam = 'GEBOER';
                        digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
                        digital_data.VoucherCode = undefined;
                        digital_data.VoucherAmount = undefined;
                        digital_data.HashEID = undefined;
                        //  digital_data.VoucherCodeMerged = undefined;
                        // digital_data.VoucherCodeToUnify = undefined;
                        digital_data.VoucherBonusBalance = undefined;
                        Object.assign(currentCheckDigitalData, digital_data);
                        updateDatalayer('view');
                        updateDigitalData('view');

                        dFrontJs.ibe_loading.close('#tab-voucherLookup');
                        var metaTitleError = $('#GEBOER').val() ? $('#GEBOER').val() : "";
                        document.title = metaTitleError;
                    } else {
                        // Data not found
                        resultSectionCheck.addClass('hidden');
                        dFrontJs.ibe_loading.close('#tab-voucherLookup');
                        showErrorModal(form.data('voucher-notfound'));
                        var metaTitleError = $('#GEBOER').val() ? $('#GEBOER').val() : "";
                        document.title = metaTitleError;
                    }
                })
                .fail((error) => {
                    datalayer_general.quadrigam = 'GEBOER';
                    datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
                    datalayer_general.codigoBono = undefined;
                    datalayer_general.importeBono = undefined;
                    datalayer_general.hashEID = undefined;
                    //  datalayer_general.codigoBonoFusionado = undefined;
                    // datalayer_general.codigoBonosUnificar = undefined;
                    datalayer_general.MergedBonusBalance = undefined;
                    Object.assign(currentCheckDatalayer, datalayer_general);
                    // update digital_data
                    digital_data.Quadrigam = 'GEBOER';
                    digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
                    digital_data.VoucherCode = undefined;
                    digital_data.VoucherAmount = undefined;
                    digital_data.HashEID = undefined;
                    //  digital_data.VoucherCodeMerged = undefined;
                    // digital_data.VoucherCodeToUnify = undefined;
                    digital_data.VoucherBonusBalance = undefined;
                    Object.assign(currentCheckDigitalData, digital_data);
                    updateDatalayer('view');
                    updateDigitalData('view');

                    resultSectionCheck.addClass('hidden');
                    submitForm.prop('disabled', false);
                    dFrontJs.ibe_loading.close('#tab-voucherLookup');
                    if (error.status === 409) {
                        showErrorModal(form.data('disabled-voucher'));
                    } else if (error.status === 404) {
                        showErrorModal(form.data('voucher-notfound'));
                    } else {
                        showErrorModal();
                    }
                    var metaTitleError = $('#GEBOER').val() ? $('#GEBOER').val() : "";
                    document.title = metaTitleError;
                });
        }
    });

    // Tab join vouchers - Add new voucher
    function addVoucher() {
        const vouchers = $('.inte-additionalVoucher', formJoin);
        const index = vouchers.not(':hidden').length;
        vouchers.eq(index).removeClass('hidden')
            .find('.inte-deletevoucher').removeClass('hidden');
        if ($(this)[0] && window.screen.width <= 768) {
            $(this)[0].scrollIntoView(false);
        }
        if (index - 1 >= 0) {
            vouchers.eq(index - 1).find('.inte-deletevoucher').addClass('hidden');
        }
        if (index === vouchers.length - 1) {
            $(this).addClass('hidden');
        }
    }

  // Tab join vouchers - Remove voucher
  const deleteVoucher = () => {
    const vouchers = $('.inte-additionalVoucher', formJoin);
    const visible = vouchers.not(':hidden');
    const index = visible.length - 1;
    if (visible.length <= vouchers.length) {
      $('#voucherJoin-addvoucher', formJoin).removeClass('hidden');
    }
    if (index >= 0) {
      vouchers.eq(index).addClass('hidden');
      vouchers.eq(index).find('div .ibe_form__group--error').removeClass('ibe_form__group--error');
      vouchers.eq(index).find('div .ibe_form__group--content').removeClass('ibe_form__group--content');
      vouchers.eq(index).find('[data-validate-text]').addClass('hidden');
      vouchers.eq(index).find(':input').val('');

      if (index - 1 >= 0) {
        vouchers.eq(index - 1).find('.inte-deletevoucher').removeClass('hidden');
      }
    }
  };

  // Tab join vouchers - reset inputs
  const clearFormData = () => {
    formJoin[0].reset();
    formConfirmJoin[0].reset();
    dFrontJs.ibe_inputs.init();
    $('.inte-additionalVoucher', formJoin).addClass('hidden');
    $('#voucherJoin-deletevoucher', formJoin).addClass('hidden');
    $('#voucherJoin-addvoucher', formJoin).removeClass('hidden');
    $('.ibe_form__group--error', formJoin).removeClass('ibe_form__group--error');
    $('[data-validate-text]', formJoin).addClass('hidden');
    $('.ibe_form__group--error', formConfirmJoin).removeClass('ibe_form__group--error');
    $('[data-validate-text]', formConfirmJoin).addClass('hidden');
    firstStepJoin.removeClass('hidden');
    resultJoin.addClass('hidden');
    joinsuccess.addClass('hidden');
    $('#voucherManageForms')[0].scrollIntoView();
    // Reset second step templates
    resultJoinBonus.find('#voucherJoinBonus-body').children().remove();
    joinsuccess.children().remove();
    $('.inte-voucherConfirm-mailKO', tab2Content).addClass('hidden');
    $('.inte-voucherConfirm-mailOK', tab2Content).addClass('hidden');

    // Update datalayer
    datalayer_general.quadrigam = 'GEBOUE';
    datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
    datalayer_general.codigoBono = undefined;
    datalayer_general.importeBono = undefined;
    datalayer_general.hashEID = undefined;
  //  datalayer_general.codigoBonoFusionado = undefined;
  //  datalayer_general.codigoBonosUnificar = undefined;
    datalayer_general.MergedBonusBalance = undefined;
    Object.assign(currentJoinDatalayer, datalayer_general);
    // update digital_data
    digital_data.Quadrigam = 'GEBOUE';
    digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
    digital_data.VoucherCode = undefined;
    digital_data.VoucherAmount = undefined;
    digital_data.HashEID = undefined;
   // digital_data.VoucherCodeMerged = undefined;
   // digital_data.VoucherCodeToUnify = undefined;
    digital_data.VoucherBonusBalance = undefined;
    Object.assign(currentJoinDigitalData, digital_data);
    updateDatalayer('view');
    updateDigitalData('view');
    var metaTitleClear = $('#GEBOUE').val() ? $('#GEBOUE').val() : "";
    document.title = metaTitleClear;
  };

  const cancelVoucherJoin = () => {
    $('.inte-first-modal-error [data-dialog="close"]:first').trigger('click');
    dFrontJs.ibe_loading.open('#tab-voucherJoin');

    callVoucherService('DELETE', paramsVoucherService)
      .always(() => {
        clearFormData();
        dFrontJs.ibe_loading.close('#tab-voucherJoin');
      });
  };

  /**
* Print information of Merge Voucher Service
* @param {*} data Information of vouchers and new voucher join
*/
  const showInfoJoin = (data) => {
    datalayer_general.quadrigam = 'GEBOUD';
    datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
    datalayer_general.codigoBono = undefined;
    datalayer_general.importeBono = undefined;
    datalayer_general.hashEID = data.newVoucherId.hashedEmail;
    //datalayer_general.codigoBonoFusionado = data.newVoucherId.commercialCode;
    //datalayer_general.codigoBonosUnificar = '';
    datalayer_general.MergedBonusBalance = setAmountByCurrencyObject(data.newVoucherId.remaining, data.newVoucherId.currency).replace('&nbsp;', ' ');

    // update digital_data
    digital_data.Quadrigam = 'GEBOUD';
    digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
    digital_data.VoucherCode = undefined;
    digital_data.VoucherAmount = undefined;
    digital_data.HashEID = data.newVoucherId.hashedEmail;
   // digital_data.VoucherCodeMerged = data.newVoucherId.commercialCode;
   // digital_data.VoucherCodeToUnify = '';
    digital_data.VoucherBonusBalance = setAmountByCurrencyObject(data.newVoucherId.remaining, data.newVoucherId.currency).replace('&nbsp;', ' ');

    const voucherRowTemplate = $('#voucher-joinBonus-rowtp');
    const bodyTable = $('#voucherJoinBonus-body', formConfirmJoin);
    let innerHTML = '';
    let mapObj = {};
    const vouchersMerged = data.voucherIdsToMerge ? data.voucherIdsToMerge : [];
    vouchersMerged.sort((objA, objB) => {
      const dateA = objA.expiryDate ? objA.expiryDate : `${new Date().getFullYear() + 10}-01-01 00:00:00`;
      const dateB = objB.expiryDate ? objB.expiryDate : `${new Date().getFullYear() + 10}-01-01 00:00:00`;
      return getDateByFormat(dateA, 'YYYY-MM-DD hh:mm:ss').getTime() - getDateByFormat(dateB, 'YYYY-MM-DD hh:mm:ss').getTime();
    });

    vouchersMerged.forEach((elem, index) => {
      const el = elem;
      let date = voucherRowTemplate.data('voucher-noexpire');
      if (el.expiryDate) {
        date = getDateByFormat(el.expiryDate, 'YYYY-MM-DD hh:mm:ss');
        el.expiryDate = voucherRowTemplate.data('dateformat');
        el.expiryDate = el.expiryDate.replace('DD', date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`);
        el.expiryDate = el.expiryDate.replace('MM', date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`);
        el.expiryDate = el.expiryDate.replace('YYYY', date.getFullYear());
        date = el.expiryDate;
      }
      mapObj = {
        '{{data-voucher-code}}': el.voucherId ? el.voucherId : '-',
        '{{data-voucher-expireData}}': date,
        '{{data-voucher-amount}}': el.amount ? setAmountByCurrencyObject(el.amount, data.newVoucherId.currency) : '-',
      };
      innerHTML += replaceAll(voucherRowTemplate.html(), mapObj);
     // if (index > 0) {
       // datalayer_general.codigoBonosUnificar += '|';
       // digital_data.VoucherCodeToUnify += '|';
     // }
      //datalayer_general.codigoBonosUnificar += el.voucherId;
     // digital_data.VoucherCodeToUnify += el.voucherId;
      bodyTable.html(innerHTML);
    });

    showInfoVoucherTable(data.newVoucherId, resultJoinTable);
    firstStepJoin.addClass('hidden');
    resultJoin.removeClass('hidden');

    Object.assign(currentJoinDatalayer, datalayer_general);
    Object.assign(currentJoinDigitalData, digital_data);
    updateDatalayer('view');
    updateDigitalData('view');

    dFrontJs.ibe_loading.close('#tab-voucherJoin');
    var metaTitleJoin = $('#GEBOUD').val() ? $('#GEBOUD').val() : "";
    document.title = metaTitleJoin;
  };

  function submitJoin(e) {
    e.preventDefault();

    if (dFrontJs.ibe_validate.validateForm('#voucherJoinForm')) {
      dFrontJs.ibe_loading.open('#tab-voucherJoin');
      submitJoinForm.prop('disabled', true);
      const email = $.trim($('#voucher-mail-join', formJoin).val());
      const vouchersIds = [];
      $('[id^=voucherBonus]:visible', formJoin).each((_i, elem) => {
        vouchersIds.push($.trim($(elem).val()));
      });
      paramsVoucherService = { voucherIds: vouchersIds, email };

      callVoucherService('SIMULATION', paramsVoucherService)
        .done((data) => {
          submitJoinForm.prop('disabled', false);
          if (data) {
            showInfoJoin(data);
          } else {
            // TODO Data not found
            dFrontJs.ibe_loading.close('#tab-voucherJoin');
            showErrorModal();
          }
        })
        .fail((error) => {
          submitJoinForm.prop('disabled', false);
          if (error && (error.status === 409 || error.status === 404)) {
            dFrontJs.ibe_modal.showModal('.inte-joinVoucher-error');
          } else {
            showErrorModal();
          }
          dFrontJs.ibe_loading.close('#tab-voucherJoin');
          datalayer_general.quadrigam = 'GEBOUQ';
          datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
          datalayer_general.codigoBono = undefined;
          datalayer_general.importeBono = undefined;
          datalayer_general.hashEID = undefined;
         // datalayer_general.codigoBonoFusionado = undefined;
         // datalayer_general.codigoBonosUnificar = undefined;
          datalayer_general.MergedBonusBalance = undefined;
          // update digital_data
          digital_data.Quadrigam = 'GEBOUQ';
          digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
          digital_data.VoucherCode = undefined;
          digital_data.VoucherAmount = undefined;
          digital_data.HashEID = undefined;
        //  digital_data.VoucherCodeMerged = undefined;
        //  digital_data.VoucherCodeToUnify = undefined;
          digital_data.VoucherBonusBalance = undefined;

          Object.assign(currentJoinDatalayer, datalayer_general);
          Object.assign(currentJoinDigitalData, digital_data);
          updateDatalayer('view');
          updateDigitalData('view');
          var metaTitleConfirm = $('#GEBOUQ').val() ? $('#GEBOUQ').val() : "";
          document.title = metaTitleConfirm;
        });
    } else {
      submitJoinForm.prop('disabled', false);
    }
  }

  const showConfirmJoin = (data) => {
    /**
 * MAPPING
 * CÓDIGO BONOnewVoucherId.campaign.id
* CORREO ELECTRONICO(input form) paramsVoucherService.email
*/

    const successTemplate = $('#voucherJoin-successTemplate');
    const bodyDiv = $('#voucherJoin-success', tab2Content);
    let innerHTML = '';
    let mapObj = {};
    mapObj = {
      '{{data-confirm-code}}': data.newVoucherId.commercialCode,
      '{{data-confirm-email}}': paramsVoucherService.email,
    };
    innerHTML = replaceAll(successTemplate.html(), mapObj);
    bodyDiv.html(innerHTML);
    // Aqui meter el codigo para que muestre uno u otro dependiendo del que corresponda
    if (data.warnings && data.warnings.length > 0) {
      $('.inte-voucherConfirm-mailKO', tab2Content).removeClass('hidden');
      $('.inte-voucherConfirm-mailOK', tab2Content).addClass('hidden');
    } else {
      $('.inte-voucherConfirm-mailKO', tab2Content).addClass('hidden');
      $('.inte-voucherConfirm-mailOK', tab2Content).removeClass('hidden');
    }

    $('.inte-cleanformdata', tab2Content).click(clearFormData);
    resultJoin.addClass('hidden');
    joinsuccess.removeClass('hidden');
    datalayer_general.quadrigam = 'GEBOUC';
    datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
    datalayer_general.codigoBono = undefined;
    datalayer_general.importeBono = undefined;
    datalayer_general.hashEID = data.newVoucherId.hashedEmail;
    //datalayer_general.codigoBonoFusionado = data.newVoucherId.commercialCode;
   // datalayer_general.codigoBonosUnificar = undefined;
    datalayer_general.MergedBonusBalance = setAmountByCurrencyObject(data.newVoucherId.remaining, data.newVoucherId.currency).replace('&nbsp;', ' ');
    // update digital_data
    digital_data.Quadrigam = 'GEBOUC';
    digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
    digital_data.VoucherCode = undefined;
    digital_data.VoucherAmount = undefined;
    digital_data.HashEID = data.newVoucherId.hashedEmail;
  //  digital_data.VoucherCodeMerged = data.newVoucherId.commercialCode;
  //  digital_data.VoucherCodeToUnify = undefined;
    digital_data.VoucherBonusBalance = setAmountByCurrencyObject(data.newVoucherId.remaining, data.newVoucherId.currency).replace('&nbsp;', ' ');

    Object.assign(currentJoinDatalayer, datalayer_general);
    Object.assign(currentJoinDigitalData, digital_data);
    updateDatalayer('view');
    updateDigitalData('view');

    dFrontJs.ibe_loading.close('#tab-voucherJoin');
    var metaTitleConfirm = $('#GEBOUC').val() ? $('#GEBOUC').val() : "";
    document.title = metaTitleConfirm;
  };

  const confirmJoin = (e) => {
    e.preventDefault();
    if (dFrontJs.ibe_validate.validateForm('#voucherConfirmJoinForm')) {
      dFrontJs.ibe_loading.open('#tab-voucherJoin');
      submitConfirmJoin.prop('disabled', true);

      callVoucherService('CONFIRMATION', paramsVoucherService)
        .done((data) => {
          submitConfirmJoin.prop('disabled', false);
          if (data) {
            showConfirmJoin(data);
          } else {
            // TODO Confirmar
            dFrontJs.ibe_loading.close('#tab-voucherJoin');
            showErrorModal();
          }
        })
        .fail((error) => {
          submitConfirmJoin.prop('disabled', false);
          if (error && (error.status === 409 || error.status === 404)) {
            dFrontJs.ibe_modal.showModal('.inte-joinVoucher-error');
          } else {
            showErrorModal();
          }
          dFrontJs.ibe_loading.close('#tab-voucherJoin');
          datalayer_general.quadrigam = 'GEBOUQ';
          datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
          datalayer_general.codigoBono = undefined;
          datalayer_general.importeBono = undefined;
          datalayer_general.hashEID = undefined;
        //  datalayer_general.codigoBonoFusionado = undefined;
        //  datalayer_general.codigoBonosUnificar = undefined;
          datalayer_general.MergedBonusBalance = undefined;
          // update digital_data
          digital_data.Quadrigam = 'GEBOUQ';
          digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
          digital_data.VoucherCode = undefined;
          digital_data.VoucherAmount = undefined;
          digital_data.HashEID = undefined;
        //  digital_data.VoucherCodeMerged = undefined;
         // digital_data.VoucherCodeToUnify = undefined;
          digital_data.VoucherBonusBalance = undefined;

          Object.assign(currentJoinDatalayer, datalayer_general);
          Object.assign(currentJoinDigitalData, digital_data);
          updateDatalayer('view');
          updateDigitalData('view');
          var metaTitleConfirm = $('#GEBOUQ').val() ? $('#GEBOUQ').val() : "";
          document.title = metaTitleConfirm;
        });
    } else {
      submitConfirmJoin.prop('disabled', false);
    }
  };

  const initTab2 = () => {
    tab2Content = $('#voucherJoin-content');
    formJoin = $('#voucherJoinForm', tab2Content);
    formConfirmJoin = $('#voucherConfirmJoinForm', tab2Content);
    submitConfirmJoin = $('#voucherJoin-confirmSubmit', formConfirmJoin);
    submitJoinForm = $('#submitVoucherJoin', formJoin);
    firstStepJoin = $('#voucherJoin-formSection', tab2Content);
    // Vista 2 paso
    resultJoin = $('#voucherJoin-result', tab2Content);
    // Tabla de bonos unificados
    resultJoinBonus = $('#voucherJoinBonus-result', resultJoin);
    // Tabla de Bono final
    resultJoinTable = $('#voucherJoinTable-result', resultJoin);
    // success section
    joinsuccess = $('#voucherJoin-success', tab2Content);


    dFrontJs.ibe_validate.init();
    dFrontJs.ibe_inputs.init();

    $('#voucherJoin-addvoucher', formJoin).click(addVoucher);
    $('.inte-deletevoucher', formJoin).click(deleteVoucher);
    $('.inte-cleanformdata', tab2Content).click(clearFormData);

    // Cancel voucher join
    dFrontJs.ibe_modal.createModal('.inte-first-modal-error');
    dFrontJs.ibe_modal.createModal('.inte-joinVoucher-error');

    dFrontJs.ibe_modal.closeModal();
    $('.inte-cancelVoucherJoin').click(() => {
      // Update datalayer
      datalayer_general.quadrigam = 'GEBOUA';
      datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${datalayer_general.quadrigam}`;
      datalayer_general.codigoBono = undefined;
      datalayer_general.importeBono = undefined;
      datalayer_general.hashEID = undefined;
      //datalayer_general.codigoBonoFusionado = undefined;
     // datalayer_general.codigoBonosUnificar = undefined;
      datalayer_general.MergedBonusBalance = undefined;
      // update digital_data
      digital_data.Quadrigam = 'GEBOUA';
      digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/${digital_data.Quadrigam}`;
      digital_data.VoucherCode = undefined;
      digital_data.VoucherAmount = undefined;
      digital_data.HashEID = undefined;
    //  digital_data.VoucherCodeMerged = undefined;
    //  digital_data.VoucherCodeToUnify = undefined;
      digital_data.VoucherBonusBalance = undefined;

      Object.assign(currentJoinDatalayer, datalayer_general);
      Object.assign(currentJoinDigitalData, digital_data);
      updateDatalayer('view');
      updateDigitalData('view');

      dFrontJs.ibe_modal.showModal('.inte-first-modal-error');
      var metaTitleInit= $('#GEBOUA').val() ? $('#GEBOUA').val() : "";
      document.title = metaTitleInit;
    });
    $('.inte-cancel-voucher-join').click(cancelVoucherJoin);

    $('#voucher-reset').click(() => {
      $('.inte-joinVoucher-error [data-dialog="close"]:first').trigger('click');
      clearFormData();
      linkTabVoucherCheck.trigger('click');
    });

    // Botón Continuar 1/2
    submitJoinForm.on('click submit', submitJoin);
    // Botón Unificar 2/2
    submitConfirmJoin.on('click submit', confirmJoin);
  };

  linkTabVoucherJoin.on('click', function loadTab() {
    linkTabVoucherJoin.off('click', loadTab);
    // update datalayer_general
    datalayer_general = Object.assign(datalayer_general, currentJoinDatalayer);
    // update digital_data
    digital_data = Object.assign(digital_data, currentJoinDigitalData);
    updateDatalayer('view');
    updateDigitalData('view');

    if (!jointTabLoaded) {
      dFrontJs.ibe_loading.open(tabVoucherJoin);
      const htmlTabRequest = $.ajax({
        method: 'GET',
        url: '/cs/Satellite',
        data: {
          pagename: 'IB_SE/CacheControl6h/BrowserCache3600/Form/VoucherJoin',
          market: marketg,
          locale: localeg,
          d: 'Desktop',
        },
      });
      htmlTabRequest.done((data) => {
        if (data) {
          $(tabVoucherJoin).append(data);
          initTab2();
          dFrontJs.ibe_loading.close(tabVoucherJoin);
          jointTabLoaded = true;
        }
        dFrontJs.modalFunction.init();
      });
      htmlTabRequest.fail(() => {
        dFrontJs.ibe_loading.close(tabVoucherJoin);
      });
    }
    linkTabVoucherJoin.on('click', loadTab);
    var metaTitleTabJoin= $('#GEBOUE').val() ? $('#GEBOUE').val() : "";
    document.title = metaTitleTabJoin;
  });

  linkTabVoucherCheck.on('click', () => {
    // update datalayer_general
    Object.assign(datalayer_general, currentCheckDatalayer);
    // update digital_data
    Object.assign(digital_data, currentCheckDigitalData);
    updateDatalayer('view');
    updateDigitalData('view');
    var metaTitleVoucher= $('#GEBOCC').val() ? $('#GEBOCC').val() : "";
    document.title = metaTitleVoucher;
  });
}

voucherManageForm();
