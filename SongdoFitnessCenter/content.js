const MAIN_URI = "https://songdo.ysfsmc.or.kr/application/applicationList.asp";

const MSG_MACRO_READY = "메크로를 준비합니다.";
const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_NOT_START = "현재 시각보다 메크로 시작 시간이 더 늦습니다.\n메크로를 종료합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";
const MSG_MACRO_STOP = "메크로를 종료합니다.";

let subjects = {
    "010000004" : "수영/화목/초급/06시",
    "010000010" : "수영/화목/초급/07시",
    "010000005" : "수영/화목/중급/06시",
    "010000011" : "수영/화목/중급/07시",
    "010000049" : "수영/화목/상급/06시",
    "010000050" : "수영/화목/상급/07시",
    "010000001" : "수영/월수금/고급/06시",
    "010000007" : "수영/월수금/고급/07시",
    "010000002" : "수영/월수금/연수/06시",
    "010000008" : "수영/월수금/연수/07시",
    "010000003" : "수영/월수금/마스터/06시",
    "010000070" : "수영/월수금/마스터/07시",  
    "030000032" : "베드민턴/월수금/06시",
    "030000052" : "베드민턴/월수금/07시",
    "030000055" : "베드민턴/화목/06시",
    "030000056" : "베드민턴/화목/07시",
    "010000013" : "아쿠아로빅/월수금/12시", 
    "010000101" : "아쿠아로빅/월수금/13시", 
    "010000014" : "아쿠아로빅/화목/12시",
    "010000102" : "아쿠아로빅/화목/13시"
}
let bascd1 = "";
let bascd2 = "";
let subject1 = "";
let subject2 = "";
let subject1Name = "";
let subject2Name = "";

let startTime = "";

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

    chrome.storage.local.get('Songdo_subject1', function(item){
        subject1 = item.Songdo_subject1.value;
        subject1Name = subjects[subject1];
        bascd1 = subject1.substring(0, 2);
    });

    chrome.storage.local.get('Songdo_subject2', function(item){
        subject2 = item.Songdo_subject2.value;
        subject2Name = subjects[subject2];
        bascd2 = subject2.substring(0, 2);
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

    // 신청년월 구하기
    if (month === 12) {  // 12월인 경우
        year += 1;       // 년도를 다음 해로 변경
        month = 1;       // 월을 1월로 설정
    } else {
        month += 1;      // 다음 달로 설정
    }
    
    // 월을 항상 두 자리로 표시
    month = month < 10 ? '0' + month : month;
    
    let YyMm = `${year}${month}`;

    if(timer < 0) { // 타이머가 0 보다 작으면 함수를 종료
        //(bascd, g_idx, YyMm, target_cd, gubun, qty)
        if(subject1 !== ""){
            addCart(bascd1, subject1, YyMm, '01', '1', '1');
        }

        if(subject2 !== ""){
            addCart(bascd2, subject2, YyMm, '01', '1', '1');
        }

    }else {
        setTimeout(function() {
            if(subject1 !== ""){
                addCart(bascd1, subject1, YyMm, '01', '1', '1');
            }
    
            if(subject2 !== ""){
                addCart(bascd2, subject2, YyMm, '01', '1', '1');
            }
        }, timer);
    }

    alert(MSG_MACRO_START);

    document.querySelector(".sub-Right h3").innerHTML = MSG_MACRO_ING + " / 신청 강좌 : " + subject1Name + (subject2Name === "" ? "" : " | " + subject2Name);

    //document.querySelector("#content > div.subPageContainer.container.clear > div.sub-Right > div.nth-child(5) > span:nth-child(1)").innerHTML = "신청 강좌 : " + subject1Name + (subject2Name === "" ? "" : " | " + subject2Name);

    setInterval(() => {
        document.querySelector("#content > div.subPageContainer.container.clear > div.sub-Right > div > span").innerHTML = ("남은 시간(ms) : " + (tgtDate.getTime() - (new Date()).getTime()).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));
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
        <td><a class="macro-button" id="macro_move_cart" href="https://songdo.ysfsmc.or.kr/application/cart.asp">3.장바구니로</a></td>
        `
    );

    document.querySelector("#macro_ready").addEventListener("click", macroReady);
    document.querySelector("#macro_start").addEventListener("click", macroStart);

}) ();

const addCart = (bascd, g_idx, YyMm, target_cd, gubun, qty) => {
     // bascd=03&g_idx=030000019&YyMm=202409&target_cd=01&gubun=1&qty=1&evnMode=add
    const data = {
        bascd: bascd,
        g_idx: g_idx,
        YyMm: YyMm,
        target_cd: target_cd,
        gubun: gubun,
        qty: qty,
        evnMode: "add"
    };

    // https://songdo.ysfsmc.or.kr/_common/ajax/ajax_cart_process.asp
    // https://songdo.ysfsmc.or.kr/_common/ajax/ajax_registerin_process.asp
    fetch('https://songdo.ysfsmc.or.kr/_common/ajax/ajax_registerin_process.asp',{
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
       
        body: new URLSearchParams({
            bascd: data.bascd,
            g_idx: data.g_idx,
            YyMm: data.YyMm,
            target_cd: data.target_cd,
            gubun: data.gubun,
            qty: data.qty,
            evnMode: data.evnMode
        })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Message : ', data);
        // JSON 문자열을 객체로 변환
        //let jsonObject = JSON.parse(data);

        // 첫 번째 객체의 resultMessage 값 가져오기
        let resultMessage = data[0].resultMessage;

        alert(subjects[g_idx] + " : " + resultMessage);
    })
    .catch((error) => {
        console.error('실패 : ', error);
    });
}

// https://songdo.ysfsmc.or.kr/application/applicationView.asp?idx=010000070&target=01&bascd=01
// https://songdo.ysfsmc.or.kr/application/applicationList.asp?bascd=03&scitem=030002