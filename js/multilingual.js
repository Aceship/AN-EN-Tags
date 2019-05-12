let langs = ["cn", "en"];

function urlParam(sParam, defaultVal = undefined) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
    return defaultVal;
}

function getLang() {
    return urlParam("lang", "en");
}

let _lang = getLang();

function showCurrentLang() {
    $("." + _lang).show();
};