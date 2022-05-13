
//!COVID API 
//* get all countries -->  https://corona-api.com/countries
//* get data by country -->  https://corona-api.com/countries/:code
//! CountriesAPI
//* get all countries --> https://restcountries.herokuapp.com/api/v1
//* get countries by region --> 'restcountries.herokuapp.com/api/v1/region/:region_name'
//! PROXY -->  https://cors-anywhere.herokuapp.com/


const list = document.querySelector('#country-list');

async function fillList() {
    const countryArr = await getData('https://restcountries.herokuapp.com/api/v1');
    for (let i = 0; i < countryArr.length; i++) {
        const item = document.createElement('option');
        item.textContent = countryArr[i]['name']['common'];
        item.value = countryArr[i]['cca2'];

        list.appendChild(item);
    }

}


async function buildCountryChart(countryCode) {
    const chart = document.querySelector("#chart").getContext('2d');
    const countryObj = await getCovidDataByCountry(countryCode);
    const CovidChart = new Chart(chart, {
        type: 'bar',                                        //! check more types
        data: {
            labels: Object.keys(countryObj['data']),
            datasets: [{
                label: countryObj['name'],
                data: Object.values(countryObj['data'])
            }]
        },
        options: {},

    })

}
async function buildRegionChart(region, criteria) {
    const chart = document.querySelector("#chart").getContext('2d');
    const regionData = await getCovidDataByRegion(region)
    const namesArr = regionData.map(e => e['name']);
    const valuesArr = regionData.map(e => e['latest_data'][criteria]);
    console.log(namesArr);
    const CovidChart = new Chart(chart, {
        type: 'line',                                        //! check more types
        data: {
            labels: namesArr,
            datasets: [{
                label: `${region} : ${criteria}`,
                data: valuesArr,
            }]
        },
        options: {}

    })
}

// buildRegionChart('africa', 'confirmed')







async function getData(url) {
    const proxy = 'https://nameless-citadel-58066.herokuapp.com/';
    // const proxy = 'https://cors-anywhere.herokuapp.com/';

    const response = await fetch(proxy + url)
        .then((resp) => {
            return resp.json();
        })
    //   .then ((data)=>{console.log(data);})
    return response;
}



async function getCountryCodesByRegion(region) {
    const allCountries = await getData(`restcountries.herokuapp.com/api/v1/region/${region}`);
    const countryCodes = allCountries.map(e => e['cca2']);
    return countryCodes;
}






async function getCovidDataByRegion(region) {
    const codesArr = await getCountryCodesByRegion(region);
    const allCountriesData = await getData('https://corona-api.com/countries');
    const regionCovid = allCountriesData['data'].filter(e => codesArr.indexOf(e['code']) != -1)

    console.log(regionCovid);
    return regionCovid;
}

async function getCovidDataByCountry(countryCode) {
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
async function getWorldData(){
    const data = await getData("https://corona-api.com/timeline");
    
    const dataObj = {
            confirmed: data['data'][0]['confirmed'], 
            deaths: data['data'][0]['deaths'], 
            recovered: data['data'][0]['recovered'], 
            newConf: data['data'][0]['new_confirmed'], 
            active: data['data'][0]['active'], 
    }
    console.log(dataObj);
    return dataObj;
}
 async function buildWorldChart(){
     const dataObj = await getWorldData();
     const CovidChart = new Chart(chart, {
        type: 'bar',                                        //! check more types
        data: {
            labels: Object.keys(dataObj),
            datasets: [{
                label: "Global",
                data: Object.values(dataObj)
            }]
        },
        options: {},

    })

 }

fillList();
// buildCountryChart('br')

    function onload(){
       const btnAF = document.querySelector('.btn-africa');
      const  btnAS = document.querySelector('.btn-asia');
      const  btnAM = document.querySelector('.btn-america');
       const btnEU = document.querySelector('.btn-europe');
        const btnOC = document.querySelector('.btn-oceania');
        buildWorldChart();
        
        
    }
    onload()