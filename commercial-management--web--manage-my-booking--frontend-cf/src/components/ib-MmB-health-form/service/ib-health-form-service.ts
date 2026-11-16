import * as angular from 'angular';

@Service('ib-health-form-module', ['CommonsGenericProxy', 'MmBAppConstants'])
export class HealthFormService {
    constructor (private CommonsGenericProxy:CommonsGenericProxy, private MmBAppConstants){

    }

    callHealthFormService (flowId:string, passengerId:string) {
        const config = {
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Content-Type': 'text/html;charset=UTF-8',
                'Accept-Encoding':'gzip, deflate, br',
                'newConfig': true,
                'Access-Control-Allow-Origin': '*'
            }
        };

        this.CommonsGenericProxy.postRedirectNewTab(this.MmBAppConstants.salesforceHealthFormURI,
            `{"flowid":"${flowId}", "passengerId":"${passengerId}"}`,
            config);
    }

    getHealthFormURL = (flowId:string) => {

        return this.CommonsGenericProxy.postGeneric(this.MmBAppConstants.salesforceHealthFormURI,
            {'flowId':flowId});
        // return new Promise((resolve, reject)=>{
        //     resolve({flowId, passengers:[{passengerId: 'ADULT_01', url: 'asd'}, {passengerId: 'ADULT_02', url: 'qwe'}]});
        // });
    };
}
