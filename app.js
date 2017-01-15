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
let watchedMovie;

/***************************************************
	CALLING INITIAL SHOW MOVIES FUNCTION
****************************************************/

populateInitialPage();

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
						<button class="remove btn btn-danger">remove</button>
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

$('.save').hide('slow');
$('#searchView').hide();
$('#myMovies').hide();
$('#savedPopUp').hide()
$('#nothing').hide()
$('.search').click(function(e) {

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
	setTimeout(function() {
		$('.card').hide();
		$('#searchView').show();
	})
});

$('.home').click(function(e) {

	firebase.auth().onAuthStateChanged(()=> {
		if (firebase.auth().currentUser !== null) {
			$(".loginpage").addClass("hidden");
			$(".logout").removeClass("hidden");
		} else {
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
	$('#searchView').hide('slow');
	$('#homeBody').hide();

	firebase.auth().onAuthStateChanged(()=> {
	  if (firebase.auth().currentUser !== null) {
	    // var email = firebase.auth().currentUser.email
	    $(".loginpage").addClass("hidden");
			$(".logout").removeClass("hidden");
			populatePage(moviesAdded)
			$('#myMovies .rowOrient').html(populateHTML);
			// $('#myMovies').removeClass('hidden');
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
	getjson('https://user-enter-luke.firebaseio.com/users.json')
	p.then(function(data) {
		moviesAdded = [];
		if (data !== null) {
			for (var i = 0; i < data[userID].movies.length; i++) {
				moviesAdded.push(data[userID].movies[i])
			}
		}
	$(document).click(function(e) {
		if (e.target.className === "add btn btn-primary") {
			addMovie(e);
		}
	});
	$(document).click(function(e) {
		if (e.target.className === "remove btn btn-danger") {
			removeMovie(e);
		}
	});

	});
}
/***************************************************
		FUNCTIONS FOR STORING USER INFO
****************************************************/

function saveNewUser() {
    var user = {};
    user = {
            movies : moviesAdded,
            email: currentUserEmail
            }
    console.log(user)
    var p2 = new Promise(function(resolve,reject) {
        $.ajax({
            type: 'PUT',
            url: `https://user-enter-luke.firebaseio.com/users/${userID}.json`,
            data: JSON.stringify(user),
            success: function(response) {
            	$('.save').hide('slow');
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
	getjson('http://www.omdbapi.com/?i=' + e.target.offsetParent.id);
    p.then(function(data) {
    	console.log(data)
    	var count = 0
	    movieID = returnMovieID(data, 'imdbID');
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
    })
}

function removeMovie(e) {
    getjson('http://www.omdbapi.com/?i=' + e.target.offsetParent.id)
    console.log(e.target.offsetParent.id)
    p.then(function(data) {
    	data = data
    }).then( function() {
	    console.log(data);	    
	    console.log(moviesAdded.indexOf(data));
	    var count = 0
	    movieID = returnMovieID(data, 'imdbID');
	    $(e.target.offsetParent).addClass('animated zoomOutLeft');
	    setTimeout(function() {
	    $(e.target.offsetParent).hide();
	    },1500)
	    for (var i = 0; i < moviesAdded.length; i++) {
	        checkID = returnMovieID(moviesAdded[i], 'imdbID');
	        if (checkID != movieID) {
	            count += 1;
	        }
	        if (checkID === movieID) {
	        moviesAdded.splice(count, 1);
	        console.log(moviesAdded);
	        console.log("removed movie");
	        } else {
	      		
	        }
	    }
	})
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
	}).catch(function(error) {
		populateHTML = 'Could not find movie'
		$('#searchView .rowOrient').html(populateHTML);
		console.log(error + 'hey')
	});
};

/*******************************************
			EVENT LISTENERS
********************************************/

$('.searchBtn').click(searchMovie);
$('.save').click(saveNewUser);
$('.movie-viewed').click(function() {
	console.log($('.movie-viewed'));
});

$(document).click(function(e) {
	if (e.target.className === "add btn btn-primary") {
		addMovie(e);
		$('.save').show();
	} else if (e.target.className === "btn btn-primary toggle-on") {
		watchedMovie = false;
		console.log(watchedMovie)
	}
});

$(document).click(function(e) {
	if (e.target.className === "remove btn btn-danger") {
		removeMovie(e);
		$('.save').show();
	} else if (e.target.className === "btn btn-default active toggle-off") {
		watchedMovie = true;
		console.log(watchedMovie)
	}
});

$("#signOut").click((e) => {
  firebase.auth().signOut().then(()=> {
  	$(".logout").addClass('hidden');
  })
})

$('.plot').mouseover(function(e){
	console.log(e)
	$(this).addClass('plotMO');
})

$('.plot').mouseleave(function(e){
	$(this).removeClass('plotMO');
})

/*******************************************
			FIREBASE LOG INFO
********************************************/

firebase.auth().onAuthStateChanged(()=> {
  if (firebase.auth().currentUser !== null) {
    $(".loginpage").addClass("hidden");
	$(".logout").removeClass("hidden");
	userID = firebase.auth().currentUser.uid;
	currentUserEmail = firebase.auth().currentUser.email;
	$('#signOut').text(`Sign Out ${currentUserEmail.slice(0, currentUserEmail.indexOf('@'))}`)
	$('#greet').text(`Welcome ${currentUserEmail.slice(0, currentUserEmail.indexOf('@'))}!`)
	populateMyMoviesPage()
	p.then(() => {
		populatePage(moviesAdded)
		$('#myMovies .rowOrient').html(populateHTML);
		// $('#myMovies').show()
	});
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
	e.preventDefault();
});


$("#register").click((e)=> {
  var email = $('input[type="email"]').val();
  var pass = $('input[type="password"]').val();

  firebase.auth().createUserWithEmailAndPassword(email, pass).then(()=> {
    $('input[type="email"]').val(``);
    $('input[type="password"]').val(``);
    $('#searchView').show();
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var fullError = `${errorCode}: ${errorMessage}`
    alert(fullError)
  });
  e.preventDefault();
});
