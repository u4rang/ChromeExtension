const MAIN_URI = "https://songdo.ysfsmc.or.kr/application/cart.asp";

const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_NOT_START = "9시 전 메크로를 시작해야합니다.\n메크로를 종료합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";

const macroStop = () => {
}

const setEscapeEvent = () => {
    window.addEventListener("keydown", e => {
        if(e.key === "Escape"){
            console.log('Keydown ESC');
            macroStop();
        }
    });
}

const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
}

const macroStart = () => {
    setEscapeEvent();

    let today = new Date();

    let year = today.getFullYear();             // 년도
    let month = today.getMonth() + 1;           // 월
    let date = today.getDate();                 // 일
    let day = today.getDay();                   // 요일

    let hours = today.getHours();               // 시
    let minutes = today.getMinutes();           // 분
    let seconds = today.getSeconds();           // 초
    let milliseconds = today.getMilliseconds(); // 밀리초

    let serverDate = new Date(year, month - 1, date, hours, minutes, seconds, milliseconds);    // 서버 시간 Date 객체 생성
    let tgtDate = new Date(year, month - 1, date, 09, 00, 00);                                  // 09시 사이트 오픈

    let timer = tgtDate.getTime() - serverDate.getTime();                                       // 서버 시간과 목표 시간의 차이 계산

    console.log(tgtDate.getTime() + " / " +serverDate.getTime() + " / " + timer);

    if(timer < 0) { // 타이머가 0 보다 작으면 함수를 종료
        document.querySelector("#content > div.subPageContainer.container.clear > div.sub-Right > div > form > fieldset > div.text-center.btnsWrap.bottomBtns > button").click();

    }else {
        setTimeout(function() {
            document.querySelector("#content > div.subPageContainer.container.clear > div.sub-Right > div > form > fieldset > div.text-center.btnsWrap.bottomBtns > button").click();
        }, timer);
    }
    
    alert(MSG_MACRO_START);
    
    setInterval(() => {
        document.querySelector("#content > div.subPageContainer.container.clear > div.sub-Right > h3").innerHTML = ("남은 시간(ms) : " + (tgtDate.getTime() - (new Date()).getTime()).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
    }, 100);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if(request.greeting == "hello"){
            console.log("Path : " + window.location.pathname);
        }
    }
);

(() => {
    if(!location.href.startsWith(MAIN_URI)) {
        return;
    }

    setEscapeEvent();

    document.querySelector(".sub-Right h3").insertAdjacentHTML(
        "afterend",
        `
        <td><a class="macro-button" id="macro_start" href="#">메크로시작</a></td>
        `
    );

    document.querySelector("#macro_start").addEventListener("click", macroStart);

}) ();