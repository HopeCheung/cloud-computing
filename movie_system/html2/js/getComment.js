function getComment (movieID, callback) {
    // console.log("I am getting the movieName");
    // console.log(movieID);
    axios.get('https://jt3d9wpum4.execute-api.us-east-1.amazonaws.com/dev/comment?movie=' + movieID, {
    })
        .then(function (response) {
            callback(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function handleComment (data) {
    // console.log("I have got the data");
    // console.log(data);
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
            attitude: commentArray[i].attitude.S,
            rating: commentArray[i].rating.S
        }
    }
    document.getElementById("commentNum").innerHTML = `${commentNum} comment`;
    changeHTML(commentInfo);   
}

function changeHTML (info) {
    console.log('info is ' + JSON.stringify(info));
    var totalRating = 0;
    console.log('sorted before' + JSON.stringify(info));
    info.sort(function (a, b) {
        if (a["time"] < b["time"])
            return -1;
        if (a["time"] > b["time"])
            return 1;
        return 0;
    });
    console.log('sorted after' + JSON.stringify(info));
    for (var i = 0; i < info.length; i++) {
        const item = info[i];
        const {movie, username, comment, time, translation, attitude, rating} = item;
        totalRating += parseFloat(rating);
        // console.log('---------------------');
        // console.log(attitude);
        var img = '';  
        if (attitude == 'NEGATIVE'){
            img = 'images/unhappy.jpg';
        } else if (attitude == 'POSITIVE'){
            img = 'images/happy.jpg';
        } else {
            img = 'images/neu.jpg';
        } 
        console.log(img);
        $('.three-com').append(` 
        <div class="tom-gid" id="translate">
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
                <p class="lorem">${comment}</p>
            </div>
            <div class="clearfix"></div>
        </div>
`);
        
    }
    console.log('the rating of the movie');
    var rating = totalRating/info.length;
    document.getElementById("rating").innerHTML =   `The rating is  ${rating}`;


}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

getComment(getUrlVars()["movie"], handleComment);

function doGetComment(){
    $(".tom-gid").remove();
    getComment(getUrlVars()["movie"], handleComment);
}