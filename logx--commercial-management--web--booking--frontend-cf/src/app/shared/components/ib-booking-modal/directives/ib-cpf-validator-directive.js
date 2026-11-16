(function () {


    angular.module('ib-booking-modal-module')
        .directive('ibCpfValidator', ibCpfValidator);

    /* istanbul ignore next */
    function ibCpfValidator () {
        // Usage: <input ng-model="model" ib-dni-validator></input>
        //
        // Creates: adds an cpf validator to the input
        //
        const directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        function link ($scope, $element, $attrs, $modelCtrl) {
            $modelCtrl.$parsers.push(validateDniNumber);
            $modelCtrl.$formatters.push(validateDniNumber);

            function validateDniNumber (number) {
                $modelCtrl.$setValidity('cpf', validarCPF(number));
                return number;
            }
        }

        function validarCPF (cpf) {
            let i, rev, add, invalidCpf = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999'];
            if (cpf) {
                cpf = cpf.replace(/[^\d]+/g, '');

                if (cpf === '' || cpf.length !== 11 || invalidCpf.indexOf(cpf) !== -1) {
                    return false;
                }

                add = 0;
                for (i = 0; i < 9; i++)
                    add += parseInt(cpf.charAt(i)) * (10 - i);
                rev = 11 - (add % 11);
                if (rev === 10 || rev === 11)
                    rev = 0;
                if (rev !== parseInt(cpf.charAt(9))) {
                    return false;
                }

                add = 0;
                for (i = 0; i < 10; i++)
                    add += parseInt(cpf.charAt(i)) * (11 - i);
                rev = 11 - (add % 11);
                if (rev === 10 || rev === 11)
                    rev = 0;
                if (rev !== parseInt(cpf.charAt(10))) {
                    return false;
                }

                return true;
            }
            return false;
        }

    }
})();