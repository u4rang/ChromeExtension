chrome.runtime.onMessage.addListener(function(request, sender, sendRespone){
    if(request.action === "GET_MACRO"){
        sendRespone({
            'email' : localStorage.getItem('Everland_MACRO::email'),
            'phone' : localStorage.getItem('Everland_MACRO::phone'),
            'date' : localStorage.getItem('Everland_MACRO::date'),
            'amount' : localStorage.getItem('Everland_MACRO::amount')            
        });
    }
});