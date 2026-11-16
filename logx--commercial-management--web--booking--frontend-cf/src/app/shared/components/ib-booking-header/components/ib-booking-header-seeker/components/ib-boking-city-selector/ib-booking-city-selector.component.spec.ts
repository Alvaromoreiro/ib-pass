import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ElementRef } from '@angular/core';

import { IbCitySelectorComponent, ModelCities, ContainerForm } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/components/ib-boking-city-selector/ib-booking-city-selector.component';
import { CityItem } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/components/ib-boking-city-selector/filters/ib-booking-city-search.pipe';
import { CitySelectorConstants } from '@src/app/shared/components/ib-booking-header/components/ib-booking-header-seeker/components/ib-boking-city-selector/constants/ib-booking-city-selector-constants';

describe('IbCitySelectorComponent', () => {
    let component: IbCitySelectorComponent;
    let fixture: ComponentFixture<IbCitySelectorComponent>;
    let translateService: TranslateService;

    const mockCityMadrid: CityItem = {
        code: 'MAD',
        description: 'Madrid',
        countryLong: 'Spain',
        country: 'ES',
        group: 'EUROPE',
        selected: false
    };

    const mockCityBarcelona: CityItem = {
        code: 'BCN',
        description: 'Barcelona',
        countryLong: 'Spain',
        country: 'ES',
        group: 'EUROPE',
        selected: false
    };

    const mockCityNewYork: CityItem = {
        code: 'JFK',
        description: 'New York',
        countryLong: 'United States',
        country: 'US',
        group: 'AMERICA',
        selected: false
    };

    const mockCityParis: CityItem = {
        code: 'CDG',
        description: 'Paris',
        countryLong: 'France',
        country: 'FR',
        group: 'EUROPE',
        selected: false
    };

    const mockModelCities: ModelCities = {
        listCities: [mockCityMadrid, mockCityBarcelona, mockCityNewYork, mockCityParis],
        listGroups: ['EUROPE', 'AMERICA'],
        descriptionWithIATA: false
    };

    const mockContainerForm: ContainerForm = {
        submitted: false,
        hasError: false,
        errors: {}
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbCitySelectorComponent],
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(IbCitySelectorComponent);
        component = fixture.componentInstance;
        translateService = TestBed.inject(TranslateService);

        component.modelCities = { ...mockModelCities };
        component.containerForm = { ...mockContainerForm };

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize filteredCities with modelCities list', () => {
            component.modelCities = mockModelCities;
            component.ngOnInit();

            expect(component.filteredCities).toEqual(mockModelCities.listCities);
        });

        it('should initialize containerForm if not provided', () => {
            component.containerForm = null as any;
            component.ngOnInit();

            expect(component.containerForm).toEqual({ submitted: false, hasError: false, errors: {} });
        });

        it('should add event listener for selectCityResponsive', () => {
            const addEventListenerSpy = spyOn(component['elementRef'].nativeElement, 'addEventListener');
            component.ngOnInit();

            expect(addEventListenerSpy).toHaveBeenCalledWith('selectCityResponsive', component.selectCityResponsiveHandler);
        });
    });

    describe('ngOnChanges', () => {
        const searchTextTestCases = [
            { showCodeOnInput: false, expectedSearchText: 'Madrid', description: 'without code' },
            { showCodeOnInput: true, expectedSearchText: 'Madrid (MAD)', description: 'with code when showCodeOnInput is true' }
        ];

        searchTextTestCases.forEach(({ showCodeOnInput, expectedSearchText, description }) => {
            it(`should update searchText ${description} when citySelected changes`, () => {
                component.showCodeOnInput = showCodeOnInput;
                const changes = {
                    citySelected: {
                        currentValue: mockCityMadrid,
                        previousValue: null,
                        firstChange: false,
                        isFirstChange: () => false
                    }
                };
                component.citySelected = mockCityMadrid;
                component.ngOnChanges(changes);

                expect(component.searchText).toBe(expectedSearchText);
            });
        });

        it('should update filteredCities when modelCities changes', () => {
            const newModelCities: ModelCities = {
                listCities: [mockCityParis],
                listGroups: ['EUROPE']
            };
            const changes = {
                modelCities: {
                    currentValue: newModelCities,
                    previousValue: mockModelCities,
                    firstChange: false,
                    isFirstChange: () => false
                }
            };
            component.modelCities = newModelCities;
            component.ngOnChanges(changes);

            expect(component.filteredCities).toEqual([mockCityParis]);
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove event listener for selectCityResponsive', () => {
            const removeEventListenerSpy = spyOn(component['elementRef'].nativeElement, 'removeEventListener');
            component.ngOnDestroy();

            expect(removeEventListenerSpy).toHaveBeenCalledWith('selectCityResponsive', component.selectCityResponsiveHandler);
        });
    });

    describe('selectCityResponsiveHandler', () => {
        it('should handle selectCityResponsive event', () => {
            const mockEvent = {
                detail: { citySelected: mockCityMadrid }
            } as CustomEvent;
            const updateSelectionSpy = spyOn(component, 'updateSelection');

            component.selectCityResponsiveHandler(mockEvent);

            expect(component.citySelected).toEqual(mockCityMadrid);
            expect(component.isOpen).toBeFalse();
            expect(updateSelectionSpy).toHaveBeenCalled();
        });
    });

    describe('ControlValueAccessor', () => {
        describe('writeValue', () => {
            const writeValueTestCases = [
                { showCodeOnInput: false, expectedSearchText: 'Madrid', description: 'without code' },
                { showCodeOnInput: true, expectedSearchText: 'Madrid (MAD)', description: 'with code when showCodeOnInput is true' }
            ];

            writeValueTestCases.forEach(({ showCodeOnInput, expectedSearchText, description }) => {
                it(`should set citySelected and searchText ${description} when value is provided`, () => {
                    component.showCodeOnInput = showCodeOnInput;
                    component.writeValue(mockCityMadrid);

                    expect(component.citySelected).toEqual(mockCityMadrid);
                    expect(component.searchText).toBe(expectedSearchText);
                });
            });

            it('should clear containerForm errors when value is provided', () => {
                component.containerForm.hasError = true;
                component.containerForm.errors = { noCitySelected: true };
                component.writeValue(mockCityMadrid);

                expect(component.containerForm.hasError).toBeFalse();
                expect(component.containerForm.errors.noCitySelected).toBeFalse();
            });

            it('should call validateInput when value is null', () => {
                const validateInputSpy = spyOn(component, 'validateInput');
                component.writeValue(null);

                expect(validateInputSpy).toHaveBeenCalled();
            });
        });

        describe('registerOnChange', () => {
            it('should register onChange callback', () => {
                const fn = jasmine.createSpy('onChange');
                component.registerOnChange(fn);
                component['onChange'](mockCityMadrid);

                expect(fn).toHaveBeenCalledWith(mockCityMadrid);
            });
        });

        describe('registerOnTouched', () => {
            it('should register onTouched callback', () => {
                const fn = jasmine.createSpy('onTouched');
                component.registerOnTouched(fn);
                component['onTouched']();

                expect(fn).toHaveBeenCalled();
            });
        });

        describe('setDisabledState', () => {
            const disabledStateTestCases = [
                { inputValue: true, expectedValue: true },
                { inputValue: false, expectedValue: false }
            ];

            disabledStateTestCases.forEach(({ inputValue, expectedValue }) => {
                it(`should set disabledInput to ${expectedValue}`, () => {
                    component.disabledInput = !inputValue;
                    component.setDisabledState(inputValue);

                    expect(component.disabledInput).toBe(expectedValue);
                });
            });
        });
    });

    describe('enableFocus', () => {
        it('should set focused to true', () => {
            component.focused = false;
            component.enableFocus();

            expect(component.focused).toBeTrue();
        });
    });

    describe('onInputClick', () => {
        it('should stop propagation and close dropdown', () => {
            const mockInput = document.createElement('input');
            const selectSpy = spyOn(mockInput, 'select');
            const mockEvent = {
                stopPropagation: jasmine.createSpy('stopPropagation'),
                target: mockInput
            } as unknown as Event;

            component.isOpen = true;
            component.onInputClick(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(component.isOpen).toBeFalse();
            expect(selectSpy).toHaveBeenCalled();
        });
    });

    describe('disableFocus', () => {
        it('should set focused to false and touched to true', () => {
            component.focused = true;
            component.touched = false;
            component.disableFocus();

            expect(component.focused).toBeFalse();
            expect(component.touched).toBeTrue();
        });

        it('should select first filtered city when searchText has 3+ chars and no city selected', () => {
            component.searchText = 'Mad';
            component.citySelected = null;
            component.filteredCities = [mockCityMadrid, mockCityBarcelona];
            const onSelectSpy = spyOn(component, 'onSelect');

            component.disableFocus();

            expect(onSelectSpy).toHaveBeenCalledWith(mockCityMadrid);
        });

        it('should call validateInput when no filtered cities available', () => {
            component.searchText = 'XYZ';
            component.citySelected = null;
            component.filteredCities = [];
            const validateInputSpy = spyOn(component, 'validateInput');

            component.disableFocus();

            expect(validateInputSpy).toHaveBeenCalled();
        });

        it('should reset letterSelected to ALL after focus lost', () => {
            component.letterSelected = 'M';
            component.disableFocus();

            expect(component.letterSelected).toBe(CitySelectorConstants.LETTERS.ALL);
        });
    });

    describe('updateSelection', () => {
        it('should emit updateSelectedCity event with correct data', () => {
            const emitSpy = spyOn(component.updateSelectedCity, 'emit');
            component.citySelected = mockCityMadrid;
            component.index = 1;
            component.containerForm = mockContainerForm;

            component.updateSelection();

            expect(emitSpy).toHaveBeenCalledWith({
                city: mockCityMadrid,
                index: 1,
                containerForm: component.containerForm
            });
        });

        it('should call onChange with citySelected', () => {
            const onChangeSpy = jasmine.createSpy('onChange');
            component.registerOnChange(onChangeSpy);
            component.citySelected = mockCityMadrid;

            component.updateSelection();

            expect(onChangeSpy).toHaveBeenCalledWith(mockCityMadrid);
        });

        it('should reset containerForm errors', () => {
            component.containerForm.hasError = true;
            component.containerForm.errors = { noCitySelected: true };

            component.updateSelection();

            expect(component.containerForm.hasError).toBeFalse();
            expect(component.containerForm.errors.noCitySelected).toBeFalse();
        });
    });

    describe('changeLetter', () => {
        it('should set letterSelected and update displayed cities', () => {
            const updateDisplayedCitiesSpy = spyOn<any>(component, 'updateDisplayedCities');
            component.changeLetter('M');

            expect(component.letterSelected).toBe('M');
            expect(updateDisplayedCitiesSpy).toHaveBeenCalled();
        });
    });

    describe('validateInput', () => {
        const validateInputTestCases = [
            { citySelected: null, expectedInvalid: true, description: 'set invalid to true when citySelected is null' },
            { citySelected: 'mockCityMadrid', expectedInvalid: false, description: 'set invalid to false when citySelected is valid' }
        ];

        validateInputTestCases.forEach(({ citySelected, expectedInvalid, description }) => {
            it(`should ${description}`, () => {
                component.citySelected = citySelected === 'mockCityMadrid' ? mockCityMadrid : null;
                component.validateInput();

                expect(component.invalid).toBe(expectedInvalid);
                if (expectedInvalid) {
                    expect(component.containerForm.hasError).toBeTrue();
                    expect(component.containerForm.errors.noCitySelected).toBeTrue();
                }
            });
        });

        it('should emit updateSelectedCity with null city when invalid', () => {
            const emitSpy = spyOn(component.updateSelectedCity, 'emit');
            component.citySelected = null;
            component.index = 0;

            component.validateInput();

            expect(emitSpy).toHaveBeenCalledWith({
                city: null,
                index: 0,
                containerForm: component.containerForm
            });
        });
    });

    describe('changeGroup', () => {
        it('should set group and update displayed cities', () => {
            const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
            const updateDisplayedCitiesSpy = spyOn<any>(component, 'updateDisplayedCities');

            component.changeGroup(mockEvent, 'EUROPE');

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(component.group).toBe('EUROPE');
            expect(updateDisplayedCitiesSpy).toHaveBeenCalled();
        });
    });

    describe('filterGroup', () => {
        const filterGroupTestCases = [
            { componentGroup: undefined, cityGroup: 'EUROPE', expected: true, description: 'when group is undefined' },
            { componentGroup: '', cityGroup: 'EUROPE', expected: true, description: 'when group is empty string' },
            { componentGroup: 'EUROPE', cityGroup: 'EUROPE', expected: true, description: 'when item group matches component group' },
            { componentGroup: 'ASIA', cityGroup: 'EUROPE', expected: false, description: 'when item group does not match' },
            { componentGroup: 'EUROPE', cityGroup: 'ALL_DESCRIPTION', expected: true, description: 'for ALL_DESCRIPTION group' }
        ];

        filterGroupTestCases.forEach(({ componentGroup, cityGroup, expected, description }) => {
            it(`should return ${expected} ${description}`, () => {
                component.group = componentGroup;
                const city = { ...mockCityMadrid, group: cityGroup };
                const result = component.filterGroup(city as CityItem & { group?: string });

                expect(result).toBe(expected);
            });
        });
    });

    describe('onSelect', () => {
        const onSelectSearchTextTestCases = [
            { showCodeOnInput: false, expectedSearchText: 'Madrid', description: 'without code' },
            { showCodeOnInput: true, expectedSearchText: 'Madrid (MAD)', description: 'with code when showCodeOnInput is true' }
        ];

        onSelectSearchTextTestCases.forEach(({ showCodeOnInput, expectedSearchText, description }) => {
            it(`should set citySelected and searchText ${description}`, () => {
                component.showCodeOnInput = showCodeOnInput;
                component.onSelect(mockCityMadrid);

                expect(component.citySelected).toEqual(mockCityMadrid);
                expect(component.searchText).toBe(expectedSearchText);
            });
        });

        it('should set active to true and close dropdown', () => {
            component.active = false;
            component.isOpen = true;
            component.isTyping = true;

            component.onSelect(mockCityMadrid);

            expect(component.active).toBeTrue();
            expect(component.isOpen).toBeFalse();
            expect(component.isTyping).toBeFalse();
        });

        it('should set invalid to false', () => {
            component.invalid = true;
            component.onSelect(mockCityMadrid);

            expect(component.invalid).toBeFalse();
        });

        it('should call validateInput and updateSelection', () => {
            const validateInputSpy = spyOn(component, 'validateInput');
            const updateSelectionSpy = spyOn(component, 'updateSelection');

            component.onSelect(mockCityMadrid);

            expect(validateInputSpy).toHaveBeenCalled();
            expect(updateSelectionSpy).toHaveBeenCalled();
        });
    });

    describe('selectCity', () => {
        it('should prevent default and stop propagation', () => {
            const mockEvent = {
                preventDefault: jasmine.createSpy('preventDefault'),
                stopPropagation: jasmine.createSpy('stopPropagation')
            } as unknown as Event;
            const onSelectSpy = spyOn(component, 'onSelect');

            component.selectCity(mockEvent, mockCityMadrid);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(onSelectSpy).toHaveBeenCalledWith(mockCityMadrid);
        });
    });

    describe('openCollapse', () => {
        let originalInnerWidth: number;

        beforeEach(() => {
            originalInnerWidth = window.innerWidth;
        });

        afterEach(() => {
            Object.defineProperty(window, 'innerWidth', {
                value: originalInnerWidth,
                writable: true,
                configurable: true
            });
        });

        it('should toggle isOpen', () => {
            component.isOpen = false;
            component.openCollapse();

            expect(component.isOpen).toBeTrue();

            component.openCollapse();

            expect(component.isOpen).toBeFalse();
        });

        it('should set loadingFilter when window width is less than 1024', () => {
            Object.defineProperty(window, 'innerWidth', {
                value: 800,
                writable: true,
                configurable: true
            });
            component.loadingFilter = false;

            component.openCollapse();

            expect(component.loadingFilter).toBeTrue();
        });
    });

    describe('changeCountry', () => {
        it('should set group and update displayed cities after timeout', fakeAsync(() => {
            const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;
            const updateDisplayedCitiesSpy = spyOn<any>(component, 'updateDisplayedCities');

            component.changeCountry('EUROPE', mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(component.loadingFilter).toBeFalse();

            tick();

            expect(component.loadingFilter).toBeTrue();
            expect(component.group).toBe('EUROPE');
            expect(updateDisplayedCitiesSpy).toHaveBeenCalled();
        }));
    });

    describe('onSearchChange', () => {
        it('should set isTyping to true', () => {
            component.isTyping = false;
            component.searchText = 'Madrid';
            component.onSearchChange();

            expect(component.isTyping).toBeTrue();
        });

        const clearCitiesTestCases = [
            { searchText: 'Ma', description: 'when searchText is less than 3 chars', shouldCallValidate: true },
            { searchText: '', description: 'when searchText is empty', shouldCallValidate: false }
        ];

        clearCitiesTestCases.forEach(({ searchText, description, shouldCallValidate }) => {
            it(`should clear filteredCities and citySelected ${description}`, () => {
                component.searchText = searchText;
                component.filteredCities = [mockCityMadrid];
                component.citySelected = mockCityMadrid;
                const validateInputSpy = spyOn(component, 'validateInput');

                component.onSearchChange();

                expect(component.filteredCities).toEqual([]);
                expect(component.citySelected).toBeNull();
                if (shouldCallValidate) {
                    expect(validateInputSpy).toHaveBeenCalled();
                }
            });
        });

        it('should filter cities when searchText has 3+ chars', () => {
            component.searchText = 'Mad';
            component.modelCities = mockModelCities;

            component.onSearchChange();

            expect(component.filteredCities.length).toBeGreaterThan(0);
        });
    });

    describe('removeAccents', () => {
        const removeAccentsTestCases = [
            { input: 'Málaga', expected: 'Malaga' },
            { input: 'París', expected: 'Paris' },
            { input: 'São Paulo', expected: 'Sao Paulo' },
            { input: 'Zürich', expected: 'Zurich' },
            { input: 'Madrid', expected: 'Madrid' }
        ];

        removeAccentsTestCases.forEach(({ input, expected }) => {
            it(`should convert '${input}' to '${expected}'`, () => {
                expect(component.removeAccents(input)).toBe(expected);
            });
        });
    });

    describe('trackByCode', () => {
        it('should return city code', () => {
            const result = component.trackByCode(0, mockCityMadrid);

            expect(result).toBe('MAD');
        });
    });

    describe('trackByName', () => {
        it('should return letter name', () => {
            const result = component.trackByName(0, { name: 'A' });

            expect(result).toBe('A');
        });
    });

    describe('HostListener: onResize', () => {
        let originalInnerWidth: number;

        beforeEach(() => {
            originalInnerWidth = window.innerWidth;
        });

        afterEach(() => {
            Object.defineProperty(window, 'innerWidth', {
                value: originalInnerWidth,
                writable: true,
                configurable: true
            });
        });

        const resizeTestCases = [
            { windowWidth: 800, expectedIsOpen: false, description: 'close dropdown when window width is less than 1024' },
            { windowWidth: 1024, expectedIsOpen: true, description: 'keep dropdown open when window width is 1024 or more' }
        ];

        resizeTestCases.forEach(({ windowWidth, expectedIsOpen, description }) => {
            it(`should ${description}`, () => {
                Object.defineProperty(window, 'innerWidth', {
                    value: windowWidth,
                    writable: true,
                    configurable: true
                });
                component.isOpen = true;

                component.onResize();

                expect(component.isOpen).toBe(expectedIsOpen);
            });
        });
    });

    describe('HostListener: onClickOutside', () => {
        it('should close dropdown when clicking outside component', () => {
            const outsideElement = document.createElement('div');
            document.body.appendChild(outsideElement);
            const mockEvent = { target: outsideElement } as unknown as Event;

            component.isOpen = true;
            component.onClickOutside(mockEvent);

            expect(component.isOpen).toBeFalse();
            document.body.removeChild(outsideElement);
        });

        it('should keep dropdown open when clicking inside component', () => {
            const mockEvent = { target: fixture.nativeElement } as unknown as Event;

            component.isOpen = true;
            component.onClickOutside(mockEvent);

            expect(component.isOpen).toBeTrue();
        });
    });

    describe('updateDisplayedCities (private)', () => {
        it('should filter by group when group is set', () => {
            component.modelCities = mockModelCities;
            component.group = 'AMERICA';
            component['updateDisplayedCities']();

            expect(component.displayedCities.every((city) => city.group === 'AMERICA')).toBeTrue();
        });

        it('should filter by letter when letterSelected is not all', () => {
            component.modelCities = mockModelCities;
            component.letterSelected = 'M';
            spyOn(translateService, 'instant').and.callFake((key: string) => key);

            component['updateDisplayedCities']();

            expect(component.displayedCities.every((city) => city.description.startsWith('M'))).toBeTrue();
        });

        it('should sort cities by description', () => {
            component.modelCities = mockModelCities;
            component['updateDisplayedCities']();

            const descriptions = component.displayedCities.map((c) => c.description);
            const sorted = [...descriptions].sort((a, b) => a.localeCompare(b));

            expect(descriptions).toEqual(sorted);
        });

        it('should set empty displayedCities when modelCities is null', () => {
            component.modelCities = null as any;
            component['updateDisplayedCities']();

            expect(component.displayedCities).toEqual([]);
        });
    });

    describe('updateCitiesGroupedByLetter (private)', () => {
        it('should group cities by first letter', () => {
            component.modelCities = mockModelCities;
            spyOn(translateService, 'instant').and.callFake((key: string) => key);
            component['updateDisplayedCities']();

            expect(component.citiesGroupedByLetter.length).toBeGreaterThan(0);
            expect(component.citiesGroupedByLetter.every((g) => g.letter && g.cities.length > 0)).toBeTrue();
        });

        it('should sort groups alphabetically', () => {
            component.modelCities = mockModelCities;
            spyOn(translateService, 'instant').and.callFake((key: string) => key);
            component['updateDisplayedCities']();

            const letters = component.citiesGroupedByLetter.map((g) => g.letter);
            const sorted = [...letters].sort();

            expect(letters).toEqual(sorted);
        });
    });

    describe('Default values', () => {
        it('should have correct default values', () => {
            const freshComponent = new IbCitySelectorComponent(
                { nativeElement: document.createElement('div') } as ElementRef,
                translateService
            );

            expect(freshComponent.isCollapse).toBeFalse();
            expect(freshComponent.text).toBe('');
            expect(freshComponent.cssClass).toBe('');
            expect(freshComponent.index).toBe(0);
            expect(freshComponent.isOrigin).toBeFalse();
            expect(freshComponent.isOverflow).toBeFalse();
            expect(freshComponent.isLoading).toBeFalse();
            expect(freshComponent.simpleSelector).toBeFalse();
            expect(freshComponent.showCodeOnInput).toBeFalse();
            expect(freshComponent.disabledInput).toBeFalse();
            expect(freshComponent.hideWarning).toBeFalse();
            expect(freshComponent.citySelected).toBeNull();
            expect(freshComponent.focused).toBeFalse();
            expect(freshComponent.isTyping).toBeFalse();
            expect(freshComponent.letterSelected).toBe(CitySelectorConstants.LETTERS.ALL);
            expect(freshComponent.loadingFilter).toBeFalse();
            expect(freshComponent.isOpen).toBeFalse();
            expect(freshComponent.active).toBeFalse();
            expect(freshComponent.searchText).toBe('');
            expect(freshComponent.touched).toBeFalse();
            expect(freshComponent.invalid).toBeFalse();
        });
    });
});
