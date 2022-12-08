(() => {
    const MSG_RESET = "초기화 되었습니다.";
    const MSG_SAVE_SUCCESS = "저장에 성공하였습니다.";
    const MSG_SAVE_FAIL = "저장에 실패하였습니다.";

    const init = () => {
        chrome.storage.local.get('Songdo_subject1', function (item) {
            document.getElementById('subject1').value = item.Songdo_subject1.value;
        });
        chrome.storage.local.get('Songdo_subject2', function (item) {
            document.getElementById('subject2').value = item.Songdo_subject2.value;
        });
    }

    const save = () => {
        const subject1 = document.getElementById('subject1').value;
        const subject2 = document.getElementById('subject2').value;
        try{
            chrome.storage.local.set({'Songdo_subject1': {value: subject1}}, function() {
            });
            chrome.storage.local.set({'Songdo_subject2': {value: subject2}}, function() {
            });
            setMessage(MSG_SAVE_SUCCESS);
        }catch(err){
            setMessage(MSG_SAVE_FAIL);
        }
    }

    const reset = () => {
        document.getElementById('subject1').value = '';
        document.getElementById('subject2').value = '';

        chrome.storage.local.remove(['Songdo_subject1'], (result) => {});
        chrome.storage.local.remove(['Songdo_subject2'], (result) => {});

        setMessage(MSG_RESET);
    }

    const setMessage = message => {
        document.getElementById('message').innerHTML = message;
    }

    init();
    document.getElementById('button-reset').addEventListener('click', reset);
    document.getElementById('button-save').addEventListener('click', save);
}) ();