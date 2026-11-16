import * as angular from 'angular';
import {ibUiDaterangepickerModel} from './view-model/ib-ui-daterangepicker-model';
import {CommonsUtilService} from '../../utils/ib-commons-utils-service';

@Component('ib-ui-daterangepicker-module', 'ibUiDaterangepicker', {
    bindings: {
        textDateGone: '<?',
        textDateReturn: '<?',
        dateGoneid: '<?',
        dateReturnid: '<?',
        dateGone: '=?',
        dateReturn: '=?',
        roundtrip: '<?',
        containerForm: '=?',
        flexDates: '=?',
        index: '<?',
        textLoading: '<?',
        allDates: '=?',
        dateCalendar: '=?'
    },
    controllerAs: 'ibUiDaterangepickerCtrl',
    templateUrl: ['$rootScope', ($rootScope:CommonsRootScope)=> {
        return `${$rootScope.routes.templates}ib-ui-daterangepicker-view.html`;
    }]
}, ['$scope', '$rootScope', '$timeout', '$window', 'ibUiDaterangepickerModel', '$document', 'CommonsUtilService'], [])
class IbUiDaterangepickerController implements ng.IController {
    public model: UiComponentsModel.DataRangePickerModel;
    public whatTime: any;
    public selectedHourGone: any;
    public selectedMinuteGone: any;
    public selectedHourReturn: any;
    public selectedMinuteReturn: any;
    public textDateGone: any;
    public textDateReturn: any;
    public dateGoneid: any;
    public dateReturnid: any;
    public dateGone: any;
    public dateReturn: any;
    public roundtrip: any;
    public containerForm: any;
    public flexDates: any;
    public index: any;
    public textLoading: any;
    public allDates: any;
    public relatedTargetMonth: any;
    public relatedTargetYear: any;
    public dateCalendar: UiComponentsModel.DataRangePickerDateCalendar;

    constructor (
        private $scope: ng.IScope,
        private $rootScope: CommonsRootScope,
        private $timeout: ng.ITimeoutService,
        private $window: ng.IWindowService,
        private ibUiDaterangepickerModel: ibUiDaterangepickerModel,
        private $document: ng.IDocumentService,
        private CommonsUtilService: CommonsUtilService
    ) {
        this.$scope.$on('updateDateValueModel', this.updateDateValueModel);
        this.$scope.$on('updateDateOptionsOutbount', this.updateDateOptionsOutbount);
        this.$scope.$on('openCalendar', this.openCalendar);
        this.$scope.$on('updateCalendarInputDates', this.updateCalendarInputDates);
    }

    $onInit () {
        this.model = this.ibUiDaterangepickerModel.initializeModel(this.dateCalendar);
        this.dateGone = this.dateGone ? this.dateGone : null;
        this.dateReturn = this.dateReturn ? this.dateReturn : null;
        if(this.dateGone) {
            const zeroDate = this.dateGone.getDate() < 10 ? '0' : '';
            const zeroMonth = this.dateGone.getMonth()+ 1< 10 ? '0' : '';
            const date = `${zeroDate}${this.dateGone.getDate()}/${zeroMonth}${this.dateGone.getMonth() + 1}/${this.dateGone.getFullYear()}`;
            this.model.inputDateGone =this.dateFormated(
                date,
                this.model.textFormat
            );
        }else{
            this.model.inputDateGone ='';
        }
        if(this.dateReturn) {
            const zeroDate =this.dateReturn.getDate() < 10 ? '0' : '';
            const zeroMonth = this.dateReturn.getMonth() + 1 < 10 ? '0' : '';
            const date = `${zeroDate}${this.dateReturn.getDate()}/${zeroMonth}${this.dateReturn.getMonth() + 1}/${this.dateReturn.getFullYear()}`;
            this.model.inputDateReturn =this.dateFormated(
                date,
                this.model.textFormat
            );
        }else{
            this.model.inputDateReturn ='';
        }


        this.initialOptions();

    }
    updateDateOptionsOutbount = (e: ng.IAngularEvent, number: number):void => {
        if (number === 2) {
            if (!this.dateReturn) {
                this.model.iEnd = 0;
                const elementEnd:UiComponentsModel.DatePickerFunction = angular.element('.ib-input-range-date__end .hasDatepicker');
                const elementStard:UiComponentsModel.DatePickerFunction = angular.element('.ib-input-range-date__start .hasDatepicker');
                elementEnd.datepicker(
                    'setDate',
                    elementStard.datepicker('getDate')
                );
                this.$timeout(()=> {
                    this.model.isopenDateReturn = !this.model.isopenDateReturn;
                    this.model.focusedReturn = true;
                });
            }
        } else {
            if (number === 1) {
                this.model.inputDateReturn = '';
            }
        }
    };

