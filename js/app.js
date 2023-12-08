// List of REST API URI
CAU = "https://prod-50.northeurope.logic.azure.com/workflows/51b1776422f74a3bace20c383a21302c/triggers/manual/paths/invoke/rest/mp/user?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lVYOSPuuHNM7_YIFnd1bvi1rKFVGWJSnJ3eCmQ61JWs"

RAU = "https://prod-20.northeurope.logic.azure.com/workflows/81226efddff74b35aa68d1a08948432d/triggers/manual/paths/invoke/rest/mp/usercheck?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ePraN_GaAgKX8QgziBc8gdShUrkqccSy94IiBNc2vJE"

CLU = "https://prod-33.northeurope.logic.azure.com/workflows/03405edc249b4f49a9ea6f2fe051d1fe/triggers/manual/paths/invoke/rest/mp/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=q36lnlz3YsGid82M6XtVvvIBfX2lFSBo3K1tM6HvTwo"

CUR = "https://prod-23.northeurope.logic.azure.com/workflows/954063f9176d46d782ac572df236b8a9/triggers/manual/paths/invoke/rest/mp/login?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lY9saNXPzlvPd8Plht7uQ8_NZ0T71lX-KmP_gJSn4FE"

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
	}
}); //end of document.ready
