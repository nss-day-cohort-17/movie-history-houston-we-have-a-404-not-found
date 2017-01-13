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

/***************************************************
	CALLING INITIAL SHOW MOVIES FUNCTION
****************************************************/

populateInitialPage();
populateMyMoviesPage();

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
		$('.add').click(addMovie);
		$('.remove').click(removeMovie);
		// $('.example').barrating('set', Math.round(data.imdbRating));
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
						    <input type="checkbox" data-toggle="toggle" data-on="Viewed✓" data-off="Not Viewed">
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
						<button class="remove btn btn-primary">delete</button>
					</div>
				</div>
			</div>
			<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>`;
  	}
  	$('.add').click(addMovie);
		$('.remove').click(removeMovie);
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
	}else {
		$(".loginpage").addClass("hidden");
		$(".logout").addClass("fadeOutUp hidden");
	}
})

	// $('.add').hide();
	// $('.card').addClass('animated')
	// $('.card').show();
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
		}else {
			$(".loginpage").addClass("hidden");
			$(".logout").addClass(" fadeOutUp hidden");
		}
	})


	$('#myMovies').hide();
	$('#searchView').hide('slow');
	$('#homeBody').show();
	populateInitialPage();
});

$('.myMovie').click(function(e) {

	$('.add').hide();
	$('#myMovies').hide();
	$('#searchView').hide('slow');
	$('#homeBody').hide();

	firebase.auth().onAuthStateChanged(()=> {
	  if (firebase.auth().currentUser !== null) {
	    // var email = firebase.auth().currentUser.email
	    $(".loginpage").addClass("hidden");
			$(".logout").removeClass("hidden");

			$('#myMovies').show();
			populatePage(moviesAdded);
			$('#myMovies .rowOrient').html(populateHTML);

	  }else {
	    $(".loginpage").removeClass("hidden");
			$(".logout").addClass("hidden");
			$('#myMovies').hide();


		}
	})


	//
	// $('.add').hide();
	// $('#searchView').hide('slow');
	// $('#homeBody').hide();
	// $('#myMovies').show();
	// populatePage(moviesAdded);
	// $('#myMovies .rowOrient').html(populateHTML);
});

$('.loginpage').hide();

/***************************************************
	FUNCTION FOR INITIALLY SHOWING MOVIES
****************************************************/

function populateInitialPage() {
		getjson('https://initial-movies.firebaseio.com/.json')
		p.then(function(data) {
		populatePage(data);
		$('#homeBody .rowOrient').html(populateHTML);
  		});
  		$('button.add').click(addMovie);
		$('button.remove').click(removeMovie);
	}

/***************************************************
	FUNCTION FOR POPULATING MY MOVIES FROM FIREBASE
****************************************************/

function populateMyMoviesPage() {
	getjson('https://user-enter-luke.firebaseio.com/.json')
	p.then(function(data) {
		if (data !== null) {
			console.log(data.users.movies.movies)
			for (var i = 0; i < data.users.movies.movies.length; i++) {
				moviesAdded.push(data.users.movies.movies[i])
			}
		}
  	});
  	$('button.add').click(addMovie);
	$('button.remove').click(removeMovie);
}

/***************************************************
		FUNCTIONS FOR STORING USER INFO
****************************************************/

function saveNewUser() {
	var user = {};
	// var userName = $('.input').val();
	var userName = 'movies'
	user[userName] = {
					 // user : 
					 movies : moviesAdded
					 }
	console.log(user)
	var p2 = new Promise(function(resolve,reject) {
		$.ajax({
			type: 'PUT',
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

// function saveMovieInfo() {
// 	var user = {};
// 	var movies = 'movies';
// 	user[movies] = moviesAdded
// 	var p2 = new Promise(function(resolve,reject) {
// 		$.ajax({
// 			type: 'POST',
// 			url: 'https://user-enter-luke.firebaseio.com/users.json',
// 			data: JSON.stringify(user),
// 			success: function(response) {
// 				$('#savedPopUp').show('slow')
// 				setTimeout(function() {
// 					$('#savedPopUp').hide('slow');
// 				}, 5000)
// 			}
// 		});
// 	});
// }


// function getUserInfo() {
// 	var userInput = $('.input').val();
// 	var myMoviesHTML = ''
// 	$.ajax({
// 		type: 'GET',
// 		url: 'https://user-enter-luke.firebaseio.com/users/' + userInput + '.json',
// 		success: function(response) {
// 			for (var i = 0; i < response.movies.length; i++) {
// 				if (moviesAdded.includes(response.movies[i]) === false) {
// 					moviesAdded.push(response.movies[i]);
// 					myMoviesHTML += `<img class="animated rotateInDownLeft" src="${moviesAdded[i].Poster}">`;
// 					console.log(moviesAdded)
// 				}
// 			}
// 			$("#area").html(myMoviesHTML);
// 		}
// 	});
// }

/***************************************************
	FUNCTIONS FOR MOVIES (ADD/SEARCH/DELETE)
****************************************************/

function returnMovieID(obj, ID) {
	for (var key in data) {
		return obj[ID];
	}
}

function addMovie(e) {
	console.log(e.target.parentElement.parentElement.parentElement)
	movieID = returnMovieID(data, 'imdbID');
	for (var i = 0; i < moviesAdded.length; i++) {
		checkID = returnMovieID(moviesAdded[i], 'imdbID');
		if (checkID !== movieID) {
			IDArray.push(checkID)
			console.log(movieID)
		} else {
			console.log('break')
		}
	}
	if (IDArray.includes(movieID) === false) {
		IDArray.push(movieID)
		moviesAdded.push(data)
		IDArray = [];
	} else {
		console.log('hello')
	}
}

function removeMovie(e) {
	$(e.target.parentElement.parentElement.parentElement).addClass('animated zoomOutLeft')
	console.log(data)
	var index = moviesAdded.indexOf(data)
	console.log(index)
	if ($.inArray(searchData, moviesAdded) !== -1) {
		var index = moviesAdded.indexOf(data);
		moviesAdded.splice(index, 1);
		// console.log(moviesAdded)
		console.log($(this))
	} else {
		// console.log(index)
	}


// function checkIfAdded() {
// 	if ($.inArray(data, moviesAdded) !== -1) {

// 	}
// }

function searchMovie() {
	populateHTML = '';
	currentMovies = [];
	var movieTitle = $('.input-sm').val();
	getjson('http://www.omdbapi.com/?t=' + movieTitle);
	p.then(function(val) {		searchData = val;
	}).then(function() {
		currentMovies.push(searchData);
		// checkIfAdded();
		populatePage(currentMovies);
		$('#searchView .rowOrient').html(populateHTML);
		$('button.add').click(addMovie);
		$('button.remove').click(removeMovie);
	});
};

/*******************************************
			EVENT LISTENERS
********************************************/

// $('.sign-in').click(getUserInfo);

$('.searchBtn').click(searchMovie);

$('.save').click(saveNewUser);

// $('.save').click(function() {
// 	saveMovieInfo();
// })


/*******************************************
			FIREBASE LOG INFO
********************************************/

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDdh5jo2nV2Ke1gKqvp-sx6M9KpcLhaXVc",
    authDomain: "user-enter-luke.firebaseapp.com",
    databaseURL: "https://user-enter-luke.firebaseio.com",
    storageBucket: "user-enter-luke.appspot.com",
    messagingSenderId: "605457594295"
  };
  firebase.initializeApp(config);

setTimeout(()=>console.log(firebase.auth().currentUser), 1000)




// firebase.auth().onAuthStateChanged(()=> {
//   if (firebase.auth().currentUser !== null) {
//     // var email = firebase.auth().currentUser.email
//     $(".loginpage").addClass("hidden");
// 		$(".logout").removeClass("hidden");
//   }else {
//     $(".loginpage").removeClass("hidden");
// 		$(".logout").addClass("hidden");
//   }
// })


$(".loginpage form").submit((e)=> {

  var email = $('input[type="email"]').val();
  var pass = $('input[type="password"]').val();

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



//
$("#signOut").click((e) => {
  firebase.auth().signOut().then(()=> {
    console.log(firebase.auth().currentUser);

  })
})
