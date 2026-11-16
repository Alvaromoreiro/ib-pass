import { Injectable } from '@angular/core';
import { BookingHeaderConstants } from '../../ib-booking-header-constants';
import { HeaderDataStepsModel, HeaderStepsModel } from '@src/app/core/models/ib-booking-availability/header-model';

@Injectable({providedIn: 'root'})
export class BookingHeaderStepsTransformerService {
    constructor () { }
    public initSteps ( stepsModel: HeaderStepsModel ): HeaderDataStepsModel {
        let model: HeaderDataStepsModel = <HeaderDataStepsModel> {};
        if ( stepsModel.hasSteps ) {
            model.steps = stepsModel.steps ? BookingHeaderConstants[ stepsModel.steps ] : BookingHeaderConstants.DEFAULT_STEPS;
            model.currentStep = model.steps.find(step => step.page === stepsModel.position) || model.steps[0];
        } else model = null;
        return model;
    }
}
