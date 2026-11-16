import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import {
    Component,
    Input,
    ContentChildren,
    QueryList,
    ElementRef,
    ChangeDetectorRef,
    ChangeDetectionStrategy, AfterContentInit, OnDestroy, EventEmitter, Output
} from '@angular/core';
import {
    IbPlusAccordionTabComponent
} from '@shared/components/ib-plus-accordion/ib-plus-accordion-tab/ib-plus-accordion-tab.component';
import { Subscription } from 'rxjs';
/**
 * Ib Plus Accordion general component with Iberia Styles and logic.
 * @example
 * <ib-plus-accordion>
 *     <ib-plus-accordion-tab header="KEY">CONTENT</ib-plus-accordion-tab>
 * </ib-plus-accordion>
 * @see https://app.zeplin.io/project/5a8ed1c912e091128c5967c5/screen/5db06e054fd65212671f1921
 */
@Component({
    selector: 'ib-plus-accordion',
    templateUrl: './ib-plus-accordion.component.html',
    styleUrls: ['./ib-plus-accordion.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IbPlusAccordionComponent implements AfterContentInit, OnDestroy {

    /**
     * Property to open all tabs of the accordion at the same time.
     * By default, all will be closed.
     */
    @Input() multiple = false;

    /**
     * Event emitted when any tab is closed.
     */
    @Output() closed = new EventEmitter<{ originalEvent: Event, index: number }>();
    /**
     * Event emitted when any tab is opened.
     */
    @Output() opened = new EventEmitter<{ originalEvent: Event, index: number }>();

    @Input() style: Record<string, string | number> | undefined;
    @Input() styleClass: string | undefined;
    @Input() expandIcon = 'icon-flecha_1_abajo';
    @Input() collapseIcon = 'icon-flecha_1_arriba';

    /**
     * List of all tab panels nested inside this accordion.
     */
    @ContentChildren(IbPlusAccordionTabComponent) tabList!: QueryList<IbPlusAccordionTabComponent>;

    /**
     * Double binding number or array of all the actives tabs opened. Do not recommend to use this to modify
     * the behaviour. Use closed/opened event or
     */
    @Input() get activeIndex (): number[] | number | null | undefined {
        return this.activedIndex;
    }
    set activeIndex (value: number[] | number | null | undefined) {
        this.activedIndex = value;
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }
        this.updateSelectionState();
    }
    @Output() activeIndexChange = new EventEmitter<number | number[] | null>();

    private preventActiveIndexPropagation = false;
    private activedIndex: number[] | number | null | undefined;
    private tabListSubscription: Subscription | undefined;
    public tabs: IbPlusAccordionTabComponent[] = [];

    constructor (public el: ElementRef, public changeDetector: ChangeDetectorRef) {}

    /**
     * When the view is init, load the accordion tab status and subscribe to changes to the number of tabs in view.
     */
    ngAfterContentInit () {
        this.initTabs();
        this.tabListSubscription = this.tabList.changes.subscribe(() => {
            this.initTabs();
        });
    }



    /**
     * Load the accordion tabs, and update the status of the tabs. Mark for detection changes because OnPush strategy.
     */
    initTabs (): void {
        this.tabs = this.tabList.toArray();
        this.updateSelectionState();
        this.changeDetector.markForCheck();
    }

    /**
     * Update the actual view state of the component when any change to active tabs.
     */
    updateSelectionState () {
        if (this.tabs?.length && this.activedIndex !== null && this.activedIndex !== undefined ) {
            this.tabs.forEach((tab, i) => {
                const selected = this.multiple ? (this.activedIndex as number[]).includes(i) : i === this.activedIndex;
                const changed = selected !== tab.selected;

                if (changed) {
                    tab.selected = selected;
                    tab.selectedChange.emit(selected);
                    tab.changeDetector.markForCheck();
                }
            });
        }
    }

    /**
     * Update the active index property, when the content changes by user behaviour.
     */
    updateActiveIndex () {
        let index: number | number[] | null = this.multiple ? [] : null;
        this.tabs.forEach((tab, i) => {
            if (tab.selected) {
                if (this.multiple && typeof index !== 'number' && index !== null) {
                    index.push(i);
                } else {
                    index = i;
                }
            }
        });
        this.preventActiveIndexPropagation = true;
        this.activeIndexChange.emit(index);
    }


    /**
     * Destroy subscription of tabs
     */
    ngOnDestroy () {
        if (this.tabListSubscription) {
            this.tabListSubscription.unsubscribe();
        }

    }

}

downgradeToAJSComponent(
    'ibPlusAccordion',
    {
        component: IbPlusAccordionComponent,
        inputs: [
            'multiple',
            'activeIndex',
            'style',
            'styleClass',
            'expandIcon',
            'collapseIcon'
        ]
    },
    'ib-shared-components-module'
);
