console.log('starting the login script');
function logout(){
    if (localStorage.username == undefined){
        console.log('you do not log in')
    } else {
        console.log('You are loged in');
        document.getElementById("login").innerHTML = 'Log Out';
        document.getElementById("login").setAttribute("onclick", "clearStorage()");
        document.getElementById("login").href = 'https://s3.amazonaws.com/coms6998-final/html2/index.html';
        // hard code
    }
}

logout();

setTimeout(function () { logout(); }, 1500);
function clearStorage() {
    localStorage.clear();
    location.reload();
}