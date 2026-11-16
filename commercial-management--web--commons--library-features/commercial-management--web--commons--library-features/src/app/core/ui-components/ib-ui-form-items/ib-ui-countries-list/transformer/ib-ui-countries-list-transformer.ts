@Service("ib-ui-countries-list-module", [])
class ibUiCountriesListTransformer {
  constructor() {}

  transformCountriesList = (
    countriesList: CommonsFormsModelsNamespace.ICountries,
  ) => {
    const countriesListTransformed = [];

    countriesList.forEach((item) => {
      countriesListTransformed.push({
        id: item.code,
        name: item.description,
      });
    });
    return countriesListTransformed;
  };
}
