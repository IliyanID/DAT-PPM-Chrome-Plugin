let lastY = -1

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let autoSort = false

const sortByPPM = () =>{
    let tableRows = document.getElementsByClassName('resultItem')

    const sorter = ((a,b) =>{
        let aPPM,bPPM
        try{aPPM = parseFloat(a.getElementsByClassName('rate')[1].innerHTML)}
        catch(e){aPPM = 0}

        try{bPPM = parseFloat(b.getElementsByClassName('rate')[1].innerHTML)}catch(e){bPPM = 0}

        if(aPPM < bPPM)return 1
        if(aPPM > bPPM) return -1
        return 0
    })

    let originalRows = Array.from(tableRows);

    let sorted = originalRows.sort(sorter);

    let tableResults = document.getElementsByClassName('searchResultsTable')[0]
    for(let i = 1; i < tableResults.children.length;i++){
        tableResults.removeChild(tableResults.children[i])
    }
    
    sorted.forEach(e => document.getElementsByClassName("searchResultsTable")[0].appendChild(e));

}

const addTableHeaders = () =>{
    const item = 
    `<th class="bookItNow ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope" sortable="BookItNow" ng-model="ctrl.currentSort" desc-first="true" ng-if="isLoadSearch()" id="PPM">
        <a class="sortField ">
            <ng-transclude>
                <span class="ng-scope">Price Per Mile</span>
            </ng-transclude>
            <i class="sort"></i>
        </a>
    </th>
    `
    const injectElement = htmlToElement(item)


    let table = document.getElementsByClassName('columnHeaders')[0]
    table.appendChild(injectElement)

    document.addEventListener('click',async (e)=>{
        let headers = ['Age','Pickup','Truck','F/P','DH-O','Origin','Trip','Destination','DH-D','Company','Contact','Length','Weight','CS','DTP','Factor','Rate','Book']
        let headerName = e.path[0].innerHTML
        if(headers.includes(headerName)){
            autoSort = false;
            await sleep(1000)
        }
        else if(headerName === 'Price Per Mile'){
            autoSort = true;
        }

        lastY = -1
        init()


    })
    //injectElement.addEventListener('click',()=>{autoSort = true})
}

const resetRowPPM = () =>{
    try{
    let tableRows = document.getElementsByClassName('qa-match-row')
    for(let i = 0; i < tableRows.length;i++){
        let tableRow = tableRows[i];

        let rate = tableRow.getElementsByClassName('rate')
        rate[1].remove()
    }
    }catch(e){}
}

const addPPM = () =>{
    let tableRows = document.getElementsByClassName('qa-match-row')
    for(let i = 0; i < tableRows.length;i++){
        let tableRow = tableRows[i];
        let distance = tableRow.getElementsByClassName('trip')[0].firstChild.innerHTML
        let rate = tableRow.getElementsByClassName('rate')[0].innerHTML
        

        let PPM = 0
        if(rate && distance && rate !== '—' && distance !== '—'){
            distance = parseInt(distance.replace(/\D/g, ''))
            rate = parseInt(rate.replace(',','').substring(1))
            PPM = (rate/distance).toFixed(2);
        }
 
        
        let addedColumn =htmlToElement( 
        `
            <td class='rate'>${PPM}</td>
        `)
        tableRow.appendChild(addedColumn)
    }
}

let addedHeader = false;

const init = async () =>{
    try{
    while(document.getElementsByClassName('columnHeaders')[0] === undefined){
        await sleep(500);
    }
    while(document.getElementsByClassName('fixed-table-container-inner groupsClosed')[0] === undefined)
        await sleep(500)
    
    let currentY = document.getElementsByClassName('fixed-table-container-inner groupsClosed')[0].scrollTop
    if(currentY <= lastY){
        lastY = currentY
        return
    }
    lastY = currentY;


    if(!addedHeader){
        addedHeader = true;
        addTableHeaders()
    }

    resetRowPPM();
    addPPM();

    if(autoSort)
        sortByPPM();

    }catch(e){console.error(e);}   
}
setInterval(init,500)