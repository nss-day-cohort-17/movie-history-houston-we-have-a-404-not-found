/***************************************************
				GLOBAL VARIABLES
****************************************************/
var p;
var moviesAdded = [];
var data;
var populateHTML = '';
var currentMovies = [];

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
		// $('.example').barrating('set', Math.round(data.imdbRating));
	})
}

function populatePage(myArray) {
	populateHTML = '';
	for (var i = 0; i < myArray.length; i++) {
			console.log(myArray[i].Title)
  			 populateHTML += `<div class="animated zoomInUp col-xs-1 card topborder">
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
			</div>`;
			console.log(myArray)
			console.log(data)
  		}
}

/***************************************************
				INITIAL HIDES/SHOWS
****************************************************/

$('#searchView').hide();
$('#myMovies').hide();

$('.search').click(function(e) {
	// $('.card').addClass('animated')
	// $('.card').show();
	setTimeout(function() {
		$('.card').hide();
		$('#searchView').show('slow');
	})
});

$('.home').click(function(e) {
	$('#myMovies').hide();
	$('#searchView').hide('slow');
	populateInitialPage();
	$('#homeBody').show();
});

$('.myMovie').click(function(e) {
	$('.zoomInUp').addClass('zoomOutUp')
	$('#searchView').hide('slow');
	setTimeout(function() {
		$('#homeBody').hide();
	// $('#searchView').hide('slow');
	$('#myMovies').show();
	populatePage(moviesAdded);
	}, 2000)
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
		FUNCTIONS FOR STORING USER INFO
****************************************************/

// function saveNewUser() {
// 	var user = {};
// 	var userName = $('.input').val();
// 	user[userName] = {
// 					 movies : moviesAdded
// 					 }
// 	console.log(user)
// 	var p2 = new Promise(function(resolve,reject) {
// 		$.ajax({
// 			type: 'PUT',
// 			url: 'https://user-enter-luke.firebaseio.com/users.json',
// 			data: JSON.stringify(user),
// 			success: function(response) {
// 				console.log('success!!')
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
		// currentMovies.push(data);
		// console.log(currentMovies);
		// populatePage(val);
		// console.log(populateHTML)
		$('#searchView .rowOrient').html(populateHTML);
			$('#searchView .rowOrient').html(`<div class="col-xs-1 card topborder">
				<div class="titlebox">
					<h3 class="cardHeaders">${data.Title}</h3>
				</div>
				<p>${data.Year}</p>
				<div class="imageBlock">
					<img class="imageStyle"src="${data.Poster}">
				</div>
				<div class="actorbox">
					<h4 class="cardHeaders">${data.Actors}</h4>
				</div>
				<div class="plot">
					${data.Plot}
				</div>
				<div id="plot"> 
					${data.Plot}
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
			`)
		$('button.add').click(addMovie);
		$('button.remove').click(removeMovie);

	})
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

$('.btn').click(searchMovie);

// $('.save').click(saveNewUser);
