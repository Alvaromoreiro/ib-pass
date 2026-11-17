import { Method } from 'cypress/types/net-stubbing';

export const CommandsConstants = {
    paymentServices: [
        { request: 'PUT' as Method, statics: true, endpoint: 'credit-card', file: 'credit-card' },
        { request: 'POST' as Method, statics: true, endpoint: 'creditCardFee', file: 'credit-card-fee' },
        { request: 'POST' as Method, statics: true, endpoint: 'creditCardBin', file: 'credit-card-bin' },
        { request: 'GET' as Method, endpoint: 'payment-methods', file: 'payment-methods' },
        { request: 'POST' as Method, endpoint: 'ancillaries-calculation', file: 'ancillaries-calculation' },
        { request: 'POST' as Method, endpoint: '/pay-and-issue', file: 'pay-and-issue' },
        { request: 'POST' as Method, endpoint: 'rb_bf68025iux**' },
        { request: 'GET' as Method, endpoint: 'creditcardlogo.json' },
        { request: 'GET' as Method, endpoint: 'paymentLoading.svg' },
        { request: 'GET' as Method, endpoint: 'clear.png' },
        { request: 'POST' as Method, endpoint: '/credit-presentment**' }
    ],
    logginServices: [
        { request: 'GET' as Method, statics: true, endpoint: 'bookings', file: 'bookings' },
        { request: 'POST' as Method, endpoint: '/v1/login' },
        { request: 'GET' as Method, endpoint: 'ibplus/login/' },
        { request: 'POST' as Method, endpoint: '**ibisauth.iberia.com/**' },
        { request: 'POST' as Method, endpoint: '**ibisauth.iberia.com/api/**' },
        { request: 'GET' as Method, endpoint: '/avatar' }
    ]
};

export const ProcessAndStep = {
    ibcose: {
        datalayer: { quadrigam: 'IBCOSE', proceso: 'checkin', paso: 'landing' },
        digitaldata: { Quadrigam: 'IBCOSE', Process: 'checkin', Step: 'landing' }
    },
    ibcoseii: {
        datalayer: { quadrigam: 'IBCOSEII', proceso: 'checkin', paso: 'landing' },
        digitaldata: { Quadrigam: 'IBCOSEII', Process: 'checkin', Step: 'landing' }
    },
    ibcoac: {
        datalayer: { quadrigam: 'IBCOAC', proceso: 'checkin', paso: 'recuperacion' },
        digitaldata: { Quadrigam: 'IBCOAC', Process: 'checkin', Step: 'recuperacion' }
    },
    ibcoacpa: {
        datalayer: { quadrigam: 'IBCOACPA', proceso: 'checkin', paso: 'recuperacion PA' },
        digitaldata: { Quadrigam: 'IBCOACPA', Process: 'checkin', Step: 'recuperacion PA' }
    },
    ibcoacii: {
        datalayer: { quadrigam: 'IBCOACII', proceso: 'checkin', paso: 'apis' },
        digitaldata: { Quadrigam: 'IBCOACII', Process: 'checkin', Step: 'apis' }
    },
    ckdang: {
        datalayer: { quadrigam: 'CKDANG', proceso: 'checkin', paso: 'articulos peligrosos' },
        digitaldata: { Quadrigam: 'CKDANG', Process: 'checkin', Step: 'articulos peligrosos' }
    },
    ibckipurc: {
        datalayer: { quadrigam: 'IBCKIPURC', proceso: 'checkin', paso: 'pago' },
        digitaldata: { Quadrigam: 'IBCKIPURC', Process: 'checkin', Step: 'pago' }
    },
    moseat: {
        datalayer: { quadrigam: 'MOSEAT', proceso: 'checkin', paso: 'asientos' },
        digitaldata: { Quadrigam: 'MOSEAT', Process: 'checkin', Step: 'asientos' }
    },
    ibcobp: {
        datalayer: { quadrigam: 'IBCOBP', proceso: 'checkin', paso: 'tarjeta de embarque' },
        digitaldata: { Quadrigam: 'IBCOBP', Process: 'checkin', Step: 'tarjeta de embarque' }
    },
    ibeccf: {
        datalayer: { quadrigam: 'IBECCF', proceso: 'checkin', paso: 'confirmacion duplicados' },
        digitaldata: { Quadrigam: 'IBECCF', Process: 'checkin', Step: 'confirmacion duplicados' }
    },
    ibckicf: {
        datalayer: { quadrigam: 'IBCKICF', proceso: 'checkin', paso: 'confirmacion' },
        digitaldata: { Quadrigam: 'IBCKICF', Process: 'checkin', Step: 'confirmacion' }
    },
    ibfnpa: {
        datalayer: { quadrigam: 'IBFNPA', proceso: 'checkin', paso: 'vuelo puente aereo' },
        digitaldata: { Quadrigam: 'IBFNPA', Process: 'checkin', Step: 'vuelo puente aereo' }
    },
    ibfncopa: {
        datalayer: { quadrigam: 'IBFNCOPA', proceso: 'checkin', paso: 'adelanta o retrasa tu vuelo' },
        digitaldata: { Quadrigam: 'IBFNCOPA', Process: 'checkin', Step: 'adelanta o retrasa tu vuelo' }
    },
    uncose: {
        datalayer: { quadrigam: 'UNCOSE', proceso: 'desfacturar', paso: 'inicio' },
        digitaldata: { Quadrigam: 'UNCOSE', Process: 'desfacturar', Step: 'inicio' }
    },
    uncoac: {
        datalayer: { quadrigam: 'UNCOAC', proceso: 'desfacturar', paso: 'recuperacion' },
        digitaldata: { Quadrigam: 'UNCOAC', Process: 'desfacturar', Step: 'recuperacion' }
    },
    unconf: {
        datalayer: { quadrigam: 'UNCONF', proceso: 'desfacturar', paso: 'confirmacion' },
        digitaldata: { Quadrigam: 'UNCONF', Process: 'desfacturar', Step: 'confirmacion' }
    }
};
