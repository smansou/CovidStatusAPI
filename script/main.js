

import { chart, fillList, buildWorldChart, buildRegionChart  } from "./chartBuilders.js";
import { getData, getCountryCodesByRegion } from "./data.js";



export async function updateChart(chart, title, data, labels) {
    chart.clear();
    chart.data.datasets[0].label = title;
    chart.data.datasets[0].data = data;
    chart.data.labels = labels;
    chart.update();
}


async function onload() {
    fillList();
    const btnAF = document.querySelector('.btn-africa');
    const btnAS = document.querySelector('.btn-asia');
    const btnAM = document.querySelector('.btn-america');
    const btnEU = document.querySelector('.btn-europe');
    const btnOC = document.querySelector('.btn-oceania');
    const criteriaButtons = document.querySelector('.lower-button-container')
    const sidebar = document.querySelector('.sidebar');
    const wrapper = document.querySelector('.wrapper');
    sidebar.setAttribute('data-visible', "no");
    
    await buildWorldChart();
    let current = null;
    btnAF.addEventListener('click', () => {
        current = 'africa';
        buildRegionChart('africa', 'confirmed', chart);
        sidebar.setAttribute('style', "width: 5%;");
        sidebar.setAttribute('data-visible', "yes");
        wrapper.setAttribute('style', 'width: 95%')
    })
    btnOC.addEventListener('click', () => {
        current = 'oceania';
        buildRegionChart('oceania', 'confirmed', chart);
        sidebar.setAttribute('style', "width: 5%;");
        sidebar.setAttribute('data-visible', "yes");
        wrapper.setAttribute('style', 'width: 95%')

    })
    btnAM.addEventListener('click', () => {
        current = 'americas';
        buildRegionChart('americas', 'confirmed', chart);
        sidebar.setAttribute('style', "width: 5%;");
        sidebar.setAttribute('data-visible', "yes");
        wrapper.setAttribute('style', 'width: 95%')

    })
    btnEU.addEventListener('click', () => {
        current = 'europe';
        buildRegionChart('europe', 'confirmed', chart);
        sidebar.setAttribute('style', "width: 5%;");
        sidebar.setAttribute('data-visible', "yes");
        wrapper.setAttribute('style', 'width: 95%')

    })
    btnAS.addEventListener('click', () => {
        current = 'asia';
        buildRegionChart('asia', 'confirmed', chart);
        sidebar.setAttribute('style', "width: 5%;");
        sidebar.setAttribute('data-visible', "yes");
        wrapper.setAttribute('style', 'width: 95%')
    })

    const confirmedBtn = document.querySelector('.btn-confirmed');
    const deathsBtn = document.querySelector('.btn-deaths');
    const recoveredBtn = document.querySelector('.btn-recovered');
    const criticalBtn = document.querySelector('.btn-critical');

    confirmedBtn.addEventListener('click', () => {
        buildRegionChart(current, 'confirmed', chart);
    })
    deathsBtn.addEventListener('click', () => {
        buildRegionChart(current, 'deaths', chart);
    })
    recoveredBtn.addEventListener('click', () => {
        buildRegionChart(current, 'recovered', chart);
    })
    criticalBtn.addEventListener('click', () => {
        buildRegionChart(current, 'critical', chart);
    })
}
  


onload()
