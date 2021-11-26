export const htmlToElement = (html) => {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const waitToLoad = async (className) =>{
    for(let i = 0; i < 10; i++){
        if(document.getElementsByClassName(className)[0] !== undefined)
            return
        await sleep(500)
    }
}