    // Chrome Extension 기능 중에 tabs 와 관련된 기능 중에  
    // Content Page를 대상으로 코드 실행한다.
function countWord (search){
    chrome.tabs.executeScript({
        code : 'document.querySelector(\'body\').innerText'
    }, function(result){
        // code 가 실행 된 후에 이 함수를 호출
        // result 변수에 code의 결과를 전달
        
        var bodyText = result[0]
        var bodyNum = bodyText.split(' ').length;
        var myNum = bodyText.match(new RegExp('\\b(' + search + ')\\b', 'gi')).length;
        //alert(myNum + '/' + bodyNum + '(' + (myNum / bodyNum * 100) + '%)');
    
        // Percent 결과 자리수 수정
        var percent = myNum / bodyNum * 100;
        percent = percent.toFixed(1);
    
        // id가 result 인 태그에 결과 추가
        document.querySelector('#result').innerText = (myNum + '/' + bodyNum + '(' + percent + '%)');
    });
}

// Chrome Storage 에 저장된 값 가져오기
chrome.storage.sync.get(function(data){
    // searchKeywords
    document.querySelector('#search').value = data.searchKeywords;

    // 분석해서 결과 #result 에 저장
    countWord(data.searchKeywords);
});

// Content Page의 search 에 입력된 값이 변경되었을 '때'
document.querySelector('#search').addEventListener('change', function(){
    // Content Page에 몇개의 단어가 있는지 계산
    var search = document.querySelector('#search').value;


    // Chrome Storage 에 입력값을 저장
    chrome.storage.sync.set({
        searchKeywords : search
    });
    // chrome.storage.sync.get(function(data){console.log(data)});

    countWord(search);
});

// Popup Page