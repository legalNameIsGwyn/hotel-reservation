var inputField = document.getElementById("first_name");
inputField.addEventListener("keydown", function (event) {
    // If the key pressed is a digit (0-9), prevent it from being added to the input field
    if (event.key >= 0 && event.key <= 9) {
        event.preventDefault();
    }
    // If the key pressed is not a letter or a special character, prevent it from being added to the input field
    if (!/[a-zA-Z@#$%&*()_+=\-\/\\[\]{}|~`'":;<>,.?]/.test(event.key)) {
        event.preventDefault();
    }
});

inputField = document.getElementById("last_name");
inputField.addEventListener("keydown", function (event) {
    if (event.key >= 0 && event.key <= 9) {
        event.preventDefault();
    }

    if (!/[a-zA-Z@#$%&*()_+=\-\/\\[\]{}|~`'":;<>,.?]/.test(event.key)) {
        event.preventDefault();
    }
});
var checkin = document.getElementById("checkin");
var today = new Date().toISOString().split('T')[0]; // Get today's date in ISO format
checkin.setAttribute('min', today); // Set the minimum date to today