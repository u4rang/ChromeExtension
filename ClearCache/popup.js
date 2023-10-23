// 팝업 페이지에서 도메인 입력란과 삭제 버튼에 대한 이벤트 처리
document.getElementById('deleteButton').addEventListener('click', function() {
    var domain = document.getElementById('domainInput').value;
    
    // 쿠키 삭제
    chrome.cookies.getAll({domain: domain}, function(cookies) {
      for (var i = 0; i < cookies.length; i++) {
        chrome.cookies.remove({url: "https://" + domain + cookies[i].path, name: cookies[i].name});
      }
    });
  
    // 캐시 삭제
    chrome.browsingData.remove({ "origins": ["https://" + domain] }, {
      "cache": true
    }, function() {
      // 삭제가 완료되었을 때 실행할 코드
      console.log(domain + " 도메인의 쿠키와 캐시가 삭제되었습니다.");
      alert(domain + " 도메인의 쿠키와 캐시가 삭제되었습니다.");
    });
});
  