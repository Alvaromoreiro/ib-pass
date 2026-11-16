import { FareIconMapConstants } from '@core/constants/ib-booking-fare-icons-map';
import { Component, Input, OnInit } from '@angular/core';

interface ConditionElement {
    condition: AvailabilityTransformerModel.Condition;
    icon: string;
}



@Component({
    selector: 'ib-booking-fare-summary',
    templateUrl: 'ib-booking-fare-summary.component.html',
    styleUrls: ['./ib-booking-fare-summary.component.scss']
})
export class IbBookingFareSummaryComponent implements OnInit{
    @Input() fareFamily : AvailabilityTransformerModel.FareFamilyCondition;
    @Input() planeType?: 'GOING' | 'RETURN' = null;
    /**Render conditions according to provided codes instead of regular filtering */
    @Input() renderConditionsSet?: Set<string> = null; 
    @Input() sliceInfo?: AvailabilityTransformerModel.SelectedSlice;
    public fareConditionsList: ConditionElement [] = [] ;
    constructor () {
    }
    ngOnInit (): void {
        this.setOrderedConditionsPriority();
    }

    private getFareFamilyConditionsMap = ()=> {
        const conditionsMap = new Map<string, ConditionElement>(); 
        this.fareFamily.conditions.forEach((condition) => {
            conditionsMap.set(condition.code, {condition, icon: FareIconMapConstants[condition.code]});
        });
        return conditionsMap;
    };

    private filterRenderCondition = (conditionElement: ConditionElement) => {
        if (!conditionElement) {
            return false;
        }
        if (this.renderConditionsSet) {
            return this.renderConditionsSet.has(conditionElement.condition.code);
        } 
        return conditionElement.condition.extendedInfo.conditionStatus;
    };



    private setOrderedConditionsPriority = () => {
        const conditionsMap = this.getFareFamilyConditionsMap();
        const orderedConditions = [];
        this.fareFamily.conditionsPriority.forEach((conditionCode) => {
            const element = conditionsMap.get(conditionCode);
            if (this.filterRenderCondition(element)) {
                orderedConditions.push(element);
            }
        });
        this.fareConditionsList = orderedConditions;
    };

}