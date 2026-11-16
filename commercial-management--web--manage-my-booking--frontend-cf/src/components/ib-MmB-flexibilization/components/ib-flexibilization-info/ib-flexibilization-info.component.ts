import { FlexibilizationInfoDates, FlexbilizationFlagsInfoModel, FlexibilizationPeriodDateModel, DEFAULT_FLEXIBILIZATION_DATE_LIST } from "../../models/flexibilization-info.model";
@Component('ib-flexibilization-info-module', 'ibFlexibilizationInfo', {
    controllerAs: 'ibFlexibilizationInfoCtrl',
            bindings: {
                flexibilizationInfoDates: '<',
                flexibilizationTextDatesRange: '<',
                flags: '<',
                orderItems: '<'
            },
                templateUrl: ['MmBAppConstants', ( MmBAppConstants: MmBAppConstants ): string => MmBAppConstants.templatesRoute + 'ib-flexibilization-info.view.html']
}, ['$filter'], [])

class ibFlexibilizationInfoComponent implements ng.IController {
    public flexibilizationInfoDates: FlexibilizationInfoDates;
    public flexibilizationTextDatesRange: any; //used in view for voluntary changes should be replaced by flexibilizationDate.text
    public flags: FlexbilizationFlagsInfoModel;
    public orderItems: any;

    public openInfo: boolean = true;
    public allowedDates: FlexibilizationPeriodDateModel[];
    public flexibilizationDate: FlexibilizationPeriodDateModel;


    constructor (private $filter) { }

    $onInit = (): void => {
        this.openInfo = true;
        this.allowedDates = this.allowedPeriodsInformation();
        this.flexibilizationDate = this.flexibilizationDatesMsg();
    };


     /**
     * This function is launched when user click in accordion.
     * The first time that user enter to tab "change-flight" the accordion show open, but if the user close accordion this function save variable in localStorageService
     * that indicate if user enter again  in this tab,the accordion show closed.
     *  */
     changeState() : void {
        this.openInfo=!this.openInfo
    };

    private convertDateString (date:string) : string {
        let year, month, day, dateConverted;
        if (date) {
            year = date.split("-")[0];
            month = date.split("-")[1];
            day = date.split("-")[2];
        }

        dateConverted = day + "/" + month + "/" + year;
        return dateConverted;
    }

    //This function will provide flexibilization dates message on flexibilization info
    flexibilizationDatesMsg ()  {
        let flexibilizationDate = {dateFrom : '', dateTo: '', text: '', type: '', message: ''};
        this.flexibilizationInfoDates ? flexibilizationDate.dateFrom = this.convertDateString(this.flexibilizationInfoDates.flexibilizationDate.dateFrom) : flexibilizationDate.dateFrom = null;
        this.flexibilizationInfoDates ? flexibilizationDate.dateTo = this.convertDateString(this.flexibilizationInfoDates.flexibilizationDate.dateTo) : flexibilizationDate.dateTo = null;
        if(this.flexibilizationInfoDates?.flexibilizationDate){
            flexibilizationDate.dateFrom = this.convertDateString(this.flexibilizationInfoDates.flexibilizationDate.dateFrom);
            flexibilizationDate.dateTo = this.convertDateString(this.flexibilizationInfoDates.flexibilizationDate.dateTo);
            //CASE 1 ===> Just a day for changing flight flexibilization
            if(flexibilizationDate.dateFrom === flexibilizationDate.dateTo){
                flexibilizationDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_FLEX_DATES_SINGLE_DAY', {date: flexibilizationDate.dateFrom});
            }
            //CASE 2 ===> A period for changing flight flexibilization
            else {
                flexibilizationDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_FLEX_DATES_PERIOD', {dateFrom: flexibilizationDate.dateFrom, dateTo: flexibilizationDate.dateTo});
            }
        }
        //CASE 3 ===> There is no flexibilization capabilities information the show default message
        else{
            flexibilizationDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_FLEX_DATES_DEFAULT');
        }
        return flexibilizationDate;
    }

    allowedPeriodsInformation () : FlexibilizationPeriodDateModel[] {
        let allowedDates = [];
        this.flexibilizationInfoDates?.allowedPeriods.forEach((element : FlexibilizationPeriodDateModel) => {
            let allowedDate = {dateFrom : '', dateTo: '', text: '', type: '', message: ''};
            element.dateFrom = element.dateFrom.split(" ")[0];
            element.dateTo = element.dateTo.split(" ")[0];
            allowedDate.dateFrom = this.convertDateString(element.dateFrom);
            allowedDate.dateTo = this.convertDateString(element.dateTo);
            allowedDates.push(allowedDate);
        });
        allowedDates.forEach((allowedDate, index) => {
            if(allowedDates.length === 1) {
                //CASE 1 ===> One allowed period with same dateFrom and dateTo should return "If you change your flight, you will have to travel on {{date}}."
                if(allowedDate.dateFrom === allowedDate.dateTo) {
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_DAY', {date: allowedDate.dateFrom});
                }
                //CASE 2 ===> One allowed period with different dateFrom and dateTo should return "If you change your flight, you will have to travel from {{dateFrom}} to {{dateTo}}."
                else {
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_ONE_DATE_RANGE', {dateFrom: allowedDate.dateFrom, dateTo:allowedDate.dateTo});
                }
            }
            else {
                //CASE 3 ==> More than one allowed periods and the period we are checking is a data range and is not the last of the list: should return "from {{dateFrom}} to {{dateTo}},"
                if(allowedDate.dateFrom !== allowedDate.dateTo && this.flexibilizationInfoDates.allowedPeriods.length-1 !== index) {
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_MORE_THAN_ONE_DATE_RANGE_1', {dateFrom: allowedDate.dateFrom, dateTo:allowedDate.dateTo});
                }
                //CASE 4 ==> More than one allowed periods and the period we are checking is a data range and is the last of the list: should return "and from {{dateFrom}} to {{dateTo}}."
                else if(allowedDate.dateFrom !== allowedDate.dateTo && this.flexibilizationInfoDates.allowedPeriods.length-1 === index){
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_MORE_THAN_ONE_DATE_RANGE_2', {dateFrom: allowedDate.dateFrom, dateTo:allowedDate.dateTo});
                }
                //CASE 5 ==> More than one allowed periods and the period we are checking is single day and is not the last of the list: should return "from {{date}},"
                else if(allowedDate.dateFrom === allowedDate.dateTo && this.flexibilizationInfoDates.allowedPeriods.length-1 !== index) {
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_MORE_THAN_ONE_DATE_RANGE_3', {date: allowedDate.dateFrom});
                }
                //CASE 6 ==> More than one allowed periods and the period we are checking is single day and is the last of the list: should return " and from {{date}}."
                else if(allowedDate.dateFrom === allowedDate.dateTo && this.flexibilizationInfoDates.allowedPeriods.length-1 === index){
                    allowedDate.text = this.$filter('translate')('MMB_FLEXIBILIZATION_INFO_ALLOWED_MORE_THAN_ONE_DATE_RANGE_4', {date: allowedDate.dateFrom});
                }

            }
        });
        return allowedDates;
    }
}

