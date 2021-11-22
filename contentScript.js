let CredentialCookies = {
    ".DATPOWERAUTH":undefined,
    ".TCAUTH":undefined
}

let lastY = -1
let addedHeader = false;
let loads = []
let intervalId = -1;
let searchId = ''


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
    while(tableResults.children.length > 1){
        tableResults.removeChild(tableResults.children[1])
    }
    
    sorted.forEach(e => document.getElementsByClassName("searchResultsTable")[0].appendChild(e));

}

const addTableHeaders = () =>{
    const item = 
    `<th style="cursor:pointer" class="bookItNow ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope" sortable="BookItNow" ng-model="ctrl.currentSort" desc-first="true" ng-if="isLoadSearch()" id="PPM">
        <a style="cursor:pointer" class="sortField ">
            <ng-transclude>
                <span style="cursor:pointer" class="ng-scope">Price Per Mile</span>
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
            clearInterval(intervalId)
            await sendApiCall()
            updateAllRows()
            intervalId = setInterval(init,500)
        }

        

        lastY = -1




    })
}

const updateAllRows = async () =>{

    console.log("intervalid: "+intervalId)
    const calculatePPM = (a) =>{
        aPPM = 0;
        let rate = (a.rate !== '—') ? a.rate.replaceAll(',','').replaceAll('$','') : 0;
        let distance = (a.tripMiles !== '—') ? a.tripMiles.replaceAll(',','') : 0;

        rate = parseInt(rate)
        distance = parseInt(distance)
        
        if(distance > 0)
            aPPM = (rate/distance).toFixed(2)
  
        
        return parseFloat(aPPM)
    }

    loads = loads.map((item)=>{
        let ppm = calculatePPM(item)
        item['PPM'] = ppm
        return item
    })

    loads = loads.sort((a,b)=>{
        if(a.PPM < b.PPM) return 1
        if(a.PPM > b.PPM) return -1
        return 0
    })

    let templateRow = document.getElementsByClassName('resultItem')[0].cloneNode(true);

    let tableResults = document.getElementsByClassName('searchResultsTable')[0]
    while(tableResults.children.length > 1){
        tableResults.removeChild(tableResults.children[1])
    }

    
    

    loads.forEach(async load=>{

    //console.log(`PPM: ${calculatePPM(load)} | rate : ${load.rate} | distance : ${load.tripMiles}`)

    const getRowHTML = async(hide,id) =>{
        let hideClass = (hide)?' ng-hide':''

        let defaultInfo = {
            "commodity": "Dry Pallets, Quick loading and unloading",
            "comment1": "Pick up  late morning and deliver straight through",
            "comment2": "29 pallets total of clothing",
            "docketNumber": "MC#935825",
            "dockHours": "0800-2000",
            "pickupHours": "0600"
        }

        if(!hide){
            let response = await fetch(`https://power.dat.com/search/matches/take/?matchId=${id}&searchId=${searchId}`, {
                "headers": {
                "x-requested-with": "XMLHttpRequest"
                },
                "body": null,
                "method": "GET",
                "credentials": "include"
                });

            response = await response.json();
            defaultInfo = {...response}
            
        }

        let element = 
        `
        
            <tr id="${load.id}" class="qa-match-row resultSummary unread">
	            <td class="activity" rowspan="4"> <!-- rowspan is for groups formatting when expanded -->
		            <!-- rowspan is for groups formatting when expanded -->
		            <mark></mark>
	            </td>
	        <td class="new">&nbsp;</td> <!-- Please leave the nbsp, they are necessary for table row strikeout to work right in IE -->
	        
            <td class="select">
		        <input type="checkbox" class="customCheckbox searchBatch" id="${load.id}-check">
		        <label for="${load.id}-check"></label>
		        &nbsp;
	        </td>

	        <td class="age ">${load.age}</td>

	        <td class="avail ">${load.presentationDate}</td>

	        <td class="truck ">${load.equipmentClass}</td>

            <td class="fp ">${load.isPartial}</td>

	        <td class="do ">0</td>

	        <td class="origin">${load.origin}</td>

	        <td class="trip">
                <a  
                    href="urls?Category=Routing&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114&amp;CategoryProvider=ProMiles" 
                    class="trackLink" 
                    track-link-category="Trip Miles" 
                    target="_blank">
                        ${load.tripMiles}
                </a>
            </td>

            <td class="dest ">${load.destination}</td>

	        <td class="dd ">${load.deadheadMilesDestination}</td>

	        <td class="company dropdown ">
		         <a data-toggle="dropdown" 
                    class="trackLink companyToggle" 
                    title="${load.company} (click for details)">
                        ${load.company}
                </a>
            </td>

	        <td class="contact">${load.contactPhone}</td>

	        <td class="length ">${load.length}</td>

	        <td class="weight ">${load.weight}</td>

	        <td class="cs">
                <a  href="urls?Category=CustomerDirectoryCreditProfile&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114" 
                    class="trackLink" 
                    track-link-category="Credit Score" 
                    target="_blank">
                        ${load.creditScore}
                </a>
            </td>

            <td class="dtp">
                <a  href="urls?Category=CustomerDirectoryCreditProfile&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114" 
                    class="trackLink" 
                    track-link-category="Credit Score" 
                    target="_blank">
                        22
                </a>
            </td>

	        <td class="factorable" title="Factor It">
                <a  href="urls?Category=Factoring&amp;MatchId=LS49dmtj&amp;RegistryId=S.117764.241114&amp;CategoryProvider=abc" 
                    class="trackLink" 
                    track-link-category="Factoring" 
                    target="_blank">
                </a>
            </td>

	        <td class="rate">${load.rate}</td>

	        <td class="bookItNow">${load.bookItNowFormatted}</td>

            <td class="rate">${load.PPM}</td>
        </tr>
<tr class="groupData ng-scope ${hideClass}">
	<td colspan="20">
		<!-- colspan not the same as summary row due to rowspan in groups -->
		<a class="menuToggle "></a>
        <mark class="workInitials "></mark>
        <mark class="status "></mark>
        <p class="notesLabel "><span class="label">Notes:</span> <span class="note"></span></p>
		<aside>
			<fieldset class="workstatus">
				<input type="radio" name="LS49eBCa-status" value="1" id="LS49eBCa-1">
				<label for="LS49eBCa-1">Accepted</label>
				<input type="radio" name="LS49eBCa-status" value="2" id="LS49eBCa-2">
				<label for="LS49eBCa-2">Called</label>
				<input type="radio" name="LS49eBCa-status" value="3" id="LS49eBCa-3">
				<label for="LS49eBCa-3">No Longer Available</label>
				<input type="radio" name="LS49eBCa-status" value="4" id="LS49eBCa-4">
				<label for="LS49eBCa-4">Refused</label>
				<input type="radio" name="LS49eBCa-status" value="5" id="LS49eBCa-5">
				<label for="LS49eBCa-5">Unqualified</label>
                <a class="removeStatusNotes ng-hide">Remove status and notes</a>
			</fieldset>
			<fieldset class="notes">
                <textarea placeholder="Pick a status" class="note" maxlength="256" disabled=""></textarea>
				<button class="cancelworkstatus" type="button"></button>
                <button class="setworkstatus" type="button" disabled="">Submit</button>
			</fieldset>
		</aside>
	</td>
</tr>

<tr class="resultDetails  ng-scope ${hideClass}">
	<td colspan="20">
		<!---->
		<!-- colspan not the same as summary row due to rowspan in groups -->
		<dl>
			<dt>Ref:</dt>
			<dd class="refId"></dd>

			
			<dt>Commodity:</dt>
			<dd class="commodity" title="${defaultInfo.commodity}">${defaultInfo.commodity}</dd>
			
		</dl>

		<dl>
			<dt>Comments 1:</dt>
			<dd class="comments1" title="${defaultInfo.comment1}">${defaultInfo.comment1},</dd>

			<dt>Comments 2:</dt>
			<dd class="comments2" title="${defaultInfo.comment2}">${defaultInfo.comment2}</dd>

			
			<dt>Dock Hours:</dt>
			<dd class="dock-hours" title="${defaultInfo.dockHours}">${defaultInfo.dockHours}</dd>
			

			
			<dt>Pickup Hours:</dt>
			<dd class="pickup-hours" title="${defaultInfo.pickupHours}">${defaultInfo.pickupHours}</dd>
			
		</dl>
	</td>
</tr>
<tr class="actions ng-scope ${hideClass}">
    <td colspan="20">
        <a class="print" title="Print"></a>
    </td>
</tr>
        `
        return element
    }
        let newLoadElement = htmlToElement(`<tbody class="resultItem exactMatch qa-scrollLock">${await getRowHTML(true,load.id)}</tbody>`)
        document.getElementsByClassName("searchResultsTable")[0].appendChild(newLoadElement)
        let hideExtraDetails = true
        newLoadElement.addEventListener('click',async (e)=>{
            hideExtraDetails = !hideExtraDetails
            let newHTML = await getRowHTML(hideExtraDetails,load.id)
            newLoadElement.innerHTML = newHTML
        })

    })

    
}

