// List of REST API URI
CAU = "https://prod-50.northeurope.logic.azure.com/workflows/51b1776422f74a3bace20c383a21302c/triggers/manual/paths/invoke/rest/mp/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lVYOSPuuHNM7_YIFnd1bvi1rKFVGWJSnJ3eCmQ61JWs"

RAU = "https://prod-20.northeurope.logic.azure.com/workflows/81226efddff74b35aa68d1a08948432d/triggers/manual/paths/invoke/rest/mp/usercheck?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ePraN_GaAgKX8QgziBc8gdShUrkqccSy94IiBNc2vJE"

CLU = "https://prod-33.northeurope.logic.azure.com/workflows/03405edc249b4f49a9ea6f2fe051d1fe/triggers/manual/paths/invoke/rest/mp/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=q36lnlz3YsGid82M6XtVvvIBfX2lFSBo3K1tM6HvTwo"

CUR = "https://prod-23.northeurope.logic.azure.com/workflows/954063f9176d46d782ac572df236b8a9/triggers/manual/paths/invoke/rest/mp/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lY9saNXPzlvPd8Plht7uQ8_NZ0T71lX-KmP_gJSn4FE"

MUPS = "https://prod-11.northeurope.logic.azure.com/workflows/fa52c681a54647059bb287f6570edd9d/triggers/manual/paths/invoke/rest/mp/movieupload?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=yznuC70r5cjTqX2-u_Sh2IgLupJmw13uVZZQhkLbEnI"//Movie Upload Service

RAM = "https://prod-28.northeurope.logic.azure.com/workflows/219bf55f89d941b0a154d25928d7b90f/triggers/manual/paths/invoke/rest/mp/getmovies?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=px9vG5A_OsTLo8VkzNO73T1OtQuAuZPbmlS5nRf2MGI" //Retrieve all Movies

DIMURI0= "https://prod-36.northeurope.logic.azure.com/workflows/226b2b5288264308bd77b85ebeba7956/triggers/manual/paths/invoke/rest/mp/deletemovie/" //Delete an individual Movie & its metaData (baseURI)

DIMURI1= "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=UA-6CK7faJ2EfRwATvnk7o--sSv9y3Qby_jQsxRlS8Y" //Delete an individual Movie & its metaData (tailURI)

BLOB_ACCOUNT = "https://mooviemadnessblob.blob.core.windows.net"

//-- END of URI's --// 

//Handlers for button clicks
$(document).ready(function() {

	var authUserName;
	var authUserRole;

	//Handler for the registration button
	$("#registerSubmit").click(function(e) {
		e.preventDefault();
		//Execute the submit new asset function
		submitNewUser();
	});

	//Handler for the login button
	$("#loginSubmit").click(function(e) {
		e.preventDefault();
		//Execute the userlogin
		attemptLogin();
	});
    
        $("#getAllMovies").click(function(){
        //Run the get asset list function
         getAllMovies();
    }); 
    

     $("#getUserMovies").click(function(){
        //Run the get asset list function
         getUserMovies();
    }); 
    
    
   //Handler for the new asset submission button
    $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewMovie();
    
  }); 
    
});  //end of document.ready


	//A function to submit a new asset to the REST endpoint //
	function submitNewUser() {

		//Construct JSON Object for new item
		var subObj = {
			firstName: $('#firstName').val(),
			surName: $('#surName').val(),
			reguserName: $('#reguserName').val(),
			regPasswordHash: $('#regPasswordHash').val(),
			Email: $('#Email').val()

		};

		//Convert to a JSON String
		subObj = JSON.stringify(subObj);

		//Post the JSON string to the endpoint, note the need to set the content type header
		$.post({
				url: CAU,
				data: subObj,
				contentType: 'application/json; charset=utf-8'
			}).done(function(response) {
				// Add a success message 
				$('#successMessage').text('Successfully registered for Movie Madness. Please login now.');

				// Redirect to the index page after a brief delay (e.g., 2000 milliseconds or 2 seconds)
				setTimeout(function() {
					window.location.href = 'index.html';
				}, 2000);
			})
			.fail(function(error) {
				// Assuming you have a message element with an ID 'errorMessage'
				$('#errorMessage').text('Failed to register. Please try again.');
			});
	} // END of function submitNewUser() //




	//A function to submit a new asset to the REST endpoint //
	function attemptLogin() {

		//Construct JSON Object for new item
		var requestData = {
			userName: $('#userName').val(),
			PasswordHash: $('#PasswordHash').val()
		};

		// Make a POST request to CLU
		$.ajax({
			url: CLU,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(requestData),
			success: function(response) {

				var isExistsValue = response.ResultSets.Table1[0].isExists;

				// Example: Redirect based on 'isExists' value
				if (isExistsValue === 1) {

					//Here the user is authenticated, we should then call a second API 'Check User Role' to get their role from the database.  Based on the returned role, direct to the correct html page.
					//-----------------------------------------code here---------------------------------------------------------//

					// Make a POST request to CLU
					$.ajax({
						url: CUR,
						method: 'POST',
						contentType: 'application/json',
						data: JSON.stringify(requestData),
						success: function(responseCUR) {

							var userRole = responseCUR.ResultSets.Table1[0].userRole;

							authUserName = requestData.userName;
							authUserRole = userRole;


							if (userRole === 'adminUser') {

								sessionStorage.setItem('userName', authUserName);
								sessionStorage.setItem('userRole', authUserRole);

								window.location.href = 'adminMain.html';

							} else {

								sessionStorage.setItem('userName', authUserName);
								sessionStorage.setItem('userRole', authUserRole);

								window.location.href = 'generalMain.html';
							}
						}
					});

					//-----------------------------------------code here---------------------------------------------------------//

				} else if (isExistsValue === 0) {
					$('#errorMessage1').text('Failed to login. Please try again.');
				} else {
					console.log('Unexpected response:', response);
				}
			},
			error: function(xhr, status, error) {
				// Handle errors if necessary
				console.error('Error:', status, error);
			}
		});
	}//End of attemptLogin
    
    //A function to submit a new asset to the REST endpoint 
