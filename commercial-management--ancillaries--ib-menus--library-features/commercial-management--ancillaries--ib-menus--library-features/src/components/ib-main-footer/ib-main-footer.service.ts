import { Injectable } from '@angular/core';
import { MenusConstants } from '../ib-menus-constants';
import { IbCBaseRestService } from 'ib-web-commons/proxies';
import { map } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class MainFooterService {

    constructor (private IbCBaseRestService: IbCBaseRestService) {}

    public getIcons (request: MenusModel.footerIconsRequestModel) {
        const endpoint:string = MenusConstants.ENDPOINTS.footerIconsURI;
        return this.IbCBaseRestService.post<any>(endpoint, request).pipe(
            map((res) => res.body)
        );
    }

}