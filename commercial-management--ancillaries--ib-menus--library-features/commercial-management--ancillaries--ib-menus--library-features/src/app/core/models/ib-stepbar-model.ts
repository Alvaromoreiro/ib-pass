namespace StepBarModel {
    export type StepBarRequest = {
        onLogin: ()=>void,
        onError: ()=>void,
        afterLogin: ()=>void
    };
}