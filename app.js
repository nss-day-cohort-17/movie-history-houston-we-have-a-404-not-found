
/***************************************************
				GLOBAL VARIABLES
****************************************************/
var p;
var moviesAdded = [];
var data;

/***************************************************
	CALLING INITIAL SHOW MOVIES FUNCTION
****************************************************/

			// populatePage();

/***************************************************
	FUNCTION FOR INITIALLY SHOWING MOVIES
****************************************************/

// function populatePage() {
// 	for (var i = 0; i < 9; i++) {
// 		$.ajax({
// 			  "async": true,
// 			  "crossDomain": true,
// 			  "url": "https://random-movie.herokuapp.com/random",
// 			  "method": "GET",
// 			  "headers": {
// 			    "content-type": "application/json",
// 			    "cache-control": "no-cache",
// 			    "postman-token": "023e7134-4214-88e4-4f81-f1c8578e668e"
// 			  },
// 			  "data": "{\n\t\"username\" : \"lukeschuyler\"\n}\n",
// 			  "processData": false,
// 			}).done(function (random) {
//   			console.log(random);
// 		});
// 	}
// }

/***************************************************
		FUNCTIONS FOR STORING USER INFO
****************************************************/

function saveNewUser() {
	var user = {};
	var userName = $('.input').val();
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

function getUserInfo() {
	var userInput = $('.input').val();
	var myMoviesHTML = ''
	$.ajax({
		type: 'GET',
		url: 'https://user-enter-luke.firebaseio.com/users/' + userInput + '.json',
		success: function(response) {
			for (var i = 0; i < response.movies.length; i++) {
				if (moviesAdded.includes(response.movies[i]) === false) {
					moviesAdded.push(response.movies[i]);
					myMoviesHTML += `<img class="animated rotateInDownLeft" src="${moviesAdded[i].Poster}">`;
					console.log(moviesAdded)
				}
			}
			$("#area").html(myMoviesHTML);
		}
	});
}

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
		$('#area').html(`<img class="animated rotateInDownLeft" src="${val.Poster}">`)
		console.log(data)
	}).then(function() {
		$('select').barrating('set', Math.round(data.imdbRating));
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

$('.add').click(addMovie);

$('.remove').click(removeMovie);

$('.sign-in').click(getUserInfo);

$('.btn').click(searchMovie);

$('.save').click(saveNewUser);
