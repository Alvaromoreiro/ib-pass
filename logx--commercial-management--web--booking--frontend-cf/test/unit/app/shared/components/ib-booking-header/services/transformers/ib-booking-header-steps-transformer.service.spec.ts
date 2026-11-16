import { TestBed } from "@angular/core/testing";
import { BookingHeaderConstants } from "@shared/components/ib-booking-header/ib-booking-header-constants";
import { BookingHeaderStepsTransformerService } from "@shared/components/ib-booking-header/services/transformers/ib-booking-header-steps-transformer.service";

let service: BookingHeaderStepsTransformerService;
describe('Test BookingHeaderStepsTransformerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [],
            schemas: [],
            providers: [],
        });
        service = TestBed.inject(BookingHeaderStepsTransformerService);
    });

    describe('Test init steps', () => {
        it('when hasSteps true and there is no steps or position', () => {
            const result = service.initSteps({ hasSteps: true } as any);
            expect(result).toEqual(
                {
                    steps: BookingHeaderConstants.DEFAULT_STEPS,
                    currentStep: BookingHeaderConstants.DEFAULT_STEPS[0]
                }
            )
        })
        it('when hasSteps true and there is input', () => {
            const result = service.initSteps({ hasSteps: true, steps: 'DEFAULT_STEPS', currentStep: BookingHeaderConstants.DEFAULT_STEPS[0] } as any);
            expect(result).toEqual(
                {
                    steps: BookingHeaderConstants.DEFAULT_STEPS,
                    currentStep: BookingHeaderConstants.DEFAULT_STEPS[0]
                } 
            )
        })
        it('when hasSteps false', () => {
            const result = service.initSteps({ hasSteps: false, steps: 'DEFAULT_STEPS', page: BookingHeaderConstants.DEFAULT_STEPS[0].page } as any);
            expect(result).toBeNull();
        })
    })
})
