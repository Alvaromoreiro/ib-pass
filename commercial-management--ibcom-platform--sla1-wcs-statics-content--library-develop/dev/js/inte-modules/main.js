/** ***************************************************************************
 *    Proyecto: IBERIA COM
 *    Desripcion: Fichero con las funciones JavaScript custom del proyecto
 ***************************************************************************** */
import {
	getQuerystrParams,
	isPrivateAreaApp,
	loadjsfile,
} from "./ibe-modules/general/ibe_inte-util";
import { dologin, onBusinessLogin } from "./ibe-modules/general/ibe_login";
import getVisitorData from "./ibe-modules/general/ibe_visitor-data";
import headerNavigation from "./ibe-modules/general/ibe_header";
import { logoutIBPlusService } from "./ibe-modules/manage/ibe_logged-service";
import * as SessionStorage from "./ibe-modules/manage/SessionStorage";
import loadOfficeResults from "./ibe-modules/manage/ibe_offices";
import retrieveGlobalVariables from "./ibe-modules/general/ibe_variables";
import { pushToMonetate, updateDatalayer, updateDigitalData } from "./ibe-modules/manage/ibe_common";
import { init as LoginIframeInit } from "./ibe-modules/general/ibe_loginIframe";

const {
	localeg,
	marketg,
	quadrigam,
	staticsVersion,
	salesforceClientId,
	salesforceRedirectUri,
	salesforceURL,
	salesforceLogoutCommunity,
	salesforceRegistroIBZero,
	salesforceRegistroIBPlus,
} = retrieveGlobalVariables();

//ibplusLogin();
onBusinessLogin();
headerNavigation();

// Stopover searcher load
if ($('[data-stopover-react]').length > 0) {
    const stopoverReact = $('[data-stopover-react]').attr('data-stopover-react').trim();
    $('body').append(`<script defer src="${stopoverReact}/stopover/customer--customer-experience--stopover--frontend.umd.js" type="text/javascript"></script>`);
}
// Digital menu load
if ($('[data-digital-menu-react]').length > 0) {
    const digitalMenu = $('[data-digital-menu-react]').attr('data-digital-menu-react').trim();
    $('body').append(`<script defer src="${digitalMenu}/customer--customer-experience--digital-menu--frontend/customer--customer-experience--digital-menu--frontend.es.js" type="text/javascript"></script>`);
}

$(document).ready(() => {
    // Escuchar el clic sobre los enlaces de Iberia Cards
    $(document).on('click', '[data-id-ibcard]', function(e) {
        e.preventDefault(); // Evitamos la navegación directa antes de tener la URL de Nemuru
        
        var elementAct = $(this);
        var idEnlace = elementAct.data('id-ibcard');
        var targetAttr = elementAct.attr('target');

        if (!idEnlace || idEnlace.toString().trim() === '') {
            return;
        }

        idEnlace = idEnlace.toString().trim();

        // Llamada a Nemuru SOLO cuando el usuario pulsa el botón
        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            cache: false,
            data: {
                pagename: 'IB_SE/APIGatewayIberiaCards',
                idlinkIbCard: idEnlace
            },
            success: function(data) {
                if (data && data.trim() !== '') {
                    var urlLimpia = data.trim();
                    
                    // Redirigimos al usuario a la URL que nos devuelve Nemuru
                    if (targetAttr === '_blank') {
                        window.open(urlLimpia, '_blank');
                    } else {
                        window.location.href = urlLimpia;
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error("Error al recuperar el enlace iberiacard", error);
            }
        });
    });
	if ($('[data-chart="advanced"]').length > 0) {
		$(".ibe-chart__prices-container .ibe-chart__radios").removeClass("hidden");
		$(".ibe-chart__prices-container .ibe-chart__buttons").removeClass("hidden");

		$(".ibe_form__radio-input[name=flight-type]").on("change", function(){
			$(".ibe-chart__prices-container").attr("data-trip-type", $(this).val());
			if($(this).val() == "return"){
				$("#chartPricesReturn").removeClass("hidden");
			} else if($(this).val() == "oneway") {
				$("#chartPricesReturn").addClass("hidden");
				$(".ibe-chart__prices-container").removeAttr("data-end-date");
				$(".ibe-chart__prices-container").removeAttr("data-end-price");
				$(".ibe-chart__prices-container").removeAttr("data-end-index");				
				dFrontJs.ibe_chart.paintBarsClick(dFrontJs.ibe_chart.myChartPrices["chartPrices"]);
				dFrontJs.ibe_chart.paintBarsClick(dFrontJs.ibe_chart.myChartPrices["chartPricesReturn"]);
			}
		});

		let exampleChart = {
			list: [
				{"returnDate" : "2021-04-26","price" : "50"},
				{"returnDate" : "2021-04-27","price" : "60"},
				{"returnDate" : "2021-04-28","price" : "90"},
				{"returnDate" : "2021-04-29","price" : "120"},
				{"returnDate" : "2021-04-30","price" : "170"},
				{"returnDate" : "2021-05-01","price" : "230"},
				{"returnDate" : "2021-05-02","price" : "260"},
				{"returnDate" : "2021-05-03","price" : "260"},
				{"returnDate" : "2021-05-04","price" : "210"},
				{"returnDate" : "2021-05-05","price" : "150"},
				{"returnDate" : "2021-05-06","price" : "90"},
				{"returnDate" : "2021-05-07","price" : "60"},
				{"returnDate" : "2021-05-08","price" : "50"},
				{"returnDate" : "2021-05-09","price" : "60"},
				{"returnDate" : "2021-05-10","price" : "90"},
				{"returnDate" : "2021-05-11","price" : "120"},
				{"returnDate" : "2021-05-12","price" : "170"},
				{"returnDate" : "2021-05-13","price" : "230"},
				{"returnDate" : "2021-05-14","price" : "260"},
				{"returnDate" : "2021-05-15","price" : "260"},
				{"returnDate" : "2021-05-16","price" : "210"},
				{"returnDate" : "2021-05-17","price" : "150"},
				{"returnDate" : "2021-05-18","price" : "90"},
				{"returnDate" : "2021-05-19","price" : "60"},
				{"returnDate" : "2021-05-20","price" : "210"},
				{"returnDate" : "2021-05-21","price" : "150"},
				{"returnDate" : "2021-05-22","price" : "90"},
				{"returnDate" : "2021-05-23","price" : "60"}
			]
		};
		
	}
	  
	// Verifica si existe el contenedor de tabs con data-tab="bootstrap-tabdrop"
	const tabContainer = document.querySelector('[data-tab="bootstrap-tabdrop"]');
	if (tabContainer) {
		let rawHash = window.location.hash;
		// quitamos el # inicial
		let cleanHash = rawHash.substring(1);
		// cortar en & o ? si existen
		cleanHash = cleanHash.split('&')[0].split('?')[0];
		// volver a añadir #	
		const hash = cleanHash ? '#' + cleanHash : '';
		if (hash) {
			const tabLink = tabContainer.querySelector('a[href="' + hash + '"]');
	
			if (tabLink) {
				 // Quita 'active' de todos los items del menu dentro del contenedor
				 tabContainer.querySelectorAll('.ibe-tab__menu-item').forEach(el => {
					el.classList.remove('active');
				});
				// Quita 'active' de todos los contenedores de contenido que usen la clase ibe-tab__container
				document.querySelectorAll('.ibe-tab__container').forEach(el => {
					el.classList.remove('active');
				});
				// También quita 'active' de cualquier pane interno si existiera
				document.querySelectorAll('.ibe-tab__container .active, .tab-pane.active').forEach(el => {
					el.classList.remove('active');
				});
				// Marca el menu item como activo
				tabLink.parentElement.classList.add('active');
				const contentId = hash.replace('#', '');
				const contentEl = document.getElementById(contentId);
			
				if (contentEl) {
					contentEl.classList.add('active');
					// Si el pane está dentro de un contenedor ibe-tab__container, añádelo también
					const parentContainer = contentEl.closest('.ibe-tab__container');
					if (parentContainer) parentContainer.classList.add('active');
				}
				//Finalmente intenta usar el método de Bootstrap si está disponible 
				try {
					if (window.jQuery && typeof jQuery(tabLink).tab === 'function') {
						jQuery(tabLink).tab('show');
					}
				} catch (e) {
					// Si no está bootstrap, ya hemos actualizado las clases manualmente
				}
			}
		}
	}
	
	/*
	 * Left menu logic to display current branch
	 * For first level, we show the child branch and for second level we show the parent element
	 */
	$(".leftmenuchild-active").each(function ech() {
		$(this).parent().removeClass("hidden");
	});
	$(".leftmenuparent-active ul").each(function ech() {
		$(this).removeClass("hidden");
	});

	$(".ibe-form__checkbox-label").click(() => {
		if ($(".ibe-form__checkbox-input").is(":checked")) {
			$(".buttoncheckgo").hide();
			$(".buttoncheckngo").show();
		} else {
			$(".buttoncheckngo").hide();
			$(".buttoncheckgo").show();
		}
	});

	// Seeker forms
	$("#hotelSearch").unbind("click");
	$("#carSearch").unbind("click");

	// var i = $('[id$=li].ui-state-active').children().attr('data-active') + 1;
	// var assetid = $('body').attr('data-contentid');
	// var assettype = $('body').attr('data-contenttype');

	// END seeker forms
	dFrontJs.modalFunction.init();
	if ($('[data-control="check"]').length) dFrontJs.ibe_check.init();
	$('a[href="#"]').on("click", (e) => {
		e.preventDefault();
	});

	//stopover
	addClassesLocale();
});
//verifica y hace el salto contenido principal de las paginas
document.addEventListener('DOMContentLoaded', function () {
	var skipLink = document.querySelector('.skip-link');
	var targetId = 'contenido-principal';
	var target = document.getElementById(targetId);
  
	if (skipLink && target) {
	  skipLink.addEventListener('click', function (e) {
		// Evita que routers / handlers globales naveguen
		e.preventDefault();
		e.stopPropagation();
  
		// Asegura que puede recibir foco
		if (!target.hasAttribute('tabindex')) {
		  target.setAttribute('tabindex', '-1');
		}
  
		// Mueve el foco accesible
		target.focus({ preventScroll: false });
  
		// Opcional: fuerza scroll por si algún sticky header molesta
		target.scrollIntoView({ behavior: 'auto', block: 'start' });
	  });
	}
  });
