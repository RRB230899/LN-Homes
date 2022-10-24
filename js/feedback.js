import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getDatabase, ref, child, push, update } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
// CDN URL instead of "firebase/database"
const firebaseConfig = {
    apiKey: "AIzaSyBffN9skEGptPDWDA9Gke6fToDJxzngqis",
    authDomain: "lninfra-11901.firebaseapp.com",
    databaseURL: "https://lninfra-11901-default-rtdb.firebaseio.com",
    projectId: "lninfra-11901",
    storageBucket: "lninfra-11901.appspot.com",
    messagingSenderId: "61258181227",
    appId: "1:61258181227:web:076d1c020f02cb6a9c1f2e",
    measurementId: "G-YLCJ9ER010"
  };
const config = initializeApp(firebaseConfig);

//Reference message collections
export const db = getDatabase(config);

//Listen for form submit
document.getElementById("send").addEventListener('click', sendFeedback);

//Get user input
function getUserInput(id) {
    return document.getElementById(id).value;
}

function sendFeedback(event) {
    event.preventDefault();

    var first_name = getUserInput('first_name');
    var last_name = getUserInput('last_name');
    var email = getUserInput('email');
    var contact = getUserInput('contact');
    var feedback = getUserInput('feedback');

    console.log(contact.toString().length)

    //Show alert and save feedback
    if(first_name && last_name && contact && validatePhoneNumber(contact.toString())){
    
    saveFeedback(first_name, last_name, email, contact, feedback);
    resetErrorMsg();
    document.querySelector(".alert").style.display = 'block';

    //Hide alert
    setTimeout(function()
    {
        document.querySelector(".alert").style.display = 'none';  
    }, 5000);

    //Clear form
    document.getElementById("contact_us").reset();
}

    else {

        resetErrorMsg();

        //Empty first name
        if (first_name === '' || first_name === null) {
            resetErrorMsg();
            document.getElementById("f-error-msg").innerHTML = 'Had your say? Nope!';
            document.getElementById("f-error-msg").style.display = 'block';
            document.getElementById("first_name").focus();
            return false;
        }

        //Empty last name
        if (last_name === '' || last_name === null) {
            resetErrorMsg();
            document.getElementById("l-error-msg").innerHTML = 'Need your last name too.';
            document.getElementById("l-error-msg").style.display = 'block';
            document.getElementById("last_name").focus();
            return false;
        }

        //Empty contact no.
        if (contact === '' || contact === null) {
            resetErrorMsg();
            document.getElementById("c-error-msg").innerHTML = 'Best means to reach out. Right?';
            document.getElementById("c-error-msg").style.display = 'block';
            document.getElementById("contact").focus();
            return false;
        }
        
        //validating ph. no.
        if (contact.toString().length !== 10){
            resetErrorMsg();
            validatePhoneNumber(contact.toString())
            document.getElementById("c-error-msg").innerHTML = 'Tricky. Seems fishy!';
            document.getElementById("c-error-msg").style.display = 'block';
            document.getElementById("contact").focus();
            document.getElementById("contact").value = '';
        }
    }
}

function validatePhoneNumber(input_str) {
    //accepted formats (123)-(456)-(7890)
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  
    return re.test(input_str);
  }

function resetErrorMsg(){
    //set error elements' display to none 
    document.getElementById("f-error-msg").style.display = 'none';
    document.getElementById("l-error-msg").style.display = 'none';
    document.getElementById("c-error-msg").style.display = 'none';
}


//Save feedback to firebase
function saveFeedback(fname, lname, email, contact, feedback) {
    const postData = {
        'First Name': fname,
        'Last Name': lname,
        'Email': email,
        'Contact No': contact,
        'Feedback': feedback 
    };

    const newPostKey = push(child(ref(db), 'Feedbacks')).key;

    const updates = {};
    updates['/Feedback/' + fname + ' ' + lname + newPostKey] = postData;

    return update(ref(db), updates)
}