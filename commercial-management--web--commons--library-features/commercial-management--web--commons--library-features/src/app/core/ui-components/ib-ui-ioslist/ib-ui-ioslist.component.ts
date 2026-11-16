/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Component, Input, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { Alphabet, Cities } from 'ib-web-commons/models';

@Component({
    selector: 'ib-ui-ioslist',
    templateUrl: './ib-ui-ioslist.component.html',
    styleUrls: ['./ib-ui-ioslist.component.scss']
})
export class IbUiIoslistComponent {
    @Input() cities: Cities[] = [{
        code: '',
        description: '',
        countryCode: '',
        areaCode: '',
        group: '',
        country: ''
    }];
    @Input() group = '';
    public alphabet: Alphabet[] = [
        { name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' },
        { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }, { name: 'K' }, { name: 'L' }, { name: 'M' }, { name: 'N' }, { name: 'Ñ' }, { name: 'O' }, { name: 'P' },
        { name: 'Q' }, { name: 'R' }, { name: 'S' }, { name: 'T' }, { name: 'U' }, { name: 'V' }, { name: 'W' }, { name: 'X' }, { name: 'Y' }, { name: 'Z' }
    ];

    constructor (private translateService: TranslateService, private elRef: ElementRef) { }


    isSelected = (event:MouseEvent, citySelected: Cities):void => {
        event.preventDefault();
        event.stopPropagation();
        this.elRef.nativeElement.dispatchEvent(new CustomEvent('selectCityResponsive',
            {
                bubbles: true,
                composed: true,
                detail: {
                    citySelected
                }
            }));
    };

    isCityInGroup = (letter:string):Cities[] | undefined => {
        let filtered: Cities[] | undefined = [];
        if (letter !== 'all' && this.cities.length > 0) {
            this.cities.forEach((city) => {
                this.filterByGroup(city, letter) && filtered?.push(city);
            });
        } else filtered = this.cities;
        return filtered;
    };

    sortAndGroupedCities = (letter:string):Cities[] | undefined => {
        return this.cities
            .sort((a, b) => {
                if (a.description > b.description) return 1;
                else if (a.description === b.description) return 0;
                return -1;
            })
            .filter((city) => {
                if (letter !== 'all') {
                    return this.filterByGroup(city, letter);
                }
                return false;
            });
    };

    filterByGroup = (city: Cities, letter:string): boolean | void => {
        const letterMatch = new RegExp(letter, 'i');
        if (city?.group === this.group || !this.group) {
            const description = this.translateService.instant(city.description);
            if (letterMatch.test(description.substring(0, 1))) {
                return true;
            }
        }
    };

}
downgradeToAJSComponent('ibUiIoslist', { component: IbUiIoslistComponent, inputs: ['cities', 'group'] }, 'ib-ui-ios-list-component-module');