// OnLoad
$(window).on("load", () => {
	// Searcher Vintage
	if ($(".ibe-searcher__vintage").length > 0) {
		dFrontJs.ibe_modals_vintage.init();
	}
	
	// Update datalayer to monetate
	// updateDatalayer("view");
	// Que no se envie el push si son esas dos aplicaciones angular
	if(quadrigam !== 'FLASHO' && quadrigam !== 'IBRECA') pushToMonetate();
	if ($('.inte-hasAngularApp').length === 0) updateDigitalData('view');
	
	getModals();
});

function _clickCheckInOnline() {
	if(document.getElementById("home-CKI-Content-pop").style.display == "block"){
		document.getElementById("home-CKI-Content-pop").style.display="none";
		document.getElementById("home-CKI-Content-pop").ariaHidden = "true";
	}else{
		$('html, body').animate({
			scrollTop: $("#home-CKI-processLink").offset().top
		},
		500);
		$('.ibe-overlay').show();
		$("#home-CKI-Content-pop").show();
		document.getElementById("home-CKI-Content-pop").ariaHidden = "false";
		document.getElementById("home-CKI-processLink").style.zIndex = "1002";
	}
};

function getModals() {
	
	//Modal CheckIn Online
	if ( $('#home-CKI-Content').html()!=undefined && !$('#home-CKI-Content').html().length > 0) {
		$.ajax({
			method: 'GET',
			url: '/cs/Satellite',
			data: {
				pagename: 'IB_SE/GetCheckInModal',
				cid: $('#home-CKI-processLink').data('idcontent'),
				c: $('#home-CKI-processLink').data('typecontent'),
				tid:$('#home-CKI-processLink').data('tid'),
				idpagecki: $('#home-CKI-processLink').data('idpagecki'),
				market: $('#mercado').val(),
				locale: $('#idioma').val(),
				d: '',
			},
			success(data) {
				$('#home-CKI-Content').html(data);

				if ($("#home-CKI").length > 0) {
					window.homeCKILogin = function (event) {
						let surname, code, parent, url;
						parent = $(event.target).closest("form");
						event.preventDefault();
						if (dFrontJs.ibe_validate.validateForm("[data-ckiHomeForm]:visible")) {
							surname = $.trim(parent.find("#surname-CKI").val());
							code = $.trim(parent.find("#pnr-CKI").val());
							url = parent.attr("action");
							window.location.href = url + "?" + $.param({ surname, pnr: code });
						}
					};
				}

				dFrontJs.ibe_inputs.init();
				dFrontJs.ibe_validate.init();
				dFrontJs.modalFunction.init();
				dFrontJs.ibe_modal.init();
				
				if ($('#home-CKI-processLink').length) {
					$('#home-CKI-processLink').off('click', _clickCheckInOnline);
					$('#home-CKI-processLink').on('click', _clickCheckInOnline);
				}
			}
		});
	}
};
// Header-New - Underline navigation menu
function redirectPRE() {
	const $servicesHost = $("[data-inte-integrationHost]");
	const locationHostname = window.location.hostname;
	if (locationHostname.indexOf($servicesHost.attr("data-check-PRE")) > -1) {
		$servicesHost.attr(
			"data-inte-integrationHost",
			`${window.location.protocol}//${locationHostname}`
		);
	}
}
$(document).on("redirectPre", redirectPRE);
// LogOut IBPlus. When success it reload the current page.
$(".logOut-action").click((e) => {
	e.preventDefault();
	$.ajax({
		method: "GET",
		url: "/cs/Satellite",
		data: {
			pagename: "IB_SE/CacheControl0s/Integration/logOut",
		},
		success() {
			// OB Compatibility IBPLUS
			if (
				$("#loggedUserDefaults").attr("data-inte-integrationHost") !==
					"null" &&
				$("#loggedUserDefaults").attr("data-inte-ibplusLogoutURL") !=
					"null"
			) {
				logoutIBPlusService().always(() => {
					//window.location.reload();
					// SalesForce community LogOUT
					const url = `${salesforceLogoutCommunity}`;
					window.location.href=url+'?retUrl='+window.location.href;
				});
			} else {
				const deleteCokie = (name) => {
					document.cookie = `${name}=; expires=Thu, 18 Dec 1990 12:00:00 UTC; path=/`;
				};

				deleteCokie("IBERIACOM_IDENTIFICATION");
				deleteCokie("IBERIACOM_SSO_ACCESS");
				deleteCokie("IBERIACOM_SSO_ACCESS_TO");
				deleteCokie("IBERIACOM_SSO_REFRESH");
				deleteCokie("IBERIACOM_SSO_REFRESH_TO");
				SessionStorage.remove("accessToken");
				SessionStorage.remove("customerData");
				SessionStorage.remove("ib-check-in-app.customerData");
				SessionStorage.remove("ib-check-in-app.loggedInfo");
				SessionStorage.remove("ib-check-in-app.userLoggedBookingInfo");
				SessionStorage.remove("ib-MmB-app.bookingsList");
				SessionStorage.remove("ib-MmB-app.customerData");
				SessionStorage.remove("ib-booking-app.customerData");
				window.location.reload();
			}
		},
	});
});
/*
 * Change locale/market module logic
 */
