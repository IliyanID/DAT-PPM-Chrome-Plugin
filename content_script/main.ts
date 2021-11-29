import { API } from './API'
import { htmlToElement, sleep, waitToLoad } from './utils'
import { getRowHTML} from './RowHeader'
const api = new API();
let port = chrome.runtime.connect();
export type load = {
    commodity?:string,
    comment1?: string,
    comment2?: string,
    docketNumber?: string,
    dockHours?: string,
    pickupHours?: string,
    referenceId?: string,
    PPM?:number,
    id?:number,
    age?:string,
    presentationDate?:string,
    equipmentClass?:string,
    isPartial?:string,
    origin?:string,
    tripMiles?:string,
    destination?:string,
    deadheadMilesDestination?:string,
    company?:string,
    contactPhone?:string,
    length?:string,
    weight?:string,
    creditScore?:string,
    rate?:string,
    TIAURL?:string
}

let allLoads:load[] = []
let intervalId = -1;
let lastScroll =-1
let calculatePPM = true
const columnName = 'PPM'
let minRate = 0;
let maxResults = 150;



const clickEventLisitioner = async (e:any) =>{
    await waitToLoad('sortField')
    let headerContainer = document.getElementsByClassName('sortField')
    if(headerContainer[0] === undefined){
        console.error(`Failed to Find Header Container with className 'sortField'`)
        return
    }
    let headers = []
    for(let i = 0; i < headerContainer.length - 1; i++){
        let headerChild = headerContainer[i].children[0]
        let headerWrapper = headerChild.getElementsByClassName('ng-scope')[0]
        if(headerWrapper === undefined){
            console.error(`Failed to find headerWrapper with className path '.columnHeaders.ng-scope'`)
            continue
        }
        headers.push(headerWrapper.innerHTML)
    }

    let headerName = e.path[0].innerHTML
    clearInterval(intervalId)

    if(headers.includes(headerName)){
        calculatePPM = true;
        await sleep(2000)
    }
    
    else if(headerName === columnName){
        calculatePPM = false;
        //Remove all pre-existing trips
            let tableResults = document.getElementsByClassName('searchResultsTable')[0]
            while(tableResults.children.length > 1)
                tableResults.children[1].remove();
        allLoads = await api.getAllLoads()
        updateAllRows()
    }
    else        
        calculatePPM = true;
    
    lastScroll = -1
    intervalId = window.setInterval(init,500)   
}

const addTableHeaders = async () =>{
    let tableHeadersClassName = 'columnHeaders'
    await waitToLoad(tableHeadersClassName)

    const headerRawHtml = 
    `<th style="cursor:pointer" class="bookItNow ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope" sortable="BookItNow" ng-model="ctrl.currentSort" desc-first="true" ng-if="isLoadSearch()" id="PPM">
        <a style="cursor:pointer" class="sortField ">
            <ng-transclude>
                <span style="cursor:pointer" class="ng-scope">${columnName}</span>
            </ng-transclude>
            <i class="sort"></i>
        </a>
    </th>
    `
    const injectElement = htmlToElement(headerRawHtml)
    let tableHeaderContainer = document.getElementsByClassName(tableHeadersClassName)[0]

    //Remove BookIt Header
    tableHeaderContainer.children[tableHeaderContainer.children.length-1].remove()
    //Add PPM Header
    tableHeaderContainer.appendChild(injectElement)
}

const updateAllRows = async () =>{
    const calculatePPM = (trip:any) =>{
        let PPM = 0;
        let rate = (trip.rate !== '—') ? trip.rate.replaceAll(',','').replaceAll('$','') : 0;
        let distance = (trip.tripMiles !== '—') ? trip.tripMiles.replace(/\D/g, '') : 0;

        rate = parseFloat(rate)
        distance = parseFloat(distance)
        
        if(distance > 0)
            PPM = parseFloat((rate/distance).toFixed(2))
  
        
        return PPM
    }

    //Calculate PPM for all loads
    allLoads = allLoads.map((item:load)=>{
        const PPM = calculatePPM(item)
        item['PPM'] = PPM
        return item
    })

    //Sort By PPM
    allLoads = allLoads.sort((a:load,b:load)=>{
        if(a.PPM < b.PPM) return 1
        if(a.PPM > b.PPM) return -1
        return 0
    })


    //Add sorted trips to list
    let listed = 0
    allLoads.forEach(async (load:load,index:number)=>{
        if(index+1 > maxResults || load.PPM === 0)
            return
        if(parseInt(load.rate.replace(',','').substring(1)) > minRate){
            listed = listed + 1
            let hideExtraDetails = true
            let newLoadElement = htmlToElement(`<tbody class="resultItem exactMatch qa-scrollLock">${await getRowHTML(load,hideExtraDetails)}</tbody>`)
            document.getElementsByClassName("searchResultsTable")[0].appendChild(newLoadElement)
            
            newLoadElement.addEventListener('click',async ()=>{
                hideExtraDetails = !hideExtraDetails
                let newHTML = await getRowHTML(load,hideExtraDetails)
                newLoadElement.innerHTML = newHTML
            })
            
        }
    })  
}

const resetRowPPM = () =>{
    let tableRows = document.getElementsByClassName('qa-match-row')
    for(let i = 0; i < tableRows.length;i++){
        let tableRow = tableRows[i];
        try{
            //Remove BookIt from row if it exists
            tableRow.getElementsByClassName('bookItNow')[0].remove()
        }catch(e){}
        try{
            //Removed last PPM if it exists
            tableRow.getElementsByClassName('rate')[1].remove()
        }catch(e){}
    }

}

const addPPM = async () =>{
    let tableRows = document.getElementsByClassName('qa-match-row')
    
    for(let i = 0; i < tableRows.length;i++){
        let tableRowElement = tableRows[i];

        let distance:number|string = tableRowElement.getElementsByClassName('trackLink')[0].innerHTML.replace(/\D/g, '')
        let rate:number|string = tableRowElement.getElementsByClassName('rate')[0].innerHTML

        let PPM:string|number = 0
        if(rate && distance && rate !== '—' && distance !== '—'){
            distance = parseInt(distance)
            rate = parseInt(rate.replace(',','').substring(1))
            PPM = (rate/distance).toFixed(2);
        }
        
        //console.log(`PPM : ${PPM} | rate : ${rate} | distance : ${distance}`)
        
        const PPMRow =htmlToElement( `<td class='rate'>$${PPM}</td>`)
        tableRowElement.appendChild(PPMRow)
    }
}

const init = async () =>{
    try{port.postMessage('')}catch(e){port = chrome.runtime.connect();}


    let scrollClassName = 'fixed-table-container-inner groupsClosed'
    await waitToLoad(scrollClassName)
    const ScrollElement = document.getElementsByClassName(scrollClassName)[0]
    if(ScrollElement === undefined){
        console.error(`Failed to Find Element with class ${scrollClassName}`)
        return
    }
    const currentScroll = ScrollElement.scrollTop

    if(currentScroll > lastScroll && calculatePPM){
        resetRowPPM();
        addPPM();
    }
    lastScroll = currentScroll
}

addTableHeaders()
intervalId = window.setInterval(init,500)
document.addEventListener('click',clickEventLisitioner)

port.onMessage.addListener(function(msg) {
    if(minRate !== msg.minRate || maxResults !== msg.results){
        minRate = msg.minRate
        maxResults = msg.results
        if(!calculatePPM)
        clickEventLisitioner({path:[columnName]})
    }
});