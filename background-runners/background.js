
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

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        let response = {}
        response[msg.cookie] = await wrapper(msg.cookie)
        port.postMessage(response);
    });
});