function changeLocaleMarket(locale, market) {
	// Get attributes to recover URL
	const assetid = $("body").attr("data-contentid");
	const assettype = $("body").attr("data-contenttype");
	// Recover URL and redirect
	if (market && locale) {
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename: "IB_SE/Logic/Navigation/GetURLJSON",
				c: assettype,
				cid: assetid,
				market,
				locale,
				d: "",
			},
			success(data) {
				let urlExp = data.url;
				if (quadrigam === "IBLOIN") {
					urlExp += window.location.search;
				}
				if (urlExp.indexOf(" ") > -1) {
					urlExp = urlExp.replace(" ", "+");
				}
				let finalLocale = localeg;

				// Si localemasterg tiene valor, lo usamos
				if (localemasterg && localemasterg !== "") {
					finalLocale = localemasterg;
				}
				const valueCookie = `${market}|${market}|${finalLocale}| | |${market}|`;
				// update cookie with new values
				const date = new Date();
				const exDate = date.setTime(date.getTime() + 3650);
				Cookies.set("IBERIACOM_PERSONALIZATION", valueCookie, {
					path: "/",
					expires: exDate,
					sameSite: "strict",
				});
        const includeHash = isPrivateAreaApp();
        const hash = includeHash ? window.location.hash : '';
				window.location = urlExp + hash;
			},
		});
	}
}
/*
 * redirect customLink by ID
 */
function redirectLinkByID(locale, market, assetid) {
    // Recover URL and redirect
    if (market && locale) {
        $.ajax({
            method: 'GET',
            url: '/cs/Satellite',
            data: {
                pagename: 'IB_SE/Logic/Navigation/GetURLJSON',
                cid: assetid,
                redirectbyClass: 'true',
                market,
                locale,
                d: '',
            },
            success(data) {
                let urlExp = data.url;
                if (urlExp.indexOf(' ') > -1) {
                    urlExp = urlExp.replace(' ', '+');
                }
                window.location = urlExp;
            },
        });
    }
}
$('.redirectById').click(() => {
    const locale = $('#idioma').val();
    const market = $('#mercado').val();
    const idlink = $('.redirectById').data('idlink');
    redirectLinkByID(locale, market, idlink);
});

// Change locale and market form
$("#localeMarketForm").submit((e) => {
	e.preventDefault();
	const locale = $("#idioma").val();
	const market = $("#mercado").val();
	changeLocaleMarket(locale, market);
});
// Change locale and market mobile form
$(".localeMarketFormMobile").click(() => {
	$("#localeMarketFormMobile").submit((e) => {
		e.preventDefault();
		const localeMobile = $("#idiomaMobile").val();
		const mercadoMobile = $("#mercadoMobile").val();
		changeLocaleMarket(localeMobile, mercadoMobile);
	});
});

/*
 * Change Available Dimensions module logic
 */
$("#mercado,#mercadoMobile").change(function chg() {
	// Get attributes to recover URL
	const locale = $(this).parent().parent().find('select[id^="idiom"]').val();
	const market = $(this).val();
	const assetid = $("body").attr("data-contentid");
	const assettype = $("body").attr("data-contenttype");

	if (market !== "") {
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename:
					"IB_SE/CacheControl1y/BrowserCache3600/GetLocalesForMarketsAjax",
				c: assettype,
				cid: assetid,
				market,
				locale,
				d: "",
			},
			success(data) {
				$("#idioma,#idiomaMobile").empty();
				const idiom = $.parseJSON(data);
				$("#idioma~div,#idiomaMobile~div")
					.find("input")
					.val(idiom[0].text);
				for (const x in idiom) {
					$("#idioma,#idiomaMobile").append(
						`<option value=${idiom[x].value}>${idiom[x].text}</option>`
					);
				}
			},
		});
	}
});

/*
 * Cookie alert message logic
 */
// Show cookie logic
if (!Cookies.get("IBERIACOM_COOKIES_ALERT")) {
	Cookies.set("IBERIACOM_COOKIES_ALERT", "shown", {
		path: "/",
		sameSite: "strict",
	});
	$("#cookieAlert").removeClass("hide");
}
// Accept cookie button logic
$("#acceptCookie").click((e) => {
	e.preventDefault();
	$("#cookieAlert").addClass("hide");
	Cookies.set("IBERIACOM_COOKIES_ALERT", "read", {
		path: "/",
		expires: 20000,
		sameSite: "strict",
	});
});

