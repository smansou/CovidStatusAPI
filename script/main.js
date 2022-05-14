
//!COVID API 
//* get all countries -->  https://corona-api.com/countries
//* get data by country -->  https://corona-api.com/countries/:code
//! CountriesAPI
//* get all countries --> https://restcountries.herokuapp.com/api/v1
//* get countries by region --> 'restcountries.herokuapp.com/api/v1/region/:region_name'
//! PROXY -->  https://cors-anywhere.herokuapp.com/








async function fillList() {
    const list = document.querySelector('#country-list');
    const  criteriaButtons = document.querySelector('.lower-button-container')
    const countryArr = await getData('https://restcountries.herokuapp.com/api/v1');
    for (let i = 0; i < countryArr.length; i++) {
        const listItem = document.createElement('option');
        listItem.textContent = countryArr[i]['name']['common'];
        listItem.value = countryArr[i]['cca2'];
        list.appendChild(listItem);
        
    }
    
    list.addEventListener('change', ()=>{
    
        criteriaButtons.setAttribute('style',"display: none;");
        buildCountryChart(list.value);
    })
}

  
   
 


const chart = document.querySelector("#chart").getContext('2d');
let covidChart = new Chart(chart, {
        type: 'bar',                                        //! check more types
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: ['#5a83f3'],
            }]
        },
        options: {}

    })


    async function buildWorldChart(){
        const dataObj = await getWorldData();
       
       covidChart.clear()
       covidChart.data.labels = Object.keys(dataObj)
       covidChart.data.datasets[0].label = 'Global'
       covidChart.data.datasets[0].data = Object.values(dataObj)
       covidChart.update()
   
    }

async function buildCountryChart(countryCode) {

    const countryObj = await getCovidDataByCountry(countryCode);
    covidChart.clear()
    covidChart.data.datasets[0].label = countryObj['name'];
    covidChart.data.datasets[0].data = Object.values(countryObj['data']);
    covidChart.data.labels = Object.keys(countryObj['data']);
    covidChart.update()
}

async function buildRegionChart(region, criteria, chart) {
  
    const regionData = await getCovidDataByRegion(region)
    const namesArr = regionData.map(e => e['name']);
    const valuesArr = regionData.map(e => e['latest_data'][criteria]);
    covidChart.clear()
    covidChart.data.datasets[0].label = `${region} : ${criteria}`;
    covidChart.data.datasets[0].data = valuesArr;
    covidChart.data.labels = namesArr;
    covidChart.update()
}


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
    return dataObj;
}



// buildCountryChart('br')

    async function onload(){
        fillList();
       const btnAF = document.querySelector('.btn-africa');
      const  btnAS = document.querySelector('.btn-asia');
      const  btnAM = document.querySelector('.btn-america');
       const btnEU = document.querySelector('.btn-europe');
        const btnOC = document.querySelector('.btn-oceania');
       const  criteriaButtons = document.querySelector('.lower-button-container')
       await buildWorldChart();
       let current = null;
        btnAF.addEventListener('click', ()=>{
            current = 'africa';
            buildRegionChart('africa', 'confirmed', chart);
            criteriaButtons.setAttribute('style',"visibility: visible;");
        })
        btnOC.addEventListener('click', ()=>{
            current = 'oceania';
            buildRegionChart('oceania', 'confirmed', chart);
            criteriaButtons.setAttribute('style',"visibility: visible;");
        })
        btnAM.addEventListener('click', ()=>{
            current = 'americas';
            buildRegionChart('americas', 'confirmed', chart);
            criteriaButtons.setAttribute('style',"visibility: visible;");
        })
        btnEU.addEventListener('click', ()=>{
            current = 'europe';
            buildRegionChart('europe', 'confirmed', chart);
            criteriaButtons.setAttribute('style',"visibility: visible;");
        })
        btnAS.addEventListener('click', ()=>{
            current = 'asia';
            buildRegionChart('asia', 'confirmed', chart);
            criteriaButtons.setAttribute('style',"visibility: visible;");
        })
       
           const confirmedBtn = document.querySelector('.btn-confirmed');
           const deathsBtn = document.querySelector('.btn-deaths');
           const recoveredBtn = document.querySelector('.btn-recovered');
           const criticalBtn = document.querySelector('.btn-critical');
            confirmedBtn.addEventListener('click', ()=>{
                buildRegionChart(current, 'confirmed', chart);
            })
            deathsBtn.addEventListener('click', ()=>{
                buildRegionChart(current, 'deaths', chart);
            })
            recoveredBtn.addEventListener('click', ()=>{
                buildRegionChart(current, 'recovered', chart);
            })
            criticalBtn.addEventListener('click', ()=>{
                buildRegionChart(current, 'critical', chart);
            })
    }


    onload()

   