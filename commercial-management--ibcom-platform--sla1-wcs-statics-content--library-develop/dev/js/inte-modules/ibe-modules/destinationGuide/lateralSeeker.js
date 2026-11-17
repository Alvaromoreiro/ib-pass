import retrieveGlobalVariables from "../general/ibe_variables";
import { getCitiesOrgDest } from "../manage/ibe_cities-services";
let { localeg, localemasterg, marketg, quadrigam } = retrieveGlobalVariables();
import getCityListInformation from "../independent/searcher-modules/ibe_get-city-list-info";
import checkifcitiesneeded from "../independent/searcher-modules/ibe_check-if-needed";
import {
	updateLastSearches,
	updateLastSearchesMT,
	getLastSearchMT,
	getAllValidSearhes,
} from "../independent/searcher-modules/ibe_last-searches-storage";

// ------------buscador lateral---------------
let origin3tabsJSON;
let destinationVJSON;
let destinationHJSON;
let destinationCJSON;
let originRJSON;
let destinationRJSON;
let originSOJSON;
let destinationSOJSON;
const $searchCont = $("#SearcherContent");
if(localemasterg!=""){
    localeg = localemasterg;
  }

if(localemasterg!=""){
	localeg = localemasterg;
}


async function callAjaxOrDest(codeAux) {
	const citiesInfo = await getCitiesOrgDest(codeAux);
	if (citiesInfo) {
		origin3tabsJSON = citiesInfo['V-O'];
		destinationVJSON = citiesInfo['V-D'];
		destinationHJSON = citiesInfo['H-D'];
		destinationCJSON = citiesInfo['C-D'];
		originRJSON = citiesInfo['R-O'];
		destinationRJSON = citiesInfo['R-D'];
	}
	checkifcitiesneeded(origin3tabsJSON, destinationVJSON, destinationHJSON,
		destinationCJSON, originRJSON, destinationRJSON)
		.then((arrOriDest) => {
		  if (arrOriDest) {
			origin3tabsJSON = arrOriDest.origin3tabsJSONAux ? arrOriDest.origin3tabsJSONAux : origin3tabsJSON;
			destinationVJSON = arrOriDest.destinationVJSONAux ? arrOriDest.destinationVJSONAux : destinationVJSON;
			destinationHJSON = arrOriDest.destinationHJSONAux ? arrOriDest.destinationHJSONAux : destinationHJSON;
			destinationCJSON = arrOriDest.destinationCJSONAux ? arrOriDest.destinationCJSONAux : destinationCJSON;
			originRJSON = arrOriDest.originRJSONAux ? arrOriDest.originRJSONAux : originRJSON;
			destinationRJSON = arrOriDest.destinationRJSONAux ? arrOriDest.destinationRJSONAux : destinationRJSON;
		  }
		}).catch((error) => {
		  // eslint-disable-next-line no-console
		  console.error(error);
		  console.error('Error loading Origin and destination');
		});

}  

