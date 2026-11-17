import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { AJSRootScope } from "ib-web-commons/utils";

import { IbTicketSelectionComponent } from "./ib-ticket-selection.component";
import { RootScopeMock } from "@test/class/RootScopeMock";
import { AJSWindow } from "@src/app/core/config/ib-checkin-app-tokens";
import { AJSCheckForDeepLink } from "@src/app/shared/services/bridges/ib-check-for-deeplink-bridge.service";
import { AJSCommonsUtilService } from "@src/app/shared/services/bridges/ib-commons-util-bridge.service";
import { createCheckInStatusTime, getMockSelectionInfo } from "./mocks/ib-selection-info.mock";
import { IbUtilsService } from '@src/app/shared/services/ib-utils/ib-utils.service';
import { ElementRef, Pipe } from "@angular/core";
import dayjs from "dayjs";
import { CommonsUtilService } from "ib-web-commons/app/core/utils/ib-commons-utils-service";
import { CheckinAppConstants } from "@src/components/routing/ib-check-in-constants";

const fakeRootScope = new RootScopeMock();
const fakeWindow = jasmine.createSpyObj('$window', ['location']);
const fakeCommonsUtilService = jasmine.createSpyObj<CommonsUtilService>('CommonsUtilService', ['translateTextAndAddVariablesArray']);
const fakeCheckForDeepLink = jasmine.createSpyObj('CheckForDeepLink', ['checkDeepLink']);
const fakeTranslateService = jasmine.createSpyObj<Partial<TranslateService>>('translateService', ['instant', 'get']);
const fakeIbUtilsService: jasmine.SpyObj<IbUtilsService> = jasmine.createSpyObj('IbUtilsService', ['getDeviceType', 'getBpSubscriptionMode', 'isCC']);

const DATE_VARIABLES = ['#dd#', '#mm#', '#hh#'];
const LITERALS = {
    OPEN: 'IBCOAC_TICKET_OPEN_TEXT',
    AVAILABLE: 'IBCOAC_CK_PASS_ABIERTO',
    SELECTABLE: 'IBCOAC_CK_TICKET_GDR',
    CHECKED_AIRCHECK: 'IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK',
    DEEPLINK: 'IBCOAC_TICKET_DEEPLINK_TEXT',
    NOT_AVAILABLE: 'IBCOAC_PA_SEGMENT_FOOTER_UNCHECKABLE',
    CHECKIN_LESS_THAN_24H: 'IBCOAC_TICKET_CHECKIN_STATUS_TIME_OPEN_LESS_THAN_24h',
    CHECKIN_MORE_THAN_24H: 'IBCOAC_TICKET_CHECKIN_STATUS_TIME_OPEN_MORE_THAN_24h',
    SUBSCRIPTION_AVAILABLE: 'IBCOAC_CK_PASS_ABIERTO_BP_SUBSCRIPTION',
    SUBSCRIPTION_CHECKED: 'IBCOAC_TICKET_CHECKED_TEXT_BP_SUBSCRIPTION'
};
const NOT_ALLOWED_REASONS = [
    'DEPARTURE_EARLY_NOT_ALLOWED',
    'ARRIVAL_EARLY_NOT_ALLOWED'
];

