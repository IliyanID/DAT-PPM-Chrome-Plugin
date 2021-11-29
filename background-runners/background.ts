
function getCookies (domain:string, name:string) {
    return new Promise(resolve => {
        chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
            resolve(cookie.value)
        });
    });
    
}

const  wrapper = async (cookie:string) =>{
    return await getCookies('https://power.dat.com',cookie)
}


let minRate = 0;
let results = 150;
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        if(msg.minRate !== undefined && msg.results !== undefined){
            minRate = msg.minRate
            results = msg.results
            chrome.storage.local.set({settings: msg}, function() {
                //console.log('Value is set to ' + value);
            });
        }
        else{
            chrome.storage.local.get(['settings'], function(result) {
                port.postMessage(result.settings);

            });
        }
    });
});


