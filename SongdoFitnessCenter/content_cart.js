const MAIN_URI = "https://songdo.ysfsmc.or.kr/application/cart.asp";

const MSG_MACRO_READY = "메크로를 준비합니다.";
const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_NOT_START = "현재 시각보다 메크로 시작 시간이 더 늦습니다.\n메크로를 종료합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";

let startTime = "";

const getDate = () =>  {
    let now = new Date();
    var date = new Date(now.setMonth(now.getMonth() + 1));
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + month;
}

const yymm = getDate();

const TIME_ZONE = 9 * 60 * 60 * 1000; // 9시간

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

const macroReady = () => {
    chrome.storage.local.get('Songdo_time', function(item){
        startTime = item.Songdo_time.value;
    });

    alert(MSG_MACRO_READY);
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

    let tgt_h = Number(startTime.substring(0,2))
    let tgt_m = Number(startTime.substring(3,5))
    
    let serverDate = new Date(year, month - 1, date, hours, minutes, seconds, milliseconds);    // 서버 시간 Date 객체 생성
    let tgtDate = new Date(year, month - 1, date, tgt_h, tgt_m, 0);                             // 사이트 오픈 시간 지정

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
        <td><a class="macro-button" id="macro_ready" href="#">1.메크로준비</a></td>
        <td><a class="macro-button" id="macro_start" href="#">2.메크로시작</a></td>
        `
    );

    document.querySelector("#macro_ready").addEventListener("click", macroReady);
    document.querySelector("#macro_start").addEventListener("click", macroStart);

}) ();