// Update cookie with new values
function updateCookie() {
	let finalLocale = localeg;

	// Si localemasterg tiene valor, lo usamos
	if (localemasterg && localemasterg !== "") {
		finalLocale = localemasterg;
	}
	const valueCookie = `${marketg}|${marketg}|${finalLocale}| | |${marketg}|`;
	const date = new Date();
	const exDate = date.setTime(date.getTime() + 3650);
		Cookies.set("IBERIACOM_PERSONALIZATION", valueCookie, {
		path: "/",
		expires: exDate,
		sameSite: "strict",
	});
}

window.getSubtypes = (parentForm) => {
	if ($(`${parentForm} .inte-subTypeList`).attr("data-subtypes")) {
		const datStr = $(`${parentForm} .inte-subTypeList`).attr(
			"data-subtypes"
		);
		return JSON.parse(datStr);
	}
	return "";
};

function initSocialNetworksShare() {
	const currentPath = encodeURIComponent(
		`${window.location.protocol}//${window.location.host}/${window.location.pathname}`
	);
	const currentTitle = encodeURIComponent(document.title);
	const subGoogle = `https://plus.google.com/share?url=${currentPath}`;
	const subTwitter = `http://twitter.com/home?status= ${currentTitle}&#45;${currentPath}`;
	const subLinkedin = `http://www.linkedin.com/shareArticle?mini=true&url=${currentPath}&title=${currentTitle}`;
	const subFacebook = `http://www.facebook.com/sharer.php?u=${currentPath}&t=${currentTitle}`;
	const subWeibo = `http://service.weibo.com/share/share.php?url=${currentPath}&title=${currentTitle}`;

	initSocialNetworksShare.onclickFacebook = () => {
		window.open(subFacebook, "popup", "width=600,height=300");
	};
	initSocialNetworksShare.onclickGoogle = () => {
		window.open(subGoogle, "popup", "width=600,height=300");
	};
	initSocialNetworksShare.onclickTwitter = () => {
		window.open(subTwitter, "popup", "width=600,height=300");
	};
	initSocialNetworksShare.onclickLinkedIn = () => {
		window.open(subLinkedin, "popup", "width=600,height=300");
	};
	initSocialNetworksShare.onclickWeiboo = () => {
		window.open(subWeibo, "popup", "width=600,height=300");
	};
	function bind() {
		// Facebook
		$(".facebook").each(function ech() {
			$(this)
				.off("click", initSocialNetworksShare.onclickFacebook)
				.on("click", initSocialNetworksShare.onclickFacebook);
		});
		// Twitter
		$(".twitter").each(function ech() {
			$(this)
				.off("click", initSocialNetworksShare.onclickTwitter)
				.on("click", initSocialNetworksShare.onclickTwitter);
		});
		// Google
		$(".google").each(function ech() {
			$(this)
				.off("click", initSocialNetworksShare.onclickGoogle)
				.on("click", initSocialNetworksShare.onclickGoogle);
		});
		// linkedin
		$(".linkedin").each(function ech() {
			$(this)
				.off("click", initSocialNetworksShare.onclickLinkedIn)
				.on("click", initSocialNetworksShare.onclickLinkedIn);
		});
		// weibo
		$(".weibo").each(function ech() {
			$(this)
				.off("click", initSocialNetworksShare.onclickWeiboo)
				.on("click", initSocialNetworksShare.onclickWeiboo);
		});
	}
	bind();

	return { bind };
}
initSocialNetworksShare();
/*
 * Validate all form with class validation-form
 */
dFrontJs.validationForm = (function () {
	const init = () => {
		$(".validation-form").each(function ech() {
			$(this).validate({
				debug: false,
				errorElement: "p",
				errorClass: "ibe-form__validate--error",
				errorPlacement(error, element) {
					if (element.attr("type") === "checkbox") {
						error.appendTo(element.parent());
					} else {
						error.insertAfter(element);
					}
				},
				highlight(element) {
					$(element.form)
						.find("input[type!='checkbox']")
						.parent()
						.addClass("ibe_form__group--error");
					$(element.form)
						.find("input[type='checkbox']")
						.parent()
						.addClass("ibe-form__checkbox--error");
					$(element.form)
						.find(`p[id=${element.id}-error]`)
						.addClass("ibe_form__msg-info");
					// newsletters secondSurname
					$(element.form)
						.find("input[id='secondSurnameInputColor']")
						.parent()
						.removeClass("ibe_form__group--error");
				},
				unhighlight(element) {
					$(element.form)
						.find("input[type!='checkbox']")
						.parent()
						.removeClass("ibe_form__group--error");
					$(element.form)
						.find(`p[id=${element.id}-error]`)
						.removeClass("ibe_form__msg-info");
				},
			});
		});
	}; // validationForm
	return {
		init,
	};
})(jQuery);

function radioButtonsFilter(dataId, radioButtons) {
	let match = true;
	if (radioButtons.length > 0) {
		match = false;
		radioButtons.each(function ech() {
			if (dataId.indexOf($(this).attr("data-info")) > -1) {
				match = true;
				return false;
			}
			return true;
		});
	}
	return match;
}
function checkboxFilter(dataId, checkboxes) {
	let match = false;
	checkboxes.each(function ech() {
		if (dataId.indexOf($(this).attr("data-info")) > -1) {
			match = true;
			return false;
		}
		return true;
	});
	return match;
}

function filterAction(trigger) {
	let elBlock;
	let dataId;
	let activeCheckbox;
	const fBlock = trigger.closest("[data-function^='filter-']");
	const infoMove = fBlock.find("[data-filterelementparent]");
	if (infoMove.length > 0) {
		infoMove.each(function ech() {
			const element =
				$(this).find("[data-filtertags]:first").length > 0
					? $(this).find("[data-filtertags]:first")
					: $(this).find("[data-id]:first");
			const data = element.data("filtertags") || element.data("id");
			element.removeAttr("data-id").removeAttr("data-filtertags");
			$(this)
				.attr("data-filtertags", data)
				.removeAttr("data-filterelementparent");
		});
	}
	elBlock = fBlock.find("[data-filtertags]");
	if (elBlock.length === 0) {
		elBlock = fBlock.find("[data-id]");
	}
	const radioButtons = fBlock.find(":radio[data-info]:checked");
	const checkboxes = fBlock.find(":checkbox[data-info]:checked");
	activeCheckbox = fBlock.find("a[data-activeCheckbox]");

	if (trigger.attr("data-info") === "avoidCheckbox") {
		trigger.attr("data-activeCheckbox", "false");
		activeCheckbox = trigger;
	} else if (trigger.attr("data-info") === "activeCheckbox") {
		activeCheckbox.attr("data-activeCheckbox", "true");
	}

	elBlock.each(function elb() {
		dataId = $(this).data("filtertags") || $(this).attr("data-id");
		if(dataId === undefined){
			$(this).hide();
		}else{
			if (activeCheckbox.attr("data-activeCheckbox") === "false") {
				if (radioButtonsFilter(dataId, radioButtons)) {
					$(this).show();
				} else {
					$(this).hide();
				}
			} else if (
				radioButtonsFilter(dataId, radioButtons) &&
				checkboxFilter(dataId, checkboxes)
			) {
				$(this).show();
			} else {
				$(this).hide();
			}
		}
	});
}

