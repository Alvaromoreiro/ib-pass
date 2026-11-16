import { requiredCypressEnv } from '../../support/requiredCypressEnv';
describe('Test - ob', () => {

    beforeEach(() => {
        // MOCK SERVICES
        cy.intercept('POST', '**/identity-digitalboarding.cs81.force.com/**', { statusCode: 200 });
        cy.intercept('POST', '**/NetworkTrackingServlet', { statusCode: 204 });

        cy.intercept('GET', '**/cmlm-mbm/rs/v1/membership', {fixture: 'membership.json'});
        cy.intercept('GET', '**/cmlm-mbm/rs/v1/employees', {fixture: 'employees.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/cities/destination', {fixture: 'cities_destination.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/market/commercialsellingdata', {fixture: 'commercialsellingdata.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/areas/destination', {fixture: 'areas_destination.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/availability', {fixture: 'availability-ob.json'});
        cy.intercept('POST', '**/sse-avm/rs/v2/calendar/ribbon', { fixture: 'ribbon-ob.json' });
        cy.intercept('POST', '**/cmlm-lpm/rs/v1/calculateReward', { fixture: 'calculate-reward.json' });

        cy.intercept('GET', '**/iberia-web-content/literales/booking/es.json', {fixture: 'literals/booking-es.json'});
        cy.intercept('GET', '**/iberia-web-content/literales/general/es.json', {fixture: 'literals/general-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/booking/es.json', {fixture: 'links/booking-es.json'});
        cy.intercept('GET', '**/iberia-web-content/links/general/es.json', {fixture: 'links/general-es.json'});

        cy.intercept('GET', '**/cs/Satellite**', {fixture: 'satellite.json'});
        cy.intercept('POST', '**/api/auth/realms/commercial_platform/protocol/openid-connect/token', { statusCode: 200 });

        cy.intercept('GET', '**/iberia-web-content/imagenes/background/backgrounds.json', {fixture: 'images/backgrounds.json'});
        cy.intercept('GET', '**/iberia-web-content/iconos/aerolineas/aeroLineas.json', {fixture: 'icons/aerolineas.json'});


        cy.intercept('POST', '**/sse-avm/rs/v2/fare', {fixture: 'fare-ob.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/phone-codes', {fixture: 'phone-codes.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/country', {fixture: 'country.json'});
        cy.intercept('GET', '**/framework-services/rs/commons/v1/data/frequent-flyer/companies', {fixture: 'companies.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/**/gdpr', {fixture: 'gdpr.json'});
        cy.intercept('GET', '**/trm-apim/rs/v3/info/**/security?passengerId=ADULT_01', {fixture: 'security.json'});
        cy.intercept('POST', '**/sse-orm/rs/v5/abandoned-shoppingCart/verifyMail', {fixture: 'verify-mail.json'});
        cy.intercept('GET', '**/api/v1/ibv/availability/**/offerId/**', {fixture: 'offerid-ob.json'});

        cy.intercept('POST', '**/rb_bf68025iux**', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v2/order', {fixture: 'order-ob.json'});
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries(\/?\?.*)?/, { fixture: 'ancillaries-ob.json' });
        cy.intercept('GET', /.*\/ass-fass\/rs\/fass\/v5\/.*\/ancillaries-summary(\/?\?.*)?/, {fixture: 'ancillaries-summary.json'});

        cy.intercept('GET', '**/iberia-web-content/iconos/payment/creditcardlogo.json', {fixture: 'icons/creditcardlogo.json'});
        cy.intercept('GET', '**/cdn.nemuru.com/pricings/**', {fixture: 'pricing.json'});

        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/ES/states', {fixture: 'states.json'});
        cy.intercept('GET', '**/payment-methods', {fixture: 'payment-methods.json'});
        cy.intercept('GET', '**/rdu-loc/rs/loc/v1/location/FPIBTASA/gcwcs/?retrieveHTML=yes', {fixture: 'gcwcs.json'});
        cy.intercept('GET', '**/available-donations/**', {fixture: 'available-donations.json'});

        cy.intercept('PUT', '**/iberiapay/api/v2/public/vault/**/credit-card', { fixture: 'credit-card.json'});
        cy.intercept('GET', '**/iberia-web-content/imagenes/cargando/paymentLoading.svg', { statusCode: 200 });
        cy.intercept('GET', '**/cmlm-mbm/rs/v2/payment_card/assigned', { statusCode: 200 });
        cy.intercept('GET', '**/auth/realms/on_business/protocol/openid-connect/token', { statusCode: 200 });

        cy.intercept('POST', '**/sse-orm/rs/v3/issue', {fixture: 'issue.json'});
        cy.intercept('PUT', '**/cust-cust/rs/v2/newsletter', {fixture: 'newsletter.json'});
        cy.intercept('POST', '**/prlm-pc/rs/v1/points/summary-calculation', {fixture: 'summary-calculation.json'});

        cy.intercept('POST', '**/creditCardFee', {fixture: 'creditcardfee.json'});
        cy.intercept('POST', '**/creditCardBin', {fixture: 'creditcardbin.json'});

        cy.intercept('GET', '**/build-recoglobick-activities/**', { statusCode: 200 });
        cy.intercept('GET', '**/build-recoglobick-transfers/**', { statusCode: 200 });
        cy.intercept('POST', '**/payment-methods-info', { fixture: 'payment-methods-info.json'});
    });



    it('one way and one passenger', () => {

        cy.setCookie('IBERIACOM_SSO_ONB_ACCESS', requiredCypressEnv('IBERIACOM_SSO_ONB_ACCESS'));
        cy.setCookie('IBERIACOM_SSO_ONB_REFRESH_TO', '09%2F01%2F2024+15%3A28%3A09');
        cy.setCookie('IBERIACOM_SSO_ONB_ACCESS_TO', '09%2F01%2F2024+15%3A12%3A09');
        cy.setCookie('IBERIACOM_SSO_ONB_REFRESH', requiredCypressEnv('IBERIACOM_SSO_ONB_REFRESH'));


        cy.window().then( win => {
            sessionStorage.setItem('accessTokenSalesforce', requiredCypressEnv('SALESFORCE_ACCESS_TOKEN'));
            sessionStorage.setItem('APP_USER_INFO', '{"appUserInfo":{"logged":true,"userType":"ONB","points":13400},"personalInfo":{"name":"Test","surname":"User","gender":"Male","email":"test@example.com"}}');
            sessionStorage.setItem('accessTokenOB', requiredCypressEnv('ONBOARDING_ACCESS_TOKEN'));
            sessionStorage.setItem('customerDataOB', '{"segmento":11,"rolCIP":"Autorizador","userID":"TEST-USER-001","name":"Test","surname":"User","surnames":"User","email":"test@example.com","preferredLanguage":"ES","puntos":13400,"publicis":"Cuenta De Pruebas Iberia 001","country":"ES","CIF":"TEST0001","EstadoUsuario":"logado_pyme","NivelUsuario":"On1","dataLanguage":"es"}');
            sessionStorage.setItem('anonymousTokenOB', requiredCypressEnv('ONBOARDING_ANONYMOUS_TOKEN'));
            sessionStorage.setItem('ib-booking-app.loginSF', requiredCypressEnv('SALESFORCE_LOGIN_TOKEN'));
            sessionStorage.setItem('ib-booking-app.loggedToken', JSON.stringify(requiredCypressEnv('SALESFORCE_LOGGED_TOKEN')));
            sessionStorage.setItem('ib-booking-app.userLogged', '"ONB"');
            sessionStorage.setItem('ib-booking-app.IberiaUserType', 'null');

            sessionStorage.setItem('ib-booking-app.getMarketOBPoints', 'true');
            sessionStorage.setItem('ib-booking-app.oBDiscountType', 'true');
            sessionStorage.setItem('ib-booking-app.membershipData', '{"clid":"TEST-USER-001","parentClpNumber":null,"companyInfo":{"companyName":"Test Company","companyIdType":"CIF","companyId":"TEST-USER-001","industrySector":"10","marketSegment":null,"address":{"addressLine1":"1 Test Street","addressLine2":"1 Test Street","addressLine3":"1 Test Street","country":"ES","state":"M","zipCode":"00000","city":"Test City"},"contactInfo":{"email":"test@example.com","secondaryEmail":"test@example.com","internationalDiallingCode":"+34","phoneNumber":"0000000000"}},"infoDetailMember":{"memberStatus":"A","blackListedInformation":false,"corporateDealInformation":false,"incompleteData":false,"underAudit":false,"companyIdValidatedFlag":false,"additionalDocumentApproved":false,"additionalDocumentationNeeded":false,"manualValidationCompleted":true,"duplicateAccount":false,"travelAgent":false},"tierStatus":{"status":"On1","expirationDate":null},"memberBalance":13400,"programBaseCurrency":"EUR","termsAndConditionAcceptanceDate":"2019-10-07T04:40:21.000","affiliatedSchemaOperator":"IB","enrollmentInfo":{"source":null,"channel":"W","date":"2019-10-07T00:00:00.000","salesmanCode":null,"refferedByClpNumber":null},"estimatedTotalAnnualAirSpend":{"amount":0,"currency":"EUR"},"numberOfTravelers":"0","mainTravelDestinations":null,"travelPolicy":"NP","bookingBehaviour":"000","amountOfTravel":"1","iberiaCard":{"cardFlag":false,"cardStartDate":null,"cardEndDate":null},"userInfo":{"login":"TEST-USER-001","firstName":"Test","lastName":"User","secondLastName":"User","role":{"code":"I_COMP_AUT","description":"Autorizador"},"email":"test@example.com","phones":[{"type":"HOME","internationDiallingCode":"+34","number":"0000000000","extentionNumber":null}],"status":"A","preferredLanguage":"SPA","jobTitle":"Tester","title":"MR","joinDate":"2019-10-07T00:00:00.000","travelAgentSpecificData":null,"permissionToDiscount":true,"thirdPartyPrivilege":true,"redemptionPermission":true,"userSpecific":{"marketingPermission":{"schemeOperator":false,"thirdParty":false,"channel":{"sms":false,"phone":false,"email":"test@example.com","postal":false}},"otherLoyalty":null,"socialNetwork":null,"identificationDocumentType":null,"identificationDocumentId":null,"businessUnitId":0}},"pointsTransformed":13400,"employees":[]}');


            // sessionStorage.setItem('ib-booking-app.contactData', '{"contactEmail":"foo@foo.bar","contactPhone":"625166563","contactPrefix":"44"}')
            // sessionStorage.setItem('ib-booking-app.contactDetails', '{"email":"foo@foo.bar","phone":{"prefix":"44","number":"625166563"},"countryCode":"GB","address":{"street":"14 WHEATLEY DRIVE","streetNumber":"11","apartment":"21"},"city":"","postalCode":"WF148NW","province":"Aragón","additionalInfo":""}')

            console.log(sessionStorage.getItem('ib-booking-app.userLogged'));
        });

        cy.visit(`${Cypress.env('url')}?market=ES&language=es&appliesOMB=false&splitEndCity=false&initializedOMB=true&flexible=true&TRIP_TYPE=1&BEGIN_CITY_01=MAD&END_CITY_01=BCN&nombreOrigen=Madrid&nombreDestino=Barcelona&BEGIN_DAY_01=22&BEGIN_MONTH_01=202412&BEGIN_YEAR_01=2024&END_DAY_01=&END_MONTH_01=&END_YEAR_01=&FARE_TYPE=R&quadrigam=IBHMPA&ADT=1&CHD=0&INF=0&BNN=0&YTH=0&YCD=0&residentCode=&familianumerosa=&BV_UseBVCookie=no&boton=Buscar&bookingMarket=ES#!/availability`);

        cy.scrollTo(0, 0);
        cy.get('#bbki-slice-info-cabin-0-0-E-btn').click('center');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#IBAIRP_CONTACT_FORM_PHONE').click('top').type('612345678999');
        cy.get('#AVAILABILITY_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.get('#GO_PAYMENTS_CONTINUE_BUTTON').click();

        cy.scrollTo(0, 0);
        cy.iframe('#ibdc-number-frame').find('#number').click('top').type('4012999999999999');
        cy.get('#name').click('top').type('test');
        cy.get('#surnames').click('top').type('test');
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(0).click();
        cy.get('#ui-select-choices-row-1-0').click();
        cy.get('.btn.btn-default.form-control.ui-select-toggle').eq(1).click();
        cy.get('#ui-select-choices-row-2-1').click();
        cy.iframe('#ibdc-cvv-frame').find('#cvv').click('top').type('555');
        cy.get('#check_terms_conditions_span').click('topLeft');
        cy.get('#pmt-total-price-pay-btn').click();

        cy.scrollTo(0, 0);
        cy.get('#CONFIRM_ORDER_MESSAGE').contains('La reserva se ha realizado correctamente');
    });
});
