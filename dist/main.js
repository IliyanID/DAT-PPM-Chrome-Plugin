/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./content_script/API.js":
/*!*******************************!*\
  !*** ./content_script/API.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "API": () => (/* binding */ API),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class API{
    getSearchId = () =>{
        let searchId = ''
        let className = 'currentSearch'
        let searchHeader = document.getElementsByClassName(className)[0]
        if(searchHeader && searchHeader.id)
            searchId = searchHeader.id
        else{ 
            console.error(`Warning Unable To Find Search Header With Class '${className}'`)
        }
        return searchId
    }

    makeApiCall = async (url) =>{
        let response = await fetch(url, {
            "headers": {
                "x-requested-with": "XMLHttpRequest"
            },
            "body": null,
            "method": "GET",
            "credentials": "include"
        });
        response = await response.json();
        return response
    }

    getLoadInfo = async (matchId,defaultInfo) =>{
        const searchId = this.getSearchId();

        const checkReponseObject = (responseObj) =>{
            Object.keys(defaultInfo).forEach(key =>{
                if(!responseObj[key])
                    responseObj[key] = ''
            })
        }

        let url = `https://power.dat.com/search/matches/take/?matchId=${matchId}&searchId=${searchId}`
        let response = await this.makeApiCall(url)
        checkReponseObject(response)
        return response
    }

    getAllLoads = async () =>{
        const searchId = this.getSearchId()
        let allLoads = []
        const concatLoads = (responseObj) =>{
            if(responseObj.exact && responseObj.exact.length > 0)
                allLoads = allLoads.concat(responseObj.exact)
            if(responseObj.similar && responseObj.similar.length > 0)
                allLoads = allLoads.concat(responseObj.similar)
        }

        let urls = [
            `https://power.dat.com/search/matches/sort/?direction=desc&field=Rate&searchId=${searchId}&updateSortParams=true`,
            `https://power.dat.com/search/matches/next/${searchId}?pageSize=1000`
        ]


        console.log('Started API Call')
        let responseObj = await this.makeApiCall(urls[0])
        concatLoads(responseObj)

        responseObj = await this.makeApiCall(urls[1])
        concatLoads(responseObj)
        console.log('Ended API Call')

        return allLoads

    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (API);

/***/ }),

/***/ "./content_script/RowHeader.js":
/*!*************************************!*\
  !*** ./content_script/RowHeader.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRowHTML": () => (/* binding */ getRowHTML),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./content_script/API.js");

const api = new _API__WEBPACK_IMPORTED_MODULE_0__["default"]()

const checkReponseObject = (defaultInfo,responseObj) =>{
    Object.keys(defaultInfo).forEach(key =>{
        if(!responseObj[key])
            responseObj[key] = ''
    })
}

