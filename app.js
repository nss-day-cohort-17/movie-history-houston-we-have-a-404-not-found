/***************************************************
				GLOBAL VARIABLES
****************************************************/
var p;
var moviesAdded = [];
var data;
let populateHTML;
var currentMovies = [];
let searchData;

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
		// $('.example').barrating('set', Math.round(data.imdbRating));
	})
}

function populatePage(myArray) {
	populateHTML = '';
	for (var i = 0; i < myArray.length; i++) {
  			 populateHTML += `
			<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
  			 <div class="animated fadeInLeft col-xs-1 card topborder">
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
				<div id="plot"> 
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
					<div class="br-wrapper ratings br-theme-bootstrap-stars">
 						 <select class="example">
						  	<option value=""></option>
						    <option value="1">1</option>
						    <option value="2">2</option>
						    <option value="3">3</option>
						    <option value="4">4</option>
						    <option value="5">5</option>
						  </select>
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
}

/***************************************************
				INITIAL HIDES/SHOWS
****************************************************/

$('#searchView').hide();
$('#myMovies').hide();
$('#savedPopUp').hide()
$('.search').click(function(e) {
	// $('.card').addClass('animated')
	// $('.card').show();
	$('#myMovies').hide();
	setTimeout(function() {
		$('.card').hide();
		$('#searchView').show('slow');
	})
});

$('.home').click(function(e) {
	$('#myMovies').hide();
	$('#searchView').hide('slow');
	$('#homeBody').show();
	populateInitialPage();
});

$('.myMovie').click(function(e) {

	$('#searchView').hide('slow');
	$('#homeBody').hide();
	$('#myMovies').show();
	populatePage(moviesAdded);
	$('#myMovies .rowOrient').html(populateHTML);
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
			console.log(data.users.movies.movies)
			for (var i = 0; i < data.users.movies.movies.length; i++) {
				moviesAdded.push(data.users.movies.movies[i])
			}
		}
  	});
}

/***************************************************
		FUNCTIONS FOR STORING USER INFO
****************************************************/

function saveNewUser() {
	var user = {};
	// var userName = $('.input').val();
	var userName = 'movies'
	user[userName] = {
					 movies : moviesAdded
					 }
	console.log(user)
	var p2 = new Promise(function(resolve,reject) {
		$.ajax({
			type: 'PUT',
			url: 'https://user-enter-luke.firebaseio.com/users.json',
			data: JSON.stringify(user),
			success: function(response) {
				console.log('success!!')
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

function addMovie() {
	// if ($.inArray(data, moviesAdded) < 0) {
		moviesAdded.push(data);
		console.log(moviesAdded)
	// } else {
	// 	console.log(data)
	// }
}

function removeMovie() {
	var index = moviesAdded.indexOf(data);
	console.log(index)
	// if ($.inArray(data, moviesAdded) !== -1) {
		moviesAdded.splice(index, 1);
		console.log(moviesAdded)
	// } else {

	// }
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
		$('button.add').click(addMovie);
		$('button.remove').click(removeMovie);

	});
};

/*******************************************
		JQUERY STAR RATING CODE
********************************************/
$('.example').barrating('show', {
  theme: 'my-awesome-theme',
  onSelect: function(value, text, event) {
    if (typeof(event) !== 'undefined') {

    } else {

    }
  }
});
/*******************************************
			EVENT LISTENERS
********************************************/

$('button.add').click(addMovie);

$('button.remove').click(removeMovie);

// $('.sign-in').click(getUserInfo);

$('.searchBtn').click(searchMovie);

$('.save').click(saveNewUser);

// $('.save').click(function() {
// 	saveMovieInfo();
// })
