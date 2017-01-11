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
	$('#searchView').hide();
	$('#homeBody').show();

	// populatePage();
});

$('.myMovie').click(function(e) {
	$('#homeBody').hide();
	$('#searchView').hide();
	$('#myMovies').show();
});
/***************************************************
				GLOBAL VARIABLES
****************************************************/
var p;
var moviesAdded = [];
var data;

/***************************************************
	CALLING INITIAL SHOW MOVIES FUNCTION
****************************************************/

populatePage();

/***************************************************
	FUNCTION FOR INITIALLY SHOWING MOVIES
****************************************************/

function populatePage() {
	var populateHTML = '';
	// resetMoviesPage();
		$.ajax({
			  url: 'https://initial-movies.firebaseio.com/.json'
			}).done(function (data) {
		for (var i = 0; i < 8; i++) {
  			 populateHTML += `
				 <div class="col-xs-1 card topborder">
				<div class="titlebox">
					<h3>${data[i].Title}</h3>
				</div>
				<p>${data[i].Year}</p>
				<div class="imageBlock">
					<img class="imageStyle"src="${data[i].Poster}">
				</div>
				<div class="actorbox">
					<h4>${data[i].Actors}</h4>
				</div>
				<div id="plot">
					${data[i].Plot}
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
						<button class="btn btn-primary">add</button class="btn btn-primary">
					</div>
					<div class="deleteButton">
						<button class="btn btn-primary">delete</button class="btn btn-primary">
					</div>
				</div>
			</div>
			<script src="https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js"></script>
			`;
  		}
  		$('.rowOrient').html(populateHTML);
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
	var movieTitle = $('.input-sm').val();
	p = new Promise(function(resolve,reject) {
		$.ajax({
			url: 'http://www.omdbapi.com/?t=' + movieTitle + '&y=&plot=short&r=json'
		}).done(function(data) {
			resolve(data)
		})
	});
	p.then(function(val) {
		data = val;
		// $('.example').barrating('set', Math.round(data.imdbRating));
	}).then(function() {
				$('.rowOrient').html(`<div class="col-xs-1 card topborder">
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
						<button class="btn btn-primary">add</button class="btn btn-primary">
					</div>
					<div class="deleteButton">
						<button class="btn btn-primary">delete</button class="btn btn-primary">
					</div>
				</div>
			</div>
			`)

		console.log(data)
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

$('.add').click(addMovie);

$('.remove').click(removeMovie);

// $('.sign-in').click(getUserInfo);

$('.btn').click(searchMovie);

// $('.save').click(saveNewUser);
