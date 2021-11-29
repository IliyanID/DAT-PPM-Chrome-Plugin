/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./plugin-container/popup.ts ***!
  \***********************************/
document.addEventListener('DOMContentLoaded', documentEvents, false);
let port = chrome.runtime.connect();
const handleChange = (e) => {
    port.postMessage({ minRate: e.target.value });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGF0LXBwbS1jaHJvbWVwbHVnaW4vLi9wbHVnaW4tY29udGFpbmVyL3BvcHVwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBkb2N1bWVudEV2ZW50cywgZmFsc2UpO1xyXG5sZXQgcG9ydCA9IGNocm9tZS5ydW50aW1lLmNvbm5lY3QoKTtcclxuY29uc3QgaGFuZGxlQ2hhbmdlID0gKGUpID0+IHtcclxuICAgIHBvcnQucG9zdE1lc3NhZ2UoeyBtaW5SYXRlOiBlLnRhcmdldC52YWx1ZSB9KTtcclxufTtcclxuZnVuY3Rpb24gZG9jdW1lbnRFdmVudHMoKSB7XHJcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcclxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGhhbmRsZUNoYW5nZSk7XHJcbiAgICBwb3J0LnBvc3RNZXNzYWdlKCcnKTtcclxuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICBpbnB1dC52YWx1ZSA9IG1zZztcclxuICAgIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==