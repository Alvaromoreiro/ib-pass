import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSService} from 'ib-web-commons/utils';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW_TOKEN } from '@src/app/core/config/ib-booking-app-tokens';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';


@Injectable({
    providedIn: 'root'
})
export class BookingPageUtilsService {
    private $document: Document;
    constructor (
        private TitleService: Title,
        private TranslateService: TranslateService,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(WINDOW_TOKEN) private $window: Window,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
        this.$document = this.$window.document;
    }

    isMobile = (): {general:boolean, header:boolean}  => {
        const isMobile: {general:boolean, header:boolean} = this.$rootScope.isMobile ?? {
            general: this.$window.innerWidth < 768,
            header: this.$window.innerWidth < 1024
        };
        const onResize = this.onResize.bind(this);
        this.$window.removeEventListener('resize', onResize);
        this.$window.addEventListener('resize', onResize);
        return isMobile;
    };
    private onResize () {
        this.$rootScope.isMobile = {
            general: this.$window.innerWidth < 768,
            header: this.$window.innerWidth < 1024
        };
        let size = '';
        if (this.$window.innerWidth < 480) {
            size = 'ibLoginSizeXS';
        } else if (this.$window.innerWidth < 768) {
            size = 'ibLoginSizeSM';
        } else {
            size = 'ibLoginSizeDesktop';
        }
        this.setLoginHeaderSize(size);
    }
    private setLoginHeaderSize (size: string) {
        const idLoginHeader = this.$document.getElementById('iframeloginId') as HTMLIFrameElement;
        const idLoginOthers = this.$document.getElementById('iframeReusableLoginId') as HTMLIFrameElement;
        (idLoginHeader?.contentWindow) && idLoginHeader.contentWindow.postMessage(size, '*');
        (idLoginOthers?.contentWindow) && idLoginOthers.contentWindow.postMessage(size, '*');
    }

    setPageTitle (title: string): void {
        this.TranslateService.get(title).subscribe((titleTranslated: string) => {
            this.TitleService.setTitle(titleTranslated);
        });
    }

    getDeviceType () {
        let width, deviceType = '';
        const channel = this.CommonsSessionStorageService.get('channel');
        if (channel === 'mobi') {
            deviceType = 'mobile';
        } else {
            width = this.$window.innerWidth;
            if (width != null) {
                if (width >= 1024) {
                    deviceType = 'desktop';
                } else if (width > 480 && width < 1024) {
                    deviceType = 'tablet';
                } else
                    deviceType = 'mobile';

            }
        }
        return deviceType;

    }
    getFooterModel = () => {
        const reservasPhone = this.$rootScope?.phonesList?.['RESERVAS'] ?? {};
        return { phoneInfo: { prefix: reservasPhone.prefix, 'phoneNumber': reservasPhone.telephone, 'text': reservasPhone.text } };
    };

    /**
    * Return oh hold background image.
    * @param {String} destinationCityCode -The destination city code
    * @returns {String} - the background image url that matches with its destination city code in the data on localStorage
    */
    getOHBackgroundURL = (destinationCityCode) => {
        let imageResolution = this.$window.innerWidth > 1024 ?
            BookingAppConstants.ONHOLD.DESTINATION_IMAGE_SIZE.desktop :
            (this.$window.innerWidth > 480 && this.$window.innerWidth < 1024) ?
                BookingAppConstants.ONHOLD.DESTINATION_IMAGE_SIZE.tablet :
                this.$window.innerWidth < 481 ?
                    BookingAppConstants.ONHOLD.DESTINATION_IMAGE_SIZE.mobile :
                    BookingAppConstants.ONHOLD.DESTINATION_IMAGE_SIZE.desktop;
        const backgroundURL = this.$window.location.origin + '/wcs/imagenes/destinos/calculadoraAvios/' + destinationCityCode.toUpperCase() + imageResolution;

        return backgroundURL;
    };

}

downgradeToAJSService('BookingPageUtilsService', BookingPageUtilsService, 'ib-booking-services-module');
