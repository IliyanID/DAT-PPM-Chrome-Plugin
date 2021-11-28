/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./content_script/API.ts":
/*!*******************************!*\
  !*** ./content_script/API.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "API": () => (/* binding */ API),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class API {
    constructor() {
        this.getSearchId = () => {
            let searchId = '';
            let className = 'currentSearch';
            let searchHeader = document.getElementsByClassName(className)[0];
            if (searchHeader && searchHeader.id)
                searchId = searchHeader.id;
            else {
                console.error(`Warning Unable To Find Search Header With Class '${className}'`);
            }
            return searchId;
        };
        this.makeApiCall = (url) => __awaiter(this, void 0, void 0, function* () {
            let response = yield fetch(url, {
                "headers": {
                    "x-requested-with": "XMLHttpRequest"
                },
                "body": null,
                "method": "GET",
                "credentials": "include"
            });
            response = yield response.json();
            return response;
        });
        this.getLoadInfo = (matchId, defaultInfo) => __awaiter(this, void 0, void 0, function* () {
            const searchId = this.getSearchId();
            const checkReponseObject = (responseObj) => {
                Object.keys(defaultInfo).forEach(key => {
                    if (!responseObj[key])
                        responseObj[key] = '';
                });
            };
            let url = `https://power.dat.com/search/matches/take/?matchId=${matchId}&searchId=${searchId}`;
            let response = yield this.makeApiCall(url);
            checkReponseObject(response);
            return response;
        });
        this.getAllLoads = () => __awaiter(this, void 0, void 0, function* () {
            const searchId = this.getSearchId();
            let allLoads = [];
            const concatLoads = (responseObj) => {
                if (responseObj.exact && responseObj.exact.length > 0)
                    allLoads = allLoads.concat(responseObj.exact);
                if (responseObj.similar && responseObj.similar.length > 0)
                    allLoads = allLoads.concat(responseObj.similar);
            };
            let urls = [
                `https://power.dat.com/search/matches/sort/?direction=desc&field=Rate&searchId=${searchId}&updateSortParams=true`,
                `https://power.dat.com/search/matches/next/${searchId}?pageSize=1000`
            ];
            console.log('Started API Call');
            let responseObj = yield this.makeApiCall(urls[0]);
            concatLoads(responseObj);
            responseObj = yield this.makeApiCall(urls[1]);
            concatLoads(responseObj);
            console.log('Ended API Call');
            return allLoads;
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (API);


/***/ }),

/***/ "./content_script/RowHeader.ts":
/*!*************************************!*\
  !*** ./content_script/RowHeader.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRowHTML": () => (/* binding */ getRowHTML),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./content_script/API.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const api = new _API__WEBPACK_IMPORTED_MODULE_0__["default"]();
const getRowHTML = (load, hide) => __awaiter(void 0, void 0, void 0, function* () {
    let hideClass = (hide) ? ' ng-hide' : '';
    let defaultInfo = {
        commodity: "",
        comment1: "",
        comment2: "",
        docketNumber: "",
        dockHours: "",
        pickupHours: "",
        referenceId: ""
    };
    if (!hide)
        defaultInfo = yield api.getLoadInfo(load.id, defaultInfo);
    const mainRow = `
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
    `;
    const rowInfo = `
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
    `;
    return mainRow + rowInfo;
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getRowHTML);


/***/ }),

/***/ "./content_script/utils.ts":
/*!*********************************!*\
  !*** ./content_script/utils.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "htmlToElement": () => (/* binding */ htmlToElement),
/* harmony export */   "sleep": () => (/* binding */ sleep),
/* harmony export */   "waitToLoad": () => (/* binding */ waitToLoad)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const htmlToElement = (html) => {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
};
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const waitToLoad = (className) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < 10; i++) {
        if (document.getElementsByClassName(className)[0] !== undefined)
            return;
        yield sleep(500);
    }
});


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
  !*** ./content_script/main.ts ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./API */ "./content_script/API.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./content_script/utils.ts");
