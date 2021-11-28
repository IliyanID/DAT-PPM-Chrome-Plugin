
function getCookies (domain, name) {
    return new Promise(resolve => {
        chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
            resolve(cookie.value)
        });
    });
    
}

const  wrapper = async (cookie) =>{
    return await getCookies('https://power.dat.com',cookie)
}


let minRate = 0;

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        if(msg.minRate){
            minRate = msg.minRate
            chrome.storage.local.set({minRate: msg.minRate}, function() {
                //console.log('Value is set to ' + value);
            });
        }
        else
        chrome.storage.local.get(['minRate'], function(result) {
            console.log('Value currently is ' + result.minRate);
            port.postMessage(result.minRate);

          });
    });
});


