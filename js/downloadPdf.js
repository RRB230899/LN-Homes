import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-database.js";
import { db } from "./feedback.js";

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
initializeApp(firebaseConfig);

//get the IP for country input
function getIp(callback) {
    fetch('https://ipinfo.io/json?token=eb39f399f1b912', { headers: { 'Accept': 'application/json' }})
      .then((resp) => resp.json())
      .catch(() => {
        return {
          country: 'us',
        };
      })
      .then((resp) => callback(resp.country));
   }

document.getElementById("sendCode").addEventListener('click', phoneAuth);
document.getElementById("verifyCode").addEventListener('click', codeVerify);

const auth = getAuth();
//invisible recaptcha
window.recaptchaVerifier = new RecaptchaVerifier('sendCode', {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log(response);
      onSignInSubmit();
    }
  }, auth);

const phoneInputField = document.querySelector("#phoneNumber");
//int-tel-input phone Number based on current location
const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: getIp,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
  });

function DownloadFile(fileName) {
    //Set the File URL.

    var url = "images/" + fileName;

    //Create XMLHTTP Request.
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.onload = function () {
        //Convert the Byte Data to BLOB object.
        var blob = new Blob([req.response], { type: "application/octetstream" });

        //Check the Browser type and download the File.
        var isIE = false || !!document.documentMode;
        if (isIE) {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            var url = window.URL || window.webkitURL;
            var link = url.createObjectURL(blob);
            var a = document.createElement("a");
            a.setAttribute("download", fileName);
            a.setAttribute("href", link);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    req.send();
};

function phoneAuth() {

    var phoneNumber = phoneInput.getNumber();
    var appVerifier = window.recaptchaVerifier;
    var auth = getAuth();
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      alert("Code sent successfully");
      saveDummyPhoneNo(phoneNumber, 'success');
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
      saveDummyPhoneNo(phoneNumber, 'fail')
      document.getElementById('phoneNumber').value = '';
      console.log(error)
      alert(error)
    });
}

function codeVerify() {
    var code = getCodeFromUserInput();
    var phNo = document.getElementById('phoneNumber').value;
    confirmationResult.confirm(code).then(() => {
    // User signed in successfully.
    document.getElementById('phoneNumber').value = '';
    document.getElementById('verificationCode').value = '';
    alert("Code validated")
    DownloadFile('LN Homes Brochure .pdf')
    $('#login-modal').modal('hide');
    saveVerificationDetails(phNo);
    // ...
    }).catch((error) => {
    // User couldn't sign in (bad verification code?)
    // ...
    code = '';
    alert(error)
    });

}

function getCodeFromUserInput() {
    return document.getElementById('verificationCode').value;
}

function saveVerificationDetails(phNo) {
    var phoneData = {
        phoneNumber: phNo
    }
    var updates = {};
    updates['/Brochure/' + phNo] = phoneData;

    return update(ref(db), updates)
}

function saveDummyPhoneNo(phNo, flag) {
    var phoneData = {
        phoneNumber: phNo
    }
    var updates = {};
    updates['/Dummy/' + phNo + '' + flag] = phoneData;

    return update(ref(db), updates)
}