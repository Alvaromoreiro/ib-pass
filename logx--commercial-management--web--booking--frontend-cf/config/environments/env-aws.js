(function (window) {
    window.env = window.env || {};
    window.env.servicesHost = '${AWS_ENV_IBIS_CLOUD_SERVICES_HOST}';
    window.env.services = '${AWS_ENV_IBIS_CLOUD_SERVICES}';
    window.env.cloud = '${AWS_ENV_ANCILLARIES_LEGACY_CLOUD_SERVICES}';
    window.env.cloudMyIberia = '${AWS_MY_IBERIA_CLOUD_SERVICES}';
    window.env.paymentsComponent = '${AWS_PAYMENT_COMPONENT_ENDPOINT}';
    window.env.auth = '${AWS_ENV_IBIS_SERVICES_AUTH}';
    window.env.otpServices = '${AWS_ENV_PLATFORM_OTP_CLOUD_SERVICES}';
    window.env.globalAuthorizationToken = '${AWS_SECRET_IBIS_SERVICES_GLOBAL_AUTH}';
    window.env.urlEnvironment = window.location.origin + '/';
    window.env.production = ('${AWS_ENV_PRODUCTION_FLAG}' === 'true');
}(this));