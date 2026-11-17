import retrieveGlobalVariables from "../general/ibe_variables";
const { localeg, marketg, quadrigam } = retrieveGlobalVariables();

var classCardSelected = "ibe-card-guides--selected";
var tagAdd = "add";
var tagDel = "del";
var guideActivity = [];

var container, actives, number, total, listTab;
const size = "medium"; // small - medium - big
window.addEventListener("load", function () {
	window.addActivityMap = function (id) {
		addActivity(id);
	};
	$(".activity_action").click(function () {
		addActivity($(this).attr("id"));
	});
	$("#ui-id-4").click(function () {
		$("#MAP1_todos").click();
	});
	$("#ui-id-6").click(function () {
		$("#MAP2_todos").click();
	});
	$(".ibe-filter__check").click(function () {
		container = $(".ibe-card-container").attr("data-show-more");
		actives = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra
		number = $(".ibe-card-container").attr("data-show-more-number"); //cantidad de card que se muestra al hacer clik
		total = parseInt(actives);
		filterCards(this);
	});
	verifyGuideLocation();
	openGuide();
	loadStorageCards();
	countCardsFilter();

	container = $(".ibe-card-container").attr("data-show-more");
	actives = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra
	number = $(".ibe-card-container").attr("data-show-more-number"); //cantidad de card que se muestra al hacer clik
	total = parseInt(actives);
	filterCards($(".ibe-filter__main li:first-child input"));

	//Load more news data-show-more

	$(".ibe-button--show-more").click(function () {
		var idGuide = $(this).attr("data-show-more-button");

		listTab = [];
		// $(".ibe-filter__main li").each(function () {
		$("ul[data-show-tab = '" + idGuide + "'] li ").each(function () {
			if ($(this).find("input").prop("checked") == true) {
				var option = $(this).find("input").attr("data-info");
				listTab.push(option.toLowerCase());
			}
		});
		var filterOptions = listTab.filter(function (ele, pos) {
			return listTab.indexOf(ele) == pos;
		});
		var validationFilter = [];
		if (filterOptions.length > 1) {
			var validationFilter = [];
			var j;
			for (j = 0; j < filterOptions.length; j++) {
				if (filterOptions[j] !== "all") {
					validationFilter.push(filterOptions[j]);
				}
			}
			// validationFilter = filterOptions.filter((item) => item !== 'all');
			filterOptions = validationFilter;
		}
		var contCard = 0;
		total = total + parseInt(number);

		$("ul[data-show-more = '" + idGuide + "'] li ").each(function () {
			if (contCard < total) {
				var listCardItem = $(this).attr("data-filtertags");
				var i;
				for (i = 0; i < filterOptions.length; i++) {
					if (listCardItem == filterOptions[i] && contCard < total) {
						$(this).css("display", "list-item");
						contCard++;
					} else {
						if (filterOptions[i] == "all" && contCard < total) {
							$(this).css("display", "list-item");
							contCard++;
						}
					}
				}
			}
		});
		var fisrtShowValue = total;
		if ($(this).index() == fisrtShowValue) {
			scroll({
				top: this.offsetTop,
				behavior: "smooth",
			});
		}
	});

	var firstOpen = false;
	var activesTab = $(".ibe-card-container").attr("data-show-more-init"); //cantidad inicial que muestra

	$("[data-show-more] li:nth-child(-n+" + activesTab + ")").css(
		"display",
		"list-item"
	);
});
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
	var contCardsB = 0;
	$("ul.ibe-card-container")
		.find('[data-info-tab="' + tabName + '"]')
		.each(function () {
			if ($(this).is(":visible") && contCardsB < actives) {
				contCardsB++;
			} else {
				$(this).hide();
			}
		});

	// if (contCards > 6) {
	$(".ibe-infocheckin__footer-show-more")
		.filter("[data-tabinfo='" + tabName + "']")
		.show();
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
let arrayActivities1 = [];
let arrayActivities2 = [];
const positionMap = {
	lat: $("[data-latitud]").attr("data-latitud").trim(),
	long: $("[data-longitud]").attr("data-longitud").trim(),
};

