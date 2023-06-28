const MAIN_URI = "https://songdo.ysfsmc.or.kr/application/applicationList.asp";

const MSG_MACRO_READY = "메크로를 준비합니다.";
const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_NOT_START = "9시 전 메크로를 시작해야합니다.\n메크로를 종료합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";
const MSG_MACRO_STOP = "메크로를 종료합니다.";

let subjects = {
    "010000005" : "수영/화목/중급/06시",
    "010000049" : "수영/화목/상급/06시",
    "010000050" : "수영/화목/상급/07시",
    "010000001" : "수영/월수금/고급/06시",
    "030000032" : "베드민턴/월수금/06시",
    "010000014" : "아쿠아로빅/화목/12시",
}

let subject1 = "";
let subject2 = "";
let subject1Name = "";
let subject2Name = "";

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
    chrome.storage.local.get('Songdo_subject1', function(item){
        subject1 = item.Songdo_subject1.value;
        subject1Name = subjects[subject1];
    });

    chrome.storage.local.get('Songdo_subject2', function(item){
        subject2 = item.Songdo_subject2.value;
        subject2Name = subjects[subject2];
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

    let serverDate = new Date(year, month - 1, date, hours, minutes, seconds, milliseconds);    // 서버 시간 Date 객체 생성
    let tgtDate = new Date(year, month - 1, date, 08, 00, 00);                                  // 09시 사이트 오픈

    let timer = tgtDate.getTime() - serverDate.getTime();                                       // 서버 시간과 목표 시간의 차이 계산

    console.log(tgtDate.getTime() + " / " +serverDate.getTime() + " / " + timer);

    if(timer < 0) { // 타이머가 0 보다 작으면 함수를 종료
        if(subject1 !== ""){
            addCart(subject1, '1', '01');
        }

        if(subject2 !== ""){
            addCart(subject2, '1', '01');
        }

    }else {
        setTimeout(function() {
            if(subject1 !== ""){
                addCart(subject1, '1', '01');
            }
    
            if(subject2 !== ""){
                addCart(subject2, '1', '01');
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
        <td><a class="macro-button" id="macro_ready" href="#">메크로준비</a></td>
        <td><a class="macro-button" id="macro_start" href="#">메크로시작</a></td>
        <td><a class="macro-button" id="macro_move_cart" href="https://songdo.ysfsmc.or.kr/application/cart.asp">장바구니로</a></td>
        `
    );

    document.querySelector("#macro_ready").addEventListener("click", macroReady);
    document.querySelector("#macro_start").addEventListener("click", macroStart);

}) ();

const addCart = (g_idx, qty, target_cd) => {
    const data = {
        evnMode: "add",
        g_idx: g_idx,
        qty: qty,
        target_cd: target_cd
    };

    fetch('https://songdo.ysfsmc.or.kr/_common/ajax/ajax_cart_process.asp',{
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest"
        },
        body: new URLSearchParams({
            evnMode: data.evnMode,
            g_idx: data.g_idx,
            qty: data.qty,
            target_cd: data.target_cd
        })
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('성공 : ', data);
        if(data == true){
            alert(subjects[g_idx] + " 가 추가되었습니다.");
        }else {
            alert(subjects[g_idx] + " 가 이미 장바구니에 담겨 있습니다.");
        }
    })
    .catch((error) => {
        console.error('실패 : ', error);
    });
}

// https://songdo.ysfsmc.or.kr/application/applicationList.asp?bascd=03&scitem=030002