import * as angular from 'angular';
import { LetMeKnowService } from '@shared/http-services/cmlm-lpm/ib-let-me-know-service';

export class NotAvaibilityService {
    constructor (
        private LetMeKnowService: LetMeKnowService
    ) {}
    /**
    * Gets complete customer information from its rest service.
    * @returns {Object.<Promise>} - returns a promise. When the promise resolves, it returns received data.
    *  When the promise rejects, it returns an object with the error data to show in the view
    */
    sendAlertLetMeKnow = (postData) => {
        return new Promise((resolve, reject) => {
            this.LetMeKnowService.sendAlert(postData).then(
                (data)=>{
                    resolve(data);
                },
                (error) =>{
                    reject(error);
                });
        });
    };
}
NotAvaibilityService.$inject = ['LetMeKnowService'];
try {
    const mod = angular.module('ib-not-avaibility-module');
    mod.service(
        'NotAvaibilityService',
        NotAvaibilityService
    );
} catch (error) {
    const mod = angular.module('ib-not-avaibility-module', []);
    mod.service(
        'NotAvaibilityService',
        NotAvaibilityService
    );
}
