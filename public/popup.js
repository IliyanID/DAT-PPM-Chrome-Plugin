/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
/*!***********************************!*\
  !*** ./plugin-container/popup.ts ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
document.addEventListener('DOMContentLoaded', documentEvents, false);
let port = chrome.runtime.connect();
let results;
let minRate;
const handleSave = (e) => {
    document.getElementById('save-settings').style.border = '1px solid green';
    document.getElementById('save-settings').style.color = 'green';
    document.getElementById('save-settings').innerHTML = 'Saved';
    port.postMessage({ minRate: minRate.value, results: results.value });
};
const handleNumLoads = (e) => {
    document.getElementById('resultsValue').innerHTML = e.target.value;
};
function documentEvents() {
    results = document.getElementById('results');
    minRate = document.getElementById('rate');
    let save = document.getElementById('save-settings');
    save.addEventListener('click', handleSave);
    port.postMessage('');
    port.onMessage.addListener(function (msg) {
        minRate.value = msg.minRate;
        console.log(`results: ${msg.results}`);
        results.value = msg.results;
        document.getElementById('resultsValue').innerHTML = msg.results;
    });
    let numLoads = document.getElementById('results');
    numLoads.addEventListener('input', handleNumLoads);
}


/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7VUFBQTtVQUNBOzs7OztXQ0RBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixnREFBZ0Q7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLFlBQVk7QUFDNUM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDVSIsInNvdXJjZXMiOlsid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9wbHVnaW4tY29udGFpbmVyL3BvcHVwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZG9jdW1lbnRFdmVudHMsIGZhbHNlKTtcclxubGV0IHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KCk7XHJcbmxldCByZXN1bHRzO1xyXG5sZXQgbWluUmF0ZTtcclxuY29uc3QgaGFuZGxlU2F2ZSA9IChlKSA9PiB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1zZXR0aW5ncycpLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgZ3JlZW4nO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUtc2V0dGluZ3MnKS5zdHlsZS5jb2xvciA9ICdncmVlbic7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZS1zZXR0aW5ncycpLmlubmVySFRNTCA9ICdTYXZlZCc7XHJcbiAgICBwb3J0LnBvc3RNZXNzYWdlKHsgbWluUmF0ZTogbWluUmF0ZS52YWx1ZSwgcmVzdWx0czogcmVzdWx0cy52YWx1ZSB9KTtcclxufTtcclxuY29uc3QgaGFuZGxlTnVtTG9hZHMgPSAoZSkgPT4ge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHNWYWx1ZScpLmlubmVySFRNTCA9IGUudGFyZ2V0LnZhbHVlO1xyXG59O1xyXG5mdW5jdGlvbiBkb2N1bWVudEV2ZW50cygpIHtcclxuICAgIHJlc3VsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cycpO1xyXG4gICAgbWluUmF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYXRlJyk7XHJcbiAgICBsZXQgc2F2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYXZlLXNldHRpbmdzJyk7XHJcbiAgICBzYXZlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlU2F2ZSk7XHJcbiAgICBwb3J0LnBvc3RNZXNzYWdlKCcnKTtcclxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICBtaW5SYXRlLnZhbHVlID0gbXNnLm1pblJhdGU7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHJlc3VsdHM6ICR7bXNnLnJlc3VsdHN9YCk7XHJcbiAgICAgICAgcmVzdWx0cy52YWx1ZSA9IG1zZy5yZXN1bHRzO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzVmFsdWUnKS5pbm5lckhUTUwgPSBtc2cucmVzdWx0cztcclxuICAgIH0pO1xyXG4gICAgbGV0IG51bUxvYWRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3VsdHMnKTtcclxuICAgIG51bUxvYWRzLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgaGFuZGxlTnVtTG9hZHMpO1xyXG59XHJcbmV4cG9ydCB7fTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9