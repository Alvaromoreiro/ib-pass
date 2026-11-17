import pushNewsletter from '../manage/ibe_newsletters';
import { getLanguagesList, getOriginCitiesList, getDestinationCitiesList } from '../manage/ibe_lang-ori-dest';
import { getAppTokenForServices } from '../manage/ibe_anonymous-services';
import retrieveGlobalVariables from '../general/ibe_variables';

const paramCollector = $('.inte-param-collection'); const originCitiesURL = paramCollector.attr('data-originCitiesURL');
const destinationCitiesURL = paramCollector.attr('data-destinationCitiesURL');
const languagesURL = paramCollector.attr('data-languagesURL');
const newsletterURL = paramCollector.attr('data-newsletterURL');

const { localeg, tokenURL, globalAppToken } = retrieveGlobalVariables();

getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
  getOriginCitiesList(originCitiesURL, localeg, globalAppToken, tokenURL, tokenData).done(() => {
    getDestinationCitiesList(destinationCitiesURL, localeg,
      globalAppToken, tokenURL, tokenData).done(() => {
      getLanguagesList(languagesURL, globalAppToken, tokenURL, tokenData);
    });
  });
});

$('#subscription').submit((e) => {
  e.preventDefault();
  if ($('#subscription').valid()) {
    const newsLetterRequest = {
      email: $('#email')[0].value,
      name: $('#name')[0].value,
      firstSurname: $('#firstSurname')[0].value,
      secondSurname: $('#secondSurnameInputColor')[0].value,
      departureCity: $('#originCity')[0].value,
      destinationCity: $('#firstDestinationCity')[0].value,
      otherDestinationCity: $('#secondDestinationCity')[0].value,
      language: $('#mailLanguage')[0].value ? $('#mailLanguage')[0].value : localeg,
      country: $('#mercado')[0].value,
    };
    const birthYear = $('#year')[0].value;
    const birthMonth = $('#month')[0].value;
    const birthDay = $('#day')[0].value;
    if (birthYear && birthMonth && birthDay) newsLetterRequest.birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    getAppTokenForServices(globalAppToken, tokenURL).done((tokenData) => {
      pushNewsletter(newsletterURL, localeg, newsLetterRequest, globalAppToken,
        tokenURL, tokenData);
    });
  }
  return true;
});
