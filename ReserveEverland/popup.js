(() => {
    const MSG_REST = "초기화 되었습니다.";
    const MSG_SAVE_SUCCESS = "저장에 성공하였습니다.";
    const MSG_SAVE_FAIL = "저장에 실패하였습니다.";

    const init = () => {
        document.getElementById('email').value = localStorage.getItem('Everland_MACRO::email');
        document.getElementById('phone').value = localStorage.getItem('Everland_MACRO::phone');
        document.getElementById('date').value = (!localStorage.getItem('Everland_MACRO::date')) ? "2022-01-01" : localStorage.getItem('Everland_MACRO::date').replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
        document.getElementById('amount').value = localStorage.getItem('Everland_MACRO::amount');
    }

    const save = () => {
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const amount = document.getElementById('amount').value;
        try{
            localStorage.setItem('Everland_MACRO::email', email);
            localStorage.setItem('Everland_MACRO::phone', phone);
            localStorage.setItem('Everland_MACRO::date', date.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$1$2$3'));
            localStorage.setItem('Everland_MACRO::amount', amount);
            setMessage(MSG_SAVE_SUCCESS);
        } catch (error) {
            setMessage(MSG_SAVE_FAIL);
        }
    }

    const reset = () => {
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('date').value = '';
        document.getElementById('amount').value = '';

        localStorage.removeItem('Everland_MACRO::date');
        localStorage.removeItem('Everland_MACRO::amount');

        setMessage(MSG_REST);
    }

    const setMessage = message => {
        document.getElementById('message').innerHTML = message;
    }

    init();
    document.getElementById('button-reset').addEventListener('click', reset);
    document.getElementById('button-save').addEventListener('click', save;
})();