if ($(".ibe-choose-city").length > 0) {
	callAjaxOrDest('H-D');
	callAjaxOrDest('C-D');
	//obtener ciudades
	getCitiesOrgDest("V-O", true).then(function () {
		const vo = JSON.parse(
			sessionStorage.getItem("ibe-wcs-cities-location")
		)["V-O"];
		dFrontJs.ibe_searcher_choose_city.init("#flight_origin", vo);
		dFrontJs.ibe_autocomplete.init("#flight_origin", vo);

		dFrontJs.ibe_searcher_choose_city.init("#flight_hotel_origin", vo);
		dFrontJs.ibe_autocomplete.init("#flight_hotel_origin", vo);

		dFrontJs.ibe_autocomplete.init("#flight_car_origin", vo);
		dFrontJs.ibe_searcher_choose_city.init("#flight_car_origin", vo);
	});
	getCitiesOrgDest("V-D", true).then(function () {
		const vd = JSON.parse(
			sessionStorage.getItem("ibe-wcs-cities-location")
		)["V-D"];
		dFrontJs.ibe_searcher_choose_city.init("#flight_destiny", vd);
		dFrontJs.ibe_autocomplete.init("#flight_destiny", vd);

		dFrontJs.ibe_searcher_choose_city.init("#flight_hotel_destiny", vd);
		dFrontJs.ibe_autocomplete.init("#flight_hotel_destiny", vd);

		dFrontJs.ibe_searcher_choose_city.init("#flight_car_destiny", vd);
		dFrontJs.ibe_autocomplete.init("#flight_car_destiny", vd);
	});

	// construir destiny
	const iata = $("[data-iata]").data("iata");
	const city = $("[data-city]").data("city");
	const destiny = city + " (" + iata + ")";
	// agregar datos en el value del input
	$("#flight_destiny").val(destiny);
	$("label[for='flight_destiny']").removeClass("ibe_form__input-label");
	$("label[for='flight_destiny']").addClass(
		"ibe_form__input-label xui-label--up"
	);

	$("#flight_hotel_destiny").val(destiny);
	$("label[for='flight_hotel_destiny']").removeClass("ibe_form__input-label");
	$("label[for='flight_hotel_destiny']").addClass(
		"ibe_form__input-label xui-label--up"
	);

	$("#flight_car_destiny").val(destiny);
	$("label[for='flight_car_destiny']").removeClass("ibe_form__input-label");
	$("label[for='flight_car_destiny']").addClass(
		"ibe_form__input-label xui-label--up"
	);

	// si el destino y origen es madrid-barcelona mostrar puente aereo
	$("#flight_origin").on("change", function () {
		puenteAereo();
	});
	$("#flight_destiny").on("change", function () {
		puenteAereo();
	});
}

function puenteAereo() {
	if (
		($("#flight_origin").val().includes("(BCN)") &&
			$("#flight_destiny").val().includes("(MAD)")) ||
		($("#flight_origin").val().includes("(MAD)") &&
			$("#flight_destiny").val().includes("(BCN)"))
	) {
		$("#puenteAereo").removeClass("hidden");
	} else {
		// comprobar si no tiene clase hidden
		if (!$("#puenteAereo").hasClass("hidden")) {
			$("#puenteAereo").addClass("hidden");
		}
	}
}

