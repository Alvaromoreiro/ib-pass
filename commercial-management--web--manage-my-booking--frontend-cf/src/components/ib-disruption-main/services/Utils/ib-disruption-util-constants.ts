const evaluatorConst = {
    LOGICAL_OPERATOR: {
        'AND': function (a, b) {
            return (a && b);
        },
        'OR': function (a, b) {
            return (a || b);
        },
        'NAND': function (a, b) {
            return !(a && b);
        }
    },
    REFUND_FLAG_EVALUATOR: {
        REFUND_AREA_EVAL: {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                { 'type': 'oper', 'value': 'OR' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' }
            ]
        },
        ALLOWED_CASH_REFUND_EVAL: {
            RULES: [    
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' }
            ]
        },
        AVAILABLE_CASH_REFUND: {
            RULES :[
                { 'type': 'flag', 'value': 'CASH_REFUND' }
            ]
        },
        SIMPLE_VOUCHER_CALLCENTER_EVAL: {
            RULES: [
                { 'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'oper', 'value': 'NOT' },
                { 'type': 'flag', 'value': 'VOUCHER_REFUND' },
                { 'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' }
            ]
        },
        SIMPLE_CASH_CALLCENTER_EVAL: {
            RULES: [
                { 'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'oper', 'value': 'NOT' },
                { 'type': 'flag', 'value': 'CASH_REFUND' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' }

            ]
        },
        NOT_VOUCHER_VALID_EVAL: {
            RULES: [
                { 'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'VOUCHER_REFUND' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' }
            ]
        },
        NOT_CASH_VALID_EVAL: {
            RULES: [
                { 'type': 'oper', 'value': 'NOT' },
                { 'type': 'flag', 'value': 'CASH_REFUND' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' }
            ]
        },
        MIXED_CALLCENTER_EVAL: {
            RULES: [
                { 'type': 'rule', 'value': 'NOT_VOUCHER_VALID_EVAL' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'rule', 'value': 'NOT_CASH_VALID_EVAL' }
            ]
        },

        SIMPLE_CASH_LINK_EVAL: {
            RULES: [
                { 'type': 'oper', 'value': 'NOT' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                { 'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                { 'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'CASH_REFUND' }
            ]
        },
        SIMPLE_VOUCHER_LINK_EVAL: {
            RULES: [
                { 'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                { 'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'VOUCHER_REFUND' }
            ]
        },
        MIXED_VOUCHER_LINK_EVAL: {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                { 'type': 'oper', 'value': 'AND' },
                { 'type': 'flag', 'value': 'VOUCHER_REFUND' }
            ]
        },
        

        /**
         * Final condition to use
         */
        SIMPLE_LINK_EVAL: {
            RULES :[
                { 'type': 'rule', 'value': 'SIMPLE_CASH_LINK_EVAL' },
                { 'type' : 'oper', 'value' : 'OR'},
                { 'type': 'rule', 'value': 'SIMPLE_VOUCHER_LINK_EVAL' },
                { 'type' : 'oper', 'value' : 'OR'},
                { 'type': 'rule', 'value': 'MIXED_VOUCHER_LINK_EVAL' }
            ]
        },
        /**
         * Final condition to use
         */
        SIMPLE_CALLCENTER_EVAL: {
            RULES: [
                { 'type': 'rule', 'value': 'SIMPLE_VOUCHER_CALLCENTER_EVAL' },
                { 'type' : 'oper', 'value' : 'OR'},
                { 'type': 'rule', 'value': 'SIMPLE_CASH_CALLCENTER_EVAL' },
                { 'type' : 'oper', 'value' : 'OR'},
                { 'type': 'rule', 'value': 'MIXED_CALLCENTER_EVAL' }
            ]
        },
        /**
         * Final condition to use
         */
        MIXED_OPTION_EVAL: {
            RULES: [
                {'type' : 'oper', 'value' : 'NOT'},
                {'type' : 'flag', 'value': 'VOUCHER_REFUND'},
                {'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                { 'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'ALLOWED_REFUND_VOUCHER'},
                {'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'CASH_REFUND' }
            ]
        },
        /**
         * Final condition to use
         */
        ONLY_VOUCHER_EVAL:{
            RULES: [
                {'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'ALLOWED_REFUND_VOUCHER'},
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'VOUCHER_REFUND'}
            ]
        },
        /**
         * Final condition to use
         */
        ONLY_CASH_EVAL: {
            RULES: [
                {'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'ALLOWED_REFUND_CASH'},
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'CASH_REFUND'}
            ]
        },
        /**
         * Final condition to use
         */
        BOTH_REFUND_EVAL:{
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_VOUCHER' },
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'ALLOWED_REFUND_CASH'},
                {'type' : 'oper', 'value' : 'AND'},
                {'type' : 'flag', 'value': 'VOUCHER_REFUND'}
            ]
        },
        /**
         * Final condition to use
         */
        OLD_RUBIQ_EVAL : {
            RULES: [
                {'type' : 'oper', 'value' : 'NOT'},
                { 'type': 'flag', 'value': 'VOUCHER_REFUND' }
            ]
        },
        CASH_REFUND_ENABLED_EVAL : {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_REFUND_CASH' },
                {'type' : 'oper', 'value' : 'AND'},
                { 'type': 'flag', 'value': 'CASH_REFUND' }
            ]
        },
        ANY_INVOLUNTARY_CHANGE_FLIGHT_EVAL: {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE' }
            ]
        },
        COMPLEX_REFUND_EVAL: {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_INVOLUNTARY_FLIGHT_CHANGE' }
            ]
        },
        ALLOWED_ACCEPT_CHANGES: {
            RULES: [
                { 'type': 'flag', 'value': 'ALLOWED_ACCEPT_CHANGES' }
            ]
        }
    },
    FLIGHT_CHANGE_CONDITION:{
        PASSENGER_MODIFICATION_ENABLED:{
            RULES: [
                { 'type': 'flag', 'value': 'FLIGHT_DISRUPTION_SEARCH' }
            ]
        }
    }
};
angular.module('ib-disruption-main-module').constant('EvaluatorConst', evaluatorConst);
type EvaluatorConst = typeof evaluatorConst;