function initFilterTabs(inputFilter) {
	filterAction($(`[data-function='filter-${inputFilter}']`));
}

window.initFilterTabs = initFilterTabs;
function filterTriggerTabs(inputFilter) {
	$(`[data-function='filter-${inputFilter}']`)
		.find(":input[data-info], a[data-info]")
		.each(function ech() {
			$(this).click(function clk() {
				filterAction($(this));
			});
		});
}
window.filterTriggerTabs = filterTriggerTabs;

/* function insertLoadingFull(){
    var $body = $('body');
    if($body.find('.inte-loadingFull').length==0){
      $body.prepend(
          '<div data-loading-full="" class="ibe-loading__overlay ibe-loading__overlay--full inte-loadingFull">'
          +'<div class="ibe-loading__spinner">'
           + '<div class="ibe-loading__icon">'
            +  '<div class="circle"></div><div class="circle"></div>'
            +'</div>'
            +'<div class="ibe-loading__text"></div>'
          +'</div>'
        +'</div>');
    }
} */

//function add classes when locale is "ja"
function addClassesLocale(){
    if(localeg === "ja"){
        $('.ibe-flights-plus-hotel__stopover').each(function(index,item){
            $(item).addClass("ibe-card-link--stopover-sp-market-c"+String(index+1))
         });
    }
}
function setInheritedParamsLinks() {
	const links = $("a.inte-inheritedurlparams");
	const urlparams = window.location.search;
	let newQry = "?";
	let qryObj;
	let self;
	if (links.length > 0) {
		if (quadrigam === "BAGOBO") {
			qryObj = getQuerystrParams();
			$.each(qryObj, (k, v) => {
				if (k !== "field1" && k !== "field2") {
					newQry += `${k}=${v}&`;
				}
			});
			newQry = newQry.slice(0, newQry.length - 1);
			window.history.replaceState(
				null,
				null,
				window.location.pathname + newQry
			);
		}
		links.each(function lnk() {
			self = $(this);
			self.attr("href", self.attr("href") + urlparams);
		});
	}
}

// Function initialization
redirectPRE();
dologin.init();
// Update cookie with new values each page load.
if (quadrigam !== "OBLOGINSSO") {
	updateCookie();
}
// Hide Register and Access link from header new for ONBUSI
if (quadrigam === "ONBUSI") {
	$("#publicUser").remove();
}
// Logic for links with context inherited URL params
setInheritedParamsLinks();
// Office Page - load each office in each country.
if ($(".inte-modal-office"))
dFrontJs.ibe_modal.createModal(".inte-modal-office");
// Load booking searchers

if (quadrigam === "ENTRLH" && $("[data-function^='filter-']").length > 0) {
	initFilterTabs("tab-1");
	filterTriggerTabs("tab-1");
}

// Add quadrigam with hash when it has angular content in iberia-plus
if (
	(quadrigam === "IBDAPE" ||
		quadrigam === "IBSUBS" ||
		quadrigam === "PLUREG" ||
		quadrigam === "IBOLPS" ||
		quadrigam === "IBCAPS" ||
		quadrigam === "IBMITA" ||
		quadrigam === "IBMBEN" ||
		quadrigam === "IBMIBP" ||
		quadrigam === "CIPIBMIST" ||
		quadrigam === "IBPINV" ||
		quadrigam === "IBSPT1" ||
		quadrigam === "IRDAUS") &&
	document.location.hash.length === 0
) {
	const { pathname } = document.location;
	const params = document.location.search;
	const pagetlt = document.title;
	window.history.replaceState(
		params,
		pagetlt,
		`${pathname + params}#!/${quadrigam}`
	);
}

if (quadrigam === "IBMIBP") {
	const removePartersReco = () => {
		const { hash } = window.location;
		if (hash.indexOf("IBMITA") >= 0) {
			$(".ibe-infocheckin .container:has(.ibe-card-box)").removeClass(
				"hidden"
			);
		} else {
			$(".ibe-infocheckin .container:has(.ibe-card-box)").addClass(
				"hidden"
			);
		}
	};
	removePartersReco();
	window.addEventListener("hashchange", () => {
		removePartersReco();
	});
}
/*
 * Social networks sharing logic
 */
$(".ibe-infocheckin__menu-item--icon-share")
	.find(".link")
	.click(function clk() {
		$(this).parent().toggleClass("xui-icon-share-active");
		window.requestAnimFrame(() => {
			initSocialNetworksShare().bind();
		});
	});
$(".ibe-infocheckin__menu-item--icon-share").focusout(() => {
	setTimeout(() => {
		$(".ibe-infocheckin__menu-scroll").scrollTop(0);
	}, 10);
});

// Load offices info when selector changes
$(".inte-select-spain , .inte-select-countries").on(
	"selectmenuchange",
	function slc() {
		const $selectClass =
			$(this).hasClass("inte-select-spain") === true
				? $(".inte-select-countries")
				: $(".inte-select-spain");
		$selectClass.val("");
		$selectClass.selectmenu("refresh");
		$selectClass
			.siblings("label")
			.removeClass("ibe_form__selectize--label02");
		$selectClass.siblings("p").addClass("hidden");
		$selectClass.closest("div").removeClass("ibe_form__group--error");
		$selectClass.attr("required", false);
		$(this).attr("required", true);
		// modulo resultados página vuelos
		if ($selectClass.attr("data-searchoffices") === "search") {
			const city = $(".inte-select-spain option:selected").val()
				? $(".inte-select-spain option:selected").val()
				: undefined;
			const country = $(".inte-select-countries option:selected").val()
				? $(".inte-select-countries option:selected").val()
				: undefined;
			const vParams = getVisitorData();
			loadOfficeResults(city, country, vParams);
		}
	}
);

