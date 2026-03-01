var MAIN_URL = window.location.origin,
    API_URL = MAIN_URL,
    ASSET_IMG_URL = MAIN_URL + "/img/",
    devStatus = "development",
    urlLogout = "";

function clearUserToken() {
    localStorage.removeItem("userToken");
}

function getUserToken(logout = false) {
    if (logout) return "";
    if (
        localStorage.getItem("userToken") === null ||
        localStorage.getItem("userToken") === undefined
    ) {
        return "";
    }

    return localStorage.getItem("userToken");
}

function getHardwareID() {
    var ubid = require('ubid'),
        hardwareID = '';
    ubid.get(function (error, signatureData) {
        if (error) {
            return hardwareID;
        }

        hardwareID = signatureData.browser.signature.toString() + "";
    });

    return hardwareID;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined
                ? true
                : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

function getAllFunctionName() {
    var allFunctionName = [];
    for (var i in window) {
        if ((typeof window[i]).toString() == "function") {
            allFunctionName.push(window[i].name);
        }
    }

    return allFunctionName;
}
	
function clearAppData(showWarning = true){
    var localStorageKeys	=	Object.keys(localStorage),
        localStorageIdx		=	localStorageKeys.length,
        allFunctionName		=	getAllFunctionName();
    for(var i=0; i<localStorageIdx; i++){
        var keyName			=	localStorageKeys[i];
        if(keyName.substring(0, 5) == "form_"){
            localStorage.removeItem(keyName);
        }
    }

    for(var i=0; i<allFunctionName.length; i++){
        var functionName	=	allFunctionName[i];
        if(functionName.slice(-4) === "Func"){
            window[functionName]	=	null;
        }
    }

    if(showWarning){
        $("#modalWarning").on("show.bs.modal", function () {
            $("#modalWarningBody").html("App data has been cleared");
        });
        $("#modalWarning").modal("show");
    }
}