    updateDateValueModel = (e: ng.IAngularEvent, outboundDate: any, returnDate?:any):void => {
        if(outboundDate) {
            this.dateGone = outboundDate;
            const zeroDate = outboundDate.getDate() < 10 ? '0' : '';
            const zeroMonth = outboundDate.getMonth()+ 1< 10 ? '0' : '';
            const date = `${zeroDate}${outboundDate.getDate()}/${zeroMonth}${outboundDate.getMonth() + 1}/${outboundDate.getFullYear()}`;
            this.model.inputDateGone =this.dateFormated(
                date,
                this.model.textFormat
            );
        }else{
            this.model.inputDateGone ='';
        }
        if(returnDate) {
            this.dateReturn = returnDate;
            const zeroDate = returnDate.getDate() < 10 ? '0' : '';
            const zeroMonth = returnDate.getMonth()+ 1< 10 ? '0' : '';
            const date = `${zeroDate}${returnDate.getDate()}/${zeroMonth}${returnDate.getMonth() + 1}/${returnDate.getFullYear()}`;
            this.model.inputDateReturn =this.dateFormated(
                date,
                this.model.textFormat
            );
        }else{
            this.model.inputDateReturn ='';
        }
    };
    private dateFormated = (date: string, format: string):string => {
        const dateParts = date.split('/');
        let response = dateParts[0] + '/' + dateParts[1] + '/' + dateParts[2];
        if (format === 'MM/DD/YYYY') {
            response = dateParts[1] + '/' + dateParts[0] + '/' + dateParts[2];
        }

        return response;
    };

