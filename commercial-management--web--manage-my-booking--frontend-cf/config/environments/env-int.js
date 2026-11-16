(function (window) {
    window.env = window.env || {};
    window.env.services = 'https://int-ibisservices.iberia.com/api';
    window.env.cloud = 'https://int-ibisservices.iberia.com/ancillaries/api';
    window.env.cloudMyIberia = 'https://api.crm.int.priv.aws.iberia.es/cim';
    window.env.cloudCustomerExperience = "https://int-ibisservices.iberia.com/customerexperience";
    window.env.cloudDigitalWeb = "https://int.iberia.com/digitalweb";
    window.env.auth = 'https://int-ibisauth.iberia.com/api';
    window.env.paymentsComponent = 'https://int.iberia.com/pay/webcomponent/v1/build/';
    window.env.otpServices = 'https://int-ibisservices.iberia.com';
    window.env.bffDisruptionSeats = 'https://api.disrupted-seats.int.ancillaries.iberia.com';
    window.env.globalAuthorizationToken = 'Basic aWJlcmlhX3dlYjphOWQ4NjRiZi1jY2Y2LTQwODctYTJmMS1hMzI1YWEyNGIxMWE=';
    window.env.urlEnvironment = window.location.origin + '/';
    window.env.production = false;
    window.env.toggle = {
        decoupleCVV: true,
        deinvoicingActive: true,
        umnrActive: true
    };
}(this));
