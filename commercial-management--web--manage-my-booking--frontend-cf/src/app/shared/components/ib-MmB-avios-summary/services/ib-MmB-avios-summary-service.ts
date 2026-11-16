import { Inject, Injectable } from '@angular/core';
import { AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { IbMmbAviosSummaryTransformer } from './ib-MmB-avios-summary-transformer';
import { ibMmbCalculatePointsService } from '@src/components/services/ib-calculate-points-service';

@Injectable({
    providedIn: 'root',
})
export class IbMmbAviosSummaryService {
    flowApp: string;

    constructor (
        private ibMmbCalculatePointsService: ibMmbCalculatePointsService,
        private IbMmbAviosSummaryTransformer: IbMmbAviosSummaryTransformer,
        private localStorageService: CommonsSessionStorageService,
        @Inject(AJSRootScope) public $rootScope: CommonsRootScope
    ) {
        this.flowApp = this.localStorageService.get('flowApp');
    }

    getCalculateAviosSummary = (request) => {
        if (this.flowApp === 'MMB' || this.flowApp === 'MMBANC') {
            return new Promise((resolve, reject) => {
                this.ibMmbCalculatePointsService.getCalculateAviosAncillaries(this.IbMmbAviosSummaryTransformer.generateReqAviosSummaryModel(request)).then(
                    (response) => {
                        let aviosSummary = this.IbMmbAviosSummaryTransformer.generateResAviosSummaryModel(response, this.flowApp);
                        this.localStorageService.set('CalculatedPoints', { Avios: aviosSummary.totalAvios, Elite: aviosSummary.totalPoints });
                        this.$rootScope.$broadcast('updateAvios');
                        resolve(aviosSummary);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        } else {
            return new Promise((resolve, reject) => {
                this.ibMmbCalculatePointsService.getCalculateAviosSummary(this.IbMmbAviosSummaryTransformer.generateReqAviosSummaryModel(request)).then(
                    (response) => {
                        let aviosSummary = this.IbMmbAviosSummaryTransformer.generateResAviosSummaryModel(response, this.flowApp);
                        this.localStorageService.set('CalculatedPoints', { Avios: aviosSummary.totalAvios, Elite: aviosSummary.totalPoints });
                        this.$rootScope.$broadcast('updateAvios');
                        resolve(aviosSummary);
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });
        }
    };
}
