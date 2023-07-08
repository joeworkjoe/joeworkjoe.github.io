var phoneNumbers = []; // Array to store added phone numbers
var errorMessageTimeout; // Variable to hold the error message timeout

document.getElementById('phone-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var phoneNumber = document.getElementById('phone-input').value;

  // Input validation: Check if the phone number is empty
  if (phoneNumber.trim() === '') {
    displayErrorMessage("Please enter your phone number.");
    return; // Exit the function if validation fails
  }

  // Input validation: Check if the phone number is in the correct format
  if (!/^\d{9,18}$/.test(phoneNumber)) {
    displayErrorMessage("Invalid phone number format.");
    return; // Exit the function if validation fails
  }

  // Check if the phone number has already been added
  if (phoneNumbers.includes(phoneNumber)) {
    displayErrorMessage("Phone number already added.");
    return; // Exit the function if the number is already added
  }

  fetch('https://aidademo.apliclouds.com/AIDA_API/API/assistant/addScheduled?identifier=' + phoneNumber + '&journeyId=1686559274519&journeyName=AVC_1&date=' + getDateAndTime(), {
    method: 'POST',
    headers: {
      'token': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MjE5ODBjYS1kNzUxLTQ4ZDgtYTRjMS0yMWI5N2UyOTZmY2EiLCJzdWIiOiJzeXN1c2VyQGFwbGltYW4uY29tIiwiaWF0IjoxNjI0MDAwNTE0LCJleHAiOjg4MDIzOTU3MzE0fQ.vviuftdd5NynBvt3i-yyTsSxlBAfxqJevvwxUs6Ow3mSGdYCOuH5-mfIK3RC4f8ZhiMzPBOVEbYFLLVA-E_4uQ',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      // Add any additional data you want to send in the request body
    })
  })
    .then(response => response.json())
    .then(data => {
      // Process the response data as needed
      console.log(data); 
      if (data.code === 26002) {
        displayErrorMessage("Phone number already added.");
      } else {
        displayPopup("Success", "Phone number submitted successfully!");
        phoneNumbers.push(phoneNumber); // Add the phone number to the array
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error(error);  
      displayPopup("Error", "An error occurred while submitting the phone number.");
    });
});

function getDateAndTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = String(now.getMonth() + 1).padStart(2, '0');
  var day = String(now.getDate()).padStart(2, '0');
  var hour = String(now.getHours()).padStart(2, '0');
  var minute = String(now.getMinutes()).padStart(2, '0');
  var second = String(now.getSeconds()).padStart(2, '0');
  
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
}

function displayPopup(title, message) {
  document.getElementById("popup-message").textContent = title + ": " + message;
  document.getElementById("overlay").style.display = "block";
  setTimeout(hidePopup, 5000); // Hide the popup after 5 seconds (5000 milliseconds)
}

function hidePopup() {
  document.getElementById("overlay").style.display = "none";
}

function displayErrorMessage(message) {
  var errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  clearTimeout(errorMessageTimeout); // Clear the previous timeout if it exists
  errorMessageTimeout = setTimeout(function() {
    errorMessage.style.opacity = 0; // Fade out the error message
    setTimeout(function() {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
      errorMessage.style.opacity = 1;
    }, 500); // Remove the error message after 0.5 seconds
  }, 10000); // Display the error message for 10 seconds (10000 milliseconds)
}

function hideErrorMessage() {
  var errorMessage = document.getElementById("error-message");
  clearTimeout(errorMessageTimeout); // Clear the previous timeout if it exists
  errorMessage.style.display = "none";
}

document.getElementById("phone-input").addEventListener("input", function() {
  hideErrorMessage();
});
