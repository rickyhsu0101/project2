import { headerInit } from '../general/header.js';

import '../../css/style.css';
import '../../css/login.css';

$(document).ready(function() {
  headerInit();

  /* 
  ========================================================
     Validation 
  ========================================================
  */

  // Note : We are using ES6 for this project
  //Once the submit button is pressed, test for length of password.  //Require minimum of 8 characters
  //One must be upper
  //One must be lowere
  //One must be a number
  //One must be a characters within the set (!@#$%^*()) -Not we are not //allowing quotes -- Had a bad experience with IIS

  $('#btnSignIn').on('click', function(e) {
    // Prevent event handler (e) from attempting to post
    // This may override materialize validation... need to validate
    //  behavior of user name
    e.preventDefault();
    $('#password').text('');
    $('#username').text('');

    var iEmail = $('#username').val();

    emailValidation = ValidateEmail(iEmail);
    if (emailValidation != true) {
      var errorText = 'You have entered an invalid email address!';
      $('#emailValidation').html(errorText);
      return;
    }

    iPassword = $('#password').val();

    passValidation = iPassword.length < 8 ? false : true;
    numValidation = hasNumeric(iPassword);
    upperValidation = hasUpperCase(iPassword);
    lowerValidation = hasLowerCase(iPassword);
    specValidation = hasSpecialChar(iPassword);

    if (
      passValidation &&
      numValidation &&
      upperValidation &&
      lowerValidation &&
      specValidation
    ) {
      // All Validations Passed
    } else {
      // Display message to user
      var errorText = '';
      if (!passValidation) {
        var errorText = 'The minimum password length is 8 characters';
      }
      if (!numValidation) {
        errorText +=
          '<br/>At least one character in the password has to be numeric';
      }
      if (!upperValidation) {
        errorText += '<br/>Pasword must contain one upper case character';
      }
      if (!lowerValidation) {
        errorText += '<br/>Pasword must contain one lower case character';
      }

      if (!specValidation) {
        errorText +=
          '<br/>Pasword must contain one special character (!@#$%^&*()?';
      }

      $('#passwordValidation').html(errorText);

      return;
    } // End Password Validation

    //
  });
});

// Helper Functions

var hasNumeric = inputStr => {
  for (var i = 0; i < inputStr.length; i++) {
    if (Number.isInteger(parseInt(inputStr[i]))) {
      return true;
    }
  }
  return false;
};

var hasUpperCase = inputStr => {
  for (var i = 0; i < inputStr.length; i++) {
    if (inputStr[i] === inputStr[i].toUpperCase()) {
      return true;
    }
  }
  return false;
};

var hasLowerCase = inputStr => {
  for (var i = 0; i < inputStr.length; i++) {
    if (inputStr[i] === inputStr[i].toLowerCase()) {
      return true;
    }
  }
  return false;
};

var hasSpecialChar = inputStr => {
  var specialChar = ['~', '!', '#', '$', '%', , '^', '&', '*', '(', ')', '?'];
  for (var i = 0; i < inputStr.length; i++) {
    if (specialChar.indexOf(inputStr[i]) != -1) {
      return true;
    }
  }
  return false;
};

// Email validation... test for inclusion of @ sign
// last end of string must contain .com, .io etc
//function ValidateEmail(mail)
var ValidateEmail = inputStr => {
  //https://www.w3resource.com/javascript/form/email-validation.php
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputStr)) {
    return true;
  }

  return false;
};
