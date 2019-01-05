function translate(movieID, callback) {
    console.log("I am getting the movieName");
    console.log(movieID);
    $(".tom-gid").remove();
    axios.get('https://jt3d9wpum4.execute-api.us-east-1.amazonaws.com/dev/comment?movie=' + movieID, {
    })
        .then(function (response) {
            callback(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function handleTranslateComment(data) {
    console.log("I have got the data");
    console.log(data);
    var commentNum = data.data.body.data.Count;
    var commentArray = data.data.body.data.Items;
    var commentInfo = [];
    console.log(commentNum);
    for (i = 0; i < commentNum; i++) {
        // console.log(commentArray[i].ID.S);
        commentInfo[i] = {
            movie: commentArray[i].movieID.S,
            username: commentArray[i].username.S,
            comment: commentArray[i].comment.S,
            time: commentArray[i].time.S,
            translation: commentArray[i].translation.S,
            attitude: commentArray[i].attitude.S
        }
    }
    document.getElementById("commentNum").innerHTML = `${commentNum} comment`;
    getTranslate(commentInfo);
}

function getTranslate(info) {
    console.log('info is ' + info);
    info.sort(function (a, b) {
        if (a["time"] < b["time"])
            return -1;
        if (a["time"] > b["time"])
            return 1;
        return 0;
    });
    for (var i = 0; i < info.length; i++) {
        const item = info[i];
        const { movie, username, comment, time, translation, attitude } = item;
        var img = '';
        if (attitude == 'NEGATIVE') {
            img = 'images/unhappy.jpg';
        } else if (attitude == 'POSITIVE') {
            img = 'images/happy.jpg';
        } else {
            img = 'images/neu.jpg';
        }
        $('.three-com').append(` 
        <div class="tom-gid">
            <div class="tom">
				<img src=${img} alt=" ">
		    </div>
            <div class="tom-right">
                <div class="Hardy">
                    <h4><a href="#">${username}</a></h4>
                    <p><label>${time}</label></p>
                </div>
                <div class="reply">

                </div>
                <div class="clearfix"></div>
                <p class="lorem">${translation}</p>
            </div>
            <div class="clearfix"></div>
        </div>
`);

    }

}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function doTranslate () {
    translate(getUrlVars()["movie"], handleTranslateComment);
}
