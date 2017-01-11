
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

function populatePage() {
	for (var i = 0; i < 9; i++) {
		$.ajax({
			  "async": true,
			  "crossDomain": true,
			  "url": "https://random-movie.herokuapp.com/random",
			  "method": "GET",
			  "headers": {
			    "content-type": "application/json",
			    "cache-control": "no-cache",
			    "postman-token": "023e7134-4214-88e4-4f81-f1c8578e668e"
			  },
			  "data": "{\n\t\"username\" : \"lukeschuyler\"\n}\n",
			  "processData": false,
			}).done(function (random) {
  			console.log(random);
		});
	}
}

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
			type: 'PATCH',
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
				console.log(response)
				for (var i = 0; i < response.movies.length; i++) {
					myMoviesHTML += `<img class="animated rotateInDownLeft" src="${response.movies[i].Poster}">`
				}
				$("#area").html(myMoviesHTML)
			}
		});
}

/***************************************************
	FUNCTIONS FOR MOVIES (ADD/SEARCH/DELETE) 
****************************************************/

function addMovie() {
	moviesAdded.push(data);
	console.log(moviesAdded);
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
		$('h2').html(`<img src="${val.Poster}">`)
	}).then(function() {
		console.log(data)
		$('select').barrating('set', Math.round(data.imdbRating) / 2);
	})
}

/*******************************************
		JQUERY STAR RATING CODE 
********************************************/

$('#example').barrating('show', {
  theme: 'my-awesome-theme',
  onSelect: function(value, text, event) {
    if (typeof(event) !== 'undefined') {
      $('select').barrating('set', data.rating);
    } else {
		$('select').barrating('set', data.rating);
    }
  }
});

/*******************************************
			EVENT LISTENERS 
********************************************/

$('.sign-in').click(getUserInfo)

$('.btn').click(searchMovie)

$('.save').click(saveNewUser)

$('.add').click(addMovie)
