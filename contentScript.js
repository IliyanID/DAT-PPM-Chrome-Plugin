const init = () =>{
    const injectElement = document.createElement('div')
    injectElement.className = ''
    injectElement.innerHTML = 'Hello Text'
    document.body.appendChild(injectElement)
}
init();