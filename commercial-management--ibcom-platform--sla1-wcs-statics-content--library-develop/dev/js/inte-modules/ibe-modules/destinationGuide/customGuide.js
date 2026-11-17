import retrieveGlobalVariables from "../general/ibe_variables";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { updateDatalayer, updateDigitalData } from '../manage/ibe_common';

const { localeg, marketg } = retrieveGlobalVariables();
var classCardSelected = "ibe-card-guides--selected";
var tagAdd = "add";
var tagDel = "del";
var guideActivity = [];

getLocalStorage_customGuide();
pintaCustomGuide();
function getUrl() {
	var url = window.location.href;
	return url;
}

function getLocalStorage_customGuide() {
	var url = getUrl();
	var ids = url.split("=");
	if (ids.length == 2 && ids[1] != null) {
		localStorage.setItem(
			"guideActivity",
			JSON.stringify(ids[1].split("_"))
		);
	}
	guideActivity = JSON.parse(localStorage.getItem("guideActivity"));
}
function pintaCustomGuide() {
	let stringID = "";
	for (let index = 0; index < guideActivity.length; index++) {
		stringID += guideActivity[index] + "_";
	}
	stringID = stringID.substring(0, stringID.length - 1);
	$.ajax({
		method: "GET",
		url: "/cs/Satellite",
		dataType: "html",
		data: {
			pagename: "IB_SE/customGuide",
			locale: localeg,
			market: marketg,
			id: stringID,
		},
		success(data) {
			$("#customGuide-dataPage").html(data);
			if ($('#customGuide-dataPage').length > 0) {
				datalayer_general.quadrigam = 'GUIPER-'+$('[data-iata-custom]').attr('data-iata-custom');
				datalayer_general.codigoSeguimiento = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/`+'GUIPER-'+$('[data-iata-custom]').attr('data-iata-custom');
				updateDatalayer('view');
				digital_data.Quadrigam = 'GUIPER-'+$('[data-iata-custom]').attr('data-iata-custom');
				digital_data.TrackingCode = `${marketg.toLowerCase()}/${localeg.toLowerCase()}/`+'GUIPER-'+$('[data-iata-custom]').attr('data-iata-custom');
				updateDigitalData('view');
			}
			window.addActivityMap = function (id) {
				addActivity(id);
			};
			dFrontJs.ibe_modal.init();
			clicks();
			mapa();
			comprobacionLocalStorage();
		},
	});
}
function copy_clipboard() {
	var copyText = getUrl();
	var elem = document.createElement("textarea");
	document.body.appendChild(elem);
	elem.value = copyText;
	elem.select();
	document.execCommand("copy");
	document.body.removeChild(elem);
}

function copy_url_to_field(el) {
	var destinationFieldId = $(el).attr("data-destination-field");
	var element = $("#" + destinationFieldId);
	element.val(getUrl());
	element.select();
	document.execCommand("copy");
}

function send_email(el) {
	var subject = $(el).attr("data-email-subject");
	var body = $(el).attr("data-email-body");
	body = body.replace("[url_site]", getUrl());
	var text_mail = "mailto:?subject=" + subject + "&body=" + body;
	location.href = text_mail;
}

function send_whatsapp(el) {
	var body = $(el).attr("data-whatsapp-body");
	body = body.replace("[url_site]", getUrl());
	var urlWsp = "https://api.whatsapp.com/send?text=" + body;
	window.open(urlWsp, "_blank").focus();
}
function clicks() {
	$(".copy_clipboard").click(function () {
		copy_clipboard();
	});
	$(".copy_url_to_field").click(function () {
		copy_url_to_field(this);
	});
	$(".send_email").click(function () {
		send_email(this);
	});
	$(".send_whatsapp").click(function () {
		send_whatsapp(this);
	});

	$("#MyGuide_Box_Share_Input").val(getUrl());
}

function mapa() {
	// --------------mapa---------------
	//obtener ids de urls
	var url = new URL(window.location.href);
	var ids = url.searchParams.get("id");

	let positionMap = {
		lat: $("[data-latitud]").attr("data-latitud").trim(),
		long: $("[data-longitud]").attr("data-longitud").trim(),
	};

	if (localeg && marketg) {
		let size = "big"; // small - medium - big
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename: "IB_SE/destinationguideJsonMap",
				locale: localeg,
				market: marketg,
				que: "map",
				tab: "TAB1_",
				datosPorID: "true",
				ids: ids,
			},
			success(data) {
				localStorage.setItem("map", data);
				let arrMAPchange = JSON.parse(localStorage.getItem("map"));
				let idsMAPchange = JSON.parse(
					localStorage.getItem("guideActivity")
				);
				if (data != "") {
					if (JSON.parse(data).length > 0) {
						// inicializar mapa
						dFrontJs.ibe_google_map.init(
							"mapYourGuide",
							JSON.parse(data),
							12,
							positionMap,
							size
						);
						// actualizar array con add
						for (
							let index = 0;
							index < arrMAPchange.length;
							index++
						) {
							let newmap = JSON.parse(
								localStorage.getItem("map")
							);
							let map = dFrontJs.ibe_google_map.changeDataMaker(
								"mapYourGuide",
								newmap,
								12,
								positionMap,
								size,
								idsMAPchange[index],
								"add",
								true
							);
							localStorage.setItem("map", JSON.stringify(map));
						}
					} else {
						// ocultar mapa
						$("#mapYourGuide").hide();
						$("#mapYourGuide").next("div").hide();
					}
				} else {
					// ocultar mapa
					$("#mapYourGuide").hide();
					$("#mapYourGuide").next("div").hide();
				}
			},
		});
	}
}
// Comparacion de localstorage con id de URL
function comprobacionLocalStorage() {
	$(".activity_action").click(function () {
		addActivity($(this).attr("id"));
	});
	$(".ibe-filter__check").click(function () {
		filterCards(this);
	});
	loadStorageCards();
	countCardsFilter();
}

function loadStorageCards() {
	getLocalStorage();
	guideActivity.forEach(function (elementId, index) {
		$("[data-activityid='" + elementId + "']").each(function () {
			var card = $(this);
			var tab = $(card).attr("data-info-tab");
			var action = "activity_add_";
			var actCardId = tab + action + elementId;
			addActivity(actCardId);
		});
	});
}
function countCardsFilter() {
	$(".ibe-filter__check").each(function () {
		var tab = $(this).attr("data-info-tab");
		var category = $(this).attr("data-info");
		if (category != "all") {
			var cantidad = $(".ibe-card")
				.filter("[data-info-tab='" + tab + "']")
				.filter("[data-filtertags='" + category + "']").length;
			$(this).parent().find("label").find(".card_count").text(cantidad);
		}
	});
}
function filterCards(el) {
	var tabInfo = $(el).attr("data-info-tab");
	if ($(el).is(":checked")) {
		if ($(el).attr("data-info") == "all") {
			actionFilters("category", tabInfo);
		} else if ($(el).attr("data-info") != "all") {
			actionFilters("all", tabInfo);
		}
	} else {
		actionFilters("verify", tabInfo);
	}
	$(".ibe-filter__check")
		.filter('[data-info-tab="' + tabInfo + '"]')
		.each(function () {
			var idInfo = $(this).attr("data-info");
			if (idInfo == "all" && $(this).is(":checked")) {
				$('[data-info-tab="' + tabInfo + '"]')
					.filter(".ibe-card")
					.each(function () {
						$(this).show();
					});
				return false;
			} else {
				if ($(this).is(":checked")) {
					$("ul.ibe-card-container")
						.find('[data-info-tab="' + tabInfo + '"]')
						.filter("[data-filtertags='" + idInfo + "']")
						.show();
				} else {
					$("ul.ibe-card-container")
						.find('[data-info-tab="' + tabInfo + '"]')
						.filter("[data-filtertags='" + idInfo + "']")
						.hide();
				}
			}
		});
	showButton(tabInfo);
}

function showButton(tabName) {
	var contCards = 0;
	$("ul.ibe-card-container")
		.find('[data-info-tab="' + tabName + '"]')
		.each(function () {
			if ($(this).is(":visible")) {
				contCards++;
			}
		});

	if (contCards > 6) {
		$(".ibe-infocheckin__footer-show-more")
			.filter("[data-tabinfo='" + tabName + "']")
			.show();
	} else {
		$(".ibe-infocheckin__footer-show-more")
			.filter("[data-tabinfo='" + tabName + "']")
			.hide();
	}
}
function actionFilters(tipo, tab) {
	switch (tipo) {
		case "all":
			$("#" + tab + "todos").prop("checked", false);
			break;
		case "category":
			$("[data-info-tab='" + tab + "']").each(function () {
				if ($(this).attr("data-info") != "all") {
					$(this).prop("checked", false);
				}
			});
			break;
		case "verify":
			var cont = 0;
			$("[data-info-tab='" + tab + "']").each(function () {
				if ($(this).is(":checked") == true) {
					cont++;
				}
			});
			if (cont == 0) {
				$("#" + tab + "todos").prop("checked", true);
			}
			break;
	}
}
function addActivity(activityID) {
	let positionMap = {
		lat: $("[data-latitud]").attr("data-latitud").trim(),
		long: $("[data-longitud]").attr("data-longitud").trim(),
	};
	let size = "big"; // small - medium - big
	var elemento = activityID.split("_");
	var tabInfo = elemento[0];
	var actType = elemento[1];
	var actAction = elemento[2];
	var actId = elemento[3];
	var actCardId = "#" + tabInfo + "_" + actType + "_" + actId;
	if (!localStorage.getItem("guideActivity")) {
		localStorage.setItem("guideActivity", "");
	}
	if (actAction == tagAdd) {
		if (activityID.includes("map")) {
			//Esconde y muestra en el mapa
			var id_elemento =
				"#" +
				tabInfo +
				"_" +
				actType +
				"_" +
				tagDel +
				"_" +
				actId +
				"_map";
			$(id_elemento).show();
			$("#" + activityID).hide();
			//esconde y muestra en grid
			var id_elemento2 =
				"#" + tabInfo + "_" + actType + "_" + actAction + "_" + actId;
			var id_elemento3 =
				"#" + tabInfo + "_" + actType + "_" + tagDel + "_" + actId;
			$(id_elemento3).show();
			$(id_elemento2).hide();
		} else {
			var id_elemento =
				"#" + tabInfo + "_" + actType + "_" + tagDel + "_" + actId;
			$(id_elemento).show();
			$("#" + activityID).hide();
		}
		if (tabInfo == "TAB1") {
			if (localStorage.getItem("map")) {
				let arrMAPchange = JSON.parse(localStorage.getItem("map"));
				let newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapYourGuide",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"add",
					true
				);
				localStorage.setItem("map", JSON.stringify(newarr));
			}
		}
		$("ul.ibe-card-container")
			.find('[data-info-tab="' + tabInfo + '_"]')
			.filter("[data-activityID='" + actId + "']")
			.find(".ibe-card-guides")
			.addClass(classCardSelected);
		addGuideLocalStorage(actId);
	} else {
		if (activityID.includes("map")) {
			//Esconde y muestra en el mapa
			var id_elemento =
				"#" +
				tabInfo +
				"_" +
				actType +
				"_" +
				tagAdd +
				"_" +
				actId +
				"_map";
			$(id_elemento).show();
			$("#" + activityID).hide();
			//esconde y muestra en grid
			var id_elemento2 =
				"#" + tabInfo + "_" + actType + "_" + actAction + "_" + actId;
			var id_elemento3 =
				"#" + tabInfo + "_" + actType + "_" + tagAdd + "_" + actId;
			$(id_elemento3).show();
			$(id_elemento2).hide();
		} else {
			var id_elemento =
				"#" + tabInfo + "_" + actType + "_" + tagAdd + "_" + actId;
			$(id_elemento).show();
			$("#" + activityID).hide();
		}
		if (tabInfo == "TAB1") {
			if (localStorage.getItem("map")) {
				let arrMAPchange = JSON.parse(localStorage.getItem("map"));
				let newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapYourGuide",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"delete",
					true
				);
				localStorage.setItem("map", JSON.stringify(newarr));
			}
		}
		$("ul.ibe-card-container")
			.find('[data-info-tab="' + tabInfo + '_"]')
			.filter("[data-activityID='" + actId + "']")
			.find(".ibe-card-guides")
			.removeClass(classCardSelected);
		delGuideLocalStorage(actId);
	}
}
function addGuideLocalStorage(id) {
	getLocalStorage();
	var existe = false;
	for (let index = 0; index < guideActivity.length; index++) {
		if (guideActivity[index] === id) {
			existe = true;
		}
	}
	if (!existe) {
		guideActivity.push(id);
		localStorage.setItem("guideActivity", JSON.stringify(guideActivity));
	}
}
function delGuideLocalStorage(id) {
	getLocalStorage();
	var existe = false;
	for (let index = 0; index < guideActivity.length; index++) {
		if (guideActivity[index] === id) {
			guideActivity.splice(index, 1);
		}
	}
	localStorage.setItem("guideActivity", JSON.stringify(guideActivity));
}
function getLocalStorage() {
	if (!localStorage.getItem("guideActivity")) {
		localStorage.setItem("guideActivity", "");
	} else {
		guideActivity = JSON.parse(localStorage.getItem("guideActivity"));
	}
}