//STOPOVER HOME
if (quadrigam === "HMADVS" && $(".ibe-stopover .ibe-banner-stopover").length > 0) {
	datalayer_general.quadrigam = "HMADVS";
	datalayer_general.proceso = 'hola madrid';
	datalayer_general.paso = 'inicio';
	updateDatalayer('view');
	digital_data.Quadrigam = 'HMADVS';
	digital_data.Step = 'inicio';
	digital_data.Process ='hola madrid';
	updateDigitalData('view');
}
//PLAN AHORRO HOME
if (quadrigam === "PLHOME") {
	datalayer_general.quadrigam = "PLHOME";
	datalayer_general.proceso = 'plan ahorro';
	datalayer_general.paso = 'inicio';
	//updateDatalayer('view');
	digital_data.Quadrigam = 'PLHOME';
	digital_data.Step = 'inicio';
	digital_data.Process ='plan ahorro';
	//updateDigitalData('view');
}
//TARJETA REGALO HOME
if (quadrigam === "REGALO") {
	datalayer_general.quadrigam = "REGALO";
	datalayer_general.proceso = 'tarjeta regalo';
	datalayer_general.paso = 'inicio';
	updateDatalayer('view');
	digital_data.Quadrigam = 'REGALO';
	digital_data.Step = 'inicio';
	digital_data.Process ='tarjeta regalo';
	updateDigitalData('view');
}	   
// Remove stopover steps modulo when stopover booking exists
if ((quadrigam === 'HMADVS' || quadrigam === 'HMEXPS') && Cookies.get('HOLA_MADRID') === 'true' && $('div.ibe-static-banner.ibe-static-banner--m-t > div').length > 0){
    $('div.ibe-static-banner.ibe-static-banner--m-t > div').css('display', 'none');
}

//$('#publicUser a.icon-perfil_login').attr('href', `/integration/ibplus/login/?referralURL=${encodeURIComponent(window.location.href)}&noState=true`);
//Init login Iframe
LoginIframeInit();

// Load WineClub Landing functionality
if (quadrigam === "BOWINE") {
	loadjsfile(`independent/ibe_wineclubLanding.js${staticsVersion}`);
}
// Load Bob Landing functionality
if (quadrigam === "BAGONB") {
	loadjsfile(`independent/ibe_bobLanding.js${staticsVersion}`);
}
// Load connections other airports functionality
if (quadrigam === "TRANSIOTH") {
	loadjsfile(`independent/ibe_connections_others.js${staticsVersion}`);
}
// Load connections madrid functionality
if (quadrigam === "TRANSI") {
	loadjsfile(`independent/ibe_connections_madrid.js${staticsVersion}`);
}
// Show restored password confirmation
if (
	quadrigam === "IBLOIN" &&
	$("[data-restored-password]").length > 0 &&
	getQuerystrParams().restoredPassword !== undefined
) {
	$("[data-restored-password]").removeClass("hidden");
}

if (datalayer_general.quadrigam === "IBSPT1") {
	$("a[href$='#tabi2']")
		.parent()
		.click(() => {
			if (datalayer_general.quadrigam !== "IBSPT2") {
				datalayer_general.quadrigam = "IBSPT2";
				datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/IBSPT2`;
				updateDatalayer('view');
			}
			if (digital_data.Quadrigam !== "IBSPT2") {
				digital_data.Quadrigam = 'IBSPT2';
				digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/IBSPT2`;
				updateDigitalData('view');
			}
			
		});
		$("a[href$='#tabi1']")
		.parent()
		.click(() => {
			if (datalayer_general.quadrigam !== "IBSPT1") {
				datalayer_general.quadrigam = "IBSPT1";
				datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/IBSPT1`;
				updateDatalayer('view');
			}
			if (digital_data.Quadrigam !== "IBSPT1") {
				digital_data.Quadrigam = 'IBSPT1';
				digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/IBSPT1`;
				updateDigitalData('view');
			}
		});
}
$("[data-functionalcode~=redirectToSection]").on(
	"click",
	function eventHandler(event) {
		event.preventDefault();
		const href = $(this).attr("href");
		const section = $(this).attr("data-functionalcode").split(" ")[1];
		window.location = href + section;
	}
);

// launch lazy modules
if ($(".ent-tab").length > 0) {
	loadjsfile(`independent/ibe_entertaiment.js${staticsVersion}`);
}
if ($("#button-news").length > 0) {
	loadjsfile(`independent/ibe_news.js${staticsVersion}`);
}
if ($(".inte-buttonOffi").length > 0) {
	loadjsfile(`independent/ibe_offices.js${staticsVersion}`);
}
if (
	$(
		"#counterpartners, .inte-partner-box, #button-partners, .inte-typesubtypeForm"
	).length > 0
) {
	loadjsfile(`independent/ibe_partners.js${staticsVersion}`);
}
if ($("#inte-dataOriginDest,#inte-dataNumVuelo,#inte-dataAirport").length > 0) {
	loadjsfile(`independent/ibe_flight-status.js${staticsVersion}`);
}
if ($(".ibe-emergency").length) {
	loadjsfile(`independent/ibe_emergency.js${staticsVersion}`);
}
// Load mosaic OFDTs
if ($(".inte-tabOFDTContainer").length > 0) {
	loadjsfile(`independent/ibe_ofdt.js${staticsVersion}`);
}
if ($("[data-list-cities]").length > 0) {
	loadjsfile(`independent/ibe_searcher-complete.js${staticsVersion}`);
}
if ($("[data-faq-module]").length > 0) {
	loadjsfile(`independent/ibe_helpcenter.js${staticsVersion}`);
}
if (
	quadrigam === "IBPLES" &&
	$("a[data-functionalcode=ibplustore]").length > 0
) {
	loadjsfile(`independent/ibe_ibplustore.js${staticsVersion}`);
}
// Load logic Hotels and Cars page
if (quadrigam === "AVIMON" && $("#checkSubmit").length > 0) {
	loadjsfile(`independent/ibe_hotels-cars.js${staticsVersion}`);
}
if (quadrigam === "IBPLES" && $("[data-functionalcode=eStore]").length > 0) {
	loadjsfile(`independent/ibe_eStore.js${staticsVersion}`);
}

// if (quadrigam === "IBBTPT") {
// 	loadjsfile(`independent/ibe_buy-gift-transfer.js${staticsVersion}`);
// }

