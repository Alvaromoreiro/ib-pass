import { StepModalControl, StepsControlModalComponent } from "@src/app/shared/components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component";
import { IbModalRef } from "ib-web-commons/dist/ib-modal";

export class StepsControlServiceMock {

    public mustReject: boolean = false;
    public showStepsControlModal = jasmine.createSpy('showStepsControlModal').and.callFake(({ nextStep, currentStep }: StepModalControl) => {
        return {
            result: this.mustReject ? Promise.reject() : Promise.resolve()
        } as IbModalRef<StepsControlModalComponent>;
    });
}