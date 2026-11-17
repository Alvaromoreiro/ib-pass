function getCityByCode(data, iata, BAHCode, descript) {
  if (BAHCode) {
    return data.find(
      (curr) => curr.locationId === BAHCode,
    );
  } if (descript) {
    return data.find(
      (curr) => curr.description === descript,
    );
  }
  return data.find(
    (curr) => curr.code === iata,
  );
}
const getCityListInformation = (json, iata, BAHCode, descript) => {
  let cityinfo; let i;
  for (i = 0; i < json.length; i += 1) {
    cityinfo = getCityByCode(json[i].cities, iata, BAHCode, descript);
    if (cityinfo) {
      cityinfo.area = json[i].code;
      return cityinfo;
    }
  }
  return cityinfo;
};
export default getCityListInformation;