// ----------mapa---------------
if (localeg && marketg) {
	const iata = $("[data-iata]").attr("data-iata");
	const idGuide_C = $("[data-id]").attr("data-id");

	// mapa que ver
	$.ajax({
		method: "GET",
		url: "/cs/Satellite",
		data: {
			pagename: "IB_SE/destinationguideJsonMap",
			locale: localeg,
			market: marketg,
			iata: iata,
			que: "ver",
			tab: "TAB1_",
			datosPorID: "false",
			guideID: idGuide_C,
		},
		success(data) {
			if (JSON.parse(data).length > 0) {
				arrayActivities1 = JSON.parse(data);
				sessionStorage.setItem("arrMAP1", data);
				sessionStorage.setItem("arrActivitiesMAP1", data);
				orderActivities(
					arrayActivities1,
					"MAP1",
					positionMap,
					size,
					true
				);

				// inicializar mapa
				dFrontJs.ibe_google_map.init(
					"mapQueVer",
					JSON.parse(data),
					12,
					positionMap,
					size
				);
			} else {
				// ocultar mapa
				$("#mapQueVer").hide();
				$("#mapQueVer").next("div").hide();
			}
		},
	});

	// mapa que hacer
	$.ajax({
		method: "GET",
		url: "/cs/Satellite",
		data: {
			pagename: "IB_SE/destinationguideJsonMap",
			locale: localeg,
			market: marketg,
			iata: iata,
			que: "hacer",
			tab: "TAB2_",
			datosPorID: "false",
			guideID: idGuide_C,
		},
		success(data) {
			if (JSON.parse(data).length > 0) {
				arrayActivities2 = JSON.parse(data);
				sessionStorage.setItem("arrActivitiesMAP2", data);
				sessionStorage.setItem("arrMAP2", data);
				orderActivities(
					arrayActivities2,
					"MAP2",
					positionMap,
					size,
					true
				);

				// inicializar mapa
				dFrontJs.ibe_google_map.init(
					"mapQueHacer",
					JSON.parse(data),
					12,
					positionMap,
					size
				);
			} else {
				// ocultar mapa
				$("#mapQueHacer").hide();
				$("#mapQueHacer").next("div").hide();
			}
		},
	});
}
function orderActivities(
	arrayActivities,
	tab,
	positionMap,
	size,
	clicks = false
) {
	// crear array segun categoria
	let arryellow = [];
	let arrorange = [];
	let arrgreen = [];
	let arrblue = [];
	let arrpurple = [];
	let arrred = [];
	let arrCat = [];
	let arrMAP = [];
	for (let index = 0; index < arrayActivities.length; index++) {
		if (arrayActivities[index].icon == "orange") {
			arrorange.push(arrayActivities[index]);
			arrCat["orange"] = arrayActivities[index].idCat;
		}
		if (arrayActivities[index].icon == "green") {
			arrgreen.push(arrayActivities[index]);
			arrCat["green"] = arrayActivities[index].idCat;
		}
		if (arrayActivities[index].icon == "blue") {
			arrblue.push(arrayActivities[index]);
			arrCat["blue"] = arrayActivities[index].idCat;
		}
		if (arrayActivities[index].icon == "yellow") {
			arryellow.push(arrayActivities[index]);
			arrCat["yellow"] = arrayActivities[index].idCat;
		}
		if (arrayActivities[index].icon == "purple") {
			arrpurple.push(arrayActivities[index]);
			arrCat["purple"] = arrayActivities[index].idCat;
		}
		if (arrayActivities[index].icon == "red") {
			arrred.push(arrayActivities[index]);
			arrCat["red"] = arrayActivities[index].idCat;
		}
	}

	// actualizar contadores
	const reg = /\((.*?)\)/g;
	// total
	let countTotal = $("label[for='" + tab + "_todos']").text();
	countTotal = countTotal.replace(reg, "(" + arrayActivities.length + ")");
	$("label[for='" + tab + "_todos']").text(countTotal);

	//azul
	let countBlue = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["blue"] + "']"
	).text();
	countBlue = countBlue.replace(reg, "(" + arrblue.length + ")");
	$("label[for='" + tab + "_Activity_Category_" + arrCat["blue"] + "']").text(
		countBlue
	);

	//rojo
	let countRed = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["red"] + "']"
	).text();
	countRed = countRed.replace(reg, "(" + arrred.length + ")");
	$("label[for='" + tab + "_Activity_Category_" + arrCat["red"] + "']").text(
		countRed
	);

	//verde
	let countGreen = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["green"] + "']"
	).text();
	countGreen = countGreen.replace(reg, "(" + arrgreen.length + ")");
	$(
		"label[for='" + tab + "_Activity_Category_" + arrCat["green"] + "']"
	).text(countGreen);

	//morado
	let countPurple = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["purple"] + "']"
	).text();
	countPurple = countPurple.replace(reg, "(" + arrpurple.length + ")");
	$(
		"label[for='" + tab + "_Activity_Category_" + arrCat["purple"] + "']"
	).text(countPurple);

	//amarillo
	let countYellow = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["yellow"] + "']"
	).text();
	countYellow = countYellow.replace(reg, "(" + arryellow.length + ")");
	$(
		"label[for='" + tab + "_Activity_Category_" + arrCat["yellow"] + "']"
	).text(countYellow);

	//naranja
	let countOrange = $(
		"label[for='" + tab + "_Activity_Category_" + arrCat["orange"] + "']"
	).text();
	countOrange = countOrange.replace(reg, "(" + arrorange.length + ")");
	$(
		"label[for='" + tab + "_Activity_Category_" + arrCat["orange"] + "']"
	).text(countOrange);

	if (clicks) {
		// click todos
		$("#" + tab + "_todos").click(function () {
			arrMAP = [];
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});

		//click en categoria blue
		$(
			"label[for='" + tab + "_Activity_Category_" + arrCat["blue"] + "']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["blue"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "blue");
			} else {
				arrMAP = arrMAP.concat(arrblue);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});

		//click en categoria red
		$(
			"label[for='" + tab + "_Activity_Category_" + arrCat["red"] + "']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["red"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "red");
			} else {
				arrMAP = arrMAP.concat(arrred);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});
		//click en categoria orange
		$(
			"label[for='" +
				tab +
				"_Activity_Category_" +
				arrCat["orange"] +
				"']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["orange"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "orange");
			} else {
				arrMAP = arrMAP.concat(arrorange);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});
		//click en categoria purple
		$(
			"label[for='" +
				tab +
				"_Activity_Category_" +
				arrCat["purple"] +
				"']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["purple"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "purple");
			} else {
				arrMAP = arrMAP.concat(arrpurple);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});
		//click en categoria yellow
		$(
			"label[for='" +
				tab +
				"_Activity_Category_" +
				arrCat["yellow"] +
				"']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["yellow"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "yellow");
			} else {
				arrMAP = arrMAP.concat(arryellow);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});
		//click en categoria green
		$(
			"label[for='" + tab + "_Activity_Category_" + arrCat["green"] + "']"
		).click(function () {
			let enMapa = false;
			for (let index = 0; index < arrMAP.length; index++) {
				if (arrMAP[index].idCat == arrCat["green"]) {
					enMapa = true;
				}
			}
			if (enMapa) {
				arrMAP = arrMAP.filter((item) => item.icon !== "green");
			} else {
				arrMAP = arrMAP.concat(arrgreen);
			}
			if (tab == "MAP1") {
				updatemap(
					"mapQueVer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(arrMAP));
			} else if (tab == "MAP2") {
				updatemap(
					"mapQueHacer",
					arrMAP,
					positionMap,
					size,
					arrayActivities
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(arrMAP));
			}
		});
	}
}
function updatemap(id, arrMAP, positionMap, size, arrayActivities) {
	//actualizar datos del mapa
	if (arrMAP.length == 0 || arrMAP === "undefined") {
		dFrontJs.ibe_google_map.update(
			id,
			arrayActivities,
			12,
			positionMap,
			size
		);
	} else {
		dFrontJs.ibe_google_map.update(id, arrMAP, 12, positionMap, size);
	}
}
function addActivity(activityID) {
	var elemento = activityID.split("_");
	var tabInfo = elemento[0];
	var actType = elemento[1];
	var actAction = elemento[2];
	var actId = elemento[3];
	let newarr = [];
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
			if (JSON.parse(sessionStorage.getItem("arrMAP1")).length) {
				let arrMAPchange = JSON.parse(
					sessionStorage.getItem("arrMAP1")
				);
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"add",
					true
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(newarr));
				//LLAMAR A changeDataMaker pero sin update
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrayActivities1,
					12,
					positionMap,
					size,
					actId,
					"add",
					false
				);
				orderActivities(newarr, "MAP1", positionMap, size);
			} else {
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrayActivities1,
					12,
					positionMap,
					size,
					actId,
					"add",
					true
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(newarr));
				orderActivities(newarr, "MAP1", positionMap, size);
			}
		} else if (tabInfo == "TAB2") {
			if (JSON.parse(sessionStorage.getItem("arrMAP2")).length > 0) {
				let arrMAPchange = JSON.parse(
					sessionStorage.getItem("arrMAP2")
				);
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"add",
					true
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(newarr));
				//LLAMAR A changeDataMaker pero sin update
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrayActivities2,
					12,
					positionMap,
					size,
					actId,
					"add",
					false
				);
				orderActivities(newarr, "MAP2", positionMap, size);
			} else {
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrayActivities2,
					12,
					positionMap,
					size,
					actId,
					"add",
					true
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(newarr));
				orderActivities(newarr, "MAP2", positionMap, size);
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
			if (JSON.parse(sessionStorage.getItem("arrMAP1")).length > 0) {
				let arrMAPchange = JSON.parse(
					sessionStorage.getItem("arrMAP1")
				);
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"delete",
					true
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(newarr));
				//LLAMAR A changeDataMaker pero sin update
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrayActivities1,
					12,
					positionMap,
					size,
					actId,
					"delete",
					false
				);
				orderActivities(newarr, "MAP1", positionMap, size);
			} else {
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueVer",
					arrayActivities1,
					12,
					positionMap,
					size,
					actId,
					"delete",
					true
				);
				sessionStorage.setItem("arrMAP1", JSON.stringify(newarr));
				orderActivities(newarr, "MAP1", positionMap, size);
			}
		} else if (tabInfo == "TAB2") {
			if (JSON.parse(sessionStorage.getItem("arrMAP2")).length > 0) {
				let arrMAPchange = JSON.parse(
					sessionStorage.getItem("arrMAP2")
				);
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrMAPchange,
					12,
					positionMap,
					size,
					actId,
					"delete",
					true
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(newarr));
				//LLAMAR A changeDataMaker pero sin update
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrayActivities2,
					12,
					positionMap,
					size,
					actId,
					"delete",
					false
				);
				orderActivities(newarr, "MAP2", positionMap, size);
			} else {
				newarr = dFrontJs.ibe_google_map.changeDataMaker(
					"mapQueHacer",
					arrayActivities2,
					12,
					positionMap,
					size,
					actId,
					"delete",
					true
				);
				sessionStorage.setItem("arrMAP2", JSON.stringify(newarr));
				orderActivities(newarr, "MAP2", positionMap, size);
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
	openGuide();
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
	openGuide();
}
function getLocalStorage() {
	if (!localStorage.getItem("guideActivity")) {
		localStorage.setItem("guideActivity", "");
	} else {
		guideActivity = JSON.parse(localStorage.getItem("guideActivity"));
	}
}
// ----------------- boton abre tu guia de viajes-----------------
if ($("#openGuide").length > 0) {
	$("#openGuide").click(function () {
		//obtener id de los planes de localstorage
		getLocalStorage();
		let stringID = "";
		for (let index = 0; index < guideActivity.length; index++) {
			stringID += guideActivity[index] + "_";
		}
		stringID = stringID.substring(0, stringID.length - 1);
		let url = "";
		let page = $("#openGuide").attr("data-url");
		url = page + "?id=";
		window.location.href = url + stringID;
	});
}

// ----------------- boton abre tu guia de viajes-----------------
function openGuide() {
	if (guideActivity.length > 0) {
		$("#openGuide").removeClass("hidden");
	} else {
		$("#openGuide").addClass("hidden");
	}
}

// ----------------- Verifica ubicacion de la guia ---------------
function verifyGuideLocation() {
	var guideId = $("body").attr("data-contentid");

	if (localStorage.guideid != null) {
		if (localStorage.guideid != guideId) {
			localStorage.setItem("guideid", guideId);
			localStorage.setItem("guideActivity", []);
		}
	} else {
		localStorage.setItem("guideid", guideId);
	}
}