    private initialOptions = () => {
        if (this.$rootScope) {
            const $dolar:UiComponentsModel.Dolar =$;
            $dolar.datepicker.setDefaults($dolar.datepicker.regional[this.$rootScope.appLang]);
        }

        if (this.$window.innerWidth < 768) {
            this.model.dateOptions.numberOfMonths;
        }

        this.model.dateOptionsStart = {
            changeYear: this.model.dateOptions.changeYear,
            changeMonth: this.model.dateOptions.changeMonth,
            minDate: this.model.dateOptions.minDate,
            maxDate: this.model.dateOptions.maxDate,
            numberOfMonths: this.model.dateOptions.numberOfMonths,
            dateFormat: this.model.dateOptions.dateFormat,

            onSelect: (dateText: string, obj: any) => {
                const parent = angular.element(obj.input[0]).parents('.ib-input-range-date');
                const input = parent.find('.ib-input-range-date__start .ib-input-range-date__input');

                if (this.whatTime) {
                    const hours = angular.isDefined(this.selectedHourGone) ? this.selectedHourGone.name : '00';
                    const minutes = angular.isDefined(this.selectedMinuteGone) ? this.selectedMinuteGone.name : '00';
                    this.model.inputDateGone = dateText + '/' + hours + ':' + minutes;
                } else {
                    this.model.inputDateGone = dateText;
                }

                this.validationDates(input);

                if ( (this.dateReturn && this.dateGone.getTime() > this.dateReturn.getTime()) || (this.roundtrip === 1 && this.dateReturn !== null)) {
                    this.dateReturn = null;
                    this.model.inputDateReturn = '';

                    this.$timeout(()=> {
                        const element: UiComponentsModel.DatePickerFunction = parent.find('.ib-input-range-date__end .hasDatepicker');
                        const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                        element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                    });
                }

                this.model.isopenDateGone = !this.model.isopenDateGone;

                if (!this.dateReturn || this.dateReturn === null) {
                    this.model.isopenDateReturn = !this.model.isopenDateReturn;

                    this.$timeout(()=> {
                        const element: UiComponentsModel.DatePickerFunction = parent.find('.ib-input-range-date__end .hasDatepicker');
                        const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                        element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                    });
                }

                this.$timeout(()=> {
                    const element: UiComponentsModel.DatePickerFunction = angular.element(obj.input[0]);
                    const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                    element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                });
                this.$timeout(()=> this.$rootScope.$broadcast('updatedDateDeparture'));
            },

            onAfterUpdate: (e: any) => {
                this.model.afterUpdate = !this.model.afterUpdate;
            }
        };

        this.model.dateOptionsEnd = {
            changeYear: this.model.dateOptions.changeYear,
            changeMonth: this.model.dateOptions.changeMonth,
            minDate: this.model.dateOptions.minDate,
            maxDate: this.model.dateOptions.maxDate,
            numberOfMonths: this.model.dateOptions.numberOfMonths,
            dateFormat: this.model.dateOptions.dateFormat,

            onSelect: (dateText: string, obj: any) => {
                const parent = angular.element(obj.input[0]).parents('.ib-input-range-date');
                const input = parent.find('.ib-input-range-date__end .ib-input-range-date__input');

                if (this.whatTime) {
                    const hours = angular.isDefined(this.selectedHourReturn) ? this.selectedHourReturn.name : '00';
                    const minutes = angular.isDefined(this.selectedMinuteReturn) ? this.selectedMinuteReturn.name : '00';
                    this.model.inputDateReturn = dateText + '/' + hours + ':' + minutes;
                } else {
                    this.model.inputDateReturn = dateText;
                }

                this.validationDates(input);

                if (this.dateGone && this.dateReturn.getTime() < this.dateGone.getTime()) {
                    this.dateGone = null;
                    this.model.inputDateGone = '';

                    this.$timeout(()=> {
                        const element: UiComponentsModel.DatePickerFunction = parent.find('.ib-input-range-date__start .hasDatepicker');
                        const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                        element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                    });
                }

                this.model.isopenDateReturn = !this.model.isopenDateReturn;

                if (!this.dateGone || this.dateGone === null) {
                    this.model.isopenDateGone = !this.model.isopenDateGone;

                    this.$timeout(() =>{
                        const element: UiComponentsModel.DatePickerFunction = parent.find('.ib-input-range-date__start .hasDatepicker');
                        const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                        element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                    });
                }

                this.$timeout(()=> {
                    const element: UiComponentsModel.DatePickerFunction = angular.element(obj.input[0]);
                    const elementGetDate: UiComponentsModel.DatePickerFunction= angular.element(obj.input[0]);
                    element.datepicker('setDate', elementGetDate.datepicker('getDate'));
                });
                this.$timeout(()=> this.$rootScope.$broadcast('updatedDateReturn'));
            },
            onAfterUpdate: (e: any)=> {
                this.model.afterUpdate = !this.model.afterUpdate;
            }
        };

        this.model.isopenDateGone = false;
        this.model.isopenDateReturn = false;
    };

    validationDates = (inputDate: JQuery) => {
        const simDateMin = new Date(
            this.model.newDate.month + '/' + this.model.newDate.day + '/' + this.model.newDate.year
        );

        const simDateMax = new Date(
            this.model.newDate.month + '/' + this.model.newDate.day + '/' + this.model.newDate.year
        );

        let isValid = true;
        const inputID = inputDate[0].id;
        simDateMax.setDate(simDateMax.getDate() + this.model.dateOptions.maxDate);

        if (this.dateGone && inputID === 'dateGoneid') {
            if (this.dateGone.getTime() < simDateMin.getTime()) {
                this.containerForm.dateGoneid.$setValidity('minValid', false);
                isValid = false;
            } else {
                this.containerForm.dateGoneid.$setValidity('minValid', true);
            }

            if (this.dateGone.getTime() > simDateMax.getTime()) {
                this.containerForm.dateGoneid.$setValidity('maxValid', false);
                isValid = false;
            } else {
                this.containerForm.dateGoneid.$setValidity('maxValid', true);
            }

            if (this.model.dataHourRestriction > 0) {
                this.model.dataHour = this.model.dataHourRestriction;
                this.model.dateRestriction.setMilliseconds(this.model.dataHour * 60 * 60 * 1000);
                this.model.dateRestriction.setHours(0);
                this.model.dateRestriction.setMinutes(0);
                this.model.dateRestriction.setSeconds(0);

                if (this.dateGone.getTime() < this.model.dateRestriction) {
                    this.containerForm.dateGoneid.$setValidity('restrictionValid', false);
                    isValid = false;
                } else {
                    this.containerForm.dateGoneid.$setValidity('restrictionValid', true);
                }
            }

            if (this.containerForm.dateGoneid.$invalid) {
                isValid = false;
            }
        }

        if (this.dateReturn && inputID === 'dateReturnid') {
            if (this.dateReturn.getTime() < simDateMin.getTime()) {
                this.containerForm.dateReturnid.$setValidity('minValid', false);
                isValid = false;
            } else {
                this.containerForm.dateReturnid.$setValidity('minValid', true);
            }

            if (this.dateReturn.getTime() > simDateMax.getTime()) {
                this.containerForm.dateReturnid.$setValidity('maxValid', false);
                isValid = false;
            } else {
                this.containerForm.dateReturnid.$setValidity('maxValid', true);
            }

            if (this.model.dataHourRestriction > 0) {
                this.model.dataHour = this.model.dataHourRestriction;
                this.model.dateRestriction.setMilliseconds(this.model.dataHour * 60 * 60 * 1000);
                this.model.dateRestriction.setHours(0);
                this.model.dateRestriction.setMinutes(0);
                this.model.dateRestriction.setSeconds(0);

                if (this.dateReturn.getTime() < this.model.dateRestriction) {
                    this.containerForm.dateReturnid.$setValidity('restrictionValid', false);
                    isValid = false;
                } else {
                    this.containerForm.dateReturnid.$setValidity('restrictionValid', true);
                }
            }

            if (this.containerForm.dateReturnid.$invalid) {
                isValid = false;
            }
        }

        return isValid;
    };

