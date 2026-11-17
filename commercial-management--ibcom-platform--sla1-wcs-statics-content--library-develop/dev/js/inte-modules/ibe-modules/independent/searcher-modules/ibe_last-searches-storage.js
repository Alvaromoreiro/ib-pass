import * as LocalStorage from '../../manage/ibe-local-storage';

const filterExpiredSearches = function (entry, tab) {
  const today = new Date();
  const expiration = new Date().setTime(entry.expirationTimestamp);
  const ida = tab === 'MT' ? entry.combinations[0].fechaIda : entry.fechaIda;
  const fechaIda = new Date(`${ida.year}/${ida.month}/${ida.day}`);

  return (expiration >= today && fechaIda >= today.setHours(0, 0, 0, 0));
};

const getAllValidSearhes = function() {
  const keyLastSearches = 'ib-booking.lastSearchs';
  let lastSearches = LocalStorage.get(keyLastSearches);
  if (LocalStorage.isWritable && lastSearches) {
    lastSearches = lastSearches.filter(filterExpiredSearches);
    LocalStorage.set(keyLastSearches, lastSearches);
  }
  return lastSearches;
};

const getSpecificSearch = function(position) {
  const lastSearches = getAllValidSearhes();
  return lastSearches ? lastSearches[position] : undefined;
};

const updateLastSearches = function (newSearch) {
  const search = newSearch;
  const keyLastSearches = 'ib-booking.lastSearchs';
  let lastSearches = LocalStorage.get(keyLastSearches);
  const isSameSearch = function (element) {
    let same = true;
    let numPasElement = 0;
    let numPasSearch = 0;
    if (filterExpiredSearches(element)) {
      numPasElement = element.adultos + element.niños + element.senior + element.joven + element.bebes;
      numPasSearch = search.adultos + search.niños + search.senior + search.joven + search.bebes;
      same = element.iataOrigen === search.iataOrigen && element.iataDestino === search.iataDestino
          && JSON.stringify(element.fechaIda) === JSON.stringify(search.fechaIda)
          && JSON.stringify(element.fechaVuelta) === JSON.stringify(search.fechaVuelta)
          && numPasElement === numPasSearch;
      return !same;
    }
    return false;
  };

  if (LocalStorage.isWritable) {
    search.expirationTimestamp = new Date().setTime(new Date().getTime() + 90 * 86400000);
    if (lastSearches) {
      lastSearches = lastSearches.filter(isSameSearch);
      lastSearches.unshift(search);
      if (lastSearches.length > 30) {
        lastSearches.pop();
      }
    } else {
      lastSearches = [];
      lastSearches.unshift(search);
    }
    LocalStorage.set(keyLastSearches, lastSearches);
  }
};

const existLastSearches = function () {
  const keyLastSearches = 'ib-booking.lastSearchs';
  const lastSearches = LocalStorage.get(keyLastSearches);
  const exist = lastSearches !== null && getAllValidSearhes().length > 0;
  return exist;
};

const updateLastSearchesMT = function (newSearch) {
  const search = newSearch;
  const keyLastSearchesMT = 'ib-booking.lastSearchsMT';
  let lastSearches = LocalStorage.get(keyLastSearchesMT);
  const isSameSearch = function (element) {
    let found = true;
    let numPasElement = 0;
    let numPasSearch = 0;
    if (filterExpiredSearches(element, 'MT')) {
      numPasElement = element.adultos + element.niños + element.senior + element.joven + element.bebes;
      numPasSearch = search.adultos + search.niños + search.senior + search.joven + search.bebes;
      found = numPasElement === numPasSearch;
      for (let i = 0; i < 4; i++) {
        found = found && element.combinations[i].iataOrigen === search.combinations[i].iataOrigen
                      && element.combinations[i].iataDestino === search.combinations[i].iataDestino
                      && JSON.stringify(element.combinations[i].fechaIda) === JSON.stringify(search.combinations[i].fechaIda);
        if (!found) break;
      }
      return !found;
    }
    return false;
  };

  if (LocalStorage.isWritable) {
    search.expirationTimestamp = new Date().setTime(new Date().getTime() + 90 * 86400000);
    if (lastSearches) {
      lastSearches = lastSearches.filter(isSameSearch);
      lastSearches.unshift(search);
      if (lastSearches.length > 5) {
        lastSearches.pop();
      }
    } else {
      lastSearches = [];
      lastSearches.unshift(search);
    }
    LocalStorage.set(keyLastSearchesMT, lastSearches);
  }
};

const existLastSearchesMT = function () {
  const keyLastSearches = 'ib-booking.lastSearchsMT';
  const lastSearches = LocalStorage.get(keyLastSearches);
  const exist = lastSearches !== null && lastSearches.length > 0;
  return exist;
};

const getLastSearchMT = function () {
  const keyLastSearches = 'ib-booking.lastSearchsMT';
  let lastSearch;
  if (existLastSearchesMT()) {
    lastSearch = LocalStorage.get(keyLastSearches)[0];
  }
  return lastSearch;
};

const updateLastSearchesSO = function (newSearch) {
  const search = newSearch;
  const keyLastSearchesSO = 'ib-booking.lastSearchsSO';
  let lastSearches = LocalStorage.get(keyLastSearchesSO);
  const isSameSearch = function (element) {
    let same = true;
    let numPasElement = 0;
    let numPasSearch = 0;
    if (filterExpiredSearches(element)) {
      numPasElement = element.adultos + element.niños + element.bebes;
      numPasSearch = search.adultos + search.niños  + search.bebes;
      same = element.nombreOrigen === search.nombreOrigen && element.nombreDestino === search.nombreDestino
          && JSON.stringify(element.fechaIda) === JSON.stringify(search.fechaIda)
          && JSON.stringify(element.fechaVuelta) === JSON.stringify(search.fechaVuelta)
          && JSON.stringify(element.checkIdaYVuelta) === JSON.stringify(search.checkIdaYVuelta)
          && JSON.stringify(element.stopOverIda) === JSON.stringify(search.stopOverIda)
          && JSON.stringify(element.nights) === JSON.stringify(search.nights) 
          && JSON.stringify(element.locale) === JSON.stringify(search.locale) 
          && numPasElement === numPasSearch;
      return !same;
    }
    return false;
  };


  if (LocalStorage.isWritable) {
    search.expirationTimestamp = new Date().setTime(new Date().getTime() + 90 * 86400000);
    if (lastSearches) {
      lastSearches = lastSearches.filter(isSameSearch);
      lastSearches.unshift(search);
      if (lastSearches.length > 5) {
        lastSearches.pop();
      }
    } else {
      lastSearches = [];
      lastSearches.unshift(search);
    }
    LocalStorage.set(keyLastSearchesSO, lastSearches);
  }
};

const existLastSearchesSO = function () {
  const keyLastSearches = 'ib-booking.lastSearchsSO';
  const lastSearches = LocalStorage.get(keyLastSearches);
  const exist = lastSearches !== null && lastSearches.length > 0;
  return exist;
};

const getLastSearchSO = function () {
  const keyLastSearches = 'ib-booking.lastSearchsSO';
  let lastSearch;
  if (existLastSearchesSO()) {
    lastSearch = LocalStorage.get(keyLastSearches)[0];
  }
  return lastSearch;
};


export {
  filterExpiredSearches,
  updateLastSearches,
  updateLastSearchesMT,
  updateLastSearchesSO,
  existLastSearches,
  existLastSearchesMT,
  existLastSearchesSO,
  getAllValidSearhes,
  getSpecificSearch,
  getLastSearchMT,
  getLastSearchSO
};