// ----------------- buscador lateral TAB1---------------
$("#searchtab1").on("submit click", (e) => {
	e.preventDefault();
	requestAnimationFrame(() => {
		const i = 1;
		// const modalTitle = $('#tabContainer').attr('data-error');
		let dateinit = false;
		let dateend = false;
		let init = false;
		let end = false;
		let equal = false;
		let date = false;
		let TRIP_TYPE;

		if ($(`input#flight_round_date`).val() !== "") {
			dateinit = $(`#flight_round_date`).val();
		}
		if ($(`input#flight_return_date`).val() !== "") {
			dateend = $(`#flight_return_date`).val();
		}
		if ($(`input#flight_origin`).val() !== "") {
			init = $(`#flight_origin`).val();
		} else {
			$("input#flight_origin")
				.parent()
				.addClass("ibe_form__group--error");
			$("#flight_origin_validate").removeClass("hidden");
		}
		if ($(`input#flight_destiny`).val() !== "") {
			end = $(`#flight_destiny`).val();
		} else {
			$("input#flight_destiny")
				.parent()
				.addClass("ibe_form__group--error");
			$("#flight_destiny_validate").removeClass("hidden");
		}
		if (
			$(`input#flight_origin`).val() !== "" &&
			$(`input#flight_destiny`).val() !== "" &&
			$(`input#flight_destiny`).val() != $(`input#flight_origin`).val()
		) {
			equal = true;
		}

		if ($("#flexible1").is(":checked")) {
			TRIP_TYPE = "2";
		} else {
			TRIP_TYPE = "1";
		}
		if (
			($("#flight_round_date").val() != "" &&
				$("#flight_return_date").val() != "") ||
			($("#flight_round_date").val() != "" && TRIP_TYPE == 1)
		) {
			date = true;
		}

		if (!date) {
			$("#date_validation").parent().addClass("ibe_form__group--error");
			$("#date_validation").removeClass("hidden");
		}

		if (
			(dFrontJs.ibe_validations_searcher.validateSearcher() &&
				dateinit !== false &&
				(dateend !== false || TRIP_TYPE === "1") &&
				init !== false &&
				end !== false &&
				equal != false,
			date != false)
		) {
			let parameters;

			// fechas flexibles
			let flexible = false;
			if ($(`#flexible1`).is(":checked")) {
				flexible = true;
			}

			//nombre ciudad origin
			const lenBegCit = $(`#flight_origin`)[0].value.split("(")[0].length;
			const begCit = $(`#flight_origin`)[0]
				.value.split("(")[0]
				.substring(0, lenBegCit - 1);
			// nombre ciudad destiny
			const lenEndCit =
				$(`#flight_destiny`)[0].value.split("(")[0].length;
			const endCit = $(`#flight_destiny`)[0]
				.value.split("(")[0]
				.substring(0, lenEndCit - 1);

			//iata origin
			const BEGIN_CITY_01 = $(`#flight_origin`)[0]
				.value.split("(")[1]
				.substring(0, 3);
			//iata destiny
			const END_CITY_01 = $(`#flight_destiny`)[0]
				.value.split("(")[1]
				.substring(0, 3);

			// tarifa
			const FARE_TYPE = $("#tarifa1 option:selected").val();
			const YCD = $(`#senior1`).length ? $(`#senior1`).html() : "";
			const ADT = $(`#adult1`).html();
			const YTH = $(`#young1`).length ? $(`#young1`).html() : "";
			const BNN = $(`#teenager1`).length ? $(`#teenager1`).html() : "";
			const CHD = $(`#infants1`).html();
			const INF = $(`#babys1`).html();

			// pasajeros
			const passager = $("#flight_passengers").val();

			// parametros para la url
			let mercado = marketg;
			let lenguaje = localeg;
			const appliesOMB = false;
			const splitEndCity = false;
			const initializedOMB = true;

			const BEGIN_DAY_01 = dateinit.split("/")[0];
			const BEGIN_MONTH_01 = dateinit.split("/")[1];
			const BEGIN_YEAR_01 = dateinit.split("/")[2];

			let END_DAY_01 = "";
			let END_MONTH_01 = "";
			let END_YEAR_01 = "";

			let idaVuelta=false;
			if($("#idavuelta").is(":checked")){
				TRIP_TYPE="2";
				idaVuelta= true;
			}
				
			if (idaVuelta) {
				END_DAY_01 = dateend.split("/")[0];
				END_MONTH_01 = dateend.split("/")[1];
				END_YEAR_01 = dateend.split("/")[2];
			}

			// montar la url
			parameters = `?market=${mercado}&language=${lenguaje}&appliesOMB=${appliesOMB}&splitEndCity=${splitEndCity}&initializedOMB=${initializedOMB}&flexible=${flexible}&TRIP_TYPE=${TRIP_TYPE}&BEGIN_CITY_01=${BEGIN_CITY_01}&END_CITY_01=${END_CITY_01}&nombreOrigen=${begCit}&nombreDestino=${endCit}&BEGIN_DAY_01=${BEGIN_DAY_01}&BEGIN_MONTH_01=${BEGIN_YEAR_01}${BEGIN_MONTH_01}&BEGIN_YEAR_01=${BEGIN_YEAR_01}&END_DAY_01=${END_DAY_01}&END_MONTH_01=${END_YEAR_01}${END_MONTH_01}&END_YEAR_01=${END_YEAR_01}&FARE_TYPE=${FARE_TYPE}&quadrigam=${quadrigam}&YCD=${YCD}&ADT=${ADT}&YTH=${YTH}&BNN=${BNN}&CHD=${CHD}&INF=${INF}&familianumerosa=`;

			if (marketg !== mercado) {
				parameters += `&fromMarket=${marketg}`;
			}
			if (localeg !== lenguaje) {
				parameters += `&fromLanguage=${localeg}`;
			}

			if (localeg === "es" || localeg === "pt")
				parameters += "&boton=Buscar";
			if (localeg === "en") parameters += "&boton=Search";
			if (localeg === "ca") parameters += "&boton=Cercar";
			if (localeg === "de") parameters += "&boton=Suchen";
			if (localeg === "fr") parameters += "&boton=Rechercher";
			if (localeg === "it") parameters += "&boton=Ricerca";
			if (localeg === "ja") parameters += "&boton=%E6%A4%9C%E7%B4%A2";
			if (localeg === "nl") parameters += "&boton=Zoeken";
			if (localeg === "ru")
				parameters += "&boton=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA";
			if (localeg === "zh") parameters += "&boton=%E6%90%9C%E7%B4%A2";
			parameters += `&bookingMarket=${marketg}`;

			// obtener valor del atributo data-propertyBooking
			const host = $("[data-propertyBooking]").attr(
				"data-propertyBooking"
			);

			window.location.href = `${host + parameters}`;
		}
	});
});

