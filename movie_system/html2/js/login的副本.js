console.log('starting the login script');
function logout(){
    console.log('---------code-------');
    console.log(getUrlVars()["code"]);
    const code = getUrlVars()["code"];
    if (code == undefined){

    } else {
        document.getElementById("login").innerHTML = 'Log Out';
        document.getElementById("login").href = 'https://s3.amazonaws.com/coms6998-final/html2/index.html';
        localStorage.clear();
        // hard code
    }

}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

logout();