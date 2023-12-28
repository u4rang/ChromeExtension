const MAIN_URI = "https://songdo.ysfsmc.or.kr/application/cart.asp";

const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_NOT_START = "9시 전 메크로를 시작해야합니다.\n메크로를 종료합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";

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
/*
// 데이터를 "application/x-www-form-urlencoded" 형식으로 변환하는 함수
const encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}
const data = {
    evnMode: 'register',
    g_idx: '\'030000013\'',
    dccd: '00001',
    YyMm: '202401'
}

let bedminton6;

const startBedminton6 = () => {
    bedminton6 = setInterval(() => {

        console.log('bedminton6 start');
        fetch('https://songdo.ysfsmc.or.kr/_common/ajax/ajax_register_process.asp',{
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: encodeFormData(data)
        })
        .then(response => {
            // 응답의 Content-Type 헤더 확인
            const contentType = response.headers.get('Content-Type');
        
            // 'text/html' 형식인지 확인
            if (contentType && contentType.includes('text/html')) {
              // 응답을 텍스트로 파싱
              return response.text();
            } else {
              // 다른 형식이면 예외를 발생시킴
              throw new Error('올바른 Content-Type이 아닙니다.');
            }
        })
        .then((data) => {
            if(data == 'notInsert'){
                document.querySelector('#content > div.subPageContainer.container.clear > div.sub-Right > h3').innerHTML = ('배드민턴 6시 - ' + new Date((new Date).getTime() + TIME_ZONE).toISOString().replace('T', ' ').slice(0, -5));
            }else {
                alert("추가되었습니다.");
            }
        })
        .catch((error) => {
            console.error('실패 : ', error);
        })
    }, 7000);
}

const stopBedminton6 = () => {
    console.log('bedminton6 stop');
    clearInterval(bedminton6);
}
*/
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
        //<td><a class="macro-button" id="b6_start" href="#">배드민턴6시시작</a></td>
        //<td><a class="macro-button" id="b6_stop" href="#">배드민턴6시종료</a></td>
    );

    document.querySelector("#macro_start").addEventListener("click", macroStart);
    //document.querySelector("#b6_start").addEventListener("click", startBedminton6);
    //document.querySelector("#b6_stop").addEventListener("click", stopBedminton6);

}) ();