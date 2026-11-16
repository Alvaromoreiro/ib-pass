import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    ElementRef,
    HostListener
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { CitySelectorConstants } from './constants/ib-booking-city-selector-constants';
import { CityItem, IbCitySearchPipe } from './filters/ib-booking-city-search.pipe';

/**
 * @description Interface for the model cities input.
 */
export interface ModelCities {
    listCities: CityItem[];
    listGroups?: string[];
    descriptionWithIATA?: boolean;
}

export interface ContainerForm {
    submitted: boolean;
    hasError: boolean;
    errors:{ [key: string]: boolean;}
}


@Component({
    selector: 'ib-booking-city-selector',
    templateUrl: './ib-booking-city-selector.component.html'
})
export class IbCitySelectorComponent implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
    // Inputs
    @Input() isCollapse = false;
    @Input() text = '';
    @Input() cssClass = '';
    @Input() modelCities: ModelCities = { listCities: [] };
    @Input() index = 0;
    @Input() isOrigin = false;
    @Input() isOverflow = false;
    @Input() isLoading = false;
    @Input() simpleSelector = false;
    @Input() showCodeOnInput = false;
    @Input() disabledInput = false;
    @Input() hideWarning = false;
    @Input() citySelected: CityItem | null = null;
    @Input() containerForm: ContainerForm = { submitted: false, hasError: false, errors: {} };

    // Output
    @Output() updateSelectedCity = new EventEmitter<{ city: CityItem | null; index: number, containerForm: ContainerForm }>();

    // Internal state
    focused = false;
    isTyping = false;
    letterSelected = CitySelectorConstants.LETTERS.ALL;
    loadingFilter = false;
    alphabet = CitySelectorConstants.ALPHABET;
    isOpen = false;
    group: string | undefined;
    active = false;
    searchText = '';
    private searchTextOnFocus = '';
    filteredCities: CityItem[] = [];
    displayedCities: CityItem[] = [];
    citiesGroupedByLetter: { letter: string; cities: CityItem[] }[] = [];
    touched = false;
    invalid = false;

    // ControlValueAccessor
    private onChange: (value: CityItem | null) => void = () => {};
    private onTouched: () => void = () => {};

    private citySearchPipe = new IbCitySearchPipe();

    constructor (
        private elementRef: ElementRef,
        private translateService: TranslateService
    ) {}

    ngOnInit (): void {
        this.elementRef.nativeElement.addEventListener('selectCityResponsive', this.selectCityResponsiveHandler);
        this.filteredCities = this.modelCities?.listCities || [];
        this.containerForm = this.containerForm || { submitted: false, hasError: false, errors: {} };
        this.updateSearchTextFromCity();
        this.updateDisplayedCities();
    }
    
    selectCityResponsiveHandler = (event: CustomEvent) =>{
        this.writeValue(event.detail.citySelected);
        this.isOpen = false;
        this.updateSelection();
    };
    ngOnChanges (changes: SimpleChanges): void {
        if (changes['citySelected'] && changes['citySelected'].currentValue) {
            this.updateSearchTextFromCity();
        }
        if (changes['modelCities']) {
            this.filteredCities = this.modelCities?.listCities || [];
            this.updateDisplayedCities();
        }
    }

    ngOnDestroy (): void {
        this.elementRef.nativeElement.removeEventListener('selectCityResponsive', this.selectCityResponsiveHandler);
    }

    private updateSearchTextFromCity (): void {
        if (this.citySelected) {
            this.searchText = this.showCodeOnInput
                ? `${this.citySelected.description} (${this.citySelected.code})`
                : this.citySelected.description;
        } else {
            this.searchText = '';
        }
    }

    @HostListener('window:resize')
    onResize (): void {
        if (window.innerWidth < 1024) {
            this.isOpen = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutside (event: Event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
    
    writeValue (value: CityItem | null): void {
        this.citySelected = value;
        if (value) {
            this.containerForm.hasError = false;
            this.containerForm.errors = {noCitySelected: false};
            this.searchText = this.showCodeOnInput
                ? `${value.description} (${value.code})`
                : value.description;
        } else {
            this.validateInput();
        }
    }

    registerOnChange (fn: (value: CityItem | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched (fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState (isDisabled: boolean): void {
        this.disabledInput = isDisabled;
    }

    // Public methods
    enableFocus (): void {
        this.focused = true;
        this.searchTextOnFocus = this.searchText;
    }

    onInputClick (event: Event): void {
        event.stopPropagation();
        this.isOpen = false;
        const input = event.target as HTMLInputElement;
        input.select();
    }

    disableFocus (): void {
        this.focused = false;
        this.isTyping = false;
        this.onTouched();
        this.touched = true;

        const hasChanged = this.searchText !== this.searchTextOnFocus;
        const shouldSelectFirstOption =hasChanged && this.searchText.length >= 3 && this.filteredCities.length > 0;
        if (shouldSelectFirstOption) {
            this.onSelect(this.filteredCities[0]);
        } else {
            this.validateInput();
        }
        this.filteredCities = [];
        this.group = undefined;
        this.letterSelected = CitySelectorConstants.LETTERS.ALL;
        this.updateDisplayedCities();
    }

    
    updateSelection (): void {
        this.containerForm.hasError = false;
        this.containerForm.errors = {noCitySelected: false};
        this.updateSelectedCity.emit({ city: this.citySelected, index: this.index, containerForm: this.containerForm });
        this.onChange(this.citySelected);
    }

    changeLetter (letter: string): void {
        this.letterSelected = letter;
        this.updateDisplayedCities();
    }

    validateInput (): void {
        this.invalid = (!this.citySelected || typeof this.citySelected !== 'object');
        if(this.invalid) {
            this.containerForm.hasError = true;
            this.containerForm.errors.noCitySelected = true;
            this.updateSelectedCity.emit({ city: null, index: this.index, containerForm: this.containerForm });

        }
    }

    changeGroup (event: Event, group: string): void {
        event.preventDefault();
        this.group = group;
        this.updateDisplayedCities();
    }

    filterGroup (item: CityItem & { group?: string }): boolean {
        if (this.group === undefined || this.group === '') {
            return true;
        }
        return item.group === this.group || item.group === 'ALL_DESCRIPTION';
    }

    onSelect (city: CityItem): void {
        this.citySelected = city;
        this.searchText = this.showCodeOnInput
            ? `${city.description} (${city.code})`
            : city.description;
        this.active = true;
        this.isOpen = false;
        this.isTyping = false;
        this.invalid = false;
        this.validateInput();
        this.updateSelection();
    }

    selectCity (event: Event, city: CityItem): void {
        event.preventDefault();
        event.stopPropagation();
        this.onSelect(city);
    }

    openCollapse (): void {
        if (window.innerWidth < 1024) {
            this.loadingFilter = true;
        }
        this.isOpen = !this.isOpen;
    }
    
    changeCountry (group: string, event: Event): void {
        event.preventDefault();
        this.loadingFilter = false;
        setTimeout(() => {
            this.loadingFilter = true;
            this.group = group;
            this.updateDisplayedCities();
        });
    }

    onSearchChange (): void {
        this.isTyping = true;

        if (!this.searchText || this.searchText.length < 3) {
            this.filteredCities = [];
            this.citySelected = null;
            this.validateInput();

            return;
        }

        this.filteredCities = this.citySearchPipe.transform(
            this.modelCities.listCities,
            this.searchText
        );
        
        this.filteredCities = this.filteredCities.map((city) => {
            const regex = new RegExp(`(${this.searchText})`, 'gi');
            const descriptionWithHighlight = city.description.replace(regex, '<span class="u-font-bold">$1</span>');
            return { ...city, descriptionWithHighlight };
        });
        
        
        this.validateInput();

    }

    removeAccents (value: string): string {
        return value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    private updateDisplayedCities (): void {
        if (!this.modelCities?.listCities) {
            this.displayedCities = [];
            return;
        }

        let cities = this.modelCities.listCities;

        if (this.group) {
            cities = cities.filter((city) => this.filterGroup(city as CityItem & { group?: string }));
        }
        if (this.letterSelected !== 'all') {
            const letterRegex = new RegExp(`^${this.letterSelected}`, 'i');
            cities = cities.filter((city) => {
                const translatedDescription = this.translateService.instant(city.description);
                return letterRegex.test(translatedDescription.substring(0, 1));
            });
        }

        this.displayedCities = cities.sort((a, b) => {
            return a.description.trim().localeCompare(b.description.trim(), undefined, { sensitivity: 'base' });
        });

        this.updateCitiesGroupedByLetter();
    }

    private updateCitiesGroupedByLetter (): void {
        const grouped: { [key: string]: CityItem[] } = {};

        this.displayedCities.forEach((city) => {
            const translatedDescription = this.translateService.instant(city.description);
            const firstLetter = this.removeAccents(translatedDescription.trim().substring(0, 1)).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(city);
        });

        const sortedLetters = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
        this.citiesGroupedByLetter = sortedLetters.map((letter) => ({
            letter,
            cities: grouped[letter]
        }));
    }

    trackByCode (index: number, city: CityItem): string {
        return city.code;
    }

    trackByName (index: number, letter: { name: string }): string {
        return letter.name;
    }
}

downgradeToAJSComponent(
    'ibBookingCitySelector',
    {
        component: IbCitySelectorComponent,
        inputs: [
            'isCollapse',
            'text',
            'cssClass',
            'modelCities',
            'index',
            'isOrigin',
            'isOverflow',
            'isLoading',
            'simpleSelector',
            'showCodeOnInput',
            'disabledInput',
            'hideWarning',
            'citySelected',
            'containerForm'
        ],
        outputs: [
            'updateSelectedCity'
        ]
    },
    'ib-booking-city-selector-module'
);