// ----------------- buscador lateral TAB2---------------
$("#searchtab2").on("submit click", (e) => {
	e.preventDefault();
	const i = 2;
	// const modalTitle = $('#tabContainer').attr('data-error');
	let dateinit = false;
	let dateend = false;
	let init = false;
	let end = false;
	let equal = false;
	let date = false;
	if ($(`input#flight_hotel_round_date`).val() !== "") {
		dateinit = $(`#flight_hotel_round_date`).val();
	}
	if ($(`input#flight_hotel_return_date`).val() !== "") {
		dateend = $(`#flight_hotel_return_date`).val();
	}
	if ($(`input#flight_hotel_origin`).val() !== "") {
		init = $(`#flight_hotel_origin`).val();
	} else {
		$("input#flight_hotel_origin")
			.parent()
			.addClass("ibe_form__group--error");
		$("#flight_hotel_origin_validate").removeClass("hidden");
	}
	if ($(`input#flight_hotel_destiny`).val() !== "") {
		end = $(`#flight_hotel_destiny`).val();
	} else {
		$("input#flight_hotel_destiny")
			.parent()
			.addClass("ibe_form__group--error");
		$("#flight_hotel_destiny_validate").removeClass("hidden");
	}
	if (
		$(`input#flight_hotel_origin`).val() !== "" &&
		$(`input#flight_hotel_destiny`).val() !== "" &&
		$(`input#flight_hotel_destiny`).val() !=
			$(`input#flight_hotel_origin`).val()
	) {
		equal = true;
	}
	if (
		$("#flight_hotel_round_date").val() != "" ||
		$("#flight_hotel_return_date").val() != ""
	) {
		date = true;
	}

	if (!date) {
		$("#date_hotel_validation").parent().addClass("ibe_form__group--error");
		$("#date_hotel_validation").removeClass("hidden");
	}
	if (
		dFrontJs.ibe_validations_searcher.validateSearcher() &&
		dateinit !== false &&
		dateend !== false &&
		init !== false &&
		end !== false &&
		equal !== false
	) {
		const host = $searchCont.attr("data-url-bahEndpoint");
		// const appliesOMB = false;
		// const splitEndCity = false;
		// const initializedOMB = true;
		/* let flexible = 'false';
		if ($(`#flexible1${i}`).is(':checked')) {
			flexible = 'true';
		} */
		const textendcity = $(`#flight_hotel_destiny`)[0].value.replace(
			"&amp;",
			"&"
		);
		const BEGIN_CITY_01 = $(`#flight_hotel_origin`)[0]
			.value.split("(")[1]
			.substring(0, 3);
		const END_CITY_01 = textendcity.split("(")[1].substring(0, 3);

		const Begindate = $(`#flight_hotel_round_date`).val();
		// Genera error en el init.js que no esté con new date
		// Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos
		const $searccalen = $(
			"#searcher-calendar-end-2 [data-function='cal-end']"
		);
		const $hasdate = $(".hasDatepicker");
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", new Date(Begindate));
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", Begindate);
		let searGetDate = $searccalen.datepicker("getDate");
		const BEGIN_DAY_01 = dateinit.split("/")[0];
		const BEGIN_MONTH_01 = dateinit.split("/")[1];
		const BEGIN_YEAR_01 = dateinit.split("/")[2];

		
		let arrayCitiesOr;
		arrayCitiesOr = JSON.parse(sessionStorage.getItem("ibe-wcs-cities-location"))["V-O"];
		const objorigin = getCityListInformation(arrayCitiesOr, BEGIN_CITY_01);
		const BEGIN_COUNTRY = objorigin ? objorigin.country.code : undefined;
		const objdestination = getCityListInformation(destinationHJSON, END_CITY_01, null, textendcity.split(' (')[0]);
		const codeBAH = objdestination ? objdestination.locationId : undefined;
		const Enddate = $(`#flight_hotel_return_date`).val();
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", new Date(Enddate));
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", Enddate);
		searGetDate = $searccalen.datepicker("getDate");
		const END_DAY_01 = dateend.split("/")[0];
		const END_MONTH_01 = dateend.split("/")[1];
		const END_YEAR_01 = dateend.split("/")[2];

		const FARE_TYPE = $(`#tarifa2 option:selected`).val();
		let adult = ["adult_1", "adult_2", "adult_3", "adult_4"];
		let children = ["children_1", "children_2", "children_3", "children_4"];
		let baby = ["baby_1", "baby_2", "baby_3", "baby_4"];
		let hotelChildrenAge = [
			"hotel_children_age_1",
			"hotel_children_age_2",
			"hotel_children_age_3",
			"hotel_children_age_4",
		];
		for (let numAux = 0; numAux < 4; numAux++) {
			adult[numAux] = $(`#adult_${numAux + 1} option:selected`).val();
			children[numAux] =
				$(`#children_${numAux + 1} option:selected`).val() == ""
					? 0
					: $(`#children_${numAux + 1} option:selected`).val();
			baby[numAux] =
				$(`#baby_${numAux + 1} option:selected`).val() == ""
					? 0
					: $(`#baby_${numAux + 1} option:selected`).val();
			hotelChildrenAge[numAux] = "";
			if (typeof children[numAux] !== "undefined") {
				$(`select[id^="room_children_${numAux + 1}-"]`).each(
					function ech() {
						hotelChildrenAge[numAux] += `${$(this).val()}##`;
					}
				);
			}
		}
		if (!adult[0]) {
			// There is no lastsearchcookie and the user click search without checking passengers/rooms
			adult[0] = "2";
		}
		if (children[0] == undefined) {
			children[0] = "0";
		}
		if (baby[0] == undefined) {
			baby[0] = "0";
		}

		let rooms;
		if ($("#flight_hotel_room").length > 0) {
			rooms = $("#flight_hotel_room").val().charAt(0);
		} else {
			rooms = $("#rooms option:selected").val();
		}

		// Vuelos+Hotel
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename: "IB_SE/CacheControl0s/Seeker/SeekerCipher",
				quadrigram: "IBHMPA",
				bahType: "Hotel",
				host,
				language: localeg,
				bahSourcedomain: $searchCont.attr("data-inte-integrationHost"),
				market: marketg,
				BEGIN_CITY_01,
				END_CITY_01,
				handbackUrl:
					$searchCont.attr("data-inte-integrationHost") +
					$searchCont.attr("data-url-handbackUrl"),
				handbackSecureUrl:
					$searchCont.attr("data-inte-integrationHost") +
					$searchCont.attr("data-url-handbackUrl"),
				adult_1: adult[0],
				adult_2: adult[1],
				adult_3: adult[2],
				adult_4: adult[3],
				children_1: children[0],
				children_2: children[1],
				children_3: children[2],
				children_4: children[3],
				baby_1: baby[0],
				baby_2: baby[1],
				baby_3: baby[2],
				baby_4: baby[3],
				BEGIN_DAY_01,
				BEGIN_YEAR_01,
				BEGIN_MONTH_01,
				END_DAY_01,
				END_YEAR_01,
				END_MONTH_01,
				FARE_TYPE,
				BEGIN_COUNTRY,
				hotel_children_age_1: hotelChildrenAge[0],
				hotel_children_age_2: hotelChildrenAge[1],
				hotel_children_age_3: hotelChildrenAge[2],
				hotel_children_age_4: hotelChildrenAge[3],
				codeBAH,
				flight_hotel_room: rooms,
				FareSearch: "true", // Is a param for SHAPE, security in Flows
				d: "",
			},
			success(data) {
				const roomsDesc = [];
				let auxRoom;
				let auxAges;
				for (let iAux = 1; iAux <= +rooms; iAux += 1) {
					auxAges = hotelChildrenAge[iAux].split("##");
					auxAges.pop();
					auxRoom = {
						adults: adult[iAux],
						childAges: auxAges,
						babies: baby[iAux],
					};
					roomsDesc.push(auxRoom);
				}
				const BAH_HOTEL = codeBAH;

				const parsePassenger = (rooms, type) => {
					let total = 0;
					for (let index = 0; index < rooms.length; index++) {
						if (type !== "children") {
							total += parseInt(rooms[index][type], 10);
						} else {
							total += parseInt(
								rooms[index]["childAges"].length,
								10
							);
						}
					}
					return total;
				};
				const lastSearch = {
					iataOrigen: BEGIN_CITY_01,
					iataDestino: END_CITY_01,
					fechaIda: {
						day: BEGIN_DAY_01.toString(),
						month: BEGIN_MONTH_01.toString(),
						year: BEGIN_YEAR_01.toString(),
					},
					fechaVuelta: {
						day: END_DAY_01.toString(),
						month: END_MONTH_01.toString(),
						year: END_YEAR_01.toString(),
					},
					tarifa: FARE_TYPE,
					rooms: parseInt(rooms, 10),
					roomsDesc,
					bah: BAH_HOTEL,
					adultos: parsePassenger(roomsDesc, "adults"),
					niños: parsePassenger(roomsDesc, "children"),
					bebes: parsePassenger(roomsDesc, "babies"),
					senior: 0,
					joven: 0,
				};
				updateLastSearches(lastSearch);

				const CookieSeekerVal = `${BEGIN_CITY_01}|${END_CITY_01}|${BEGIN_DAY_01}|${BEGIN_MONTH_01}|${BEGIN_YEAR_01}|${END_DAY_01}|${END_MONTH_01}|${END_YEAR_01}||||||||${FARE_TYPE}|||${rooms}|${JSON.stringify(
					roomsDesc
				)}|${BAH_HOTEL}||`;
				Cookies.set("IBERIACOM_LAST_SEARCH", CookieSeekerVal, {
					path: "/",
					expires: 365,
					sameSite: "strict",
				});

				// Send form
				const formElement = document.createElement("form");
				$(formElement)
					.attr("action", host)
					.attr("method", "POST")
					.attr("id", "form_VH");
				const inputElement = document.createElement("input");
				$(inputElement)
					.attr("name", "ENCRYPT_STRING")
					.attr("type", "hidden")
					.attr("value", data);
				$("body").append(formElement);
				$("#form_VH").append(inputElement);
				$("#form_VH").submit();
			},
		});
	}
});

