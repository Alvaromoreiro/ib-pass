describe('ibMmbInvoiceInformationComponent test', function () {
    var $componentController, $rootScope, $scope, controller, localStorageService, $window, $q, GetStatesListService, GetCountriesListService;

    var fakeAppConstants = { INVOICE_DATA_TYPE: { PARTICULAR : 'PARTICULAR'},  QUADRIGAM: {INVOICE_SUMMARY: 'test'}};

    var fakeGetStatesListService = {
        getStatesList: jasmine.createSpy(),
    };

    var fakeGetCountriesListService = {
        getCountriesList: jasmine.createSpy()
    };

    var fakePassengersInfo = [
        {
          "passengerType": "ADULT",
          "personalInfo": {
            "name": "MANOLO",
            "surname": "CABEZABOLO",
            "birthDate": null
          },
          "passengerId": "ADULT_01",
          "relatedPassengerId": "",
          "ckiStatus": null,
          "optionalInformation": [],
          "residenceAccreditationStatus": null,
          "resiberPassengerId": "1",
          "securityInformation": {
            "relatedContent": [
              {
                "key": "APIS_DOCUMENT_INFO",
                "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
              },
              {
                "key": "APIS_STATUS_INFO",
                "value": "Completar"
              }
            ]
          },
          "externalPersonalInfo": {
            "name": "Manolo",
            "firstSurname": "Cabezabolo",
            "lastSurname": ""
          }
        }
    ];

    var fakePassengersInfo2 = [
        {
          "passengerType": "ADULT",
          "personalInfo": {
            "name": "MANOLO",
            "surname": "CABEZABOLO",
            "birthDate": null
          },
          "passengerId": "ADULT_01",
          "relatedPassengerId": "",
          "ckiStatus": null,
          "optionalInformation": [],
          "residenceAccreditationStatus": null,
          "resiberPassengerId": "1",
          "securityInformation": {
            "relatedContent": [
              {
                "key": "APIS_DOCUMENT_INFO",
                "value": "Ya has proporcionado la información anticipada de pasajeros, si lo deseas puedes modificarla ahora mismo online"
              },
              {
                "key": "APIS_STATUS_INFO",
                "value": "Completar"
              }
            ]
          }
        }
    ];

    var fakeCountriesList = [
                {
                    "code": "AF",
                    "description": "Afganistán",
                    "isoCode": "AFG"
                },
                {
                    "code": "AL",
                    "description": "Albania",
                    "isoCode": "ALB"
                },
                {
                    "code": "DE",
                    "description": "Alemania",
                    "isoCode": "DEU"
                },
                {
                    "code": "AD",
                    "description": "Andorra",
                    "isoCode": "AND"
                },
                {
                    "code": "AO",
                    "description": "Angola",
                    "isoCode": "AGO"
                },
                {
                    "code": "AI",
                    "description": "Anguilla",
                    "isoCode": "AIA"
                },
                {
                    "code": "AQ",
                    "description": "Antártida",
                    "isoCode": "ATA"
                },
                {
                    "code": "AG",
                    "description": "Antigua y Barbuda",
                    "isoCode": "ATG"
                },
                {
                    "code": "AN",
                    "description": "Antillas Holandesas",
                    "isoCode": "ANT"
                },
                {
                    "code": "SA",
                    "description": "Arabia Saudita",
                    "isoCode": "SAU"
                },
                {
                    "code": "DZ",
                    "description": "Argelia",
                    "isoCode": "DZD"
                },
                {
                    "code": "AR",
                    "description": "Argentina",
                    "isoCode": "ARG"
                },
                {
                    "code": "AM",
                    "description": "Armenia",
                    "isoCode": "ARM"
                },
                {
                    "code": "AW",
                    "description": "Aruba",
                    "isoCode": "ABW"
                },
                {
                    "code": "AU",
                    "description": "Australia",
                    "isoCode": "AUS"
                },
                {
                    "code": "AT",
                    "description": "Austria",
                    "isoCode": "AUT"
                },
                {
                    "code": "AZ",
                    "description": "Azerbaiyán",
                    "isoCode": "AZE"
                },
                {
                    "code": "BS",
                    "description": "Bahamas",
                    "isoCode": "BHS"
                },
                {
                    "code": "BH",
                    "description": "Bahrain",
                    "isoCode": "BHR"
                },
                {
                    "code": "BD",
                    "description": "Bangladesh",
                    "isoCode": "BGD"
                },
                {
                    "code": "BB",
                    "description": "Barbados",
                    "isoCode": "BRB"
                },
                {
                    "code": "BE",
                    "description": "Bélgica",
                    "isoCode": "BEL"
                },
                {
                    "code": "BZ",
                    "description": "Belice",
                    "isoCode": "BLZ"
                },
                {
                    "code": "BJ",
                    "description": "Benín",
                    "isoCode": "BEN"
                },
                {
                    "code": "BM",
                    "description": "Bermudas",
                    "isoCode": "BMU"
                },
                {
                    "code": "BY",
                    "description": "Bielorusia",
                    "isoCode": "BLR"
                },
                {
                    "code": "BO",
                    "description": "Bolivia",
                    "isoCode": "BOL"
                },
                {
                    "code": "BA",
                    "description": "Bosnia-Herzegovina",
                    "isoCode": "BIH"
                },
                {
                    "code": "BW",
                    "description": "Botswana",
                    "isoCode": "BWA"
                },
                {
                    "code": "BR",
                    "description": "Brasil",
                    "isoCode": "BRA"
                },
                {
                    "code": "BN",
                    "description": "Brunei",
                    "isoCode": "BRN"
                },
                {
                    "code": "BG",
                    "description": "Bulgaria",
                    "isoCode": "BGR"
                },
                {
                    "code": "BF",
                    "description": "Burkina Faso",
                    "isoCode": "BFA"
                },
                {
                    "code": "BI",
                    "description": "Burundi",
                    "isoCode": "BDI"
                },
                {
                    "code": "BT",
                    "description": "Bután",
                    "isoCode": "BTN"
                },
                {
                    "code": "KH",
                    "description": "Camboya",
                    "isoCode": "KHM"
                },
                {
                    "code": "CM",
                    "description": "Camerún",
                    "isoCode": "CMR"
                },
                {
                    "code": "CA",
                    "description": "Canadá",
                    "isoCode": "CAN"
                },
                {
                    "code": "TD",
                    "description": "Chad",
                    "isoCode": "TCD"
                },
                {
                    "code": "CL",
                    "description": "Chile",
                    "isoCode": "CHL"
                },
                {
                    "code": "CN",
                    "description": "China",
                    "isoCode": "CHN"
                },
                {
                    "code": "CY",
                    "description": "Chipre",
                    "isoCode": "CYP"
                },
                {
                    "code": "CO",
                    "description": "Colombia",
                    "isoCode": "COL"
                },
                {
                    "code": "CG",
                    "description": "Congo",
                    "isoCode": "COG"
                },
                {
                    "code": "CD",
                    "description": "Congo (Rep. Dem.)",
                    "isoCode": "COD"
                },
                {
                    "code": "KP",
                    "description": "Corea Del Norte",
                    "isoCode": "PRK"
                },
                {
                    "code": "KR",
                    "description": "Corea Del Sur",
                    "isoCode": "KOR"
                },
                {
                    "code": "CI",
                    "description": "Costa De Marfil",
                    "isoCode": "CIV"
                },
                {
                    "code": "CR",
                    "description": "Costa Rica",
                    "isoCode": "CRI"
                },
                {
                    "code": "HR",
                    "description": "Croacia",
                    "isoCode": "HRV"
                },
                {
                    "code": "CU",
                    "description": "Cuba",
                    "isoCode": "CUB"
                },
                {
                    "code": "DK",
                    "description": "Dinamarca",
                    "isoCode": "DNK"
                },
                {
                    "code": "DM",
                    "description": "Dominica",
                    "isoCode": "DMA"
                },
                {
                    "code": "EC",
                    "description": "Ecuador",
                    "isoCode": "ECU"
                },
                {
                    "code": "EG",
                    "description": "Egipto",
                    "isoCode": "EGY"
                },
                {
                    "code": "SV",
                    "description": "El Salvador",
                    "isoCode": "SLV"
                },
                {
                    "code": "AE",
                    "description": "Emiratos Arabes Unidos",
                    "isoCode": "ARE"
                },
                {
                    "code": "ER",
                    "description": "Eritrea",
                    "isoCode": "ERI"
                },
                {
                    "code": "SK",
                    "description": "Eslovaquia",
                    "isoCode": "SVK"
                },
                {
                    "code": "SI",
                    "description": "Eslovenia",
                    "isoCode": "SVN"
                },
                {
                    "code": "ES",
                    "description": "España",
                    "isoCode": "ESP"
                },
                {
                    "code": "EE",
                    "description": "Estonia",
                    "isoCode": "EST"
                },
                {
                    "code": "ET",
                    "description": "Etiopía",
                    "isoCode": "ETH"
                },
                {
                    "code": "PH",
                    "description": "Filipinas",
                    "isoCode": "PHL"
                },
                {
                    "code": "FI",
                    "description": "Finlandia",
                    "isoCode": "FIN"
                },
                {
                    "code": "FR",
                    "description": "Francia",
                    "isoCode": "FRA"
                },
                {
                    "code": "GA",
                    "description": "Gabon",
                    "isoCode": "GAB"
                },
                {
                    "code": "GM",
                    "description": "Gambia",
                    "isoCode": "GMB"
                },
                {
                    "code": "GE",
                    "description": "Georgia",
                    "isoCode": "GEO"
                },
                {
                    "code": "GS",
                    "description": "Georgia del Sur e Islas Sandwich",
                    "isoCode": "SGS"
                },
                {
                    "code": "GH",
                    "description": "Ghana",
                    "isoCode": "GHA"
                },
                {
                    "code": "GI",
                    "description": "Gibraltar (Reino Unido)",
                    "isoCode": "GIB"
                },
                {
                    "code": "GR",
                    "description": "Grecia",
                    "isoCode": "GRC"
                },
                {
                    "code": "GD",
                    "description": "Grenada",
                    "isoCode": "GRD"
                },
                {
                    "code": "GL",
                    "description": "Groenlandia",
                    "isoCode": "GRL"
                },
                {
                    "code": "GP",
                    "description": "Guadalupe",
                    "isoCode": "GLP"
                },
                {
                    "code": "GU",
                    "description": "Guam",
                    "isoCode": "GUM"
                },
                {
                    "code": "GT",
                    "description": "Guatemala",
                    "isoCode": "GTM"
                },
                {
                    "code": "GF",
                    "description": "Guayana Francesa",
                    "isoCode": "GUF"
                },
                {
                    "code": "GG",
                    "description": "Guernesey",
                    "isoCode": "GGY"
                },
                {
                    "code": "GN",
                    "description": "Guinea",
                    "isoCode": "GIN"
                },
                {
                    "code": "GW",
                    "description": "Guinea-Bissau",
                    "isoCode": "GNB"
                },
                {
                    "code": "GQ",
                    "description": "Guinea Ecuatorial",
                    "isoCode": "GNQ"
                },
                {
                    "code": "GY",
                    "description": "Guyana",
                    "isoCode": "GUY"
                },
                {
                    "code": "HT",
                    "description": "Haití",
                    "isoCode": "HTI"
                },
                {
                    "code": "NL",
                    "description": "Holanda",
                    "isoCode": "NLD"
                },
                {
                    "code": "HN",
                    "description": "Honduras",
                    "isoCode": "HND"
                },
                {
                    "code": "HK",
                    "description": "Hong Kong",
                    "isoCode": "HKG"
                },
                {
                    "code": "HU",
                    "description": "Hungría",
                    "isoCode": "HUN"
                },
                {
                    "code": "IN",
                    "description": "India",
                    "isoCode": "IND"
                },
                {
                    "code": "IO",
                    "description": "Indias Británicas Occidentales",
                    "isoCode": "IOT"
                },
                {
                    "code": "ID",
                    "description": "Indonesia",
                    "isoCode": "IDN"
                },
                {
                    "code": "IQ",
                    "description": "Irak",
                    "isoCode": "IRQ"
                },
                {
                    "code": "IR",
                    "description": "Irán",
                    "isoCode": "IRN"
                },
                {
                    "code": "IE",
                    "description": "Irlanda",
                    "isoCode": "IRL"
                },
                {
                    "code": "CV",
                    "description": "Isla de Cabo Verde",
                    "isoCode": "CPV"
                },
                {
                    "code": "IM",
                    "description": "Isla de Man",
                    "isoCode": "IMN"
                },
                {
                    "code": "CX",
                    "description": "Isla de Navidad",
                    "isoCode": "CXR"
                },
                {
                    "code": "IS",
                    "description": "Islandia",
                    "isoCode": "ISL"
                },
                {
                    "code": "AX",
                    "description": "Islas Aland",
                    "isoCode": "ALA"
                },
                {
                    "code": "BV",
                    "description": "Islas Bouvet",
                    "isoCode": "BVT"
                },
                {
                    "code": "KY",
                    "description": "Islas Caimán",
                    "isoCode": "CYM"
                },
                {
                    "code": "CC",
                    "description": "Islas Cocos-Keeling",
                    "isoCode": "CCK"
                },
                {
                    "code": "KM",
                    "description": "Islas Comores",
                    "isoCode": "COM"
                },
                {
                    "code": "CK",
                    "description": "Islas Cook",
                    "isoCode": "COK"
                },
                {
                    "code": "FO",
                    "description": "Islas Faroe",
                    "isoCode": "FRO"
                },
                {
                    "code": "FJ",
                    "description": "Islas Fidji",
                    "isoCode": "FJI"
                },
                {
                    "code": "HM",
                    "description": "Islas Heard y Mcdonald",
                    "isoCode": "HMD"
                },
                {
                    "code": "MV",
                    "description": "Islas Maldivas",
                    "isoCode": "MDV"
                },
                {
                    "code": "FK",
                    "description": "Islas Malvinas",
                    "isoCode": "FLK"
                },
                {
                    "code": "MP",
                    "description": "Islas Marianas",
                    "isoCode": "MNP"
                },
                {
                    "code": "MH",
                    "description": "Islas Marshall",
                    "isoCode": "MHL"
                },
                {
                    "code": "MU",
                    "description": "Islas Mauricio",
                    "isoCode": "MUS"
                },
                {
                    "code": "NF",
                    "description": "Islas Norfolk",
                    "isoCode": "NFK"
                },
                {
                    "code": "PN",
                    "description": "Islas Pitcairn",
                    "isoCode": "PCN"
                },
                {
                    "code": "SB",
                    "description": "Islas Salomón",
                    "isoCode": "SLB"
                },
                {
                    "code": "TC",
                    "description": "Islas Turks y Caicos",
                    "isoCode": "TCA"
                },
                {
                    "code": "SJ",
                    "description": "Isla Svalbard y Jan Mayen",
                    "isoCode": "SJM"
                },
                {
                    "code": "VG",
                    "description": "Islas Vírgenes (Británicas)",
                    "isoCode": "VGB"
                },
                {
                    "code": "VI",
                    "description": "Islas Vírgenes (EEUU)",
                    "isoCode": "VIR"
                },
                {
                    "code": "WF",
                    "description": "Islas Wallis y Futuna",
                    "isoCode": "WLF"
                },
                {
                    "code": "IL",
                    "description": "Israel",
                    "isoCode": "ISR"
                },
                {
                    "code": "IT",
                    "description": "Italia",
                    "isoCode": "ITA"
                },
                {
                    "code": "JM",
                    "description": "Jamaica",
                    "isoCode": "JAM"
                },
                {
                    "code": "JP",
                    "description": "Japón",
                    "isoCode": "JPN"
                },
                {
                    "code": "JE",
                    "description": "Jersey",
                    "isoCode": "JEY"
                },
                {
                    "code": "JO",
                    "description": "Jordania",
                    "isoCode": "JOR"
                },
                {
                    "code": "KZ",
                    "description": "Kazajstán",
                    "isoCode": "KAZ"
                },
                {
                    "code": "KE",
                    "description": "Kenia",
                    "isoCode": "KEN"
                },
                {
                    "code": "KG",
                    "description": "Kirguizistán",
                    "isoCode": "KGZ"
                },
                {
                    "code": "KI",
                    "description": "Kiribati",
                    "isoCode": "KIR"
                },
                {
                    "code": "KW",
                    "description": "Kuwait",
                    "isoCode": "KWT"
                },
                {
                    "code": "LA",
                    "description": "Laos",
                    "isoCode": "LAO"
                },
                {
                    "code": "LS",
                    "description": "Lesotho",
                    "isoCode": "LSO"
                },
                {
                    "code": "LV",
                    "description": "Letonia",
                    "isoCode": "LVA"
                },
                {
                    "code": "LB",
                    "description": "Líbano",
                    "isoCode": "LBN"
                },
                {
                    "code": "LR",
                    "description": "Liberia",
                    "isoCode": "LBR"
                },
                {
                    "code": "LY",
                    "description": "Libia",
                    "isoCode": "LBY"
                },
                {
                    "code": "LI",
                    "description": "Liechtenstein",
                    "isoCode": "LIE"
                },
                {
                    "code": "LT",
                    "description": "Lituania",
                    "isoCode": "LTU"
                },
                {
                    "code": "LU",
                    "description": "Luxemburgo",
                    "isoCode": "LUX"
                },
                {
                    "code": "MO",
                    "description": "Macao",
                    "isoCode": "MAC"
                },
                {
                    "code": "MK",
                    "description": "Macedonia",
                    "isoCode": "MKD"
                },
                {
                    "code": "MG",
                    "description": "Madagascar",
                    "isoCode": "MDG"
                },
                {
                    "code": "MY",
                    "description": "Malasia",
                    "isoCode": "MYS"
                },
                {
                    "code": "MW",
                    "description": "Malawi",
                    "isoCode": "MWI"
                },
                {
                    "code": "ML",
                    "description": "Mali",
                    "isoCode": "MLI"
                },
                {
                    "code": "MT",
                    "description": "Malta",
                    "isoCode": "MLT"
                },
                {
                    "code": "MA",
                    "description": "Marruecos",
                    "isoCode": "MAR"
                },
                {
                    "code": "MQ",
                    "description": "Martinica",
                    "isoCode": "MTQ"
                },
                {
                    "code": "MR",
                    "description": "Mauritania",
                    "isoCode": "MRT"
                },
                {
                    "code": "YT",
                    "description": "Mayotte",
                    "isoCode": "MYT"
                },
                {
                    "code": "MX",
                    "description": "México",
                    "isoCode": "MEX"
                },
                {
                    "code": "FM",
                    "description": "Micronesia",
                    "isoCode": "FSM"
                },
                {
                    "code": "MD",
                    "description": "Moldova",
                    "isoCode": "MDA"
                },
                {
                    "code": "MC",
                    "description": "Mónaco",
                    "isoCode": "MCO"
                },
                {
                    "code": "MN",
                    "description": "Mongolia",
                    "isoCode": "MNG"
                },
                {
                    "code": "ME",
                    "description": "Montenegro",
                    "isoCode": "MNE"
                },
                {
                    "code": "MS",
                    "description": "Montserrat",
                    "isoCode": "MSR"
                },
                {
                    "code": "MZ",
                    "description": "Mozambique",
                    "isoCode": "MOZ"
                },
                {
                    "code": "MM",
                    "description": "Myanmar",
                    "isoCode": "MMR"
                },
                {
                    "code": "NA",
                    "description": "Namibia",
                    "isoCode": "NAM"
                },
                {
                    "code": "NR",
                    "description": "Nauru",
                    "isoCode": "NRU"
                },
                {
                    "code": "NP",
                    "description": "Nepal",
                    "isoCode": "NPL"
                },
                {
                    "code": "NI",
                    "description": "Nicaragua",
                    "isoCode": "NIC"
                },
                {
                    "code": "NE",
                    "description": "Níger",
                    "isoCode": "NER"
                },
                {
                    "code": "NG",
                    "description": "Nigeria",
                    "isoCode": "NGA"
                },
                {
                    "code": "NU",
                    "description": "Niue",
                    "isoCode": "NIU"
                },
                {
                    "code": "NO",
                    "description": "Noruega",
                    "isoCode": "NOR"
                },
                {
                    "code": "NC",
                    "description": "Nueva Caledonia",
                    "isoCode": "NCL"
                },
                {
                    "code": "NZ",
                    "description": "Nueva Zelanda",
                    "isoCode": "NZL"
                },
                {
                    "code": "OM",
                    "description": "Omán",
                    "isoCode": "OMN"
                },
                {
                    "code": "ZZ",
                    "description": "Otros Países",
                    "isoCode": "ZZZ"
                },
                {
                    "code": "PK",
                    "description": "Pakistán",
                    "isoCode": "PAK"
                },
                {
                    "code": "PW",
                    "description": "Palau",
                    "isoCode": "PLW"
                },
                {
                    "code": "PA",
                    "description": "Panamá",
                    "isoCode": "PAN"
                },
                {
                    "code": "PG",
                    "description": "Papua Nueva Guinea",
                    "isoCode": "PNG"
                },
                {
                    "code": "PY",
                    "description": "Paraguay",
                    "isoCode": "PRY"
                },
                {
                    "code": "PE",
                    "description": "Perú",
                    "isoCode": "PER"
                },
                {
                    "code": "PF",
                    "description": "Polinesia Francesa",
                    "isoCode": "PYF"
                },
                {
                    "code": "PL",
                    "description": "Polonia",
                    "isoCode": "POL"
                },
                {
                    "code": "PT",
                    "description": "Portugal",
                    "isoCode": "PRT"
                },
                {
                    "code": "PR",
                    "description": "Puerto Rico",
                    "isoCode": "PRI"
                },
                {
                    "code": "QA",
                    "description": "Qatar",
                    "isoCode": "QAT"
                },
                {
                    "code": "GB",
                    "description": "Reino Unido",
                    "isoCode": "GBR"
                },
                {
                    "code": "CF",
                    "description": "República Centroafricana",
                    "isoCode": "CAF"
                },
                {
                    "code": "CZ",
                    "description": "República Checa",
                    "isoCode": "CZE"
                },
                {
                    "code": "DO",
                    "description": "República Dominicana",
                    "isoCode": "DOM"
                },
                {
                    "code": "RE",
                    "description": "Reunión",
                    "isoCode": "REU"
                },
                {
                    "code": "RW",
                    "description": "Ruanda",
                    "isoCode": "RWA"
                },
                {
                    "code": "RO",
                    "description": "Rumania",
                    "isoCode": "ROU"
                },
                {
                    "code": "RU",
                    "description": "Rusia",
                    "isoCode": "RUS"
                },
                {
                    "code": "VC",
                    "description": "S. Vicente y Granadinas",
                    "isoCode": "VCT"
                },
                {
                    "code": "EH",
                    "description": "Sahara Occidental",
                    "isoCode": "ESH"
                },
                {
                    "code": "WS",
                    "description": "Samoa",
                    "isoCode": "WSM"
                },
                {
                    "code": "AS",
                    "description": "Samoa Americana",
                    "isoCode": "ASM"
                },
                {
                    "code": "BL",
                    "description": "San Bartolomé",
                    "isoCode": "BLM"
                },
                {
                    "code": "SM",
                    "description": "San Marino",
                    "isoCode": "SMR"
                },
                {
                    "code": "MF",
                    "description": "San Martín",
                    "isoCode": "GLP"
                },
                {
                    "code": "LC",
                    "description": "Santa Lucía",
                    "isoCode": "LCA"
                },
                {
                    "code": "SN",
                    "description": "Senegal",
                    "isoCode": "SEN"
                },
                {
                    "code": "RS",
                    "description": "Serbia",
                    "isoCode": "SRB"
                },
                {
                    "code": "SC",
                    "description": "Seychelles",
                    "isoCode": "SYC"
                },
                {
                    "code": "SL",
                    "description": "Sierra Leona",
                    "isoCode": "SLE"
                },
                {
                    "code": "SG",
                    "description": "Singapur",
                    "isoCode": "SGP"
                },
                {
                    "code": "SY",
                    "description": "Siria",
                    "isoCode": "SYR"
                },
                {
                    "code": "SO",
                    "description": "Somalia",
                    "isoCode": "SOM"
                },
                {
                    "code": "LK",
                    "description": "Sri Lanka",
                    "isoCode": "LKA"
                },
                {
                    "code": "KN",
                    "description": "St. Kitts Y Nevis",
                    "isoCode": "KNA"
                },
                {
                    "code": "PM",
                    "description": "St. Pierre y Miquelon",
                    "isoCode": "SPM"
                },
                {
                    "code": "SH",
                    "description": "Sta. Elena",
                    "isoCode": "SHN"
                },
                {
                    "code": "ST",
                    "description": "Sto. Tomé y Príncipe",
                    "isoCode": "STP"
                },
                {
                    "code": "ZA",
                    "description": "Sudáfrica",
                    "isoCode": "ZAF"
                },
                {
                    "code": "SD",
                    "description": "Sudán",
                    "isoCode": "SDN"
                },
                {
                    "code": "SE",
                    "description": "Suecia",
                    "isoCode": "SWE"
                },
                {
                    "code": "CH",
                    "description": "Suiza",
                    "isoCode": "CHE"
                },
                {
                    "code": "SR",
                    "description": "Surinam",
                    "isoCode": "SUR"
                },
                {
                    "code": "SZ",
                    "description": "Swaziland",
                    "isoCode": "SWZ"
                },
                {
                    "code": "TH",
                    "description": "Tailandia",
                    "isoCode": "THA"
                },
                {
                    "code": "TW",
                    "description": "Taiwan",
                    "isoCode": "TWN"
                },
                {
                    "code": "TZ",
                    "description": "Tanzania",
                    "isoCode": "TZA"
                },
                {
                    "code": "TJ",
                    "description": "Tayikistán",
                    "isoCode": "TJK"
                },
                {
                    "code": "TF",
                    "description": "Territorios Franceses",
                    "isoCode": "ATF"
                },
                {
                    "code": "PS",
                    "description": "Territorios Occ. Palestinos",
                    "isoCode": "PSE"
                },
                {
                    "code": "TL",
                    "description": "Timor Oriental",
                    "isoCode": "TLS"
                },
                {
                    "code": "TG",
                    "description": "Togo",
                    "isoCode": "TGO"
                },
                {
                    "code": "TK",
                    "description": "Tokelau",
                    "isoCode": "TKL"
                },
                {
                    "code": "TO",
                    "description": "Tonga",
                    "isoCode": "TON"
                },
                {
                    "code": "TT",
                    "description": "Trinidad y Tobago",
                    "isoCode": "TTO"
                },
                {
                    "code": "TN",
                    "description": "Túnez",
                    "isoCode": "TUN"
                },
                {
                    "code": "TM",
                    "description": "Turkmenistán",
                    "isoCode": "TKM"
                },
                {
                    "code": "TR",
                    "description": "Turquía",
                    "isoCode": "TUR"
                },
                {
                    "code": "TV",
                    "description": "Tuvalu",
                    "isoCode": "TUV"
                },
                {
                    "code": "UM",
                    "description": "U.S. Minor Outlaying Islands",
                    "isoCode": "UMI"
                },
                {
                    "code": "UA",
                    "description": "Ucrania",
                    "isoCode": "UKR"
                },
                {
                    "code": "UG",
                    "description": "Uganda",
                    "isoCode": "UGA"
                },
                {
                    "code": "UY",
                    "description": "Uruguay",
                    "isoCode": "URY"
                },
                {
                    "code": "US",
                    "description": "USA",
                    "isoCode": "USA"
                },
                {
                    "code": "UZ",
                    "description": "Uzbekistán",
                    "isoCode": "UZB"
                },
                {
                    "code": "VU",
                    "description": "Vanuatu",
                    "isoCode": "VUT"
                },
                {
                    "code": "VA",
                    "description": "Vaticano",
                    "isoCode": "VAT"
                },
                {
                    "code": "VE",
                    "description": "Venezuela",
                    "isoCode": "VEN"
                },
                {
                    "code": "VN",
                    "description": "Vietnam",
                    "isoCode": "VNM"
                },
                {
                    "code": "YE",
                    "description": "Yemen",
                    "isoCode": "YEM"
                },
                {
                    "code": "DJ",
                    "description": "Yibuti",
                    "isoCode": "DJI"
                },
                {
                    "code": "ZM",
                    "description": "Zambia",
                    "isoCode": "ZMB"
                },
                {
                    "code": "ZW",
                    "description": "Zimbabue",
                    "isoCode": "ZWE"
                }
            ];

            var fakeMmBModalService = {
                showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
                finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
                showGenericModal: jasmine.createSpy(),
                showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
            };

            function modalFake() {
                return { 'result': { 'then': function () { } } };
            }

    let fakeInvoiceListService = {
        'getInvoiceList': jasmine.createSpy('getInvoiceList').and.callFake(function () {
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        })
    }

    var fakeInvoiceList = [
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0751419175767",
                "date": "2023-07-25",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "MADRID-BILBAO"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@email.com"
            },
            "billingData": {
                "name": "Antonio",
                "surname": "Perez",
                "identityInformation": "56031044P",
                "address": "address1",
                "postalCode": "28001",
                "city": "Madrid",
                "province": "Madrid",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5445516",
                    "date": "2023-07-25",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 0.0,
                    "noSubjectTaxationPrice": 0.0,
                    "vatTaxType": 10.0,
                    "vatTaxAmount": 0.0,
                    "totalFare": 17.0,
                    "totalRates": 20.22,
                    "totalAmount": 0.0
                }
            ]
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267038",
                "date": "2023-07-25",
                "iata": 78496445,
                "office": "IBERIA.COM MAD175 NDC MADRID ES",
                "route": "MADRID-BILBAO"
            },
            "shippingData": {
                "language": "ES",
                "email": "aa@email.com"
            },
            "billingData": {
                "name": "Antonio",
                "surname": "Perez",
                "identityInformation": "56031044P",
                "address": "address1",
                "postalCode": "28001",
                "city": "Madrid",
                "province": "Madrid",
                "country": "España"
            },
            "invoicesPriceDetailDataWebList": [
                {
                    "concept": "EMISION",
                    "number": "5445515",
                    "date": "2023-07-25",
                    "numDuplicates": 0,
                    "currency": "EUR",
                    "subjectTaxationPrice": 0.0,
                    "noSubjectTaxationPrice": 0.0,
                    "vatTaxType": 10.0,
                    "vatTaxAmount": 0.0,
                    "totalFare": 13.0,
                    "totalRates": 0.0,
                    "totalAmount": 0.0
                }
            ]
        },
        {
            "checked": true,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267036",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267037",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        }
    ];

    var fakeListInvoicesResult = [
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267036",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        },
        {
            "checked": false,
            "ticket": {
                "name": "TEST",
                "surname": "TEST",
                "ticketNumber": "0755578267037",
                "date": null,
                "iata": null,
                "office": null,
                "route": null
            },
            "shippingData": null,
            "billingData": null,
            "invoicesPriceDetailDataWebList": null
        }
    ];

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(function () { }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };
    let fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy(),
        'updateSisterCitiesModel': jasmine.createSpy(),
        'generateRequestFlexibilization': jasmine.createSpy()
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST_4'
        },
        DIGITAL_DATA_PROCESS: {
            FACRES: 'test'
        },
        DIGITAL_DATA_STEP: {
            FACRES: 'test'
        },
    }

    var fakeModel = {
        billingData: {
            name: 'Antonio',
            surname: 'Perez',
            identityInformation: '56031044P',
            address: 'address1',
            postalCode: '28001',
            city: null,
            province: null,
            country: null
        },
        shippingData: {
            language: 'ES',
            email: 'aa@email.com'
        }
    };

    var fakeStates = [
        {
          "code": "15",
          "normalizedCode": "15",
          "description": "A Coruña"
        },
        {
          "code": "1",
          "normalizedCode": "01",
          "description": "Alava"
        },
        {
          "code": "2",
          "normalizedCode": "02",
          "description": "Albacete"
        },
        {
          "code": "3",
          "normalizedCode": "03",
          "description": "Alicante"
        },
        {
          "code": "4",
          "normalizedCode": "04",
          "description": "Almería"
        },
        {
          "code": "33",
          "normalizedCode": "33",
          "description": "Asturias"
        },
        {
          "code": "6",
          "normalizedCode": "06",
          "description": "Badajoz"
        },
        {
          "code": "7",
          "normalizedCode": "07",
          "description": "Baleares"
        },
        {
          "code": "8",
          "normalizedCode": "08",
          "description": "Barcelona"
        },
        {
          "code": "9",
          "normalizedCode": "09",
          "description": "Burgos"
        },
        {
          "code": "10",
          "normalizedCode": "10",
          "description": "Caceres"
        },
        {
          "code": "39",
          "normalizedCode": "39",
          "description": "Cantabria"
        },
        {
          "code": "12",
          "normalizedCode": "12",
          "description": "Castellón"
        },
        {
          "code": "51",
          "normalizedCode": "51",
          "description": "Ceuta"
        },
        {
          "code": "13",
          "normalizedCode": "13",
          "description": "Ciudad Real"
        },
        {
          "code": "14",
          "normalizedCode": "14",
          "description": "Cordoba"
        },
        {
          "code": "16",
          "normalizedCode": "16",
          "description": "Cuenca"
        },
        {
          "code": "11",
          "normalizedCode": "11",
          "description": "Cádiz"
        },
        {
          "code": "17",
          "normalizedCode": "17",
          "description": "Gerona"
        },
        {
          "code": "18",
          "normalizedCode": "18",
          "description": "Granada"
        },
        {
          "code": "19",
          "normalizedCode": "19",
          "description": "Guadalajara"
        },
        {
          "code": "20",
          "normalizedCode": "20",
          "description": "Guipuzcoa"
        },
        {
          "code": "21",
          "normalizedCode": "21",
          "description": "Huelva"
        },
        {
          "code": "22",
          "normalizedCode": "22",
          "description": "Huesca"
        },
        {
          "code": "23",
          "normalizedCode": "23",
          "description": "Jaén"
        },
        {
          "code": "26",
          "normalizedCode": "26",
          "description": "La Rioja"
        },
        {
          "code": "35",
          "normalizedCode": "35",
          "description": "Las Palmas"
        },
        {
          "code": "24",
          "normalizedCode": "24",
          "description": "León"
        },
        {
          "code": "27",
          "normalizedCode": "27",
          "description": "Lugo"
        },
        {
          "code": "25",
          "normalizedCode": "25",
          "description": "Lérida"
        },
        {
          "code": "28",
          "normalizedCode": "28",
          "description": "Madrid"
        },
        {
          "code": "52",
          "normalizedCode": "52",
          "description": "Melilla"
        },
        {
          "code": "30",
          "normalizedCode": "30",
          "description": "Murcia"
        },
        {
          "code": "29",
          "normalizedCode": "29",
          "description": "Málaga"
        },
        {
          "code": "31",
          "normalizedCode": "31",
          "description": "Navarra"
        },
        {
          "code": "32",
          "normalizedCode": "32",
          "description": "Orense"
        },
        {
          "code": "34",
          "normalizedCode": "34",
          "description": "Palencia"
        },
        {
          "code": "36",
          "normalizedCode": "36",
          "description": "Pontevedra"
        },
        {
          "code": "37",
          "normalizedCode": "37",
          "description": "Salamanca"
        },
        {
          "code": "38",
          "normalizedCode": "38",
          "description": "Santa Cruz de Tenerife"
        },
        {
          "code": "40",
          "normalizedCode": "40",
          "description": "Segovia"
        },
        {
          "code": "41",
          "normalizedCode": "41",
          "description": "Sevilla"
        },
        {
          "code": "42",
          "normalizedCode": "42",
          "description": "Soria"
        },
        {
          "code": "43",
          "normalizedCode": "43",
          "description": "Tarragona"
        },
        {
          "code": "44",
          "normalizedCode": "44",
          "description": "Teruel"
        },
        {
          "code": "45",
          "normalizedCode": "45",
          "description": "Toledo"
        },
        {
          "code": "46",
          "normalizedCode": "46",
          "description": "Valencia"
        },
        {
          "code": "47",
          "normalizedCode": "47",
          "description": "Valladolid"
        },
        {
          "code": "48",
          "normalizedCode": "48",
          "description": "Vizcaya"
        },
        {
          "code": "49",
          "normalizedCode": "49",
          "description": "Zamora"
        },
        {
          "code": "50",
          "normalizedCode": "50",
          "description": "Zaragoza"
        },
        {
          "code": "5",
          "normalizedCode": "05",
          "description": "Ávila"
        }
    ];

    beforeEach(function () {
        angular.mock.module('ib-MmB-invoice-information-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeAppConstants);
            $provide.value('GetStatesListService', fakeGetStatesListService);
            $provide.value('GetCountriesListService', fakeGetCountriesListService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('InvoiceListService', fakeInvoiceListService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });
        inject(function ( _$componentController_, _$rootScope_, _localStorageService_, _$window_, _$q_, _GetStatesListService_, _GetCountriesListService_) {
            $rootScope = _$rootScope_;
            $componentController = _$componentController_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbInvoiceInformation', { $scope: $scope });
            localStorageService = _localStorageService_;
            $window = _$window_;
            $q = _$q_;
            GetStatesListService = _GetStatesListService_;
            GetCountriesListService = _GetCountriesListService_;
            controller.getInvoiceData = jasmine.createSpy()
        });
    });

    describe('when activate() function is called', function () {
        beforeEach(function () {
            $rootScope.appMarket = 'ES';
            $rootScope.appLang = 'en';
        });

        it('and getCountriesList() resolve promise with passenger externalPersonalInfo', function (done) {
            inject(function ($q) {
                localStorageService.set('passengers', fakePassengersInfo);
                fakeGetCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeCountriesList);
                    return defer.promise;
                });
            });
            controller.$onInit();
            expect(controller.radioSelected).toBe(fakeAppConstants.INVOICE_DATA_TYPE.PARTICULAR);
            expect(controller.showCountrySelect).toBe(true);
            expect(controller.showProvincesSelect).toBe(false);
            GetCountriesListService.getCountriesList().then(function (data) {
                expect(controller.countryTypes).toBe(data);
                done();
            });
            $rootScope.$digest();
        });

        it('and getCountriesList() resolve promise with passenger personalInfo', function (done) {
            inject(function ($q) {
                localStorageService.set('passengers', fakePassengersInfo2);
                fakeGetCountriesListService.getCountriesList = jasmine.createSpy('getCountriesList').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeCountriesList);
                    return defer.promise;
                });
            });
            controller.$onInit();
            expect(controller.radioSelected).toBe(fakeAppConstants.INVOICE_DATA_TYPE.PARTICULAR);
            expect(controller.showCountrySelect).toBe(true);
            expect(controller.showProvincesSelect).toBe(false);
            GetCountriesListService.getCountriesList().then(function (data) {
                expect(controller.countryTypes).toBe(data);
                done();
            });
            $rootScope.$digest();
        });
    });

    describe('when close() function is called', function () {
        it('should set correct values when window is mobile', function () {
            $window.innerWidth = 320;
            controller.listInvoices = fakeInvoiceList;
            controller.close();
            expect(controller.showInvoiceData).toBe(false);
            expect(controller.selectableList).toBe(true);
            expect(controller.listInvoices).toEqual(fakeListInvoicesResult);
        });

        it('should set correct values when window is desktop', function () {
            $window.innerWidth = 1280;
            controller.close();
            expect(controller.showInvoiceData).toBe(false);
            expect(controller.checkRequestInvoice).toBe(false);
            expect(controller.selectableList).toBe(false);
        });
    });

    describe('when updateInvoiceInfo() function is called', function () {
        it('if form is valid, send data, validationError is false', function () {
            controller.invoiceInformationForm = {
                $submitted: true,
                $valid: true
            };
            controller.updateInvoiceInfo();
            expect(controller.validationError).toBe(false);
        });

        it('if form is not valid, no send data, validationError is true', function () {
            controller.invoiceInformationForm = {
                $submitted: true,
                $valid: false
            };
            controller.updateInvoiceInfo();
            expect(controller.validationError).toBe(true);
        });
    });

    describe('when getIsoCode() function is called', function () {
        it('should return country isoCode', function () {
            localStorageService.set('countriesList', fakeCountriesList);
            controller.getIsoCode('ES');
        });
    });

    describe('when getProvinceByCountry() function is called', function () {
        it('it should set correct value properties when have provinces & service reponse is OK', function (done) {
            inject(function ($q) {
                fakeGetStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve(fakeStates);
                    return defer.promise;
                });
            });
            controller.model = fakeModel;
            controller.getProvinceByCountry('ES');
            expect(controller.issuerCountry).toBe('ES');
            expect(controller.statesLiteral).toBe('PROVINCE_FIELD');
            GetStatesListService.getStatesList().then(function (data) {
                expect(controller.showProvincesSelect).toBe(true);
                expect(controller.showProvincesInput).toBe(false);
                expect(controller.provinceTypes).toBe(fakeStates);
                done();
            })
            $rootScope.$digest();
        });

        it('it should set correct value properties when no have provinces & service reponse is OK', function (done) {
            inject(function ($q) {
                fakeGetStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve([]);
                    return defer.promise;
                });
            });
            controller.model = fakeModel;
            controller.getProvinceByCountry('ES');
            expect(controller.issuerCountry).toBe('ES');
            expect(controller.statesLiteral).toBe('PROVINCE_FIELD');
            GetStatesListService.getStatesList().then(function (data) {
                expect(controller.showProvincesSelect ).toBe(false);
                expect(controller.showProvincesInput).toBe(true);
                expect(controller.provinceTypes).toEqual([]);
                done();
            })
            $rootScope.$digest();
        });

        it('it should set correct value properties when no have provinces & service reponse is KO', function (done) {
            inject(function ($q) {
                fakeGetStatesListService.getStatesList = jasmine.createSpy('getStatesList').and.callFake(function () {
                    var defer = $q.defer();
                    defer.reject();
                    return defer.promise;
                });
            });
            controller.model = fakeModel;
            controller.getProvinceByCountry('ES');
            expect(controller.issuerCountry).toBe('ES');
            expect(controller.statesLiteral).toBe('PROVINCE_FIELD');
            GetStatesListService.getStatesList().then(angular.noop, function (error) {
                expect(controller.showProvincesSelect).toBe(false);
                expect(controller.showProvincesInput).toBe(false);
                done();
            })
            $rootScope.$digest();
        });
    });
});