const getRowHTML = async(load,hide) =>{
    let hideClass = (hide)?' ng-hide':''

    let defaultInfo = {
        commodity: "",
        comment1: "",
        comment2: "",
        docketNumber: "",
        dockHours: "",
        pickupHours: "",
        referenceId:""
    }

    if(!hide)
        defaultInfo = await api.getLoadInfo(load.id,defaultInfo)

    const mainRow = 
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


        <td class="rate">$${load.PPM}</td>
    </tr>
    `

    const rowInfo = 
    `
    <tr class="groupData ng-scope ${hideClass}">
        <td colspan="20">
            <!-- colspan not the same as summary row due to rowspan in groups -->
            <a class="menuToggle "></a>
            <mark class="workInitials "></mark>
            <mark class="status "></mark>
            <p class="notesLabel ">
                <span class="label">Notes:</span> 
                <span class="note"></span>
            </p>
            
            <aside>
            <fieldset class="workstatus">
                <input type="radio" name="${load.id}-status" value="1" id="${load.id}-1">
                <label for="${load.id}-1">Accepted</label>
                <input type="radio" name="${load.id}-status" value="2" id="${load.id}-2">
                <label for="${load.id}-2">Called</label>
                <input type="radio" name="${load.id}-status" value="3" id="${load.id}-3">
                <label for="${load.id}-3">No Longer Available</label>
                <input type="radio" name="${load.id}-status" value="4" id="${load.id}-4">
                <label for="${load.id}-4">Refused</label>
                <input type="radio" name="${load.id}-status" value="5" id="${load.id}-5">
                <label for="${load.id}-5">Unqualified</label>
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
                <dd class="refId">${defaultInfo.referenceId}</dd>
                <dt>Commodity:</dt>
                <dd class="commodity" title="${defaultInfo.commodity}">${defaultInfo.commodity}</dd>
            </dl>
            <dl>
                <dt>Comments 1:</dt>
                <dd class="comments1" title="${defaultInfo.comment1}">${defaultInfo.comment1}</dd>
                <dt>Comments 2:</dt>
                <dd class="comments2" title="${defaultInfo.comment2}">${defaultInfo.comment2}</dd>
            </dl>
            <dl>
                <dt class="">Docket:</dt>
                <dd class="docket ">
                    <a href="urls?Category=CustomerDirectoryTCSIProfile&amp;MatchId=DS2byLDs&amp;RegistryId=S.157791.283877" 
                        class="trackLink" track-link-category="Company" target="_blank"
                        >
                            ${defaultInfo.docketNumber}
                    </a>
                </dd>

                <dd class="bonding">
                    <span class="is-tia-member" title="TIA Member"></span>    
                    <span class="is-assurable" title="Assure It">
                        <a href="${defaultInfo.TIAURL}" 
                            class="trackLink" 
                            track-link-category="Assurable" 
                            target="_blank"
                            >
                        </a>
                    </span>
                </dd>
            </dl>
        </td>
    </tr>

    <tr class="actions ng-scope ${hideClass}">
        <td colspan="20">
            <a class="print" title="Print"></a>
        </td>
    </tr>
    `
    return mainRow + rowInfo 
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRowHTML);


/***/ }),

/***/ "./content_script/utils.js":
/*!*********************************!*\
  !*** ./content_script/utils.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "htmlToElement": () => (/* binding */ htmlToElement),
/* harmony export */   "sleep": () => (/* binding */ sleep),
/* harmony export */   "waitToLoad": () => (/* binding */ waitToLoad)
/* harmony export */ });
const htmlToElement = (html) => {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitToLoad = async (className) =>{
    for(let i = 0; i < 10; i++){
        if(document.getElementsByClassName(className)[0] !== undefined)
            return
        await sleep(500)
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./content_script/main.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _API_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API.js */ "./content_script/API.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./content_script/utils.js");
/* harmony import */ var _RowHeader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RowHeader.js */ "./content_script/RowHeader.js");



const api = new _API_js__WEBPACK_IMPORTED_MODULE_0__.API();
let allLoads = []
let intervalId = -1;
let lastScroll =-1
let calculatePPM = true

const clickEventLisitioner = async (e) =>{
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
        await (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.sleep)(2000)
    }
    
    else if(headerName === 'PPM'){
        calculatePPM = false;
        allLoads = await api.getAllLoads()
        updateAllRows()
    }
    
    lastScroll = -1
    intervalId = setInterval(init,500)   
}

const addTableHeaders = async () =>{
    let tableHeadersClassName = 'columnHeaders'
    await (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.waitToLoad)(tableHeadersClassName)

    const headerRawHtml = 
    `<th style="cursor:pointer" class="bookItNow ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope" sortable="BookItNow" ng-model="ctrl.currentSort" desc-first="true" ng-if="isLoadSearch()" id="PPM">
        <a style="cursor:pointer" class="sortField ">
            <ng-transclude>
                <span style="cursor:pointer" class="ng-scope">PPM</span>
            </ng-transclude>
            <i class="sort"></i>
        </a>
    </th>
    `
    const injectElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(headerRawHtml)
    let tableHeaderContainer = document.getElementsByClassName(tableHeadersClassName)[0]

    //Remove BookIt Header
    tableHeaderContainer.children[tableHeaderContainer.children.length-1].remove()
    //Add PPM Header
    tableHeaderContainer.appendChild(injectElement)
}

const updateAllRows = async () =>{
    const calculatePPM = (trip) =>{
        let PPM = 0;
        let rate = (trip.rate !== '—') ? trip.rate.replaceAll(',','').replaceAll('$','') : 0;
        let distance = (trip.tripMiles !== '—') ? trip.tripMiles.replace(/\D/g, '') : 0;

        rate = parseInt(rate)
        distance = parseInt(distance)
        
        if(distance > 0)
            PPM = (rate/distance).toFixed(2)
  
        
        return parseFloat(PPM)
    }

    //Calculate PPM for all loads
    allLoads = allLoads.map((item)=>{
        const PPM = calculatePPM(item)
        item['PPM'] = PPM
        return item
    })

    //Sort By PPM
    allLoads = allLoads.sort((a,b)=>{
        if(a.PPM < b.PPM) return 1
        if(a.PPM > b.PPM) return -1
        return 0
    })

    //Remove all pre-existing trips
    let tableResults = document.getElementsByClassName('searchResultsTable')[0]
    while(tableResults.children.length > 2)
        tableResults.children[1].remove();

    //Add sorted trips to list
    allLoads.forEach(async (load,index)=>{
        if(index > 250 || load.PPM === 0)
            return
    
        let hideExtraDetails = true
        let newLoadElement = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(`<tbody class="resultItem exactMatch qa-scrollLock">${await (0,_RowHeader_js__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load,hideExtraDetails)}</tbody>`)
        document.getElementsByClassName("searchResultsTable")[0].appendChild(newLoadElement)
        
        newLoadElement.addEventListener('click',async ()=>{
            hideExtraDetails = !hideExtraDetails
            let newHTML = await (0,_RowHeader_js__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load,hideExtraDetails)
            newLoadElement.innerHTML = newHTML
        })
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

        let distance = tableRowElement.getElementsByClassName('trackLink')[0].innerHTML.replace(/\D/g, '')
        let rate = tableRowElement.getElementsByClassName('rate')[0].innerHTML

        let PPM = 0
        if(rate && distance && rate !== '—' && distance !== '—'){
            distance = parseInt(distance)
            rate = parseInt(rate.replace(',','').substring(1))
            PPM = (rate/distance).toFixed(2);
        }
        
        //console.log(`PPM : ${PPM} | rate : ${rate} | distance : ${distance}`)
        
        const PPMRow =(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)( `<td class='rate'>$${PPM}</td>`)
        tableRowElement.appendChild(PPMRow)
    }
}

const init = async () =>{
    let scrollClassName = 'fixed-table-container-inner groupsClosed'
    await (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.waitToLoad)(scrollClassName)
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
intervalId = setInterval(init,500)
document.addEventListener('click',clickEventLisitioner)

/*let port = chrome.runtime.connect();
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
});*/





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZUFBZSxTQUFTO0FBQzdFO0FBQ0Esc0JBQXNCLHdEQUFhLHVCQUF1QixJQUFJO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUscURBQVU7QUFDcEI7QUFDQTtBQUNBLDJEQUEyRCxnQkFBZ0I7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixlQUFlO0FBQ3JDLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsRUFBRTtBQUNIO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9jb250ZW50X3NjcmlwdC9BUEkuanMiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9jb250ZW50X3NjcmlwdC9Sb3dIZWFkZXIuanMiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9jb250ZW50X3NjcmlwdC91dGlscy5qcyIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luLy4vY29udGVudF9zY3JpcHQvbWFpbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQVBJe1xyXG4gICAgZ2V0U2VhcmNoSWQgPSAoKSA9PntcclxuICAgICAgICBsZXQgc2VhcmNoSWQgPSAnJ1xyXG4gICAgICAgIGxldCBjbGFzc05hbWUgPSAnY3VycmVudFNlYXJjaCdcclxuICAgICAgICBsZXQgc2VhcmNoSGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpWzBdXHJcbiAgICAgICAgaWYoc2VhcmNoSGVhZGVyICYmIHNlYXJjaEhlYWRlci5pZClcclxuICAgICAgICAgICAgc2VhcmNoSWQgPSBzZWFyY2hIZWFkZXIuaWRcclxuICAgICAgICBlbHNleyBcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgV2FybmluZyBVbmFibGUgVG8gRmluZCBTZWFyY2ggSGVhZGVyIFdpdGggQ2xhc3MgJyR7Y2xhc3NOYW1lfSdgKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2VhcmNoSWRcclxuICAgIH1cclxuXHJcbiAgICBtYWtlQXBpQ2FsbCA9IGFzeW5jICh1cmwpID0+e1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICBcImhlYWRlcnNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJ4LXJlcXVlc3RlZC13aXRoXCI6IFwiWE1MSHR0cFJlcXVlc3RcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImJvZHlcIjogbnVsbCxcclxuICAgICAgICAgICAgXCJtZXRob2RcIjogXCJHRVRcIixcclxuICAgICAgICAgICAgXCJjcmVkZW50aWFsc1wiOiBcImluY2x1ZGVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZVxyXG4gICAgfVxyXG5cclxuICAgIGdldExvYWRJbmZvID0gYXN5bmMgKG1hdGNoSWQsZGVmYXVsdEluZm8pID0+e1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaElkID0gdGhpcy5nZXRTZWFyY2hJZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBjaGVja1JlcG9uc2VPYmplY3QgPSAocmVzcG9uc2VPYmopID0+e1xyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhkZWZhdWx0SW5mbykuZm9yRWFjaChrZXkgPT57XHJcbiAgICAgICAgICAgICAgICBpZighcmVzcG9uc2VPYmpba2V5XSlcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU9ialtrZXldID0gJydcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSBgaHR0cHM6Ly9wb3dlci5kYXQuY29tL3NlYXJjaC9tYXRjaGVzL3Rha2UvP21hdGNoSWQ9JHttYXRjaElkfSZzZWFyY2hJZD0ke3NlYXJjaElkfWBcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLm1ha2VBcGlDYWxsKHVybClcclxuICAgICAgICBjaGVja1JlcG9uc2VPYmplY3QocmVzcG9uc2UpXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsTG9hZHMgPSBhc3luYyAoKSA9PntcclxuICAgICAgICBjb25zdCBzZWFyY2hJZCA9IHRoaXMuZ2V0U2VhcmNoSWQoKVxyXG4gICAgICAgIGxldCBhbGxMb2FkcyA9IFtdXHJcbiAgICAgICAgY29uc3QgY29uY2F0TG9hZHMgPSAocmVzcG9uc2VPYmopID0+e1xyXG4gICAgICAgICAgICBpZihyZXNwb25zZU9iai5leGFjdCAmJiByZXNwb25zZU9iai5leGFjdC5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgYWxsTG9hZHMgPSBhbGxMb2Fkcy5jb25jYXQocmVzcG9uc2VPYmouZXhhY3QpXHJcbiAgICAgICAgICAgIGlmKHJlc3BvbnNlT2JqLnNpbWlsYXIgJiYgcmVzcG9uc2VPYmouc2ltaWxhci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgYWxsTG9hZHMgPSBhbGxMb2Fkcy5jb25jYXQocmVzcG9uc2VPYmouc2ltaWxhcilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB1cmxzID0gW1xyXG4gICAgICAgICAgICBgaHR0cHM6Ly9wb3dlci5kYXQuY29tL3NlYXJjaC9tYXRjaGVzL3NvcnQvP2RpcmVjdGlvbj1kZXNjJmZpZWxkPVJhdGUmc2VhcmNoSWQ9JHtzZWFyY2hJZH0mdXBkYXRlU29ydFBhcmFtcz10cnVlYCxcclxuICAgICAgICAgICAgYGh0dHBzOi8vcG93ZXIuZGF0LmNvbS9zZWFyY2gvbWF0Y2hlcy9uZXh0LyR7c2VhcmNoSWR9P3BhZ2VTaXplPTEwMDBgXHJcbiAgICAgICAgXVxyXG5cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0ZWQgQVBJIENhbGwnKVxyXG4gICAgICAgIGxldCByZXNwb25zZU9iaiA9IGF3YWl0IHRoaXMubWFrZUFwaUNhbGwodXJsc1swXSlcclxuICAgICAgICBjb25jYXRMb2FkcyhyZXNwb25zZU9iailcclxuXHJcbiAgICAgICAgcmVzcG9uc2VPYmogPSBhd2FpdCB0aGlzLm1ha2VBcGlDYWxsKHVybHNbMV0pXHJcbiAgICAgICAgY29uY2F0TG9hZHMocmVzcG9uc2VPYmopXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0VuZGVkIEFQSSBDYWxsJylcclxuXHJcbiAgICAgICAgcmV0dXJuIGFsbExvYWRzXHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQVBJOyIsImltcG9ydCBBUEkgZnJvbSAnLi9BUEknXHJcbmNvbnN0IGFwaSA9IG5ldyBBUEkoKVxyXG5cclxuY29uc3QgY2hlY2tSZXBvbnNlT2JqZWN0ID0gKGRlZmF1bHRJbmZvLHJlc3BvbnNlT2JqKSA9PntcclxuICAgIE9iamVjdC5rZXlzKGRlZmF1bHRJbmZvKS5mb3JFYWNoKGtleSA9PntcclxuICAgICAgICBpZighcmVzcG9uc2VPYmpba2V5XSlcclxuICAgICAgICAgICAgcmVzcG9uc2VPYmpba2V5XSA9ICcnXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0Um93SFRNTCA9IGFzeW5jKGxvYWQsaGlkZSkgPT57XHJcbiAgICBsZXQgaGlkZUNsYXNzID0gKGhpZGUpPycgbmctaGlkZSc6JydcclxuXHJcbiAgICBsZXQgZGVmYXVsdEluZm8gPSB7XHJcbiAgICAgICAgY29tbW9kaXR5OiBcIlwiLFxyXG4gICAgICAgIGNvbW1lbnQxOiBcIlwiLFxyXG4gICAgICAgIGNvbW1lbnQyOiBcIlwiLFxyXG4gICAgICAgIGRvY2tldE51bWJlcjogXCJcIixcclxuICAgICAgICBkb2NrSG91cnM6IFwiXCIsXHJcbiAgICAgICAgcGlja3VwSG91cnM6IFwiXCIsXHJcbiAgICAgICAgcmVmZXJlbmNlSWQ6XCJcIlxyXG4gICAgfVxyXG5cclxuICAgIGlmKCFoaWRlKVxyXG4gICAgICAgIGRlZmF1bHRJbmZvID0gYXdhaXQgYXBpLmdldExvYWRJbmZvKGxvYWQuaWQsZGVmYXVsdEluZm8pXHJcblxyXG4gICAgY29uc3QgbWFpblJvdyA9IFxyXG4gICAgYFxyXG4gICAgPHRyIGlkPVwiJHtsb2FkLmlkfVwiIGNsYXNzPVwicWEtbWF0Y2gtcm93IHJlc3VsdFN1bW1hcnkgdW5yZWFkXCI+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwiYWN0aXZpdHlcIiByb3dzcGFuPVwiNFwiPiA8IS0tIHJvd3NwYW4gaXMgZm9yIGdyb3VwcyBmb3JtYXR0aW5nIHdoZW4gZXhwYW5kZWQgLS0+XHJcbiAgICAgICAgICAgIDwhLS0gcm93c3BhbiBpcyBmb3IgZ3JvdXBzIGZvcm1hdHRpbmcgd2hlbiBleHBhbmRlZCAtLT5cclxuICAgICAgICAgICAgPG1hcms+PC9tYXJrPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwibmV3XCI+Jm5ic3A7PC90ZD4gPCEtLSBQbGVhc2UgbGVhdmUgdGhlIG5ic3AsIHRoZXkgYXJlIG5lY2Vzc2FyeSBmb3IgdGFibGUgcm93IHN0cmlrZW91dCB0byB3b3JrIHJpZ2h0IGluIElFIC0tPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInNlbGVjdFwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjdXN0b21DaGVja2JveCBzZWFyY2hCYXRjaFwiIGlkPVwiJHtsb2FkLmlkfS1jaGVja1wiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS1jaGVja1wiPjwvbGFiZWw+XHJcbiAgICAgICAgICAgICZuYnNwO1xyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImFnZSBcIj4ke2xvYWQuYWdlfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImF2YWlsIFwiPiR7bG9hZC5wcmVzZW50YXRpb25EYXRlfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRydWNrIFwiPiR7bG9hZC5lcXVpcG1lbnRDbGFzc308L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJmcCBcIj4ke2xvYWQuaXNQYXJ0aWFsfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRvIFwiPjA8L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJvcmlnaW5cIj4ke2xvYWQub3JpZ2lufTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRyaXBcIj5cclxuICAgICAgICAgICAgPGEgIFxyXG4gICAgICAgICAgICAgICAgaHJlZj1cInVybHM/Q2F0ZWdvcnk9Um91dGluZyZhbXA7TWF0Y2hJZD1MUzQ5ZG10aiZhbXA7UmVnaXN0cnlJZD1TLjExNzc2NC4yNDExMTQmYW1wO0NhdGVnb3J5UHJvdmlkZXI9UHJvTWlsZXNcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiVHJpcCBNaWxlc1wiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsb2FkLnRyaXBNaWxlc31cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRlc3QgXCI+JHtsb2FkLmRlc3RpbmF0aW9ufTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRkIFwiPiR7bG9hZC5kZWFkaGVhZE1pbGVzRGVzdGluYXRpb259PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiY29tcGFueSBkcm9wZG93biBcIj5cclxuICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rIGNvbXBhbnlUb2dnbGVcIiBcclxuICAgICAgICAgICAgICAgIHRpdGxlPVwiJHtsb2FkLmNvbXBhbnl9IChjbGljayBmb3IgZGV0YWlscylcIj5cclxuICAgICAgICAgICAgICAgICAgICAke2xvYWQuY29tcGFueX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImNvbnRhY3RcIj4ke2xvYWQuY29udGFjdFBob25lfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImxlbmd0aCBcIj4ke2xvYWQubGVuZ3RofTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cIndlaWdodCBcIj4ke2xvYWQud2VpZ2h0fTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImNzXCI+XHJcbiAgICAgICAgICAgIDxhICBocmVmPVwidXJscz9DYXRlZ29yeT1DdXN0b21lckRpcmVjdG9yeUNyZWRpdFByb2ZpbGUmYW1wO01hdGNoSWQ9TFM0OWRtdGomYW1wO1JlZ2lzdHJ5SWQ9Uy4xMTc3NjQuMjQxMTE0XCIgXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkNyZWRpdCBTY29yZVwiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsb2FkLmNyZWRpdFNjb3JlfVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZHRwXCI+XHJcbiAgICAgICAgICAgIDxhICBocmVmPVwidXJscz9DYXRlZ29yeT1DdXN0b21lckRpcmVjdG9yeUNyZWRpdFByb2ZpbGUmYW1wO01hdGNoSWQ9TFM0OWRtdGomYW1wO1JlZ2lzdHJ5SWQ9Uy4xMTc3NjQuMjQxMTE0XCIgXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkNyZWRpdCBTY29yZVwiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgMjJcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImZhY3RvcmFibGVcIiB0aXRsZT1cIkZhY3RvciBJdFwiPlxyXG4gICAgICAgICAgICA8YSAgaHJlZj1cInVybHM/Q2F0ZWdvcnk9RmFjdG9yaW5nJmFtcDtNYXRjaElkPUxTNDlkbXRqJmFtcDtSZWdpc3RyeUlkPVMuMTE3NzY0LjI0MTExNCZhbXA7Q2F0ZWdvcnlQcm92aWRlcj1hYmNcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiRmFjdG9yaW5nXCIgXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInJhdGVcIj4ke2xvYWQucmF0ZX08L3RkPlxyXG5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwicmF0ZVwiPiQke2xvYWQuUFBNfTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgYFxyXG5cclxuICAgIGNvbnN0IHJvd0luZm8gPSBcclxuICAgIGBcclxuICAgIDx0ciBjbGFzcz1cImdyb3VwRGF0YSBuZy1zY29wZSAke2hpZGVDbGFzc31cIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjIwXCI+XHJcbiAgICAgICAgICAgIDwhLS0gY29sc3BhbiBub3QgdGhlIHNhbWUgYXMgc3VtbWFyeSByb3cgZHVlIHRvIHJvd3NwYW4gaW4gZ3JvdXBzIC0tPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cIm1lbnVUb2dnbGUgXCI+PC9hPlxyXG4gICAgICAgICAgICA8bWFyayBjbGFzcz1cIndvcmtJbml0aWFscyBcIj48L21hcms+XHJcbiAgICAgICAgICAgIDxtYXJrIGNsYXNzPVwic3RhdHVzIFwiPjwvbWFyaz5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJub3Rlc0xhYmVsIFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPk5vdGVzOjwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5vdGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxhc2lkZT5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwid29ya3N0YXR1c1wiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiMVwiIGlkPVwiJHtsb2FkLmlkfS0xXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS0xXCI+QWNjZXB0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiMlwiIGlkPVwiJHtsb2FkLmlkfS0yXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS0yXCI+Q2FsbGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHtsb2FkLmlkfS1zdGF0dXNcIiB2YWx1ZT1cIjNcIiBpZD1cIiR7bG9hZC5pZH0tM1wiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7bG9hZC5pZH0tM1wiPk5vIExvbmdlciBBdmFpbGFibGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiNFwiIGlkPVwiJHtsb2FkLmlkfS00XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS00XCI+UmVmdXNlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIiR7bG9hZC5pZH0tc3RhdHVzXCIgdmFsdWU9XCI1XCIgaWQ9XCIke2xvYWQuaWR9LTVcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2xvYWQuaWR9LTVcIj5VbnF1YWxpZmllZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInJlbW92ZVN0YXR1c05vdGVzIG5nLWhpZGVcIj5SZW1vdmUgc3RhdHVzIGFuZCBub3RlczwvYT5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwibm90ZXNcIj5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBwbGFjZWhvbGRlcj1cIlBpY2sgYSBzdGF0dXNcIiBjbGFzcz1cIm5vdGVcIiBtYXhsZW5ndGg9XCIyNTZcIiBkaXNhYmxlZD1cIlwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2FuY2Vsd29ya3N0YXR1c1wiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzZXR3b3Jrc3RhdHVzXCIgdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPVwiXCI+U3VibWl0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDwvYXNpZGU+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGNsYXNzPVwicmVzdWx0RGV0YWlscyAgbmctc2NvcGUgJHtoaWRlQ2xhc3N9XCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIyMFwiPlxyXG4gICAgICAgICAgICA8IS0tLS0+XHJcbiAgICAgICAgICAgIDwhLS0gY29sc3BhbiBub3QgdGhlIHNhbWUgYXMgc3VtbWFyeSByb3cgZHVlIHRvIHJvd3NwYW4gaW4gZ3JvdXBzIC0tPlxyXG4gICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+UmVmOjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJyZWZJZFwiPiR7ZGVmYXVsdEluZm8ucmVmZXJlbmNlSWR9PC9kZD5cclxuICAgICAgICAgICAgICAgIDxkdD5Db21tb2RpdHk6PC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImNvbW1vZGl0eVwiIHRpdGxlPVwiJHtkZWZhdWx0SW5mby5jb21tb2RpdHl9XCI+JHtkZWZhdWx0SW5mby5jb21tb2RpdHl9PC9kZD5cclxuICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0PkNvbW1lbnRzIDE6PC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImNvbW1lbnRzMVwiIHRpdGxlPVwiJHtkZWZhdWx0SW5mby5jb21tZW50MX1cIj4ke2RlZmF1bHRJbmZvLmNvbW1lbnQxfTwvZGQ+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+Q29tbWVudHMgMjo8L2R0PlxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiY29tbWVudHMyXCIgdGl0bGU9XCIke2RlZmF1bHRJbmZvLmNvbW1lbnQyfVwiPiR7ZGVmYXVsdEluZm8uY29tbWVudDJ9PC9kZD5cclxuICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0IGNsYXNzPVwiXCI+RG9ja2V0OjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJkb2NrZXQgXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInVybHM/Q2F0ZWdvcnk9Q3VzdG9tZXJEaXJlY3RvcnlUQ1NJUHJvZmlsZSZhbXA7TWF0Y2hJZD1EUzJieUxEcyZhbXA7UmVnaXN0cnlJZD1TLjE1Nzc5MS4yODM4NzdcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmtcIiB0cmFjay1saW5rLWNhdGVnb3J5PVwiQ29tcGFueVwiIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZGVmYXVsdEluZm8uZG9ja2V0TnVtYmVyfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvZGQ+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiYm9uZGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXMtdGlhLW1lbWJlclwiIHRpdGxlPVwiVElBIE1lbWJlclwiPjwvc3Bhbj4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpcy1hc3N1cmFibGVcIiB0aXRsZT1cIkFzc3VyZSBJdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtkZWZhdWx0SW5mby5USUFVUkx9XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkFzc3VyYWJsZVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGQ+XHJcbiAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGNsYXNzPVwiYWN0aW9ucyBuZy1zY29wZSAke2hpZGVDbGFzc31cIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjIwXCI+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwicHJpbnRcIiB0aXRsZT1cIlByaW50XCI+PC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgYFxyXG4gICAgcmV0dXJuIG1haW5Sb3cgKyByb3dJbmZvIFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IGdldFJvd0hUTUw7XHJcbiIsImV4cG9ydCBjb25zdCBodG1sVG9FbGVtZW50ID0gKGh0bWwpID0+IHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICBodG1sID0gaHRtbC50cmltKCk7IC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcclxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgc2xlZXAgPSAobXMpID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCB3YWl0VG9Mb2FkID0gYXN5bmMgKGNsYXNzTmFtZSkgPT57XHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgMTA7IGkrKyl7XHJcbiAgICAgICAgaWYoZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpWzBdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDUwMClcclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgQVBJIH0gZnJvbSAnLi9BUEkuanMnXHJcbmltcG9ydCB7IGh0bWxUb0VsZW1lbnQsIHNsZWVwLCB3YWl0VG9Mb2FkIH0gZnJvbSAnLi91dGlscy5qcydcclxuaW1wb3J0IHsgZ2V0Um93SFRNTH0gZnJvbSAnLi9Sb3dIZWFkZXIuanMnXHJcbmNvbnN0IGFwaSA9IG5ldyBBUEkoKTtcclxubGV0IGFsbExvYWRzID0gW11cclxubGV0IGludGVydmFsSWQgPSAtMTtcclxubGV0IGxhc3RTY3JvbGwgPS0xXHJcbmxldCBjYWxjdWxhdGVQUE0gPSB0cnVlXHJcblxyXG5jb25zdCBjbGlja0V2ZW50TGlzaXRpb25lciA9IGFzeW5jIChlKSA9PntcclxuICAgIGxldCBoZWFkZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzb3J0RmllbGQnKVxyXG4gICAgaWYoaGVhZGVyQ29udGFpbmVyWzBdID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBGaW5kIEhlYWRlciBDb250YWluZXIgd2l0aCBjbGFzc05hbWUgJ3NvcnRGaWVsZCdgKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgbGV0IGhlYWRlcnMgPSBbXVxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGhlYWRlckNvbnRhaW5lci5sZW5ndGggLSAxOyBpKyspe1xyXG4gICAgICAgIGxldCBoZWFkZXJDaGlsZCA9IGhlYWRlckNvbnRhaW5lcltpXS5jaGlsZHJlblswXVxyXG4gICAgICAgIGxldCBoZWFkZXJXcmFwcGVyID0gaGVhZGVyQ2hpbGQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmctc2NvcGUnKVswXVxyXG4gICAgICAgIGlmKGhlYWRlcldyYXBwZXIgPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBmaW5kIGhlYWRlcldyYXBwZXIgd2l0aCBjbGFzc05hbWUgcGF0aCAnLmNvbHVtbkhlYWRlcnMubmctc2NvcGUnYClcclxuICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICB9XHJcbiAgICAgICAgaGVhZGVycy5wdXNoKGhlYWRlcldyYXBwZXIuaW5uZXJIVE1MKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBoZWFkZXJOYW1lID0gZS5wYXRoWzBdLmlubmVySFRNTFxyXG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKVxyXG5cclxuICAgIGlmKGhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyTmFtZSkpe1xyXG4gICAgICAgIGNhbGN1bGF0ZVBQTSA9IHRydWU7XHJcbiAgICAgICAgYXdhaXQgc2xlZXAoMjAwMClcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxzZSBpZihoZWFkZXJOYW1lID09PSAnUFBNJyl7XHJcbiAgICAgICAgY2FsY3VsYXRlUFBNID0gZmFsc2U7XHJcbiAgICAgICAgYWxsTG9hZHMgPSBhd2FpdCBhcGkuZ2V0QWxsTG9hZHMoKVxyXG4gICAgICAgIHVwZGF0ZUFsbFJvd3MoKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsYXN0U2Nyb2xsID0gLTFcclxuICAgIGludGVydmFsSWQgPSBzZXRJbnRlcnZhbChpbml0LDUwMCkgICBcclxufVxyXG5cclxuY29uc3QgYWRkVGFibGVIZWFkZXJzID0gYXN5bmMgKCkgPT57XHJcbiAgICBsZXQgdGFibGVIZWFkZXJzQ2xhc3NOYW1lID0gJ2NvbHVtbkhlYWRlcnMnXHJcbiAgICBhd2FpdCB3YWl0VG9Mb2FkKHRhYmxlSGVhZGVyc0NsYXNzTmFtZSlcclxuXHJcbiAgICBjb25zdCBoZWFkZXJSYXdIdG1sID0gXHJcbiAgICBgPHRoIHN0eWxlPVwiY3Vyc29yOnBvaW50ZXJcIiBjbGFzcz1cImJvb2tJdE5vdyBuZy1wcmlzdGluZSBuZy11bnRvdWNoZWQgbmctdmFsaWQgbmctc2NvcGUgbmctaXNvbGF0ZS1zY29wZVwiIHNvcnRhYmxlPVwiQm9va0l0Tm93XCIgbmctbW9kZWw9XCJjdHJsLmN1cnJlbnRTb3J0XCIgZGVzYy1maXJzdD1cInRydWVcIiBuZy1pZj1cImlzTG9hZFNlYXJjaCgpXCIgaWQ9XCJQUE1cIj5cclxuICAgICAgICA8YSBzdHlsZT1cImN1cnNvcjpwb2ludGVyXCIgY2xhc3M9XCJzb3J0RmllbGQgXCI+XHJcbiAgICAgICAgICAgIDxuZy10cmFuc2NsdWRlPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9XCJjdXJzb3I6cG9pbnRlclwiIGNsYXNzPVwibmctc2NvcGVcIj5QUE08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbmctdHJhbnNjbHVkZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJzb3J0XCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvdGg+XHJcbiAgICBgXHJcbiAgICBjb25zdCBpbmplY3RFbGVtZW50ID0gaHRtbFRvRWxlbWVudChoZWFkZXJSYXdIdG1sKVxyXG4gICAgbGV0IHRhYmxlSGVhZGVyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0YWJsZUhlYWRlcnNDbGFzc05hbWUpWzBdXHJcblxyXG4gICAgLy9SZW1vdmUgQm9va0l0IEhlYWRlclxyXG4gICAgdGFibGVIZWFkZXJDb250YWluZXIuY2hpbGRyZW5bdGFibGVIZWFkZXJDb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoLTFdLnJlbW92ZSgpXHJcbiAgICAvL0FkZCBQUE0gSGVhZGVyXHJcbiAgICB0YWJsZUhlYWRlckNvbnRhaW5lci5hcHBlbmRDaGlsZChpbmplY3RFbGVtZW50KVxyXG59XHJcblxyXG5jb25zdCB1cGRhdGVBbGxSb3dzID0gYXN5bmMgKCkgPT57XHJcbiAgICBjb25zdCBjYWxjdWxhdGVQUE0gPSAodHJpcCkgPT57XHJcbiAgICAgICAgbGV0IFBQTSA9IDA7XHJcbiAgICAgICAgbGV0IHJhdGUgPSAodHJpcC5yYXRlICE9PSAn4oCUJykgPyB0cmlwLnJhdGUucmVwbGFjZUFsbCgnLCcsJycpLnJlcGxhY2VBbGwoJyQnLCcnKSA6IDA7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gKHRyaXAudHJpcE1pbGVzICE9PSAn4oCUJykgPyB0cmlwLnRyaXBNaWxlcy5yZXBsYWNlKC9cXEQvZywgJycpIDogMDtcclxuXHJcbiAgICAgICAgcmF0ZSA9IHBhcnNlSW50KHJhdGUpXHJcbiAgICAgICAgZGlzdGFuY2UgPSBwYXJzZUludChkaXN0YW5jZSlcclxuICAgICAgICBcclxuICAgICAgICBpZihkaXN0YW5jZSA+IDApXHJcbiAgICAgICAgICAgIFBQTSA9IChyYXRlL2Rpc3RhbmNlKS50b0ZpeGVkKDIpXHJcbiAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoUFBNKVxyXG4gICAgfVxyXG5cclxuICAgIC8vQ2FsY3VsYXRlIFBQTSBmb3IgYWxsIGxvYWRzXHJcbiAgICBhbGxMb2FkcyA9IGFsbExvYWRzLm1hcCgoaXRlbSk9PntcclxuICAgICAgICBjb25zdCBQUE0gPSBjYWxjdWxhdGVQUE0oaXRlbSlcclxuICAgICAgICBpdGVtWydQUE0nXSA9IFBQTVxyXG4gICAgICAgIHJldHVybiBpdGVtXHJcbiAgICB9KVxyXG5cclxuICAgIC8vU29ydCBCeSBQUE1cclxuICAgIGFsbExvYWRzID0gYWxsTG9hZHMuc29ydCgoYSxiKT0+e1xyXG4gICAgICAgIGlmKGEuUFBNIDwgYi5QUE0pIHJldHVybiAxXHJcbiAgICAgICAgaWYoYS5QUE0gPiBiLlBQTSkgcmV0dXJuIC0xXHJcbiAgICAgICAgcmV0dXJuIDBcclxuICAgIH0pXHJcblxyXG4gICAgLy9SZW1vdmUgYWxsIHByZS1leGlzdGluZyB0cmlwc1xyXG4gICAgbGV0IHRhYmxlUmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlYXJjaFJlc3VsdHNUYWJsZScpWzBdXHJcbiAgICB3aGlsZSh0YWJsZVJlc3VsdHMuY2hpbGRyZW4ubGVuZ3RoID4gMilcclxuICAgICAgICB0YWJsZVJlc3VsdHMuY2hpbGRyZW5bMV0ucmVtb3ZlKCk7XHJcblxyXG4gICAgLy9BZGQgc29ydGVkIHRyaXBzIHRvIGxpc3RcclxuICAgIGFsbExvYWRzLmZvckVhY2goYXN5bmMgKGxvYWQsaW5kZXgpPT57XHJcbiAgICAgICAgaWYoaW5kZXggPiAyNTAgfHwgbG9hZC5QUE0gPT09IDApXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICAgICAgbGV0IGhpZGVFeHRyYURldGFpbHMgPSB0cnVlXHJcbiAgICAgICAgbGV0IG5ld0xvYWRFbGVtZW50ID0gaHRtbFRvRWxlbWVudChgPHRib2R5IGNsYXNzPVwicmVzdWx0SXRlbSBleGFjdE1hdGNoIHFhLXNjcm9sbExvY2tcIj4ke2F3YWl0IGdldFJvd0hUTUwobG9hZCxoaWRlRXh0cmFEZXRhaWxzKX08L3Rib2R5PmApXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlYXJjaFJlc3VsdHNUYWJsZVwiKVswXS5hcHBlbmRDaGlsZChuZXdMb2FkRWxlbWVudClcclxuICAgICAgICBcclxuICAgICAgICBuZXdMb2FkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsYXN5bmMgKCk9PntcclxuICAgICAgICAgICAgaGlkZUV4dHJhRGV0YWlscyA9ICFoaWRlRXh0cmFEZXRhaWxzXHJcbiAgICAgICAgICAgIGxldCBuZXdIVE1MID0gYXdhaXQgZ2V0Um93SFRNTChsb2FkLGhpZGVFeHRyYURldGFpbHMpXHJcbiAgICAgICAgICAgIG5ld0xvYWRFbGVtZW50LmlubmVySFRNTCA9IG5ld0hUTUxcclxuICAgICAgICB9KVxyXG4gICAgfSkgIFxyXG59XHJcblxyXG5jb25zdCByZXNldFJvd1BQTSA9ICgpID0+e1xyXG4gICAgbGV0IHRhYmxlUm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3FhLW1hdGNoLXJvdycpXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGFibGVSb3dzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGxldCB0YWJsZVJvdyA9IHRhYmxlUm93c1tpXTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIC8vUmVtb3ZlIEJvb2tJdCBmcm9tIHJvdyBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgdGFibGVSb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9va0l0Tm93JylbMF0ucmVtb3ZlKClcclxuICAgICAgICB9Y2F0Y2goZSl7fVxyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgICAgLy9SZW1vdmVkIGxhc3QgUFBNIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICB0YWJsZVJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyYXRlJylbMV0ucmVtb3ZlKClcclxuICAgICAgICB9Y2F0Y2goZSl7fVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY29uc3QgYWRkUFBNID0gYXN5bmMgKCkgPT57XHJcbiAgICBsZXQgdGFibGVSb3dzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncWEtbWF0Y2gtcm93JylcclxuICAgIFxyXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHRhYmxlUm93cy5sZW5ndGg7aSsrKXtcclxuICAgICAgICBsZXQgdGFibGVSb3dFbGVtZW50ID0gdGFibGVSb3dzW2ldO1xyXG5cclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0YWJsZVJvd0VsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndHJhY2tMaW5rJylbMF0uaW5uZXJIVE1MLnJlcGxhY2UoL1xcRC9nLCAnJylcclxuICAgICAgICBsZXQgcmF0ZSA9IHRhYmxlUm93RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyYXRlJylbMF0uaW5uZXJIVE1MXHJcblxyXG4gICAgICAgIGxldCBQUE0gPSAwXHJcbiAgICAgICAgaWYocmF0ZSAmJiBkaXN0YW5jZSAmJiByYXRlICE9PSAn4oCUJyAmJiBkaXN0YW5jZSAhPT0gJ+KAlCcpe1xyXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHBhcnNlSW50KGRpc3RhbmNlKVxyXG4gICAgICAgICAgICByYXRlID0gcGFyc2VJbnQocmF0ZS5yZXBsYWNlKCcsJywnJykuc3Vic3RyaW5nKDEpKVxyXG4gICAgICAgICAgICBQUE0gPSAocmF0ZS9kaXN0YW5jZSkudG9GaXhlZCgyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgUFBNIDogJHtQUE19IHwgcmF0ZSA6ICR7cmF0ZX0gfCBkaXN0YW5jZSA6ICR7ZGlzdGFuY2V9YClcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBQUE1Sb3cgPWh0bWxUb0VsZW1lbnQoIGA8dGQgY2xhc3M9J3JhdGUnPiQke1BQTX08L3RkPmApXHJcbiAgICAgICAgdGFibGVSb3dFbGVtZW50LmFwcGVuZENoaWxkKFBQTVJvdylcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgaW5pdCA9IGFzeW5jICgpID0+e1xyXG4gICAgbGV0IHNjcm9sbENsYXNzTmFtZSA9ICdmaXhlZC10YWJsZS1jb250YWluZXItaW5uZXIgZ3JvdXBzQ2xvc2VkJ1xyXG4gICAgYXdhaXQgd2FpdFRvTG9hZChzY3JvbGxDbGFzc05hbWUpXHJcbiAgICBjb25zdCBTY3JvbGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzY3JvbGxDbGFzc05hbWUpWzBdXHJcbiAgICBpZihTY3JvbGxFbGVtZW50ID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBGaW5kIEVsZW1lbnQgd2l0aCBjbGFzcyAke3Njcm9sbENsYXNzTmFtZX1gKVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgY3VycmVudFNjcm9sbCA9IFNjcm9sbEVsZW1lbnQuc2Nyb2xsVG9wXHJcblxyXG4gICAgaWYoY3VycmVudFNjcm9sbCA+IGxhc3RTY3JvbGwgJiYgY2FsY3VsYXRlUFBNKXtcclxuICAgICAgICByZXNldFJvd1BQTSgpO1xyXG4gICAgICAgIGFkZFBQTSgpO1xyXG4gICAgfVxyXG4gICAgbGFzdFNjcm9sbCA9IGN1cnJlbnRTY3JvbGxcclxufVxyXG5cclxuYWRkVGFibGVIZWFkZXJzKClcclxuaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKGluaXQsNTAwKVxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsY2xpY2tFdmVudExpc2l0aW9uZXIpXHJcblxyXG4vKmxldCBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCgpO1xyXG5PYmplY3Qua2V5cyhDcmVkZW50aWFsQ29va2llcykubWFwKGNvb2tpZT0+e1xyXG4gICAgcG9ydC5wb3N0TWVzc2FnZSh7Y29va2llOiBjb29raWV9KTtcclxufSlcclxuXHJcbnBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uKG1zZykge1xyXG4gICAgY29uc29sZS5sb2cobXNnKVxyXG4gICAgT2JqZWN0LmtleXMoQ3JlZGVudGlhbENvb2tpZXMpLmZvckVhY2goY29va2llPT57XHJcbiAgICAgICAgaWYobXNnW2Nvb2tpZV0hPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgQ3JlZGVudGlhbENvb2tpZXNbY29va2llXSA9IGNvb2tpZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59KTsqL1xyXG5cclxuXHJcblxyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9