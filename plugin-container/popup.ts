import { InputHTMLAttributes } from "react";

document.addEventListener('DOMContentLoaded', documentEvents  , false);

let port = chrome.runtime.connect();
let results:HTMLInputElement
let minRate:HTMLInputElement
const handleSave = (e:any) =>{
    document.getElementById('save-settings').style.border = '1px solid green'
    document.getElementById('save-settings').style.color = 'green'
    document.getElementById('save-settings').innerHTML = 'Saved'
    port.postMessage({minRate:minRate.value,results:results.value})
}
const handleNumLoads = (e:any) =>{
    document.getElementById('resultsValue').innerHTML = e.target.value
}



function documentEvents() {  
    results = document.getElementById('results') as HTMLInputElement
    minRate = document.getElementById('rate') as HTMLInputElement

    let save = document.getElementById('save-settings') as HTMLInputElement
    save.addEventListener('click', handleSave);
    
    
    port.postMessage('')
    port.onMessage.addListener(function(msg) {
        minRate.value = msg.minRate;
        console.log(`results: ${msg.results}`)
        results.value = msg.results;
        document.getElementById('resultsValue').innerHTML = msg.results
    });

    let numLoads = document.getElementById('results') as HTMLInputElement
    numLoads.addEventListener('input',handleNumLoads)
}
