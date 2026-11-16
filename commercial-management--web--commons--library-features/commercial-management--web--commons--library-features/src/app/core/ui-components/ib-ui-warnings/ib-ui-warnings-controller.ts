@Component(
    "ib-ui-warnings-module",
    "ibUiWarnings",
    {
    bindings: {
    type: '=?',
    icon: '=?',
    titleTxt: '=',
    linkText: '=?',
    text: '=?',
    modifier: '=?',
    titleModifier: '=?',
    buttonText: '=?',
    textBeforeLink: '=?',
    textLink: '=?',
    actionButton: '=',
    actionAccess: '=',
    backgroundModifier: '=?',
    modClass: '=?',
    textModifier: '=?',
    urlLink: '=?',
    classSimpleColor: '=?'
    },
    controllerAs: "uiWarnCtrl",
    templateUrl: [
    "$rootScope",
    ($rootScope: CommonsRootScope) => {
    return `${$rootScope.routes.templates}ib-ui-warnings-view.html`;
    },
    ],
    },
    [],
    [],
)
class IbUiWarningsController implements ng.IController {
    public type: string;
    public icon: string;
    public titleTxt: string;
    public linkText: string;
    public text: string;
    public modifier: string;
    public titleModifier: string;
    public buttonText: string;
    public textBeforeLink: string;
    public textLink: string;
    public backgroundModifier: string;
    public urlLink: string;
    public classSimpleColor: string;

    constructor () {}
}
