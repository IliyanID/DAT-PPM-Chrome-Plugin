document.addEventListener('DOMContentLoaded', documentEvents  , false);

let port = chrome.runtime.connect();

const handleChange = (e:any) =>{
    port.postMessage({minRate:e.target.value})
}



function documentEvents() {  
    let input = document.getElementById('input') as HTMLInputElement
    input.addEventListener('change', handleChange);
    port.postMessage('')
    port.onMessage.addListener(function(msg) {
        input.value = msg
    });
}