if (quadrigam === "IBLBTT") {
	loadjsfile(`independent/ibe_combine-avios.js${staticsVersion}`);
}
if (quadrigam === "HMCLAIMS") {
	loadjsfile("claims/ibe_claims_documents.js".concat(staticsVersion));
}
if (quadrigam === "HMCANCEL") {
	loadjsfile("claims/ibe_claims_disruptions.js".concat(staticsVersion));
}
if (quadrigam === "IBGDPR" || quadrigam === "IBJUST") {
	loadjsfile("claims/ibe_claims_landings.js".concat(staticsVersion));
}
if (quadrigam === 'INCEQU') {
	loadjsfile("claims/ibe_claims_luggage.js".concat(staticsVersion));
}
if (quadrigam === 'IBREOS') {
	loadjsfile("claims/ibe_claims_incidents.js".concat(staticsVersion));
}
if ($("body[data-landing-template=T1-Landing]").length > 0) {
	loadjsfile(`landings/ibe_CFLanding_T1.js${staticsVersion}`);
}
if (
	$("body[data-landing-template=Tg-Area-Landing]").length > 0 ||
	$("body[data-landing-template=Tg-Country-Landing]").length > 0 ||
	$("body[data-landing-template=Tg-Region-Landing]").length > 0 ||
	$("body[data-landing-template=T2-Destination]").length > 0 ||
	$("body[data-landing-template=T2-Origin]").length > 0 ||
	$("body[data-landing-template=T3-Landing]").length > 0
) {
	loadjsfile(`landings/ibe_CFLanding_Tg_T2_T3.js${staticsVersion}`);
}
if (
	$("body[data-landing-template=T1-Meses]").length > 0 ||
	$("body[data-landing-template=T1-Temporadas]").length > 0 ||
	$("body[data-landing-template=Tg-Mes]").length > 0 ||
	$("body[data-landing-template=Tg-TempFest]").length > 0
) {
	loadjsfile(`landings/ibe_CFLanding_T1Tg_MonthsSeasons.js${staticsVersion}`);
}
if ($("[data-universia]").length > 0) {
	loadjsfile(`universia/ibe_universia.js${staticsVersion}`);
}
if ($("[data-umnr-modal]").length > 0) {
	loadjsfile(`unmr/ibe_modal-unmr.js${staticsVersion}`);
}
if ($("[data-guideDetail]").length > 0) {
	loadjsfile(`destinationGuide/guideDetail.js${staticsVersion}`);
}

if ($("[data-destinationguidealldestinity]").length > 0) {
	loadjsfile(`destinationGuide/destinationGuide.js${staticsVersion}`);
}
if ($("[data-experienceGuide]").length > 0) {
	loadjsfile(`experienceGuide/guideExperience.js${staticsVersion}`);
}
if ($("[data-stopOver]").length > 0) {
	loadjsfile(`stopover/ibe_StopOverNew.js${staticsVersion}`);
}
if ($("[data-customguide]").length > 0) {
	loadjsfile(`destinationGuide/customGuide.js${staticsVersion}`);
}
if ($("[data-lateralSeeker]").length > 0) {
	loadjsfile(`destinationGuide/lateralSeeker.js${staticsVersion}`);
}
if ($("[data-simuladorAvios]").length > 0) {
  const simulador = $('[data-simuladorReact]').attr('data-simuladorReact').trim();
	loadjsfile(`simuladorAvios/ibe_simuladorAvios.js${staticsVersion}`);
  $('head').append(`<link rel="stylesheet" type="text/css" \
  href="${simulador}/app/customer--loyalty--avios-simulator--frontend.css" />`);
  $('body').append(`<script defer src="${simulador}/app/customer--loyalty--avios-simulator--frontend.umd.js" type="text/javascript"></script>`)
}

// Formulario Kids - Iberia Plus
if ($("[data-formKids]").length > 0) {
  const formKid = $('[data-formKids]').attr('data-formKids').trim(); 
  $('head').append(`<link rel="stylesheet" type="text/css" \
  href="${formKid}/app/customer--loyalty--form-kids--frontend.css" />`);
  $('head').append(`<script type="module" src="${formKid}/app/customer--loyalty--form-kids--frontend.es.js"></script>`);
}

