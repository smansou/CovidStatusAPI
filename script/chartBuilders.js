import { updateChart  } from "./main.js";
import {getData, getCovidDataByCountry, getCovidDataByRegion, getWorldData} from "./data.js";




export async function fillList() {

    const list = document.querySelector('#country-list');
    const wrapper = document.querySelector('.wrapper');
    const sidebar = document.querySelector('.sidebar');
    const countryArr = await getData('https://restcountries.herokuapp.com/api/v1');
   
    for (let i = 0; i < countryArr.length; i++) {
        const listItem = document.createElement('option');
        
        listItem.textContent = countryArr[i]['name']['common'];
        listItem.value = countryArr[i]['cca2'];
        list.appendChild(listItem);
    }
    list.addEventListener('change', () => {
        wrapper.setAttribute('style', 'width: 100%')
        sidebar.setAttribute('style', "width: 0%");
        sidebar.setAttribute('data-visible', "no");
        buildCountryChart(list.value);
    })

}
export const chart = document.querySelector("#chart").getContext('2d');
export let covidChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data: [],
            backgroundColor: ['#cfd6e6'],
            borderWidth: 1.5,
            borderColor: ['#5a83f3'],

        }]
    },
    options: {}
    
})

export async function buildWorldChart() {
    const dataObj = await getWorldData();
    updateChart(covidChart, 'Global', Object.values(dataObj), Object.keys(dataObj));


}

export async function buildCountryChart(countryCode) {

    const countryObj = await getCovidDataByCountry(countryCode);
    updateChart(covidChart, countryObj['name'], Object.values(countryObj['data']), Object.keys(countryObj['data']) ) ;

}

export async function buildRegionChart(region, criteria, chart) {

    const regionData = await getCovidDataByRegion(region)
    const namesArr = regionData.map(e => e['name']);
    const valuesArr = regionData.map(e => e['latest_data'][criteria]);
    updateChart(covidChart,`${region} : ${criteria}`, valuesArr, namesArr ) ;

}