function submitNewMovie(){
    //Create a form data object
 submitData = new FormData();
 //Get form variables and append them to the form data object
    submitData.append('movieTitle', $('#movieTitle').val());
 submitData.append('movieGenre', $('#movieGenre').val());
 submitData.append('movieCertification', $('#movieCertification').val());
    submitData.append('movieLength', $('#movieLength').val());
    submitData.append('movieComments', $('#movieComments').val());
 submitData.append('File', $("#UpFile")[0].files[0]);


 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: MUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){    
     $('#successMessage').text('Successfully added your movie.');      
 } 
}); //END of submitNewMovie Function
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getAllMovies(){$.getJSON(RAM, function (data) {
        // Clear the movieList div
        $('#movieList').empty();

        // Iterate through the returned records and build HTML, incorporating the key values of the record in the data
        $.each(data, function (key, val) {
            // Create video element
            var videoElement = $("<video controls poster='" + BLOB_ACCOUNT + val["filepath"] + "' width='400'/>");

            // Create source element and set its attributes
            var sourceElement = $("<source/>", {
                src: BLOB_ACCOUNT + val["filepath"],
                type: "video/mp4" // adjust the type according to your video format
            });

            // Append source to video and then append video to movieList
            videoElement.append(sourceElement);
            
              // Create delete button
            var deleteButton = $("<button>Delete</button>");
            deleteButton.on("click", function () {
                // Call the deleteMovie function when the delete button is clicked
                deleteMovie(val["id"]);
            });
            
            $('#movieList').append("<hr />");
            $('#movieList').append("Movie: " + val["movieTitle"] + "<br />");
            $('#movieList').append("Age Certification: " + val["movieCertification"] + "<br />");
            $('#movieList').append("Genre: " + val["movieGenre"] + "<br />");
            $('#movieList').append("Run Time (Mins): " + val["movieLength"] + "<br />");
            $('#movieList').append(videoElement);
            $('#movieList').append(deleteButton);
            $('#movieList').append("<hr />");
            
            var documentId = val["id"];

        });
    })
}//END of getAllMovies Function


//A function to delete a movie with a specific ID.
//The id paramater is provided to the function as defined in the relevant onclick handler
function deleteMovie(id){
    $.ajax({
        type: "DELETE",
        //Note the need to concatenate the
        url: DIMURI0 + id + DIMURI1,
    }).done(function( msg ) {
        //On success, update the movieList.
        getAllMovies();
    });
} //END deleteMovie() function


//Get all movies for user.html 
function getUserMovies(){$.getJSON(RAM, function (data) {
        // Clear the movieList div
        $('#userMovieList').empty();

        // Iterate through the returned records and build HTML, incorporating the key values of the record in the data
        $.each(data, function (key, val) {
            // Create video element
            var videoElement = $("<video controls poster='" + BLOB_ACCOUNT + val["filepath"] + "' width='400'/>");

            // Create source element and set its attributes
            var sourceElement = $("<source/>", {
                src: BLOB_ACCOUNT + val["filepath"],
                type: "video/mp4" // adjust the type according to your video format
            });

            // Append source to video and then append video to movieList
            videoElement.append(sourceElement);
            
              // Create delete button
            //var deleteButton = $("<button>Delete</button>");
            //deleteButton.on("click", function () {
                // Call the deleteMovie function when the delete button is clicked
              //  deleteMovie(val["id"]);
         //   });
            
            $('#userMovieList').append("<hr />");
            $('#userMovieList').append("Movie: " + val["movieTitle"] + "<br />");
            $('#userMovieList').append("Age Certification: " + val["movieCertification"] + "<br />");
            $('#userMovieList').append("Genre: " + val["movieGenre"] + "<br />");
            $('#userMovieList').append("Run Time (Mins): " + val["movieLength"] + "<br />");
            $('#userMovieList').append(videoElement);
            $('#userMovieList').append("<hr />");
            
            var documentId = val["id"];

        });
    });
}//END of getAllMovies Function