const sendApiCall = async() =>{
    let currentSearch = document.getElementsByClassName('currentSearch')
    searchId = currentSearch[0].id

    const parseResponse = async(response)=>{
        console.log(response)
        loads = loads.concat(response.exact)
        loads = loads.concat(response.similar)
    }
    let response = await fetch(`https://power.dat.com/search/matches/sort/?direction=asc&field=DestinationDeadhead&searchId=${searchId}&updateSortParams=false`, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,bg-BG;q=0.8,bg;q=0.7",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-requested-with": "XMLHttpRequest"
  },
  "referrer": "https://power.dat.com/search/loads",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
})
await parseResponse(await response.json())

while (true){
    response = await fetch(`https://power.dat.com/search/matches/next/${searchId}?pageSize=1000`, {
    "headers": {
        "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://power.dat.com/search/loads",
    "body": null,
    "method": "GET",
    "credentials": "include"
    })
    response = await response.json();

    await parseResponse(response)
    if(response.noMoreMatches || (response.exact.length === 0 && response.similar.length === 0)){
        loads = loads.filter(el=>el!== undefined)
        break;
        }
    }

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
        let distance = tableRow.getElementsByClassName('trackLink')[0].innerHTML

        let rate = tableRow.getElementsByClassName('rate')[0].innerHTML



        let PPM = 0
        if(parseInt(rate) && parseInt(distance) && rate !== '—' && distance !== '—'){
            let newdistance = parseInt(distance.replace(/\D/g, ''))
            rate = parseInt(rate.replace(',','').substring(1))
            PPM = (rate/newdistance).toFixed(2);
        }
        
        //console.log(`PPM : ${PPM} | rate : ${rate} | distance : ${distance}`)
 
        
        let addedColumn =htmlToElement( 
        `
            <td class='rate'>${PPM}</td>
        `)
        tableRow.appendChild(addedColumn)
    }
}

const init = async () =>{
    //console.log('entered init')
    try{
        const waitToLoad = async (className) =>{
            while(document.getElementsByClassName(className)=== undefined)
                await sleep(500)
        }

    await waitToLoad('columnHeaders');
    await waitToLoad('fixed-table-container-inner groupsClosed')
    
    let currentY = document.getElementsByClassName('fixed-table-container-inner groupsClosed')[0].scrollTop
    if(currentY <= lastY || autoSort){
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

intervalId = setInterval(init,500)

let port = chrome.runtime.connect();
Object.keys(CredentialCookies).map(cookie=>{
    port.postMessage({cookie: cookie});
})

port.onMessage.addListener(function(msg) {
    console.log(msg)
    Object.keys(CredentialCookies).forEach(cookie=>{
        if(msg[cookie]!== undefined){
            CredentialCookies[cookie] = cookie
            return
        }
    })
});
