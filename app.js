 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDdh5jo2nV2Ke1gKqvp-sx6M9KpcLhaXVc",
    authDomain: "user-enter-luke.firebaseapp.com",
    databaseURL: "https://user-enter-luke.firebaseio.com",
    storageBucket: "user-enter-luke.appspot.com",
    messagingSenderId: "605457594295"
  };
  firebase.initializeApp(config);


/***************************************************
				GLOBAL VARIABLES
****************************************************/

var p;
var moviesAdded = [];
var data;
let populateHTML;
var currentMovies = [];
let searchData;
var movieID;
let checkID;
let IDArray = [];
let userID;
let currentUserEmail;

/***************************************************
	CALLING INITIAL SHOW MOVIES FUNCTION
****************************************************/

populateInitialPage();
// populateMyMoviesPage();

/***************************************************
				TEMPLATE WORKHORSE FUNCTIONS
****************************************************/
function getjson(url) {
	p = new Promise(function(resolve,reject) {
		$.ajax({
			url: url
		}).done(function(data) {
			resolve(data)
		})
	});
	p.then(function(val) {
		data = val;
		console.log(data)
	})
}

function populatePage(myArray) {
	populateHTML = '';
	for (var i = 0; i < myArray.length; i++) {
  			 populateHTML += `
			<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
  			 <div id="${myArray[i].imdbID}" class="animated fadeInLeft col-xs-1 card topborder">
				<div class="titlebox">
					<h3>${myArray[i].Title}</h3>
				</div>
				<p>${myArray[i].Year}</p>
				<div class="imageBlock">
					<img class="imageStyle"src="${myArray[i].Poster}">
				</div>
				<div class="actorbox">
					<h4>${myArray[i].Actors}</h4>
				</div>
				<div class="plot">
					${myArray[i].Plot}
				</div>
				<div class="bottomBar">
					<div class="viewbar">
						<div class="checkbox">
						  <label>
						    <input class="movie-viewed" type="checkbox" data-toggle="toggle" data-on="Viewed✓" data-off="Not Viewed">
						  </label>
						</div>
					</div>
					<div class="ratings">
					<h4>${myArray[i].imdbRating}
					<img class="star" src="images/star.png"></h4>

					</div>
				</div>
				<div class="addRemove">
					<div class="addButton">
						<button class="add btn btn-primary">add</button>
					</div>
					<div class="deleteButton">
						<button class="remove btn btn-danger">delete</button>
					</div>
				</div>
			</div>
			<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>`;
  	}
}

/***************************************************
				INITIAL HIDES/SHOWS
****************************************************/

$('.linkstyle').mouseover(function() {
	$(this).addClass('pulse');
})
$('.linkstyle').mouseleave(function() {
	$(this).removeClass('pulse');
})

$('#searchView').hide();
$('#myMovies').hide();
$('#savedPopUp').hide()
$('.search').click(function(e) {

firebase.auth().onAuthStateChanged(()=> {

	if (firebase.auth().currentUser !== null) {
		// var email = firebase.auth().currentUser.email
		$(".loginpage").addClass("hidden");
		$(".logout").removeClass("hidden");
	}else {
		$(".loginpage").addClass("hidden");
		$(".logout").addClass("fadeOutUp hidden");
	}
})
	$('#myMovies').hide();
	setTimeout(function() {
		$('.card').hide();
		$('#searchView').show();
	})
});

$('.home').click(function(e) {

	firebase.auth().onAuthStateChanged(()=> {

		if (firebase.auth().currentUser !== null) {
			// var email = firebase.auth().currentUser.email
			$(".loginpage").addClass("hidden");
			$(".logout").removeClass("hidden");
		}else {
			$(".loginpage").addClass("hidden");
			$(".logout").addClass("hidden");
		}
	})


	$('#myMovies').hide();
	$('#searchView').hide('slow');
	$('#homeBody').show();
	populateInitialPage();
});


$('.myMovie').click(function(e) {
	$('.add').hide();
	$('#searchView').hide('slow');
	$('#homeBody').hide();

	firebase.auth().onAuthStateChanged(()=> {
	  if (firebase.auth().currentUser !== null) {
	    // var email = firebase.auth().currentUser.email
	    $(".loginpage").addClass("hidden");
			$(".logout").removeClass("hidden");
			populatePage(moviesAdded)
			$('#myMovies .rowOrient').html(populateHTML);
			$('#myMovies').removeClass('hidden');
			$('#myMovies').show();
	  } else {
	    $(".loginpage").removeClass("hidden");
			$(".logout").addClass("hidden");
			$('#myMovies').hide();
		}
	})
});


/***************************************************
	FUNCTION FOR INITIALLY SHOWING MOVIES
****************************************************/

function populateInitialPage() {
		getjson('https://initial-movies.firebaseio.com/.json')
		p.then(function(data) {
		populatePage(data);
		$('#homeBody .rowOrient').html(populateHTML);
  		});
	}