    clickAllDates = (): void => {
        this.allDates = !this.allDates;
        this.$timeout(() => {this.model.isopenDateGone = true;});
    };

    mouseOverStart = (scope: any, event: any): void => {
        const startRangePicker = angular.element('.ib-rangepicker--start');
        const inputEnd = scope.ibUiDaterangepickerCtrl.model.inputDateReturn;
        const group = '.ui-datepicker-group';
        const simDateHover = this.getSimDateHover(event);

        if(this.checkIsStartFieldHover(event) && simDateHover !== undefined) {
            angular.forEach(angular.element(group + ' tbody td:not(.ui-datepicker-unselectable)', startRangePicker), (e)=> {
                const $thisTD = angular.element(e);
                const simDate = this.getSimSelectableDate($thisTD);
                if (simDateHover && scope.ibUiDaterangepickerCtrl.dateReturn &&
                    angular.isDefined(inputEnd) && inputEnd.length > 0) {
                    //ADD class "hightlight" if
                    if (this.checkIsInsideNewStartRange(scope, simDate, simDateHover)) {
                        $thisTD.addClass('highlight');
                    } else if (this.isToCleanOutStartRangeCells(scope, simDate)) {
                        $thisTD.removeClass('highlight');
                    } else if (!scope.ibUiDaterangepickerCtrl.dateGone) {
                        $thisTD.removeClass('highlight');
                    }
                }
            });
        } else if (event.target.localName !== 'td') {
            this.cleanOutRangeCells(scope, group);
        }
    };

    mouseOverEnd = (scope: any, event: any): void => {
        const endRangePicker = angular.element('.ib-rangepicker--end');
        const inputStart = scope.ibUiDaterangepickerCtrl.model.inputDateGone;
        const group = '.ui-datepicker-group';
        const simDateHover = this.getSimDateHover(event);

        if(this.checkIsEndFieldHover(event) && simDateHover !== undefined) {
            angular.forEach(angular.element(group + ' tbody td:not(.ui-datepicker-unselectable)', endRangePicker), (e)=> {
                const $thisTD = angular.element(e);
                const simDate = this.getSimSelectableDate($thisTD);

                if (scope.ibUiDaterangepickerCtrl.dateGone && simDateHover &&
            angular.isDefined(inputStart) && inputStart.length > 0) {
                    //ADD class "hightlight" if
                    if (this.checkIsInsideNewEndRange(scope, simDate, simDateHover)) {
                        $thisTD.addClass('highlight');
                    } else if (this.isToCleanOutEndRangeCells(scope, simDate)) {
                        $thisTD.removeClass('highlight');
                    } else if (!scope.ibUiDaterangepickerCtrl.dateReturn) {
                        $thisTD.removeClass('highlight');
                    }
                }
            });
        } else if (event.target.localName !== 'td') {
            this.cleanOutRangeCells(scope, group);
        }
    };