/* harmony import */ var _RowHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RowHeader */ "./content_script/RowHeader.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const api = new _API__WEBPACK_IMPORTED_MODULE_0__.API();
let port = chrome.runtime.connect();
let allLoads = [];
let intervalId = -1;
let lastScroll = -1;
let calculatePPM = true;
const columnName = 'PPM';
let minRate = 0;
const clickEventLisitioner = (e) => __awaiter(void 0, void 0, void 0, function* () {
    let headerContainer = document.getElementsByClassName('sortField');
    if (headerContainer[0] === undefined) {
        console.error(`Failed to Find Header Container with className 'sortField'`);
        return;
    }
    let headers = [];
    for (let i = 0; i < headerContainer.length - 1; i++) {
        let headerChild = headerContainer[i].children[0];
        let headerWrapper = headerChild.getElementsByClassName('ng-scope')[0];
        if (headerWrapper === undefined) {
            console.error(`Failed to find headerWrapper with className path '.columnHeaders.ng-scope'`);
            continue;
        }
        headers.push(headerWrapper.innerHTML);
    }
    let headerName = e.path[0].innerHTML;
    clearInterval(intervalId);
    if (headers.includes(headerName)) {
        calculatePPM = true;
        yield (0,_utils__WEBPACK_IMPORTED_MODULE_1__.sleep)(2000);
    }
    else if (headerName === columnName) {
        calculatePPM = false;
        allLoads = yield api.getAllLoads();
        updateAllRows();
    }
    lastScroll = -1;
    intervalId = window.setInterval(init, 500);
});
const addTableHeaders = () => __awaiter(void 0, void 0, void 0, function* () {
    let tableHeadersClassName = 'columnHeaders';
    yield (0,_utils__WEBPACK_IMPORTED_MODULE_1__.waitToLoad)(tableHeadersClassName);
    const headerRawHtml = `<th style="cursor:pointer" class="bookItNow ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope" sortable="BookItNow" ng-model="ctrl.currentSort" desc-first="true" ng-if="isLoadSearch()" id="PPM">
        <a style="cursor:pointer" class="sortField ">
            <ng-transclude>
                <span style="cursor:pointer" class="ng-scope">${columnName}</span>
            </ng-transclude>
            <i class="sort"></i>
        </a>
    </th>
    `;
    const injectElement = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(headerRawHtml);
    let tableHeaderContainer = document.getElementsByClassName(tableHeadersClassName)[0];
    //Remove BookIt Header
    tableHeaderContainer.children[tableHeaderContainer.children.length - 1].remove();
    //Add PPM Header
    tableHeaderContainer.appendChild(injectElement);
});
const updateAllRows = () => __awaiter(void 0, void 0, void 0, function* () {
    const calculatePPM = (trip) => {
        let PPM = 0;
        let rate = (trip.rate !== '—') ? trip.rate.replaceAll(',', '').replaceAll('$', '') : 0;
        let distance = (trip.tripMiles !== '—') ? trip.tripMiles.replace(/\D/g, '') : 0;
        rate = parseFloat(rate);
        distance = parseFloat(distance);
        if (distance > 0)
            PPM = parseFloat((rate / distance).toFixed(2));
        return PPM;
    };
    //Calculate PPM for all loads
    allLoads = allLoads.map((item) => {
        const PPM = calculatePPM(item);
        item['PPM'] = PPM;
        return item;
    });
    //Sort By PPM
    allLoads = allLoads.sort((a, b) => {
        if (a.PPM < b.PPM)
            return 1;
        if (a.PPM > b.PPM)
            return -1;
        return 0;
    });
    //Remove all pre-existing trips
    let tableResults = document.getElementsByClassName('searchResultsTable')[0];
    while (tableResults.children.length > 2)
        tableResults.children[1].remove();
    //Add sorted trips to list
    let listed = 0;
    allLoads.forEach((load, index) => __awaiter(void 0, void 0, void 0, function* () {
        if (listed > 250 || load.PPM === 0)
            return;
        if (parseInt(load.rate.replace(',', '').substring(1)) > minRate) {
            let hideExtraDetails = true;
            let newLoadElement = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(`<tbody class="resultItem exactMatch qa-scrollLock">${yield (0,_RowHeader__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load, hideExtraDetails)}</tbody>`);
            document.getElementsByClassName("searchResultsTable")[0].appendChild(newLoadElement);
            newLoadElement.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                hideExtraDetails = !hideExtraDetails;
                let newHTML = yield (0,_RowHeader__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load, hideExtraDetails);
                newLoadElement.innerHTML = newHTML;
            }));
            listed++;
        }
    }));
});
const resetRowPPM = () => {
    let tableRows = document.getElementsByClassName('qa-match-row');
    for (let i = 0; i < tableRows.length; i++) {
        let tableRow = tableRows[i];
        try {
            //Remove BookIt from row if it exists
            tableRow.getElementsByClassName('bookItNow')[0].remove();
        }
        catch (e) { }
        try {
            //Removed last PPM if it exists
            tableRow.getElementsByClassName('rate')[1].remove();
        }
        catch (e) { }
    }
};
const addPPM = () => __awaiter(void 0, void 0, void 0, function* () {
    let tableRows = document.getElementsByClassName('qa-match-row');
    for (let i = 0; i < tableRows.length; i++) {
        let tableRowElement = tableRows[i];
        let distance = tableRowElement.getElementsByClassName('trackLink')[0].innerHTML.replace(/\D/g, '');
        let rate = tableRowElement.getElementsByClassName('rate')[0].innerHTML;
        let PPM = 0;
        if (rate && distance && rate !== '—' && distance !== '—') {
            distance = parseInt(distance);
            rate = parseInt(rate.replace(',', '').substring(1));
            PPM = (rate / distance).toFixed(2);
        }
        //console.log(`PPM : ${PPM} | rate : ${rate} | distance : ${distance}`)
        const PPMRow = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(`<td class='rate'>$${PPM}</td>`);
        tableRowElement.appendChild(PPMRow);
    }
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    port.postMessage('');
    let scrollClassName = 'fixed-table-container-inner groupsClosed';
    yield (0,_utils__WEBPACK_IMPORTED_MODULE_1__.waitToLoad)(scrollClassName);
    const ScrollElement = document.getElementsByClassName(scrollClassName)[0];
    if (ScrollElement === undefined) {
        console.error(`Failed to Find Element with class ${scrollClassName}`);
        return;
    }
    const currentScroll = ScrollElement.scrollTop;
    if (currentScroll > lastScroll && calculatePPM) {
        resetRowPPM();
        addPPM();
    }
    lastScroll = currentScroll;
});
addTableHeaders();
intervalId = window.setInterval(init, 500);
document.addEventListener('click', clickEventLisitioner);
port.onMessage.addListener(function (msg) {
    minRate = msg;
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHFEQUFhLHVEQUF1RCxNQUFNLHNEQUFVLHlCQUF5QjtBQUM5STtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msc0RBQVU7QUFDOUM7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsS0FBSyxXQUFXLE1BQU0sZUFBZSxTQUFTO0FBQzdFLHVCQUF1QixxREFBYSxzQkFBc0IsSUFBSTtBQUM5RDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFVBQVUsa0RBQVU7QUFDcEI7QUFDQTtBQUNBLDJEQUEyRCxnQkFBZ0I7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luLy4vY29udGVudF9zY3JpcHQvQVBJLnRzIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luLy4vY29udGVudF9zY3JpcHQvUm93SGVhZGVyLnRzIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luLy4vY29udGVudF9zY3JpcHQvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi8uL2NvbnRlbnRfc2NyaXB0L21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnQgY2xhc3MgQVBJIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuZ2V0U2VhcmNoSWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzZWFyY2hJZCA9ICcnO1xyXG4gICAgICAgICAgICBsZXQgY2xhc3NOYW1lID0gJ2N1cnJlbnRTZWFyY2gnO1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoSGVhZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpWzBdO1xyXG4gICAgICAgICAgICBpZiAoc2VhcmNoSGVhZGVyICYmIHNlYXJjaEhlYWRlci5pZClcclxuICAgICAgICAgICAgICAgIHNlYXJjaElkID0gc2VhcmNoSGVhZGVyLmlkO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFdhcm5pbmcgVW5hYmxlIFRvIEZpbmQgU2VhcmNoIEhlYWRlciBXaXRoIENsYXNzICcke2NsYXNzTmFtZX0nYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHNlYXJjaElkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5tYWtlQXBpQ2FsbCA9ICh1cmwpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0geWllbGQgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICBcImhlYWRlcnNcIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwieC1yZXF1ZXN0ZWQtd2l0aFwiOiBcIlhNTEh0dHBSZXF1ZXN0XCJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBcImJvZHlcIjogbnVsbCxcclxuICAgICAgICAgICAgICAgIFwibWV0aG9kXCI6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICBcImNyZWRlbnRpYWxzXCI6IFwiaW5jbHVkZVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXNwb25zZSA9IHlpZWxkIHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2V0TG9hZEluZm8gPSAobWF0Y2hJZCwgZGVmYXVsdEluZm8pID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoSWQgPSB0aGlzLmdldFNlYXJjaElkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrUmVwb25zZU9iamVjdCA9IChyZXNwb25zZU9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoZGVmYXVsdEluZm8pLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlT2JqW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlT2JqW2tleV0gPSAnJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJsID0gYGh0dHBzOi8vcG93ZXIuZGF0LmNvbS9zZWFyY2gvbWF0Y2hlcy90YWtlLz9tYXRjaElkPSR7bWF0Y2hJZH0mc2VhcmNoSWQ9JHtzZWFyY2hJZH1gO1xyXG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSB5aWVsZCB0aGlzLm1ha2VBcGlDYWxsKHVybCk7XHJcbiAgICAgICAgICAgIGNoZWNrUmVwb25zZU9iamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdldEFsbExvYWRzID0gKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hJZCA9IHRoaXMuZ2V0U2VhcmNoSWQoKTtcclxuICAgICAgICAgICAgbGV0IGFsbExvYWRzID0gW107XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmNhdExvYWRzID0gKHJlc3BvbnNlT2JqKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VPYmouZXhhY3QgJiYgcmVzcG9uc2VPYmouZXhhY3QubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICBhbGxMb2FkcyA9IGFsbExvYWRzLmNvbmNhdChyZXNwb25zZU9iai5leGFjdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VPYmouc2ltaWxhciAmJiByZXNwb25zZU9iai5zaW1pbGFyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsTG9hZHMgPSBhbGxMb2Fkcy5jb25jYXQocmVzcG9uc2VPYmouc2ltaWxhcik7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxldCB1cmxzID0gW1xyXG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vcG93ZXIuZGF0LmNvbS9zZWFyY2gvbWF0Y2hlcy9zb3J0Lz9kaXJlY3Rpb249ZGVzYyZmaWVsZD1SYXRlJnNlYXJjaElkPSR7c2VhcmNoSWR9JnVwZGF0ZVNvcnRQYXJhbXM9dHJ1ZWAsXHJcbiAgICAgICAgICAgICAgICBgaHR0cHM6Ly9wb3dlci5kYXQuY29tL3NlYXJjaC9tYXRjaGVzL25leHQvJHtzZWFyY2hJZH0/cGFnZVNpemU9MTAwMGBcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1N0YXJ0ZWQgQVBJIENhbGwnKTtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlT2JqID0geWllbGQgdGhpcy5tYWtlQXBpQ2FsbCh1cmxzWzBdKTtcclxuICAgICAgICAgICAgY29uY2F0TG9hZHMocmVzcG9uc2VPYmopO1xyXG4gICAgICAgICAgICByZXNwb25zZU9iaiA9IHlpZWxkIHRoaXMubWFrZUFwaUNhbGwodXJsc1sxXSk7XHJcbiAgICAgICAgICAgIGNvbmNhdExvYWRzKHJlc3BvbnNlT2JqKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0VuZGVkIEFQSSBDYWxsJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBhbGxMb2FkcztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBBUEk7XHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IEFQSSBmcm9tICcuL0FQSSc7XHJcbmNvbnN0IGFwaSA9IG5ldyBBUEkoKTtcclxuZXhwb3J0IGNvbnN0IGdldFJvd0hUTUwgPSAobG9hZCwgaGlkZSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBsZXQgaGlkZUNsYXNzID0gKGhpZGUpID8gJyBuZy1oaWRlJyA6ICcnO1xyXG4gICAgbGV0IGRlZmF1bHRJbmZvID0ge1xyXG4gICAgICAgIGNvbW1vZGl0eTogXCJcIixcclxuICAgICAgICBjb21tZW50MTogXCJcIixcclxuICAgICAgICBjb21tZW50MjogXCJcIixcclxuICAgICAgICBkb2NrZXROdW1iZXI6IFwiXCIsXHJcbiAgICAgICAgZG9ja0hvdXJzOiBcIlwiLFxyXG4gICAgICAgIHBpY2t1cEhvdXJzOiBcIlwiLFxyXG4gICAgICAgIHJlZmVyZW5jZUlkOiBcIlwiXHJcbiAgICB9O1xyXG4gICAgaWYgKCFoaWRlKVxyXG4gICAgICAgIGRlZmF1bHRJbmZvID0geWllbGQgYXBpLmdldExvYWRJbmZvKGxvYWQuaWQsIGRlZmF1bHRJbmZvKTtcclxuICAgIGNvbnN0IG1haW5Sb3cgPSBgXHJcbiAgICA8dHIgaWQ9XCIke2xvYWQuaWR9XCIgY2xhc3M9XCJxYS1tYXRjaC1yb3cgcmVzdWx0U3VtbWFyeSB1bnJlYWRcIj5cclxuICAgICAgICA8dGQgY2xhc3M9XCJhY3Rpdml0eVwiIHJvd3NwYW49XCI0XCI+IDwhLS0gcm93c3BhbiBpcyBmb3IgZ3JvdXBzIGZvcm1hdHRpbmcgd2hlbiBleHBhbmRlZCAtLT5cclxuICAgICAgICAgICAgPCEtLSByb3dzcGFuIGlzIGZvciBncm91cHMgZm9ybWF0dGluZyB3aGVuIGV4cGFuZGVkIC0tPlxyXG4gICAgICAgICAgICA8bWFyaz48L21hcms+XHJcbiAgICAgICAgPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJuZXdcIj4mbmJzcDs8L3RkPiA8IS0tIFBsZWFzZSBsZWF2ZSB0aGUgbmJzcCwgdGhleSBhcmUgbmVjZXNzYXJ5IGZvciB0YWJsZSByb3cgc3RyaWtlb3V0IHRvIHdvcmsgcmlnaHQgaW4gSUUgLS0+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPHRkIGNsYXNzPVwic2VsZWN0XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImN1c3RvbUNoZWNrYm94IHNlYXJjaEJhdGNoXCIgaWQ9XCIke2xvYWQuaWR9LWNoZWNrXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2xvYWQuaWR9LWNoZWNrXCI+PC9sYWJlbD5cclxuICAgICAgICAgICAgJm5ic3A7XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiYWdlIFwiPiR7bG9hZC5hZ2V9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiYXZhaWwgXCI+JHtsb2FkLnByZXNlbnRhdGlvbkRhdGV9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwidHJ1Y2sgXCI+JHtsb2FkLmVxdWlwbWVudENsYXNzfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImZwIFwiPiR7bG9hZC5pc1BhcnRpYWx9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZG8gXCI+MDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cIm9yaWdpblwiPiR7bG9hZC5vcmlnaW59PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwidHJpcFwiPlxyXG4gICAgICAgICAgICA8YSAgXHJcbiAgICAgICAgICAgICAgICBocmVmPVwidXJscz9DYXRlZ29yeT1Sb3V0aW5nJmFtcDtNYXRjaElkPUxTNDlkbXRqJmFtcDtSZWdpc3RyeUlkPVMuMTE3NzY0LjI0MTExNCZhbXA7Q2F0ZWdvcnlQcm92aWRlcj1Qcm9NaWxlc1wiIFxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmtcIiBcclxuICAgICAgICAgICAgICAgIHRyYWNrLWxpbmstY2F0ZWdvcnk9XCJUcmlwIE1pbGVzXCIgXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAke2xvYWQudHJpcE1pbGVzfVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZGVzdCBcIj4ke2xvYWQuZGVzdGluYXRpb259PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZGQgXCI+JHtsb2FkLmRlYWRoZWFkTWlsZXNEZXN0aW5hdGlvbn08L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJjb21wYW55IGRyb3Bkb3duIFwiPlxyXG4gICAgICAgICAgICAgPGEgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIFxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmsgY29tcGFueVRvZ2dsZVwiIFxyXG4gICAgICAgICAgICAgICAgdGl0bGU9XCIke2xvYWQuY29tcGFueX0gKGNsaWNrIGZvciBkZXRhaWxzKVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICR7bG9hZC5jb21wYW55fVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiY29udGFjdFwiPiR7bG9hZC5jb250YWN0UGhvbmV9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwibGVuZ3RoIFwiPiR7bG9hZC5sZW5ndGh9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwid2VpZ2h0IFwiPiR7bG9hZC53ZWlnaHR9PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiY3NcIj5cclxuICAgICAgICAgICAgPGEgIGhyZWY9XCJ1cmxzP0NhdGVnb3J5PUN1c3RvbWVyRGlyZWN0b3J5Q3JlZGl0UHJvZmlsZSZhbXA7TWF0Y2hJZD1MUzQ5ZG10aiZhbXA7UmVnaXN0cnlJZD1TLjExNzc2NC4yNDExMTRcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiQ3JlZGl0IFNjb3JlXCIgXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAke2xvYWQuY3JlZGl0U2NvcmV9XHJcbiAgICAgICAgICAgIDwvYT5cclxuICAgICAgICA8L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJkdHBcIj5cclxuICAgICAgICAgICAgPGEgIGhyZWY9XCJ1cmxzP0NhdGVnb3J5PUN1c3RvbWVyRGlyZWN0b3J5Q3JlZGl0UHJvZmlsZSZhbXA7TWF0Y2hJZD1MUzQ5ZG10aiZhbXA7UmVnaXN0cnlJZD1TLjExNzc2NC4yNDExMTRcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiQ3JlZGl0IFNjb3JlXCIgXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgICAgICAgICAyMlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZmFjdG9yYWJsZVwiIHRpdGxlPVwiRmFjdG9yIEl0XCI+XHJcbiAgICAgICAgICAgIDxhICBocmVmPVwidXJscz9DYXRlZ29yeT1GYWN0b3JpbmcmYW1wO01hdGNoSWQ9TFM0OWRtdGomYW1wO1JlZ2lzdHJ5SWQ9Uy4xMTc3NjQuMjQxMTE0JmFtcDtDYXRlZ29yeVByb3ZpZGVyPWFiY1wiIFxyXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmtcIiBcclxuICAgICAgICAgICAgICAgIHRyYWNrLWxpbmstY2F0ZWdvcnk9XCJGYWN0b3JpbmdcIiBcclxuICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiPlxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwicmF0ZVwiPiR7bG9hZC5yYXRlfTwvdGQ+XHJcblxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJyYXRlXCI+JCR7bG9hZC5QUE19PC90ZD5cclxuICAgIDwvdHI+XHJcbiAgICBgO1xyXG4gICAgY29uc3Qgcm93SW5mbyA9IGBcclxuICAgIDx0ciBjbGFzcz1cImdyb3VwRGF0YSBuZy1zY29wZSAke2hpZGVDbGFzc31cIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjIwXCI+XHJcbiAgICAgICAgICAgIDwhLS0gY29sc3BhbiBub3QgdGhlIHNhbWUgYXMgc3VtbWFyeSByb3cgZHVlIHRvIHJvd3NwYW4gaW4gZ3JvdXBzIC0tPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cIm1lbnVUb2dnbGUgXCI+PC9hPlxyXG4gICAgICAgICAgICA8bWFyayBjbGFzcz1cIndvcmtJbml0aWFscyBcIj48L21hcms+XHJcbiAgICAgICAgICAgIDxtYXJrIGNsYXNzPVwic3RhdHVzIFwiPjwvbWFyaz5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJub3Rlc0xhYmVsIFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJsYWJlbFwiPk5vdGVzOjwvc3Bhbj4gXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm5vdGVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDxhc2lkZT5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwid29ya3N0YXR1c1wiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiMVwiIGlkPVwiJHtsb2FkLmlkfS0xXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS0xXCI+QWNjZXB0ZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiMlwiIGlkPVwiJHtsb2FkLmlkfS0yXCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS0yXCI+Q2FsbGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHtsb2FkLmlkfS1zdGF0dXNcIiB2YWx1ZT1cIjNcIiBpZD1cIiR7bG9hZC5pZH0tM1wiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7bG9hZC5pZH0tM1wiPk5vIExvbmdlciBBdmFpbGFibGU8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiNFwiIGlkPVwiJHtsb2FkLmlkfS00XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS00XCI+UmVmdXNlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIiR7bG9hZC5pZH0tc3RhdHVzXCIgdmFsdWU9XCI1XCIgaWQ9XCIke2xvYWQuaWR9LTVcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2xvYWQuaWR9LTVcIj5VbnF1YWxpZmllZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cInJlbW92ZVN0YXR1c05vdGVzIG5nLWhpZGVcIj5SZW1vdmUgc3RhdHVzIGFuZCBub3RlczwvYT5cclxuICAgICAgICAgICAgPC9maWVsZHNldD5cclxuICAgICAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwibm90ZXNcIj5cclxuICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBwbGFjZWhvbGRlcj1cIlBpY2sgYSBzdGF0dXNcIiBjbGFzcz1cIm5vdGVcIiBtYXhsZW5ndGg9XCIyNTZcIiBkaXNhYmxlZD1cIlwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiY2FuY2Vsd29ya3N0YXR1c1wiIHR5cGU9XCJidXR0b25cIj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzZXR3b3Jrc3RhdHVzXCIgdHlwZT1cImJ1dHRvblwiIGRpc2FibGVkPVwiXCI+U3VibWl0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDwvYXNpZGU+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGNsYXNzPVwicmVzdWx0RGV0YWlscyAgbmctc2NvcGUgJHtoaWRlQ2xhc3N9XCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIyMFwiPlxyXG4gICAgICAgICAgICA8IS0tLS0+XHJcbiAgICAgICAgICAgIDwhLS0gY29sc3BhbiBub3QgdGhlIHNhbWUgYXMgc3VtbWFyeSByb3cgZHVlIHRvIHJvd3NwYW4gaW4gZ3JvdXBzIC0tPlxyXG4gICAgICAgICAgICA8ZGw+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+UmVmOjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJyZWZJZFwiPiR7ZGVmYXVsdEluZm8ucmVmZXJlbmNlSWR9PC9kZD5cclxuICAgICAgICAgICAgICAgIDxkdD5Db21tb2RpdHk6PC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImNvbW1vZGl0eVwiIHRpdGxlPVwiJHtkZWZhdWx0SW5mby5jb21tb2RpdHl9XCI+JHtkZWZhdWx0SW5mby5jb21tb2RpdHl9PC9kZD5cclxuICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0PkNvbW1lbnRzIDE6PC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImNvbW1lbnRzMVwiIHRpdGxlPVwiJHtkZWZhdWx0SW5mby5jb21tZW50MX1cIj4ke2RlZmF1bHRJbmZvLmNvbW1lbnQxfTwvZGQ+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+Q29tbWVudHMgMjo8L2R0PlxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiY29tbWVudHMyXCIgdGl0bGU9XCIke2RlZmF1bHRJbmZvLmNvbW1lbnQyfVwiPiR7ZGVmYXVsdEluZm8uY29tbWVudDJ9PC9kZD5cclxuICAgICAgICAgICAgPC9kbD5cclxuICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0IGNsYXNzPVwiXCI+RG9ja2V0OjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJkb2NrZXQgXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cInVybHM/Q2F0ZWdvcnk9Q3VzdG9tZXJEaXJlY3RvcnlUQ1NJUHJvZmlsZSZhbXA7TWF0Y2hJZD1EUzJieUxEcyZhbXA7UmVnaXN0cnlJZD1TLjE1Nzc5MS4yODM4NzdcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmtcIiB0cmFjay1saW5rLWNhdGVnb3J5PVwiQ29tcGFueVwiIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7ZGVmYXVsdEluZm8uZG9ja2V0TnVtYmVyfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgIDwvZGQ+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiYm9uZGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXMtdGlhLW1lbWJlclwiIHRpdGxlPVwiVElBIE1lbWJlclwiPjwvc3Bhbj4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpcy1hc3N1cmFibGVcIiB0aXRsZT1cIkFzc3VyZSBJdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtkZWZhdWx0SW5mby5USUFVUkx9XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkFzc3VyYWJsZVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvZGQ+XHJcbiAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgPC90ZD5cclxuICAgIDwvdHI+XHJcblxyXG4gICAgPHRyIGNsYXNzPVwiYWN0aW9ucyBuZy1zY29wZSAke2hpZGVDbGFzc31cIj5cclxuICAgICAgICA8dGQgY29sc3Bhbj1cIjIwXCI+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwicHJpbnRcIiB0aXRsZT1cIlByaW50XCI+PC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgYDtcclxuICAgIHJldHVybiBtYWluUm93ICsgcm93SW5mbztcclxufSk7XHJcbmV4cG9ydCBkZWZhdWx0IGdldFJvd0hUTUw7XHJcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0IGNvbnN0IGh0bWxUb0VsZW1lbnQgPSAoaHRtbCkgPT4ge1xyXG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcclxuICAgIGh0bWwgPSBodG1sLnRyaW0oKTsgLy8gTmV2ZXIgcmV0dXJuIGEgdGV4dCBub2RlIG9mIHdoaXRlc3BhY2UgYXMgdGhlIHJlc3VsdFxyXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBzbGVlcCA9IChtcykgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgd2FpdFRvTG9hZCA9IChjbGFzc05hbWUpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVswXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgeWllbGQgc2xlZXAoNTAwKTtcclxuICAgIH1cclxufSk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG5pbXBvcnQgeyBBUEkgfSBmcm9tICcuL0FQSSc7XHJcbmltcG9ydCB7IGh0bWxUb0VsZW1lbnQsIHNsZWVwLCB3YWl0VG9Mb2FkIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IGdldFJvd0hUTUwgfSBmcm9tICcuL1Jvd0hlYWRlcic7XHJcbmNvbnN0IGFwaSA9IG5ldyBBUEkoKTtcclxubGV0IHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KCk7XHJcbmxldCBhbGxMb2FkcyA9IFtdO1xyXG5sZXQgaW50ZXJ2YWxJZCA9IC0xO1xyXG5sZXQgbGFzdFNjcm9sbCA9IC0xO1xyXG5sZXQgY2FsY3VsYXRlUFBNID0gdHJ1ZTtcclxuY29uc3QgY29sdW1uTmFtZSA9ICdQUE0nO1xyXG5sZXQgbWluUmF0ZSA9IDA7XHJcbmNvbnN0IGNsaWNrRXZlbnRMaXNpdGlvbmVyID0gKGUpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgbGV0IGhlYWRlckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NvcnRGaWVsZCcpO1xyXG4gICAgaWYgKGhlYWRlckNvbnRhaW5lclswXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIEZpbmQgSGVhZGVyIENvbnRhaW5lciB3aXRoIGNsYXNzTmFtZSAnc29ydEZpZWxkJ2ApO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBoZWFkZXJzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlckNvbnRhaW5lci5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICBsZXQgaGVhZGVyQ2hpbGQgPSBoZWFkZXJDb250YWluZXJbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgbGV0IGhlYWRlcldyYXBwZXIgPSBoZWFkZXJDaGlsZC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCduZy1zY29wZScpWzBdO1xyXG4gICAgICAgIGlmIChoZWFkZXJXcmFwcGVyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkIHRvIGZpbmQgaGVhZGVyV3JhcHBlciB3aXRoIGNsYXNzTmFtZSBwYXRoICcuY29sdW1uSGVhZGVycy5uZy1zY29wZSdgKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhlYWRlcnMucHVzaChoZWFkZXJXcmFwcGVyLmlubmVySFRNTCk7XHJcbiAgICB9XHJcbiAgICBsZXQgaGVhZGVyTmFtZSA9IGUucGF0aFswXS5pbm5lckhUTUw7XHJcbiAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xyXG4gICAgaWYgKGhlYWRlcnMuaW5jbHVkZXMoaGVhZGVyTmFtZSkpIHtcclxuICAgICAgICBjYWxjdWxhdGVQUE0gPSB0cnVlO1xyXG4gICAgICAgIHlpZWxkIHNsZWVwKDIwMDApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaGVhZGVyTmFtZSA9PT0gY29sdW1uTmFtZSkge1xyXG4gICAgICAgIGNhbGN1bGF0ZVBQTSA9IGZhbHNlO1xyXG4gICAgICAgIGFsbExvYWRzID0geWllbGQgYXBpLmdldEFsbExvYWRzKCk7XHJcbiAgICAgICAgdXBkYXRlQWxsUm93cygpO1xyXG4gICAgfVxyXG4gICAgbGFzdFNjcm9sbCA9IC0xO1xyXG4gICAgaW50ZXJ2YWxJZCA9IHdpbmRvdy5zZXRJbnRlcnZhbChpbml0LCA1MDApO1xyXG59KTtcclxuY29uc3QgYWRkVGFibGVIZWFkZXJzID0gKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBsZXQgdGFibGVIZWFkZXJzQ2xhc3NOYW1lID0gJ2NvbHVtbkhlYWRlcnMnO1xyXG4gICAgeWllbGQgd2FpdFRvTG9hZCh0YWJsZUhlYWRlcnNDbGFzc05hbWUpO1xyXG4gICAgY29uc3QgaGVhZGVyUmF3SHRtbCA9IGA8dGggc3R5bGU9XCJjdXJzb3I6cG9pbnRlclwiIGNsYXNzPVwiYm9va0l0Tm93IG5nLXByaXN0aW5lIG5nLXVudG91Y2hlZCBuZy12YWxpZCBuZy1zY29wZSBuZy1pc29sYXRlLXNjb3BlXCIgc29ydGFibGU9XCJCb29rSXROb3dcIiBuZy1tb2RlbD1cImN0cmwuY3VycmVudFNvcnRcIiBkZXNjLWZpcnN0PVwidHJ1ZVwiIG5nLWlmPVwiaXNMb2FkU2VhcmNoKClcIiBpZD1cIlBQTVwiPlxyXG4gICAgICAgIDxhIHN0eWxlPVwiY3Vyc29yOnBvaW50ZXJcIiBjbGFzcz1cInNvcnRGaWVsZCBcIj5cclxuICAgICAgICAgICAgPG5nLXRyYW5zY2x1ZGU+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT1cImN1cnNvcjpwb2ludGVyXCIgY2xhc3M9XCJuZy1zY29wZVwiPiR7Y29sdW1uTmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgIDwvbmctdHJhbnNjbHVkZT5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJzb3J0XCI+PC9pPlxyXG4gICAgICAgIDwvYT5cclxuICAgIDwvdGg+XHJcbiAgICBgO1xyXG4gICAgY29uc3QgaW5qZWN0RWxlbWVudCA9IGh0bWxUb0VsZW1lbnQoaGVhZGVyUmF3SHRtbCk7XHJcbiAgICBsZXQgdGFibGVIZWFkZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRhYmxlSGVhZGVyc0NsYXNzTmFtZSlbMF07XHJcbiAgICAvL1JlbW92ZSBCb29rSXQgSGVhZGVyXHJcbiAgICB0YWJsZUhlYWRlckNvbnRhaW5lci5jaGlsZHJlblt0YWJsZUhlYWRlckNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggLSAxXS5yZW1vdmUoKTtcclxuICAgIC8vQWRkIFBQTSBIZWFkZXJcclxuICAgIHRhYmxlSGVhZGVyQ29udGFpbmVyLmFwcGVuZENoaWxkKGluamVjdEVsZW1lbnQpO1xyXG59KTtcclxuY29uc3QgdXBkYXRlQWxsUm93cyA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgY29uc3QgY2FsY3VsYXRlUFBNID0gKHRyaXApID0+IHtcclxuICAgICAgICBsZXQgUFBNID0gMDtcclxuICAgICAgICBsZXQgcmF0ZSA9ICh0cmlwLnJhdGUgIT09ICfigJQnKSA/IHRyaXAucmF0ZS5yZXBsYWNlQWxsKCcsJywgJycpLnJlcGxhY2VBbGwoJyQnLCAnJykgOiAwO1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9ICh0cmlwLnRyaXBNaWxlcyAhPT0gJ+KAlCcpID8gdHJpcC50cmlwTWlsZXMucmVwbGFjZSgvXFxEL2csICcnKSA6IDA7XHJcbiAgICAgICAgcmF0ZSA9IHBhcnNlRmxvYXQocmF0ZSk7XHJcbiAgICAgICAgZGlzdGFuY2UgPSBwYXJzZUZsb2F0KGRpc3RhbmNlKTtcclxuICAgICAgICBpZiAoZGlzdGFuY2UgPiAwKVxyXG4gICAgICAgICAgICBQUE0gPSBwYXJzZUZsb2F0KChyYXRlIC8gZGlzdGFuY2UpLnRvRml4ZWQoMikpO1xyXG4gICAgICAgIHJldHVybiBQUE07XHJcbiAgICB9O1xyXG4gICAgLy9DYWxjdWxhdGUgUFBNIGZvciBhbGwgbG9hZHNcclxuICAgIGFsbExvYWRzID0gYWxsTG9hZHMubWFwKChpdGVtKSA9PiB7XHJcbiAgICAgICAgY29uc3QgUFBNID0gY2FsY3VsYXRlUFBNKGl0ZW0pO1xyXG4gICAgICAgIGl0ZW1bJ1BQTSddID0gUFBNO1xyXG4gICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgfSk7XHJcbiAgICAvL1NvcnQgQnkgUFBNXHJcbiAgICBhbGxMb2FkcyA9IGFsbExvYWRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICBpZiAoYS5QUE0gPCBiLlBQTSlcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgaWYgKGEuUFBNID4gYi5QUE0pXHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG4gICAgLy9SZW1vdmUgYWxsIHByZS1leGlzdGluZyB0cmlwc1xyXG4gICAgbGV0IHRhYmxlUmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlYXJjaFJlc3VsdHNUYWJsZScpWzBdO1xyXG4gICAgd2hpbGUgKHRhYmxlUmVzdWx0cy5jaGlsZHJlbi5sZW5ndGggPiAyKVxyXG4gICAgICAgIHRhYmxlUmVzdWx0cy5jaGlsZHJlblsxXS5yZW1vdmUoKTtcclxuICAgIC8vQWRkIHNvcnRlZCB0cmlwcyB0byBsaXN0XHJcbiAgICBsZXQgbGlzdGVkID0gMDtcclxuICAgIGFsbExvYWRzLmZvckVhY2goKGxvYWQsIGluZGV4KSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBpZiAobGlzdGVkID4gMjUwIHx8IGxvYWQuUFBNID09PSAwKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHBhcnNlSW50KGxvYWQucmF0ZS5yZXBsYWNlKCcsJywgJycpLnN1YnN0cmluZygxKSkgPiBtaW5SYXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBoaWRlRXh0cmFEZXRhaWxzID0gdHJ1ZTtcclxuICAgICAgICAgICAgbGV0IG5ld0xvYWRFbGVtZW50ID0gaHRtbFRvRWxlbWVudChgPHRib2R5IGNsYXNzPVwicmVzdWx0SXRlbSBleGFjdE1hdGNoIHFhLXNjcm9sbExvY2tcIj4ke3lpZWxkIGdldFJvd0hUTUwobG9hZCwgaGlkZUV4dHJhRGV0YWlscyl9PC90Ym9keT5gKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInNlYXJjaFJlc3VsdHNUYWJsZVwiKVswXS5hcHBlbmRDaGlsZChuZXdMb2FkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIG5ld0xvYWRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRlRXh0cmFEZXRhaWxzID0gIWhpZGVFeHRyYURldGFpbHM7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV3SFRNTCA9IHlpZWxkIGdldFJvd0hUTUwobG9hZCwgaGlkZUV4dHJhRGV0YWlscyk7XHJcbiAgICAgICAgICAgICAgICBuZXdMb2FkRWxlbWVudC5pbm5lckhUTUwgPSBuZXdIVE1MO1xyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIGxpc3RlZCsrO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxufSk7XHJcbmNvbnN0IHJlc2V0Um93UFBNID0gKCkgPT4ge1xyXG4gICAgbGV0IHRhYmxlUm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3FhLW1hdGNoLXJvdycpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdGFibGVSb3cgPSB0YWJsZVJvd3NbaV07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy9SZW1vdmUgQm9va0l0IGZyb20gcm93IGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICB0YWJsZVJvdy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib29rSXROb3cnKVswXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vUmVtb3ZlZCBsYXN0IFBQTSBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgdGFibGVSb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmF0ZScpWzFdLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGFkZFBQTSA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgbGV0IHRhYmxlUm93cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3FhLW1hdGNoLXJvdycpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgdGFibGVSb3dFbGVtZW50ID0gdGFibGVSb3dzW2ldO1xyXG4gICAgICAgIGxldCBkaXN0YW5jZSA9IHRhYmxlUm93RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0cmFja0xpbmsnKVswXS5pbm5lckhUTUwucmVwbGFjZSgvXFxEL2csICcnKTtcclxuICAgICAgICBsZXQgcmF0ZSA9IHRhYmxlUm93RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyYXRlJylbMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBQUE0gPSAwO1xyXG4gICAgICAgIGlmIChyYXRlICYmIGRpc3RhbmNlICYmIHJhdGUgIT09ICfigJQnICYmIGRpc3RhbmNlICE9PSAn4oCUJykge1xyXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHBhcnNlSW50KGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgcmF0ZSA9IHBhcnNlSW50KHJhdGUucmVwbGFjZSgnLCcsICcnKS5zdWJzdHJpbmcoMSkpO1xyXG4gICAgICAgICAgICBQUE0gPSAocmF0ZSAvIGRpc3RhbmNlKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGBQUE0gOiAke1BQTX0gfCByYXRlIDogJHtyYXRlfSB8IGRpc3RhbmNlIDogJHtkaXN0YW5jZX1gKVxyXG4gICAgICAgIGNvbnN0IFBQTVJvdyA9IGh0bWxUb0VsZW1lbnQoYDx0ZCBjbGFzcz0ncmF0ZSc+JCR7UFBNfTwvdGQ+YCk7XHJcbiAgICAgICAgdGFibGVSb3dFbGVtZW50LmFwcGVuZENoaWxkKFBQTVJvdyk7XHJcbiAgICB9XHJcbn0pO1xyXG5jb25zdCBpbml0ID0gKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBwb3J0LnBvc3RNZXNzYWdlKCcnKTtcclxuICAgIGxldCBzY3JvbGxDbGFzc05hbWUgPSAnZml4ZWQtdGFibGUtY29udGFpbmVyLWlubmVyIGdyb3Vwc0Nsb3NlZCc7XHJcbiAgICB5aWVsZCB3YWl0VG9Mb2FkKHNjcm9sbENsYXNzTmFtZSk7XHJcbiAgICBjb25zdCBTY3JvbGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzY3JvbGxDbGFzc05hbWUpWzBdO1xyXG4gICAgaWYgKFNjcm9sbEVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBGaW5kIEVsZW1lbnQgd2l0aCBjbGFzcyAke3Njcm9sbENsYXNzTmFtZX1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyZW50U2Nyb2xsID0gU2Nyb2xsRWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICBpZiAoY3VycmVudFNjcm9sbCA+IGxhc3RTY3JvbGwgJiYgY2FsY3VsYXRlUFBNKSB7XHJcbiAgICAgICAgcmVzZXRSb3dQUE0oKTtcclxuICAgICAgICBhZGRQUE0oKTtcclxuICAgIH1cclxuICAgIGxhc3RTY3JvbGwgPSBjdXJyZW50U2Nyb2xsO1xyXG59KTtcclxuYWRkVGFibGVIZWFkZXJzKCk7XHJcbmludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoaW5pdCwgNTAwKTtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0V2ZW50TGlzaXRpb25lcik7XHJcbnBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgIG1pblJhdGUgPSBtc2c7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=