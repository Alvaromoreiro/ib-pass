import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {downgradeToAJSComponent} from 'ib-web-commons/utils';
import {IbAvatarStoreService, IbCUserStoreRepositoryService} from 'ib-web-commons/services';
import {filter, Subject, Subscription, takeUntil, map} from 'rxjs';
import {IberiaONBUser, IberiaPlusUser, IberiaWebUser, IberiaZeroUser} from 'ib-web-commons/models';
import {
    IbOnBusinessMembershipResponse
} from 'ib-web-commons/app/core/models/http-services/cmlm-mbm/ib-commons-on-business-membership.model';


@Component({
    selector: 'ib-user-info-header',
    templateUrl: './ib-user-info-header.component.html',
    styleUrls: ['./ib-user-info-header.component.scss']
})
export class IbUserInfoHeaderComponent implements OnInit, OnDestroy {

    public imageSrc: SafeUrl | undefined;
    public userData: IberiaPlusUser | IberiaZeroUser | IberiaONBUser | undefined;
    public isIbZero: boolean;
    public isOnb: boolean;
    public roleOnb: IbOnBusinessMembershipResponse;
    public isLogged: boolean;
    public name: string | undefined;
    public isUserDataLoading: boolean = true;
    @Input() public isGreyBar: boolean;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private avatarSubscription?: Subscription;

    constructor (
        private avatarStoreService: IbAvatarStoreService,
        private userStoreService: IbCUserStoreRepositoryService
    ) {
    }

    ngOnInit (): void {
        this.getUserData();
        if (this.isOnb) {
            this.getOnbUserDataFromLocalStorage();
        }
    }

    /**
     * @description [CPA-187]  Gets the avatar from the store and subscribes to any change of the avatar store.
     * If error or no body, shows the default avatar filler.
     */
    getAvatarImageSrc () {
        this.avatarSubscription?.unsubscribe();
        this.avatarSubscription = this.avatarStoreService.getAvatar()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (imageSrc) => this.imageSrc = imageSrc,
                error: () => {
                    this.imageSrc = undefined;
                }
            });
    }

    getOnbUserDataFromLocalStorage (): void {
        if (sessionStorage.getItem('ib-booking-app.membershipData')) {
            this.roleOnb = JSON.parse(sessionStorage.getItem('ib-booking-app.membershipData'));
        }
    }

    getUserData () {
        this.userStoreService.getUserState()
            .pipe(
                filter((res) => !res.isLoading),
                map(res => res.value),
                filter((res): res is IberiaPlusUser | IberiaZeroUser | IberiaONBUser => res.appUserInfo.logged),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (res) => {
                    this.isLogged = res.appUserInfo.logged;
                    this.userData = res;
                    this.name = res.personalInfo.name
                        ? `${res.personalInfo.name ?? ''} ${res.personalInfo.surname ?? ''}`.trim()
                        : res.personalInfo.email;
                    this.isIbZero = res.appUserInfo.userType === 'IB_ZERO';
                    this.isOnb = res.appUserInfo.userType === 'ONB';
                    this.isUserDataLoading = false;
                    if (!this.isOnb) {
                        this.getAvatarImageSrc();
                    }
                },
                error: () => {
                    this.userData = undefined;
                }
            });
    }

    /**
     * @description [CPA-187] Unsubscribe from active subscriptions and deletes cached avatar url.
     */
    ngOnDestroy () {
        this.destroy$.next(true);
        this.avatarStoreService.deleteAvatarURL();
    }

}

downgradeToAJSComponent('ibUserInfoHeader', {component: IbUserInfoHeaderComponent, inputs: []}, 'ib-user-info-module');
