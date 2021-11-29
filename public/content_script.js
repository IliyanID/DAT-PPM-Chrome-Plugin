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
let maxResults = 150;
const clickEventLisitioner = (e) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0,_utils__WEBPACK_IMPORTED_MODULE_1__.waitToLoad)('sortField');
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
        //Remove all pre-existing trips
        let tableResults = document.getElementsByClassName('searchResultsTable')[0];
        while (tableResults.children.length > 1)
            tableResults.children[1].remove();
        allLoads = yield api.getAllLoads();
        updateAllRows();
    }
    else
        calculatePPM = true;
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
    //Add sorted trips to list
    let listed = 0;
    allLoads.forEach((load, index) => __awaiter(void 0, void 0, void 0, function* () {
        if (index + 1 > maxResults || load.PPM === 0)
            return;
        if (parseInt(load.rate.replace(',', '').substring(1)) > minRate) {
            listed = listed + 1;
            let hideExtraDetails = true;
            let newLoadElement = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.htmlToElement)(`<tbody class="resultItem exactMatch qa-scrollLock">${yield (0,_RowHeader__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load, hideExtraDetails)}</tbody>`);
            document.getElementsByClassName("searchResultsTable")[0].appendChild(newLoadElement);
            newLoadElement.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
                hideExtraDetails = !hideExtraDetails;
                let newHTML = yield (0,_RowHeader__WEBPACK_IMPORTED_MODULE_2__.getRowHTML)(load, hideExtraDetails);
                newLoadElement.innerHTML = newHTML;
            }));
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
    try {
        port.postMessage('');
    }
    catch (e) {
        port = chrome.runtime.connect();
    }
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
    if (minRate !== msg.minRate || maxResults !== msg.results) {
        minRate = msg.minRate;
        maxResults = msg.results;
        if (!calculatePPM)
            clickEventLisitioner({ path: [columnName] });
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxxREFBYSx1REFBdUQsTUFBTSxzREFBVSx5QkFBeUI7QUFDOUk7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLHNEQUFVO0FBQzlDO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQXNCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixLQUFLLFdBQVcsTUFBTSxlQUFlLFNBQVM7QUFDN0UsdUJBQXVCLHFEQUFhLHNCQUFzQixJQUFJO0FBQzlEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVUsa0RBQVU7QUFDcEI7QUFDQTtBQUNBLDJEQUEyRCxnQkFBZ0I7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG9CQUFvQjtBQUN2RDtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi8uL2NvbnRlbnRfc2NyaXB0L0FQSS50cyIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi8uL2NvbnRlbnRfc2NyaXB0L1Jvd0hlYWRlci50cyIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi8uL2NvbnRlbnRfc2NyaXB0L3V0aWxzLnRzIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kYXQtcHBtLWNocm9tZXBsdWdpbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9jb250ZW50X3NjcmlwdC9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuZXhwb3J0IGNsYXNzIEFQSSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmdldFNlYXJjaElkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc2VhcmNoSWQgPSAnJztcclxuICAgICAgICAgICAgbGV0IGNsYXNzTmFtZSA9ICdjdXJyZW50U2VhcmNoJztcclxuICAgICAgICAgICAgbGV0IHNlYXJjaEhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKVswXTtcclxuICAgICAgICAgICAgaWYgKHNlYXJjaEhlYWRlciAmJiBzZWFyY2hIZWFkZXIuaWQpXHJcbiAgICAgICAgICAgICAgICBzZWFyY2hJZCA9IHNlYXJjaEhlYWRlci5pZDtcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBXYXJuaW5nIFVuYWJsZSBUbyBGaW5kIFNlYXJjaCBIZWFkZXIgV2l0aCBDbGFzcyAnJHtjbGFzc05hbWV9J2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzZWFyY2hJZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMubWFrZUFwaUNhbGwgPSAodXJsKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IHlpZWxkIGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgXCJoZWFkZXJzXCI6IHtcclxuICAgICAgICAgICAgICAgICAgICBcIngtcmVxdWVzdGVkLXdpdGhcIjogXCJYTUxIdHRwUmVxdWVzdFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgXCJib2R5XCI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBcIm1ldGhvZFwiOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgXCJjcmVkZW50aWFsc1wiOiBcImluY2x1ZGVcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmVzcG9uc2UgPSB5aWVsZCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdldExvYWRJbmZvID0gKG1hdGNoSWQsIGRlZmF1bHRJbmZvKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaElkID0gdGhpcy5nZXRTZWFyY2hJZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBjaGVja1JlcG9uc2VPYmplY3QgPSAocmVzcG9uc2VPYmopID0+IHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKGRlZmF1bHRJbmZvKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZU9ialtrZXldKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZU9ialtrZXldID0gJyc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgbGV0IHVybCA9IGBodHRwczovL3Bvd2VyLmRhdC5jb20vc2VhcmNoL21hdGNoZXMvdGFrZS8/bWF0Y2hJZD0ke21hdGNoSWR9JnNlYXJjaElkPSR7c2VhcmNoSWR9YDtcclxuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0geWllbGQgdGhpcy5tYWtlQXBpQ2FsbCh1cmwpO1xyXG4gICAgICAgICAgICBjaGVja1JlcG9uc2VPYmplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nZXRBbGxMb2FkcyA9ICgpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoSWQgPSB0aGlzLmdldFNlYXJjaElkKCk7XHJcbiAgICAgICAgICAgIGxldCBhbGxMb2FkcyA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBjb25jYXRMb2FkcyA9IChyZXNwb25zZU9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlT2JqLmV4YWN0ICYmIHJlc3BvbnNlT2JqLmV4YWN0Lmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsTG9hZHMgPSBhbGxMb2Fkcy5jb25jYXQocmVzcG9uc2VPYmouZXhhY3QpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlT2JqLnNpbWlsYXIgJiYgcmVzcG9uc2VPYmouc2ltaWxhci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgIGFsbExvYWRzID0gYWxsTG9hZHMuY29uY2F0KHJlc3BvbnNlT2JqLnNpbWlsYXIpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsZXQgdXJscyA9IFtcclxuICAgICAgICAgICAgICAgIGBodHRwczovL3Bvd2VyLmRhdC5jb20vc2VhcmNoL21hdGNoZXMvc29ydC8/ZGlyZWN0aW9uPWRlc2MmZmllbGQ9UmF0ZSZzZWFyY2hJZD0ke3NlYXJjaElkfSZ1cGRhdGVTb3J0UGFyYW1zPXRydWVgLFxyXG4gICAgICAgICAgICAgICAgYGh0dHBzOi8vcG93ZXIuZGF0LmNvbS9zZWFyY2gvbWF0Y2hlcy9uZXh0LyR7c2VhcmNoSWR9P3BhZ2VTaXplPTEwMDBgXHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdGFydGVkIEFQSSBDYWxsJyk7XHJcbiAgICAgICAgICAgIGxldCByZXNwb25zZU9iaiA9IHlpZWxkIHRoaXMubWFrZUFwaUNhbGwodXJsc1swXSk7XHJcbiAgICAgICAgICAgIGNvbmNhdExvYWRzKHJlc3BvbnNlT2JqKTtcclxuICAgICAgICAgICAgcmVzcG9uc2VPYmogPSB5aWVsZCB0aGlzLm1ha2VBcGlDYWxsKHVybHNbMV0pO1xyXG4gICAgICAgICAgICBjb25jYXRMb2FkcyhyZXNwb25zZU9iaik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFbmRlZCBBUEkgQ2FsbCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gYWxsTG9hZHM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQVBJO1xyXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbmltcG9ydCBBUEkgZnJvbSAnLi9BUEknO1xyXG5jb25zdCBhcGkgPSBuZXcgQVBJKCk7XHJcbmV4cG9ydCBjb25zdCBnZXRSb3dIVE1MID0gKGxvYWQsIGhpZGUpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgbGV0IGhpZGVDbGFzcyA9IChoaWRlKSA/ICcgbmctaGlkZScgOiAnJztcclxuICAgIGxldCBkZWZhdWx0SW5mbyA9IHtcclxuICAgICAgICBjb21tb2RpdHk6IFwiXCIsXHJcbiAgICAgICAgY29tbWVudDE6IFwiXCIsXHJcbiAgICAgICAgY29tbWVudDI6IFwiXCIsXHJcbiAgICAgICAgZG9ja2V0TnVtYmVyOiBcIlwiLFxyXG4gICAgICAgIGRvY2tIb3VyczogXCJcIixcclxuICAgICAgICBwaWNrdXBIb3VyczogXCJcIixcclxuICAgICAgICByZWZlcmVuY2VJZDogXCJcIlxyXG4gICAgfTtcclxuICAgIGlmICghaGlkZSlcclxuICAgICAgICBkZWZhdWx0SW5mbyA9IHlpZWxkIGFwaS5nZXRMb2FkSW5mbyhsb2FkLmlkLCBkZWZhdWx0SW5mbyk7XHJcbiAgICBjb25zdCBtYWluUm93ID0gYFxyXG4gICAgPHRyIGlkPVwiJHtsb2FkLmlkfVwiIGNsYXNzPVwicWEtbWF0Y2gtcm93IHJlc3VsdFN1bW1hcnkgdW5yZWFkXCI+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwiYWN0aXZpdHlcIiByb3dzcGFuPVwiNFwiPiA8IS0tIHJvd3NwYW4gaXMgZm9yIGdyb3VwcyBmb3JtYXR0aW5nIHdoZW4gZXhwYW5kZWQgLS0+XHJcbiAgICAgICAgICAgIDwhLS0gcm93c3BhbiBpcyBmb3IgZ3JvdXBzIGZvcm1hdHRpbmcgd2hlbiBleHBhbmRlZCAtLT5cclxuICAgICAgICAgICAgPG1hcms+PC9tYXJrPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwibmV3XCI+Jm5ic3A7PC90ZD4gPCEtLSBQbGVhc2UgbGVhdmUgdGhlIG5ic3AsIHRoZXkgYXJlIG5lY2Vzc2FyeSBmb3IgdGFibGUgcm93IHN0cmlrZW91dCB0byB3b3JrIHJpZ2h0IGluIElFIC0tPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInNlbGVjdFwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjdXN0b21DaGVja2JveCBzZWFyY2hCYXRjaFwiIGlkPVwiJHtsb2FkLmlkfS1jaGVja1wiPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS1jaGVja1wiPjwvbGFiZWw+XHJcbiAgICAgICAgICAgICZuYnNwO1xyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImFnZSBcIj4ke2xvYWQuYWdlfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImF2YWlsIFwiPiR7bG9hZC5wcmVzZW50YXRpb25EYXRlfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRydWNrIFwiPiR7bG9hZC5lcXVpcG1lbnRDbGFzc308L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJmcCBcIj4ke2xvYWQuaXNQYXJ0aWFsfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRvIFwiPjA8L3RkPlxyXG5cclxuICAgICAgICA8dGQgY2xhc3M9XCJvcmlnaW5cIj4ke2xvYWQub3JpZ2lufTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRyaXBcIj5cclxuICAgICAgICAgICAgPGEgIFxyXG4gICAgICAgICAgICAgICAgaHJlZj1cInVybHM/Q2F0ZWdvcnk9Um91dGluZyZhbXA7TWF0Y2hJZD1MUzQ5ZG10aiZhbXA7UmVnaXN0cnlJZD1TLjExNzc2NC4yNDExMTQmYW1wO0NhdGVnb3J5UHJvdmlkZXI9UHJvTWlsZXNcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiVHJpcCBNaWxlc1wiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsb2FkLnRyaXBNaWxlc31cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRlc3QgXCI+JHtsb2FkLmRlc3RpbmF0aW9ufTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImRkIFwiPiR7bG9hZC5kZWFkaGVhZE1pbGVzRGVzdGluYXRpb259PC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiY29tcGFueSBkcm9wZG93biBcIj5cclxuICAgICAgICAgICAgIDxhIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rIGNvbXBhbnlUb2dnbGVcIiBcclxuICAgICAgICAgICAgICAgIHRpdGxlPVwiJHtsb2FkLmNvbXBhbnl9IChjbGljayBmb3IgZGV0YWlscylcIj5cclxuICAgICAgICAgICAgICAgICAgICAke2xvYWQuY29tcGFueX1cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImNvbnRhY3RcIj4ke2xvYWQuY29udGFjdFBob25lfTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImxlbmd0aCBcIj4ke2xvYWQubGVuZ3RofTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cIndlaWdodCBcIj4ke2xvYWQud2VpZ2h0fTwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImNzXCI+XHJcbiAgICAgICAgICAgIDxhICBocmVmPVwidXJscz9DYXRlZ29yeT1DdXN0b21lckRpcmVjdG9yeUNyZWRpdFByb2ZpbGUmYW1wO01hdGNoSWQ9TFM0OWRtdGomYW1wO1JlZ2lzdHJ5SWQ9Uy4xMTc3NjQuMjQxMTE0XCIgXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkNyZWRpdCBTY29yZVwiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgJHtsb2FkLmNyZWRpdFNjb3JlfVxyXG4gICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgPC90ZD5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwiZHRwXCI+XHJcbiAgICAgICAgICAgIDxhICBocmVmPVwidXJscz9DYXRlZ29yeT1DdXN0b21lckRpcmVjdG9yeUNyZWRpdFByb2ZpbGUmYW1wO01hdGNoSWQ9TFM0OWRtdGomYW1wO1JlZ2lzdHJ5SWQ9Uy4xMTc3NjQuMjQxMTE0XCIgXHJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInRyYWNrTGlua1wiIFxyXG4gICAgICAgICAgICAgICAgdHJhY2stbGluay1jYXRlZ29yeT1cIkNyZWRpdCBTY29yZVwiIFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgMjJcclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cImZhY3RvcmFibGVcIiB0aXRsZT1cIkZhY3RvciBJdFwiPlxyXG4gICAgICAgICAgICA8YSAgaHJlZj1cInVybHM/Q2F0ZWdvcnk9RmFjdG9yaW5nJmFtcDtNYXRjaElkPUxTNDlkbXRqJmFtcDtSZWdpc3RyeUlkPVMuMTE3NzY0LjI0MTExNCZhbXA7Q2F0ZWdvcnlQcm92aWRlcj1hYmNcIiBcclxuICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgXHJcbiAgICAgICAgICAgICAgICB0cmFjay1saW5rLWNhdGVnb3J5PVwiRmFjdG9yaW5nXCIgXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIj5cclxuICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgIDwvdGQ+XHJcblxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInJhdGVcIj4ke2xvYWQucmF0ZX08L3RkPlxyXG5cclxuXHJcbiAgICAgICAgPHRkIGNsYXNzPVwicmF0ZVwiPiQke2xvYWQuUFBNfTwvdGQ+XHJcbiAgICA8L3RyPlxyXG4gICAgYDtcclxuICAgIGNvbnN0IHJvd0luZm8gPSBgXHJcbiAgICA8dHIgY2xhc3M9XCJncm91cERhdGEgbmctc2NvcGUgJHtoaWRlQ2xhc3N9XCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIyMFwiPlxyXG4gICAgICAgICAgICA8IS0tIGNvbHNwYW4gbm90IHRoZSBzYW1lIGFzIHN1bW1hcnkgcm93IGR1ZSB0byByb3dzcGFuIGluIGdyb3VwcyAtLT5cclxuICAgICAgICAgICAgPGEgY2xhc3M9XCJtZW51VG9nZ2xlIFwiPjwvYT5cclxuICAgICAgICAgICAgPG1hcmsgY2xhc3M9XCJ3b3JrSW5pdGlhbHMgXCI+PC9tYXJrPlxyXG4gICAgICAgICAgICA8bWFyayBjbGFzcz1cInN0YXR1cyBcIj48L21hcms+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzPVwibm90ZXNMYWJlbCBcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibGFiZWxcIj5Ob3Rlczo8L3NwYW4+IFxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJub3RlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8YXNpZGU+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzcz1cIndvcmtzdGF0dXNcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHtsb2FkLmlkfS1zdGF0dXNcIiB2YWx1ZT1cIjFcIiBpZD1cIiR7bG9hZC5pZH0tMVwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7bG9hZC5pZH0tMVwiPkFjY2VwdGVkPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHtsb2FkLmlkfS1zdGF0dXNcIiB2YWx1ZT1cIjJcIiBpZD1cIiR7bG9hZC5pZH0tMlwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7bG9hZC5pZH0tMlwiPkNhbGxlZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIiR7bG9hZC5pZH0tc3RhdHVzXCIgdmFsdWU9XCIzXCIgaWQ9XCIke2xvYWQuaWR9LTNcIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCIke2xvYWQuaWR9LTNcIj5ObyBMb25nZXIgQXZhaWxhYmxlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiJHtsb2FkLmlkfS1zdGF0dXNcIiB2YWx1ZT1cIjRcIiBpZD1cIiR7bG9hZC5pZH0tNFwiPlxyXG4gICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIiR7bG9hZC5pZH0tNFwiPlJlZnVzZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCIke2xvYWQuaWR9LXN0YXR1c1wiIHZhbHVlPVwiNVwiIGlkPVwiJHtsb2FkLmlkfS01XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiJHtsb2FkLmlkfS01XCI+VW5xdWFsaWZpZWQ8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJyZW1vdmVTdGF0dXNOb3RlcyBuZy1oaWRlXCI+UmVtb3ZlIHN0YXR1cyBhbmQgbm90ZXM8L2E+XHJcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzcz1cIm5vdGVzXCI+XHJcbiAgICAgICAgICAgICAgICA8dGV4dGFyZWEgcGxhY2Vob2xkZXI9XCJQaWNrIGEgc3RhdHVzXCIgY2xhc3M9XCJub3RlXCIgbWF4bGVuZ3RoPVwiMjU2XCIgZGlzYWJsZWQ9XCJcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImNhbmNlbHdvcmtzdGF0dXNcIiB0eXBlPVwiYnV0dG9uXCI+PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic2V0d29ya3N0YXR1c1wiIHR5cGU9XCJidXR0b25cIiBkaXNhYmxlZD1cIlwiPlN1Ym1pdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxyXG4gICAgICAgICAgICA8L2FzaWRlPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG5cclxuICAgIDx0ciBjbGFzcz1cInJlc3VsdERldGFpbHMgIG5nLXNjb3BlICR7aGlkZUNsYXNzfVwiPlxyXG4gICAgICAgIDx0ZCBjb2xzcGFuPVwiMjBcIj5cclxuICAgICAgICAgICAgPCEtLS0tPlxyXG4gICAgICAgICAgICA8IS0tIGNvbHNwYW4gbm90IHRoZSBzYW1lIGFzIHN1bW1hcnkgcm93IGR1ZSB0byByb3dzcGFuIGluIGdyb3VwcyAtLT5cclxuICAgICAgICAgICAgPGRsPlxyXG4gICAgICAgICAgICAgICAgPGR0PlJlZjo8L2R0PlxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwicmVmSWRcIj4ke2RlZmF1bHRJbmZvLnJlZmVyZW5jZUlkfTwvZGQ+XHJcbiAgICAgICAgICAgICAgICA8ZHQ+Q29tbW9kaXR5OjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJjb21tb2RpdHlcIiB0aXRsZT1cIiR7ZGVmYXVsdEluZm8uY29tbW9kaXR5fVwiPiR7ZGVmYXVsdEluZm8uY29tbW9kaXR5fTwvZGQ+XHJcbiAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgICAgIDxkbD5cclxuICAgICAgICAgICAgICAgIDxkdD5Db21tZW50cyAxOjwvZHQ+XHJcbiAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJjb21tZW50czFcIiB0aXRsZT1cIiR7ZGVmYXVsdEluZm8uY29tbWVudDF9XCI+JHtkZWZhdWx0SW5mby5jb21tZW50MX08L2RkPlxyXG4gICAgICAgICAgICAgICAgPGR0PkNvbW1lbnRzIDI6PC9kdD5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImNvbW1lbnRzMlwiIHRpdGxlPVwiJHtkZWZhdWx0SW5mby5jb21tZW50Mn1cIj4ke2RlZmF1bHRJbmZvLmNvbW1lbnQyfTwvZGQ+XHJcbiAgICAgICAgICAgIDwvZGw+XHJcbiAgICAgICAgICAgIDxkbD5cclxuICAgICAgICAgICAgICAgIDxkdCBjbGFzcz1cIlwiPkRvY2tldDo8L2R0PlxyXG4gICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiZG9ja2V0IFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJ1cmxzP0NhdGVnb3J5PUN1c3RvbWVyRGlyZWN0b3J5VENTSVByb2ZpbGUmYW1wO01hdGNoSWQ9RFMyYnlMRHMmYW1wO1JlZ2lzdHJ5SWQ9Uy4xNTc3OTEuMjgzODc3XCIgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzPVwidHJhY2tMaW5rXCIgdHJhY2stbGluay1jYXRlZ29yeT1cIkNvbXBhbnlcIiB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke2RlZmF1bHRJbmZvLmRvY2tldE51bWJlcn1cclxuICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICA8L2RkPlxyXG5cclxuICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImJvbmRpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlzLXRpYS1tZW1iZXJcIiB0aXRsZT1cIlRJQSBNZW1iZXJcIj48L3NwYW4+ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXMtYXNzdXJhYmxlXCIgdGl0bGU9XCJBc3N1cmUgSXRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7ZGVmYXVsdEluZm8uVElBVVJMfVwiIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0cmFja0xpbmtcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrLWxpbmstY2F0ZWdvcnk9XCJBc3N1cmFibGVcIiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2RkPlxyXG4gICAgICAgICAgICA8L2RsPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICA8L3RyPlxyXG5cclxuICAgIDx0ciBjbGFzcz1cImFjdGlvbnMgbmctc2NvcGUgJHtoaWRlQ2xhc3N9XCI+XHJcbiAgICAgICAgPHRkIGNvbHNwYW49XCIyMFwiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cInByaW50XCIgdGl0bGU9XCJQcmludFwiPjwvYT5cclxuICAgICAgICA8L3RkPlxyXG4gICAgPC90cj5cclxuICAgIGA7XHJcbiAgICByZXR1cm4gbWFpblJvdyArIHJvd0luZm87XHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBnZXRSb3dIVE1MO1xyXG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbmV4cG9ydCBjb25zdCBodG1sVG9FbGVtZW50ID0gKGh0bWwpID0+IHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICBodG1sID0gaHRtbC50cmltKCk7IC8vIE5ldmVyIHJldHVybiBhIHRleHQgbm9kZSBvZiB3aGl0ZXNwYWNlIGFzIHRoZSByZXN1bHRcclxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG59O1xyXG5leHBvcnQgY29uc3Qgc2xlZXAgPSAobXMpID0+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpKTtcclxufTtcclxuZXhwb3J0IGNvbnN0IHdhaXRUb0xvYWQgPSAoY2xhc3NOYW1lKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSlbMF0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHlpZWxkIHNsZWVwKDUwMCk7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxuaW1wb3J0IHsgQVBJIH0gZnJvbSAnLi9BUEknO1xyXG5pbXBvcnQgeyBodG1sVG9FbGVtZW50LCBzbGVlcCwgd2FpdFRvTG9hZCB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBnZXRSb3dIVE1MIH0gZnJvbSAnLi9Sb3dIZWFkZXInO1xyXG5jb25zdCBhcGkgPSBuZXcgQVBJKCk7XHJcbmxldCBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCgpO1xyXG5sZXQgYWxsTG9hZHMgPSBbXTtcclxubGV0IGludGVydmFsSWQgPSAtMTtcclxubGV0IGxhc3RTY3JvbGwgPSAtMTtcclxubGV0IGNhbGN1bGF0ZVBQTSA9IHRydWU7XHJcbmNvbnN0IGNvbHVtbk5hbWUgPSAnUFBNJztcclxubGV0IG1pblJhdGUgPSAwO1xyXG5sZXQgbWF4UmVzdWx0cyA9IDE1MDtcclxuY29uc3QgY2xpY2tFdmVudExpc2l0aW9uZXIgPSAoZSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICB5aWVsZCB3YWl0VG9Mb2FkKCdzb3J0RmllbGQnKTtcclxuICAgIGxldCBoZWFkZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdzb3J0RmllbGQnKTtcclxuICAgIGlmIChoZWFkZXJDb250YWluZXJbMF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBGaW5kIEhlYWRlciBDb250YWluZXIgd2l0aCBjbGFzc05hbWUgJ3NvcnRGaWVsZCdgKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBsZXQgaGVhZGVycyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWFkZXJDb250YWluZXIubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGhlYWRlckNoaWxkID0gaGVhZGVyQ29udGFpbmVyW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGxldCBoZWFkZXJXcmFwcGVyID0gaGVhZGVyQ2hpbGQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbmctc2NvcGUnKVswXTtcclxuICAgICAgICBpZiAoaGVhZGVyV3JhcHBlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBmaW5kIGhlYWRlcldyYXBwZXIgd2l0aCBjbGFzc05hbWUgcGF0aCAnLmNvbHVtbkhlYWRlcnMubmctc2NvcGUnYCk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoZWFkZXJzLnB1c2goaGVhZGVyV3JhcHBlci5pbm5lckhUTUwpO1xyXG4gICAgfVxyXG4gICAgbGV0IGhlYWRlck5hbWUgPSBlLnBhdGhbMF0uaW5uZXJIVE1MO1xyXG4gICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElkKTtcclxuICAgIGlmIChoZWFkZXJzLmluY2x1ZGVzKGhlYWRlck5hbWUpKSB7XHJcbiAgICAgICAgY2FsY3VsYXRlUFBNID0gdHJ1ZTtcclxuICAgICAgICB5aWVsZCBzbGVlcCgyMDAwKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGhlYWRlck5hbWUgPT09IGNvbHVtbk5hbWUpIHtcclxuICAgICAgICBjYWxjdWxhdGVQUE0gPSBmYWxzZTtcclxuICAgICAgICAvL1JlbW92ZSBhbGwgcHJlLWV4aXN0aW5nIHRyaXBzXHJcbiAgICAgICAgbGV0IHRhYmxlUmVzdWx0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3NlYXJjaFJlc3VsdHNUYWJsZScpWzBdO1xyXG4gICAgICAgIHdoaWxlICh0YWJsZVJlc3VsdHMuY2hpbGRyZW4ubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgdGFibGVSZXN1bHRzLmNoaWxkcmVuWzFdLnJlbW92ZSgpO1xyXG4gICAgICAgIGFsbExvYWRzID0geWllbGQgYXBpLmdldEFsbExvYWRzKCk7XHJcbiAgICAgICAgdXBkYXRlQWxsUm93cygpO1xyXG4gICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGNhbGN1bGF0ZVBQTSA9IHRydWU7XHJcbiAgICBsYXN0U2Nyb2xsID0gLTE7XHJcbiAgICBpbnRlcnZhbElkID0gd2luZG93LnNldEludGVydmFsKGluaXQsIDUwMCk7XHJcbn0pO1xyXG5jb25zdCBhZGRUYWJsZUhlYWRlcnMgPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgIGxldCB0YWJsZUhlYWRlcnNDbGFzc05hbWUgPSAnY29sdW1uSGVhZGVycyc7XHJcbiAgICB5aWVsZCB3YWl0VG9Mb2FkKHRhYmxlSGVhZGVyc0NsYXNzTmFtZSk7XHJcbiAgICBjb25zdCBoZWFkZXJSYXdIdG1sID0gYDx0aCBzdHlsZT1cImN1cnNvcjpwb2ludGVyXCIgY2xhc3M9XCJib29rSXROb3cgbmctcHJpc3RpbmUgbmctdW50b3VjaGVkIG5nLXZhbGlkIG5nLXNjb3BlIG5nLWlzb2xhdGUtc2NvcGVcIiBzb3J0YWJsZT1cIkJvb2tJdE5vd1wiIG5nLW1vZGVsPVwiY3RybC5jdXJyZW50U29ydFwiIGRlc2MtZmlyc3Q9XCJ0cnVlXCIgbmctaWY9XCJpc0xvYWRTZWFyY2goKVwiIGlkPVwiUFBNXCI+XHJcbiAgICAgICAgPGEgc3R5bGU9XCJjdXJzb3I6cG9pbnRlclwiIGNsYXNzPVwic29ydEZpZWxkIFwiPlxyXG4gICAgICAgICAgICA8bmctdHJhbnNjbHVkZT5cclxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiY3Vyc29yOnBvaW50ZXJcIiBjbGFzcz1cIm5nLXNjb3BlXCI+JHtjb2x1bW5OYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9uZy10cmFuc2NsdWRlPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cInNvcnRcIj48L2k+XHJcbiAgICAgICAgPC9hPlxyXG4gICAgPC90aD5cclxuICAgIGA7XHJcbiAgICBjb25zdCBpbmplY3RFbGVtZW50ID0gaHRtbFRvRWxlbWVudChoZWFkZXJSYXdIdG1sKTtcclxuICAgIGxldCB0YWJsZUhlYWRlckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGFibGVIZWFkZXJzQ2xhc3NOYW1lKVswXTtcclxuICAgIC8vUmVtb3ZlIEJvb2tJdCBIZWFkZXJcclxuICAgIHRhYmxlSGVhZGVyQ29udGFpbmVyLmNoaWxkcmVuW3RhYmxlSGVhZGVyQ29udGFpbmVyLmNoaWxkcmVuLmxlbmd0aCAtIDFdLnJlbW92ZSgpO1xyXG4gICAgLy9BZGQgUFBNIEhlYWRlclxyXG4gICAgdGFibGVIZWFkZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5qZWN0RWxlbWVudCk7XHJcbn0pO1xyXG5jb25zdCB1cGRhdGVBbGxSb3dzID0gKCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICBjb25zdCBjYWxjdWxhdGVQUE0gPSAodHJpcCkgPT4ge1xyXG4gICAgICAgIGxldCBQUE0gPSAwO1xyXG4gICAgICAgIGxldCByYXRlID0gKHRyaXAucmF0ZSAhPT0gJ+KAlCcpID8gdHJpcC5yYXRlLnJlcGxhY2VBbGwoJywnLCAnJykucmVwbGFjZUFsbCgnJCcsICcnKSA6IDA7XHJcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gKHRyaXAudHJpcE1pbGVzICE9PSAn4oCUJykgPyB0cmlwLnRyaXBNaWxlcy5yZXBsYWNlKC9cXEQvZywgJycpIDogMDtcclxuICAgICAgICByYXRlID0gcGFyc2VGbG9hdChyYXRlKTtcclxuICAgICAgICBkaXN0YW5jZSA9IHBhcnNlRmxvYXQoZGlzdGFuY2UpO1xyXG4gICAgICAgIGlmIChkaXN0YW5jZSA+IDApXHJcbiAgICAgICAgICAgIFBQTSA9IHBhcnNlRmxvYXQoKHJhdGUgLyBkaXN0YW5jZSkudG9GaXhlZCgyKSk7XHJcbiAgICAgICAgcmV0dXJuIFBQTTtcclxuICAgIH07XHJcbiAgICAvL0NhbGN1bGF0ZSBQUE0gZm9yIGFsbCBsb2Fkc1xyXG4gICAgYWxsTG9hZHMgPSBhbGxMb2Fkcy5tYXAoKGl0ZW0pID0+IHtcclxuICAgICAgICBjb25zdCBQUE0gPSBjYWxjdWxhdGVQUE0oaXRlbSk7XHJcbiAgICAgICAgaXRlbVsnUFBNJ10gPSBQUE07XHJcbiAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICB9KTtcclxuICAgIC8vU29ydCBCeSBQUE1cclxuICAgIGFsbExvYWRzID0gYWxsTG9hZHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgIGlmIChhLlBQTSA8IGIuUFBNKVxyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICBpZiAoYS5QUE0gPiBiLlBQTSlcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbiAgICAvL0FkZCBzb3J0ZWQgdHJpcHMgdG8gbGlzdFxyXG4gICAgbGV0IGxpc3RlZCA9IDA7XHJcbiAgICBhbGxMb2Fkcy5mb3JFYWNoKChsb2FkLCBpbmRleCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaWYgKGluZGV4ICsgMSA+IG1heFJlc3VsdHMgfHwgbG9hZC5QUE0gPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAocGFyc2VJbnQobG9hZC5yYXRlLnJlcGxhY2UoJywnLCAnJykuc3Vic3RyaW5nKDEpKSA+IG1pblJhdGUpIHtcclxuICAgICAgICAgICAgbGlzdGVkID0gbGlzdGVkICsgMTtcclxuICAgICAgICAgICAgbGV0IGhpZGVFeHRyYURldGFpbHMgPSB0cnVlO1xyXG4gICAgICAgICAgICBsZXQgbmV3TG9hZEVsZW1lbnQgPSBodG1sVG9FbGVtZW50KGA8dGJvZHkgY2xhc3M9XCJyZXN1bHRJdGVtIGV4YWN0TWF0Y2ggcWEtc2Nyb2xsTG9ja1wiPiR7eWllbGQgZ2V0Um93SFRNTChsb2FkLCBoaWRlRXh0cmFEZXRhaWxzKX08L3Rib2R5PmApO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2VhcmNoUmVzdWx0c1RhYmxlXCIpWzBdLmFwcGVuZENoaWxkKG5ld0xvYWRFbGVtZW50KTtcclxuICAgICAgICAgICAgbmV3TG9hZEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgIGhpZGVFeHRyYURldGFpbHMgPSAhaGlkZUV4dHJhRGV0YWlscztcclxuICAgICAgICAgICAgICAgIGxldCBuZXdIVE1MID0geWllbGQgZ2V0Um93SFRNTChsb2FkLCBoaWRlRXh0cmFEZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgIG5ld0xvYWRFbGVtZW50LmlubmVySFRNTCA9IG5ld0hUTUw7XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbn0pO1xyXG5jb25zdCByZXNldFJvd1BQTSA9ICgpID0+IHtcclxuICAgIGxldCB0YWJsZVJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdxYS1tYXRjaC1yb3cnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlUm93ID0gdGFibGVSb3dzW2ldO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vUmVtb3ZlIEJvb2tJdCBmcm9tIHJvdyBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgdGFibGVSb3cuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9va0l0Tm93JylbMF0ucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7IH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL1JlbW92ZWQgbGFzdCBQUE0gaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgICAgIHRhYmxlUm93LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JhdGUnKVsxXS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHsgfVxyXG4gICAgfVxyXG59O1xyXG5jb25zdCBhZGRQUE0gPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgIGxldCB0YWJsZVJvd3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdxYS1tYXRjaC1yb3cnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFibGVSb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHRhYmxlUm93RWxlbWVudCA9IHRhYmxlUm93c1tpXTtcclxuICAgICAgICBsZXQgZGlzdGFuY2UgPSB0YWJsZVJvd0VsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndHJhY2tMaW5rJylbMF0uaW5uZXJIVE1MLnJlcGxhY2UoL1xcRC9nLCAnJyk7XHJcbiAgICAgICAgbGV0IHJhdGUgPSB0YWJsZVJvd0VsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmF0ZScpWzBdLmlubmVySFRNTDtcclxuICAgICAgICBsZXQgUFBNID0gMDtcclxuICAgICAgICBpZiAocmF0ZSAmJiBkaXN0YW5jZSAmJiByYXRlICE9PSAn4oCUJyAmJiBkaXN0YW5jZSAhPT0gJ+KAlCcpIHtcclxuICAgICAgICAgICAgZGlzdGFuY2UgPSBwYXJzZUludChkaXN0YW5jZSk7XHJcbiAgICAgICAgICAgIHJhdGUgPSBwYXJzZUludChyYXRlLnJlcGxhY2UoJywnLCAnJykuc3Vic3RyaW5nKDEpKTtcclxuICAgICAgICAgICAgUFBNID0gKHJhdGUgLyBkaXN0YW5jZSkudG9GaXhlZCgyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhgUFBNIDogJHtQUE19IHwgcmF0ZSA6ICR7cmF0ZX0gfCBkaXN0YW5jZSA6ICR7ZGlzdGFuY2V9YClcclxuICAgICAgICBjb25zdCBQUE1Sb3cgPSBodG1sVG9FbGVtZW50KGA8dGQgY2xhc3M9J3JhdGUnPiQke1BQTX08L3RkPmApO1xyXG4gICAgICAgIHRhYmxlUm93RWxlbWVudC5hcHBlbmRDaGlsZChQUE1Sb3cpO1xyXG4gICAgfVxyXG59KTtcclxuY29uc3QgaW5pdCA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKCcnKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgcG9ydCA9IGNocm9tZS5ydW50aW1lLmNvbm5lY3QoKTtcclxuICAgIH1cclxuICAgIGxldCBzY3JvbGxDbGFzc05hbWUgPSAnZml4ZWQtdGFibGUtY29udGFpbmVyLWlubmVyIGdyb3Vwc0Nsb3NlZCc7XHJcbiAgICB5aWVsZCB3YWl0VG9Mb2FkKHNjcm9sbENsYXNzTmFtZSk7XHJcbiAgICBjb25zdCBTY3JvbGxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShzY3JvbGxDbGFzc05hbWUpWzBdO1xyXG4gICAgaWYgKFNjcm9sbEVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBGaW5kIEVsZW1lbnQgd2l0aCBjbGFzcyAke3Njcm9sbENsYXNzTmFtZX1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyZW50U2Nyb2xsID0gU2Nyb2xsRWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICBpZiAoY3VycmVudFNjcm9sbCA+IGxhc3RTY3JvbGwgJiYgY2FsY3VsYXRlUFBNKSB7XHJcbiAgICAgICAgcmVzZXRSb3dQUE0oKTtcclxuICAgICAgICBhZGRQUE0oKTtcclxuICAgIH1cclxuICAgIGxhc3RTY3JvbGwgPSBjdXJyZW50U2Nyb2xsO1xyXG59KTtcclxuYWRkVGFibGVIZWFkZXJzKCk7XHJcbmludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoaW5pdCwgNTAwKTtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGlja0V2ZW50TGlzaXRpb25lcik7XHJcbnBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgIGlmIChtaW5SYXRlICE9PSBtc2cubWluUmF0ZSB8fCBtYXhSZXN1bHRzICE9PSBtc2cucmVzdWx0cykge1xyXG4gICAgICAgIG1pblJhdGUgPSBtc2cubWluUmF0ZTtcclxuICAgICAgICBtYXhSZXN1bHRzID0gbXNnLnJlc3VsdHM7XHJcbiAgICAgICAgaWYgKCFjYWxjdWxhdGVQUE0pXHJcbiAgICAgICAgICAgIGNsaWNrRXZlbnRMaXNpdGlvbmVyKHsgcGF0aDogW2NvbHVtbk5hbWVdIH0pO1xyXG4gICAgfVxyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9