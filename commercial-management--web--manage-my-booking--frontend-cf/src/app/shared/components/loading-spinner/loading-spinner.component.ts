import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { LoadingSpinner } from "commercial-management--digital--web-components-design--library";
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { LoadingSpinnerService } from './loading-spinner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: "loading-spinner-react",
    template: `
    <ng-react *ngIf="showLoading" [component]="loadingComponent" [props]="loadingProps"> </ng-react>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
    @Input() text: string = "Loading..."
    @Input() size: "small" | "medium" | "big" | "extra-big" = "big"
    @Input() variant: "light" | "dark" = "dark"
    @Input() orientation: "horizontal" | "vertical" = "horizontal"
    @Input() className: string = "ib-react-loading-spinner"

    constructor(private LoadingSpinnerService: LoadingSpinnerService, private cdr: ChangeDetectorRef) { }

    protected readonly loadingComponent = LoadingSpinner;
    showLoading: boolean = this.LoadingSpinnerService.isLoading();
    private destroy$ = new Subject<void>();

    get loadingProps() {
        return {
            children: this.text,
            size: this.size,
            variant: this.variant,
            orientation: this.orientation,
            className: this.className,
        };
    }

    ngOnInit(): void {
        this.LoadingSpinnerService.loading$
            .pipe(takeUntil(this.destroy$))
            .subscribe(isLoading => {
                this.showLoading = isLoading;
                this.cdr.markForCheck();
                this.controlBodyScroll(isLoading);
            });
        
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    controlBodyScroll(isLoading: boolean): void {
        if (isLoading) {
            document.body.classList.add("u-overflow-hidden");
        } else {
            document.body.classList.remove("u-overflow-hidden");
        }
    }
}

downgradeToAJSComponent(
    'loadingSpinnerReact',
    {
        component: LoadingSpinnerComponent,
        inputs: [
            'text',
            'size',
            'variant',
            'orientation',
            'className'
        ]
    },
    'ib-shared-components-module'
);
