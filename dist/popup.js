/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./plugin-container/popup.ts ***!
  \***********************************/
document.addEventListener('DOMContentLoaded', documentEvents, false);
let port = chrome.runtime.connect();
let minRatePop = 0;
const handleChange = (e) => {
    port.postMessage({ minRate: e.target.value });
    minRatePop = e.target.value;
};
function documentEvents() {
    let input = document.getElementById('input');
    input.addEventListener('change', handleChange);
    port.postMessage('');
    port.onMessage.addListener(function (msg) {
        input.value = msg;
    });
}

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsInNvdXJjZXMiOlsid2VicGFjazovL2RhdC1wcG0tY2hyb21lcGx1Z2luLy4vcGx1Z2luLWNvbnRhaW5lci9wb3B1cC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZG9jdW1lbnRFdmVudHMsIGZhbHNlKTtcclxubGV0IHBvcnQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KCk7XHJcbmxldCBtaW5SYXRlUG9wID0gMDtcclxuY29uc3QgaGFuZGxlQ2hhbmdlID0gKGUpID0+IHtcclxuICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBtaW5SYXRlOiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIG1pblJhdGVQb3AgPSBlLnRhcmdldC52YWx1ZTtcclxufTtcclxuZnVuY3Rpb24gZG9jdW1lbnRFdmVudHMoKSB7XHJcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUNoYW5nZSk7XHJcbiAgICBwb3J0LnBvc3RNZXNzYWdlKCcnKTtcclxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IG1zZztcclxuICAgIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==