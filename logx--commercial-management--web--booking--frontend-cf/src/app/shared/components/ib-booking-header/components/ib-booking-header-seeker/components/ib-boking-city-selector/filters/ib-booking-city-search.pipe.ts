import { Pipe, PipeTransform } from '@angular/core';

/**
 * @description Interface for city items used in the city search filter.
 */
export interface CityItem {
    code: string;
    description: string;
    descriptionWithHighlight?: string;
    countryLong?: string;
    country: string;
    group: string;
    selected: boolean;
}

export interface Matcher {
    item: CityItem,
    normalizedSearch: string,
    searchLength?: number
}

/**
 * @description Match categories for city search prioritization.
 */
enum MatchCategory {
    IATA = 'iata',
    CITY_START = 'cityStart',
    ANY_MATCH = 'anyMatch',
    NO_MATCH = 'noMatch'
}

/**
 * @description Filters and sorts city items based on a search term.
 * Prioritizes matches in the following order:
 * 1. IATA code matches
 * 2. City name starts with search term
 * 3. City name or country contains search term
 */
@Pipe({ name: 'citySearch' })
export class IbCitySearchPipe implements PipeTransform {
    private static readonly MIN_SEARCH_LENGTH = 3;

    /**
   * @description Filters and sorts city items based on a search term.
   * @param {CityItem[]} items Array of city items to filter.
   * @param {string} searchTerm The search term to filter by (minimum 3 characters).
   * @returns {CityItem[]} Filtered and sorted array of city items.
   */
    transform (items: CityItem[], searchTerm: string): CityItem[] {
        if (this.shouldSkipSearch(items, searchTerm)) {
            return items || [];
        }

        const normalizedSearch = this.removeAccents(searchTerm.toLowerCase());
        const searchLength = searchTerm.length;
        const categorized = this.categorizeItems(items, normalizedSearch, searchLength);

        return this.buildSortedResult(categorized);
    }

    /**
   * @description Determines if the search should be skipped.
   */
    private shouldSkipSearch (items: CityItem[], searchTerm: string): boolean {
        const hasNoItems = !items;
        const hasInvalidSearchTerm = !searchTerm || searchTerm.length < IbCitySearchPipe.MIN_SEARCH_LENGTH;

        return hasNoItems || hasInvalidSearchTerm;
    }

    /**
   * @description Categorizes items into match groups.
   */
    private categorizeItems (
        items: CityItem[],
        normalizedSearch: string,
        searchLength: number
    ): Map<MatchCategory, CityItem[]> {
        const categories = new Map<MatchCategory, CityItem[]>([
            [MatchCategory.IATA, []],
            [MatchCategory.CITY_START, []],
            [MatchCategory.ANY_MATCH, []]
        ]);

        for (const item of items) {
            const matcher: Matcher = { item: item, normalizedSearch, searchLength };

            const category = this.getMatchCategory(matcher);
            categories.get(category)?.push(item);
        }

        return categories;
    }

    /**
   * @description Determines the match category for a single item.
   */
    private getMatchCategory (
        matcher: Matcher
    ): MatchCategory {
        if (this.matchesIataCode(matcher)) {
            return MatchCategory.IATA;
        }
        if (this.matchesCityStart(matcher)) {
            return MatchCategory.CITY_START;
        }
        if (this.matchesCityOrCountry(matcher)) {
            return MatchCategory.ANY_MATCH;
        }
        return MatchCategory.NO_MATCH;
    }

    /**
   * @description Builds the final sorted result from categorized items.
   */
    private buildSortedResult (categorized: Map<MatchCategory, CityItem[]>): CityItem[] {
        const iataMatches = categorized.get(MatchCategory.IATA) || [];
        const cityStartMatches = (categorized.get(MatchCategory.CITY_START) || []).sort(this.orderByDescription);
        const anyMatches = (categorized.get(MatchCategory.ANY_MATCH) || []).sort(this.orderByDescription);

        return [...iataMatches.reverse(), ...cityStartMatches, ...anyMatches];
    }

    /**
   * @description Checks if the item's IATA code starts with the search term.
   */
    private matchesIataCode (matcher: Matcher): boolean {
        return matcher.item.code
            .substring(0, 3)
            .toLowerCase()
            .includes(matcher.normalizedSearch);
    }

    /**
   * @description Checks if the city description starts with the search term.
   */
    private matchesCityStart ( 
        matcher: Matcher
    ): boolean {
        const normalizedDescription = this.removeAccents(
            matcher.item.description.toLowerCase().substring(0, matcher.searchLength)
        );
        return normalizedDescription.includes(matcher.normalizedSearch);
    }

    /**
   * @description Checks if the city description or country contains the search term.
   */
    private matchesCityOrCountry (
        matcher: Matcher

    ): boolean {
        const normalizedDescription = this.removeAccents(
            matcher.item.description.toLowerCase()
        );

        if (normalizedDescription.includes(matcher.normalizedSearch)) {
            return true;
        }

        if (matcher.item.countryLong) {
            const normalizedCountry = this.removeAccents(
                matcher.item.countryLong.toLowerCase()
            );
            return normalizedCountry.includes(matcher.normalizedSearch);
        }

        return false;
    }

    /**
   * @description Removes accents and diacritics from a string.
   */
    private removeAccents (str: string): string {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    /**
   * @description Comparator function to sort items by description alphabetically.
   */
    private orderByDescription (a: CityItem, b: CityItem): number {
        if (a.description > b.description) {
            return 1;
        }
        if (a.description < b.description) {
            return -1;
        }
        return 0;
    }
}