    private getSimDateHover = (event: any): Date => {
        let simDateHover: Date;
        const dayA = event.target.text;
        if(event.relatedTarget?.className.includes('ui-datepicker-group')) {
            this.relatedTargetMonth = angular.element(angular.element(event.relatedTarget).find('tbody tr td:not(.ui-datepicker-unselectable)')[0]).data('month') + 1;
            this.relatedTargetYear = angular.element(angular.element(event.relatedTarget).find('tbody tr td:not(.ui-datepicker-unselectable)')[0]).data('year');
            simDateHover = new Date(this.relatedTargetMonth + '/' + dayA + '/' + this.relatedTargetYear);
        } else if (this.relatedTargetMonth !== undefined && this.relatedTargetYear !== undefined) {
            simDateHover = new Date(this.relatedTargetMonth + '/' + dayA + '/' + this.relatedTargetYear);
        }
        return simDateHover;
    };

    private checkIsStartFieldHover = (event: any): boolean => {
        return event.target.className === 'ui-state-default ui-state-hover' || event.target.className === 'ui-state-default ui-state-highlight ui-state-hover';
    };

    private checkIsEndFieldHover = (event: any): boolean => {
        return event.target.className === 'ui-state-default ui-state-hover';
    };

    private checkIsInsideNewStartRange = (scope: any, simDate: Date, simDateHover: Date): boolean => {
        return simDate.getTime() > simDateHover.getTime() &&
        simDate.getTime() < scope.ibUiDaterangepickerCtrl.dateReturn.getTime();
    };

    private checkIsInsideNewEndRange = (scope: any, simDate: Date, simDateHover: Date): boolean => {
        return simDate.getTime() > scope.ibUiDaterangepickerCtrl.dateGone.getTime() &&
                simDate.getTime() < simDateHover.getTime();
    };

    private isToCleanOutStartRangeCells = (scope: any, simDate: Date): boolean => {
        return scope.ibUiDaterangepickerCtrl.dateGone
                && (simDate.getTime() < scope.ibUiDaterangepickerCtrl.dateGone.getTime() ||
                simDate.getTime() > scope.ibUiDaterangepickerCtrl.dateReturn.getTime());
    };

    private isToCleanOutEndRangeCells = (scope: any, simDate: Date): boolean => {
        return scope.ibUiDaterangepickerCtrl.dateReturn
                && (simDate.getTime() < scope.ibUiDaterangepickerCtrl.dateGone.getTime() ||
                simDate.getTime() > scope.ibUiDaterangepickerCtrl.dateReturn.getTime());
    };

    private getSimSelectableDate = ($thisTD: any): Date => {
        const dayTD = $thisTD.eq(0).find('.ui-state-default').text();
        const monthTD = $thisTD.eq(0).data('month') + 1;
        const yearTD = $thisTD.eq(0).data('year');
        return new Date(monthTD + '/' + dayTD + '/' + yearTD);
    };

    private cleanOutRangeCells = (scope: any, group: string): void => {
        angular.forEach(this.$document.find(group + ' tbody td:not(.ui-datepicker-unselectable)'), (e)=> {
            const $thisTD = angular.element(e);
            const simDate = this.getSimSelectableDate($thisTD);
            if (scope.ibUiDaterangepickerCtrl.dateGone
            && scope.ibUiDaterangepickerCtrl.dateReturn
            && (simDate.getTime() < scope.ibUiDaterangepickerCtrl.dateGone.getTime() ||
            simDate.getTime() > scope.ibUiDaterangepickerCtrl.dateReturn.getTime())) {
                $thisTD.removeClass('highlight');
            }
        });
    };
    public openCalendar = (e: ng.IAngularEvent, openReturn:any) => {
        if (openReturn) {
            this.model.isopenDateReturn = true; 
            this.model.isopenDateGone = false;
        } else {
            this.model.isopenDateReturn = false;
            this.model.isopenDateGone = true;
        }
    };
    public updateCalendarInputDates = (e: ng.IAngularEvent, inputDate:UiComponentsModel.DataRangePickerInputDate) =>{
        const outboundDate =  this.CommonsUtilService.convertDateIntoString(inputDate.selectedOutbondDate);
        const returnDate  =  this.CommonsUtilService.convertDateIntoString(inputDate.selectedReturnDate);

        this.model.inputDateGone =this.dateFormated(outboundDate, this.model.textFormat);
        this.model.inputDateReturn =this.dateFormated(returnDate, this.model.textFormat);
    };
}