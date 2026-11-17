/**
 * Mapa google maps
 * @constructor
 * @author emalpica
 * @description Inyecta ubicaciones a traves de un array de objetos dentro de un
 * @param {string}  (idFrameMap, dataMarket, locate, zoom);
 * @param {string} [mapId="idFrameMap"] - Id de frame/div donde se inyecta el mapa
 * @param {string} size - Tamaño del mapa: small - medium - big
 * @param {array} [{
 * 	titulo: Titulo del marker,
 *  content: contenido html,
 *  lat: latitud,
 *  long: longitud,
 *  locate: diferenciador de marker,
 *  icon: color de icono del marker
 * }]
 * @returns {function} dFrontJs.ibe_google_map.init()
 * @example dFrontJs.ibe_google_map.init()
 */
dFrontJs.ibe_google_map = (function () {
	var infowindow;
	var map;
	var divMap;
	var markers = {};
	var size;
	var position;
	var data;

	var init = function (mapId, dataMap, zoom, positionMap, sizes) {
		data = dataMap;
		divMap = document.getElementById(mapId);
		size = sizes;
		position = positionMap;
		_resizeMap(size, divMap);
		// paint params in google maps.
		var origin = new google.maps.LatLng(position.lat, position.long);
		var mapOptions = {
			zoom: zoom ? zoom : 12,
			center: origin,
		};

		// Inyect map in the DOM element (for id).
		map = new google.maps.Map(document.getElementById(mapId), mapOptions);
		infowindow = new google.maps.InfoWindow();
		// Insert the makers.
		markerFunc(map, data, markers, infowindow);

		//add activity map
		// window.deleteActivityMap = function (id) {
		// 	// console.log("deleteActivityMap");
		// 	deleteActivity(id);
		// };
		// window.addActivityMap = function (id) {
		// 	// console.log("addActivityMap");

		// 	addActivity(id);
		// };
	};

	var _resizeMap = function (sizeMap, divMap) {
		if (sizeMap == "small") {
			divMap.classList.add("ibe-google-map--responsive-height");
			divMap.classList.add("ibe-google-map--small");
		}
		if (sizeMap == "medium") {
			divMap.classList.add("ibe-google-map--medium");
		}
		if (sizeMap == "big") {
			divMap.classList.add("ibe-google-map--big");
		}
	};

	var _constructorContent = function (dataMap, i) {
		data = dataMap;
		var content =
			data && data[i].content
				? data[i].content
				: function () {
						//catch id item and cloneDOM
				  };
		return content;
	};

	var markerFunc = function (map, dataMap, markers) {
		data = dataMap;
		var base_url = window.location.origin;
		for (let i = 0; i < data.length; i++) {
			var position = new google.maps.LatLng(data[i].lat, data[i].long);
			var marker = new google.maps.Marker({
				title: data[i].title,
				position: position,
				map: map,
				icon: {
					url:
						base_url +
						"/wcs/imagenes/maps/pin-" +
						data[i].icon +
						".png",
					labelOrigin: new google.maps.Point(15, 10),
				},
				optimized: true,
				// zIndex : 01245,
				// label: {
				// 	text: 'sersaf',
				// 	className: 'marker-label',

				// },
				id: data[i].id,
				clickable: true,
			});
			google.maps.event.addListener(
				marker,
				"click",
				(function (event, i) {
					map.panTo(event.getPosition());
					return function () {
						infowindow.setContent(_constructorContent(data, i));
						infowindow.setOptions({ maxWidth: 232 });
						infowindow.open(map, event);
						if (data[i].modal && data[i].modal !== "") {
							rebuildModal();
						}
					};
				})(marker, i)
			);

			markers[data[i].locate] = marker;
		}
		if (size == "small") {
			google.maps.event.addListener(
				map,
				"bounds_changed",
				onBoundsChanged
			);
		}
	};

	function onBoundsChanged(map, divMap) {
		if (
			map.getDiv().firstChild.clientHeight === window.innerHeight &&
			map.getDiv().firstChild.clientWidth === window.innerWidth
		) {
			if (
				divMap.classList.contains("ibe-google-map--responsive-height")
			) {
				divMap.classList.remove("ibe-google-map--responsive-height");
			}
		} else {
			if (
				!divMap.classList.contains("ibe-google-map--responsive-height")
			) {
				divMap.classList.add("ibe-google-map--responsive-height");
			}
		}
	}

	// Sets the map on all markers in the array.
	function setMapOnAll(map) {
		var i;
		markers = [];
		for (i = 0; i < markers.length; i++) {
			markers[i].setMap(map);
		}
	}

	var update = function (mapId, dataMap, zoom, positionMap, sizeMap) {
		data = dataMap;
		if (positionMap && positionMap != "") {
			position = positionMap;
		}
		var origin = new google.maps.LatLng(position.lat, position.long);
		if (sizeMap && sizeMap != "") {
			size = sizeMap;
		}
		divMap = document.getElementById(mapId);
		_resizeMap(size, divMap);
		var mapOptions = {
			zoom: zoom ? zoom : 12,
			center: origin,
		};
		map = new google.maps.Map(divMap, mapOptions);
		setMapOnAll(null);
		markerFunc(map, data, markers);
	};

	function rebuildModal() {
		// reinit the modal function.
		dFrontJs.ibe_modal.init();
	}

	var changeDataMaker = function (
		idMap,
		dataMap,
		zoom,
		positionMap,
		sizeMap,
		idItem,
		action,
		updateVar
	) {
		var updateList = [];
		var dataUpdateList = [];

		var e;
		var parser = new DOMParser();
		for (e = 0; e < dataMap.length; e++) {
			if (dataMap[e].id == idItem) {
				var doc = parser.parseFromString(
					dataMap[e].content,
					"text/html"
				);
				var tempContent = $(doc.body)[0];
				if (action == "delete") {
					// console.log('tempContent',tempContent.querySelector(".ibe-card-guides__link-delete"));

					tempContent
						.querySelector(".ibe-card-guides__link-delete")
						.classList.add("hidden");
					if (
						tempContent.querySelector(
							".ibe-card-guides__link-add, hidden"
						) != null
					) {
						tempContent
							.querySelector(".ibe-card-guides__link-add")
							.removeAttribute("hidden");
					}
					if (
						tempContent.querySelector(
							".ibe-card-guides__link-add.hidden"
						) != null
					) {
						tempContent
							.querySelector(".ibe-card-guides__link-add")
							.classList.remove("hidden");
					}
				}
				if (action == "add") {
					// console.log('tempContent',tempContent.querySelector(".ibe-card-guides__link-add"));

					tempContent
						.querySelector(".ibe-card-guides__link-add")
						.classList.add("hidden");
					if (
						tempContent.querySelector(
							".ibe-card-guides__link-delete , hidden"
						) != null
					) {
						tempContent
							.querySelector(".ibe-card-guides__link-delete")
							.removeAttribute("hidden");
					}
					if (
						tempContent.querySelector(
							".ibe-card-guides__link-delete.hidden"
						) != null
					) {
						tempContent
							.querySelector(".ibe-card-guides__link-delete")
							.classList.remove("hidden");
					}
				}
				var newContent =
					tempContent.querySelector("[data-card-guides]");
				dataMap[e].content = newContent.outerHTML;
			}
			updateList.push(dataMap[e]);
		}
		markers = [];
		dataUpdateList = updateList;
		if(updateVar){update(idMap, updateList, zoom, positionMap, sizeMap);}
		return dataUpdateList;
	};

	return {
		init: init,
		markerFunc: markerFunc,
		update: update,
		changeDataMaker: changeDataMaker,
	};
})(jQuery);
