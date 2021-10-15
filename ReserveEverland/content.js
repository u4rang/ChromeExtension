const MAIN_URL = "http://70.2.140.170:9089/htmlEverland/user/frame.jsp";
const LOGIN_PAGE_URI = "http://70.2.140.170:9089/htmlEverland/index.jsp";

const MSG_NEED_LOGIN = "로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?";
const MSG_MACRO_READY = "메크로를 준비합니다.";
const MSG_MACRO_START = "메크로를 시작합니다.";
const MSG_MACRO_ING = "메크로 적용 중...";
const MSG_MACRO_STOP = "메크로를 종료합니다.";

const isLogin = () => !!window.frames[1].document.querySelectorAll("table[name='main_member'] td").length

const macroStop = () => {
}

const setEscapeEvent = () => {
    window.addEventListener("keydown", e=> {
        if(e.key === "Escape"){
            console.log('keydown ESC');
            macroStop();
        }
    });
};


const macroReady = () => {
    chrome.runtime.sendMessage({action:"GET_MACRO"}, function(respone){
        localStorage.setItem('Everland_MACRO::email', respone.email);
        localStorage.setItem('Everland_MACRO::date', respone.date);
        localStorage.setItem('Everland_MACRO::phone', respone.phone);
        localStorage.setItem('Everland_MACRO::amount', respone.amount);

    });

    alert(MSG_MACRO_READY);
}

const sleep = (ms) => {
    return new Promise((r) => setTimeout(r, ms));
}

const macroStart = () => {
    setEscapeEvent();
    
    fetch("http://70.2.140.170:9089/htmlEverland/user/ajax_time.jsp")
        .then((response) => response.json())
        .then((data) => {
            var year = Number(data.severDate.substring(0,4));
            var month = Number(data.severDate.substring(4,6));
            var day = Number(data.severDate.substring(6,8));
            var time = Number(data.severTime.substring(0,2));
            var minute = Number(data.severTime.substring(2,4));
            var second = Number(data.severTime.substring(4,6));

            var serverDate = new Date(year, month-1, day, time, minute, second);    // 서버 시간의 Date 객체 생성
            var tgtDate = new Date(year, month-1, day, 9, 0, 00);                   // 매일 09시 사이트 오픈

            var timer = tgtDate.getTime() - serverDate.getTime();                   // 서버 시간과 목표 시간의 차이 계산

            console.log(tgtDate.getTime() + " / " + serverDate.getTime() + " / " + timer);

            if(timer < 0){      // Timer가 0보다 작으면 종료
                return;
            }else{
                setTimeout(function(){
                    var form = document.createElement('form');
                    form.setAttribute('method', 'post');
                    form.setAttribute('action', '/htmlEverland/user/apply_act.jsp');
                    form.setAttribute('target', 'hiddenFrame');

                    var hiddendField = document.createElement('input');
                    hiddendField.setAttribute('type', 'hidden');
                    hiddendField.setAttribute('name', 'mode');
                    hiddendField.setAttribute('value', 'INSERT_APPLY');
                    form.appendChild(hiddendField);

                    var hiddendField = document.createElement('input');
                    hiddendField.setAttribute('type', 'hidden');
                    hiddendField.setAttribute('name', 'email');
                    hiddendField.setAttribute('value', localStorage.getItem('Everland_MACRO::email'));
                    form.appendChild(hiddendField);

                    var hiddendField = document.createElement('input');
                    hiddendField.setAttribute('type', 'hidden');
                    hiddendField.setAttribute('name', 'tel_no');
                    hiddendField.setAttribute('value', localStorage.getItem('Everland_MACRO::phone'));
                    form.appendChild(hiddendField);

                    var hiddendField = document.createElement('input');
                    hiddendField.setAttribute('type', 'hidden');
                    hiddendField.setAttribute('name', 'use_dt');
                    hiddendField.setAttribute('value', localStorage.getItem('Everland_MACRO::date'));
                    form.appendChild(hiddendField);

                    var hiddendField = document.createElement('input');
                    hiddendField.setAttribute('type', 'hidden');
                    hiddendField.setAttribute('name', 't_cnt');
                    hiddendField.setAttribute('value', localStorage.getItem('Everland_MACRO::amount'));
                    form.appendChild(hiddendField);

                    document.body.appendChild(form);
                    form.submit();
                }, timer);

                alert(MSG_MACRO_START);

                window.frames[1].document.querySelector("table.main_title > tbody > tr > td:nth-child(1)").innerHTML = MSG_MACRO_ING;
                window.frames[1].document.querySelector("table:nth-child(3) > tbody > tr:nth-child(1) > td.txt_black").innerHTML = '신청일 : ' + localStorage.getItem('Everland_MACRO::date').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3') + ' / 신청장수 : ' + localStorage.getItem('Everland_MACRO::amount');

                setInterval(() => {
                    window.frames[1].document.querySelector("teable.main_title > tbody > tr > td:nth-child(2)").innerHTML = ("남은 시간(ms) : " + (tgtDate.getTime() - (new Date()).getTime()).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","));

                }, 1000);
            }
        });
}

chrome.runtime.onMessage.addEventListener(
    function(request, sender, sendRespone){
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if(request.greeting == "hello"){
            console.log("Path : " + window.location.pathname);
        }
    }
);

(() => {
    if(!location.href.startsWith(MAIN_URL)){
        return;
    }

    setEscapeEvent();

    windows.frames[1].document.querySelector(".btn").insertAdjacentHTML(
        "afterend",
        `
        <td class="btn"><a class="EVERLAND_MACRO_BTN" id="macro_ready" href="#">메크로준비</a></td>
        <td class="btn"><a class="EVERLAND_MACRO_BTN" id="macro_start" href="#">메크로시작</a></td>
        `
    );

    windows.frames[1].document.querySelector("#myform").insertAdjacentHTML(
        "afterend",
        `
        <iframe name="hiddenFrame" src="" frameborder="0" width="0" height="0" scrolling="no"></iframe>
        `
    );

    windows.frames[1].document.querySelector("#macro_ready").addEventListener("click", macroReady);
    windows.frames[1].document.querySelector("#macro_start").addEventListener("click", macroStart);
})();