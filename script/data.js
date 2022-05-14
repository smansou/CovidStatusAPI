export async function getData(url) {
    const proxy = 'https://nameless-citadel-58066.herokuapp.com/';

    const response = await fetch(proxy + url)
        .then((resp) => {
            return resp.json();
        })
    return response;
}

export async function getCountryCodesByRegion(region) {
    const allCountries = await getData(`restcountries.herokuapp.com/api/v1/region/${region}`);
    const countryCodes = allCountries.map(e => e['cca2']);
    return countryCodes;
}

export async function getCovidDataByRegion(region) {
    const codesArr = await getCountryCodesByRegion(region);
    const allCountriesData = await getData('https://corona-api.com/countries');
    const regionCovid = allCountriesData['data'].filter(e => codesArr.indexOf(e['code']) != -1)

    return regionCovid;
}

export async function getCovidDataByCountry(countryCode) {
    const countryObj = await getData(`https://corona-api.com/countries/${countryCode}`);
    const dataObj = {
        name: countryObj['data']['name'],
        data: {
            confirmed: countryObj['data']['latest_data']['confirmed'],
            deaths: countryObj['data']['latest_data']['deaths'],
            recovered: countryObj['data']['latest_data']['recovered'],
            critical: countryObj['data']['latest_data']['critical'],
        }

    }
    return dataObj;
}

export async function getWorldData() {
    const data = await getData("https://corona-api.com/timeline");

    const dataObj = {
        confirmed: (data['data'][0]['confirmed']),
        deaths: (data['data'][0]['deaths']),
        recovered: (data['data'][0]['recovered']),
        newConfirmed: (data['data'][0]['new_confirmed']),
        active: data['data'][0]['active'],
        newRecovered: data['data'][0]['new_recovered'],
        newRecovered: data['data'][0]['new_recovered'],
    }
    return dataObj;
}