/***************************************************
	FUNCTION FOR POPULATING MY MOVIES FROM FIREBASE
****************************************************/

function populateMyMoviesPage() {
	getjson('https://user-enter-luke.firebaseio.com/.json')
	p.then(function(data) {
		if (data !== null) {
			console.log(data.users)
			for (var i = 0; i < data.users[userID].movies.length; i++) {
				console.log(data)
				moviesAdded.push(data.users[userID].movies[i])
			}
		}
  	});
}
/***************************************************
		FUNCTIONS FOR STORING USER INFO
****************************************************/

function saveNewUser() {
    var user = {};
    user[userID] = {
                     movies : moviesAdded
                     }
    console.log(user)
    var p2 = new Promise(function(resolve,reject) {
        $.ajax({
            type: 'PATCH',
            url: 'https://user-enter-luke.firebaseio.com/users.json',
            data: JSON.stringify(user),
            success: function(response) {
                $('#savedPopUp').show('slow')
                setTimeout(function() {
                    $('#savedPopUp').hide('slow')
                }, 3000)
            }
        });
    });
}

/***************************************************
	FUNCTIONS FOR MOVIES (ADD/SEARCH/DELETE)
****************************************************/

function returnMovieID(obj, ID) {
	for (var key in data) {
		return obj[ID];
	}
}

function addMovie(e) {
var count = 0

    movieID = returnMovieID(data, 'imdbID');
    console.log(movieID)
    for (var i = 0; i < moviesAdded.length; i++) {
        checkID = returnMovieID(moviesAdded[i], 'imdbID');
        if (checkID === movieID) {
            count += 1;
        }

    }
    if (count === 0) {
        moviesAdded.push(data)
    } else {
        console.log("Did not add movie")
    }
}




function removeMovie(e) {
    // $(e.target.parentElement.parentElement.parentElement).addClass('animated zoomOutLeft')
    var count = 0
    movieID = returnMovieID(data, 'imdbID');

    for (var i = 0; i < moviesAdded.length; i++) {
        checkID = returnMovieID(moviesAdded[i], 'imdbID');
        if (checkID != movieID) {
            count += 1;
        }
        if (checkID === movieID) {
        moviesAdded.splice(count, 1);
        console.log(moviesAdded)
        console.log("removed movie")
        } else {
            console.log("Could not find")
        }
    }
}

function searchMovie() {
	populateHTML = '';
	currentMovies = [];
	var movieTitle = $('.input-sm').val();
	getjson('http://www.omdbapi.com/?t=' + movieTitle);
	p.then(function(val) {		
		searchData = val;
	}).then(function() {
		currentMovies.push(searchData);
		populatePage(currentMovies);
		$('#searchView .rowOrient').html(populateHTML);
	});
};

/*******************************************
			EVENT LISTENERS
********************************************/

$('.searchBtn').click(searchMovie);
$('.save').click(saveNewUser);
$('.movie-viewed').click(function() {
	console.log($('.movie-viewed'))
});
$(document).click(function(e) {
	if (e.target.className === "add btn btn-primary") {
		addMovie();
	}
});
$(document).click(function(e) {
	if (e.target.className === "remove btn btn-danger") {
		removeMovie();
	}
});

/*******************************************
			FIREBASE LOG INFO
********************************************/

 
setTimeout(()=>console.log(firebase.auth().currentUser), 1000)

firebase.auth().onAuthStateChanged(()=> {
  if (firebase.auth().currentUser !== null) {
    // var email = firebase.auth().currentUser.email
    $(".loginpage").addClass("hidden");
	$(".logout").removeClass("hidden");
	userID = firebase.auth().currentUser.uid;
	currentUserEmail = firebase.auth().currentUser.email;
	$('#signOut').text(`Sign Out ${currentUserEmail.slice('@', 4)}`)
	populateMyMoviesPage();
	$(".logout").addClass("hidden");
  }
})






$(".loginpage form").submit((e)=> {

  var email = $('input[type="email"]').val();
  var pass = $('input[type="password"]').val();
  // $('#myMovies').show();
  firebase.auth().signInWithEmailAndPassword(email, pass).then(()=> {
    $('input[type="email"]').val(``);
    $('input[type="password"]').val(``);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var fullError = `${errorCode}: ${errorMessage}`
    alert(fullError)
  });
	console.log(firebase.auth().currentUser)
	e.preventDefault();
});


$("#register").click((e)=> {
  var email = $('input[type="email"]').val();
  var pass = $('input[type="password"]').val();

  firebase.auth().createUserWithEmailAndPassword(email, pass).then(()=> {
    $('input[type="email"]').val(``);
    $('input[type="password"]').val(``);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var fullError = `${errorCode}: ${errorMessage}`
    alert(fullError)
  });
  e.preventDefault();

});


$("#signOut").click((e) => {
  firebase.auth().signOut().then(()=> {
  	moviesAdded = [];
    console.log(firebase.auth().currentUser);
  })
})