if ($("[data-claimsReact]").length > 0) {
	const claimsForm = $('[data-claimsReact]').attr('data-claimsReact').trim();
	$('head').append(`<link rel="stylesheet" type="text/css" href="${claimsForm}/spa-form/assets/index.css" />`);
	$('body').append(`<script type="module" defer src="${claimsForm}/spa-form/assets/index.js" type="text/javascript"></script>`)
	const urlParams = new URLSearchParams(window.location.search);
	const caseNumber = urlParams.get('caseNumber');
	let claimTypology = urlParams.get('otherClaimTypology');
	let ancla = "";
	let subpathSuffix = "";
	let caseNumberVal = "";
	let claimTypologyVal = "";
	if(quadrigam == "IBTRACKING"){
		ancla = "TRACKING";
		//Oculto componentes en este form, ya que se mostrarán más adelante por parte de React
		$(".ibe-claims-tipo-container").addClass("hidden");
		$(".ibe-faq__acordion").addClass("hidden");
	} else if(quadrigam == "IBRETRASO"){
		ancla = "DELAYED_FLIGHT";
	} else if(quadrigam == "IBCONEXION"){
		ancla = "LOST_CONNECTION";
	} else if(quadrigam == "IBCANCEL"){
		ancla = "FLIGHT_CANCELLATION";
	} else if(quadrigam == "IBCAMB"){
		ancla = "SCHEDULE_CHANGE";
	} else if(quadrigam == "IBDENE"){
		ancla = "DENIED_BOARD";
	} else if(quadrigam == "IBREFUNDCC"){
		if(window.location.hash.includes("/REFUNDS/STATUS")){
			ancla="";
		}else{
			ancla = "REFUNDS";
			if (caseNumber) {
				const caseNumberMatch = window.location.href.match(/[?&]caseNumber=([^#]+)/);
				caseNumberVal = caseNumberMatch ? caseNumberMatch[1] : null;
			}
			if(caseNumberVal){
				caseNumberVal = caseNumberVal.replace(/&amp;/g, '&').trim();
				subpathSuffix = "/STATUS?caseNumber=" + caseNumberVal;
			}
		}
	} else if(quadrigam == "IBJCAN"){
		ancla = "PROOF_FLIGHT_CANCELLATION";
	} else if(quadrigam == "IBJDES"){
		ancla = "PROOF_FLIGHT_DIVERSION";
	} else if(quadrigam == "IBJCAM"){
		ancla = "PROOF_FLIGHT_SCHEDULE_CHANGE";
	} else if(quadrigam == "IBJVOL"){
		ancla = "PROOF_FLIGHT_TRAVEL";
	} else if(quadrigam == "IBJNVO"){
		ancla = "PROOF_FLIGHT_NO_TRAVEL";
	} else if(quadrigam == "INCIDE"){
		ancla = "GENERIC_FORM";
	} else if(quadrigam == "SUGFEL"){
		ancla = "SUGGESTIONS_AND_CONGRATULATIONS";
	} else if(quadrigam == "INCEOT"){
		ancla = "BAGGAGE";
	} else if(quadrigam == "INCOTR"){
		if(window.location.hash.includes("OTHER_CLAIMS")){
			ancla="";
		}else{
			ancla = "OTHER_CLAIMS";
			if (claimTypology) {
				const claimTypologyMatch = window.location.href.match(/[?&]otherClaimTypology=([^#]+)/);
				claimTypologyVal = claimTypologyMatch ? claimTypologyMatch[1] : null;
				//Guardo el parámetro en localStorage
				localStorage.setItem("claimOtherTypology", claimTypologyVal);
			} else {
				//Busco si está guardado en localStorage el parámetro
				claimTypologyVal = localStorage.getItem("claimOtherTypology");	
				claimTypology = localStorage.getItem("claimOtherTypology");		
			}

			if(claimTypologyVal){
				claimTypologyVal = claimTypologyVal.replace(/&amp;/g, '&').trim();
				subpathSuffix = "?otherClaimTypology=" + claimTypologyVal;
			}
		}
	}

	if (caseNumber || claimTypology) {
		location.href = location.origin + location.pathname + "#/" + ancla + subpathSuffix;
	}else if(ancla != ""){
		location.href = location.origin + location.pathname +"#/"+ ancla;
	}
}

if ($("[data-contenidoTabla]").length > 0) {
  const tablaReact = $('[data-contenidoTabla]').attr('data-contenidoTabla').trim();
  loadjsfile(`contenidos/ibe_contenidos.js${staticsVersion}`);
  $('head').append(`<link rel="stylesheet" type="text/css" \
  href="${tablaReact}/iberia-plus-privileges-table/style.css" />`);
  $('head').append(`<script defer fetchpriority="low" src="${tablaReact}/iberia-plus-privileges-table/customer--loyalty--iberia-plus-privileges-table--frontend.umd.js" type="text/javascript"></script>`);
}
  if ($("[data-contenidosTarjetas]").length > 0) {
  const tarjetasReact = $('[data-contenidosTarjetas]').attr('data-contenidosTarjetas').trim();
  loadjsfile(`contenidos/ibe_contenidos.js${staticsVersion}`);
  $('head').append(`<link rel="stylesheet" type="text/css" \
  href="${tarjetasReact}/iberia-plus-cards-carousel/style.css" />`);
  $('head').append(`<script defer fetchpriority="low" src="${tarjetasReact}/iberia-plus-cards-carousel/customer--loyalty--iberia-plus-cards-carousel--frontend.umd.js" type="text/javascript"></script>`);
}
if ($("[data-contenidosHeroBanner]").length > 0) {
  const bannerReact = $('[data-contenidosHeroBanner]').attr('data-contenidosHeroBanner').trim();
  loadjsfile(`contenidos/ibe_contenidos.js${staticsVersion}`);
  $('head').append(`<link rel="stylesheet" type="text/css" \
  href="${bannerReact}/iberia-plus-hero-banner/style.css" />`);
  $('head').append(`<script async rel="modulepreload" fetchpriority="high" src="${bannerReact}/iberia-plus-hero-banner/customer--loyalty--iberia-plus-hero-banner--frontend.umd.js" type="text/javascript"></script>`);
}

if ($("[data-connections-react]").length > 0) {
	const searchConnections = $('[data-connections-react]').attr('data-connections-react').trim();
	$('head').append(`<link rel="stylesheet" type="text/css" \
	href="${searchConnections}/customer--customer-experience--connections-flight--frontend/style.css" />`);
	$('head').append(`<script defer src="${searchConnections}/customer--customer-experience--connections-flight--frontend/customer--customer-experience--connections-flight--frontend.umd.js" type="text/javascript"></script>`)
}

if ($("[data-omnichannel-react]").length > 0) {
	const omnichannel = $('[data-omnichannel-react]').attr('data-omnichannel-react').trim();
	$('head').append(`<link rel="stylesheet" type="text/css" href="${omnichannel}/onebot/onebot-front/assets/index.css" />`);
	$('head').append(`<script defer src="${omnichannel}/onebot/onebot-front/assets/index.js" type="module"></script>`)
}


if($('.cardNoFollow').length > 0){
	$('.cardNoFollow').on('click', function () {
		let url = $(this)[0].getAttribute('data-url-link');
		let target = $(this)[0].getAttribute('data-url-target');
		if(url!=null && url!==undefined){
			if(target != null && target != undefined && target.includes("Blank")){
				window.open(url);
			} else {
				window.location.href = url;
			}
		}
	});
}

//evento salesForce - Login RRSS
window.addEventListener(
	"message",
	(event) => {
		if (
            (event.origin === 'https://iberia--identity.sandbox.my.site.com' ||
            event.origin === 'https://full-digitalboarding.cs110.force.com' ||
            event.origin === 'https://login.iberia.com') &&
            typeof event.data === 'string'
        ) {            
            if(event.data==='loginOnRRSS'){
                localStorage.setItem('returnURL', window.location.href);
            }
        }
	},
	false
);

//redireccion SF registro
if (quadrigam === "IRDAUS") {
	// SalesForce registro IB ZERO
	const urlZero = `${salesforceRegistroIBZero}`;
	window.location.href=urlZero+'?language='+`${localeg}`+'&origin='+`${marketg}`;
}
if (quadrigam === "PLUREG") { // IBDAUS
	// SalesForce registro IB PLUS
	const urlPlus = `${salesforceRegistroIBPlus}`;
	window.location.href=urlPlus+'?language='+`${localeg}`+'&origin='+`${marketg}`;
}

// Eventos de flujo resgistro, al pulsar el boton de registro
// CPA-34 https://transform.atlassian.net/browse/CPA-34
const registerButtons = document.querySelectorAll('.inte-register');
registerButtons.forEach(button => {
  button.addEventListener('click', evt => {   
	const eventData = {
		eventName: 'interaccion',
		eventCategory: 'header',
		eventAction: 'clic',
		eventLabel: 'registro'
	}
	// INIT DELETE GA4 MIGRATION
	if (typeof(window.DigitalChange) !== 'undefined')  {
		window.DigitalChange('interaction', eventData);
	}
	// FINISH DELETE GA4 MIGRATION
	if (typeof(window.dataLayer) !== 'undefined')  {
		window.dataLayer.push(eventData, { event: 'interaction' });
	}
	});
})

if (quadrigam === "IBVACLOAD"){
	loadjsfile(`independent/ibe_ibholidays.js${staticsVersion}`);
}