@Pipe({
    name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
    public name: string = "translate";

    public transform(query: string, ...args: unknown[]): string {
        return query;
    }
}

describe('IbTicketSelectionComponent', () => {
    let component: IbTicketSelectionComponent;
    let fixture: ComponentFixture<IbTicketSelectionComponent>;
    let mockSelectionInfo: CkiSegmentsSelected.Segment = getMockSelectionInfo();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                IbTicketSelectionComponent,
                TranslatePipeMock
            ],
            providers: [
                { provide: AJSRootScope, useValue: fakeRootScope },
                { provide: AJSWindow, useValue: fakeWindow },
                { provide: AJSCommonsUtilService, useValue: fakeCommonsUtilService },
                { provide: AJSCheckForDeepLink, useValue: fakeCheckForDeepLink },
                { provide: TranslateService, useValue: fakeTranslateService },
                { provide: IbUtilsService, useValue: fakeIbUtilsService }
            ],
            imports: [TranslateModule.forRoot()]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(IbTicketSelectionComponent);
        component = fixture.componentInstance;

        mockSelectionInfo = getMockSelectionInfo();

        component.selectionInfo = mockSelectionInfo;
        component.index = 0;

        fixture.detectChanges();

        fakeRootScope.$broadcast.calls.reset();
        fakeCommonsUtilService.translateTextAndAddVariablesArray.and.returnValue('Translated message');
        fakeTranslateService.instant.and.callFake((literal) => literal);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Segment events', () => {
        [
            {
                method: 'checkSelectedSegments',
                eventName: 'checkSelectedSegmentsEvent',
                value: 0
            },
            {
                method: 'selectShuttleSegment',
                eventName: 'selectShuttleSegmentEvent',
                value: mockSelectionInfo
            }
        ].forEach(({ method, eventName, value }) => {
            it('emits ' + eventName, function () {
                if (method === 'checkSelectedSegments') {
                    component.checkbox = { nativeElement: { checked: true } } as ElementRef<HTMLInputElement>;
                }

                component[method]();

                expect(fakeRootScope.$broadcast).toHaveBeenCalledWith(eventName, value);
                if (method === 'checkSelectedSegments') {
                    expect(component.checkbox.nativeElement.checked).toBe(mockSelectionInfo.isSelected);
                }
            });
        });
    });

    describe('goToUrlCompany', () => {
        beforeEach(() => {
            component.selectionInfo = getMockSelectionInfo({
                deepLinkInformation: {
                    externalUrl: 'https://company.example.com',
                    externalMobileUrl: 'https://m.company.example.com'
                }
            });
        });

        [
            {
                deviceType: 'desktop',
                expectedUrl: 'https://company.example.com'
            },
            {
                deviceType: 'mobile',
                expectedUrl: 'https://m.company.example.com'
            }
        ].forEach(function (testCase) {
            it('navigates to the correct URL for ' + testCase.deviceType, function () {
                fakeIbUtilsService.getDeviceType.and.returnValue(testCase.deviceType as ReturnType<IbUtilsService['getDeviceType']>);

                component.goToUrlCompany();

                expect(fakeWindow.location.href).toBe(testCase.expectedUrl);
            });
        });
    });

    describe('showCheckInStatusTime', function () {
        [
            {
                description: 'the segment is available',
                overrides: {
                    segmentStatus: 'AVAILABLE'  as CkiSegmentsSelected.TSegmentStatus
                }
            },
            {
                description: 'the time window is invalid',
                overrides: {
                    checkInStatusTime: createCheckInStatusTime(
                        dayjs().add(12, 'hour'),
                        'INVALID'
                    )
                }
            }
        ].forEach(({ description, overrides }) => {
            it('hides the message when ' + description, function () {
                component.selectionInfo = getMockSelectionInfo(overrides);

                const result = component.showCheckInStatusTime();

                expect(result).toBeFalse();
                expect(component.checkInStatusTime.show).toBeFalse();
                expect(fakeCommonsUtilService.translateTextAndAddVariablesArray).not.toHaveBeenCalled();
            });
        });

        [
            {
                reason: NOT_ALLOWED_REASONS[0],
                hoursUntilOpening: 12,
                window: 'OPEN',
                literal: LITERALS.CHECKIN_LESS_THAN_24H
            },
            {
                reason: 'OTHER_REASON',
                hoursUntilOpening: 48,
                window: 'CLOSE',
                literal: LITERALS.CHECKIN_MORE_THAN_24H
            },
            {
                reason: NOT_ALLOWED_REASONS[1],
                hoursUntilOpening: 48,
                window: 'OPEN',
                literal: LITERALS.CHECKIN_MORE_THAN_24H
            }
        ].forEach(({ reason, hoursUntilOpening, window, literal }) => {
            it('shows the correct check-in message for ' + reason, function () {
                const openDate = dayjs().add(hoursUntilOpening, 'hour');

                component.selectionInfo = getMockSelectionInfo({
                    segmentStatusReasonCode: reason,
                    checkInStatusTime: createCheckInStatusTime(openDate, window)
                });

                const result = component.showCheckInStatusTime();

                expect(result).toBeTrue();
                expect(component.checkInStatusTime.show).toBeTrue();
                expect(component.checkInStatusTime.message).toBe('Translated message');

                expect(fakeCommonsUtilService.translateTextAndAddVariablesArray).toHaveBeenCalledWith(
                    literal,
                    [
                        openDate.format('DD'),
                        openDate.format('MM'),
                        openDate.format('HH:mm')
                    ],
                    DATE_VARIABLES
                );
            });
        });
    });

    describe('openSegmentInfo', () => {
        it('should call $broadcast if deeplink show is false', () => {
            component.openSegmentInfo();

            expect(fakeRootScope.$broadcast).toHaveBeenCalledWith('openSegmentInfoEvent', mockSelectionInfo.segmentStatusReason);
        });

        it('should call checkDeepLink with deepLinkInformation if show is true', () => {
            const mockSelectionInfo = getMockSelectionInfo({
                deepLinkInformation: {
                    externalMobileUrl: 'url'
                }
            });
            component.selectionInfo = mockSelectionInfo;
            component.deeplink.show = true;

            component.openSegmentInfo();

            expect(fakeCheckForDeepLink.checkDeepLink).toHaveBeenCalledWith(mockSelectionInfo.deepLinkInformation);
        });
    });

    describe('infoSegment', () => {
        it('should update showAirChecMessage if is airCheck flight', () => {
            mockSelectionInfo = getMockSelectionInfo({
                segmentStatus: 'AVAILABLE',
                airCheck: {
                    status: true,
                    url: 'aircheck'
                }
            });

            component.selectionInfo = mockSelectionInfo;

            component.infoSegment();

            expect(component.showAircheckMessage).toBe(true);
        });

        it('should return OPEN literal if is open type', () => {
            mockSelectionInfo.detailedType = 'OPEN';

            const result = component.infoSegment();

            expect(result).toBe('IBCOAC_TICKET_OPEN_TEXT');
        });

        [
            {
                testCase: 'should return deeplink literal and update deeplink object if exists',
                description: 'description',
                expectedDescription: 'description'
            },
            {
                testCase: 'should set default value for deeplink.companyDescription if not exists the external company description',
                description: '',
                expectedDescription: 'IBCOAC_PA_SEGMENT_FOOTER_UNCHECKABLE_MORE'
            }
        ].forEach(({ testCase, description, expectedDescription }) => {
            it(testCase, () => {
                mockSelectionInfo.deepLinkInformation = {
                    externalCompany: {
                        code: 'external',
                        description
                    }
                };
                const result = component.infoSegment();

                expect(result).toBe('IBCOAC_TICKET_DEEPLINK_TEXT');
                expect(component.deeplink).toEqual({
                    show: true,
                    companyDescription: expectedDescription
                });
            });
        });

        [
            {
                testCase: 'should return IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK literal if segmentStatus is checked and exists aircheck',
                segmentStatus: 'CHECKED' as CkiSegmentsSelected.TSegmentStatus,
                inhibitBoardingCardReason: [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.AIRCHECK_REASON],
                expectedLiteral: 'IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK'
            },
            {
                testCase: 'should return IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK literal if segmentStatus is checked and exists aircheck but is BOKO_AIRCHECK_REASON',
                segmentStatus: 'CHECKED' as CkiSegmentsSelected.TSegmentStatus,
                inhibitBoardingCardReason: [CheckinAppConstants.INHIBIT_BOARDING_CARD_TYPES.BOKO_AIRCHECK_REASON],
                expectedLiteral: 'IBCOAC_TICKET_CHECKED_TEXT_AIRCHECK'
            }
        ].forEach(({ testCase, segmentStatus, inhibitBoardingCardReason, expectedLiteral }) => {
            it(testCase, () => {
                mockSelectionInfo.segmentStatus = segmentStatus;
                mockSelectionInfo.passengersStatus[0].inhibitBoardingCard.reason = inhibitBoardingCardReason;

                const result = component.infoSegment();

                expect(result).toBe(expectedLiteral);
            });
        });

        it('should return an empty literal if not exists the segmentStatus in the literals map', () => {
            mockSelectionInfo.segmentStatus = 'TEST' as CkiSegmentsSelected.TSegmentStatus;

            const result = component.infoSegment();

            expect(result).toBe('');
        });

        [
            {
                testCase: 'should return \'IBCOAC_TICKET_SUBSCRIPTION_AVAILABLE\' literal if segmentStatus is available and is bp subscription mode',
                segmentStatus: 'AVAILABLE' as CkiSegmentsSelected.TSegmentStatus,
                isBpSubscriptionMode: true,
                expectedLiteral: LITERALS.SUBSCRIPTION_AVAILABLE
            },
            {
                testCase: 'should return \'IBCOAC_TICKET_CHECKED_TEXT_BP_SUBSCRIPTION\' literal if segmentStatus is checked and is bp subscription mode',
                segmentStatus: 'CHECKED' as CkiSegmentsSelected.TSegmentStatus,
                isBpSubscriptionMode: true,
                expectedLiteral: LITERALS.SUBSCRIPTION_CHECKED
            }
        ].forEach(({ testCase, segmentStatus, isBpSubscriptionMode, expectedLiteral }) => {
            it(testCase, () => {
                component.isBpSubscriptionMode = isBpSubscriptionMode;
                mockSelectionInfo = getMockSelectionInfo({
                    segmentStatus: segmentStatus,
                    passengersStatus: [{
                        id: 1,
                        status: 'CHECKED',
                        inhibitBoardingCard: {
                            reason: []
                        }
                    } as CkiSegmentsSelected.PassengersStatus]
                });
                component.selectionInfo = mockSelectionInfo;

                const result = component.infoSegment();

                expect(result).toBe(expectedLiteral);
            });
        });
    });

    describe('getTitle', () => {
        it('should return the default title if the segmentStatus not exists', () => {
            mockSelectionInfo.segmentStatus = 'TEST' as CkiSegmentsSelected.TSegmentStatus;

            const result = component.getTitle();

            expect(result).toBe('');
        });
    });

    describe('getTitleClasses', () => {
        [
            {
                testCase: 'should return the correct title classes for AVAILABLE segmentStatus',
                segmentStatus: 'AVAILABLE' as CkiSegmentsSelected.TSegmentStatus,
                isBpSubscriptionMode: false,
                expectedClasses: ['icon-despegue', '', '']
            },
            {
                testCase: 'should return the correct title classes for CHECKED segmentStatus and isBpSubscriptionMode true',
                segmentStatus: 'CHECKED' as CkiSegmentsSelected.TSegmentStatus,
                isBpSubscriptionMode: true,
                expectedClasses: ['icon-despegue', 'success-title', 'show section-title']
            },
            {
                testCase: 'should return the correct title classes for CHECKED segmentStatus and isBpSubscriptionMode false',
                segmentStatus: 'CHECKED' as CkiSegmentsSelected.TSegmentStatus,
                isBpSubscriptionMode: false,
                expectedClasses: ['icon-confirmacion', '', '']
            }
        ].forEach(({ testCase, segmentStatus, isBpSubscriptionMode, expectedClasses }) => {
            it(testCase, () => {
                mockSelectionInfo.segmentStatus = segmentStatus;
                component.isBpSubscriptionMode = isBpSubscriptionMode;

                const result = component.getTitleClasses();

                expect(result).toEqual(expectedClasses);
            });
        });
    });

    describe('constructor', () => {
        [
            {
                isBpSubscriptionMode: false,
                isCC: false,
                expectedContentHidden: false
            },
            {
                isBpSubscriptionMode: true,
                isCC: false,
                expectedContentHidden: true
            },
            {
                isBpSubscriptionMode: false,
                isCC: true,
                expectedContentHidden: true
            },
            {
                isBpSubscriptionMode: true,
                isCC: true,
                expectedContentHidden: true
            }
        ].forEach(({ isBpSubscriptionMode, isCC, expectedContentHidden }) => {
            it(`initializes subscription=${isBpSubscriptionMode}, call-center=${isCC}`, () => {
                fakeIbUtilsService.getBpSubscriptionMode.and.returnValue(isBpSubscriptionMode);
                fakeIbUtilsService.isCC.and.returnValue(isCC);
                fakeIbUtilsService.getBpSubscriptionMode.calls.reset();
                fakeIbUtilsService.isCC.calls.reset();

                const constructorFixture = TestBed.createComponent(IbTicketSelectionComponent);
                const constructorComponent = constructorFixture.componentInstance;

                expect(constructorComponent.iconPaSrc).toBe('https://icons/puente_aereo/logo_pte_aero_short_es.png');
                expect(constructorComponent.isBpSubscriptionMode).toBe(isBpSubscriptionMode);
                expect(constructorComponent.isContentHidden).toBe(expectedContentHidden);
                expect(fakeIbUtilsService.getBpSubscriptionMode).toHaveBeenCalledTimes(1);
                if (isBpSubscriptionMode) {
                    expect(fakeIbUtilsService.isCC).not.toHaveBeenCalled();
                } else {
                    expect(fakeIbUtilsService.isCC).toHaveBeenCalledTimes(1);
                }
            });
        });
    });
});