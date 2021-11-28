
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
        if(msg.minRate)
            minRate = msg.minRate
        else
            port.postMessage(minRate);
    });
});


