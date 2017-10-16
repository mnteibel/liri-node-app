//Twitter and Spotify Keys
var keys = require("./keys.js")

//npm Dependencies
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")
var request = require("request");
var fs = require("fs");

//Determine what function to run
var command = process.argv[2]

//Global user input variables
var twitterName = "";
var songName = "";
var movieName = "";


//Display tweets function
function tweets(){
	
	var client = new Twitter(keys.twitterKeys)

	//User input twitter account
	var twitterName = process.argv[3]

	//No input use ax_eibel twitter account
	if (twitterName === ""){
		twitterName = "ax_eibel"
	}

	var params = {screen_name: twitterName};

	console.log(" ")

	console.log(twitterName + " 2 most recent tweets")

	console.log(" ")
	
	//Gets 2 recent tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error){

			for(i = 0; i < 2; i++) {
				console.log(tweets[i].created_at + " " + tweets[i].text)
				console.log(" ")
			}
		
		}

	})
}

//Display music function
function spotify(){

	var spotify = new Spotify(keys.spotifyKeys)

	//Gets all the words input for song
	var nodeArgs = process.argv;

	for (var i = 3; i < nodeArgs.length; i++) {

		if (i > 3 && i < nodeArgs.length) {

			songName = songName + "+" + nodeArgs[i];

		} else {

			songName += nodeArgs[i];

		}
	}

	//No input song choice
	if (songName === "") {
		songName = "The Sign Ace Of Base"
	}

	//Retrieves song information
	spotify.search({ type: "track", query: songName, limit: 1 }, function(error, response) {

		console.log(" ")
		console.log("Artist: " + response.tracks.items[0].album.artists[0].name);
		console.log("Song: " + response.tracks.items[0].name) 
		console.log("Spotify Link: " + response.tracks.items[0].album.external_urls.spotify)
		console.log("Album: " + response.tracks.items[0].album.name)
		console.log(" ")

	});
}

//Display movie informatin function
function imdb(){
	
	//Gets all words in input
	var nodeArgs = process.argv;

	for (var i = 3; i < nodeArgs.length; i++) {

		if (i > 3 && i < nodeArgs.length) {

			movieName = movieName + "+" + nodeArgs[i];

		} else {

			movieName += nodeArgs[i];

		}
	}

	//No input movie search
	if (movieName === "") {
		movieName = "Mr.Nobody"
	}

	//Retrieves information and displays about movie
	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

		console.log(" ")
		console.log("Movie: " + JSON.parse(body).Title)
		console.log("Year: " + JSON.parse(body).Year)
		console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
		console.log("Rotton Tomatos Rating: " + JSON.parse(body).Ratings[1].Value)
		console.log("Countries Produced In: " + JSON.parse(body).Country)
		console.log("Languages: " + JSON.parse(body).Language)
		console.log("Plot: " + JSON.parse(body).Plot)
		console.log("Actors: " + JSON.parse(body).Actors)
  		console.log(" ")
  	})

}

//Takes random.txt and starts function
function doWhatItSays() {
	
	//Gets data from random.text file
	fs.readFile("random.txt", "utf8", function(error, data) {
		
		var data = data
		var dataArr = data.split(",")

		//Determines what function to use
		if (dataArr[0] === "my-tweets") {
			tweets();
		}

		else if (dataArr[0] === "spotify-this-song") {
			songName = dataArr[1]
			spotify();
		}
		else if (dataArr[0] === "movie-this") {
			movieName = dataArr[1]
			imdb();
		}

	})
}

//Takes in user input to find out what function to run
if (command === "my-tweets"){
	tweets();
}
else if (command === "spotify-this-song") {
	spotify();
}
else if (command === "movie-this"){
	imdb();
}
else if (command === "do-what-it-says"){
	doWhatItSays();
}