// ----------------- buscador lateral TAB3---------------
$("#searchtab3").on("submit click", (e) => {
	e.preventDefault();
	let dateinit = false;
	let dateend = false;
	let init = false;
	let end = false;
	let equal = false;
	let date = false;
	let TRIP_TYPE;

	if ($(`input#flight_car_round_date`).val() !== "") {
		dateinit = $(`#flight_car_round_date`).val();
	}
	if ($(`input#flight_car_return_date`).val() !== "") {
		dateend = $(`#flight_car_return_date`).val();
	}
	if ($(`input#flight_car_origin`).val() !== "") {
		init = $(`#flight_car_origin`).val();
	} else {
		$("input#flight_car_origin")
			.parent()
			.addClass("ibe_form__group--error");
		$("#flight_car_origin_validate").removeClass("hidden");
	}
	if ($(`input#flight_car_destiny`).val() !== "") {
		end = $(`#flight_car_destiny`).val();
	} else {
		$("input#flight_car_destiny")
			.parent()
			.addClass("ibe_form__group--error");
		$("#flight_car_destiny_validate").removeClass("hidden");
	}
	if (
		$(`input#flight_car_origin`).val() !== "" &&
		$(`input#flight_car_destiny`).val() !== "" &&
		$(`input#flight_car_destiny`).val() !=
			$(`input#flight_car_origin`).val()
	) {
		equal = true;
	}

	if ($("#flexible5").is(":checked")) {
		TRIP_TYPE = "2";
	} else {
		TRIP_TYPE = "1";
	}
	if (
		($("#flight_car_round_date").val() != "" &&
			$("#flight_return_date").val() != "") ||
		($("#flight_car_round_date").val() != "" && TRIP_TYPE == 1)
	) {
		date = true;
	}

	if (!date) {
		$("#date_car_validation").parent().addClass("ibe_form__group--error");
		$("#date_car_validation").removeClass("hidden");
	}

	if (
		(dFrontJs.ibe_validations_searcher.validateSearcher() &&
			dateinit !== false &&
			(dateend !== false || TRIP_TYPE === "1") &&
			init !== false &&
			end !== false &&
			equal != false,
		date != false)
	) {
		const host = $searchCont.attr("data-url-bahEndpoint");

		const textendcity = $(`#flight_car_destiny`)[0].value.replace(
			"&amp;",
			"&"
		);
		const BEGIN_CITY_01 = $(`#flight_car_origin`)[0]
			.value.split("(")[1]
			.substring(0, 3);
		const END_CITY_01 = textendcity.split("(")[1].substring(0, 3);

		const Begindate = $(`#flight_car_round_date`).val();
		// Genera error en el init.js que no esté con new date
		// Si se quita no hace efecto el formato de fecha. Necesitan estar los dos casos.
		const $hasdate = $(".hasDatepicker");
		const $searccalen = $(
			"#searcher-calendar-end-3 [data-function='cal-end']"
		);
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", new Date(Begindate));
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", Begindate);
		let searGetDate = $searccalen.datepicker("getDate");
		const BEGIN_DAY_01 = dateinit.split("/")[0];
		const BEGIN_MONTH_01 = dateinit.split("/")[1];
		const BEGIN_YEAR_01 = dateinit.split("/")[2];
		
		let arrayCitiesOr;
		arrayCitiesOr = JSON.parse(sessionStorage.getItem("ibe-wcs-cities-location"))["V-O"];
		const objorigin = getCityListInformation(arrayCitiesOr, BEGIN_CITY_01);
		const BEGIN_COUNTRY = objorigin ? objorigin.country.code : undefined;
	
		const objdestination = getCityListInformation(destinationCJSON, END_CITY_01, null, textendcity.split(' (')[0]);
		const codeBAH = objdestination ? objdestination.locationId : undefined;

		const Enddate = $(`#flight_car_return_date`).val();
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", new Date(Enddate));
		$searccalen
			.datepicker({
				dateFormat: $hasdate.attr("data-format"),
			})
			.datepicker("setDate", Enddate);
		searGetDate = $searccalen.datepicker("getDate");
		const END_DAY_01 = dateend.split("/")[0];
		const END_MONTH_01 = dateend.split("/")[1];
		const END_YEAR_01 = dateend.split("/")[2];

		const FARE_TYPE = $(`#tarifa3 option:selected`).val();
		const ADT = $(`#adult3`).html();
		const CHD = $(`#infants3`).html();
		const INF = $(`#babys3`).html();

		// Recuperar edades de los ninios
		const carChildrenAge = [
			"car_children_age_1",
			"car_children_age_2",
			"car_children_age_3",
			"car_children_age_4",
			"car_children_age_5",
			"car_children_age_6",
			"car_children_age_7",
			"car_children_age_8",
		];
		let num = 0;
		for (num = 0; num < 8; num += 1) {
			carChildrenAge[num] = $(`#Vchildren_${num} option:selected`).val();
			if (carChildrenAge[num] !== undefined) {
				const pos = carChildrenAge[num].charAt(0);
				if (pos === "0") {
					carChildrenAge[num] = carChildrenAge[num].replace("0", "");
				}
			} else {
				carChildrenAge[num] = "";
			}
		}

		// Vuelos+coche
		$.ajax({
			method: "GET",
			url: "/cs/Satellite",
			data: {
				pagename: "IB_SE/CacheControl0s/Seeker/SeekerCipher",
				quadrigram: "IBHMPA",
				bahType: "Car",
				host,
				language: localeg,
				bahSourcedomain: $searchCont.attr("data-inte-integrationHost"),
				market: marketg,
				BEGIN_CITY_01,
				END_CITY_01,
				handbackUrl:
					$searchCont.attr("data-inte-integrationHost") +
					$searchCont.attr("data-url-handbackUrl"),
				handbackSecureUrl:
					$searchCont.attr("data-inte-integrationHost") +
					$searchCont.attr("data-url-handbackUrl"),
				adult_1: ADT,
				children_1: CHD,
				baby_1: INF,
				BEGIN_DAY_01,
				BEGIN_YEAR_01,
				BEGIN_MONTH_01,
				END_DAY_01,
				END_YEAR_01,
				END_MONTH_01,
				FARE_TYPE,
				codeBAH,
				BEGIN_COUNTRY,
				CAR_CHILD_AGE_1: carChildrenAge[0],
				CAR_CHILD_AGE_2: carChildrenAge[1],
				CAR_CHILD_AGE_3: carChildrenAge[2],
				CAR_CHILD_AGE_4: carChildrenAge[3],
				CAR_CHILD_AGE_5: carChildrenAge[4],
				CAR_CHILD_AGE_6: carChildrenAge[5],
				CAR_CHILD_AGE_7: carChildrenAge[6],
				CAR_CHILD_AGE_8: carChildrenAge[7],
				FareSearch: "true", // Is a param for SHAPE, security in Flows
				d: "",
			},
			success(data) {
				const BAH_CAR = codeBAH;
				const AGE_ARRAY = [
					carChildrenAge[0],
					carChildrenAge[1],
					carChildrenAge[2],
					carChildrenAge[3],
					carChildrenAge[4],
					carChildrenAge[5],
					carChildrenAge[6],
					carChildrenAge[7],
				];
				for (let iAux = AGE_ARRAY.length - 1; iAux >= 0; iAux -= 1) {
					if (AGE_ARRAY[iAux] === "") {
						AGE_ARRAY.pop();
					} else if (AGE_ARRAY[iAux].length < 2) {
						AGE_ARRAY[iAux] = `0${AGE_ARRAY[iAux]}`;
					}
				}
				const lastSearch = {
					iataOrigen: BEGIN_CITY_01,
					iataDestino: END_CITY_01,
					fechaIda: {
						day: BEGIN_DAY_01.toString(),
						month: BEGIN_MONTH_01.toString(),
						year: BEGIN_YEAR_01.toString(),
					},
					fechaVuelta: {
						day: END_DAY_01.toString(),
						month: END_MONTH_01.toString(),
						year: END_YEAR_01.toString(),
					},
					adultos: parseInt(ADT, 10),
					niños: parseInt(CHD, 10),
					senior: 0,
					joven: 0,
					ageArray: AGE_ARRAY,
					bebes: parseInt(INF, 10),
					tarifa: FARE_TYPE,
					bah: BAH_CAR,
				};
				updateLastSearches(lastSearch);
				const CookieSeekerVal = `${BEGIN_CITY_01}|${END_CITY_01}|${BEGIN_DAY_01}|${BEGIN_MONTH_01}|${BEGIN_YEAR_01}|${END_DAY_01}|${END_MONTH_01}|${END_YEAR_01}||${ADT}|${CHD}|${AGE_ARRAY}|${INF}|||${FARE_TYPE}|||||${BAH_CAR}||`;
				Cookies.set("IBERIACOM_LAST_SEARCH", CookieSeekerVal, {
					path: "/",
					expires: 365,
					sameSite: "strict",
				});

				// Send form
				const formElement = document.createElement("form");
				$(formElement)
					.attr("action", host)
					.attr("method", "POST")
					.attr("id", "form_VC");
				const inputElement = document.createElement("input");
				$(inputElement)
					.attr("name", "ENCRYPT_STRING")
					.attr("type", "hidden")
					.attr("value", data);
				$("body").append(formElement);
				$("#form_VC").append(inputElement);
				$("#form_VC").submit();
			},
		});
	}
});