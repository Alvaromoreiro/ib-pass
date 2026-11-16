(function (window) {
    window.env = window.env || {};
    window.env.services = 'https://pre-ibisservices.iberia.com/api';
    window.env.cloud = 'https://pre-ibisservices.iberia.com/ancillaries/api';
    window.env.cloudMyIberia = 'https://api.crm.pre.priv.aws.iberia.es/cim';
    window.env.cloudCustomerExperience = "https://pre-ibisservices.iberia.com/customerexperience";
    window.env.cloudDigitalWeb = "https://pre.iberia.com/digitalweb";
    window.env.auth = 'https://pre-ibisauth.iberia.com/api';
    window.env.paymentsComponent = 'https://pre.iberia.com/pay/webcomponent/v1/build/';
    window.env.otpServices = 'https://pre-ibisservices.iberia.com';
    window.env.bffDisruptionSeats = 'https://api.disrupted-seats.ancillaries.pre.iberia.com';
    window.env.globalAuthorizationToken = 'Basic aWJlcmlhX3dlYjphOWQ4NjRiZi1jY2Y2LTQwODctYTJmMS1hMzI1YWEyNGIxMWE=';
    window.env.urlEnvironment = window.location.origin + '/';
    window.env.production = false;
    window.env.toggle = {
        decoupleCVV: true,
        deinvoicingActive: true,
        umnrActive: false
    };
}(this));
